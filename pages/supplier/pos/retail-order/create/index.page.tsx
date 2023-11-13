import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement } from 'react'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import NestedLayout from 'src/layout/nestedLayout'
import CreateRetailOrder from 'pages/_common/pos/retail-order/create'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const CreateRetailOrderPage: NextPageWithLayout = () => {
  return <CreateRetailOrder />
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
CreateRetailOrderPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateRetailOrderPage.permissionPage = {
  key_module: KEY_MODULE.Inventory,
  permission_rule: PERMISSION_RULE.SupplierViewList,
}
export default CreateRetailOrderPage
