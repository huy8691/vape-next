import { Breadcrumbs, Typography } from '@mui/material'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement, useEffect } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import CreateOCRExternalOrderComponent from 'pages/_common/apar/external-order/create-ocr'
import { KEY_MODULE, PERMISSION_RULE, platform } from 'src/utils/global.utils'
import { useTranslation } from 'react-i18next'

const CreateOCRExternalOrder: NextPageWithLayout = () => {
  const { t } = useTranslation('external-order')
  useEffect(() => {
    const handleTabClose = (event: any) => {
      event.preventDefault()
      console.log('beforeunload event triggered')
      return (event.returnValue = 'Are you sure you want to exit?')
    }
    window.addEventListener('beforeunload', handleTabClose)
    return () => {
      window.removeEventListener('beforeunload', handleTabClose)
    }
  }, [])

  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('createExternalOrderByOcr')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link
          href={`/${platform().toLowerCase()}/account-payable/external-order/list`}
        >
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('createExternalOrderByOcr')}</Typography>
      </Breadcrumbs>
      <CreateOCRExternalOrderComponent />
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
        'external-order',
      ])),
    },
  }
}
CreateOCRExternalOrder.permissionPage = {
  key_module: KEY_MODULE.Inventory,
  permission_rule: PERMISSION_RULE.MerchantUpdate,
}
CreateOCRExternalOrder.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default CreateOCRExternalOrder
