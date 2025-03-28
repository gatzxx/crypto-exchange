import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useCurrencyInput } from './useCurrencyInput'
import { exchangeStore } from '@/stores'

vi.mock('@/stores', () => ({
    exchangeStore: {
        result: 1.2,
        loading: false,
        fromCurrency: 'BTC',
        toCurrency: 'ETH',
        amount: 100,
        setAmount: vi.fn(),
        setFromCurrency: vi.fn(),
        setToCurrency: vi.fn(),
        fetchConversion: vi.fn(),
    },
    coinsStore: {
        coins: ['BTC', 'ETH', 'USDT'],
    },
}))

describe('useCurrencyInput hook', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    describe('Initialization', () => {
        it('should initialize with the correct default values', () => {
            const { result } = renderHook(() => useCurrencyInput('from'))

            expect(result.current.localValue).toBe('100')
            expect(result.current.currentCurrency).toBe('BTC')
        })
    })

    describe('Amount Handling', () => {
        it('should update localValue when store amount changes', () => {
            const { result, rerender } = renderHook(() => useCurrencyInput('from'))

            act(() => {
                exchangeStore.amount = 200
                rerender()
            })

            expect(result.current.localValue).toBe('200')
        })

        it('should call setAmount when a new value is entered', () => {
            const { result } = renderHook(() => useCurrencyInput('from'))

            act(() => {
                result.current.handleAmountChange('50')
            })

            expect(exchangeStore.setAmount).toHaveBeenCalledWith(50)
        })

        it('should not update localValue if input exceeds MAX_DECIMALS', () => {
            const { result } = renderHook(() => useCurrencyInput('from'))

            act(() => {
                result.current.handleAmountChange('1.1234567')
            })

            expect(result.current.localValue).not.toBe('1.1234567')
        })
    })

    describe('Currency Selection', () => {
        it('should update the selected currency when a new one is chosen', () => {
            const { result } = renderHook(() => useCurrencyInput('from'))

            act(() => {
                result.current.handleCurrencySelect('USDT')
            })

            expect(exchangeStore.setFromCurrency).toHaveBeenCalledWith('USDT')
            expect(exchangeStore.fetchConversion).toHaveBeenCalled()
        })
    })
})
