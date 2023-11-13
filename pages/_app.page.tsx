import { Box, Stack, Typography } from '@mui/material'
import type { NextPage } from 'next'
import { appWithTranslation } from 'next-i18next'
import { ThemeProvider as ThemeProviderNext } from 'next-themes'
import type { AppProps } from 'next/app'
import Image from 'next/image'
import Link from 'next/link'
import type { ReactElement, ReactNode } from 'react'
import 'react-credit-cards-2/dist/lib/styles.scss'
import { ButtonCustom } from 'src/components'
import { useAppSelector } from 'src/store/hooks'
import { checkPermission } from 'src/utils/global.utils'
// import NextI18nextConfig from '../next-i18next.config'
import '../styles/globals.scss'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
  theme?: string
  permissionPage?: {
    key_module: string
    permission_rule: string
  }
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
type Props = {
  children: ReactElement
  permissionPage: any
}
const InnerPage = ({ children, permissionPage }: Props) => {
  const permission = useAppSelector((state) => state.permission)
  console.log('permission', permission)
  if (!permissionPage) {
    return <>{children}</>
  }

  if (
    checkPermission(
      permission.data,
      permissionPage.key_module,
      permissionPage.permission_rule
    )
  ) {
    return <>{children}</>
  }
  if (
    !checkPermission(
      permission.data,
      permissionPage.key_module,
      permissionPage.permission_rule
    ) &&
    permission.success
  ) {
    console.log('chay vao 403')
    return (
      <Stack spacing="50px" alignItems={'center'}>
        <Box>
          <Image
            src={'/' + '/images/image403.png'}
            alt=""
            width={500}
            height={250}
          />
        </Box>

        <Typography
          color="#49516F"
          align="center"
          fontSize="16px"
          fontWeight="700"
        >
          This page do not exist!
        </Typography>

        <Link color="link" href="/" style={{ textAlign: 'center' }}>
          <a>
            <ButtonCustom variant="contained" size="large">
              Take Me Back
            </ButtonCustom>
          </a>
        </Link>
      </Stack>
    )
  }
  return <></>
}
const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)
  return getLayout(
    <ThemeProviderNext forcedTheme={Component.theme || 'light'}>
      <InnerPage permissionPage={Component.permissionPage}>
        <Component {...pageProps} />
      </InnerPage>
    </ThemeProviderNext>
  )
}
export default appWithTranslation(MyApp as any)
