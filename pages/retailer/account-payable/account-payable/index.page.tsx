import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import AccountPayableAndAccountReceivableComponent from 'pages/_common/apar/apar-component'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import Head from 'next/head'
import { TypographyTitlePage } from 'src/components'
import { useTranslation } from 'react-i18next'

const AccountPayableAndAccountReceivablePage: NextPageWithLayout = () => {
  const { t } = useTranslation(['common', 'account'])
  return (
    <>
      <Head>
        <title>{t('account:titleAccountPayable')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('account:titleAccountPayable')}
      </TypographyTitlePage>
      <AccountPayableAndAccountReceivableComponent />
    </>
  )
}
AccountPayableAndAccountReceivablePage.getLayout = function getLayout(
  page: ReactElement
) {
  return <NestedLayout>{page}</NestedLayout>
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'external-order',
      ])),
    },
  }
}
export default AccountPayableAndAccountReceivablePage
