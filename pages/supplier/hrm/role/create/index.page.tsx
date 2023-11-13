import { Breadcrumbs, Typography } from '@mui/material'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import { TypographyTitlePage } from 'src/components'

import Head from 'next/head'
import CreateRoleComponent from 'pages/_common/hrm/role/create'
import { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const CreateRole: NextPageWithLayout = () => {
  const { t } = useTranslation(['role'])
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('createUpdate.createRole')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/supplier/role/">
          <a>{t('title')}</a>
        </Link>
        <Typography> {t('createUpdate.createRole')}</Typography>
      </Breadcrumbs>
      <CreateRoleComponent />
    </>
  )
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'role'])),
    },
  }
}

CreateRole.permissionPage = {
  key_module: KEY_MODULE.Role,
  permission_rule: PERMISSION_RULE.CreateRoleType,
}
CreateRole.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default CreateRole
