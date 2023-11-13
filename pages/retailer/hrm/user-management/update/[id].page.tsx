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
import UpdateUserComponent from 'pages/_common/hrm/user-management/update'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const UpdateUser: NextPageWithLayout = () => {
  const { t } = useTranslation('user-management')
  return (
    <>
      <Head>
        <title>{t('updateUserAccount')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('updateUserAccount')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/retailer/hrm/user-management/list">
          <a>{t('title')}</a>
        </Link>
        <Typography>{t('updateUserAccount')}</Typography>
      </Breadcrumbs>
      <UpdateUserComponent />
    </>
  )
}

UpdateUser.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
UpdateUser.permissionPage = {
  key_module: KEY_MODULE.Employee,
  permission_rule: PERMISSION_RULE.Update,
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
        'user-management',
      ])),
    },
  }
}
export default UpdateUser
