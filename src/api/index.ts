import axios, { AxiosInstance } from 'axios'

import { API_BASE_URL } from '@/constants/apiClient'

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})
