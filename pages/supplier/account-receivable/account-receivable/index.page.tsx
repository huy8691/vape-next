import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import AccountPayableAndAccountReceivableComponent from 'pages/_common/apar/apar-component'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const AccountPayable: NextPageWithLayout = () => {
  return <AccountPayableAndAccountReceivableComponent />
}
AccountPayable.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'account'])),
    },
  }
}
export default AccountPayable
