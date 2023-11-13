import { Breadcrumbs, Typography } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import UpdateContactComponent from 'pages/_common/crm/contact/update'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticPaths } from 'next'
import { useTranslation } from 'react-i18next'

const UpdateContact: NextPageWithLayout = () => {
  const { t } = useTranslation(['contact'])
  return (
    <>
      <Head>
        <title>{t('createUpdate.updateLead')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('createUpdate.updateLead')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/supplier/crm/contact/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('createUpdate.updateLead')}</Typography>
      </Breadcrumbs>
      <UpdateContactComponent />
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
        'contact',
      ])),
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
UpdateContact.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
UpdateContact.permissionPage = {
  key_module: KEY_MODULE.Contact,
  permission_rule: PERMISSION_RULE.Update,
}
export default UpdateContact
