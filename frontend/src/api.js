import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 120000,
})

export function errorMessage(error) {
  return (
    error?.response?.data?.detail ||
    error?.message ||
    'Something went wrong. Please try again.'
  )
}

export default api
