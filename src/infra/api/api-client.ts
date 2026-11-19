import axios from 'axios'
import { apiConfig } from '@/config'

export const apiClient = axios.create({
  baseURL: apiConfig.baseURL,
  timeout: apiConfig.timeout,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Add authentication and normalized error handling only after the API/session contract is agreed.
// Never log credentials or sensitive request/response payloads.
