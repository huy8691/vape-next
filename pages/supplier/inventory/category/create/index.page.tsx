import { Breadcrumbs, Typography } from '@mui/material'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import { TypographyTitlePage } from 'src/components'

import Head from 'next/head'
import CreateCategoriesComponent from 'pages/_common/inventory/category/create'
import { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const CreateCategories: NextPageWithLayout = () => {
  const { t } = useTranslation(['category'])
  return (
    <>
      <Head>
        <title>{t('createUpdate.productCategoryManagement')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('createUpdate.createProductCategory')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/supplier/inventory/category/list">
          <a>{t('createUpdate.productCategoryManagement')}</a>
        </Link>
        <Typography> {t('createUpdate.createProductCategory')}</Typography>
      </Breadcrumbs>
      <CreateCategoriesComponent />
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

CreateCategories.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateCategories.permissionPage = {
  key_module: KEY_MODULE.Category,
  permission_rule: PERMISSION_RULE.SupplierCreate,
}
export default CreateCategories
