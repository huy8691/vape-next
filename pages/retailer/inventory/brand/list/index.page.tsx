/* eslint-disable jsx-a11y/alt-text */
import { Breadcrumbs, Typography } from '@mui/material'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
// import SettingsIcon from '@mui/icons-material/Settings'
import ListBrand from 'pages/_common/inventory/brand/list'
import { TypographyTitlePage } from 'src/components'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Brand: NextPageWithLayout = () => {
  //downloadfile
  const { t } = useTranslation(['common', 'brand'])

  return (
    <>
      <Head>
        <title>{t('brand:title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('brand:title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('brand:title')}</Typography>
      </Breadcrumbs>
      <ListBrand />
    </>
  )
}
Brand.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
Brand.permissionPage = {
  key_module: KEY_MODULE.Brand,
  permission_rule: PERMISSION_RULE.MerchantViewList,
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'account', 'brand'])),
    },
  }
}
export default Brand
