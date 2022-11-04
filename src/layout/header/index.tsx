import React, { useState, useEffect } from 'react'

import { useRouter } from 'next/router'

import { useAppDispatch } from 'src/store/hooks'
import { logOutAPI } from '../../../pages/login/loginAPI'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import Cookies from 'js-cookie'

// mui
import { styled } from '@mui/material/styles'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import TuneIcon from '@mui/icons-material/Tune'
import Stack from '@mui/material/Stack'
import ClickAwayListener from '@mui/material/ClickAwayListener'
// end mui

import SideBarSetting from '../sidebarSetting'

// next theme
import { useTheme } from 'next-themes'

// other
import { Bell } from 'phosphor-react'
// other

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}))

// style
const TuneIconCustom = styled(TuneIcon)({
  position: 'relative',
  zIndex: 1,
  cursor: 'pointer',
})
const BellCustom = styled(Bell)(({ theme }) => ({
  color: theme.palette.primary.main,
}))

const HeaderInner = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  // next theme
  const { theme, setTheme } = useTheme()
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
  // handle setting user

  // setting sidebar
  const [sidebarOpen, setSideBarOpen] = useState(false)
  const handleViewSidebar = () => {
    setSideBarOpen(!sidebarOpen)
  }
  const handleClickAway = () => {
    setSideBarOpen(false)
  }

  // fix error when use next theme
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
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
        dispatch(loadingActions.doLoadingSuccess())

        Cookies.remove('token')
        // router.push('/login')
        dispatch(
          notificationActions.doNotification({
            message: 'Sign out successfully',
          })
        )
        window.location.href = '/login'
      })
      .catch(() => {
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: 'Error',
            type: 'error',
          })
        )
      })
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <FormControlLabel
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
        />
      </Box>
      <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={10} color="error">
            <BellCustom size={20} />
          </Badge>
        </IconButton>
        <Box sx={{ flexGrow: 0 }}>
          <IconButton onClick={handleOpenUserMenu}>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">Setting</Typography>
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu}>
              <Typography textAlign="center">My account</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <Typography textAlign="center">Logout</Typography>
            </MenuItem>
          </Menu>
        </Box>
        <Stack direction="row" alignItems="center">
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
        </Stack>
      </Box>
    </>
  )
}
export default HeaderInner
