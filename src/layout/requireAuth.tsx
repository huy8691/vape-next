import Cookies from 'js-cookie'
import type { ReactElement } from 'react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import CircularProgress from '@mui/material/CircularProgress'

const RequireAuth: React.FC<{
  children: ReactElement
}> = ({ children }) => {
  const router = useRouter()
  const token = Boolean(Cookies.get('token'))
  const [mounted, setMounted] = useState<boolean>(false)
  useEffect(() => {
    if (!token) {
      router.replace('/login')
    } else {
      setMounted(true)
    }
  }, [token, router])
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
