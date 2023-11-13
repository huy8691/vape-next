import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useState } from 'react'
import WrapLayout from 'src/layout/wrapLayout'
import classes from './styles.module.scss'
import Head from 'next/head'
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeSlash } from '@phosphor-icons/react'
import { styled } from '@mui/material/styles'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
  TextFieldPasswordCustom,
} from 'src/components'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { loginAPI } from './loginAPI'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { setAuthToken } from 'src/services/jwt-axios'
import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

// const ButtonArrowBack = styled(Button)(({ theme }) => ({
//   backgroundColor: '#ffff',
//   color: 'black',

//   '&:hover': {
//     backgroundColor: 'transparent',
//     boxShadow: 'none',
//     color: theme.palette.primary.main,
//   },
// }))
const TypographyH1Custom = styled(Typography)({
  fontSize: '2.4rem',
  fontWeight: 'bold',
  color: '#3F444D',
})
const TypographyCustom = styled(Typography)(({ theme }) => ({
  fontWeight: '400',
  fontSize: ' 1.6rem',
  color: '#49516F',
  b: {
    color: theme.palette.primary.main,
  },
}))
const ButtonLoginCustom = styled(ButtonCustom)(() => ({
  boxShadow: '0px 3px 44px rgba(71, 255, 123, 0.27)',
}))
// const TypographyTextCustom = styled(Typography)({
//   color: '#49516F',
//   opacity: '0.7',
// })
const Login: NextPageWithLayout = () => {
  const { t } = useTranslation(['common', 'login'])
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })
  const onSubmit = (values: any) => {
    setValue('platform', 'ADMIN')
    dispatch(loadingActions.doLoading())
    loginAPI({
      ...values,
    })
      .then(async (response) => {
        const { data } = response.data
        await setAuthToken(data.access_token, data.refresh_token)
        dispatch(loadingActions.doLoadingSuccess())
        // localStorage.setItem('isRemember', isRemember || '')
        pushMessage(t('login:message.success'), 'success')
        router.push('/admin/request-supplier')
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <div className={classes['login-page']}>
      <Head>
        <title>{t('login:title')} | TWSS</title>
      </Head>
      <div
        className={`${classes['login-page__container']} ${classes['step2']}`}
      >
        <>
          <Box mb={5}>
            <Link href="/">
              <a>
                <Image
                  src={'/' + '/images/logo.svg'}
                  alt="Logo"
                  width="133"
                  height="52"
                />
              </a>
            </Link>
          </Box>

          <>
            <div className={classes['login-page__content']}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={classes['login-form']}
              >
                <Box mb={4}>
                  <Stack
                    direction="row"
                    // justifyContent="center"
                    alignItems="center"
                    spacing={1}
                  >
                    {/* <ButtonArrowBack>
                        <ArrowLeft size={32} onClick={() => setShow(!show)} />
                      </ButtonArrowBack> */}
                    <TypographyH1Custom>
                      {' '}
                      {t('login:signIn')}
                    </TypographyH1Custom>
                  </Stack>
                  <TypographyCustom>
                    {t('login:welcomeTo')} {''}
                    <b>{t('login:adminPortal')}</b>
                  </TypographyCustom>
                </Box>
                <Box mb={3}>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="email"
                          error={!!errors.email}
                        >
                          {t('login:email')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="last_name"
                            error={!!errors.email}
                            {...field}
                          />
                          {errors.email && (
                            <FormHelperText error={!!errors.email}>
                              {errors.email && `${errors.email.message}`}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
                <Box mb={3}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="outlined-adornment-password"
                          error={!!errors.password}
                        >
                          {t('login:password')}
                        </InputLabelCustom>
                        <TextFieldPasswordCustom fullWidth variant="outlined">
                          <OutlinedInput
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            {...field}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                >
                                  {showPassword ? (
                                    <Eye size={24} />
                                  ) : (
                                    <EyeSlash size={24} />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            error={!!errors.password}
                          />
                          <FormHelperText id="my-helper-text" error>
                            {errors.password && `${errors.password.message}`}
                          </FormHelperText>
                        </TextFieldPasswordCustom>
                      </>
                    )}
                  />
                </Box>

                <Stack alignItems="center" mb={3}>
                  <ButtonLoginCustom
                    variant="contained"
                    size="large"
                    type="submit"
                  >
                    {t('login:signIn')}
                  </ButtonLoginCustom>
                </Stack>
              </form>
            </div>
          </>
        </>
      </div>
    </div>
  )
}
Login.getLayout = function getLayout(page: ReactElement) {
  return <WrapLayout>{page}</WrapLayout>
}
Login.theme = 'light'
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'login'])),
    },
  }
}
export default Login
