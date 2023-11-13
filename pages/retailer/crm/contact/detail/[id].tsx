import { Breadcrumbs, Typography } from '@mui/material'
import Head from 'next/head'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import 'react-photo-view/dist/react-photo-view.css'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import DetailsContactComponent from 'pages/_common/crm/contact/detail'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const ContactDetail: NextPageWithLayout = () => {
  const { t } = useTranslation('contact')
  return (
    <>
      <Head>
        <title>{t('details.leadDetails')} | VAPE</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('details.leadDetails')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/retailer/crm/contact/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('details.leadDetails')}</Typography>
      </Breadcrumbs>
      <DetailsContactComponent />
    </>
  )
}
ContactDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
ContactDetail.permissionPage = {
  key_module: KEY_MODULE.Contact,
  permission_rule: PERMISSION_RULE.ViewDetails,
}
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
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

export default ContactDetail
