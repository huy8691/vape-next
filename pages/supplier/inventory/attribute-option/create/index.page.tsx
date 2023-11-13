import { Breadcrumbs, Typography } from '@mui/material'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import CreateAttributeComponent from 'pages/_common/inventory/attribute-option/create'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

const CreateAttribute: NextPageWithLayout = () => {
  const { t } = useTranslation(['attribute-option'])
  return (
    <>
      <Head>
        <title>{t('create.title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('create.title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/supplier/inventory/attribute-option/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('create.title')}</Typography>
      </Breadcrumbs>
      <CreateAttributeComponent />
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
        'attribute-option',
      ])),
    },
  }
}

CreateAttribute.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateAttribute.permissionPage = {
  key_module: KEY_MODULE.Inventory,
  permission_rule: PERMISSION_RULE.CreateAttribute,
}
export default CreateAttribute
