import React, { ReactElement } from 'react'
// import classes from './styles.module.scss'
import { NextPageWithLayout } from 'pages/_app.page'
import Head from 'next/head'
import NestedLayout from 'src/layout/nestedLayout'
import ListRequest from './path/list'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const ListRequestSupplierComponent: NextPageWithLayout = () => {
  const { t } = useTranslation(['request-supplier'])
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <ListRequest />
    </>
  )
}
ListRequestSupplierComponent.getLayout = function getLayout(
  page: ReactElement
) {
  return <NestedLayout>{page}</NestedLayout>
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'request-supplier'])),
    },
  }
}
export default ListRequestSupplierComponent
