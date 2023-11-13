import CircularProgress from '@mui/material/CircularProgress'
import { AxiosResponse } from 'axios'
import { getMessaging, isSupported, onMessage } from 'firebase/messaging'
import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'
import { useRouter } from 'next/router'
import { SnackbarProvider, useSnackbar } from 'notistack'
import type { ReactElement } from 'react'
import React, { useEffect, useMemo, useState } from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { permissionActions } from 'src/store/permission/permissionSlice'
import { fetchToken, firebaseApp } from 'src/utils/firebase'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import ContentNotification from 'src/components/enqueueSnackbar/contentNotification'
import { paymentTypeActions } from 'src/store/paymentMethodType/paymentMethodTypeSlice'

interface MyToken {
  name: string
  exp: number
  // whatever else is in the JWT.
}

export interface DynamicPermissionType {
  [key: string]: number
}
export interface PermissionType {
  module: string
  permissions: DynamicPermissionType
}

export interface PermissionResponseType {
  data: PermissionType[]
  nextPage?: number
  currentPage?: number
  totalPages?: number
  success?: boolean
  totalItems?: number
}

export const getListPermission = (
  params: object
): Promise<AxiosResponse<PermissionResponseType>> => {
  return callAPIWithToken({
    url: `/api/user-permissions/`,
    method: 'get',
    params: {
      ...params,
      limit: 50,
    },
  })
}

const getConfigPayment = (): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: 'api/organnization/payment/config/',
    method: 'get',
  })
}
export interface PayloadNotification {
  from?: string
  notification?: Notification
  data?: Data
}

export interface Data {
  utcTime?: string
  action?: string
  body?: {
    [key: string]: string
  }
  title?: {
    [key: string]: string
  }
  utcDate?: string
  iat?: string
  value?: string
}

export interface Notification {
  title?: string
  body?: string
}

const RequireAuth: React.FC<{
  children: ReactElement
}> = ({ children }) => {
  // permssion
  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  const fetchPermission = async () => {
    let permission: PermissionResponseType = {
      data: [],
    }
    getListPermission({
      page: 1,
    })
      .then(async (res) => {
        const data = res.data
        console.log('2222', data)
        permission = await data
        if (res.data.totalPages && res.data.totalPages > 1) {
          for (let page = 2; page <= res.data.totalPages; page++) {
            await getListPermission({
              page: page,
            })
              .then((res) => {
                const { data } = res.data
                console.log('33333', data)
                permission = {
                  ...permission,
                  data: [...permission.data, ...data],
                }
              })
              .catch((response) => {
                dispatch(loadingActions.doLoadingFailure())
                const { status, data } = response
                pushMessage(handlerGetErrMessage(status, data), 'error')
              })
          }
        }
        await console.log('permission', permission)
        await dispatch(permissionActions.doPermissionSuccess(permission))
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    fetchPermission()
    getConfigPayment().then((res) => {
      const { data } = res.data
      dispatch(paymentTypeActions.doSetPaymentType(data.payment_gateway))
    })
  }, [])
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const token = Boolean(Cookies.get('token'))
  const refreshToken: string = Cookies.get('refreshToken') || ''
  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    if (!token) {
      router.replace('/login')
    } else {
      setMounted(true)
    }
  }, [token, router])

  if (typeof window !== 'undefined') {
    onMessage(getMessaging(firebaseApp), (payload) => {
      enqueueSnackbar(payload?.notification?.title, {
        autoHideDuration: 10000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
        persist: false,
        content: (key, message) => (
          <ContentNotification id={key} message={message} payload={payload} />
        ),
      })
    })
  }

  useMemo(() => {
    isSupported().then(() => {
      fetchToken()
    })
  }, [])

  try {
    const deCodeToken = jwt_decode<MyToken>(refreshToken)
    if (deCodeToken.exp < Date.now() / 1000) {
      Cookies.remove('token')
      Cookies.remove('refreshToken')
      router.push('/login')
      // return <Navigate to="/login" state={{ form: location }} replace />
    }
  } catch (error) {
    console.log('error', error)
  }
  if (!mounted) {
    return (
      <div className="loading">
        <CircularProgress />
      </div>
    )
  }

  return (
    <>
      <SnackbarProvider maxSnack={20} hideIconVariant>
        {children}
      </SnackbarProvider>
    </>
  )
}
export default RequireAuth
