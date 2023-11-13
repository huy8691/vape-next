/* eslint-disable react-hooks/exhaustive-deps */
//React/Next
import Head from 'next/head'
import { ReactElement } from 'react'

//API

//material
import { Box, Breadcrumbs, Stack, Typography } from '@mui/material'

// import { SelectChangeEvent } from '@mui/material/Select'

import { NextPageWithLayout } from 'pages/_app.page'
import { ButtonCustom, TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

import ListProductComponent from 'pages/_common/inventory/product/list'
import {
  checkMultiplePermissions,
  KEY_MODULE,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import { useAppSelector } from 'src/store/hooks'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// other

// const renderColorStatus = (status: boolean) => {
//   const result = [
//     { status: true, color: '#1DB46A', text: 'Active' },
//     { status: false, color: '#E02D3C', text: 'DeActive' },
//   ].find((item) => {
//     return item.status === status
//   })
//   return result
// }

const ListProduct: NextPageWithLayout = () => {
  //
  const { t } = useTranslation(['common', 'product'])

  const arrayPermissionForProductList = [
    {
      key_module: KEY_MODULE.Inventory,
      permission_rule: PERMISSION_RULE.MerchantViewList,
    },
    {
      key_module: KEY_MODULE.Inventory,
      permission_rule: PERMISSION_RULE.ViewBoughtList,
    },
  ]
  const permission = useAppSelector((state) => state.permission)

  if (
    !checkMultiplePermissions(arrayPermissionForProductList, permission.data) &&
    permission.success
  ) {
    console.log('product list')

    return (
      <Stack spacing="50px" alignItems={'center'}>
        <Box>
          <Image
            src={'/' + '/images/image403.png'}
            alt=""
            width={500}
            height={250}
          />
        </Box>

        <Typography
          color="#49516F"
          align="center"
          fontSize="16px"
          fontWeight="700"
        >
          This page do not exist!
        </Typography>

        <Link color="link" href="/" style={{ textAlign: 'center' }}>
          <a>
            <ButtonCustom variant="contained" size="large">
              Take Me Back
            </ButtonCustom>
          </a>
        </Link>
      </Stack>
    )
  }
  if (
    checkMultiplePermissions(arrayPermissionForProductList, permission.data)
  ) {
    console.log('product list')

    return (
      <>
        <Head>
          <title>{t('product:title')} | TWSS</title>
        </Head>
        <TypographyTitlePage variant="h1" mb={2}>
          {t('product:title')}
        </TypographyTitlePage>
        <Breadcrumbs
          separator=">"
          aria-label="breadcrumb"
          sx={{ marginBottom: '15px' }}
        >
          <Typography>{t('product:title')}</Typography>
        </Breadcrumbs>
        <ListProductComponent />
      </>
    )
  }
  return <></>
}
ListProduct.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
// ListProduct.permissionPage = {
//   key_module: KEY_MODULE.Inventory,
//   permission_rule: PERMISSION_RULE.MerchantViewList,
// }
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
export default ListProduct
