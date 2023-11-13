import { Breadcrumbs, Typography } from '@mui/material'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app.page'
import UserListComponent from 'pages/_common/hrm/user-management/list'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

const UserManagement: NextPageWithLayout = () => {
  const { t } = useTranslation(['user-management'])
  //Menu Delete and edit

  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('title')} </Typography>
      </Breadcrumbs>
      <UserListComponent />
    </>
  )
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

UserManagement.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
UserManagement.permissionPage = {
  key_module: KEY_MODULE.Employee,
  permission_rule: PERMISSION_RULE.ViewList,
}
export default UserManagement
