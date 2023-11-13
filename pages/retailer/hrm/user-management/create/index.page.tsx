import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { TypographyTitlePage } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
// import UploadImage from 'src/components/uploadImage'
import { Breadcrumbs, Typography } from '@mui/material'
import Link from 'next/link'
// import dayjs from 'dayjs'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
// import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import Head from 'next/head'
import CreateUserComponent from 'pages/_common/hrm/user-management/create'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const CreateUser: NextPageWithLayout = () => {
  const { t } = useTranslation('user-management')
  return (
    <>
      <Head>
        <title>{t('createNewUserAccount')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('createNewUserAccount')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/retailer/hrm/user-management/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('createNewUserAccount')}</Typography>
      </Breadcrumbs>
      <CreateUserComponent />
    </>
  )
}

CreateUser.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
CreateUser.permissionPage = {
  key_module: KEY_MODULE.Employee,
  permission_rule: PERMISSION_RULE.Create,
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'user-management',
      ])),
    },
  }
}

export default CreateUser
