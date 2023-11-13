import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import RetailOrderList from 'pages/_common/pos/retail-order/retail-order-list'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

const RetailOrderListPage: NextPageWithLayout = () => {
  return <RetailOrderList />
}
RetailOrderListPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
RetailOrderListPage.permissionPage = {
  key_module: KEY_MODULE.Order,
  permission_rule: PERMISSION_RULE.ViewListRetailOrder,
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'retail-order-list',
        'account',
      ])),
    },
  }
}

export default RetailOrderListPage
