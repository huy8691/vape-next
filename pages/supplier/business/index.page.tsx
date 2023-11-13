import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import BusinessComponent from 'pages/_common/business'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const BusinessManagement: NextPageWithLayout = () => {
  return <BusinessComponent />
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'business',
      ])),
    },
  }
}
BusinessManagement.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default BusinessManagement
