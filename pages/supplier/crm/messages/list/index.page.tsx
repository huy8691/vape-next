import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import MessageManagementComponent from 'pages/_common/crm/messages/list'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const MessageManagement: NextPageWithLayout = () => {
  return <MessageManagementComponent />
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

MessageManagement.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default MessageManagement
