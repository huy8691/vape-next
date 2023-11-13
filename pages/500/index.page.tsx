import { Stack, Typography, Box } from '@mui/material'
import Link from '@mui/material/Link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
// layout
// layout
import type { NextPageWithLayout } from 'pages/_app.page'
import type { ReactElement } from 'react'
import { ButtonCustom } from 'src/components'
import WrapLayout from 'src/layout/wrapLayout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const Custom500: NextPageWithLayout = () => {
  const { t } = useTranslation('common')
  // fix error when use next theme
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) {
    return null
  }
  // fix error when use next theme
  return (
    <Stack spacing="50px" alignItems={'center'}>
      <Box>
        <Image
          src={'/' + '/images/image404.png'}
          alt=""
          width={500}
          height={250}
        />
      </Box>

      <Typography
        color="#49516F"
        align="center"
        fontSize="16px"
        fontWeight="700"
      >
        {t('somethingsWentWrong')}
      </Typography>

      <Link
        underline="none"
        color="link"
        href="/"
        style={{ textAlign: 'center' }}
      >
        <ButtonCustom variant="contained" size="large">
          {t('takeMeBack')}
        </ButtonCustom>
      </Link>
    </Stack>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'account'])),
    },
  }
}

Custom500.getLayout = function getLayout(page: ReactElement) {
  return <WrapLayout>{page}</WrapLayout>
}
export default Custom500
