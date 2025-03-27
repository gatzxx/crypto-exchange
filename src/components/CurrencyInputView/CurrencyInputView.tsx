import { CurrencyDropdown } from '@/components/CurrencyDropdown/CurrencyDropdown'
import { useCurrencyInput } from '@/hooks/useCurrencyInput'
import { TEXT } from '@/constants/texts'

import styles from './CurrencyInputView.module.css'

interface CurrencyInputViewProps extends ReturnType<typeof useCurrencyInput> {
    type: 'from' | 'to'
}

export const CurrencyInputView = ({
    type,
    localValue,
    currentCurrency,
    loading,
    filteredCoins,
    isDropdownOpen,
    searchTerm,
    handleAmountChange,
    handleCurrencySelect,
    setSearchTerm,
    toggleDropdown,
    coinsEmpty,
}: CurrencyInputViewProps) => (
    <div className={styles.inputGroup}>
        <div className={styles.amountSection}>
            <input
                type='text'
                value={localValue}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder={TEXT.placeholder[type]}
                className={styles.input}
                inputMode='decimal'
                aria-label={`${type} amount`}
            />
            {loading && <div className={styles.spinner} aria-hidden='true' />}
        </div>

        <div className={styles.currencySelector}>
            <button
                className={styles.currencyButton}
                onClick={toggleDropdown}
                disabled={loading || coinsEmpty}
                aria-expanded={isDropdownOpen}
            >
                {currentCurrency || TEXT.select}
                <span className={`${styles.arrow} ${isDropdownOpen ? styles.open : ''}`} />
            </button>

            {isDropdownOpen && (
                <CurrencyDropdown
                    isOpen={isDropdownOpen}
                    search={searchTerm}
                    onSearchChange={setSearchTerm}
                    coins={filteredCoins}
                    selectedCurrency={currentCurrency}
                    onSelect={handleCurrencySelect}
                />
            )}
        </div>
    </div>
)
