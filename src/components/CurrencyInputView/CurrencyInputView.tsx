import { TextField, CircularProgress, Button } from '@mui/material'
import { useState, MouseEvent, memo } from 'react'

import { coinsStore } from '@/stores'

import {
    buttonStyles,
    containerStyles,
    textFieldStyles,
} from '@/components/CurrencyInputView/CurrencyInputView.styles'
import { CurrencyDropdown } from '@/components/CurrencyDropdown/CurrencyDropdown'
import { useCurrencyInput } from '@/hooks/useCurrencyInput'
import { TEXT } from '@/constants/texts'

interface CurrencyInputViewProps extends ReturnType<typeof useCurrencyInput> {
    type: 'from' | 'to'
}

export const CurrencyInputView = memo(
    ({
        type,
        localValue,
        currentCurrency,
        searchTerm,
        handleAmountChange,
        handleCurrencySelect,
        setSearchTerm,
    }: CurrencyInputViewProps) => {
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
        const isDropdownOpen = Boolean(anchorEl)

        const coins = coinsStore.getFilteredCoins(searchTerm, type)

        const loading = coinsStore.loading

        const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
            if (!loading && coins.length) {
                setAnchorEl(event.currentTarget)
            }
        }

        const handleClose = () => setAnchorEl(null)

        return (
            <div style={containerStyles}>
                <TextField
                    type='text'
                    value={localValue}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    placeholder={TEXT.placeholder[type]}
                    inputMode='decimal'
                    aria-label={`${type} amount`}
                    fullWidth={true}
                    variant='outlined'
                    disabled={loading}
                    slotProps={{
                        input: {
                            endAdornment: loading ? (
                                <CircularProgress size={20} color='primary' />
                            ) : null,
                        },
                    }}
                    sx={textFieldStyles}
                />

                <Button
                    variant='outlined'
                    onClick={handleOpen}
                    disabled={loading}
                    aria-expanded={isDropdownOpen}
                    sx={buttonStyles}
                >
                    {loading ? (
                        <CircularProgress size={20} color='inherit' />
                    ) : (
                        currentCurrency || TEXT.select
                    )}
                </Button>

                <CurrencyDropdown
                    isOpen={isDropdownOpen}
                    search={searchTerm}
                    onSearchChange={setSearchTerm}
                    coins={coins}
                    selectedCurrency={currentCurrency}
                    onSelect={handleCurrencySelect}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                />
            </div>
        )
    },
)
