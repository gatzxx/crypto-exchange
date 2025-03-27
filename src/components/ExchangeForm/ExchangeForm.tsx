import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

import { CurrencyInput } from '@/components/CurrencyInput/CurrencyInput'
import { exchangeStore } from '@/stores/exchangeStore'

import styles from './ExchangeForm.module.css'

export const ExchangeForm = observer(() => {
    useEffect(() => {
        exchangeStore.fetchCoins()
    }, [])

    const handleSwapCurrencies = () => {
        exchangeStore.swapCurrencies()
    }

    return (
        <div className={styles.exchangeForm}>
            <CurrencyInput type='from' />
            <button
                onClick={handleSwapCurrencies}
                className={styles.swapButton}
                aria-label='Swap currencies'
            >
                ⇄
            </button>
            <CurrencyInput type='to' />
        </div>
    )
})
