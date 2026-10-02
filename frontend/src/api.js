import axios from 'axios'
import { getSessionId } from './lib/session'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 120000,
})

// Every request is tagged with this browser's session ID, so the backend
// can keep each visitor's uploaded PDFs and vector index isolated from
// everyone else's — see fastapi/main.py's get_session_id dependency.
api.interceptors.request.use((config) => {
  config.headers['X-Session-Id'] = getSessionId()
  return config
})

export function errorMessage(error) {
  return (
    error?.response?.data?.detail ||
    error?.message ||
    'Something went wrong. Please try again.'
  )
}

export default api
