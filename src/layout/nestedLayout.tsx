import type { ReactElement } from 'react'
import React, { useEffect, useState, createContext } from 'react'
// import PropTypes from 'prop-types'
// import classNames from 'classnames'
// import { withStyles } from '@material-ui/core/styles'
import { CSSObject, Theme, styled } from '@mui/material/styles'

import Image from 'next/image'
import Link from 'next/link'
import Logo from 'public/images/logo.svg'
// import { useRouter } from 'next/router'

import MenuIcon from '@mui/icons-material/Menu'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import useMediaQuery from '@mui/material/useMediaQuery'
import HeaderInner from './header'
import SideBar from './sidebar'
import WrapLayout from './wrapLayout'

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
import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { useRouter } from 'next/router'

// import classes from './styles.module.scss'

// redux
// import { useAppSelector } from 'src/store/hooks'

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
            main: '#1DB46A',
            // main: '#34DC75',
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
    // setMode(theme === 'dark' ? 'dark' : 'light')
    setMode('light')
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
type ContextType = {
  setOpen(value: boolean): void
}
export const OpenSideBar = createContext<ContextType | undefined>(undefined)
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
  tablet?: boolean
}

const BoxMain = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open, tablet }) => ({
  width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - 65px)`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  ...(tablet && {
    maxWidth: `calc(100% - 65px)`,
    marginLeft: '65px',
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
})<AppBarProps>(({ theme, open, tablet }) => ({
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
  zIndex: theme.zIndex.drawer,
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
  ...(tablet && {
    left: `calc(${theme.spacing(8)} + 1px)`,
    width: `calc(100% - ${theme.spacing(8)} - 1px)`,
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
interface ProductListInRetailOrderType {
  name: string
  quantity: number
  total: number
}
interface OtherProductInRetailOrderType {
  product_name: string
  quantity: number
  total: number
}
interface RetailOrderDetailType {
  id: number
  code: string
  order_date: string
  items: ProductListInRetailOrderType[]
  other_products: OtherProductInRetailOrderType[]
  total_billing: number
  total_tip: number
  total_value: number
}
export interface RetailOrderDetailResponseType {
  data: RetailOrderDetailType
  errors?: any
}
const getRetailDetailOrder = (
  barcode: string
): Promise<AxiosResponse<RetailOrderDetailResponseType>> => {
  return callAPIWithToken({
    url: `/api/organization/retail-order/barcode/?code=${barcode}`,
    method: 'get',
  })
}

const NestedLayout: React.FC<Props> = ({ children }: Props) => {
  const tablet = useMediaQuery('(max-width:1199px)')
  const router = useRouter()
  const [open, setOpen] = React.useState(tablet ? false : true)
  const handleDrawer = () => {
    setOpen(!open)
  }

  let barcodeScan = ''
  useEffect(() => {
    function handleKeydown(e: any) {
      if (
        e.keyCode === 13 &&
        barcodeScan.length > 3 &&
        barcodeScan.substring(0, 3) === 'VRO'
      ) {
        console.log('zzz', barcodeScan)
        handleGetBarcode(barcodeScan)
        barcodeScan = ''

        return
      }
      if (e.keyCode === 16) {
        return
      }
      barcodeScan += e.key
    }
    // setTimeout(() => {
    //   barcodeScan = ''
    // }, 100)
    console.log('trigger barcode')
    document.addEventListener('keydown', handleKeydown)
    return function cleanup() {
      document.removeEventListener('keydown', handleKeydown)
    }
  })
  const handleGetBarcode = (barcode: string) => {
    getRetailDetailOrder(barcode)
      .then((res) => {
        const { data } = res.data

        router.push(`/retailer/pos/retail-order/detail/${data.id}`)
      })
      .catch(() => {
        console.log('response')
      })
  }
  useEffect(() => {
    tablet ? setOpen(false) : setOpen(true)
  }, [tablet])

  useEffect(() => {
    document.body.classList.add('nested-layout')
  }, [])

  return (
    <WrapLayout>
      <RequireAuth>
        <ThemeProviderNext>
          <ThemeMui>
            <Box sx={{ display: 'flex' }}>
              <CssBaseline />
              <AppBar position="fixed" open={open} tablet={tablet}>
                <Toolbar>
                  <HeaderInner />
                </Toolbar>
              </AppBar>
              <Drawer
                variant="permanent"
                open={open}
                style={
                  tablet
                    ? {
                        position: 'fixed',
                        zIndex: 10000,
                      }
                    : {}
                }
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                {/* <DrawerHeader /> */}
                <LogoHeader open={open}>
                  {open && (
                    <Link href="/">
                      <a>
                        <Image
                          src={'/' + `${Logo}`}
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
                <OpenSideBar.Provider value={{ setOpen }}>
                  <SideBar open={open} />
                </OpenSideBar.Provider>
              </Drawer>
              <BoxMain
                component="main"
                sx={{ flexGrow: 1, p: 3 }}
                open={open}
                tablet={tablet}
              >
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
