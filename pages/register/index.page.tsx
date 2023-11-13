// react
import React, { useCallback, useEffect, useRef } from 'react'
import type { ReactElement } from 'react'
// react

// next
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
// next

// mui
import { styled, useTheme } from '@mui/material/styles'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
// import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
// import IconButton from '@mui/material/IconButton'
// import { SelectChangeEvent } from '@mui/material/Select'
import FormControlLabel from '@mui/material/FormControlLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import IconButton from '@mui/material/IconButton'
// import VisibilityOff from '@mui/icons-material/VisibilityOff'
// import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
// import Input from '@mui/material/Input'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Checkbox from '@mui/material/Checkbox'
import FormHelperText from '@mui/material/FormHelperText'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Typography from '@mui/material/Typography'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'
// mui

// other
import SignatureCanvas from './parts/signatureCanvas'
import Cookies from 'js-cookie'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// other

// form
import { RegisterValidateType } from './registerModels'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, schemaCheckMail } from './validations'

// api
import { useAppDispatch } from 'src/store/hooks'
import {
  checkMailApi,
  registerApi,
  getMonthlyPurchaseApi,
  getMonthlySaleApi,
  getTypeOfSaleApi,
  getFindUsOverApi,
  organizationInfoApi,
} from './registerAPI'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
// api

// layout
import WrapLayout from 'src/layout/wrapLayout'
import type { NextPageWithLayout } from 'pages/_app.page'
// layout

// style
import classes from './styles.module.scss'
// style

// custom style
import {
  ButtonCustom,
  TextFieldCustom,
  SelectCustom,
  PlaceholderSelect,
  InputLabelCustom,
  MenuItemSelectCustom,
  ComponentFileUploader,
} from 'src/components'
import { Target } from '@phosphor-icons/react'
import { PatternFormat } from 'react-number-format'
import { Autocomplete, TextField } from '@mui/material'
import RequiredLabel from 'src/components/requiredLabel'
import dataState from './states.json'

const TypographyTitlePage = styled(Typography)({
  fontSize: '2.4rem',
  fontWeight: 'bold',
  color: '#3f444d',
})
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
type Props = {
  dataMonthlyPurchase: { id: number; monthly: string }[]
  dataMonthlySale: { id: number; monthly_sale: string }[]
  dataTypeOfSale: { id: number; type_of_sale: string }[]
  dataFindUsOver: { id: number; find_us_over: string }[]
  dataOrganizationInfo: any
}

const Register: NextPageWithLayout<Props> = ({
  dataMonthlyPurchase,
  dataMonthlySale,
  dataTypeOfSale,
  dataFindUsOver,
}) => {
  const { t } = useTranslation(['register'])
  const theme = useTheme()
  const router = useRouter()
  const token = Boolean(Cookies.get('token'))
  if (token) {
    router.push('/')
  }

  const signatureRef = useRef<any>(null)
  const [stateCheckMail, setStateCheckMail] = React.useState<CheckMail>({
    status: '',
    valueEmail: '',
  })
  const [stateValueMonthlyPurchase, setStateValueMonthlyPurchase] =
    React.useState<string>()
  const [stateValueMonthlySale, setStateValueMonthlySale] =
    React.useState<string>()
  const [stateValueTypeOfSale, setStateValueTypeOfSale] =
    React.useState<string>()
  const [stateValueFindUsOver, setStateValueFindUsOver] =
    React.useState<string>()

  const [stateOpenBackdrop, setStateOpenBackdrop] =
    React.useState<boolean>(false)

  const [pushMessage] = useEnqueueSnackbar()
  const {
    setValue,
    trigger,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterValidateType>({
    resolver: yupResolver(schema(t)),
    // reValidateMode: 'onChange',
    mode: 'all',
  })
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
  const dispatch = useAppDispatch()

  const onSubmitSignUp = (valueSignUp: RegisterValidateType) => {
    console.log('valueSignUp', valueSignUp)
    // setStateStatusSignature(!stateStatusSignature)
    if (stateCheckMail.valueEmail) {
      const newValues = {
        ...valueSignUp,
        state: valueSignUp.state.abbreviation,
        phone_number: valueSignUp.phone_number
          .replace('(', '')
          .replace(')', '')
          .replaceAll(' ', ''),
        email: stateCheckMail.valueEmail,
        website_link_url: valueSignUp.website_link_url
          ? valueSignUp.website_link_url
          : null,
      }
      if (
        !valueSignUp.organization_refferal ||
        valueSignUp.organization_refferal == ''
      ) {
        delete newValues.organization_refferal
      }

      registerApi(newValues)
        .then((response) => {
          const data = response.data
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(data.message, 'success')
          router.push('/login')
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })

      // pushMessage('Sign-up successfully', 'success')
    }
  }

  const onSubmit = useCallback((values: any) => {
    signatureRef?.current?.handleSignature(values)
  }, [])

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

  //
  const handleChangeMonthlyPurchase = (value: number) => {
    setStateValueMonthlyPurchase(
      dataMonthlyPurchase.find((obj) => obj.id === value)?.monthly
    )
  }

  const handleChangeMonthlySale = (value: number) => {
    setStateValueMonthlySale(
      dataMonthlySale.find((obj) => obj.id === value)?.monthly_sale
    )
  }

  const handleChangeTypeOfSale = (value: number) => {
    setStateValueTypeOfSale(
      dataTypeOfSale.find((obj) => obj.id === value)?.type_of_sale
    )
  }

  const handleChangeFindUsOver = (value: number) => {
    setStateValueFindUsOver(
      dataFindUsOver.find((obj) => obj.id === value)?.find_us_over
    )
  }

  const IntervalTimerFunctional = () => {
    const [time, setTime] = React.useState(10)
    useEffect(() => {
      const timerId = setInterval(() => {
        setTime((t) => {
          if (t === 1) {
            window.location.href = `${
              router.locale !== router.defaultLocale ? `/${router.locale}` : ''
            }/register`
          }
          return t - 1
        })
      }, 1000)

      return () => clearInterval(timerId)
    }, [])

    return <>{time}</>
  }

  console.log('router', router)

  useEffect(() => {
    if (router.query.refcode) {
      setValue('organization_refferal', String(router.query.refcode))
      organizationInfoApi({ organization_refferal: `${router.query.refcode}` })
        .then((res) => {
          const { data } = res.data
          console.log('data', data)
          dispatch(loadingActions.doLoadingSuccess())
          setValue('find_us_over', '6')
          setValue('find_us_over_other', data?.find_us_over_other)
          setStateValueFindUsOver('Referring Business Name')
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          setStateOpenBackdrop(true)
        })
    }
  }, [router.query.refcode])

  return (
    <div className={classes['register-page']}>
      <Head>
        <title>{t('register:title')} | TWSS</title>
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
          <Stack alignItems="center" mb={4}>
            <TypographyTitlePage variant="h1">
              {t('register:title')}
            </TypographyTitlePage>
          </Stack>
          <form onSubmit={handleSubmitCheckMail(onSubmitCheckMail)}>
            <Stack direction="row" alignItems="center" mb={2} spacing={2}>
              <Target size={18} color={theme.palette.primary.main} />
              <TypographyTitleSection variant="h3">
                {t('register:verifyYourEmail')}
              </TypographyTitleSection>
            </Stack>

            <Controller
              control={controlCheckMail}
              name="email"
              defaultValue=""
              render={({ field }) => (
                <Box mb={5}>
                  <InputLabelCustom
                    htmlFor="email"
                    error={!!errorsCheckMail.email}
                  >
                    <RequiredLabel />
                    {t('register:email')}
                  </InputLabelCustom>
                  <TextFieldCheckMailCustom fullWidth>
                    <Grid container rowSpacing={3} columnSpacing={2}>
                      <Grid xs={6}>
                        <OutlinedInput
                          id="email"
                          fullWidth
                          placeholder={t('register:enterEmail')}
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
                        <ButtonRegisterCustom variant="contained" type="submit">
                          {t('register:check')}
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
            onSubmit={handleSubmit(onSubmit)}
            className={classes['register-form']}
          >
            <Stack direction="row" alignItems="center" mb={2} spacing={2}>
              <Target size={18} color={theme.palette.primary.main} />
              <TypographyTitleSection variant="h3">
                {t('register:inputInformation')}
              </TypographyTitleSection>
            </Stack>
            <Grid container rowSpacing={3} columnSpacing={2} mb={4}>
              <Grid xs={4}>
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
                        {t('register:firstName')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="first_name"
                          error={!!errors.first_name}
                          placeholder={t('register:enterFirstName')}
                          {...field}
                        />
                        <FormHelperText error={!!errors.first_name}>
                          {errors.first_name && `${errors.first_name.message}`}
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
                  name="last_name"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="last_name"
                        error={!!errors.last_name}
                      >
                        <RequiredLabel />
                        {t('register:lastName')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="last_name"
                          error={!!errors.last_name}
                          placeholder={t('register:enterLastName')}
                          {...field}
                        />
                        <FormHelperText error={!!errors.last_name}>
                          {errors.last_name && `${errors.last_name.message}`}
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
                  name="phone_number"
                  render={({ field }) => {
                    console.log(field)
                    return (
                      <Box>
                        <InputLabelCustom
                          htmlFor="phone_number"
                          error={!!errors.phone_number}
                        >
                          <RequiredLabel />
                          {t('register:phoneNumber')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <div className={classes['input-number']}>
                            <PatternFormat
                              id="phone_number"
                              customInput={TextField}
                              {...field}
                              error={!!errors.phone_number}
                              placeholder={t('register:enterPhoneNumber')}
                              format="(###) ### ####"
                            />
                          </div>
                          <FormHelperText error={!!errors.phone_number}>
                            {errors.phone_number &&
                              `${errors.phone_number.message}`}
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
                  name="business_name"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="business_name"
                        error={!!errors.business_name}
                      >
                        <RequiredLabel />
                        {t('register:businessName')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="business_name"
                          placeholder={t('register:enterBusinessName')}
                          error={!!errors.business_name}
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
                  name="website_link_url"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="website_link_url"
                        error={!!errors.website_link_url}
                      >
                        {t('register:websiteLinkURL')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="website_link_url"
                          error={!!errors.website_link_url}
                          placeholder={t('register:ex')}
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
                  name="monthly_purchase"
                  defaultValue=""
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="monthly_purchase"
                        error={!!errors.monthly_purchase}
                      >
                        <RequiredLabel />
                        {t('register:averageMonthlyPurchaseVolume')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="monthly_purchase"
                          displayEmpty
                          disabled={
                            dataMonthlyPurchase?.length > 0 ? false : true
                          }
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('register:selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return dataMonthlyPurchase?.find(
                              (obj) => obj.id === value
                            )?.monthly
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('monthly_purchase', event.target.value)
                            trigger('monthly_purchase')
                            handleChangeMonthlyPurchase(event.target.value)
                          }}
                        >
                          {/* {stateSelectMonthlyPurchase?.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.id}
                                key={index + Math.random()}
                              >
                                {item.monthly}
                              </MenuItemSelectCustom>
                            )
                          })} */}
                          {dataMonthlyPurchase?.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.id}
                                key={index + Math.random()}
                              >
                                {item.monthly}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText error={!!errors.monthly_purchase}>
                          {errors.monthly_purchase &&
                            `${errors.monthly_purchase.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
                {stateValueMonthlyPurchase === 'OTHER' && (
                  <Controller
                    control={control}
                    name="monthly_purchase_other"
                    render={({ field }) => (
                      <Box mt={1}>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            multiline
                            rows={2}
                            id="monthly_purchase_other"
                            error={!!errors.monthly_purchase_other}
                            inputProps={{ maxLength: 200 }}
                            placeholder={t(
                              'register:inputOtherAverageMonthlyPurchaseVolume'
                            )}
                            {...field}
                          />
                          <FormHelperText
                            error={!!errors.monthly_purchase_other}
                          >
                            {errors.monthly_purchase_other &&
                              `${errors.monthly_purchase_other.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                )}
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  defaultValue=""
                  name="monthly_sale"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="monthly_sale"
                        error={!!errors.monthly_sale}
                      >
                        <RequiredLabel />
                        {t('register:averageMonthlySaleVolume')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="monthly_sale"
                          displayEmpty
                          disabled={dataMonthlySale?.length > 0 ? false : true}
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('register:selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return dataMonthlySale?.find(
                              (obj) => obj.id === value
                            )?.monthly_sale
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('monthly_sale', event.target.value)
                            trigger('monthly_sale')
                            handleChangeMonthlySale(event.target.value)
                          }}
                        >
                          {dataMonthlySale?.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.id}
                                key={index + Math.random()}
                              >
                                {item.monthly_sale}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText error={!!errors.monthly_sale}>
                          {errors.monthly_sale &&
                            `${errors.monthly_sale.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
                {stateValueMonthlySale === 'OTHER' && (
                  <Controller
                    control={control}
                    name="monthly_sale_other"
                    render={({ field }) => (
                      <Box mt={1}>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            multiline
                            rows={2}
                            id="monthly_sale_other"
                            error={!!errors.monthly_sale_other}
                            inputProps={{ maxLength: 200 }}
                            placeholder={t(
                              'register:inputOtherAverageMonthlySaleVolume'
                            )}
                            {...field}
                          />
                          <FormHelperText error={!!errors.monthly_sale_other}>
                            {errors.monthly_sale_other &&
                              `${errors.monthly_sale_other.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                )}
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="type_of_sale"
                  defaultValue=""
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="type_of_sale"
                        error={!!errors.type_of_sale}
                      >
                        <RequiredLabel />
                        {t('register:typeOfSale')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="type_of_sale"
                          displayEmpty
                          disabled={dataTypeOfSale?.length > 0 ? false : true}
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('register:selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return dataTypeOfSale?.find(
                              (obj) => obj.id === value
                            )?.type_of_sale
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('type_of_sale', event.target.value)
                            trigger('type_of_sale')
                            handleChangeTypeOfSale(event.target.value)
                          }}
                        >
                          {dataTypeOfSale?.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.id}
                                key={index + Math.random()}
                              >
                                {item.type_of_sale}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText error={!!errors.type_of_sale}>
                          {errors.type_of_sale &&
                            `${errors.type_of_sale.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
                {stateValueTypeOfSale === 'OTHER' && (
                  <Controller
                    control={control}
                    name="type_of_sale_other"
                    render={({ field }) => (
                      <Box mt={1}>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="type_of_sale_other"
                            error={!!errors.type_of_sale_other}
                            placeholder={t('register:inputValue')}
                            {...field}
                          />
                          {errors.type_of_sale_other && (
                            <FormHelperText error={!!errors.type_of_sale_other}>
                              {errors.type_of_sale_other &&
                                `${errors.type_of_sale_other.message}`}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Box>
                    )}
                  />
                )}
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  defaultValue=""
                  name="total_locations"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="total_locations"
                        error={!!errors.total_locations}
                      >
                        <RequiredLabel />
                        {t('register:howManyLocations')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="total_locations"
                          error={!!errors.total_locations}
                          placeholder="Ex: 0 > 10.000"
                          {...field}
                        />
                        <FormHelperText error={!!errors.total_locations}>
                          {errors.total_locations &&
                            `${errors.total_locations.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="find_us_over"
                  defaultValue=""
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="find_us_over"
                        error={!!errors.find_us_over}
                      >
                        <RequiredLabel />
                        {t('register:howDidYouFindUs')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="find_us_over"
                          displayEmpty
                          disabled={dataFindUsOver?.length > 0 ? false : true}
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('register:selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return dataFindUsOver?.find(
                              (obj) => obj.id === value
                            )?.find_us_over
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('find_us_over', event.target.value)
                            console.log(
                              'event.target.value',
                              event.target.value
                            )
                            trigger('find_us_over')
                            handleChangeFindUsOver(event.target.value)
                          }}
                        >
                          {dataFindUsOver?.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.id}
                                key={index + Math.random()}
                              >
                                {item.find_us_over}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText error={!!errors.find_us_over}>
                          {errors.find_us_over &&
                            `${errors.find_us_over.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
                {(stateValueFindUsOver === 'OTHER' ||
                  stateValueFindUsOver === 'Referring Business Name') && (
                  <Controller
                    control={control}
                    name="find_us_over_other"
                    render={({ field }) => (
                      <Box mt={1}>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="find_us_over_other"
                            error={!!errors.find_us_over_other}
                            placeholder={t('register:inputValue')}
                            {...field}
                          />
                          <FormHelperText error={!!errors.find_us_over_other}>
                            {errors.find_us_over_other &&
                              `${errors.find_us_over_other.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                )}
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="id_verification"
                  defaultValue=""
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="id_verification"
                        error={!!errors.id_verification}
                      >
                        <RequiredLabel />
                        {t('register:doYouHaveAnIdAgeVerificationSystem')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="id_verification"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('register:selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return [
                              { value: 'YES', label: 'Yes' },
                              { value: 'NO', label: 'No' },
                            ].find((obj) => obj.value === value)?.label
                          }}
                          {...field}
                        >
                          <MenuItemSelectCustom value="YES">
                            {t('register:yes')}
                          </MenuItemSelectCustom>
                          <MenuItemSelectCustom value="NO">
                            {t('register:no')}
                          </MenuItemSelectCustom>
                        </SelectCustom>
                        <FormHelperText error={!!errors.id_verification}>
                          {errors.id_verification &&
                            `${errors.id_verification.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="payment_processing"
                  defaultValue=""
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="payment_processing"
                        error={!!errors.payment_processing}
                      >
                        <RequiredLabel />
                        {t(
                          'register:doYouCurrentlyHaveAPaymentProcessingSystem'
                        )}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="payment_processing"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('register:selectValue')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return [
                              { value: 'YES', label: 'Yes' },
                              { value: 'NO', label: 'No' },
                              { value: 'IN_PROCESS', label: 'In Process' },
                            ].find((obj) => obj.value === value)?.label
                          }}
                          {...field}
                        >
                          <MenuItemSelectCustom value="YES">
                            {t('register:yes')}
                          </MenuItemSelectCustom>
                          <MenuItemSelectCustom value="NO">
                            {t('register:no')}
                          </MenuItemSelectCustom>
                          <MenuItemSelectCustom value="IN_PROCESS">
                            {t('register:inProcess')}
                          </MenuItemSelectCustom>
                        </SelectCustom>
                        <FormHelperText error={!!errors.payment_processing}>
                          {errors.payment_processing &&
                            `${errors.payment_processing.message}`}
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
                  name="federal_tax_id"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="federal_tax_id"
                        error={!!errors.federal_tax_id}
                      >
                        <RequiredLabel />
                        {t('register:federalTaxID')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="federal_tax_id"
                          error={!!errors.federal_tax_id}
                          placeholder={t('register:enterFederalTaxID')}
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
                        {t('register:businessTaxDocument')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <input id="business_tax_document" {...field} hidden />
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
                        <FormHelperText error={!!errors.business_tax_document}>
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
                        {t(
                          'register:vapor&TobaccoLicenses(IfRequiredByYourState)'
                        )}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <input id="vapor_tobacco_license" {...field} hidden />
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
                        <FormHelperText error={!!errors.vapor_tobacco_license}>
                          {errors.vapor_tobacco_license &&
                            `${errors.vapor_tobacco_license.message}`}
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
                        {t('register:streetAddress')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="address"
                          error={!!errors.address}
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
                        {t('register:addressLine2')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="sub_address"
                          error={!!errors.sub_address}
                          {...field}
                        />
                        {errors.sub_address && (
                          <FormHelperText error={!!errors.sub_address}>
                            {errors.sub_address &&
                              `${errors.sub_address.message}`}
                          </FormHelperText>
                        )}
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
                      <InputLabelCustom htmlFor="city" error={!!errors.city}>
                        <RequiredLabel />
                        {t('register:city')}
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
                            '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
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
                        {t('register:postal/ZipCode')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="postal_zipcode"
                          error={!!errors.postal_zipcode}
                          {...field}
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
              <Grid xs={4}>
                <Controller
                  control={control}
                  defaultValue=""
                  name="organization_refferal"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="organization_refferal"
                        error={!!errors.organization_refferal}
                      >
                        {t('register:referralCode')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="organization_refferal"
                          error={!!errors.organization_refferal}
                          {...field}
                        />
                        <FormHelperText error={!!errors.organization_refferal}>
                          {errors.organization_refferal &&
                            `${errors.organization_refferal.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
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
                        label={t(
                          'register:iHaveReadAndAgreeToTerms&Conditions'
                        )}
                      />
                      <FormHelperText error={!!errors.checkbox} defaultChecked>
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
                {t('register:submitSignUpRequest')}
              </ButtonRegisterCustom>
            </Stack>
          </form>
        </div>
      </div>

      {stateOpenBackdrop && (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={stateOpenBackdrop}
          // onClick={handleClose}
        >
          <Stack
            flexDirection="column"
            justifyItems="center"
            alignItems="center"
          >
            <CircularProgress color="inherit" />
            <Typography mt={2} mb={3} variant="h5">
              {t(
                'register:theInvitationLinkHasAlreadyExpiredOrIsInvalidThePageWillRefreshAutomaticallyIn'
              )}{' '}
              <IntervalTimerFunctional /> {t('register:seconds')}.
            </Typography>
            <a
              href={`${
                router.locale !== router.defaultLocale
                  ? `/${router.locale}`
                  : ''
              }/register`}
            >
              <Button variant="contained" sx={{ color: '#ffffff' }}>
                {t('register:refresh')}
              </Button>
            </a>
          </Stack>
        </Backdrop>
      )}
    </div>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  const dataMonthlyPurchase = await getMonthlyPurchaseApi()
    .then((response) => {
      const { data } = response.data
      return data
    })
    .catch(() => {
      return []
    })
  const dataMonthlySale = await getMonthlySaleApi()
    .then((response) => {
      const { data } = response.data
      return data
    })
    .catch(() => {
      return []
    })
  const dataTypeOfSale = await getTypeOfSaleApi()
    .then((response) => {
      const { data } = response.data
      return data
    })
    .catch(() => {
      return []
    })
  const dataFindUsOver = await getFindUsOverApi()
    .then((response) => {
      const { data } = response.data
      console.log('456', data)
      return data
    })
    .catch(() => {
      return []
    })
  return {
    props: {
      dataMonthlyPurchase: dataMonthlyPurchase,
      dataMonthlySale: dataMonthlySale,
      dataTypeOfSale: dataTypeOfSale,
      dataFindUsOver: dataFindUsOver,
      locale,
      ...(await serverSideTranslations(locale, ['register'])),
    },
  }
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <WrapLayout>{page}</WrapLayout>
}
Register.theme = 'light'

export default Register
