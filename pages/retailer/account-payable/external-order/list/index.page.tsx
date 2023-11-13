import { Breadcrumbs, Typography } from '@mui/material'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app.page'
import ListExternalOrderComponent from 'pages/_common/apar/external-order/list'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

const ExternalOrderPage: NextPageWithLayout = () => {
  const { t } = useTranslation('external-order')
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
      <ListExternalOrderComponent />
    </>
  )
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'external-order'])),
    },
  }
}
ExternalOrderPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default ExternalOrderPage
