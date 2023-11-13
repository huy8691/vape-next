import { Breadcrumbs, Typography } from '@mui/material'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import { TypographyTitlePage } from 'src/components'

import Head from 'next/head'
import UpdateRoleComponent from 'pages/_common/hrm/role/update'
import { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticPaths } from 'next'
import { useTranslation } from 'react-i18next'

const UpdateRole: NextPageWithLayout = () => {
  const { t } = useTranslation(['role'])
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('createUpdate.updateRole')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/supplier/role/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('createUpdate.updateRole')}</Typography>
      </Breadcrumbs>
      <UpdateRoleComponent />
    </>
  )
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'account', 'role'])),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
UpdateRole.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
UpdateRole.permissionPage = {
  key_module: KEY_MODULE.Role,
  permission_rule: PERMISSION_RULE.Update,
}
export default UpdateRole
