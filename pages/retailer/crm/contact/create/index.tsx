import { Breadcrumbs, Typography } from '@mui/material'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import CreateContactComponent from 'pages/_common/crm/contact/create'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

const CreateContact: NextPageWithLayout = () => {
  const { t } = useTranslation('contact')
  return (
    <>
      <Head>
        <title>{t('createUpdate.createNewLead')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('createUpdate.createNewLead')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/retailer/crm/contact/list">
          <a>{t('title')}</a>
        </Link>
        <Typography> {t('createUpdate.createNewLead')}</Typography>
      </Breadcrumbs>
      <CreateContactComponent />
    </>
  )
}

CreateContact.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateContact.permissionPage = {
  key_module: KEY_MODULE.Contact,
  permission_rule: PERMISSION_RULE.Create,
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'contact',
      ])),
    },
  }
}
export default CreateContact
