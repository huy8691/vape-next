import Head from 'next/head'
import { Breadcrumbs, Typography } from '@mui/material'

import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'

import NestedLayout from 'src/layout/nestedLayout'
import CreateDistributionChannelForm from 'pages/_common/market-place/distribution-channel/create'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

//Form and validate

const CreateDistributionChannel: NextPageWithLayout = () => {
  const { t } = useTranslation(['dc'])
  return (
    <>
      <Head>
        <title>{t('distributionChannel')} | VAPE</title>
      </Head>
      <TypographyTitlePage sx={{ marginBottom: '15px' }}>
        {t('createDistributionChannel')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography> {t('distributionChannel')}</Typography>
        <Typography> {t('createDistributionChannel')}</Typography>
      </Breadcrumbs>
      <CreateDistributionChannelForm type="create" />
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

CreateDistributionChannel.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateDistributionChannel.permissionPage = {
  key_module: KEY_MODULE.Contact,
  permission_rule: PERMISSION_RULE.ViewList,
}
export default CreateDistributionChannel
