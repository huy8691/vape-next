/* eslint-disable react-hooks/exhaustive-deps */
//React/Next
import Head from 'next/head'
import { ReactElement } from 'react'

//API

//material
import { Breadcrumbs, Typography } from '@mui/material'

// import { SelectChangeEvent } from '@mui/material/Select'

import { NextPageWithLayout } from 'pages/_app.page'
import ListManufacturerComponent from 'pages/_common/inventory/manufacturer/list'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

// other

// const renderColorStatus = (status: boolean) => {
//   const result = [
//     { status: true, color: '#1DB46A', text: 'Active' },
//     { status: false, color: '#E02D3C', text: 'DeActive' },
//   ].find((item) => {
//     return item.status === status
//   })
//   return result
// }

const ListManufacturer: NextPageWithLayout = () => {
  //
  const { t } = useTranslation(['manufacturer'])

  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('title')}</Typography>
      </Breadcrumbs>
      <ListManufacturerComponent />
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

ListManufacturer.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
ListManufacturer.permissionPage = {
  key_module: KEY_MODULE.Manufacturer,
  permission_rule: PERMISSION_RULE.SupplierViewList,
}
export default ListManufacturer
