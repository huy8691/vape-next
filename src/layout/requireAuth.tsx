import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'
import type { ReactElement } from 'react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress'

interface MyToken {
  name: string
  exp: number
  // whatever else is in the JWT.
}

const RequireAuth: React.FC<{
  children: ReactElement
}> = ({ children }) => {
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
  return <>{children}</>
}
export default RequireAuth
