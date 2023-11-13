import { Breadcrumbs, Typography } from '@mui/material'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement, useEffect } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { KEY_MODULE, PERMISSION_RULE, platform } from 'src/utils/global.utils'
import UpdateExternalOrderComponent from 'pages/_common/apar/external-order/update'

const UpdateProduct: NextPageWithLayout = () => {
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
        <title>External Order | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        Update External Order
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link
          href={`/${platform().toLowerCase()}/account-payable/external-order/list`}
        >
          <a>External Order</a>
        </Link>
        <Typography>Update External Order</Typography>
      </Breadcrumbs>
      <UpdateExternalOrderComponent />
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
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

UpdateProduct.permissionPage = {
  key_module: KEY_MODULE.Inventory,
  permission_rule: PERMISSION_RULE.MerchantUpdate,
}
UpdateProduct.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default UpdateProduct
