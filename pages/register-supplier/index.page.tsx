import React, {
  ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

import classes from './styles.module.scss'
import { NextPageWithLayout } from 'pages/_app.page'
import WrapLayout from 'src/layout/wrapLayout'
import Head from 'next/head'
import Grid from '@mui/material/Unstable_Grid2'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Stack,
  TextField,
} from '@mui/material'
import Image from 'next/image'
import {
  ButtonCustom,
  ComponentFileUploader,
  InputLabelCustom,
  TextFieldCustom,
  TypographyTitlePage,
} from 'src/components'
import { Target } from '@phosphor-icons/react'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { Controller, useForm } from 'react-hook-form'
import RequiredLabel from 'src/components/requiredLabel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { PatternFormat } from 'react-number-format'
import SignatureCanvas from './parts/signatureCanvas'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { checkMailApi, registerApi } from './registerSupplierAPI'
import { useAppDispatch } from 'src/store/hooks'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, schemaCheckMail } from './validations'
import dataState from './states.json'
import { RegisterValidateType } from './registerSupplierModel'
import RegisterSentComponent from './parts/requestSent'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'react-i18next'

const TypographyTitleSection = styled(Typography)({
  fontSize: '1.8rem',
  color: '#3f444d',
})

const TextFieldCheckMailCustom = styled(FormControl)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: '1.4rem',
    paddingRight: '0px',
  },
  '& .MuiInputBase-input': {
    padding: '10px 15px',
  },
})
const ButtonRegisterCustom = styled(ButtonCustom)(() => ({
  boxShadow: '0px 3px 44px rgba(71, 255, 123, 0.27)',
}))
type CheckMail = {
  status: string
  valueEmail: string
}
const RegisterSupplier: NextPageWithLayout = () => {
  const { t } = useTranslation('register-supplier')
  const theme = useTheme()
  const signatureRef = useRef<any>(null)
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateShowRequestSent, setStateShowRequestSent] = useState(true)

  const [stateCheckInputShippingService, setStateCheckInputShippingService] =
    useState(true)
  const [stateCheckMail, setStateCheckMail] = React.useState<CheckMail>({
    status: '',
    valueEmail: '',
  })
  //List item checkbox
  const listItem = useMemo(
    () => [
      {
        value: 'USPS',
        label: 'USPS',
      },
      {
        value: 'FEDEX',
        label: 'FEDEX',
      },
      {
        value: 'UPS',
        label: 'UPS',
      },
      {
        value: 'OTHER',
        label: t('other'),
      },
    ],
    [t]
  )
  // check mail
  const {
    setValue: setValueCheckMail,
    handleSubmit: handleSubmitCheckMail,
    control: controlCheckMail,
    formState: { errors: errorsCheckMail },
  } = useForm({
    resolver: yupResolver(schemaCheckMail(t)),

    mode: 'all',
  })
  const onSubmitCheckMail = (values: any) => {
    dispatch(loadingActions.doLoading())
    checkMailApi(values)
      .then((response) => {
        const data = response.data
        setStateCheckMail({
          status: 'success',
          valueEmail: values.email,
        })
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(data.message, 'success')
      })
      .catch((response) => {
        // const data = error.response?.data
        // setStateCheckMail({
        //   status: 'error',
        //   valueEmail: '',
        // })
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  //form info
  const {
    setValue,
    trigger,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterValidateType>({
    defaultValues: {
      shipping_services: [''],
    },
    resolver: yupResolver(schema(t)),
    reValidateMode: 'onChange',
    mode: 'all',
  })

  const onSubmit = useCallback((values: any) => {
    signatureRef?.current?.handleSignature(values)
  }, [])

  const onSubmitSignUp = (valueSignUp: RegisterValidateType) => {
    console.log(
      '🚀 ~ file: index.page.tsx:175 ~ onSubmitSignUp ~ valueSignUp:',
      valueSignUp
    )
    // setStateStatusSignature(!stateStatusSignature)
    if (stateCheckMail.valueEmail) {
      const newValues = {
        ...valueSignUp,
        phone_number: valueSignUp.phone_number
          .replace('(', '')
          .replace(')', '')
          .replaceAll(' ', ''),
        email: stateCheckMail.valueEmail,
        website_link_url: valueSignUp.website_link_url
          ? valueSignUp.website_link_url
          : null,
        state: valueSignUp.state.abbreviation,
        business_phone_number: valueSignUp.business_phone_number
          .replace('(', '')
          .replace(')', '')
          .replaceAll(' ', ''),
        poc_phone_number: valueSignUp.poc_phone_number
          .replace('(', '')
          .replace(')', '')
          .replaceAll(' ', ''),
        bank_phone_number: valueSignUp.bank_phone_number
          .replace('(', '')
          .replace(')', '')
          .replaceAll(' ', ''),
        shipping_services:
          valueSignUp.shipping_services.length >= 1
            ? `${valueSignUp.shipping_services.toString()},${
                valueSignUp.name_shipping
              }`
            : valueSignUp.name_shipping,
      }
      registerApi(newValues)
        .then((response) => {
          const data = response.data
          console.log('🚀 ~ file: index.page.tsx:212 ~ .then ~ data:', data)
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(data.message, 'success')
          setStateShowRequestSent(false)
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  return (
    <>
      <div className={classes['register-page']}>
        <Head>
          <title>{t('title')} | TWSS</title>
        </Head>
        <div className={`${classes['register-page__container']} container`}>
          <div className={classes['register-page__content']}>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
              mb={4}
            >
              <Grid xs="auto">
                <Link href="/login">
                  <a>
                    <Button variant="text" size="large">
                      <ArrowBackIcon />
                    </Button>
                  </a>
                </Link>
              </Grid>
              <Grid xs>
                <div className={classes['register-page__logo']}>
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
                </div>
              </Grid>
            </Grid>
            {stateShowRequestSent ? (
              <>
                <Stack alignItems="center" mb={4}>
                  <TypographyTitlePage variant="h1">
                    {t('supplierSignUpRequest')}
                  </TypographyTitlePage>
                </Stack>
                {/* <form onSubmit={handleSubmitCheckMail(onSubmitCheckMail)}> */}

                <form onSubmit={handleSubmitCheckMail(onSubmitCheckMail)}>
                  <Stack mb={2}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      mb={1}
                      spacing={2}
                    >
                      <Target size={18} color={theme.palette.primary.main} />
                      <TypographyTitleSection variant="h3">
                        {t('verifyYourEmail')}
                      </TypographyTitleSection>
                    </Stack>
                    <Typography color="#49516F" fontSize="14px">
                      {t(
                        'thisEmailIsUsedToReceiveLoginInformationForTheSupplierAccountAfterItHasBeenCreated'
                      )}
                    </Typography>
                  </Stack>

                  <Controller
                    control={controlCheckMail}
                    name="email"
                    defaultValue=""
                    render={({ field }) => (
                      <Box mb={5}>
                        <InputLabelCustom
                          htmlFor="email"
                          // error={!!errorsCheckMail.email}
                        >
                          <RequiredLabel />
                          {t('email')}
                        </InputLabelCustom>
                        <TextFieldCheckMailCustom fullWidth>
                          <Grid container rowSpacing={3} columnSpacing={2}>
                            <Grid xs={6}>
                              <OutlinedInput
                                id="email"
                                fullWidth
                                placeholder={t('enterEmail')}
                                error={!!errorsCheckMail.email}
                                {...field}
                                onChange={(event: any) => {
                                  setValueCheckMail('email', event.target.value)
                                  setStateCheckMail({
                                    valueEmail: '',
                                    status: '',
                                  })
                                }}
                                endAdornment={
                                  <>
                                    {stateCheckMail.status === 'success' && (
                                      <InputAdornment position="end">
                                        <IconButton>
                                          <CheckCircleIcon color="success" />
                                        </IconButton>
                                      </InputAdornment>
                                    )}
                                    {stateCheckMail.status === 'error' && (
                                      <InputAdornment position="end">
                                        <IconButton>
                                          <ErrorIcon color="error" />
                                        </IconButton>
                                      </InputAdornment>
                                    )}
                                  </>
                                }
                              />
                            </Grid>
                            <Grid xs>
                              <ButtonRegisterCustom
                                variant="contained"
                                type="submit"
                              >
                                {t('check')}
                              </ButtonRegisterCustom>
                            </Grid>
                          </Grid>
                          <FormHelperText error={!!errorsCheckMail.email}>
                            {errorsCheckMail.email &&
                              `${errorsCheckMail.email.message}`}
                          </FormHelperText>
                        </TextFieldCheckMailCustom>
                      </Box>
                    )}
                  />
                </form>
                <form
                  className={classes['register-form']}
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Stack direction="row" alignItems="center" mb={2} spacing={2}>
                    <Target size={18} color={theme.palette.primary.main} />
                    <TypographyTitleSection variant="h3">
                      {t('businessInformation')}
                    </TypographyTitleSection>
                  </Stack>
                  <Grid container rowSpacing={3} columnSpacing={2} mb={4}>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="business_name"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="business_name"
                              error={!!errors.business_name}
                            >
                              <RequiredLabel />
                              {t('businessName')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="business_name"
                                error={!!errors.business_name}
                                placeholder={t('enterBusinessName')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.business_name}>
                                {errors.business_name &&
                                  `${errors.business_name.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="business_phone_number"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="business_phone_number"
                              error={!!errors.business_phone_number}
                            >
                              <RequiredLabel />
                              {t('businessPhoneNumber')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <div className={classes['input-number']}>
                                <PatternFormat
                                  id="business_phone_number"
                                  customInput={TextField}
                                  {...field}
                                  error={!!errors.business_phone_number}
                                  placeholder={t('enterPhoneNumber')}
                                  format="(###) ### ####"
                                />
                              </div>
                              <FormHelperText
                                error={!!errors.business_phone_number}
                              >
                                {errors.business_phone_number &&
                                  `${errors.business_phone_number.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="website_link_url"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="website_link_url"
                              error={!!errors.website_link_url}
                            >
                              <Stack
                                direction={'row'}
                                alignContent={'center'}
                                spacing={1}
                              >
                                {/* <RequiredLabel /> */}
                                {t('website')}
                                <Typography>
                                  ({t('separateByAComma')})
                                </Typography>
                              </Stack>
                            </InputLabelCustom>

                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="website_link_url"
                                error={!!errors.website_link_url}
                                placeholder={t('ex')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.website_link_url}>
                                {errors.website_link_url &&
                                  `${errors.website_link_url.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="brands"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="branch"
                              error={!!errors.brands}
                            >
                              <Stack
                                direction={'row'}
                                alignContent={'center'}
                                spacing={1}
                              >
                                <RequiredLabel />
                                {t('branch')}
                                <Typography>
                                  ({t('separateByAComma')})
                                </Typography>
                              </Stack>
                            </InputLabelCustom>

                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="brands"
                                error={!!errors.brands}
                                placeholder={t('enterBrands')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.brands}>
                                {errors.brands && `${errors.brands.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="address"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="address"
                              error={!!errors.address}
                            >
                              <RequiredLabel />
                              {t('streetAddress')}
                            </InputLabelCustom>

                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="address"
                                error={!!errors.address}
                                placeholder={t('enterAddress')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.address}>
                                {errors.address && `${errors.address.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="sub_address"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="sub_address"
                              error={!!errors.sub_address}
                            >
                              {/* <RequiredLabel /> */}
                              {t('addressLine2')}
                            </InputLabelCustom>

                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="sub_address"
                                error={!!errors.sub_address}
                                placeholder={t('enterAddress')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.sub_address}>
                                {errors.sub_address &&
                                  `${errors.sub_address.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={4}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="city"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="city"
                              error={!!errors.city}
                            >
                              <RequiredLabel />
                              {t('city')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="city"
                                error={!!errors.city}
                                {...field}
                              />
                              <FormHelperText error={!!errors.city}>
                                {errors.city && `${errors.city.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={4}>
                      <Controller
                        control={control}
                        name="state"
                        render={({ field: { value } }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="state"
                              error={!!errors.state?.name}
                            >
                              <RequiredLabel />
                              {t('state')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <Autocomplete
                                getOptionLabel={(option) => option.name}
                                options={dataState}
                                value={value}
                                renderInput={(params) => (
                                  <TextFieldCustom
                                    error={!!errors.state?.name}
                                    {...(params as any)}
                                  />
                                )}
                                onChange={(_, newValue) => {
                                  console.log('event', newValue)
                                  if (newValue) {
                                    setValue('state', newValue)
                                  } else {
                                    setValue('state', {
                                      name: '',
                                      abbreviation: '',
                                    })
                                  }
                                  trigger('state')
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root .MuiAutocomplete-input':
                                    {
                                      padding: '1px 5px',
                                    },
                                }}
                              />
                              <FormHelperText error={!!errors.state?.name}>
                                {errors.state?.name &&
                                  `${errors.state?.name?.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={4}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="postal_zipcode"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="postal_zipcode"
                              error={!!errors.postal_zipcode}
                            >
                              <RequiredLabel />
                              {t('postal/ZipCode')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="postal_zipcode"
                                error={!!errors.postal_zipcode}
                                {...field}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setValue('postal_zipcode', e.target.value)
                                  trigger('postal_zipcode')
                                }}
                              />
                              <FormHelperText error={!!errors.postal_zipcode}>
                                {errors.postal_zipcode &&
                                  `${errors.postal_zipcode.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="federal_tax_id"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="federal_tax_id"
                              error={!!errors.federal_tax_id}
                            >
                              <RequiredLabel />
                              {t('federalTaxID')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="federal_tax_id"
                                error={!!errors.federal_tax_id}
                                placeholder={t('enterFederalTaxID')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.federal_tax_id}>
                                {errors.federal_tax_id &&
                                  `${errors.federal_tax_id.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="business_tax_document"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="business_tax_document"
                              error={!!errors.business_tax_document}
                            >
                              <RequiredLabel />
                              {t('businessTaxDocument')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <input
                                id="business_tax_document"
                                {...field}
                                hidden
                              />
                              <ComponentFileUploader
                                onFileSelectSuccess={(file: any) => {
                                  setValue('business_tax_document', file)
                                  trigger('business_tax_document')
                                }}
                                onFileSelectError={() => {
                                  return
                                }}
                                onFileSelectDelete={() => {
                                  setValue('business_tax_document', '')
                                  trigger('business_tax_document')
                                }}
                                errors={errors.business_tax_document}
                              />
                              <FormHelperText
                                error={!!errors.business_tax_document}
                              >
                                {errors.business_tax_document &&
                                  `${errors.business_tax_document.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="vapor_tobacco_license"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="vapor_tobacco_license"
                              error={!!errors.vapor_tobacco_license}
                            >
                              <RequiredLabel />
                              {t('vaporTobaccoLicensesIfRequiredByYourState')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <input
                                id="vapor_tobacco_license"
                                {...field}
                                hidden
                              />
                              <ComponentFileUploader
                                onFileSelectSuccess={(file: any) => {
                                  setValue('vapor_tobacco_license', file)
                                  trigger('vapor_tobacco_license')
                                }}
                                onFileSelectError={() => {
                                  return
                                }}
                                onFileSelectDelete={() => {
                                  setValue('vapor_tobacco_license', '')
                                  trigger('vapor_tobacco_license')
                                }}
                                errors={errors.vapor_tobacco_license}
                              />
                              <FormHelperText
                                error={!!errors.vapor_tobacco_license}
                              >
                                {errors.vapor_tobacco_license &&
                                  `${errors.vapor_tobacco_license.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Stack direction="row" alignItems="center" mb={2} spacing={2}>
                    <Target size={18} color={theme.palette.primary.main} />
                    <TypographyTitleSection variant="h3">
                      {t('ownerInformation')}
                    </TypographyTitleSection>
                  </Stack>
                  <Grid container rowSpacing={3} columnSpacing={2} mb={4}>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="first_name"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="first_name"
                              error={!!errors.first_name}
                            >
                              <RequiredLabel />
                              {t('firstName')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="first_name"
                                error={!!errors.first_name}
                                placeholder={t('enterFirstName')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.first_name}>
                                {errors.first_name &&
                                  `${errors.first_name.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="last_name"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="last_name"
                              error={!!errors.last_name}
                            >
                              <RequiredLabel />
                              {t('lastName')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="last_name"
                                error={!!errors.last_name}
                                placeholder={t('enterLastName')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.last_name}>
                                {errors.last_name &&
                                  `${errors.last_name.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="owner_email"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="owner_email"
                              error={!!errors.owner_email}
                            >
                              <RequiredLabel />
                              {t('ownerEmail')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="owner_email"
                                error={!!errors.owner_email}
                                placeholder={t('enterEmail')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.owner_email}>
                                {errors.owner_email &&
                                  `${errors.owner_email.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="phone_number"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="phone_number"
                              error={!!errors.phone_number}
                            >
                              <RequiredLabel />
                              {t('ownerPhoneNumber')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <div className={classes['input-number']}>
                                <PatternFormat
                                  id="phone_number"
                                  customInput={TextField}
                                  {...field}
                                  error={!!errors.phone_number}
                                  placeholder={t('enterPhoneNumber')}
                                  format="(###) ### ####"
                                />
                              </div>
                              <FormHelperText error={!!errors.phone_number}>
                                {errors.phone_number &&
                                  `${errors.phone_number.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Stack direction="row" alignItems="center" mb={2} spacing={2}>
                    <Target size={18} color={theme.palette.primary.main} />
                    <TypographyTitleSection variant="h3">
                      {t('pointOfContactInformation')}
                    </TypographyTitleSection>
                  </Stack>
                  <Grid container rowSpacing={3} columnSpacing={2} mb={4}>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="poc_first_name"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="poc_first_name"
                              error={!!errors.poc_first_name}
                            >
                              <RequiredLabel />
                              {t('firstName')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="poc_first_name"
                                error={!!errors.poc_first_name}
                                placeholder={t('enterFirstName')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.poc_first_name}>
                                {errors.poc_first_name &&
                                  `${errors.poc_first_name.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="poc_last_name"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="poc_last_name"
                              error={!!errors.poc_last_name}
                            >
                              <RequiredLabel />
                              {t('lastName')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="poc_last_name"
                                error={!!errors.poc_last_name}
                                placeholder={t('enterLastName')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.poc_last_name}>
                                {errors.poc_last_name &&
                                  `${errors.poc_last_name.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="poc_email"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="poc_email"
                              error={!!errors.poc_email}
                            >
                              <RequiredLabel />
                              {t('pocEmail')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="poc_email"
                                error={!!errors.poc_email}
                                placeholder={t('enterEmail')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.poc_email}>
                                {errors.poc_email &&
                                  `${errors.poc_email.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="poc_phone_number"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="poc_phone_number"
                              error={!!errors.poc_phone_number}
                            >
                              <RequiredLabel />
                              {t('pocPhoneNumber')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <div className={classes['input-number']}>
                                <PatternFormat
                                  id="poc_phone_number"
                                  customInput={TextField}
                                  {...field}
                                  error={!!errors.phone_number}
                                  placeholder={t('enterPhoneNumber')}
                                  format="(###) ### ####"
                                />
                              </div>
                              <FormHelperText error={!!errors.poc_phone_number}>
                                {errors.poc_phone_number &&
                                  `${errors.poc_phone_number.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Stack direction="row" alignItems="center" mb={2} spacing={2}>
                    <Target size={18} color={theme.palette.primary.main} />
                    <TypographyTitleSection variant="h3">
                      {t('bankWireInformation')}
                    </TypographyTitleSection>
                  </Stack>
                  <Grid container rowSpacing={3} columnSpacing={2} mb={4}>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="name_on_account"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="name_on_account"
                              error={!!errors.name_on_account}
                            >
                              <RequiredLabel />
                              {t('nameOnAccount')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="name_on_account"
                                error={!!errors.name_on_account}
                                placeholder={t('enterNameAccount')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.name_on_account}>
                                {errors.name_on_account &&
                                  `${errors.name_on_account.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="bank_name"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="bank_name"
                              error={!!errors.bank_name}
                            >
                              <RequiredLabel />
                              {t('bankName')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="bank_name"
                                error={!!errors.bank_name}
                                placeholder={t('enterBankName')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.bank_name}>
                                {errors.bank_name &&
                                  `${errors.bank_name.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="bank_address"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="bank_address"
                              error={!!errors.bank_address}
                            >
                              <RequiredLabel />
                              {t('bankAddress')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="bank_address"
                                error={!!errors.bank_address}
                                placeholder={t('enterBankAddress')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.bank_address}>
                                {errors.bank_address &&
                                  `${errors.bank_address.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="bank_phone_number"
                        render={({ field }) => {
                          console.log(field)
                          return (
                            <Box>
                              <InputLabelCustom
                                htmlFor="bank_phone_number"
                                error={!!errors.bank_phone_number}
                              >
                                <RequiredLabel />
                                {t('bankPhoneNumber')}
                              </InputLabelCustom>
                              <FormControl fullWidth>
                                <div className={classes['input-number']}>
                                  <PatternFormat
                                    id="bank_phone_number"
                                    customInput={TextField}
                                    {...field}
                                    error={!!errors.bank_phone_number}
                                    placeholder={t('enterNumberPhone')}
                                    format="(###) ### ####"
                                  />
                                </div>
                                <FormHelperText
                                  error={!!errors.bank_phone_number}
                                >
                                  {errors.bank_phone_number &&
                                    `${errors.bank_phone_number.message}`}
                                </FormHelperText>
                              </FormControl>
                            </Box>
                          )
                        }}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="routing_number"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="routing_number"
                              error={!!errors.routing_number}
                            >
                              <RequiredLabel />
                              {t('routingNumber')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="routing_number"
                                error={!!errors.routing_number}
                                placeholder={t('enterRoutingNumber')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.routing_number}>
                                {errors.routing_number &&
                                  `${errors.routing_number.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        defaultValue=""
                        name="account_number"
                        render={({ field }) => (
                          <Box>
                            <InputLabelCustom
                              htmlFor="account_number"
                              error={!!errors.account_number}
                            >
                              <RequiredLabel />
                              {t('accountNumber')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="account_number"
                                error={!!errors.account_number}
                                placeholder={t('enterAccountNumber')}
                                {...field}
                              />
                              <FormHelperText error={!!errors.account_number}>
                                {errors.account_number &&
                                  `${errors.account_number.message}`}
                              </FormHelperText>
                            </FormControl>
                          </Box>
                        )}
                      />
                    </Grid>
                  </Grid>
                  <Stack direction="row" alignItems="center" mb={2} spacing={2}>
                    <Target size={18} color={theme.palette.primary.main} />
                    <TypographyTitleSection variant="h3">
                      {t('preferredShippingServices')}
                    </TypographyTitleSection>
                  </Stack>
                  <Grid container rowSpacing={1} columnSpacing={2} mb={4}>
                    <Grid xs={12}>
                      <Controller
                        control={control}
                        name="shipping_services"
                        render={({ field }) => {
                          return (
                            <Box>
                              <FormControl
                                sx={{ flexDirection: 'column', gap: '10px' }}
                                fullWidth
                              >
                                <FormGroup>
                                  {listItem.map((item, index) => {
                                    return (
                                      <FormControlLabel
                                        key={index}
                                        control={<Checkbox />}
                                        label={item.label}
                                        onChange={(_event, boolean) => {
                                          if (boolean) {
                                            field.onChange([
                                              ...field.value.filter(
                                                (item) => item !== ''
                                              ),
                                              item.value,
                                            ])
                                            if (item.value === 'OTHER') {
                                              setStateCheckInputShippingService(
                                                false
                                              )
                                            }
                                          } else {
                                            field.onChange(
                                              field.value?.filter(
                                                (_item: string) =>
                                                  _item !== item.value
                                              )
                                            )
                                            if (item.value === 'OTHER') {
                                              setStateCheckInputShippingService(
                                                true
                                              )
                                            }
                                          }

                                          // if (boolean) {
                                          //   listValue.push((prev)=)
                                          // }
                                          // console.log(
                                          //   '🚀 ~ file: index.page.tsx:1282 ~ {listItem.map ~ listValue:',
                                          //   listValue
                                          // )
                                          // setValue('shipping_services', listValue)
                                        }}
                                      />
                                    )
                                  })}
                                </FormGroup>
                              </FormControl>
                              <FormHelperText
                                error={!!errors.shipping_services}
                              >
                                {errors.shipping_services &&
                                  `${errors.shipping_services.message}`}
                              </FormHelperText>
                            </Box>
                          )
                        }}
                      />
                    </Grid>
                    <Grid xs={4}>
                      {!stateCheckInputShippingService && (
                        <Controller
                          control={control}
                          defaultValue=""
                          name="name_shipping"
                          render={({ field }) => (
                            <Box>
                              <FormControl fullWidth>
                                <TextFieldCustom
                                  id="name_shipping"
                                  error={!!errors.name_shipping}
                                  placeholder={t('enterShippingServiceName')}
                                  {...field}
                                  disabled={stateCheckInputShippingService}
                                  // onKeyDown={(e: any) => {
                                  //   if (e.key === 'Enter') {
                                  //     setStateNameShippingServices(e.target.value)
                                  //   }
                                  // }}
                                />
                                <FormHelperText error={!!errors.name_shipping}>
                                  {errors.name_shipping &&
                                    `${errors.name_shipping.message}`}
                                </FormHelperText>
                              </FormControl>
                            </Box>
                          )}
                        />
                      )}
                    </Grid>
                    <Grid
                      xs={12}
                      container
                      direction="row"
                      justifyContent="center"
                      mt={4}
                    >
                      <Controller
                        control={control}
                        defaultValue={false}
                        name="checkbox"
                        render={({ field }) => (
                          <Box>
                            <FormControlLabel
                              control={<Checkbox {...field} />}
                              label={t('iHaveReadAndAgreeToTerms&Conditions')}
                            />
                            <FormHelperText
                              error={!!errors.checkbox}
                              defaultChecked
                            >
                              {errors.checkbox && `${errors.checkbox.message}`}
                            </FormHelperText>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid xs={12}>
                      <SignatureCanvas
                        clearOnResize={false}
                        uploadSignatureSuccess={(valueSignUp: any) => {
                          onSubmitSignUp(valueSignUp)
                        }}
                        uploadSignatureError={() => {
                          return
                        }}
                        ref={signatureRef}
                      />
                    </Grid>
                  </Grid>
                  <Stack direction="row" spacing={2}></Stack>
                  <Stack alignItems="center">
                    <ButtonRegisterCustom
                      variant="contained"
                      type="submit"
                      disabled={stateCheckMail.valueEmail === '' ? true : false}
                    >
                      {t('submitSignUpRequest')}
                    </ButtonRegisterCustom>
                  </Stack>
                </form>
              </>
            ) : (
              <>
                <RegisterSentComponent />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

RegisterSupplier.getLayout = function getLayout(page: ReactElement) {
  return <WrapLayout>{page}</WrapLayout>
}
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'register-supplier',
      ])),
    },
  }
}
RegisterSupplier.theme = 'light'

export default RegisterSupplier
