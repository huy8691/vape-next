import Cookies from 'js-cookie'
import type { ReactElement } from 'react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const RequireAuth: React.FC<{
  children: ReactElement
}> = ({ children }) => {
  const router = useRouter()
  const token = Boolean(Cookies.get('token'))
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>()
  useEffect(() => {
    setIsLoggedIn(token)
    if (!token) {
      router.push('/login')
    }
  }, [token, router])
  return <>{isLoggedIn && children}</>
}
export default RequireAuth
