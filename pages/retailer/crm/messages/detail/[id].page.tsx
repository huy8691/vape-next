import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import MessageDetailComponent from 'pages/_common/crm/messages/detail'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const MessageDetail: NextPageWithLayout = () => {
  return <MessageDetailComponent />
}

MessageDetail.getLayout = function getLayout(page: ReactElement) {
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
        'messages',
      ])),
    },
  }
}
export default MessageDetail
