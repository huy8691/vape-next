import { Breadcrumbs, Typography } from '@mui/material'
import { GetStaticPaths } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import MerchantDetail from 'pages/_common/crm/merchant-management/detail'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

//Notification

const MerchantDetailSupplier: NextPageWithLayout = () => {
  const { t } = useTranslation('merchant-management')
  return (
    <>
      <Head>
        <title>{t('title')} | VAPE</title>
      </Head>
      <TypographyTitlePage>{t('details.retailerDetails')}</TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '25px' }}
      >
        <Link href={`/supplier/crm/merchant-management/list`}>
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
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'merchant-management',
      ])),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
MerchantDetailSupplier.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
MerchantDetailSupplier.permissionPage = {
  key_module: KEY_MODULE.Merchant,
  permission_rule: PERMISSION_RULE.ViewDetails,
}
export default MerchantDetailSupplier
