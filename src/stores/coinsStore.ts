import { makeAutoObservable, runInAction } from 'mobx'

import { exchangeStore } from '@/stores'

import { getCoins } from '@/api/coins'
import { Coin } from '@/api/types'

class CoinsStore {
    coins: Coin[] = []
    loading: boolean = false
    error: string | null = null

    constructor() {
        makeAutoObservable(this)
        this.fetchCoins()
    }

    async fetchCoins() {
        if (this.loading || this.coins.length) return

        this.loading = true
        this.error = null

        try {
            const data = await getCoins()
            runInAction(() => {
                this.coins = data
            })
        } catch (error) {
            runInAction(() => {
                this.error = `Ошибка загрузки: ${error instanceof Error ? error.message : String(error)}`
            })
        } finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }

    getCoinIdBySymbol(symbol: string): string | null {
        return this.coins.find((c) => c.symbol === symbol)?.id?.toString() ?? null
    }

    getFilteredCoins(search: string, type: 'from' | 'to') {
        return this.coins
            .filter((coin) =>
                type === 'from'
                    ? coin.symbol !== exchangeStore.toCurrency
                    : coin.symbol !== exchangeStore.fromCurrency,
            )
            .filter(
                (coin) =>
                    coin.symbol.toLowerCase().includes(search.toLowerCase()) ||
                    coin.name.toLowerCase().includes(search.toLowerCase()),
            )
    }
}

export const coinsStore = new CoinsStore()
