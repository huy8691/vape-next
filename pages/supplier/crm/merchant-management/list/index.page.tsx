import { Breadcrumbs, Typography } from '@mui/material'
import Head from 'next/head'

import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'

import NestedLayout from 'src/layout/nestedLayout'

//Form and validate

import MerchantManagement from 'pages/_common/crm/merchant-management/list'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const MerchantManagementSupplier: NextPageWithLayout = () => {
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
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'merchant-management',
      ])),
    },
  }
}

MerchantManagementSupplier.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
MerchantManagementSupplier.permissionPage = {
  key_module: KEY_MODULE.Merchant,
  permission_rule: PERMISSION_RULE.ViewList,
}
export default MerchantManagementSupplier
