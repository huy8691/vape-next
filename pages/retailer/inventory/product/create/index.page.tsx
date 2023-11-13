import { Breadcrumbs, Typography } from '@mui/material'
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useEffect } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { TypographyTitlePage } from 'src/components'

import Head from 'next/head'

import Link from 'next/link'
import CreateProductComponent from 'pages/_common/inventory/product/create'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const CreateProduct: NextPageWithLayout = () => {
  // show popup when user navigate to new page
  const { t } = useTranslation('product')
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
        <title>{t('createUpdate.createNewProduct')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('createUpdate.createNewProduct')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/retailer/inventory/product/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('createUpdate.createNewProduct')}</Typography>
      </Breadcrumbs>
      <CreateProductComponent />
    </>
  )
}
CreateProduct.permissionPage = {
  key_module: KEY_MODULE.Inventory,
  permission_rule: PERMISSION_RULE.MerchantCreate,
}
CreateProduct.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'product',
      ])),
    },
  }
}
export default CreateProduct
