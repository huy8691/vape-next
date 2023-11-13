import { GetStaticPaths } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import VariantDetailComponent from 'pages/_common/inventory/product/detail'
import { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

const VariantDetail: NextPageWithLayout = () => {
  return (
    <>
      <VariantDetailComponent />
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

VariantDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
VariantDetail.permissionPage = {
  key_module: KEY_MODULE.Inventory,
  permission_rule: PERMISSION_RULE.ViewDetailsVariant,
}
export default VariantDetail
