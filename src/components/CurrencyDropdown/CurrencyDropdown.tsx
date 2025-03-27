import { exchangeStore } from '@/stores/exchangeStore'

import styles from './CurrencyDropdown.module.css'

interface CurrencyDropdownProps {
    isOpen: boolean
    search: string
    onSearchChange: (value: string) => void
    coins: typeof exchangeStore.coins
    selectedCurrency: string
    onSelect: (symbol: string) => void
}

export const CurrencyDropdown = ({
    isOpen,
    search,
    onSearchChange,
    coins,
    selectedCurrency,
    onSelect,
}: CurrencyDropdownProps) =>
    isOpen ? (
        <div className={styles.dropdown}>
            <input
                type='text'
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder='Поиск валюты...'
                className={styles.searchInput}
            />
            <div className={styles.coinList}>
                {coins.map((coin) => (
                    <div
                        key={coin.id}
                        onClick={() => onSelect(coin.symbol)}
                        className={`${styles.coinItem} ${
                            selectedCurrency === coin.symbol ? styles.selected : ''
                        }`}
                    >
                        {coin.symbol} - {coin.name}
                    </div>
                ))}
            </div>
        </div>
    ) : null
