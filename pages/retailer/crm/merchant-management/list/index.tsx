import { Breadcrumbs, Typography } from '@mui/material'
import Head from 'next/head'

import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'

import NestedLayout from 'src/layout/nestedLayout'

//Form and validate

import MerchantManagement from 'pages/_common/crm/merchant-management/list'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const MerchantManagementMerchant: NextPageWithLayout = () => {
  const { t } = useTranslation('merchant-management')
  return (
    <>
      <Head>
        <title>{t('title')} | VAPE</title>
      </Head>
      <TypographyTitlePage sx={{ marginBottom: '15px' }}>
        {t('title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('title')}</Typography>
      </Breadcrumbs>

      <MerchantManagement />
    </>
  )
}

MerchantManagementMerchant.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
MerchantManagementMerchant.permissionPage = {
  key_module: KEY_MODULE.Merchant,
  permission_rule: PERMISSION_RULE.ViewList,
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'merchant-management',
      ])),
    },
  }
}
export default MerchantManagementMerchant
