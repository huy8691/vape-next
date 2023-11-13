import { Breadcrumbs, Typography } from '@mui/material'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

import Head from 'next/head'
import CreateBrandComponent from 'pages/_common/inventory/brand/create'
import { TypographyTitlePage } from 'src/components'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const CreateBrand: NextPageWithLayout = () => {
  const { t } = useTranslation(['brand'])
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('createUpdate.title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/supplier/inventory/brand/list">
          <a> {t('title')}</a>
        </Link>
        <Typography> {t('createUpdate.title')}</Typography>
      </Breadcrumbs>
      <CreateBrandComponent />
    </>
  )
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'account', 'brand'])),
    },
  }
}

CreateBrand.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateBrand.permissionPage = {
  key_module: KEY_MODULE.Brand,
  permission_rule: PERMISSION_RULE.SupplierCreate,
}
export default CreateBrand
