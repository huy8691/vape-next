import { Breadcrumbs, Typography } from '@mui/material'
import { GetStaticPaths } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import WarehouseDetailComponent from 'pages/_common/inventory/warehouse/detail'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

const WarehouseDetail: NextPageWithLayout = () => {
  const { t } = useTranslation(['warehouse'])
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('details.warehouseDetail')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '35px' }}
      >
        <Link href="/supplier/inventory/warehouse/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('details.warehouseDetail')}</Typography>
      </Breadcrumbs>
      <WarehouseDetailComponent />
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

WarehouseDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
WarehouseDetail.permissionPage = {
  key_module: KEY_MODULE.Warehouse,
  permission_rule: PERMISSION_RULE.ViewDetails,
}
export default WarehouseDetail
