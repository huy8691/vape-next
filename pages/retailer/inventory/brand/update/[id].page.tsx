import { Breadcrumbs, Typography } from '@mui/material'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

import Head from 'next/head'
import UpdateBrandComponent from 'pages/_common/inventory/brand/update'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const UpdateBrand: NextPageWithLayout = () => {
  const { t } = useTranslation('brand')
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('createUpdate.updateProductBrand')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/retailer/inventory/brand/list">
          <a>{t('title')}</a>
        </Link>
        <Typography> {t('createUpdate.updateProductBrand')}</Typography>
      </Breadcrumbs>
      <UpdateBrandComponent />
    </>
  )
}

UpdateBrand.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
UpdateBrand.permissionPage = {
  key_module: KEY_MODULE.Brand,
  permission_rule: PERMISSION_RULE.MerchantUpdate,
}
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'account', 'brand'])),
    },
  }
}
export default UpdateBrand
