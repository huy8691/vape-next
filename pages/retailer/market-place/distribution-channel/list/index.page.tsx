/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Link, Stack, Typography } from '@mui/material'
import Image from 'next/image'
import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import { ButtonCustom } from 'src/components'
import NestedLayout from 'src/layout/nestedLayout'

// react-hook-form

//Api

//Src
import { useAppSelector } from 'src/store/hooks'
import {
  checkMultiplePermissions,
  KEY_MODULE,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import DCMerchantComponent from './parts'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

//material

const DCMerchant: NextPageWithLayout = () => {
  const { t } = useTranslation('dc')

  const permission = useAppSelector((state) => state.permission)
  const arrayPermissionObject = [
    {
      key_module: KEY_MODULE.DistributionChannel,
      permission_rule: PERMISSION_RULE.ViewList,
    },
    {
      key_module: KEY_MODULE.DistributionChannel,
      permission_rule: PERMISSION_RULE.ViewJoinedList,
    },
  ]
  if (
    checkMultiplePermissions(arrayPermissionObject, permission.data) &&
    permission.success
  ) {
    return <DCMerchantComponent />
  }
  if (
    !checkMultiplePermissions(arrayPermissionObject, permission.data) &&
    permission.success
  ) {
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
          {t('thisPageDonotExist')}
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
  return <></>
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'account', 'dc'])),
    },
  }
}

DCMerchant.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default DCMerchant
