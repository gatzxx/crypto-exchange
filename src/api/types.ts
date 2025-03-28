export interface Coin {
    id: number
    name: string
    symbol: string
}

export interface ConversionParams {
    from: string
    to: string
    fromAmount: number
}

export interface ConversionResponse {
    rate: number
}
