import { Breadcrumbs, Typography } from '@mui/material'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

import Head from 'next/head'
import UpdateCategoryComponent from 'pages/_common/inventory/category/update'
import { GetStaticPaths } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const UpdateCategory: NextPageWithLayout = () => {
  const { t } = useTranslation(['category'])
  return (
    <>
      <Head>
        <title> {t('createUpdate.productCategoryManagement')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('createUpdate.updateProductCategory')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/supplier/inventory/category/list">
          <a>{t('createUpdate.productCategoryManagement')}</a>
        </Link>
        <Typography>{t('createUpdate.updateProductCategory')}</Typography>
      </Breadcrumbs>
      <UpdateCategoryComponent />
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
        'category',
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

UpdateCategory.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
UpdateCategory.permissionPage = {
  key_module: KEY_MODULE.Category,
  permission_rule: PERMISSION_RULE.SupplierUpdate,
}

export default UpdateCategory
