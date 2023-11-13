import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { NextPageWithLayout } from 'pages/_app.page'
import LoyaltyComponent from 'pages/_common/crm/loyalty'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

const LoyaltyPage: NextPageWithLayout = () => {
  return <LoyaltyComponent />
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'loyalty'])),
    },
  }
}
LoyaltyPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
LoyaltyPage.permissionPage = {
  key_module: KEY_MODULE.Merchant,
  permission_rule: PERMISSION_RULE.ViewList,
}

export default LoyaltyPage
