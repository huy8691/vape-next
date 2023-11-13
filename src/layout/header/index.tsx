import React, { useEffect, useState } from 'react'

// import { useRouter } from 'next/router'
import Link from 'next/link'

import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { logOutAPI } from '../../../pages/login/loginAPI'

import Cookies from 'js-cookie'
import { notificationHistoryActions } from 'src/store/notificationHistory/notificationHistorySlice'
import { userInfoActions } from 'src/store/userInfo/userInfoSlice'
// mui
import {
  Avatar,
  Badge,
  Box,
  Menu,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
// import Switch from '@mui/material/Switch'
// import FormControlLabel from '@mui/material/FormControlLabel'
// import TuneIcon from '@mui/icons-material/Tune'
// import Stack from '@mui/material/Stack'
// import ClickAwayListener from '@mui/material/ClickAwayListener'
// end mui

// import SideBarSetting from '../sidebarSetting'

// next theme
import { useTheme } from 'next-themes'

// other
import { Bell } from '@phosphor-icons/react'

import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'

import { Stack } from '@mui/material'
import { useTranslation } from 'next-i18next'
import { doDeactiveToken } from 'pages/_common/setting/notification-configuration/apiNotificationConfig'
import { getListShipping } from './headerAPI'
import LoggingTime from './part/loggingTime'

// other

// const MaterialUISwitch = styled(Switch)(({ theme }) => ({
//   width: 62,
//   height: 34,
//   padding: 7,
//   '& .MuiSwitch-switchBase': {
//     margin: 1,
//     padding: 0,
//     transform: 'translateX(6px)',
//     '&.Mui-checked': {
//       color: '#fff',
//       transform: 'translateX(22px)',
//       '& .MuiSwitch-thumb:before': {
//         backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
//           '#fff'
//         )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
//       },
//       '& + .MuiSwitch-track': {
//         opacity: 1,
//         backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
//       },
//     },
//   },
//   '& .MuiSwitch-thumb': {
//     backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
//     width: 32,
//     height: 32,
//     '&:before': {
//       content: "''",
//       position: 'absolute',
//       width: '100%',
//       height: '100%',
//       left: 0,
//       top: 0,
//       backgroundRepeat: 'no-repeat',
//       backgroundPosition: 'center',
//       backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
//         '#fff'
//       )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
//     },
//   },
//   '& .MuiSwitch-track': {
//     opacity: 1,
//     backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
//     borderRadius: 20 / 2,
//   },
// }))

// style
// const TuneIconCustom = styled(TuneIcon)({
//   position: 'relative',
//   zIndex: 1,
//   cursor: 'pointer',
// })
const BellCustom = styled(Bell)(({ theme }) => ({
  color: theme.palette.primary.main,
}))

const HeaderInner = () => {
  const { t, i18n } = useTranslation('common')
  const [stateTitleHeader, setStateTitleHeader] = useState('')
  const [stateAskTheUser, setStateAskTheUser] = useState(false)
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  // const install = usePWAInstall()
  const dispatch = useAppDispatch()
  const userInfo = useAppSelector((state) => state.userInfo)
  const notificationHistory = useAppSelector(
    (state) => state.notificationHistory
  )
  // const router = useRouter()
  // next theme
  const { setTheme } = useTheme()
  // handle setting user
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  )
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  // const handleClose = () => {
  //   setOpenWorkLog(false)
  // }
  // handle setting user

  // setting sidebar
  // const [sidebarOpen, setSideBarOpen] = useState(false)
  // const handleViewSidebar = () => {
  //   setSideBarOpen(!sidebarOpen)
  // }
  // const handleClickAway = () => {
  //   setSideBarOpen(false)
  // }

  useEffect(() => {
    dispatch(userInfoActions.doUserInfo())
  }, [dispatch])
  useEffect(() => {
    if (platform() === 'SUPPLIER' && userInfo?.data?.is_master === false) {
      dispatch(loadingActions.doLoading())
      getListShipping()
        .then((res) => {
          const { data } = res
          dispatch(loadingActions.doLoadingSuccess())
          if (data.data.length === 0) {
            setStateAskTheUser(true)
            return
          }
          setStateAskTheUser(false)
        })
        .catch(({ response }) => {
          const { status, data } = response
          dispatch(loadingActions.doLoadingFailure())

          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    const routerPathName = router.pathname.split('/')
    setStateTitleHeader(routerPathName[2])
    if (routerPathName[2] === 'market-place') {
      setStateTitleHeader('Marketplace')
    } else if (routerPathName[2] === 'crm') {
      setStateTitleHeader('Customer Relationship Management')
    } else if (routerPathName[2] === 'notification-configuration') {
      setStateTitleHeader('Notification Configuration')
    } else if (routerPathName[2] === 'notification-history') {
      setStateTitleHeader('Notification history')
    } else if (routerPathName[2] === 'request-supplier') {
      setStateTitleHeader('Supplier Sign Up Request')
    } else if (routerPathName[2] === 'pos') {
      setStateTitleHeader('POS')
    } else if (routerPathName[2] === 'hrm') {
      setStateTitleHeader('HRM')
    } else if (routerPathName[2] === 'account-receivable') {
      setStateTitleHeader('Account receivable')
    } else if (routerPathName[2] === 'account-payable') {
      setStateTitleHeader('Account payable')
    } else {
      setStateTitleHeader(routerPathName[2])
    }
    console.log('routerPathName', routerPathName)
  }, [router])
  // fix error when use next theme
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    dispatch(notificationHistoryActions.doNotificationHistory())
    setTheme('light')
  }, [])

  useEffect(() => {
    if (userInfo?.data?.is_master === true) {
      if (
        platform() === 'SUPPLIER' &&
        router.pathname !== '/supplier/dashboard'
      ) {
        router.push('/404')
      }
      if (
        platform() === 'RETAILER' &&
        router.pathname !== '/retailer/dashboard'
      ) {
        router.push('/404')
      }
    }
  }, [router, userInfo])
  if (!mounted) {
    return null
  }
  // fix error when use next theme

  // function
  const handleLogout = () => {
    // dispatch(loginActions.doLogout())
    dispatch(loadingActions.doLoading())
    logOutAPI()
      .then(() => {
        doDeactiveToken(localStorage.getItem('token-device') as string).then(
          () => {
            window.location.href = `${
              router.locale !== router.defaultLocale ? `/${router.locale}` : ''
            }/login`
          }
        )
        dispatch(loadingActions.doLoadingSuccess())

        Cookies.remove('token')
        Cookies.remove('refreshToken')
        // router.push('/login')
        localStorage.clear()
        pushMessage('Logout success', 'success')
        window.location.href = `${
          router.locale !== router.defaultLocale ? `/${router.locale}` : ''
        }/login`
      })
      .catch(() => {
        dispatch(loadingActions.doLoadingFailure())
        pushMessage('Error', 'error')
      })
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        {stateAskTheUser && platform() === 'SUPPLIER' ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography sx={{ color: '#1DB46A', fontWeight: 700 }}>
              Kindly establish the pickup and return locations as required.
            </Typography>
            <a
              href={`/${platform().toLowerCase()}/setting/shipping?tab=shipping-address`}
              style={{
                textDecoration: 'underline',
                fontWeight: 700,
                color: '#1DB46A',
              }}
            >
              Go Now
            </a>
          </Stack>
        ) : (
          <>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
                textTransform: 'capitalize',
              }}
            >
              {t(`${stateTitleHeader}` as any)}
            </Typography>
          </>
        )}

        {/* <FormControlLabel
          control={
            <MaterialUISwitch
              sx={{ m: 1 }}
              checked={theme === 'dark' ? true : false}
              onChange={() => {
                theme === 'dark' ? setTheme('light') : setTheme('dark')
              }}
            />
          }
          label=""
        /> */}
        {/* <button onClick={install}>Install</button> */}
      </Box>
      <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
        <Select
          onChange={(e) => {
            router.push(router.asPath, undefined, {
              locale: e.target.value as string,
            })
            i18n?.changeLanguage(`${e.target?.value}`)
          }}
          sx={{ borderRadius: '8px' }}
          value={i18n.language}
          size="small"
        >
          <MenuItem value="en">EN</MenuItem>
          <MenuItem value="es">ES</MenuItem>
        </Select>

        {userInfo?.data?.user_type !== 'ADMIN' && (
          <>
            {userInfo?.data?.is_master === false && (
              <>
                <Tooltip title="Create Work Log">
                  <LoggingTime />
                </Tooltip>

                <Link
                  href={`/${platform().toLowerCase()}/setting/notification-history/?tab=unread`}
                >
                  <a>
                    <IconButton size="large" color="inherit" sx={{ mr: 2 }}>
                      <Badge
                        badgeContent={notificationHistory.unRead}
                        color="error"
                      >
                        <BellCustom size={20} />
                      </Badge>
                    </IconButton>
                  </a>
                </Link>
              </>
            )}
          </>
        )}

        <Box sx={{ flexGrow: 0 }}>
          <IconButton onClick={handleOpenUserMenu}>
            <Avatar alt={userInfo.data.first_name} src={userInfo.data.avatar} />
          </IconButton>

          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {userInfo?.data?.user_type !== 'ADMIN' && (
              <>
                {userInfo?.data?.is_master === false && (
                  <>
                    <Link href={`/${platform().toLowerCase()}/account`}>
                      <a>
                        <MenuItem onClick={handleCloseUserMenu}>
                          <Typography textAlign="center">
                            {t('myAccount')}
                          </Typography>
                        </MenuItem>
                      </a>
                    </Link>
                    <Link href={`/${platform().toLowerCase()}/business`}>
                      <a>
                        <MenuItem onClick={handleCloseUserMenu}>
                          <Typography textAlign="center">
                            {t('manageBusiness')}
                          </Typography>
                        </MenuItem>
                      </a>
                    </Link>
                  </>
                )}
              </>
            )}

            {/* <Link
              href={`/${platform().toLowerCase()}/notification-configuration`}
            >
              <a>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">
                    Notification Configuration
                  </Typography>
                </MenuItem>
              </a>
            </Link> */}
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">{t('logout')}</Typography>
            </MenuItem>
          </Menu>
        </Box>
        {/* <Stack direction="row" alignItems="center">
          <ClickAwayListener onClickAway={handleClickAway}>
            <Box>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleViewSidebar}
              >
                <TuneIconCustom />
              </IconButton>
              <SideBarSetting isOpen={sidebarOpen} />
            </Box>
          </ClickAwayListener>
        </Stack> */}
      </Box>

      {/* <CreateUpdateWorkLogComponent open={openWorkLog} onClose={handleClose} /> */}
    </>
  )
}

export default HeaderInner
