// react
import React, { useState } from 'react'

// mui
import { styled } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import FormHelperText from '@mui/material/FormHelperText'
// import Typography from '@mui/material/Typography'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/router'
// mui

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schemaPassword } from './validations'

// layout
import type { NextPageWithLayout } from 'pages/_app.page'
// layout

// other
import { Eye, EyeSlash } from '@phosphor-icons/react'
// other

// custom style
import {
  ButtonCustom,
  InputLabelCustom,
  TextFieldPasswordCustom,
} from 'src/components'
import RequiredLabel from 'src/components/requiredLabel'

// style
// style

// api
import { useAppDispatch } from 'src/store/hooks'
import { setNewPasswordApi } from './changePasswordAPI'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { logOutAPI } from 'pages/login/loginAPI'
import Cookies from 'js-cookie'
import { Grid } from '@mui/material'
import { useTranslation } from 'next-i18next'

// import NestedLayout from 'src/layout/nestedLayout'
// import { Breadcrumbs } from '@mui/material'

// const TypographyH1Custom = styled(Typography)({
//   fontSize: '14px',
//   fontWeight: 'bold',
//   color: '#3f444d',
// })
// const TypographyTextCustom = styled(Typography)({
//   color: '#49516F',
//   opacity: '0.7',
// })
// const TypographyBodyCustom = styled(Typography)({
//   maxWidth: '300px',
//   marginLeft: 'auto',
//   marginRight: 'auto',
// })
const ButtonSubmitCustom = styled(ButtonCustom)(() => ({
  boxShadow: '0px 3px 44px rgba(71, 255, 123, 0.27)',
}))

const ChangePassword: NextPageWithLayout = () => {
  const { t } = useTranslation('account')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateShowCurrPassword, setStateShowCurrPassword] =
    useState<boolean>(false)
  const [stateShowNewPassword, setStateShowNewPassword] =
    useState<boolean>(false)
  const [stateShowConfirmPassword, setStateShowConfirmPassword] =
    useState<boolean>(false)

  const handleClickShowCurrPassword = () => {
    setStateShowCurrPassword(!stateShowCurrPassword)
  }
  const handleClickShowNewPassword = () => {
    setStateShowNewPassword(!stateShowNewPassword)
  }
  const handleClickShowConfirmPassword = () => {
    setStateShowConfirmPassword(!stateShowConfirmPassword)
  }

  // check password
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schemaPassword(t)),
    mode: 'all',
  })

  const onSubmitPassword = (values: any) => {
    console.log('password', values.new_password)
    dispatch(loadingActions.doLoading())
    setNewPasswordApi(values)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t('message.yourPasswordHasBeenUpdatedPleaseSignInAgain'),
          'success'
        )
        setTimeout(() => {
          logOutAPI()
            .then(() => {
              Cookies.remove('token')
              Cookies.remove('refreshToken')
              // clear all local storage
              localStorage.clear()
              // router.push('/login')

              window.location.href = `${
                router.locale !== router.defaultLocale
                  ? `/${router.locale}`
                  : ''
              }/login`
            })
            .catch(() => {
              dispatch(loadingActions.doLoadingFailure())
              pushMessage('Error', 'error')
            })
        }, 2000)
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        console.log('check', status, data)
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  // fix error when use next theme

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitPassword)}>
        <Box
          sx={{
            width: '100%',
            border: '1px solid #E1E6EF',
            padding: '25px',
            borderRadius: '10px',
            marginBottom: '35px',
          }}
        >
          <Grid container xs={6} mb={2}>
            <Controller
              control={control}
              name="current_password"
              defaultValue=""
              render={({ field }) => (
                <>
                  <InputLabelCustom
                    htmlFor="current_password"
                    error={!!errors.current_password}
                  >
                    <RequiredLabel />
                    {t('currentPassword')}
                  </InputLabelCustom>
                  <TextFieldPasswordCustom fullWidth variant="outlined">
                    <OutlinedInput
                      id="current_password"
                      type={stateShowCurrPassword ? 'text' : 'password'}
                      {...field}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowCurrPassword}
                          >
                            {stateShowCurrPassword ? (
                              <Eye size={24} />
                            ) : (
                              <EyeSlash size={24} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      error={!!errors.current_password}
                    />
                    <FormHelperText error sx={{ marginLeft: '0' }}>
                      {errors.current_password &&
                        `${errors.current_password.message}`}
                    </FormHelperText>
                  </TextFieldPasswordCustom>
                </>
              )}
            />
          </Grid>
          <Grid container xs={6} mb={2}>
            <Controller
              control={control}
              name="new_password"
              defaultValue=""
              render={({ field }) => (
                <>
                  <InputLabelCustom
                    htmlFor="new_password"
                    error={!!errors.new_password}
                  >
                    <RequiredLabel />
                    {t('newPassword')}
                  </InputLabelCustom>
                  <TextFieldPasswordCustom fullWidth variant="outlined">
                    <OutlinedInput
                      id="new_password"
                      type={stateShowNewPassword ? 'text' : 'password'}
                      {...field}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowNewPassword}
                          >
                            {stateShowNewPassword ? (
                              <Eye size={24} />
                            ) : (
                              <EyeSlash size={24} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }
                      error={!!errors.new_password}
                    />
                    <FormHelperText error sx={{ marginLeft: '0' }}>
                      {errors.new_password && `${errors.new_password.message}`}
                    </FormHelperText>
                  </TextFieldPasswordCustom>
                </>
              )}
            />
          </Grid>
          <Grid container xs={6} mb={2} sx={{ marginBottom: '0' }}>
            <Controller
              control={control}
              name="confirm_password"
              defaultValue=""
              render={({ field }) => (
                <>
                  <InputLabelCustom
                    htmlFor="confirm_password"
                    error={!!errors.confirm_password}
                  >
                    <RequiredLabel />
                    {t('confirmPassword')}
                  </InputLabelCustom>
                  <TextFieldPasswordCustom fullWidth variant="outlined">
                    <OutlinedInput
                      id="confirm_password"
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
                      error={!!errors.confirm_password}
                    />
                    <FormHelperText error sx={{ marginLeft: '0' }}>
                      {errors.confirm_password &&
                        `${errors.confirm_password.message}`}
                    </FormHelperText>
                  </TextFieldPasswordCustom>
                </>
              )}
            />
          </Grid>
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={2}
        >
          <ButtonSubmitCustom variant="contained" size="large" type="submit">
            {t('submit')}
          </ButtonSubmitCustom>
        </Stack>
      </form>
    </>
  )
}

export default ChangePassword
