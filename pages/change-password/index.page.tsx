// react
import React, { useState, useEffect } from 'react'
import type { ReactElement } from 'react'
// react

// next
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
// next

// store
import { useAppSelector } from 'src/store/hooks'
// store

// mui
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
// mui

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaPassword } from './validations'

// layout
import WrapLayout from 'src/layout/wrapLayout'
import type { NextPageWithLayout } from 'pages/_app.page'
// layout

// other
import Cookies from 'js-cookie'
import { Eye, EyeSlash } from '@phosphor-icons/react'
// other

// custom style
import {
  ButtonCustom,
  InputLabelCustom,
  TextFieldPasswordCustom,
} from 'src/components'

// style
import classes from './styles.module.scss'
// style
// import { NewPasswordType } from './changePasswordModels'
// api
import { useAppDispatch } from 'src/store/hooks'
import { setNewPasswordApi } from './changePasswordAPI'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next'

const TypographyH1Custom = styled(Typography)({
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#3f444d',
})
const TypographyTextCustom = styled(Typography)({
  color: '#49516F',
  opacity: '0.7',
})
const TypographyBodyCustom = styled(Typography)({
  maxWidth: '300px',
  marginLeft: 'auto',
  marginRight: 'auto',
})
const ButtonSubmitCustom = styled(ButtonCustom)(() => ({
  boxShadow: '0px 3px 44px rgba(71, 255, 123, 0.27)',
}))

const ChangePassword: NextPageWithLayout = () => {
  const { t } = useTranslation('change-password')
  const router = useRouter()
  const token = Boolean(Cookies.get('token'))
  if (token) {
    router.push('/')
  }

  // check email exits
  const dispatch = useAppDispatch()
  const emailChangePassword = useAppSelector(
    (state) => state.emailChangePassword
  )

  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [stateShowConfirmPassword, setStateShowConfirmPassword] =
    useState<boolean>(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleClickShowConfirmPassword = () => {
    setStateShowConfirmPassword(!stateShowConfirmPassword)
  }

  const [pushMessage] = useEnqueueSnackbar()

  // check password
  const {
    handleSubmit: handleSubmitPassword,
    control: controlPassword,
    formState: { errors: errorsPassword },
  } = useForm({
    resolver: yupResolver(schemaPassword(t)),
    mode: 'all',
  })

  const onSubmitPassword = (values: any) => {
    dispatch(loadingActions.doLoading())
    setNewPasswordApi({
      email: emailChangePassword.email,
      current_password: emailChangePassword.old_password,
      new_password: values.password,
    })
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('passwordWasChangedSuccessfully'), 'success')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        console.log('check', status, data)
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  // fix error when use next theme
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  if (!emailChangePassword.email) {
    router.push('/login')
    return (
      <div className="loading">
        <CircularProgress />
      </div>
    )
  }
  // fix error when use next theme

  return (
    <div className={classes['change-password-page']}>
      <Head>
        <title>{t('changeYourPassword')} | TWSS</title>
      </Head>
      <div className={classes['change-password-page__container']}>
        <div className={classes['change-password-page__content']}>
          <Box mb={4}>
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
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <Box mb={4} style={{ textAlign: 'center' }}>
              <TypographyH1Custom variant="h1" mb={2}>
                {t('setNewPassword')}
              </TypographyH1Custom>
              <TypographyBodyCustom variant="body2" mb={2}>
                {t('pleaseSetupYourNewPasswordToContinue')}
              </TypographyBodyCustom>
              <TypographyBodyCustom variant="body2" className={classes.link}>
                {emailChangePassword.email}
              </TypographyBodyCustom>
            </Box>
            <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
              <Box mb={2}>
                <Controller
                  control={controlPassword}
                  name="password"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="outlined-adornment-password"
                        error={!!errorsPassword.password}
                      >
                        {t('newPassword')}
                      </InputLabelCustom>
                      <TextFieldPasswordCustom fullWidth variant="outlined">
                        <OutlinedInput
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
                          error={!!errorsPassword.password}
                        />
                        <FormHelperText error>
                          {errorsPassword.password &&
                            `${errorsPassword.password.message}`}
                        </FormHelperText>
                      </TextFieldPasswordCustom>
                    </>
                  )}
                />
              </Box>
              <Box mb={5}>
                <Controller
                  control={controlPassword}
                  name="confirmPassword"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="outlined-adornment-password"
                        error={!!errorsPassword.confirmPassword}
                      >
                        {t('confirmPassword')}
                      </InputLabelCustom>
                      <TextFieldPasswordCustom fullWidth variant="outlined">
                        <OutlinedInput
                          type={stateShowConfirmPassword ? 'text' : 'password'}
                          {...field}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowConfirmPassword}
                              >
                                {stateShowConfirmPassword ? (
                                  <Eye size={24} />
                                ) : (
                                  <EyeSlash size={24} />
                                )}
                              </IconButton>
                            </InputAdornment>
                          }
                          error={!!errorsPassword.confirmPassword}
                        />
                        <FormHelperText error>
                          {errorsPassword.confirmPassword &&
                            `${errorsPassword.confirmPassword.message}`}
                        </FormHelperText>
                      </TextFieldPasswordCustom>
                    </>
                  )}
                />
              </Box>
              <Stack alignItems="center">
                <ButtonSubmitCustom
                  variant="contained"
                  size="large"
                  type="submit"
                >
                  {t('resetPassword')}
                </ButtonSubmitCustom>
              </Stack>
            </form>
          </Box>
        </div>
        <TypographyTextCustom variant="body1">
          <Link href="/login">
            <a className={classes.link}>{t('backToSignIn')}</a>
          </Link>
        </TypographyTextCustom>
      </div>
    </div>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'change-password',
      ])),
    },
  }
}

ChangePassword.getLayout = function getLayout(page: ReactElement) {
  return <WrapLayout>{page}</WrapLayout>
}
ChangePassword.theme = 'light'
export default ChangePassword
