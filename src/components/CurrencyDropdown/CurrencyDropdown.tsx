import { Box, MenuItem, Paper, Popper, TextField, ClickAwayListener } from '@mui/material'
import { memo, useMemo } from 'react'

import { coinsStore } from '@/stores'

import {
    popperStyles,
    paperStyles,
    menuItemStyles,
    textFieldStyles,
    popperModifiers,
} from './CurrencyDropdown.styles'

interface CurrencyDropdownProps {
    isOpen: boolean
    search: string
    onSearchChange: (value: string) => void
    coins: typeof coinsStore.coins
    selectedCurrency: string
    onSelect: (symbol: string) => void
    anchorEl: HTMLElement | null
    onClose: () => void
}

export const CurrencyDropdown = memo(
    ({
        isOpen,
        search,
        onSearchChange,
        coins,
        selectedCurrency,
        onSelect,
        anchorEl,
        onClose,
    }: CurrencyDropdownProps) => {
        const handleSelect = (symbol: string) => {
            onSelect(symbol)
            onClose()
        }

        const filteredCoins = useMemo(
            () => coins.filter((coin) => coin.symbol.toLowerCase().includes(search.toLowerCase())),
            [coins, search],
        )

        return (
            <Popper
                open={isOpen}
                anchorEl={anchorEl}
                placement='bottom-start'
                modifiers={popperModifiers}
                sx={popperStyles}
            >
                <ClickAwayListener onClickAway={onClose}>
                    <Paper sx={paperStyles}>
                        <TextField
                            {...textFieldStyles}
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder='Поиск валюты...'
                        />
                        <Box sx={{ mt: 1 }}>
                            {filteredCoins.map((coin) => (
                                <MenuItem
                                    key={coin.id}
                                    onClick={() => handleSelect(coin.symbol)}
                                    selected={selectedCurrency === coin.symbol}
                                    sx={menuItemStyles}
                                >
                                    {coin.symbol} - {coin.name}
                                </MenuItem>
                            ))}
                        </Box>
                    </Paper>
                </ClickAwayListener>
            </Popper>
        )
    },
)
