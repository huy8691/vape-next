import { Breadcrumbs, Typography } from '@mui/material'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement, useEffect } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

import Head from 'next/head'
import Link from 'next/link'
import { KEY_MODULE, PERMISSION_RULE, platform } from 'src/utils/global.utils'
import CreateVoucherComponent from 'pages/_common/promotion/voucher/create'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

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
        <title>Voucher Management | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        Create Voucher
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href={`/${platform().toLowerCase()}/promotion/voucher/list`}>
          <a>Voucher Management</a>
        </Link>
        <Typography>Create Voucher</Typography>
      </Breadcrumbs>
      <CreateVoucherComponent />
    </>
  )
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'voucher',
        'account',
      ])),
    },
  }
}

UpdateProduct.permissionPage = {
  key_module: KEY_MODULE.Map,
  permission_rule: PERMISSION_RULE.ViewList,
}
UpdateProduct.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default UpdateProduct
