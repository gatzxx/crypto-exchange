import { action, makeAutoObservable, runInAction } from 'mobx'

import { EXCHANGE_CACHE_TTL, LOCAL_STORAGE_EXCHANGE_KEY } from '@/constants/settings'
import { getConversionRate } from '@/api/conversion'
import { getCoins } from '@/api/coins'
import { Coin } from '@/api/types'

class ExchangeStore {
    coins: Coin[] = []
    fromCurrency: string = ''
    toCurrency: string = ''
    amount: number = 1
    result: number = 1
    loading: boolean = false
    error: string | null = null

    private ratesCache = new Map<string, { rate: number; timestamp: number }>()

    constructor() {
        makeAutoObservable(this, {
            setAmount: action.bound,
            setFromCurrency: action.bound,
            setToCurrency: action.bound,
            swapCurrencies: action.bound,
            fetchConversion: action.bound,
        })

        this.loadState()
    }

    private loadState() {
        try {
            const savedState = localStorage.getItem(LOCAL_STORAGE_EXCHANGE_KEY)
            if (!savedState) return

            const { fromCurrency, toCurrency, amount, result } = JSON.parse(savedState)

            runInAction(() => {
                this.fromCurrency = fromCurrency || 'BTC'
                this.toCurrency = toCurrency || 'ETH'
                this.amount = amount || 1
                this.result = result || 1 // Загружаем сохраненный результат
            })
        } catch (error) {
            console.error('Ошибка загрузки из localStorage:', error)
        }
    }

    private saveState() {
        try {
            localStorage.setItem(
                LOCAL_STORAGE_EXCHANGE_KEY,
                JSON.stringify({
                    fromCurrency: this.fromCurrency,
                    toCurrency: this.toCurrency,
                    amount: this.amount,
                    result: this.result, // Сохраняем результат тоже
                }),
            )
        } catch (error) {
            console.error('Ошибка сохранения в localStorage:', error)
        }
    }

    async fetchCoins() {
        this.loading = true
        try {
            const data = await getCoins()
            runInAction(() => {
                this.coins = data
                if (!this.fromCurrency) this.fromCurrency = data[0]?.symbol || 'BTC'
                if (!this.toCurrency) this.toCurrency = data[1]?.symbol || 'ETH'
                this.loading = false
            })
            await this.fetchConversion()
        } catch (error) {
            runInAction(() => {
                this.error = `Ошибка загрузки: ${error instanceof Error ? error.message : String(error)}`
                this.loading = false
            })
        }
    }

    private getCoinIdBySymbol = (symbol: string): string | null =>
        this.coins.find((c) => c.symbol === symbol)?.id?.toString() ?? null

    async fetchConversion(amount = this.amount) {
        if (amount <= 0) return

        const cacheKey = `${this.fromCurrency}_${this.toCurrency}`
        const cachedRate = this.ratesCache.get(cacheKey)

        if (cachedRate && Date.now() - cachedRate.timestamp < EXCHANGE_CACHE_TTL) {
            runInAction(() => {
                this.result = cachedRate.rate * amount
                this.saveState() // Сохраняем при использовании кеша
            })
            return
        }

        try {
            const fromId = this.getCoinIdBySymbol(this.fromCurrency)
            const toId = this.getCoinIdBySymbol(this.toCurrency)

            if (!fromId || !toId) throw new Error('Некорректные валюты')

            const rate = await getConversionRate({ from: fromId, to: toId, fromAmount: 1 })

            runInAction(() => {
                this.result = rate * amount
                this.ratesCache.set(cacheKey, { rate, timestamp: Date.now() })
                this.saveState() // Сохраняем после нового расчета
            })
        } catch (error) {
            runInAction(() => {
                this.error = `Ошибка конвертации: ${error instanceof Error ? error.message : String(error)}`
            })
        }
    }

    setAmount = (value: number) => {
        if (value <= 0) return
        runInAction(() => {
            this.amount = value
            this.saveState() // Сохраняем сразу при изменении
        })
        this.fetchConversion()
    }

    setFromCurrency = (symbol: string) => {
        runInAction(() => {
            this.fromCurrency = symbol
            this.saveState()
        })
        this.fetchConversion()
    }

    setToCurrency = (symbol: string) => {
        runInAction(() => {
            this.toCurrency = symbol
            this.saveState()
        })
        this.fetchConversion()
    }

    swapCurrencies = () => {
        runInAction(() => {
            ;[this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency]
            this.saveState()
        })
        this.fetchConversion()
    }
}

export const exchangeStore = new ExchangeStore()
