import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { useAppSelector } from 'src/store/hooks'

// mui

// import SectionChart from './_dashboard/sectionChart'

// layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'
// import { platform } from 'src/utils/global.utils'

const Home: NextPageWithLayout = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const userInfo = useAppSelector((state) => state.userInfo)

  useEffect(() => {
    if (userInfo.data.user_type === 'MERCHANT') {
      router.push('/retailer/dashboard?type=ALL')
    }
    if (userInfo.data.user_type === 'SUPPLIER') {
      router.push('/supplier/dashboard?type=ALL')
    }
    if (userInfo.data.user_type === 'ADMIN') {
      router.push('/admin/request-supplier')
    }
  }, [router, userInfo])

  // fix error when use next theme
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  // fix error when use next theme

  return (
    <>
      <Head>
        <title>{t('home')} | TWSS</title>
      </Head>

      {/* <SectionChart /> */}
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Home
