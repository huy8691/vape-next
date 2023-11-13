import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import CreateRouteComponent from 'pages/_common/map/route-management/create'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const CreateRoutePage: NextPageWithLayout = () => {
  return <CreateRouteComponent />
}
CreateRoutePage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'account', 'map'])),
    },
  }
}
export default CreateRoutePage
