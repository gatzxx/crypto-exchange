import { action, makeAutoObservable, runInAction } from 'mobx'

import { coinsStore } from '@/stores'

import { EXCHANGE_CACHE_TTL, LOCAL_STORAGE_EXCHANGE_KEY } from '@/constants/settings'
import { getConversionRate } from '@/api/conversion'

class ExchangeStore {
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
                this.result = result || (fromCurrency === toCurrency ? amount : 1)
            })

            if (!coinsStore.coins.length) {
                coinsStore.fetchCoins()
            } else {
                this.fetchConversion(this.amount)
            }
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
                    result: this.result,
                }),
            )
        } catch (error) {
            console.error('Ошибка сохранения в localStorage:', error)
        }
    }

    async fetchConversion(amount = this.amount) {
        if (amount <= 0) return

        if (this.fromCurrency === this.toCurrency) {
            runInAction(() => {
                this.result = amount
                this.saveState()
            })
            return
        }

        const cacheKey = `${this.fromCurrency}_${this.toCurrency}`
        const cachedRate = this.ratesCache.get(cacheKey)

        if (cachedRate && Date.now() - cachedRate.timestamp < EXCHANGE_CACHE_TTL) {
            runInAction(() => {
                this.result = cachedRate.rate * amount
                this.saveState()
            })
            return
        }

        try {
            this.loading = true
            const fromId = coinsStore.getCoinIdBySymbol(this.fromCurrency)
            const toId = coinsStore.getCoinIdBySymbol(this.toCurrency)

            if (!fromId || !toId) throw new Error('Некорректные валюты')

            const rate = await getConversionRate({ from: fromId, to: toId, fromAmount: 1 })

            runInAction(() => {
                this.result = rate * amount
                this.ratesCache.set(cacheKey, { rate, timestamp: Date.now() })
                this.loading = false
                this.saveState()
            })
        } catch (error) {
            runInAction(() => {
                this.error = `Ошибка конвертации: ${error instanceof Error ? error.message : String(error)}`
                this.loading = false
            })
        }
    }

    setAmount = (value: number) => {
        if (value < 0) return

        runInAction(() => {
            this.amount = value
            this.saveState()
        })

        if (this.fromCurrency !== this.toCurrency && value > 0) {
            this.fetchConversion(value)
        }
    }

    setFromCurrency = (symbol: string) => {
        runInAction(() => {
            this.fromCurrency = symbol
            this.saveState()
        })
        if (this.fromCurrency !== this.toCurrency) {
            this.fetchConversion()
        }
    }

    setToCurrency = (symbol: string) => {
        runInAction(() => {
            this.toCurrency = symbol
            this.saveState()
        })
        if (this.fromCurrency !== this.toCurrency) {
            this.fetchConversion()
        }
    }

    swapCurrencies = () => {
        runInAction(() => {
            ;[this.fromCurrency, this.toCurrency] = [this.toCurrency, this.fromCurrency]
            this.saveState()
        })
        if (this.fromCurrency !== this.toCurrency) {
            this.fetchConversion()
        }
    }
}

export const exchangeStore = new ExchangeStore()
