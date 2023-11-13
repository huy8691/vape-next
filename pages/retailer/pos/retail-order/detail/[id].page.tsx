import { NextPageWithLayout } from 'pages/_app.page'
import RetailOrderDetail from 'pages/_common/pos/retail-order/detail'
import { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { GetStaticPaths } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
const RetailOrderDetailPage: NextPageWithLayout = () => {
  return <RetailOrderDetail />
}

RetailOrderDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
RetailOrderDetailPage.permissionPage = {
  key_module: KEY_MODULE.Order,
  permission_rule: PERMISSION_RULE.ViewDetailsRetailOrder,
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'retail-order-list',
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
export default RetailOrderDetailPage
