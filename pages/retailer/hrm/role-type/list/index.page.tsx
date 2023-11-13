import { Breadcrumbs, Typography } from '@mui/material'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'

import { NextPageWithLayout } from 'pages/_app.page'
import ListRole from 'pages/_common/hrm/role-type/list'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { TypographyTitlePage } from 'src/components'

import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

//Form and validate

const ListRoleType: NextPageWithLayout = () => {
  const { t } = useTranslation('role-type')
  return (
    <>
      <Head>
        <title>{t('title')} | VAPE</title>
      </Head>
      <TypographyTitlePage sx={{ marginBottom: '15px' }}>
        {t('title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('title')}</Typography>
      </Breadcrumbs>
      <ListRole />
    </>
  )
}

ListRoleType.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
ListRoleType.permissionPage = {
  key_module: KEY_MODULE.Role,
  permission_rule: PERMISSION_RULE.ViewListRoleType,
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'role-type',
      ])),
    },
  }
}

export default ListRoleType
