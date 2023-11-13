import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import NotificationHistoryComponent from 'pages/_common/setting/notification-history'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const NotificationHistoryPage: NextPageWithLayout = () => {
  return <NotificationHistoryComponent />
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'notification-history',
        'account',
      ])),
    },
  }
}

NotificationHistoryPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default NotificationHistoryPage
