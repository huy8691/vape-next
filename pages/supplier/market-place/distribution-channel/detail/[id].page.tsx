import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Typography } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'

//Src and styled
import NestedLayout from 'src/layout/nestedLayout'
import DetailMerchantDistributionChannelComponent from 'pages/_common/market-place/distribution-channel/detail/index'
import { TypographyHead } from './styled'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticPaths } from 'next'
import { useTranslation } from 'react-i18next'

const DetailMerchantDistributionChannel: NextPageWithLayout = () => {
  const { t } = useTranslation(['dc'])
  return (
    <>
      <Head>
        <title>{t('detailDistributionChannel')} | TWSS</title>
      </Head>
      <TypographyHead variant="h1" mb={2}>
        {t('distributionChannelDetails')}
      </TypographyHead>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/supplier/market-place/distribution-channel/list">
          <a>{t('distributionChannel')}</a>
        </Link>
        <Typography>{t('distributionChannelDetails')}</Typography>
      </Breadcrumbs>

      <DetailMerchantDistributionChannelComponent />
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

DetailMerchantDistributionChannel.getLayout = function getLayout(
  page: ReactElement
) {
  return <NestedLayout>{page}</NestedLayout>
}
DetailMerchantDistributionChannel.permissionPage = {
  key_module: KEY_MODULE.DistributionChannel,
  permission_rule: PERMISSION_RULE.ViewDetails,
}
export default DetailMerchantDistributionChannel
