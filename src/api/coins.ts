import { apiClient } from '@/api'
import { Coin } from '@/api/types'

export const getCoins = async (): Promise<Coin[]> => {
    try {
        const { data } = await apiClient.get<Coin[]>('/coins')
        return data
    } catch (error) {
        throw new Error('Failed to fetch coins', { cause: error })
    }
}
