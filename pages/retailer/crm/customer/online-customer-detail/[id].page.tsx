import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import CustomerDetail from 'pages/_common/crm/customer/online-customer-detail'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const OnlineCustomerDetail: NextPageWithLayout = () => {
  return <CustomerDetail />
}
OnlineCustomerDetail.getLayout = function getLayout(page: ReactElement) {
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
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'customer',
      ])),
    },
  }
}
export default OnlineCustomerDetail
