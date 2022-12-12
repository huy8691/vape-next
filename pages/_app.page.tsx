import '../styles/globals.scss'

import React from 'react'
import { ThemeProvider as ThemeProviderNext } from 'next-themes'

import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
  theme?: string
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page)

  return getLayout(
    <>
      <ThemeProviderNext forcedTheme={Component.theme || 'light'}>
        <Component {...pageProps} />
      </ThemeProviderNext>
    </>
  )
}
export default MyApp
