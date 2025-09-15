// api/client.ts

import axios from 'axios'
import { getCookie } from 'cookies-next'

const api = axios.create({
  baseURL: 'http://localhost:4000/',
})

api.interceptors.request.use(
  async (config) => {
    return new Promise(async (resolve, reject) => {
      const token = getCookie('token')

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
        config.headers['Content-Type'] = 'application/json'
      }

      resolve(config)
    })
  },
  (error) => {
    return Promise.reject(error)
  },
)

export { api }