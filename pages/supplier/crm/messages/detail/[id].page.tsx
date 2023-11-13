import { GetStaticPaths } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import MessageDetailComponent from 'pages/_common/crm/messages/detail'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const MessageDetail: NextPageWithLayout = () => {
  return <MessageDetailComponent />
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'messages',
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
MessageDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default MessageDetail
