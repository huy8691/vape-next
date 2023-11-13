import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import RouteManagementComponent from 'pages/_common/map/route-management/list'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const RouteManagementPage: NextPageWithLayout = () => {
  return <RouteManagementComponent />
}
RouteManagementPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'account', 'map'])),
    },
  }
}
export default RouteManagementPage
