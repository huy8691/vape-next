// react
import React, { useState } from 'react'
import type { ReactElement } from 'react'
// react

// next
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined'
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
import ReactCodeInput from 'react-code-input'
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

const TypographyH1Custom = styled(Typography)({
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#3f444d',
})
const TypographyTextCustom = styled(Typography)({
  color: '#49516F',
  opacity: '0.7',
})

const ForgotPassword: NextPageWithLayout = () => {
  const [value, setValue] = React.useState('1')

  const [pinCode, setPinCode] = useState('')
  const [error, setError] = useState(true)

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
    mode: 'onBlur',
  })

  const onSubmit = (values: any) => {
    console.log('sdfds', values)
    setValue('2')
  }

  const onSubmitPassword = (values: any) => {
    setValue('2')
  }

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const checkPinCode = () => {
    if (pinCode.length < 4) {
      setError(false)
      setTimeout(function () {
        setError(true)
      }, 3000)
    } else {
      handlePinCode(pinCode)
    }
  }

  const handlePinChange = (pinCode) => {
    setPinCode(pinCode)
  }

  const props = {
    className: `${classes.reactCodeInput} ${!error && classes.error}`,
    inputStyle: {
      margin: '5px',
      width: '60px',
      height: '60px',
      border: '1px solid #E1E6EF',
      borderRadius: '10px',
      textAlign: 'center',
      fontSize: '40px',
      '& :focus': {
        boxShadow: '1px 2px 1px #000',
      },
    },
    inputStyleInvalid: {
      margin: '5px',
      width: '60px',
      height: '60px',
      border: '1px solid #E1E6EF',
      borderRadius: '10px',
      textAlign: 'center',
      fontSize: '40px',
    },
  }

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
            <TabContext value={value}>
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
                  onSubmit={handleSubmit(onSubmit)}
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
                    <ButtonCustom
                      variant="contained"
                      size="large"
                      type="submit"
                    >
                      Next
                    </ButtonCustom>
                  </Stack>
                </form>
              </TabPanel>
              <TabPanel value="2">
                <Box mb={4} style={{ textAlign: 'center' }}>
                  <TypographyH1Custom variant="h1" mb={2}>
                    Forgot your password?
                  </TypographyH1Custom>
                  <Typography variant="body2">
                    Please enter security code that we’ve sent to your email
                    address
                  </Typography>
                </Box>
                <Box style={{ textAlign: 'center' }}>
                  <ReactCodeInput
                    type="number"
                    fields={6}
                    onChange={handlePinChange}
                    {...props}
                    value={pinCode}
                  />
                  <Typography variant="body2" mb={3}>
                    Don’t receive code?
                    <span>Request again</span>
                  </Typography>
                  <Typography variant="body2" mb={3}>
                    Please retry in 60 seconds
                  </Typography>
                  <ButtonCustom
                    variant="contained"
                    size="large"
                    type="submit"
                    onClick={() => setValue('3')}
                  >
                    Next
                  </ButtonCustom>
                </Box>
              </TabPanel>
              <TabPanel value="3">
                <Box mb={4} style={{ textAlign: 'center' }}>
                  <TypographyH1Custom variant="h1" mb={2}>
                    Set New Password
                  </TypographyH1Custom>
                  <Typography variant="body2">
                    Your new password must be different to previously used
                    passwords.
                  </Typography>
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
                                      <VisibilityOffOutlinedIcon />
                                    ) : (
                                      <VisibilityOutlinedIcon />
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
                                      <VisibilityOffOutlinedIcon />
                                    ) : (
                                      <VisibilityOutlinedIcon />
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
                    <ButtonCustom
                      variant="contained"
                      size="large"
                      type="submit"
                    >
                      Reset Password
                    </ButtonCustom>
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
