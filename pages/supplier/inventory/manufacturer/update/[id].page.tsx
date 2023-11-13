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
import { GetStaticPaths } from 'next'
import { useTranslation } from 'react-i18next'

const UpdateManufacturer: NextPageWithLayout = () => {
  const { t } = useTranslation(['manufacturer'])
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
        <Typography>{t('createUpdate.updateManufacturer')}</Typography>
      </Breadcrumbs>
      <UpdateManufacturerComponent />
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
        'manufacturer',
      ])),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: false,
  }
}

UpdateManufacturer.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
UpdateManufacturer.permissionPage = {
  key_module: KEY_MODULE.Manufacturer,
  permission_rule: PERMISSION_RULE.SupplierUpdate,
}
export default UpdateManufacturer
