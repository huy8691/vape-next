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
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation(['product'])
  //
  // const result = () => {
  //   return (

  //   )
  // }
  // const PermissionForPageProductManagement = withPermissionForPage(
  //   result,
  //   KEY_MODULE.Inventory,
  //   PERMISSION_RULE.SupplierViewList
  // )
  const arrayPermissionForProductList = [
    {
      key_module: KEY_MODULE.Inventory,
      permission_rule: PERMISSION_RULE.SupplierViewList,
    },
  ]
  const arrayPermission = useAppSelector((state) => state.permission)

  if (
    !checkMultiplePermissions(
      arrayPermissionForProductList,
      arrayPermission.data
    ) &&
    arrayPermission.success
  ) {
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
          {t('thisPageDoNotExist')}
        </Typography>

        <Link color="link" href="/" style={{ textAlign: 'center' }}>
          <a>
            <ButtonCustom variant="contained" size="large">
              {t('takeMeBack')}
            </ButtonCustom>
          </a>
        </Link>
      </Stack>
    )
  }
  return (
    <>
      <Head>
        <title>{t('title')}| TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('title')}</Typography>
      </Breadcrumbs>
      <ListProductComponent />
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
        'product',
      ])),
    },
  }
}

ListProduct.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
// ListProduct.permissionPage = {
//   key_module: KEY_MODULE.Inventory,
//   permission_rule: PERMISSION_RULE.SupplierViewList,
// }
export default ListProduct
