import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

import { Breadcrumbs, Typography } from '@mui/material'
import ListWarehouseComponent from 'pages/_common/inventory/warehouse/list'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const WarehouseManagement: NextPageWithLayout = () => {
  const { t } = useTranslation('warehouse')
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('title')}</Typography>
      </Breadcrumbs>
      <ListWarehouseComponent />
    </>
  )
}
WarehouseManagement.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
WarehouseManagement.permissionPage = {
  key_module: KEY_MODULE.Warehouse,
  permission_rule: PERMISSION_RULE.ViewList,
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'warehouse',
      ])),
    },
  }
}
export default WarehouseManagement
