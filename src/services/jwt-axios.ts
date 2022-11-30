import axios from 'axios'
import Cookies from 'js-cookie'
let urlApi = 'http://cms.theweedsupplies.com'

const env = process.env.ENV
if (env === 'prod') {
  urlApi = 'http://cms.theweedsupplies.com'
}

const token = Cookies.get('token')

const callAPI = axios.create({
  baseURL: urlApi, // YOUR_API_URL HERE
  timeout: 10000,
  timeoutErrorMessage: 'Timeout error',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'ngrok-skip-browser-warning': '69420',
  },
})

callAPI.interceptors.response.use(
  (res: any) => {
    return res
  },
  (err: any) => {
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
    'ngrok-skip-browser-warning': '69420',
    Authorization: `Bearer ${token}`,
  },
})

callAPIWithToken.interceptors.response.use(
  (res: any) => {
    return res
  },
  (err: any) => {
    if (err.response && err.response.status === 401) {
      window.location.href = '/login'
      Cookies.remove('token')
    }
    if (err.response && err.response.status === 403) {
      window.location.href = '/403'
      // Cookies.remove('token')
    }
    return Promise.reject(err)
  }
)

const callAPIUpLoad = axios.create({
  baseURL: urlApi, // YOUR_API_URL HERE
  timeout: 10000,
  timeoutErrorMessage: 'Timeout error',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'ngrok-skip-browser-warning': '69420',
    // 'Content-Type': 'image/png',
  },
})

callAPIUpLoad.interceptors.response.use(
  (res: any) => {
    return res
  },
  (err: any) => {
    if (err.response && err.response.status === 403) {
      // window.location.href = '/403'
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

export { callAPI, callAPIWithToken, callAPIUpLoad }
