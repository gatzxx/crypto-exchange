import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ExchangeStore, exchangeStore } from '@/stores/ExchangeStore/exchangeStore'
import { LOCAL_STORAGE_EXCHANGE_KEY } from '@/constants/settings'

vi.mock('@/api/conversion')
vi.mock('@/stores', () => ({
    coinsStore: {
        coins: [
            { id: 1, symbol: 'BTC', name: 'Bitcoin' },
            { id: 2, symbol: 'ETH', name: 'Ethereum' },
        ],
        getCoinIdBySymbol: vi.fn().mockImplementation((symbol: string) => {
            switch (symbol) {
                case 'BTC':
                    return 1
                case 'ETH':
                    return 2
                default:
                    return null
            }
        }),
        fetchCoins: vi.fn(),
    },
}))

describe('ExchangeStore', () => {
    let store: typeof exchangeStore

    beforeEach(() => {
        store = exchangeStore
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
        localStorage.clear()
    })

    describe('Initialization', () => {
        it('should initialize with default values', () => {
            expect(store.fromCurrency).toBe('')
            expect(store.toCurrency).toBe('')
            expect(store.amount).toBe(1)
            expect(store.result).toBe(1)
            expect(store.loading).toBe(false)
            expect(store.error).toBeNull()
        })

        it('should load state from localStorage if available', () => {
            const mockState = {
                fromCurrency: 'BTC',
                toCurrency: 'ETH',
                amount: 2,
                result: 50000,
            }
            localStorage.setItem(LOCAL_STORAGE_EXCHANGE_KEY, JSON.stringify(mockState))

            const newStore = new ExchangeStore()
            expect(newStore.fromCurrency).toBe('BTC')
            expect(newStore.toCurrency).toBe('ETH')
            expect(newStore.amount).toBe(2)
            expect(newStore.result).toBe(50000)
        })
    })

    describe('fetchConversion', () => {
        it('should return result of 1 if fromCurrency is the same as toCurrency', async () => {
            store.fromCurrency = 'BTC'
            store.toCurrency = 'BTC'
            await store.fetchConversion()
            expect(store.result).toBe(1)
        })

        it('should set error if currencies are invalid', async () => {
            store.fromCurrency = 'BTC'
            store.toCurrency = 'XYZ'
            await store.fetchConversion()
            expect(store.error).toBe('Некорректные валюты')
        })
    })

    describe('setAmount', () => {
        it('should update amount correctly when input is valid', () => {
            store.setAmount(2)
            expect(store.amount).toBe(2)
        })

        it('should update amount based on conversion rate when "to" currency is input', () => {
            store.result = 50000
            store.setAmount(100, false, 'to')
            expect(store.amount).toBe(0.002)
        })
    })

    describe('swapCurrencies', () => {
        it('should swap fromCurrency and toCurrency', async () => {
            store.fromCurrency = 'BTC'
            store.toCurrency = 'ETH'
            await store.swapCurrencies()
            expect(store.fromCurrency).toBe('ETH')
            expect(store.toCurrency).toBe('BTC')
        })
    })
})
