// react
import React, { useState, useEffect } from 'react'
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
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
// mui

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'

// api
import { useAppDispatch } from 'src/store/hooks'
import { loginActions } from './loginSlice'
// api

// layout
import WrapLayout from 'src/layout/wrapLayout'
import type { NextPageWithLayout } from 'pages/_app.page'
// layout

// other
import { Eye, EyeSlash } from 'phosphor-react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
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

const Login: NextPageWithLayout = () => {
  const router = useRouter()
  const token = Boolean(Cookies.get('token'))

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const dispatch = useAppDispatch()

  const onSubmit = (values: any) => {
    dispatch(
      loginActions.doLogin({
        ...values,
        user_type: 'CUSTOMER',
      })
    )
  }

  const [showPassword, setShowPassword] = useState<boolean>(false)

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }
  // fix error when use next theme
  // if (token) {
  //   router.push('/')
  // }
  // const [mounted, setMounted] = useState<boolean>(false)
  // useEffect(() => {
  //   setMounted(true)
  // }, [])

  // if (!mounted) {
  //   return (
  //     <div className="loading">
  //       <CircularProgress />
  //     </div>
  //   )
  // }

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
            <Box mb={2}>
              <Controller
                control={control}
                name="email"
                defaultValue="huy8691@gmail.com"
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
            <Box mb={5}>
              <Controller
                control={control}
                name="password"
                defaultValue="huy123456"
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
            <Stack alignItems="center">
              <ButtonCustom variant="contained" size="large" type="submit">
                Sign In
              </ButtonCustom>
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
