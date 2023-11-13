import { Breadcrumbs, Typography } from '@mui/material'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app.page'
import AttributeOptionManagementComponent from 'pages/_common/inventory/attribute-option/list'
import React, { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

const AttributeOptionManagement: NextPageWithLayout = () => {
  const { t } = useTranslation(['attribute-option'])
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {t('title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('title')}</Typography>
      </Breadcrumbs>
      <AttributeOptionManagementComponent />
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

AttributeOptionManagement.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
AttributeOptionManagement.permissionPage = {
  key_module: KEY_MODULE.Inventory,
  permission_rule: PERMISSION_RULE.ViewListAttribute,
}
export default AttributeOptionManagement
