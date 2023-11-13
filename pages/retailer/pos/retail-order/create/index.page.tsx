import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement } from 'react'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import NestedLayout from 'src/layout/nestedLayout'
import CreateRetailOrder from 'pages/_common/pos/retail-order/create'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const CreateRetailOrderPage: NextPageWithLayout = () => {
  return <CreateRetailOrder />
}
CreateRetailOrderPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateRetailOrderPage.permissionPage = {
  key_module: KEY_MODULE.Order,
  permission_rule: PERMISSION_RULE.CreateRetailOrder,
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'retail-order-list',
      ])),
    },
  }
}
export default CreateRetailOrderPage
