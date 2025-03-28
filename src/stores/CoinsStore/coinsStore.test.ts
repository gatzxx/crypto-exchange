import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { exchangeStore } from '@/stores/ExchangeStore/exchangeStore'
import { CoinsStore } from '@/stores/CoinsStore/coinsStore'
import { getCoins } from '@/api/coins'
import type { Coin } from '@/api/types'

vi.mock('@/api/coins')
vi.mock('@/stores/exchangeStore', () => ({
    exchangeStore: {
        toCurrency: '',
        fromCurrency: '',
    },
}))

const mockCoins: Coin[] = [
    { id: 1, symbol: 'BTC', name: 'Bitcoin' },
    { id: 2, symbol: 'ETH', name: 'Ethereum' },
    { id: 3, symbol: 'USDT', name: 'Tether' },
]

describe('CoinsStore', () => {
    let store: CoinsStore

    beforeEach(() => {
        store = new CoinsStore()
        vi.clearAllMocks()
    })

    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('Initialization', () => {
        it('should automatically call fetchCoins on construction', () => {
            const fetchSpy = vi.spyOn(CoinsStore.prototype, 'fetchCoins')
            new CoinsStore()
            expect(fetchSpy).toHaveBeenCalledOnce()
        })
    })

    describe('fetchCoins', () => {
        it('should not fetch if already loading', async () => {
            store.loading = true
            await store.fetchCoins()
            expect(getCoins).not.toHaveBeenCalled()
        })

        it('should not fetch if coins are already loaded', async () => {
            store.coins = mockCoins
            await store.fetchCoins()
            expect(getCoins).not.toHaveBeenCalled()
        })
    })

    describe('getCoinIdBySymbol', () => {
        beforeEach(() => {
            store.coins = mockCoins
        })

        it('should return coin id as string for existing symbol', () => {
            expect(store.getCoinIdBySymbol('BTC')).toBe('1')
            expect(store.getCoinIdBySymbol('ETH')).toBe('2')
        })

        it('should return null for non-existent symbol', () => {
            expect(store.getCoinIdBySymbol('XYZ')).toBeNull()
        })

        it('should be case-sensitive', () => {
            expect(store.getCoinIdBySymbol('btc')).toBeNull()
        })
    })

    describe('getFilteredCoins', () => {
        beforeEach(() => {
            store.coins = mockCoins
            exchangeStore.toCurrency = ''
            exchangeStore.fromCurrency = ''
        })

        it('should filter coins by symbol', () => {
            const result = store.getFilteredCoins('bt', 'from')
            expect(result).toEqual([mockCoins[0]])
        })

        it('should filter coins by name', () => {
            const result = store.getFilteredCoins('Ethereum', 'from')
            expect(result).toEqual([mockCoins[1]])
        })

        it('should exclude toCurrency when type is "from"', () => {
            exchangeStore.toCurrency = 'BTC'
            const result = store.getFilteredCoins('', 'from')
            expect(result).toEqual([mockCoins[1], mockCoins[2]])
        })

        it('should exclude fromCurrency when type is "to"', () => {
            exchangeStore.fromCurrency = 'ETH'
            const result = store.getFilteredCoins('', 'to')
            expect(result).toEqual([mockCoins[0], mockCoins[2]])
        })

        it('should return empty array when no matches found', () => {
            const result = store.getFilteredCoins('XYZ', 'from')
            expect(result).toEqual([])
        })

        it('should be case-insensitive', () => {
            const result = store.getFilteredCoins('bit', 'from')
            expect(result).toEqual([mockCoins[0]])
        })
    })
})
