import axios from 'axios'
import Cookies from 'js-cookie'
let urlApi = 'http://192.168.22.31:8000'

const env = process.env.ENV
if (env === 'prod') {
  urlApi = 'https://api-dev.vuarausach.vn/2'
}

const token = Cookies.get('token')

const callAPI = axios.create({
  baseURL: urlApi, // YOUR_API_URL HERE
  timeout: 10000,
  timeoutErrorMessage: 'Timeout error',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
})

callAPI.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    if (err.response && err.response.status === 403) {
      window.location.href = '/403'
    }
    return Promise.reject(err)
  }
)

const callAPIWithToken = axios.create({
  baseURL: urlApi,
  timeout: 10000,
  timeoutErrorMessage: 'Timeout error',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: `Bearer ${token}`,
  },
})

callAPIWithToken.interceptors.response.use(
  (res) => {
    return res
  },
  (err) => {
    if (err.response && err.response.status === 401) {
      window.location.href = '/login'
      Cookies.remove('token')
    }
    if (err.response && err.response.status === 403) {
      window.location.href = '/403'
      Cookies.remove('token')
    }
    return Promise.reject(err)
  }
)

export const setAuthToken = (_token: string) => {
  if (_token) {
    Cookies.set('token', _token)
  } else {
    Cookies.remove('token')
  }
}

export { callAPI, callAPIWithToken }
