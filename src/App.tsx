import { ExchangeForm } from '@/components/ExchangeForm/ExchangeForm'

import styles from './App.module.css'

export const App = () => {
    return (
        <div className={styles.appContainer}>
            <h1 className={styles.title}>Crypto Exchange</h1>
            <ExchangeForm />
        </div>
    )
}
