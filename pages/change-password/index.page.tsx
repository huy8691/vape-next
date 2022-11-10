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
import { Eye, EyeSlash } from 'phosphor-react'
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

// api
import { useAppDispatch } from 'src/store/hooks'
import { setNewPasswordApi } from './changePasswordAPI'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'

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

const ChangePassword: NextPageWithLayout = () => {
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  // check password
  const {
    handleSubmit: handleSubmitPassword,
    control: controlPassword,
    formState: { errors: errorsPassword },
  } = useForm({
    resolver: yupResolver(schemaPassword),
    mode: 'all',
  })

  const onSubmitPassword = (values: any) => {
    dispatch(loadingActions.doLoading())
    setNewPasswordApi({
      email: emailChangePassword.email,
      old_password: emailChangePassword.old_password,
      password: values.password,
    })
      .then((response) => {
        const data = response.data
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: data.message,
          })
        )
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      })
      .catch((error) => {
        const data = error.response?.data
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: data?.message ? data?.message : 'Error',
            type: 'error',
          })
        )
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
        <title>Change your password | Vape</title>
      </Head>
      <div className={classes['change-password-page__container']}>
        <div className={classes['change-password-page__content']}>
          <Box mb={4}>
            <Link href="/">
              <a>
                <Image
                  src="/images/logo.svg"
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
                Set New Password
              </TypographyH1Custom>
              <TypographyBodyCustom variant="body2" mb={2}>
                Please setup your new password to continue.
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
                        New password
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
                                  <EyeSlash size={24} />
                                ) : (
                                  <Eye size={24} />
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
                        Confirm password
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
                                  <EyeSlash size={24} />
                                ) : (
                                  <Eye size={24} />
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
                <ButtonCustom variant="contained" size="large" type="submit">
                  Reset Password
                </ButtonCustom>
              </Stack>
            </form>
          </Box>
        </div>
        <TypographyTextCustom variant="body1">
          <Link href="/login">
            <a className={classes.link}>Back to Sign in</a>
          </Link>
        </TypographyTextCustom>
      </div>
    </div>
  )
}

ChangePassword.getLayout = function getLayout(page: ReactElement) {
  return <WrapLayout>{page}</WrapLayout>
}
ChangePassword.theme = 'light'
export default ChangePassword
