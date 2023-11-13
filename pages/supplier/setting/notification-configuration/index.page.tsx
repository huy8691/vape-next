import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import NotificationConfigurationComponent from 'pages/_common/setting/notification-configuration'

import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

const NotificationConfigurationPage: NextPageWithLayout = () => {
  return <NotificationConfigurationComponent />
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'notification-configuration',
        'account',
      ])),
    },
  }
}

NotificationConfigurationPage.getLayout = function getLayout(
  page: ReactElement
) {
  return <NestedLayout>{page}</NestedLayout>
}

export default NotificationConfigurationPage
