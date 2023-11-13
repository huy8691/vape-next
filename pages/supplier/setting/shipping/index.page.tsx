import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import ShippingConfigurationComponent from 'pages/_common/setting/shipping'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const ShippingConfigurationPage: NextPageWithLayout = () => {
  return <ShippingConfigurationComponent />
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'shipping',
        'account',
      ])),
    },
  }
}
ShippingConfigurationPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default ShippingConfigurationPage
