import Head from 'next/head'
import { Breadcrumbs, Typography } from '@mui/material'
import React from 'react'

import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'

import NestedLayout from 'src/layout/nestedLayout'
import CreateDistributionChannelForm from 'pages/_common/market-place/distribution-channel/create'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticPaths } from 'next'
import { useTranslation } from 'react-i18next'

//Form and validate

const UpdateDistributionChannel: NextPageWithLayout = () => {
  const { t } = useTranslation('dc')
  return (
    <>
      <Head>
        <title>{t('distributionChannel')} | VAPE</title>
      </Head>
      <TypographyTitlePage sx={{ marginBottom: '15px' }}>
        {t('updateDistributionChannel')}
      </TypographyTitlePage>

      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('distributionChannel')}</Typography>
        <Typography>{t('updateDistributionChannel')}</Typography>
      </Breadcrumbs>

      <CreateDistributionChannelForm type="update" />
    </>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'account', 'dc'])),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

UpdateDistributionChannel.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
UpdateDistributionChannel.permissionPage = {
  key_module: KEY_MODULE.DistributionChannel,
  permission_rule: PERMISSION_RULE.Update,
}

export default UpdateDistributionChannel
