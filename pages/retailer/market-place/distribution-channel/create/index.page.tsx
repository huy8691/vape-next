import Head from 'next/head'
import { Breadcrumbs, Typography } from '@mui/material'

import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'

import NestedLayout from 'src/layout/nestedLayout'
import CreateDistributionChannelForm from 'pages/_common/market-place/distribution-channel/create'
import Link from 'next/link'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

//Form and validate

const CreateDistributionChannel: NextPageWithLayout = () => {
  const { t } = useTranslation('dc')
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage sx={{ marginBottom: '15px' }}>
        {t('titleCreateDC')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/retailer/market-place/distribution-channel/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('titleCreateDC')}</Typography>
      </Breadcrumbs>

      <CreateDistributionChannelForm type="create" />
    </>
  )
}

CreateDistributionChannel.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateDistributionChannel.permissionPage = {
  key_module: KEY_MODULE.DistributionChannel,
  permission_rule: PERMISSION_RULE.Create,
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'account', 'dc'])),
    },
  }
}
export default CreateDistributionChannel
