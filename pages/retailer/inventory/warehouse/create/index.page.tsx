import { Breadcrumbs, Typography } from '@mui/material'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import CreateWarehouseComponent from 'pages/_common/inventory/warehouse/create'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

const CreateWarehouse: NextPageWithLayout = () => {
  const { t } = useTranslation('warehouse')
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('createUpdate.createNewWarehouse')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/retailer/inventory/warehouse/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('createUpdate.createNewWarehouse')}</Typography>
      </Breadcrumbs>
      <CreateWarehouseComponent />
    </>
  )
}
CreateWarehouse.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateWarehouse.permissionPage = {
  key_module: KEY_MODULE.Warehouse,
  permission_rule: PERMISSION_RULE.Create,
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
export default CreateWarehouse
