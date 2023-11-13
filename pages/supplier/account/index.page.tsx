import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import AccountComponent from 'pages/_common/account'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const AccountManagement: NextPageWithLayout = () => {
  return <AccountComponent />
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'account',
      ])),
    },
  }
}
AccountManagement.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default AccountManagement
