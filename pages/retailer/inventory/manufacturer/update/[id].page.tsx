import { Breadcrumbs, Typography } from '@mui/material'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

import Head from 'next/head'
import Link from 'next/link'
import UpdateManufacturerComponent from 'pages/_common/inventory/manufacturer/update'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const UpdateManufacturer: NextPageWithLayout = () => {
  const { t } = useTranslation('manufacturer')
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('createUpdate.updateManufacturer')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/supplier/inventory/manufacturer/list">
          <a>{t('title')}</a>
        </Link>
        <Typography> {t('createUpdate.updateManufacturer')}</Typography>
      </Breadcrumbs>
      <UpdateManufacturerComponent />
    </>
  )
}
UpdateManufacturer.permissionPage = {
  key_module: KEY_MODULE.Manufacturer,
  permission_rule: PERMISSION_RULE.MerchantUpdate,
}
UpdateManufacturer.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
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
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'manufacturer',
      ])),
    },
  }
}
export default UpdateManufacturer
