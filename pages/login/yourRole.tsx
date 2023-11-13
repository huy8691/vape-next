// react
import React from 'react'

// style
// import classes from './styles.module.scss'
// import Image from 'next/image'
// import Link from 'next/link'

// mui
import { styled } from '@mui/system'
import { Avatar, Box, Button, Stack, Typography } from '@mui/material'
import { Storefront, Package } from '@phosphor-icons/react'
import { useTranslation } from 'next-i18next'

const TypographyH1Custom = styled(Typography)({
  fontSize: '2.4rem',
  letterSpacing: '-1px',
  fontWeight: 'bold',
  color: '#3F444D',
  textAlign: 'center',
})
const TypographyCustom = styled(Typography)(() => ({
  fontSize: '1.8rem',
  fontWeight: '400',
  opacity: '0.7',
  color: '#49516F',
}))
const ButtonCustom = styled(Button)(() => ({
  borderRadius: '12px',
  boxShadow: '0px 4px 44px rgba(0, 0, 0, 0.07)',
  '&:hover': {
    backgroundColor: 'transparent',
  },
  padding: '25px',
}))
const AvatarCustom = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  width: '85px',
  height: '85px',
}))

const YourRole: React.FC<{
  handleClickRole: (value: string) => void
}> = (props) => {
  const { t } = useTranslation('login')
  return (
    <>
      <Box mb={5} mt={3}>
        <TypographyH1Custom variant="h1">
          {t('yourRole.selectYourRole')}
        </TypographyH1Custom>
      </Box>
      <Stack spacing={5}>
        <ButtonCustom
          fullWidth
          onClick={() => {
            props.handleClickRole('SUPPLIER')
          }}
        >
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            style={{ width: '100%' }}
          >
            <AvatarCustom variant="rounded">
              <Storefront size={50} />
            </AvatarCustom>
            <TypographyCustom>
              <b>{t('yourRole.supplier')}</b> {t('yourRole.signIn')}
            </TypographyCustom>
          </Stack>
        </ButtonCustom>
        <ButtonCustom
          fullWidth
          onClick={() => props.handleClickRole('RETAILER')}
        >
          <Stack
            spacing={2}
            direction="row"
            alignItems="center"
            style={{ width: '100%' }}
          >
            <AvatarCustom variant="rounded">
              <Package size={50} />
            </AvatarCustom>
            <TypographyCustom>
              <b>{t('yourRole.retailer')}</b> {t('yourRole.signIn')}
            </TypographyCustom>
          </Stack>
        </ButtonCustom>
      </Stack>
    </>
  )
}

export default YourRole
