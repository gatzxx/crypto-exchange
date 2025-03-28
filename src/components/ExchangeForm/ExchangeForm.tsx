import { Box, Button } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react'

import { coinsStore, exchangeStore } from '@/stores'

import {
    buttonContainerStyles,
    containerStyles,
} from '@/components/ExchangeForm/ExchangeForm.styles'
import { CurrencyInput } from '@/components/CurrencyInput/CurrencyInput'

export const ExchangeForm = observer(() => {
    useEffect(() => {
        coinsStore.fetchCoins()
    }, [])

    const handleSwapCurrencies = () => {
        exchangeStore.swapCurrencies()
    }

    return (
        <Box sx={containerStyles}>
            <CurrencyInput type='from' />

            <Box sx={buttonContainerStyles}>
                <Button
                    onClick={handleSwapCurrencies}
                    variant='outlined'
                    color='primary'
                    size='small'
                >
                    ⇄
                </Button>
            </Box>

            <CurrencyInput type='to' />
        </Box>
    )
})
