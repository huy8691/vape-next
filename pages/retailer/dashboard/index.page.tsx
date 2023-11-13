import React, { useState, useEffect, ReactElement } from 'react'

// mui
import Head from 'next/head'
import { Box } from '@mui/material'
import NestedLayout from 'src/layout/nestedLayout'
// import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { default as DashboardTab } from 'pages/_common/report/dashboard'
import { default as DashboardMasterAccount } from 'pages/_common/dashboard-master-account'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useAppSelector } from 'src/store/hooks'
const Dashboard = () => {
  const userInfo = useAppSelector((state) => state.userInfo)
  const { t } = useTranslation(['common', 'report'])
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
    <Box
      sx={{
        background: '#F8F9FC',
        margin: '-24px',
        padding: '24px',
        // height: '100%',
      }}
    >
      <Head>
        <title>{t('report:dashboard.title')} | TWSS</title>
      </Head>
      {userInfo?.data?.is_master === true && <DashboardMasterAccount />}
      {userInfo?.data?.is_master === false && <DashboardTab />}
    </Box>
  )
}
Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'report',
      ])),
    },
  }
}

// Report.permissionPage = {
//   key_module: KEY_MODULE.Brand,
//   permission_rule: PERMISSION_RULE.MerchantCreate,
// }
export default Dashboard
