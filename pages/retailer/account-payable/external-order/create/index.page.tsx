import { Breadcrumbs, Typography } from '@mui/material'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement, useEffect } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

import Head from 'next/head'
import Link from 'next/link'
import { KEY_MODULE, PERMISSION_RULE, platform } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import CreateExternalOrderComponent from 'pages/_common/apar/external-order/create'
import { useTranslation } from 'react-i18next'

const CreateExternalOrder: NextPageWithLayout = () => {
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
        {t('CreateExternalOrder')}
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
        <Typography> {t('CreateExternalOrder')}</Typography>
      </Breadcrumbs>
      <CreateExternalOrderComponent />
    </>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'external-order'])),
    },
  }
}
CreateExternalOrder.permissionPage = {
  key_module: KEY_MODULE.Inventory,
  permission_rule: PERMISSION_RULE.MerchantUpdate,
}
CreateExternalOrder.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default CreateExternalOrder
