import { ReactElement } from 'react'

import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app.page'
import ProductDetailComponent from 'pages/_common/inventory/product/product-template'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticPaths } from 'next'
import { useTranslation } from 'react-i18next'

// form

const ProductDetail: NextPageWithLayout = () => {
  const { t } = useTranslation('product')
  return (
    <>
      <Head>
        <title>{t('variantGroup')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('variantGroup')}
      </TypographyTitlePage>
      <ProductDetailComponent />
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

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

ProductDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
ProductDetail.permissionPage = {
  key_module: KEY_MODULE.Inventory,
  permission_rule: PERMISSION_RULE.ViewDetails,
}
export default ProductDetail
