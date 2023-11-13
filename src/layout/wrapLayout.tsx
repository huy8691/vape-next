import CircularProgress from '@mui/material/CircularProgress'
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
// import Snackbar from '@mui/material/Snackbar'
// import MuiAlert from '@mui/material/Alert'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Provider } from 'react-redux'
import { useAppSelector } from 'src/store/hooks'
import { store } from 'src/store/store'
// import Snackbar from '@mui/material/Snackbar'
// import MuiAlert, { AlertProps } from '@mui/material/Alert'
import Cookies from 'js-cookie'
// import { Shadows } from '@mui/material/styles/shadows'
// import vi_VN from 'antd/lib/locale/vi_VN'
// import 'moment/locale/vi'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
// next
import { useRouter } from 'next/router'
import { SnackbarProvider } from 'notistack'
import { callAPI } from 'src/services/jwt-axios'
import { useTranslation } from 'next-i18next'

// Snackbar
// type SnackbarType = {
//   open: boolean
//   autoHideDuration?: number
//   message: string
//   type: 'error' | 'warning' | 'info' | 'success'
// }

// const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
//   props,
//   ref
// ) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
// })
// Snackbar
type Props = {
  children: ReactElement
}

const theme = createTheme({
  palette: {
    // mode: 'dark',
    primary: {
      main: '#1DB46A',
    },
    error: {
      main: '#BA2532',
    },
  },
  // shadows: Array(25).fill('none') as Shadows,
  typography: {
    fontFamily: 'Poppins',
    htmlFontSize: 10,
    fontSize: 14,
    body1: {
      fontSize: 14,
    },
    body2: {
      fontSize: 14,
    },
    // button: {
    //   fontSize: '1.4rem',
    // },
  },
})

const InnerLayout = ({ children }: Props) => {
  const router = useRouter()
  // const { t, i18n } = useTranslation()

  const loading = useAppSelector((state) => state.loading)
  const userInfo = useAppSelector((state) => state.userInfo)
  // const handleChangePagination = (e: any, page: number) => {
  //   console.log(e)
  //   router.replace({
  //     search: `${objToStringParam({
  //       ...router.query,
  //       page: page,
  //     })}`,
  //   })
  // }
  console.log('Loading', userInfo)
  if (
    router.pathname.startsWith('/supplier') &&
    (userInfo.data.user_type === 'MERCHANT' ||
      userInfo.data.user_type === 'ADMIN')
    // || userInfo.data.user_type === 'ADMIN'
  ) {
    router.push('/403')
  }
  if (
    router.pathname.startsWith('/retailer') &&
    (userInfo.data.user_type === 'SUPPLIER' ||
      userInfo.data.user_type === 'ADMIN')
    //  ||userInfo.data.user_type === 'ADMIN'
  ) {
    router.push('/403')
  }
  if (
    router.pathname.startsWith('/admin') &&
    (userInfo.data.user_type === 'SUPPLIER' ||
      userInfo.data.user_type === 'MERCHANT')
  ) {
    router.push('/403')
  }
  useEffect(() => {
    callAPI({
      url: '/api/error-code-from-db/',
      method: 'get',
    }).then((res) => {
      const { data } = res.data
      localStorage.setItem('error-code', JSON.stringify(data))
    })
  }, [])
  console.log('loading state is', loading.isLoading)
  return (
    <div style={{ minHeight: '100vh' }}>
      {loading.isLoading && (
        <div className="loading">
          <CircularProgress />
        </div>
      )}
      {children}
    </div>
  )
}

const WrapLayout = ({ children }: Props) => {
  const router = useRouter()
  const token = Boolean(Cookies.get('token'))
  const [mounted, setMounted] = useState<boolean>(false)
  const { i18n } = useTranslation()
  useEffect(() => {
    if (
      (router.asPath === '/login' ||
        router.asPath === '/register' ||
        router.asPath === '/change-password' ||
        router.asPath === '/forgot-password') &&
      token
    ) {
      router.replace('/')
    } else {
      setMounted(true)
    }
  }, [token, router])
  if (!mounted) {
    return (
      <div className="loading">
        <ThemeProvider theme={theme}>
          <CircularProgress />
        </ThemeProvider>
      </div>
    )
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider autoHideDuration={3000} maxSnack={15}>
          <InnerLayout>
            <>
              <Select
                onChange={(e) => {
                  console.log('e', e.target.value)
                  console.log('router', router)
                  i18n.changeLanguage(`${e.target?.value}`)
                  router.push(router.asPath, undefined, {
                    locale: e.target.value as string,
                  })
                }}
                value={i18n.language}
                size="small"
                sx={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  minWidth: '50px',
                  background: 'white',
                  borderRadius: '8px',
                }}
                className="language-setting"
              >
                <MenuItem value="en">EN</MenuItem>
                <MenuItem value="es">ES</MenuItem>
              </Select>
              {children}
            </>
          </InnerLayout>
        </SnackbarProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default WrapLayout
