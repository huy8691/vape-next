// react
import React, { useState } from 'react'

import type { ReactElement } from 'react'
// react

// next
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
// next

// mui
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import OutlinedInput from '@mui/material/OutlinedInput'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControl from '@mui/material/FormControl'
// mui

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'

// api
import { useAppDispatch } from 'src/store/hooks'
import { loginAPI } from './loginAPI'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { emailChangePasswordActions } from 'src/store/emailChangePassword/emailChangePasswordSlice'
import { setAuthToken } from 'src/services/jwt-axios'
// api

// layout
import WrapLayout from 'src/layout/wrapLayout'
import type { NextPageWithLayout } from 'pages/_app.page'
// layout

// other
import { Eye, EyeSlash } from 'phosphor-react'
// other

// custom style
import {
  ButtonCustom,
  TextFieldCustom,
  InputLabelCustom,
  TextFieldPasswordCustom,
} from 'src/components'

// style
import classes from './styles.module.scss'
// style

// custom style
// import { ButtonCustom } from 'src/components'
const Item = styled(Paper)(({ theme }) => ({
  filter: 'drop-shadow(-1px 20px 44px rgba(128, 128, 128, 0.12))',
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  borderRadius: '12px',
  height: '50px',
  width: '50px',
  fontSize: '24px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))
const TypographyH1Custom = styled(Typography)({
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#3f444d',
})
const TypographyTextCustom = styled(Typography)({
  color: '#49516F',
  opacity: '0.7',
})

const TagHr = styled('div')(({ theme }) => ({
  width: '25%',
  height: '1px',
  backgroundColor: theme.palette.primary.main,
}))

const ButtonLoginCustom = styled(ButtonCustom)(() => ({
  boxShadow: '0px 3px 44px rgba(71, 255, 123, 0.27)',
}))

// const Storage = () => {
//   // set(key, value) {
//   //   localStorage.setItem(key, value)
//   // }
//   // get(key) {
//   //   return localStorage.getItem(key)
//   // }
// }

const Login: NextPageWithLayout = () => {
  const router = useRouter()
  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const dispatch = useAppDispatch()
  const [isRemember, setIsRemember] = useState<string>(
    localStorage.getItem('isRemember') as string
  )

  const onSubmit = (values: any) => {
    console.log('4444', values)
    // dispatch(
    //   loginActions.doLogin({
    //     ...values,
    //     user_type: 'CUSTOMER',
    //   })
    // )
    dispatch(loadingActions.doLoading())

    loginAPI({
      ...values,
    })
      .then((response) => {
        const { data } = response.data
        setAuthToken(data.access_token, data.refresh_token)
        dispatch(loadingActions.doLoadingSuccess())
        localStorage.setItem('isRemember', isRemember || '')
        // router.push('/')
        // if (values.remember) {
        //   localStorage.setItem('email', values.email)
        //   localStorage.setItem('password', values.password)
        // }

        dispatch(
          notificationActions.doNotification({
            message: 'Sign in successfully',
          })
        )
        window.location.href = '/'
      })
      .catch((error) => {
        const data = error.response?.data
        if (data?.status === 400 && data?.message === 'FIRST_LOGIN') {
          // setStateMail(values.email)
          dispatch(
            emailChangePasswordActions.doEmailChangePassword({
              email: values.email,
              old_password: values.password,
            })
          )
          router.push('/change-password')
          dispatch(loadingActions.doLoadingFailure())
          dispatch(
            notificationActions.doNotification({
              message: 'First login',
            })
          )
          return
        }
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: data?.message ? data?.message : 'Error',
            type: 'error',
          })
        )
      })
  }

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  return (
    <div className={classes['login-page']}>
      <Head>
        <title>Login | Vape</title>
      </Head>
      <div className={classes['login-page__container']}>
        <div className={classes['login-page__content']}>
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
          <Box mb={4}>
            <TypographyH1Custom variant="h1">Sign In</TypographyH1Custom>
          </Box>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={classes['login-form']}
          >
            <Box mb={3}>
              <FormControl>
                <Controller
                  control={control}
                  name="platform"
                  defaultValue="SUPPLIER"
                  render={({ field }) => (
                    <FormControl>
                      <RadioGroup
                        row
                        {...field}
                        onChange={(e) => {
                          console.log('e', e.target.value)
                          setValue('platform', e.target.value)
                          if (e.target.value === 'MERCHANT') {
                            setValue('email', 'merchant@exnodes.vn')
                            setValue('password', '12345678')
                          } else {
                            setValue('email', 'supplier@exnodes.vn')
                            setValue('password', '12345678')
                          }
                        }}
                      >
                        <FormControlLabel
                          value="SUPPLIER"
                          control={<Radio />}
                          label="SUPPLIER"
                        />
                        <FormControlLabel
                          value="MERCHANT"
                          control={<Radio />}
                          label="MERCHANT"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
              </FormControl>
            </Box>
            <Box mb={2}>
              <Controller
                control={control}
                name="email"
                defaultValue="supplier@exnodes.vn"
                render={({ field }) => (
                  <>
                    <InputLabelCustom htmlFor="email" error={!!errors.email}>
                      Email
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
            <Box mb={1}>
              <Controller
                control={control}
                name="password"
                defaultValue="12345678"
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="outlined-adornment-password"
                      error={!!errors.password}
                    >
                      Password
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
                                <EyeSlash size={24} />
                              ) : (
                                <Eye size={24} />
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
            <Box mb={4}>
              <FormControlLabel
                control={
                  <Controller
                    name="remember"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        {...field}
                        checked={isRemember === 'true' ? true : false}
                        onChange={(event: any) => {
                          setIsRemember(String(event.target.checked))
                          setValue('remember', event.target.checked)
                        }}
                      />
                    )}
                  />
                }
                label="Remember me"
              />
            </Box>

            <Stack alignItems="center">
              <ButtonLoginCustom variant="contained" size="large" type="submit">
                Sign In
              </ButtonLoginCustom>
            </Stack>
          </form>
          <div className={classes['login-page__sign-in-width']}>
            <TagHr />
            <TypographyTextCustom>Or you can sign in with</TypographyTextCustom>
            <TagHr />
          </div>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={3}
            mb={4}
          >
            <Item>
              <span className="icon-icoMoon_facebook"></span>
            </Item>
            <Item>
              <span className="icon-icoMoon_apple"></span>
            </Item>
            <Item>
              <span className="icon-icoMoon_google">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
              </span>
            </Item>
          </Stack>
          <TypographyTextCustom variant="body1">
            New to TWS?{' '}
            <Link href="/register">
              <a className={classes.link}>Register</a>
            </Link>
          </TypographyTextCustom>
        </div>

        <TypographyTextCustom variant="body1">
          <Link href="/forgot-password">
            <a className={classes.link}>Forgot password</a>
          </Link>
        </TypographyTextCustom>
      </div>
    </div>
  )
}

Login.getLayout = function getLayout(page: ReactElement) {
  return <WrapLayout>{page}</WrapLayout>
}

Login.theme = 'light'

export default Login
