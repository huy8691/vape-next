import { Breadcrumbs, Typography } from '@mui/material'
import Head from 'next/head'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import WorkLogHistoryComponent from 'pages/_common/hrm/work-log-history'
import { useTranslation } from 'react-i18next'

const WorkLogHistory: NextPageWithLayout = () => {
  const { t } = useTranslation(['work-log-history'])
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('title')}</Typography>
      </Breadcrumbs>
      <WorkLogHistoryComponent />
    </>
  )
}

WorkLogHistory.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'work-log-history'])),
    },
  }
}

export default WorkLogHistory
