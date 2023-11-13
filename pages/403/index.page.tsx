import { Stack, Typography, Box } from '@mui/material'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
// layout
// layout
import type { NextPageWithLayout } from 'pages/_app.page'
import type { ReactElement } from 'react'
import { ButtonCustom } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const Page403: NextPageWithLayout = () => {
  // fix error when use next theme
  const { t } = useTranslation('common')
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
          src={'/' + '/images/image403.png'}
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
        {t('thisPageDoNotExist')}
      </Typography>

      <Link color="link" href="/" style={{ textAlign: 'center' }}>
        <a>
          <ButtonCustom variant="contained" size="large">
            {t('takeMeBack')}
          </ButtonCustom>
        </a>
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

Page403.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Page403
