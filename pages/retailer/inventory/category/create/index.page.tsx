import { Breadcrumbs, Typography } from '@mui/material'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import { TypographyTitlePage } from 'src/components'

import Head from 'next/head'
import CreateCategoriesComponent from 'pages/_common/inventory/category/create'
import { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const CreateCategories: NextPageWithLayout = () => {
  const { t } = useTranslation('category')
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
        <Link href="/retailer/inventory/category/list">
          <a> {t('createUpdate.productCategoryManagement')}</a>
        </Link>
        <Typography>{t('createUpdate.createProductCategory')}</Typography>
      </Breadcrumbs>
      <CreateCategoriesComponent />
    </>
  )
}
CreateCategories.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateCategories.permissionPage = {
  key_module: KEY_MODULE.Category,
  permission_rule: PERMISSION_RULE.MerchantCreate,
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'category',
      ])),
    },
  }
}
export default CreateCategories
