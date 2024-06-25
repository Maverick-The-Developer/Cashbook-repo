import axios from 'axios'
const apiServerUrl = 'http://localhost:8000'

export const api = axios.create({
  baseURL: apiServerUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})