import { useState, useEffect, useMemo } from 'react'

import { coinsStore, exchangeStore } from '@/stores'
import { DEBOUNCE_DELAY, MAX_DECIMALS } from '@/constants/settings'
import { sanitizeCurrencyInput } from '@/utils/sanitizeCurrencyInput'
import { formatDisplayValue } from '@/utils/formatDisplayValue'
import { useDebounce } from '@/hooks/useDebounce'

export const useCurrencyInput = (type: 'from' | 'to') => {
    const {
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

    const { coins } = coinsStore

    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, DEBOUNCE_DELAY)

    const currentCurrency = type === 'from' ? fromCurrency : toCurrency
    const setCurrentCurrency = type === 'from' ? setFromCurrency : setToCurrency

    const localValue = useMemo(() => {
        const displayValue = type === 'from' ? storeAmount : storeAmount * (result || 1)
        return formatDisplayValue(displayValue)
    }, [storeAmount, result, type])

    const handleAmountChange = (value: string) => {
        const sanitizedValue = sanitizeCurrencyInput(value)
        const decimalDigits = sanitizedValue.split('.')[1]?.length || 0
        if (decimalDigits > MAX_DECIMALS) return

        const numericValue = parseFloat(sanitizedValue) || 0
        const baseAmount = type === 'from' ? numericValue : numericValue / (result || 1)

        if (baseAmount !== storeAmount) {
            setAmount(baseAmount)
        }
    }

    const handleCurrencySelect = (symbol: string) => {
        if (symbol !== currentCurrency) {
            setCurrentCurrency(symbol)
            fetchConversion()
        }
        setSearchTerm('')
    }

    useEffect(() => {
        if (!currentCurrency && coins.length) {
            setCurrentCurrency(type === 'from' ? 'BTC' : 'ETH')
        }
    }, [coins, currentCurrency, setCurrentCurrency, type])

    return {
        localValue,
        currentCurrency,
        loading,
        searchTerm,
        handleAmountChange,
        handleCurrencySelect,
        debouncedSearch,
        setSearchTerm,
        coinsEmpty: !coins.length,
    }
}
