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

// mui
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import TabContext from '@mui/lab/TabContext'
import TabPanel from '@mui/lab/TabPanel'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
// mui

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, schemaPassword } from './validations'

// layout
import WrapLayout from 'src/layout/wrapLayout'
import type { NextPageWithLayout } from 'pages/_app.page'
// layout

// other
import dynamic from 'next/dynamic'
const ReactCodeInput = dynamic(import('react-code-input'))
import Cookies from 'js-cookie'
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

// api
import { useAppDispatch } from 'src/store/hooks'
import {
  checkMailApi,
  checkTokenCodeApi,
  resendTokenCodeApi,
  setNewPasswordApi,
} from './forgetPasswordAPI'
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
  margin: '0px auto',
})
const ButtonSubmitCustom = styled(ButtonCustom)(() => ({
  boxShadow: '0px 3px 44px rgba(71, 255, 123, 0.27)',
}))

const ForgotPassword: NextPageWithLayout = () => {
  const router = useRouter()
  const token = Boolean(Cookies.get('token'))
  if (token) {
    router.push('/')
  }
  const dispatch = useAppDispatch()
  const [stateCount, setStateCount] = useState<number>(60)
  const [stateCheckMail, setStateCheckMail] = React.useState<string>('')
  const [stateActiveStep, setStateActiveStep] = React.useState('1')

  const [pinCode, setPinCode] = useState('')
  const [error, setError] = useState(false)

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  // check password
  const {
    handleSubmit: handleSubmitPassword,
    control: controlPassword,
    formState: { errors: errorsPassword },
  } = useForm({
    resolver: yupResolver(schemaPassword),
    mode: 'all',
  })

  const onSubmitEmail = (values: any) => {
    dispatch(loadingActions.doLoading())
    checkMailApi(values)
      .then((response) => {
        const data = response.data
        setStateCheckMail(values.email)
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: data.message,
          })
        )
        setStateActiveStep('2')
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

  const handleCheckPinCode = () => {
    if (pinCode.length < 6) {
      setError(true)
    } else {
      dispatch(loadingActions.doLoading())
      checkTokenCodeApi({
        email: stateCheckMail,
        token: pinCode,
      })
        .then((response) => {
          const data = response.data
          dispatch(loadingActions.doLoadingSuccess())
          dispatch(
            notificationActions.doNotification({
              message: data.message,
            })
          )
          setStateActiveStep('3')
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
  }
  const handleResendTokenCode = () => {
    if (stateCount > 0 && stateCount < 60) {
      return
    }
    dispatch(loadingActions.doLoading())
    resendTokenCodeApi({
      email: stateCheckMail,
    })
      .then((response) => {
        const data = response.data
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: data.message,
          })
        )
        // set count down
        let time = Math.floor(Date.now() / 1000)
        Cookies.set('timeCountCookies', time.toString())
        setStateCount(59)
        let countDown = setInterval(() => {
          setStateCount((prevCount) => {
            if (prevCount === 1) {
              clearInterval(countDown)
              prevCount = 120
              return prevCount
            }
            prevCount = prevCount - 1
            return prevCount
          })
        }, 1000)
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
  const onSubmitPassword = (values: any) => {
    dispatch(loadingActions.doLoading())
    setNewPasswordApi({
      email: stateCheckMail,
      token: pinCode,
      new_password: values.new_password,
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

  const props: any = {
    className: `${classes.reactCodeInput} ${error && classes.error}`,
    inputStyle: {
      margin: '5px',
      width: '60px',
      height: '60px',
      border: '1px solid #E1E6EF',
      borderRadius: '10px',
      textAlign: 'center',
      fontSize: '40px',
    },
  }

  // set time count down in cookie
  // const countFunction = useMemo(() => {
  //   let time = Math.floor(Date.now() / 1000)
  //   let timeCountCookies = Cookies.get('timeCountCookies')
  //   if (timeCountCookies) {
  //     if (time - parseInt(timeCountCookies) > 60) {
  //       setStateCount(60)
  //       Cookies.remove('timeCountCookies')
  //     } else {
  //       // setStateActiveStep('2')
  //       setStateCount(60 - time + parseInt(timeCountCookies))
  //       let countDown = setInterval(() => {
  //         setStateCount((prevCount) => {
  //           if (prevCount === 1) {
  //             clearInterval(countDown)
  //             prevCount = 60
  //             return prevCount
  //           }
  //           prevCount = prevCount - 1
  //           return prevCount
  //         })
  //       }, 1000)
  //     }
  //   }
  // }, [])

  // fix error when use next theme
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)

    let time = Math.floor(Date.now() / 1000)
    let timeCountCookies = Cookies.get('timeCountCookies')
    Cookies.remove('timeCountCookies')
    if (timeCountCookies) {
      if (time - parseInt(timeCountCookies) > 60) {
        setStateCount(60)
      } else {
        // setStateActiveStep('2')
        setStateCount(60 - time + parseInt(timeCountCookies))
        let countDown = setInterval(() => {
          setStateCount((prevCount: number) => {
            if (prevCount === 1) {
              clearInterval(countDown)
              prevCount = 60
              return prevCount
            }
            prevCount = prevCount - 1
            return prevCount
          })
        }, 1000)
      }
    }
  }, [])

  if (!mounted) {
    return null
  }
  // fix error when use next theme

  return (
    <div className={classes['forgot-password-page']}>
      <Head>
        <title>Forgot your password | Vape</title>
      </Head>
      <div className={classes['forgot-password-page__container']}>
        <div className={classes['forgot-password-page__content']}>
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
            <TabContext value={stateActiveStep}>
              <TabPanel value="1">
                <Box mb={4} style={{ textAlign: 'center' }}>
                  <TypographyH1Custom variant="h1" mb={2}>
                    Forgot your password?
                  </TypographyH1Custom>
                  <Typography variant="body2">
                    Don’t worry, we will help you to setup a new one
                  </Typography>
                </Box>
                <form
                  onSubmit={handleSubmit(onSubmitEmail)}
                  className={classes['forgot-password-form']}
                >
                  <Box mb={2}>
                    <Controller
                      control={control}
                      name="email"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="email"
                            error={!!errors.email}
                          >
                            Email
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              error={!!errors.email}
                              {...field}
                            />
                            <FormHelperText error={!!errors.email}>
                              {errors.email && `${errors.email.message}`}
                            </FormHelperText>
                          </FormControl>
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
                      Next
                    </ButtonSubmitCustom>
                  </Stack>
                </form>
              </TabPanel>
              <TabPanel value="2">
                <Box mb={4} style={{ textAlign: 'center' }}>
                  <TypographyH1Custom variant="h1" mb={2}>
                    Forgot your password?
                  </TypographyH1Custom>
                  <TypographyBodyCustom variant="body2">
                    Please enter security code that we’ve sent to your email
                    address
                  </TypographyBodyCustom>
                </Box>
                <Box style={{ textAlign: 'center' }}>
                  <ReactCodeInput
                    type="number"
                    fields={6}
                    onChange={(value) => setPinCode(value)}
                    {...props}
                    // value={pinCode}
                  />
                  <Typography variant="body2" mb={3}>
                    Don’t receive code?
                    <span
                      className={`${
                        classes['forgot-password-page__resendOTP']
                      } ${
                        stateCount > 0 && stateCount < 60 && classes['disable']
                      }`}
                      onClick={() => handleResendTokenCode()}
                    >
                      Request again
                    </span>
                  </Typography>
                  {stateCount > 0 && stateCount < 60 && (
                    <Typography variant="body2" mb={3}>
                      Please retry in{' '}
                      <span className={classes['forgot-password-page__count']}>
                        {stateCount}
                      </span>{' '}
                      seconds
                    </Typography>
                  )}

                  <ButtonSubmitCustom
                    variant="contained"
                    size="large"
                    type="submit"
                    onClick={() => handleCheckPinCode()}
                    disabled={pinCode.length < 6 ? true : false}
                  >
                    Next
                  </ButtonSubmitCustom>
                </Box>
              </TabPanel>
              <TabPanel value="3">
                <Box mb={4} style={{ textAlign: 'center' }}>
                  <TypographyH1Custom variant="h1" mb={2}>
                    Set New Password
                  </TypographyH1Custom>
                  <TypographyBodyCustom variant="body2">
                    Your new password must be different to previously used
                    passwords.
                  </TypographyBodyCustom>
                </Box>
                <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                  <Box mb={2}>
                    <Controller
                      control={controlPassword}
                      name="new_password"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="outlined-adornment-password"
                            error={!!errorsPassword.new_password}
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
                              error={!!errorsPassword.new_password}
                            />
                            <FormHelperText error>
                              {errorsPassword.new_password &&
                                `${errorsPassword.new_password.message}`}
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
                    <ButtonSubmitCustom
                      variant="contained"
                      size="large"
                      type="submit"
                    >
                      Reset Password
                    </ButtonSubmitCustom>
                  </Stack>
                </form>
              </TabPanel>
            </TabContext>
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

ForgotPassword.getLayout = function getLayout(page: ReactElement) {
  return <WrapLayout>{page}</WrapLayout>
}
ForgotPassword.theme = 'light'
export default ForgotPassword
