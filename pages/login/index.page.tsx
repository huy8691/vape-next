// react
import type { ReactElement } from 'react'
import { useEffect, useState } from 'react'
// react

// next
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
// next

// mui
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
// import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import OutlinedInput from '@mui/material/OutlinedInput'
import Typography from '@mui/material/Typography'
// mui

// form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { schema } from './validations'

// api
import { setAuthToken } from 'src/services/jwt-axios'
import { emailChangePasswordActions } from 'src/store/emailChangePassword/emailChangePasswordSlice'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { loginAPI } from './loginAPI'
// api

// layout
import type { NextPageWithLayout } from 'pages/_app.page'
import WrapLayout from 'src/layout/wrapLayout'
// layout

// other
import { ArrowLeft, Eye, EyeSlash } from '@phosphor-icons/react'
// other

// custom style
import {
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
  TextFieldPasswordCustom,
} from 'src/components'

// style
import { Button } from '@mui/material'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import classes from './styles.module.scss'
import YourRole from './yourRole'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// style

// custom style
const TypographyH1Custom = styled(Typography)({
  fontSize: '2.4rem',
  fontWeight: 'bold',
  color: '#3F444D',
})
const TypographyTextCustom = styled(Typography)({
  color: '#49516F',
  opacity: '0.7',
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
const ButtonArrowBack = styled(Button)(({ theme }) => ({
  backgroundColor: '#ffff',
  color: 'black',

  '&:hover': {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    color: theme.palette.primary.main,
  },
}))

const Login: NextPageWithLayout = () => {
  const { t } = useTranslation(['common', 'login'])
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()

  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  console.log('errors', errors)
  const dispatch = useAppDispatch()
  const [isRemember, setIsRemember] = useState<string>(
    localStorage.getItem('isRemember') as string
  )

  const onSubmit = (values: any) => {
    // dispatch(
    //   loginActions.doLogin({
    //     ...values,
    //     user_type: 'CUSTOMER',
    //   })
    // )
    console.log('value', values)
    dispatch(loadingActions.doLoading())

    loginAPI({
      ...values,
    })
      .then(async (response) => {
        const { data } = response.data

        await setAuthToken(data.access_token, data.refresh_token)
        dispatch(loadingActions.doLoadingSuccess())
        localStorage.setItem('isRemember', isRemember || '')
        pushMessage('Sign in successfully', 'success')
        // router.push('/')
        // if (values.remember) {
        //   localStorage.setItem('email', values.email)
        //   localStorage.setItem('password', values.password)
        // }
        // dispatch(permissionActions.doPermission())
        console.log('3333', data.info)
        if (data.info.user_type === 'MERCHANT') {
          router.push('/retailer/dashboard?type=ALL')
        } else {
          router.push('/supplier/dashboard?type=ALL')
        }
        // getListPermission()
        //   .then((response) => {
        //     const { data } = response.data
        //     console.log('permission', data)
        //     localStorage.setItem('permissions', JSON.stringify(data))
        //   })
        //   .catch(({ response }) => {
        //     const { status, data } = response
        //     dispatch(loadingActions.doLoadingFailure())
        //     pushMessage(handlerGetErrMessage(status, data), 'error')
        //   })
      })
      .catch(({ response }) => {
        console.log(
          '🚀 ~ file: index.page.tsx:163 ~ onSubmit ~ response:',
          response
        )
        const { status, data } = response

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
          pushMessage('First login', 'success')
        }
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  const [show, setShow] = useState<boolean>(false)
  const [roleNameSelected, setRoleNameSelected] = useState<string>()

  useEffect(() => {
    if (roleNameSelected === 'RETAILER') {
      // setValue('email', 'merchant@exnodes.vn')
      // setValue('password', '12345678')
      setValue('platform', 'MERCHANT')
    } else {
      // setValue('email', 'supplier@exnodes.vn')
      // setValue('password', '12345678')
      setValue('platform', roleNameSelected)
    }
  }, [roleNameSelected])

  return (
    <div className={classes['login-page']}>
      <Head>
        <title>{t('login:title')} | TWSS</title>
      </Head>
      <div
        className={`${classes['login-page__container']} ${
          !show ? classes['step1'] : classes['step2']
        }`}
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
          {show ? (
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
                      style={{ marginLeft: '-73px' }}
                    >
                      <ButtonArrowBack>
                        <ArrowLeft size={32} onClick={() => setShow(!show)} />
                      </ButtonArrowBack>
                      <TypographyH1Custom>
                        {t('login:signIn')}
                      </TypographyH1Custom>
                    </Stack>
                    <TypographyCustom>
                      {t('login:welcomeTo')}{' '}
                      <b>
                        {roleNameSelected} {t('login:portal')}
                      </b>
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
                  <Box mb={1}>
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
                      label={t('login:rememberMe')}
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
                {roleNameSelected === 'RETAILER' && (
                  <TypographyTextCustom variant="body1" mb={4}>
                    {t('login:newToTws')}{' '}
                    <Link href="/register">
                      <a className={classes.link}>{t('login:register')}</a>
                    </Link>
                  </TypographyTextCustom>
                )}

                {/* <Stack
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
          </Stack> */}
              </div>
              <TypographyTextCustom variant="body1">
                <Link href="/forgot-password">
                  <a className={classes.link}>{t('login:forgotPassword')}</a>
                </Link>
              </TypographyTextCustom>
            </>
          ) : (
            <YourRole
              handleClickRole={(roleNameSelected) => {
                setShow(!show)
                setRoleNameSelected(roleNameSelected)
              }}
            />
          )}
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
      ...(await serverSideTranslations(locale, ['common', 'account', 'login'])),
    },
  }
}
export default Login
