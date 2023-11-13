import { GetStaticPaths } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import CustomerDetail from 'pages/_common/crm/customer/online-customer-detail'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const OnlineCustomerDetail: NextPageWithLayout = () => {
  return <CustomerDetail />
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'customer',
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
OnlineCustomerDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default OnlineCustomerDetail
