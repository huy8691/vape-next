import { styled } from '@mui/material/styles'
import { Box, Stack, Typography } from '@mui/material'
import React from 'react'
import { ButtonCustom, TypographyTitlePage } from 'src/components'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

const TypographyCustom = styled(Typography)({
  fontWeight: '600',
  fontSize: '24px',
  color: '#49516F',
})

const TypographyContentCustom = styled(Typography)({
  fontWeight: '400',
  fontSize: '24px',
  color: '#49516F',
  textAlign: 'center',
})
const RegisterSentComponent: React.FC = () => {
  const { t } = useTranslation('register-supplier')
  const router = useRouter()
  return (
    <>
      <Box>
        <Stack alignItems="center" mb={4}>
          <TypographyTitlePage variant="h1">
            {t('signUpRequestSent')}
          </TypographyTitlePage>
        </Stack>
        <Stack alignItems="center" mb={4}>
          <TypographyCustom variant="h2">
            {t('thankYouForSigningUpOnTwsMarketplace')}
          </TypographyCustom>
        </Stack>
        <Stack alignItems="center" mb={4}>
          <TypographyContentCustom
            sx={{
              padding: '0 40px',
            }}
          >
            {t(
              'onceYourAccountHasBeenCreatedYouWillBeEmailedYourLoginInformationAlongWithTheRequirementsForPuttingYourProductOnourMarketplace'
            )}
          </TypographyContentCustom>
        </Stack>
        <Stack
          direction={'row'}
          alignItems="center"
          justifyContent="center"
          spacing={4}
          mb={4}
        >
          <ButtonCustom
            variant="contained"
            onClick={() => {
              window.open('https://twssolutions.us/')
            }}
          >
            {t('visitOurWebsite')}
          </ButtonCustom>
          <ButtonCustom
            variant="contained"
            onClick={() => {
              router.push('/login')
            }}
          >
            {t('goBackToSignInPage')}
          </ButtonCustom>
        </Stack>
      </Box>
    </>
  )
}
export default RegisterSentComponent
