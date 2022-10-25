// react
import React, { useCallback, useRef, useEffect } from 'react'
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

// mui

// other
import SignatureCanvas from './parts/signatureCanvas'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
// other

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, schemaCheckMail } from './validations'

// api
import { useAppDispatch } from 'src/store/hooks'
import { registerActions } from './registerSlice'
import {
  checkMailApi,
  getMonthlyPurchaseApi,
  getMonthlySaleApi,
  getTypeOfSaleApi,
  getFindUsOverApi,
} from './registerAPI'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
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

type CheckMail = {
  status: string
  valueEmail: string
}
const Register: NextPageWithLayout = () => {
  const router = useRouter()
  const token = Boolean(Cookies.get('token'))
  if (token) {
    router.push('/')
  }
  const signatureRef = useRef()
  const [stateCheckMail, setStateCheckMail] = React.useState<CheckMail>({
    status: '',
    valueEmail: '',
  })
  const [stateValueMonthlyPurchase, setStateValueMonthlyPurchase] =
    React.useState<string>()
  const [stateSelectMonthlyPurchase, setStateSelectMonthlyPurchase] =
    React.useState<{ id: number; monthly: string }[]>([])

  const [stateValueMonthlySale, setStateValueMonthlySale] =
    React.useState<string>()
  const [stateSelectMonthlySale, setStateSelectMonthlySale] = React.useState<
    { id: number; monthly_sale: string }[]
  >([])
  const [stateValueTypeOfSale, setStateValueTypeOfSale] =
    React.useState<string>()
  const [stateSelectTypeOfSale, setStateSelectTypeOfSale] = React.useState<
    { id: number; type_of_sale: string }[]
  >([])
  const [stateValueFindUsOver, setStateValueFindUsOver] =
    React.useState<string>()
  const [stateSelectFindUsOver, setStateSelectFindUsOver] = React.useState<
    { id: number; find_us_over: string }[]
  >([])

  const {
    setValue,
    trigger,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    // reValidateMode: 'onChange',
    mode: 'all',
  })

  // check mail
  const {
    setValue: setValueCheckMail,
    handleSubmit: handleSubmitCheckMail,
    control: controlCheckMail,
    formState: { errors: errorsCheckMail },
    // reset: resetCheckMail,
  } = useForm({
    resolver: yupResolver(schemaCheckMail),
    // reValidateMode: 'onChange',
    mode: 'all',
  })
  const dispatch = useAppDispatch()

  const onSubmitSignUp = (valueSignUp: any) => {
    console.log('valueSignUp', valueSignUp)
    // setStateStatusSignature(!stateStatusSignature)
    if (stateCheckMail.valueEmail) {
      let newValues = {
        ...valueSignUp,
        email: stateCheckMail.valueEmail,
      }
      dispatch(registerActions.doRegister(newValues))
    }
  }

  const onSubmit = useCallback((values: any) => {
    signatureRef.current.handleSignature(values)
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
        dispatch(
          notificationActions.doNotification({
            message: data.message,
          })
        )
      })
      .catch((error) => {
        const data = error.response?.data
        setStateCheckMail({
          status: 'error',
          valueEmail: '',
        })
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: data?.message ? data?.message : 'Error',
            type: 'error',
          })
        )
      })
  }

  // const [showPassword, setShowPassword] = useState<boolean>(false)

  // const handleClickShowPassword = () => {
  //   setShowPassword(!showPassword)
  // }

  // const handleMouseDownPassword = (
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   event.preventDefault()
  // }

  //
  const handleChangeMonthlyPurchase = (value: number) => {
    setStateValueMonthlyPurchase(
      stateSelectMonthlyPurchase.find((obj) => obj.id === value)?.monthly
    )
  }

  const handleChangeMonthlySale = (value: number) => {
    setStateValueMonthlySale(
      stateSelectMonthlySale.find((obj) => obj.id === value)?.monthly_sale
    )
  }

  const handleChangeTypeOfSale = (value: number) => {
    setStateValueTypeOfSale(
      stateSelectTypeOfSale.find((obj) => obj.id === value)?.type_of_sale
    )
  }

  const handleChangeFindUsOver = (value: number) => {
    setStateValueFindUsOver(
      stateSelectFindUsOver.find((obj) => obj.id === value)?.find_us_over
    )
  }

  useEffect(() => {
    //
    getMonthlyPurchaseApi()
      .then((response) => {
        const { data } = response.data
        setStateSelectMonthlyPurchase(data)
        dispatch(
          notificationActions.doNotification({
            message: data.message,
          })
        )
      })
      .catch((error) => {
        const data = error.response?.data
        dispatch(
          notificationActions.doNotification({
            message: data?.message ? data?.message : 'Error',
            type: 'error',
          })
        )
      })
    //
    getMonthlySaleApi()
      .then((response) => {
        const { data } = response.data
        setStateSelectMonthlySale(data)
        dispatch(
          notificationActions.doNotification({
            message: data.message,
          })
        )
      })
      .catch((error) => {
        const data = error.response?.data
        dispatch(
          notificationActions.doNotification({
            message: data?.message ? data?.message : 'Error',
            type: 'error',
          })
        )
      })
    //
    getTypeOfSaleApi()
      .then((response) => {
        const { data } = response.data
        setStateSelectTypeOfSale(data)
        dispatch(
          notificationActions.doNotification({
            message: data.message,
          })
        )
      })
      .catch((error) => {
        const data = error.response?.data
        dispatch(
          notificationActions.doNotification({
            message: data?.message ? data?.message : 'Error',
            type: 'error',
          })
        )
      })
    //
    getFindUsOverApi()
      .then((response) => {
        const { data } = response.data
        setStateSelectFindUsOver(data)
        dispatch(
          notificationActions.doNotification({
            message: data.message,
          })
        )
      })
      .catch((error) => {
        const data = error.response?.data
        dispatch(
          notificationActions.doNotification({
            message: data?.message ? data?.message : 'Error',
            type: 'error',
          })
        )
      })
  }, [dispatch])

  return (
    <div className={classes['register-page']}>
      <Head>
        <title>Sign Up | Vape</title>
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
                      src="/images/logo.svg"
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
            <TypographyTitlePage variant="h1">Sign Up</TypographyTitlePage>
          </Stack>
          <form onSubmit={handleSubmitCheckMail(onSubmitCheckMail)}>
            <TypographyTitleSection variant="h3" mb={2}>
              Verify your email
            </TypographyTitleSection>
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
                    Email
                  </InputLabelCustom>
                  <TextFieldCheckMailCustom fullWidth>
                    <Grid container rowSpacing={3} columnSpacing={2}>
                      <Grid xs={6}>
                        <OutlinedInput
                          id="email"
                          fullWidth
                          placeholder="Enter email"
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
                                    <CheckCircleIcon color="error" />
                                  </IconButton>
                                </InputAdornment>
                              )}
                            </>
                          }
                        />
                      </Grid>
                      <Grid xs>
                        <ButtonCustom
                          variant="contained"
                          size="large"
                          type="submit"
                        >
                          Check
                        </ButtonCustom>
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
            <TypographyTitleSection variant="h3" mb={2}>
              Input Infomations
            </TypographyTitleSection>
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
                        First Name
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="first_name"
                          error={!!errors.first_name}
                          placeholder="Enter first name"
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
                        Last Name
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="last_name"
                          error={!!errors.last_name}
                          placeholder="Enter last name"
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
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="phone_number"
                        error={!!errors.phone_number}
                      >
                        Phone number
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="phone_number"
                          placeholder="Enter phone number"
                          error={!!errors.phone_number}
                          {...field}
                        />
                        <FormHelperText error={!!errors.phone_number}>
                          {errors.phone_number &&
                            `${errors.phone_number.message}`}
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
                  name="business_name"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="business_name"
                        error={!!errors.business_name}
                      >
                        Business Name
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="business_name"
                          placeholder="Enter business name"
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
                        Website link URL
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="website_link_url"
                          error={!!errors.website_link_url}
                          placeholder="Ex: example.com"
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
                        Average monthly purchase volume
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="monthly_purchase"
                          displayEmpty
                          disabled={
                            stateSelectMonthlyPurchase.length > 0 ? false : true
                          }
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>Select value</div>
                                </PlaceholderSelect>
                              )
                            }
                            return stateSelectMonthlyPurchase.find(
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
                          {stateSelectMonthlyPurchase.map((item, index) => {
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
                            placeholder="Input other average monthly purchase volume..."
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
                        Average monthly sale volume
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="monthly_sale"
                          displayEmpty
                          disabled={
                            stateSelectMonthlySale.length > 0 ? false : true
                          }
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>Select value</div>
                                </PlaceholderSelect>
                              )
                            }
                            return stateSelectMonthlySale.find(
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
                          {stateSelectMonthlySale.map((item, index) => {
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
                            placeholder="Input other average monthly sale volume..."
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
                        Type of sale
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="type_of_sale"
                          displayEmpty
                          disabled={
                            stateSelectTypeOfSale.length > 0 ? false : true
                          }
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>Select value</div>
                                </PlaceholderSelect>
                              )
                            }
                            return stateSelectTypeOfSale.find(
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
                          {stateSelectTypeOfSale.map((item, index) => {
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
                            placeholder="Input value..."
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
                        How many locations
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="total_locations"
                          error={!!errors.total_locations}
                          placeholder="Ex: 0>10.0000"
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
                        How did you find us?
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="find_us_over"
                          displayEmpty
                          disabled={
                            stateSelectFindUsOver.length > 0 ? false : true
                          }
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>Select value</div>
                                </PlaceholderSelect>
                              )
                            }
                            return stateSelectFindUsOver.find(
                              (obj) => obj.id === value
                            )?.find_us_over
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('find_us_over', event.target.value)
                            trigger('find_us_over')
                            handleChangeFindUsOver(event.target.value)
                          }}
                        >
                          {stateSelectFindUsOver.map((item, index) => {
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
                {stateValueFindUsOver === 'OTHER' && (
                  <Controller
                    control={control}
                    name="find_us_over_other"
                    render={({ field }) => (
                      <Box mt={1}>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="find_us_over_other"
                            error={!!errors.find_us_over_other}
                            placeholder="Input value..."
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
                        Do you have an ID Age Verification system?
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
                                  <div>Select value</div>
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
                            Yes
                          </MenuItemSelectCustom>
                          <MenuItemSelectCustom value="NO">
                            No
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
                        Do you currently have a payment processing system?
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
                                  <div>Select value</div>
                                </PlaceholderSelect>
                              )
                            }
                            return [
                              { value: 'YES', label: 'Yes' },
                              { value: 'NO', label: 'No' },
                              { value: 'in_process', label: 'In Process' },
                            ].find((obj) => obj.value === value)?.label
                          }}
                          {...field}
                        >
                          <MenuItemSelectCustom value="YES">
                            Yes
                          </MenuItemSelectCustom>
                          <MenuItemSelectCustom value="NO">
                            No
                          </MenuItemSelectCustom>
                          <MenuItemSelectCustom value="in_process">
                            In Process
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
                        Federal tax ID
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="federal_tax_id"
                          error={!!errors.federal_tax_id}
                          placeholder="Enter federal tax ID"
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
                        Business tax document
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <input id="business_tax_document" {...field} hidden />
                        <ComponentFileUploader
                          onFileSelectSuccess={(file) => {
                            setValue('business_tax_document', file)
                            trigger('business_tax_document')
                          }}
                          onFileSelectError={() => {}}
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
                        Vapor & Tobacco licenses (if required by your state)
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <input id="vapor_tobacco_license" {...field} hidden />
                        <ComponentFileUploader
                          onFileSelectSuccess={(file) => {
                            setValue('vapor_tobacco_license', file)
                            trigger('vapor_tobacco_license')
                          }}
                          onFileSelectError={() => {}}
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
                        Street address
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
                  name="address2"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="address2"
                        error={!!errors.address2}
                      >
                        Address line 2
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="address2"
                          error={!!errors.address2}
                          {...field}
                        />
                        {errors.address2 && (
                          <FormHelperText error={!!errors.address2}>
                            {errors.address2 && `${errors.address2.message}`}
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
                        City
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
                  defaultValue=""
                  name="state"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom htmlFor="state" error={!!errors.state}>
                        State
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="state"
                          error={!!errors.state}
                          {...field}
                        />
                        <FormHelperText error={!!errors.state}>
                          {errors.state && `${errors.state.message}`}
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
                        Postal / Zip Code
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
                        label="I have read and agree to Terms & Conditions"
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
                  uploadSignatureSuccess={(valueSignUp) => {
                    onSubmitSignUp(valueSignUp)
                  }}
                  uploadSignatureError={() => {}}
                  ref={signatureRef}
                />
              </Grid>
            </Grid>
            <Stack direction="row" spacing={2}></Stack>
            <Stack alignItems="center">
              <ButtonCustom
                variant="contained"
                size="large"
                type="submit"
                disabled={stateCheckMail.valueEmail === '' ? true : false}
              >
                Submit sign up request
              </ButtonCustom>
            </Stack>
          </form>
        </div>
      </div>
    </div>
  )
}

Register.getLayout = function getLayout(page: ReactElement) {
  return <WrapLayout>{page}</WrapLayout>
}
Register.theme = 'light'
export default Register
