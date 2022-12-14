import axios from 'axios'
import Cookies from 'js-cookie'
// let urlApi = 'https://cms.theweedsupplies.com'
// let urlApi = 'http://192.168.31.252:8000'
let urlApi = 'https://4d76-2402-800-6315-12cc-ac20-f2bb-2db1-76ae.ap.ngrok.io'

const env = process.env.ENV
if (env === 'prod') {
  urlApi = 'https://cms.theweedsupplies.com'
}

let isRefreshing = false
let failedQueue: any = []

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

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
  // headers: {
  //   'Content-Type': 'application/json',
  //   'Access-Control-Allow-Origin': '*',
  //   'ngrok-skip-browser-warning': '69420',
  //   Authorization: `Bearer ${token}`,
  // },
})

callAPIWithToken.interceptors.request.use(
  (req) => {
    const token = Cookies.get('token')
    req.headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'ngrok-skip-browser-warning': '69420',
      withCredentials: true,
      Authorization: `Bearer ${token}`,
    }
    return req
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  },
  { synchronous: true }
)

callAPIWithToken.interceptors.response.use(
  (res) => {
    return res
  },
  (err: any) => {
    const originalConfig = err.config

    // if (err.response && err.response.status === 401) {
    //   window.location.href = '/login'
    //   Cookies.remove('token')
    // }
    if (err.response && err.response.status === 403) {
      window.location.href = '/403'
      // Cookies.remove('token')
    }

    if (err.response.status === 401 && !originalConfig._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalConfig.headers['Authorization'] = 'Bearer ' + token
            return axios(originalConfig)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      const refreshToken = Cookies.get('refreshToken')

      if (localStorage.getItem('isRemember') === 'true') {
        originalConfig._retry = true
        isRefreshing = true
        return new Promise(function (resolve, reject) {
          axios
            .post(`${urlApi}/api/token/refresh/`, { refreshToken })
            .then(({ data }) => {
              const { newAccessToken, newRefreshToken } = data.data
              Cookies.set('token', newAccessToken)
              Cookies.set('refreshToken', newRefreshToken)
              originalConfig.headers['Authorization'] =
                'Bearer ' + newAccessToken
              processQueue(null, newAccessToken)
              resolve(callAPIWithToken(originalConfig))
            })
            .catch((err) => {
              processQueue(err, null)
              reject(err)
              Cookies.remove('token')
              Cookies.remove('refreshToken')
              window.location.href = '/login'
            })
            .finally(() => {
              isRefreshing = false
            })
        })
      } else {
        isRefreshing = false
        Cookies.remove('token')
        Cookies.remove('refreshToken')
        window.location.href = '/login'
      }
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

export const setAuthToken = (_token: string, _tokenRefresh: string) => {
  if (_token) {
    Cookies.set('token', _token)
    Cookies.set('refreshToken', _tokenRefresh)
  } else {
    Cookies.remove('token')
  }
}

export { callAPI, callAPIWithToken, callAPIUpLoad }
