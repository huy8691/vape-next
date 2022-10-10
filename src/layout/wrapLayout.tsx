import React, { useEffect, useState } from 'react'
import type { ReactElement } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
// import Snackbar from '@mui/material/Snackbar'
// import MuiAlert from '@mui/material/Alert'
import { useAppSelector } from 'src/store/hooks'
import { Provider } from 'react-redux'
import { store } from 'src/store/store'
import classes from './styles.module.scss'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'
// import vi_VN from 'antd/lib/locale/vi_VN'
// import 'moment/locale/vi'

// Snackbar
type SnackbarType = {
  open: boolean
  autoHideDuration?: number
  message: string
  type: 'error' | 'warning' | 'info' | 'success'
}
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})
// Snackbar

type Props = {
  children: ReactElement
}
const theme = createTheme({
  palette: {
    // mode: 'dark',
    primary: {
      main: '#34DC75',
    },
    error: {
      main: '#BA2532',
    },
  },
  typography: {
    fontFamily: 'Poppins',
    htmlFontSize: 10,
    fontSize: 14,
  },
})

const InnerLayout = ({ children }: Props) => {
  const notificationApp = useAppSelector((state) => state.notification)
  const loading = useAppSelector((state) => state.loading)

  // Snackbar
  const [valueSnackbar, setValueSnackbar] = useState<SnackbarType>({
    open: false,
    autoHideDuration: 3000,
    message: '',
    type: 'success',
  })
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }
    setValueSnackbar({
      ...valueSnackbar,
      open: false,
      message: '',
    })
  }
  useEffect(() => {
    if (notificationApp.message) {
      if (notificationApp.type === undefined) {
        setValueSnackbar({
          ...valueSnackbar,
          open: true,
          autoHideDuration: notificationApp.duration,
          message: notificationApp.message,
          type: 'success',
        })
        return
      }
      setValueSnackbar({
        ...valueSnackbar,
        open: true,
        autoHideDuration: notificationApp.duration,
        message: notificationApp.message,
        type: notificationApp.type,
      })
    }
  }, [notificationApp])
  // Snackbar
  return (
    <div style={{ minHeight: '100vh' }}>
      {children}
      {loading.isLoading && (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      )}
      <Snackbar
        open={valueSnackbar.open}
        autoHideDuration={valueSnackbar.autoHideDuration}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={valueSnackbar.type}>
          {valueSnackbar.message}
        </Alert>
      </Snackbar>
    </div>
  )
}
const WrapLayout = ({ children }: Props) => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <InnerLayout>{children}</InnerLayout>
      </ThemeProvider>
    </Provider>
  )
}

export default WrapLayout
