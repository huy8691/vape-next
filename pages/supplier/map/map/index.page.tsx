import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app.page'
import SellerMapComponent from 'pages/_common/map/map'
import { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

const SellerMap: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Map | TWSS</title>
      </Head>
      {/* <TypographyH2>List Seller</TypographyH2> */}
      <SellerMapComponent />
    </>
  )
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'account', 'map'])),
    },
  }
}

SellerMap.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
SellerMap.permissionPage = {
  key_module: KEY_MODULE.Map,
  permission_rule: PERMISSION_RULE.ViewList,
}
export default SellerMap
