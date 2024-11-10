const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost/v1/api'
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'your api key'
const USER_COOKIE_NAME = process.env.NEXT_PUBLIC_USER_COOKIE_NAME || 'user'
const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost/v1/api'

console.log('BASE_URL', BASE_URL)
console.log('API_KEY', API_KEY)

export const constant = {
  BASE_URL,
  API_KEY,
  USER_COOKIE_NAME,
  SOCKET_URL,
}
