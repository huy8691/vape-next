import { Breadcrumbs, Typography } from '@mui/material'
import { GetStaticPaths } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import UpdateWarehouseComponent from 'pages/_common/inventory/warehouse/update'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

const UpdateWarehouse: NextPageWithLayout = () => {
  const { t } = useTranslation(['warehouse'])
  return (
    <>
      <Head>
        <title>{t('createUpdate.updateWarehouse')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('createUpdate.updateWarehouse')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/supplier/inventory/warehouse/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('createUpdate.updateWarehouse')}</Typography>
      </Breadcrumbs>
      <UpdateWarehouseComponent />
    </>
  )
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'warehouse',
      ])),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

UpdateWarehouse.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
UpdateWarehouse.permissionPage = {
  key_module: KEY_MODULE.Warehouse,
  permission_rule: PERMISSION_RULE.ViewDetails,
}
export default UpdateWarehouse
