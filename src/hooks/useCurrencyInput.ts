import { useState, useEffect, useCallback, useMemo } from 'react'

import { DEBOUNCE_DELAY, MAX_DECIMALS } from '@/constants/settings'
import { sanitizeCurrencyInput } from '@/utils/sanitizeCurrencyInput'
import { formatDisplayValue } from '@/utils/formatDisplayValue'
import { exchangeStore } from '@/stores/exchangeStore'
import { useDebounce } from '@/hooks/useDebounce'

export const useCurrencyInput = (type: 'from' | 'to') => {
    const {
        coins,
        result,
        loading,
        fromCurrency,
        toCurrency,
        amount: storeAmount,
        setAmount,
        setFromCurrency,
        setToCurrency,
        fetchConversion,
    } = exchangeStore

    const [localValue, setLocalValue] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const debouncedSearch = useDebounce(searchTerm, DEBOUNCE_DELAY)
    const currentCurrency = type === 'from' ? fromCurrency : toCurrency
    const setCurrentCurrency = type === 'from' ? setFromCurrency : setToCurrency

    useEffect(() => {
        if (storeAmount < 0) return
        const displayValue = type === 'from' ? storeAmount : storeAmount * (result || 1)
        setLocalValue(formatDisplayValue(displayValue))
    }, [storeAmount, result, type])

    const handleAmountChange = useCallback(
        (value: string) => {
            const sanitizedValue = sanitizeCurrencyInput(value)
            const decimalDigits = sanitizedValue.split('.')[1]?.length || 0

            if (decimalDigits > MAX_DECIMALS) return

            setLocalValue(sanitizedValue)
            const numericValue = parseFloat(sanitizedValue) || 0
            const baseAmount = type === 'from' ? numericValue : numericValue / (result || 1)

            if (numericValue !== storeAmount) {
                setAmount(baseAmount)
            }
        },
        [type, result, setAmount, storeAmount],
    )

    const handleCurrencySelect = useCallback(
        (symbol: string) => {
            if (symbol !== currentCurrency) {
                setCurrentCurrency(symbol)
                fetchConversion()
            }
            setIsDropdownOpen(false)
            setSearchTerm('')
        },
        [currentCurrency, setCurrentCurrency, fetchConversion],
    )

    const filteredCoins = useMemo(() => {
        if (!debouncedSearch) return coins
        const term = debouncedSearch.toLowerCase()
        return coins.filter(
            (coin) =>
                coin.symbol.toLowerCase().includes(term) || coin.name.toLowerCase().includes(term),
        )
    }, [coins, debouncedSearch])

    return {
        localValue,
        currentCurrency,
        loading,
        filteredCoins,
        isDropdownOpen,
        searchTerm,
        handleAmountChange,
        handleCurrencySelect,
        setSearchTerm,
        toggleDropdown: () => setIsDropdownOpen((v) => !v),
        coinsEmpty: !coins.length,
    }
}
