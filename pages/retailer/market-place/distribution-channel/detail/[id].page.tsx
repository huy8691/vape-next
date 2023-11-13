import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

//MUI
import { Breadcrumbs, Typography } from '@mui/material'

//src and styled
import Link from 'next/link'

import { TypographyTitlePage } from 'src/components'

import DetailMerchantDistributionChannelComponent from 'pages/_common/market-place/distribution-channel/detail'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const DistributionChannel: NextPageWithLayout = () => {
  const { t } = useTranslation('dc')

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
        sx={{ marginBottom: '35px' }}
      >
        <Link href="/retailer/market-place/distribution-channel/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('channelDetails')}</Typography>
      </Breadcrumbs>

      <DetailMerchantDistributionChannelComponent />
    </>
  )
}

DistributionChannel.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
DistributionChannel.permissionPage = {
  key_module: KEY_MODULE.DistributionChannel,
  permission_rule: PERMISSION_RULE.ViewDetails,
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
export default DistributionChannel
