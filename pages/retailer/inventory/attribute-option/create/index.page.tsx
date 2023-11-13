import { Breadcrumbs, Typography } from '@mui/material'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import Link from 'next/link'
import { NextPageWithLayout } from 'pages/_app.page'
import CreateAttributeComponent from 'pages/_common/inventory/attribute-option/create'
import { ReactElement } from 'react'
import { useTranslation } from 'next-i18next'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

const CreateAttribute: NextPageWithLayout = () => {
  const { t } = useTranslation(['common', 'attribute-option'])
  return (
    <>
      <Head>
        <title>{t('attribute-option:create.title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('attribute-option:create.title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/retailer/inventory/attribute-option/list">
          <a>{t('attribute-option:title')} </a>
        </Link>
        <Typography>{t('attribute-option:create.title')} </Typography>
      </Breadcrumbs>
      <CreateAttributeComponent />
    </>
  )
}
CreateAttribute.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateAttribute.permissionPage = {
  key_module: KEY_MODULE.Inventory,
  permission_rule: PERMISSION_RULE.CreateAttribute,
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'attribute-option',
      ])),
    },
  }
}
export default CreateAttribute
