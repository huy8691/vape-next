import axios from 'axios'
import Cookies from 'js-cookie'
let urlApi = 'http://192.168.22.30:8000'

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
    Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjY3Mjc4MTUxLCJpYXQiOjE2NjcxOTE3NTEsImp0aSI6ImIxNDUyOTJmYTM1NjRmM2Y5MjY3N2U2MDZhMzNkOWQzIiwidXNlcl9pZCI6NSwicGhvbmVfbnVtYmVyIjoiMDk2ODYxNzE1NSIsImVtYWlsIjoiaHV5ODY5MUBnbWFpbC5jb20iLCJ1c2VyX3R5cGUiOiJDVVNUT01FUiJ9.4hPS-bcEpyUIR7dKB2_TKSsJwXeqy48iHBJnpOmM9gM`,
  },
})

callAPIWithToken.interceptors.response.use(
  (res) => {
    console.log('res', res)
    return res
  },
  (err) => {
    console.log('err', err)
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

export const setAuthToken = (_token: string) => {
  if (_token) {
    Cookies.set('token', _token)
  } else {
    Cookies.remove('token')
  }
}

export { callAPI, callAPIWithToken }
