import { Breadcrumbs, Typography } from '@mui/material'
import { GetStaticPaths } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'

import { NextPageWithLayout } from 'pages/_app.page'
import UpdateRoleType from 'pages/_common/hrm/role-type/update'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

//Form and validate

const UpdateRolePage: NextPageWithLayout = () => {
  const { t } = useTranslation(['role-type'])
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
        <Link href={`/supplier/hrm/role-type/list`}>
          <Typography sx={{ '&:hover': { cursor: 'pointer' } }}>
            {t('title')}
          </Typography>
        </Link>
        <Typography>{t('update')}</Typography>
      </Breadcrumbs>
      <UpdateRoleType />
    </>
  )
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'role-type'])),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
UpdateRolePage.permissionPage = {
  key_module: KEY_MODULE.Role,
  permission_rule: PERMISSION_RULE.UpdateRoleType,
}
UpdateRolePage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default UpdateRolePage
