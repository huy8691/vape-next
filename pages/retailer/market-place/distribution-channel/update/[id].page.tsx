import Head from 'next/head'
import { Breadcrumbs, Typography } from '@mui/material'
import React from 'react'

import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'

import NestedLayout from 'src/layout/nestedLayout'
import CreateDistributionChannelForm from 'pages/_common/market-place/distribution-channel/create'
import Link from 'next/link'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

//Form and validate

const CreateDistributionChannel: NextPageWithLayout = () => {
  const { t } = useTranslation('dc')

  return (
    <>
      <Head>
        <title>{t('title')} | VAPE</title>
      </Head>
      <TypographyTitlePage sx={{ marginBottom: '15px' }}>
        {t('titleUpdateDC')}
      </TypographyTitlePage>

      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/retailer/market-place/distribution-channel/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('titleUpdateDC')}</Typography>
      </Breadcrumbs>

      <CreateDistributionChannelForm type="update" />
    </>
  )
}

CreateDistributionChannel.getLayout = function getLayout(page: ReactElement) {
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
      ...(await serverSideTranslations(locale, ['common', 'account', 'dc'])),
    },
  }
}

export default CreateDistributionChannel
