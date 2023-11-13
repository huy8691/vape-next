import { Breadcrumbs, Typography } from '@mui/material'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import MerchantDetail from 'pages/_common/crm/merchant-management/detail'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

//Notification

const MerchantDetailMerchant: NextPageWithLayout = () => {
  const { t } = useTranslation('merchant-management')
  return (
    <>
      <Head>
        <title>{t('details.retailerDetails')} | VAPE</title>
      </Head>
      <TypographyTitlePage>{t('details.retailerDetails')}</TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '25px' }}
      >
        <Link href={`/retailer/crm/merchant-management/list`}>
          <Typography sx={{ '&:hover': { cursor: 'pointer' } }}>
            {t('title')}
          </Typography>
        </Link>
        <Typography>{t('details.retailerDetails')}</Typography>
      </Breadcrumbs>

      <MerchantDetail />
    </>
  )
}
MerchantDetailMerchant.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
MerchantDetailMerchant.permissionPage = {
  key_module: KEY_MODULE.Merchant,
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
      ...(await serverSideTranslations(locale, [
        'common',
        'merchant-management',
      ])),
    },
  }
}
export default MerchantDetailMerchant
