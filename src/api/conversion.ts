import { ConversionParams, ConversionResponse } from '@/api/types'
import { apiClient } from '@/api'

export const getConversionRate = async (params: ConversionParams): Promise<number> => {
    try {
        const { data } = await apiClient.get<ConversionResponse>('/conversion', { params })
        return data.rate
    } catch (error) {
        throw new Error('Failed to fetch conversion rate', { cause: error })
    }
}
