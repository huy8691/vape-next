import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import MessageManagementComponent from 'pages/_common/crm/messages/list'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const MessageManagement: NextPageWithLayout = () => {
  return <MessageManagementComponent />
}
MessageManagement.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
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
export default MessageManagement
