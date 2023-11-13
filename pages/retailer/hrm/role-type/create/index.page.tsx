import { Breadcrumbs, Typography } from '@mui/material'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'

import { NextPageWithLayout } from 'pages/_app.page'
import CreateRoleType from 'pages/_common/hrm/role-type/create'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { TypographyTitlePage } from 'src/components'

import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

//Form and validate

const CreateRoleTypePage: NextPageWithLayout = () => {
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
        <Link href={`/retailer/hrm/role-type/list`}>
          <Typography sx={{ '&:hover': { cursor: 'pointer' } }}>
            {t('title')}
          </Typography>
        </Link>
        <Typography>{t('createUpdate.createRoleType')}</Typography>
      </Breadcrumbs>
      <CreateRoleType />
    </>
  )
}

CreateRoleTypePage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateRoleTypePage.permissionPage = {
  key_module: KEY_MODULE.Role,
  permission_rule: PERMISSION_RULE.CreateRoleType,
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

export default CreateRoleTypePage
