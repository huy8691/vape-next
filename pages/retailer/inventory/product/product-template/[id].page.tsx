import { ReactElement } from 'react'

import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app.page'
import ProductDetailComponent from 'pages/_common/inventory/product/product-template'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

// form

const ProductDetail: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Variant Group | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        Variant Group
      </TypographyTitlePage>
      <ProductDetailComponent />
    </>
  )
}
ProductDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
ProductDetail.permissionPage = {
  key_module: KEY_MODULE.Inventory,
  permission_rule: PERMISSION_RULE.ViewDetails,
}
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
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
export default ProductDetail
