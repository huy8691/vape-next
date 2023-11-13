import { ReactElement } from 'react'

import { Breadcrumbs, Typography } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import CreateManufacturerComponent from 'pages/_common/inventory/manufacturer/create'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

// form

const CreateManufacturer: NextPageWithLayout = () => {
  const { t } = useTranslation('manufacturer')
  return (
    <>
      <Head>
        <title>{t('createUpdate.createNewManufacturer')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('createUpdate.createNewManufacturer')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/retailer/inventory/manufacturer/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('createUpdate.createNewManufacturer')}</Typography>
      </Breadcrumbs>
      <CreateManufacturerComponent />
    </>
  )
}
CreateManufacturer.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateManufacturer.permissionPage = {
  key_module: KEY_MODULE.Manufacturer,
  permission_rule: PERMISSION_RULE.MerchantCreate,
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
export default CreateManufacturer
