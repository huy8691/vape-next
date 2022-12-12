import React, { useState, useEffect } from 'react'
import type { ReactElement } from 'react'
// import PropTypes from 'prop-types'
// import classNames from 'classnames'
// import { withStyles } from '@material-ui/core/styles'
import { styled, Theme, CSSObject } from '@mui/material/styles'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import MuiDrawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import CssBaseline from '@mui/material/CssBaseline'
import MenuIcon from '@mui/icons-material/Menu'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import WrapLayout from './wrapLayout'
import HeaderInner from './header'
import SideBar from './sidebar'

import { createContext } from 'react'

import {
  ThemeProvider as ThemeProviderMui,
  createTheme,
} from '@mui/material/styles'
// import { Shadows } from '@mui/material/styles/shadows'
import {
  ThemeProvider as ThemeProviderNext,
  useTheme as useThemeNext,
} from 'next-themes'

import RequireAuth from './requireAuth'
// import classes from './styles.module.scss'

// redux
import { useAppSelector } from 'src/store/hooks'

// import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
type Props = {
  children: ReactElement
}

const ThemeMui = ({ children }: Props) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const { theme } = useThemeNext()

  const themeMuiUi = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#34DC75',
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
        },
      }),
    [mode]
  )
  useEffect(() => {
    setMode(theme === 'dark' ? 'dark' : 'light')
  }, [theme])

  // useEffect only runs on the client, so now we can safely show the UI
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  return <ThemeProviderMui theme={themeMuiUi}>{children}</ThemeProviderMui>
}

// config layout
const drawerWidth = 250
export const DrawerWidthContext = createContext({
  drawerWidth: drawerWidth,
  open: true,
})
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(8)} + 1px)`,
  // [theme.breakpoints.up('sm')]: {
  //   width: `calc(${theme.spacing(8)} + 1px)`,
  // },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

const BoxMain = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  width: open ? `calc(100vw - ${drawerWidth}px)` : `calc(100vw - 65px)`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
}))

const LogoHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: open ? 'space-between' : 'center',
  padding: open ? theme.spacing(1, 2) : theme.spacing(1, 0),
  ...theme.mixins.toolbar,
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  left: `calc(${theme.spacing(8)} + 1px)`,
  width: `calc(100% - ${theme.spacing(8)} - 1px)`,
  // [theme.breakpoints.up('sm')]: {
  //   width: `calc(100% - ${`calc(${theme.spacing(8)} + 1px)`}`,
  //   left: `calc(${theme.spacing(8)} + 1px)`,
  // },
  boxShadow:
    '0px 1px 0px -1px rgb(0 0 0 / 20%), 0px 0px 3px 0px rgb(0 0 0 / 14%), 0px 0px 0px 0px rgb(0 0 0 / 12%)',
  backgroundColor:
    theme.palette.mode === 'light' ? '#fff' : theme.palette.background.default,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'left'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    left: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'left'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}))
// config layout

const NestedLayout: React.FC<Props> = ({ children }: Props) => {
  const [open, setOpen] = React.useState(true)
  const handleDrawer = () => {
    setOpen(!open)
  }

  // const userInfo = useAppSelector((state) => state.userInfo)
  // const router = useRouter()

  // const role = userInfo.data.user_type
  // let allowed = true
  // if (router.pathname.startsWith('/cart') && role !== 'MERCHANT') {
  //   allowed = false
  // }
  // if (router.pathname.startsWith('/customer') && role !== 'SUPPLIER') {
  //   allowed = false
  // }
  return (
    <WrapLayout>
      <RequireAuth>
        <ThemeProviderNext>
          <ThemeMui>
            <Box sx={{ display: 'flex' }}>
              <CssBaseline />
              <AppBar position="fixed" open={open}>
                <Toolbar>
                  <HeaderInner />
                </Toolbar>
              </AppBar>
              <Drawer variant="permanent" open={open}>
                {/* <DrawerHeader /> */}
                <LogoHeader open={open}>
                  {open && (
                    <Link href="/">
                      <a>
                        <Image
                          src="/images/logo.svg"
                          alt="Logo"
                          width="100"
                          height="40"
                        />
                      </a>
                    </Link>
                  )}
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawer}
                    edge="start"
                    sx={{
                      marginLeft: 0,
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </LogoHeader>
                <SideBar open={open} />
              </Drawer>
              <BoxMain component="main" sx={{ flexGrow: 1, p: 3 }} open={open}>
                <DrawerHeader />
                <DrawerWidthContext.Provider
                  value={{ drawerWidth: drawerWidth, open: open }}
                >
                  {children}
                </DrawerWidthContext.Provider>
              </BoxMain>
            </Box>
          </ThemeMui>
        </ThemeProviderNext>
      </RequireAuth>
    </WrapLayout>
  )
}

export default NestedLayout
