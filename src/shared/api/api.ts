import axios, { type AxiosInstance } from 'axios'

const BASE_URL = 'https://ftapi.pythonanywhere.com'

// Create axios instance with base URL
const api: AxiosInstance = axios.create({
	baseURL: BASE_URL,
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
})
export default api
