import { Breadcrumbs, Typography } from '@mui/material'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app.page'
import UserListComponent from 'pages/_common/hrm/user-management/list'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const UserManagement: NextPageWithLayout = () => {
  //Menu Delete and edit
  const { t } = useTranslation(['common', 'user-management'])
  return (
    <>
      <Head>
        <title>{t('user-management:title')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('user-management:title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('user-management:title')}</Typography>
      </Breadcrumbs>
      <UserListComponent />
    </>
  )
}

UserManagement.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
UserManagement.permissionPage = {
  key_module: KEY_MODULE.Employee,
  permission_rule: PERMISSION_RULE.ViewList,
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'user-management',
      ])),
    },
  }
}

export default UserManagement
