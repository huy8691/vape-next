import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import UpdateRouteComponent from 'pages/_common/map/route-management/update'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const UpdateRoutePage: NextPageWithLayout = () => {
  return <UpdateRouteComponent />
}
UpdateRoutePage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
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
      ...(await serverSideTranslations(locale, ['common', 'account', 'map'])),
    },
  }
}
export default UpdateRoutePage
