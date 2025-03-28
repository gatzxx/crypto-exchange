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
            fetchConversion: action.bound,
        })

        this.loadState()
    }

    private loadState() {
        try {
            const data = localStorage.getItem(LOCAL_STORAGE_EXCHANGE_KEY)
            if (!data) return

            const {
                fromCurrency = 'BTC',
                toCurrency = 'ETH',
                amount = 1,
                result,
            } = JSON.parse(data)

            runInAction(() => {
                this.fromCurrency = fromCurrency
                this.toCurrency = toCurrency
                this.amount = amount
                this.result = result ?? (fromCurrency === toCurrency ? amount : 1)
            })

            coinsStore.coins.length ? this.fetchConversion(this.amount) : coinsStore.fetchCoins()
        } catch (error) {
            console.error('Ошибка загрузки из localStorage:', error)
        }
    }

    private saveState() {
        try {
            const { fromCurrency, toCurrency, amount, result } = this
            localStorage.setItem(
                LOCAL_STORAGE_EXCHANGE_KEY,
                JSON.stringify({ fromCurrency, toCurrency, amount, result }),
            )
        } catch (error) {
            console.error('Ошибка сохранения в localStorage:', error)
        }
    }

    async fetchConversion(amount = this.amount) {
        if (amount <= 0 || this.fromCurrency === this.toCurrency) return

        const cacheKey = `${this.fromCurrency}_${this.toCurrency}`
        const cachedRate = this.ratesCache.get(cacheKey)

        if (cachedRate && Date.now() - cachedRate.timestamp < EXCHANGE_CACHE_TTL) {
            runInAction(() => {
                this.result = cachedRate.rate * amount
                this.saveState()
            })
            return
        }

        const fromId = coinsStore.getCoinIdBySymbol(this.fromCurrency)
        const toId = coinsStore.getCoinIdBySymbol(this.toCurrency)

        if (!fromId || !toId) {
            runInAction(() => {
                this.error = 'Некорректные валюты'
            })
            return
        }

        try {
            runInAction(() => {
                this.loading = true
                this.error = null
            })

            const rate = await getConversionRate({ from: fromId, to: toId, fromAmount: 1 })

            runInAction(() => {
                this.ratesCache.set(cacheKey, { rate, timestamp: Date.now() })
                this.result = rate * amount
                this.saveState()
            })
        } catch (error) {
            runInAction(() => {
                this.error = `Ошибка конвертации: ${error instanceof Error ? error.message : String(error)}`
            })
        } finally {
            runInAction(() => {
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

        this.fetchConversion(value)
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
