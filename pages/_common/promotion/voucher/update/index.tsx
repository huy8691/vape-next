import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import {
  getListProductOfVoucher,
  getVoucherDetail,
} from '../detail/apiVoucherDetail'
import classes from './styles.module.scss'
import { Moment } from 'moment'
import moment from 'moment'
import CurrencyNumberFormat from '../part/rules/currencyNumberFormat'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import SpecificProduct from '../part/rules/specificProduct'
import ListSpecificProduct from '../detail/part/listSpecificProduct'
import { ProductOfVoucherDetail } from '../detail/modelVoucherDetail'
import {
  getGeneralVoucherCode,
  updateVoucherProductSpecific,
} from './apiVoucherUpdate'
import { LightbulbFilament } from '@phosphor-icons/react'
import { useTranslation } from 'next-i18next'

const DividerCustom = styled('div')(() => ({
  backgroundColor: '#E1E6EF',
  height: '15px',
  width: '2px',
  margin: '0 10px',
}))

const UpdateVoucherComponent: React.FC = () => {
  const { t } = useTranslation('voucher')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateDiscountType, setStateDiscountType] = useState<
    string | undefined
  >('PERCENTAGE')
  const [stateProductCoverage, setStateProductCoverage] = useState<
    string | undefined
  >('ALL')

  const [stateDrawerSelectProduct, setStateDrawerSelectProduct] =
    useState(false)

  const [stateProductSelect, setStateProductSelect] = useState<
    ProductOfVoucherDetail[]
  >([])

  const {
    control,
    setValue,
    handleSubmit,
    trigger,
    getValues,
    clearErrors,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  useEffect(() => {
    if (router.query.id) {
      dispatch(loadingActions.doLoading())
      getVoucherDetail(router.query?.id as string)
        .then((res) => {
          const { data } = res.data
          setValue('title', data?.title || '')
          setValue(
            'code',
            data?.code?.split(
              data?.code?.slice(0, data?.code.indexOf('_') + 1)
            )[1] || ''
          )
          setValue('type', data?.type || '')
          setValue('availability', data?.availability || [''])
          setValue('start_date', data?.start_date || '')
          setValue('expiry_date', data?.expiry_date || '')
          setValue('minimum_spend', data?.minimum_spend || '')
          setValue('max_discount_amount', data?.max_discount_amount || '')
          setValue('limit_per_voucher', data?.limit_per_voucher || 0)
          setValue('limit_per_user', data?.limit_per_user || 0)
          setValue('discount_amount', data?.discount_amount || 0)
          setValue('product_coverage', data?.product_coverage || '')
          setStateProductCoverage(data?.product_coverage)
          setStateDiscountType(data?.type)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          dispatch(loadingActions.doLoadingFailure())
        })
    }
  }, [dispatch, router.query.id])

  useEffect(() => {
    if (Number(router.query.id) && stateProductCoverage === 'SPECIFIC') {
      handleGetProductOfVoucher()
    }
  }, [router.query.id, stateProductCoverage])

  const onSubmit = (values: any) => {
    const startDate = moment(values.start_date, 'YYYY-MM-DD').format(
      'YYYY-MM-DD'
    )
    const expiryDate = moment(values.expiry_date, 'YYYY-MM-DD').format(
      'YYYY-MM-DD'
    )
    dispatch(loadingActions.doLoading())

    updateVoucherProductSpecific(Number(router.query.id), {
      ...values,
      ...(getValues('minimum_spend') && {
        minimum_spend: getValues('minimum_spend'),
      }),
      ...(getValues('max_discount_amount') && {
        max_discount_amount: getValues('max_discount_amount'),
      }),
      minimum_spend: values.minimum_spend,

      start_date: `${startDate}T00:00:00Z`,
      expiry_date: `${expiryDate}T00:00:00Z`,
    })
      .then(() => {
        pushMessage(t('message.createVoucherSuccessfully'), 'success')
        router.push(`/${platform().toLowerCase()}/promotion/voucher/list`)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
      .finally(() => {
        dispatch(loadingActions.doLoadingSuccess())
      })
  }

  const generateRandomCode = () => {
    dispatch(loadingActions.doLoading())
    getGeneralVoucherCode()
      .then((res) => {
        const { data } = res.data
        setValue('code', data.code)
      })
      .finally(() => dispatch(loadingActions.doLoadingSuccess()))
  }

  const handleGetProductOfVoucher = () => {
    dispatch(loadingActions.doLoading())
    getListProductOfVoucher(Number(router.query.id), 1)
      .then((res) => {
        const { totalPages, data } = res.data

        const arrDataReturn: any[] = []
        const arrayTemp: any[] = []

        if (totalPages && totalPages > 1) {
          for (let page = 2; page <= totalPages; page++) {
            arrayTemp.push(
              getListProductOfVoucher(Number(router.query.id), page)
            )
          }
        }

        Promise.all(arrayTemp)
          .then((values) => {
            for (let i = 0; i < values.length; i++) {
              if (values[i].status === 200) {
                const dataPromise: any[] = values[i].data?.data
                  ? values[i].data?.data || []
                  : []

                arrDataReturn.push(...dataPromise)
              }
            }

            setStateProductSelect((prev: ProductOfVoucherDetail[]) => {
              const children = [...prev]

              for (const item of [...data, ...arrDataReturn]) {
                children.push(item)
              }

              setValue(
                'products',
                children.map((item) => item.id)
              )

              return children
            })

            dispatch(loadingActions.doLoadingSuccess())
          })
          .catch((error) => Promise.reject(error))
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          container
          rowSpacing={1}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          sx={{ maxWidth: '1000px' }}
          mb={'35px'}
        >
          {/* <Grid item xs={12}>
            <Typography
              sx={{
                color: '#0A0D14',
                fontSize: '16px',
                fontWeight: 500,
                marginBottom: '15px',
              }}
            >
              {t('defaultReturnLocation')}
            </Typography>
          </Grid> */}

          <Grid item xs={6}>
            <Controller
              control={control}
              name="title"
              defaultValue=""
              render={({ field }) => (
                <Box>
                  <InputLabelCustom htmlFor="title" error={!!errors.title}>
                    <RequiredLabel />
                    {t('title')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="title"
                      error={!!errors.title}
                      placeholder={t('enterVoucherName')}
                      {...field}
                    />
                    <FormHelperText error={!!errors.title}>
                      {errors.title && `${errors.title.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Controller
              control={control}
              name="code"
              defaultValue=""
              render={({ field }) => (
                <Box>
                  <InputLabelCustom htmlFor="code" error={!!errors.code}>
                    <RequiredLabel />
                    {t('voucherCode')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="code"
                      error={!!errors.code}
                      placeholder={t('voucherCode')}
                      {...field}
                    />
                    <FormHelperText error={!!errors.code}>
                      {errors.code && `${errors.code.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Stack justifyContent={'flex-end'} sx={{ height: '100%' }}>
              <ButtonCustom
                variant="outlined"
                size="large"
                style={{
                  padding: '8px 15px',
                }}
                onClick={() => generateRandomCode()}
              >
                <LightbulbFilament size={20} style={{ marginRight: '10px' }} />
                {t('autoGenerate')}
              </ButtonCustom>
            </Stack>
          </Grid>
          <Grid item xs={8}>
            <Controller
              control={control}
              name="discount_amount"
              render={({ field }) => {
                return (
                  <Box>
                    <InputLabelCustom
                      htmlFor="name"
                      error={!!errors.discount_amount}
                    >
                      <RequiredLabel />
                      {t('discountType')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        name="type"
                        value={stateDiscountType}
                        onChange={(event, value) => {
                          console.log(event)
                          resetField('discount_amount')
                          setStateDiscountType(value)
                          setValue('type', value)
                        }}
                      >
                        <FormControlLabel
                          value="PERCENTAGE"
                          control={<Radio />}
                          label={
                            <NumericFormat
                              value={
                                getValues('type') === 'PERCENTAGE'
                                  ? field.value
                                  : 0
                              }
                              style={{ marginBottom: '10px' }}
                              customInput={TextField}
                              allowNegative={false}
                              placeholder={``}
                              onValueChange={(value) => {
                                setValue(
                                  'discount_amount',
                                  Number(value.floatValue)
                                )
                                trigger('discount_amount')
                              }}
                              className={classes['input-number']}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="end">
                                    {t('percentage')}
                                    <DividerCustom />{' '}
                                    <span
                                      style={{
                                        fontSize: '1.6rem',
                                        fontWeight: 500,
                                        color: '#49516F',
                                      }}
                                    >
                                      %
                                    </span>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          }
                        />
                        <FormControlLabel
                          value="FIXEDAMOUNT"
                          control={<Radio />}
                          label={
                            <NumericFormat
                              value={
                                getValues('type') === 'FIXEDAMOUNT'
                                  ? field.value
                                  : 0
                              }
                              style={{ marginBottom: '10px' }}
                              customInput={TextField}
                              allowNegative={false}
                              placeholder={``}
                              className={classes['input-number']}
                              onValueChange={(value) => {
                                setValue(
                                  'discount_amount',
                                  Number(value.floatValue)
                                )
                                trigger('discount_amount')
                              }}
                              isAllowed={(values) => {
                                const { floatValue, formattedValue } = values
                                if (floatValue === 0) {
                                  return floatValue >= 0
                                }
                                if (!floatValue) {
                                  return formattedValue === ''
                                }
                                return floatValue <= 10000000 && floatValue >= 0
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="end">
                                    {t('fixedAmount')}
                                    <DividerCustom />{' '}
                                    <span
                                      style={{
                                        fontSize: '1.6rem',
                                        fontWeight: 500,
                                        color: '#49516F',
                                      }}
                                    >
                                      $
                                    </span>
                                  </InputAdornment>
                                ),
                              }}
                            />
                          }
                        />
                      </RadioGroup>
                      <FormHelperText error={!!errors.discount_amount}>
                        {errors.discount_amount &&
                          `${errors.discount_amount.message}`}
                      </FormHelperText>
                    </FormControl>
                  </Box>
                )
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="availability"
              render={({ field }) => {
                return (
                  <Box>
                    <InputLabelCustom
                      htmlFor="name"
                      error={!!errors.availability}
                    >
                      <RequiredLabel />
                      {t('availability')}
                    </InputLabelCustom>
                    <FormControl
                      sx={{ flexDirection: 'row', gap: '20px' }}
                      fullWidth
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              field.value?.includes('MARKETPLACE') || false
                            }
                            onChange={(event) => {
                              if (event.target.checked) {
                                field.onChange([
                                  ...field.value.filter(
                                    (item: string) => item !== ''
                                  ),
                                  'MARKETPLACE',
                                ])
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (item: string) => item !== 'MARKETPLACE'
                                  )
                                )
                              }
                            }}
                          />
                        }
                        label={t('marketplace')}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={field.value?.includes('AT_STORE') || false}
                            onChange={(event) => {
                              if (event.target.checked) {
                                field.onChange(
                                  field.value.filter(
                                    (item: string) => item !== 'AT_STORE'
                                  )
                                )
                              } else {
                                field.onChange(
                                  field.value.filter(
                                    (item: string) => item !== 'AT_STORE'
                                  )
                                )
                              }
                            }}
                          />
                        }
                        label={t('atStore')}
                      />
                    </FormControl>
                    <FormHelperText error={!!errors.availability}>
                      {errors.availability && `${errors.availability.message}`}
                    </FormHelperText>
                  </Box>
                )
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{
                color: '#0A0D14',
                fontSize: '16px',
                fontWeight: 500,
                marginBottom: '15px',
              }}
            >
              {t('usageLimit')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="start_date"
              render={({ field }) => (
                <Box>
                  <InputLabelCustom htmlFor="name" error={!!errors.start_date}>
                    <RequiredLabel />
                    {t('startDate')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        value={field.value}
                        onChange={(newValue: Moment | null) => {
                          setValue('start_date', moment.utc(newValue).format())
                        }}
                        renderInput={(params: any) => {
                          return (
                            <TextFieldCustom
                              {...params}
                              error={!!errors.start_date}
                              fullWidth
                            />
                          )
                        }}
                      />
                    </LocalizationProvider>
                    <FormHelperText error={!!errors.start_date}>
                      {errors.start_date && `${errors.start_date.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="expiry_date"
              defaultValue=""
              render={({ field }) => (
                <Box>
                  <InputLabelCustom htmlFor="name" error={!!errors.expiry_date}>
                    <RequiredLabel />
                    {t('expiryDate')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        value={field.value}
                        onChange={(newValue: Moment | null) => {
                          setValue('expiry_date', moment.utc(newValue).format())
                        }}
                        renderInput={(params: any) => {
                          return (
                            <TextFieldCustom
                              {...params}
                              error={!!errors.expiry_date}
                              fullWidth
                            />
                          )
                        }}
                      />
                    </LocalizationProvider>
                    <FormHelperText error={!!errors.expiry_date}>
                      {errors.expiry_date && `${errors.expiry_date.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="limit_per_voucher"
              render={({ field }) => (
                <Box>
                  <InputLabelCustom
                    htmlFor="name"
                    error={!!errors.limit_per_voucher}
                  >
                    <RequiredLabel />
                    {t('usageLimitPerVoucher')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <NumericFormat
                      error={!!errors.limit_per_voucher}
                      customInput={TextField}
                      allowNegative={false}
                      className={classes['input-number']}
                      value={field.value}
                      thousandSeparator
                      onValueChange={({ floatValue }) => {
                        setValue('limit_per_voucher', floatValue as number)
                        trigger('limit_per_voucher')
                      }}
                      isAllowed={(values) => {
                        const { floatValue, formattedValue } = values
                        if (floatValue === 0) {
                          return floatValue > 0
                        }
                        if (!floatValue) {
                          return formattedValue === ''
                        }
                        return floatValue <= 10000000 && floatValue >= 0
                      }}
                    />
                    <FormHelperText error={!!errors.limit_per_voucher}>
                      {errors.limit_per_voucher &&
                        `${errors.limit_per_voucher.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="limit_per_user"
              render={({ field }) => (
                <Box>
                  <InputLabelCustom
                    htmlFor="name"
                    error={!!errors.limit_per_user}
                  >
                    {/* <RequiredLabel /> */}
                    {t('usageLimitPerUser')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <NumericFormat
                      error={!!errors.limit_per_user}
                      customInput={TextField}
                      allowNegative={false}
                      thousandSeparator
                      className={classes['input-number']}
                      value={field.value}
                      onValueChange={({ floatValue }) => {
                        setValue('limit_per_user', floatValue as number)
                        trigger('limit_per_user')
                      }}
                      isAllowed={(values) => {
                        const { floatValue, formattedValue } = values
                        if (floatValue === 0) {
                          return floatValue >= 0
                        }
                        if (!floatValue) {
                          return formattedValue === ''
                        }
                        return floatValue <= 10000000 && floatValue >= 0
                      }}
                    />
                    <FormHelperText error={!!errors.limit_per_user}>
                      {errors.limit_per_user &&
                        `${errors.limit_per_user.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{
                color: '#0A0D14',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              {t('usageRestriction')}
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="minimum_spend"
              render={({ field }) => (
                <Box>
                  <InputLabelCustom
                    htmlFor="name"
                    error={!!errors.minimum_spend}
                  >
                    {t('minimumSpend')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <div className={classes['input-number']}>
                      <CurrencyNumberFormat
                        defaultPrice={field.value}
                        propValue={(value) => {
                          setValue(`minimum_spend`, value as number)
                          trigger(`minimum_spend`)
                        }}
                        error={!!errors.minimum_spend}
                      />
                    </div>

                    <FormHelperText error={!!errors.minimum_spend}>
                      {errors.minimum_spend &&
                        `${errors.minimum_spend.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="max_discount_amount"
              render={({ field }) => (
                <Box>
                  <InputLabelCustom
                    htmlFor="name"
                    error={!!errors.max_discount_amount}
                  >
                    {t('maximumDiscountAmount')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <div className={classes['input-number']}>
                      <CurrencyNumberFormat
                        defaultPrice={field.value}
                        propValue={(value) => {
                          setValue(`max_discount_amount`, value as number)
                          trigger(`max_discount_amount`)
                        }}
                        disable={getValues('type') !== 'PERCENTAGE'}
                        error={!!errors.max_discount_amount}
                      />
                    </div>

                    <FormHelperText error={!!errors.max_discount_amount}>
                      {errors.max_discount_amount &&
                        `${errors.max_discount_amount.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{
                color: '#0A0D14',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              {t('productsCoverage')}
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Controller
              control={control}
              name="product_coverage"
              render={({ field }) => (
                <Box>
                  <FormControl fullWidth>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      value={stateProductCoverage}
                      name="product_coverage"
                      onChange={(event, value) => {
                        console.log(event)
                        setValue('product_coverage', value)
                        clearErrors()
                        setStateProductCoverage(value)
                      }}
                    >
                      <FormControlLabel
                        value="SPECIFIC"
                        control={<Radio />}
                        label={
                          <>
                            <Stack
                              direction={'row'}
                              alignItems={'center'}
                              gap="10px"
                            >
                              <Typography>{t('selectProduct')}</Typography>
                              {field.value === 'SPECIFIC' && (
                                <ButtonCustom
                                  variant="outlined"
                                  size="large"
                                  onClick={() =>
                                    setStateDrawerSelectProduct(true)
                                  }
                                >
                                  {t('selectProduct')}
                                </ButtonCustom>
                              )}
                            </Stack>
                          </>
                        }
                      />
                      {stateProductCoverage === 'SPECIFIC' && (
                        <ListSpecificProduct
                          stateProductSelect={stateProductSelect}
                        />
                      )}

                      <FormControlLabel
                        value="ALL"
                        control={<Radio />}
                        label={t('allProducts')}
                      />
                    </RadioGroup>
                    <FormHelperText error={!!errors.product_coverage}>
                      {errors.product_coverage &&
                        `${errors.product_coverage.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2}>
          <Link href={`/${platform().toLowerCase()}/promotion/voucher/list`}>
            <a>
              <ButtonCancel variant="outlined" size="large">
                {t('cancel')}
              </ButtonCancel>
            </a>
          </Link>
          <ButtonCustom variant="contained" type="submit" size="large">
            {t('submit')}
          </ButtonCustom>
        </Stack>
      </form>
      <SpecificProduct
        setStateProductSelect={setStateProductSelect}
        stateProductSelect={stateProductSelect}
        onClose={setStateDrawerSelectProduct}
        open={stateDrawerSelectProduct}
        setValue={setValue}
        getValues={getValues}
      />
    </>
  )
}

export default UpdateVoucherComponent
