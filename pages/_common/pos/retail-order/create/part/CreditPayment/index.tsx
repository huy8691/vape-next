import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import * as Yup from 'yup'
import { ArrowLeft, CheckCircle, CreditCard } from '@phosphor-icons/react'
import React, { useState, useEffect } from 'react'
import { formatMoney } from 'src/utils/money.utils'
import Payment from 'payment'
import { CreditType } from './creditPaymentModel'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ButtonCustom, InputLabelCustom, TextFieldCustom } from 'src/components'
import RequiredLabel from 'src/components/requiredLabel'
import CurrencyNumberFormat from 'src/components/CurrencyNumberFormat'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useTranslation } from 'react-i18next'

interface Props {
  handleBackToPrevious: () => void
  total: number
  handleSubmit: (value: CreditType) => void
  disableButton: boolean
}
function clearNumber(value = '') {
  return value.replace(/\D+/g, '')
}
const formatCreditCardNumber = (value: string) => {
  if (!value) {
    return value
  }
  const issuer = Payment.fns.cardType(value)
  const clearValue = clearNumber(value)
  let nextValue
  console.log('issuer', issuer)
  switch (issuer) {
    case 'amex':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 15)}`
      break
    case 'dinersclub':
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        10
      )} ${clearValue.slice(10, 14)}`
      break
    default:
      nextValue = `${clearValue.slice(0, 4)} ${clearValue.slice(
        4,
        8
      )} ${clearValue.slice(8, 12)} ${clearValue.slice(12, 19)}`
      break
  }
  console.log('next value trim', nextValue.trim())
  return nextValue.trim()
}
const CreditPaymentForm = (props: Props) => {
  const { t } = useTranslation('retail-order-list')

  const [pushMessage] = useEnqueueSnackbar()

  const [stateRadioCreditPayment, setStateRadioCreditPayment] = useState(2)
  const [stateDisplayCash, setStateDisplayCash] = useState(false)
  const [stateValidExpiry, setStateValidExpiry] = useState(true)
  const [stateCard, setStateCard] = useState({
    number: '',
    expiry: '',
    cvc: '',
  })

  const {
    setValue,
    trigger,
    register,
    unregister,
    getValues,
    formState: { errors },
    control,
    watch,
    reset,
    handleSubmit,
  } = useForm<CreditType>({
    resolver: yupResolver(
      Yup.object().shape({
        credit: Yup.number()
          .typeError(t('create.validation.credit.typeError'))
          .required(t('create.validation.credit.required'))
          .min(1 / 100, t('create.validation.credit.min'))
          .max(
            props.total,
            `${t('create.validation.credit.max')}${Number(
              props.total.toFixed(2)
            )}$`
          ),
        ...(stateRadioCreditPayment === 2 && {
          number: Yup.string()
            .required(t('create.validation.cardNumber.required'))
            .min(17, t('create.validation.cardNumber.min'))
            .max(19, t('create.validation.cardNumber.min')),
          cvc: Yup.string()
            .required(t('create.validation.cvc.required'))
            .length(3, t('create.validation.cvc.length')),
          expiry: Yup.string()
            .required(t('create.validation.expiry.required'))
            .length(5, t('create.validation.expiry.length')),
        }),
        cash: Yup.number().when('credit', (credit, schema) => {
          if (credit < props.total) {
            return Yup.number()
              .required(t('create.validation.cash.required'))
              .positive(t('create.validation.cash.positive'))
              .typeError(t('create.validation.cash.typeError'))
              .min(1 / 100, t('create.validation.cash.min'))
              .max(1000000, t('create.validation.cash.min'))
          }
          console.log('va123', credit)
          return schema
        }),
      })
    ),
    mode: 'all',
  })

  const formatCVC = (value: string) => {
    const clearValue = clearNumber(value)
    return clearValue.slice(0, 3)
  }

  const formatExpirationDate = (value: string) => {
    const clearValue = clearNumber(value)
    if (clearValue.length >= 3) {
      setStateValidExpiry(
        handleCheckValidExpiryMonth(Number(clearValue.slice(0, 2)))
      )
      return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`
    }

    return clearValue
  }
  const handleCheckValidExpiryMonth = (value: number) => {
    return value <= 12 && value >= 1
  }
  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target
    if (name === 'cvc') {
      const formattedValue = formatCVC(value)
      setValue(name, formattedValue)
      trigger(name)
      setStateCard((prev) => ({ ...prev, [name]: formattedValue }))
    }
    if (name === 'number') {
      const formattedValue = formatCreditCardNumber(value)
      setValue(name, formattedValue)
      trigger(name)
      setStateCard((prev) => ({ ...prev, [name]: formattedValue }))
    }
    if (name === 'expiry') {
      const formattedValue = formatExpirationDate(value)
      setValue(name, formattedValue)
      trigger(name)
      setStateCard((prev) => ({ ...prev, [name]: formattedValue }))
    }
  }

  const onSubmitCreditPayment = (value: CreditType) => {
    console.log('state', stateValidExpiry)
    console.log('state', stateCard)
    if (Number(stateCard.expiry.slice(0, 2)) > 12) {
      pushMessage('Invalid expiry', 'error')
      return
    }
    if (Number(stateCard.expiry.slice(3, 5)) < 23) {
      pushMessage('Invalid expiry', 'error')

      return
    }
    if (value.cash) {
      const submitValue: CreditType = {
        ...value,
        cash: Number(value.cash?.toFixed(2)),
        credit: Number(value.credit?.toFixed(2)),
      }
      props.handleSubmit(submitValue)
      return
    }
    const submitValue: CreditType = {
      ...value,
      credit: Number(value.credit?.toFixed(2)),
    }
    props.handleSubmit(submitValue)
  }

  // useEffect(() => {
  //   if (stateRadioCreditPayment === 2) {
  //     register('number')
  //     register('cvc')
  //     register('expiry')
  //   } else {
  //     reset({
  //       ...getValues(),
  //       number: undefined,
  //       cvc: undefined,
  //       expiry: undefined,
  //     })
  //     unregister(['number', 'cvc', 'expiry'])
  //   }
  // }, [stateRadioCreditPayment])

  // useEffect(() => {
  //   if (props.total - (watch('credit') ? watch('credit') : 0) > 0) {
  //     register('cash')
  //   } else {
  //     reset({
  //       ...getValues(),
  //       cash: undefined,
  //     })
  //     unregister(['cash'])
  //   }
  // }, [watch('credit')])

  useEffect(() => {
    setValue('credit', props.total)
  }, [])

  return (
    <Box sx={{ padding: '25px', minWidth: '450px' }}>
      <form onSubmit={handleSubmit(onSubmitCreditPayment)}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => props.handleBackToPrevious()}>
            <ArrowLeft size={32} />
          </IconButton>
          <Typography
            sx={{
              fontSize: '2.4rem',
              color: '#49516',
              fontWeight: '700',
              marginBottom: '20px',
            }}
          >
            {t('create.cashPayment.titleCreditPayment')}
          </Typography>
        </Stack>
        <Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              padding: '15px',
              background: '#F8FAFB',
              marginBottom: '15px',
              borderRadius: '5px',
              color: '#595959',
            }}
          >
            <Typography sx={{ fontSize: '2rem' }}>
              {t('create.TOTAL')}
            </Typography>
            <Typography sx={{ fontSize: '2rem' }}>
              {formatMoney(props.total)}
            </Typography>
          </Stack>
          <Typography sx={{ fontSize: '1.6rem', marginBottom: '10px' }}>
            {t('create.creditCard')}
          </Typography>
          <Box sx={{ marginBottom: '15px' }}>
            <Controller
              control={control}
              name="credit"
              render={() => (
                <>
                  <div className="input-number">
                    <CurrencyNumberFormat
                      defaultPrice={Number(props.total).toFixed(2)}
                      propValue={(value) => {
                        console.log('value', value)
                        setValue('credit', Number(value))
                        trigger('credit')
                        if (Number(value) < Number(props.total.toFixed(2))) {
                          register('cash')
                          setStateDisplayCash(true)
                        } else {
                          reset({
                            ...getValues(),
                            cash: undefined,
                          })
                          unregister(['cash'])
                          setStateDisplayCash(false)
                        }
                      }}
                    />
                  </div>
                  <FormHelperText error>
                    {errors.credit && `${errors.credit.message}`}
                  </FormHelperText>
                </>
              )}
            />
          </Box>
        </Stack>
        <Stack direction="row" sx={{ marginBottom: '15px' }} spacing={1}>
          <ButtonCustom
            size="large"
            variant="outlined"
            fullWidth
            disabled
            onClick={() => {
              setStateRadioCreditPayment(1)
              reset({
                ...getValues(),
                number: undefined,
                cvc: undefined,
                expiry: undefined,
              })
              unregister(['number', 'cvc', 'expiry'])
            }}
            sx={{
              position: 'relative',
              border: `1px solid ${
                stateRadioCreditPayment === 1 ? '#34DC75' : '#C3CAD9'
              }`,
              color: stateRadioCreditPayment === 1 ? '#34DC75' : '#C3CAD9',
            }}
          >
            <Stack direction="column" spacing={0.5} alignItems="center">
              <CreditCard size={24} />
              <Typography>{t('create.creditCard')}</Typography>
              {stateRadioCreditPayment === 1 && (
                <CheckCircle
                  style={{ position: 'absolute', top: 5, right: 5 }}
                  size={16}
                />
              )}
            </Stack>
          </ButtonCustom>
          <ButtonCustom
            size="large"
            variant="outlined"
            fullWidth
            onClick={() => {
              setStateRadioCreditPayment(2)
              register('number')
              register('cvc')
              register('expiry')
            }}
            sx={{
              position: 'relative',
              border: `1px solid ${
                stateRadioCreditPayment === 2 ? '#34DC75' : '#C3CAD9'
              }`,
              color: stateRadioCreditPayment === 2 ? '#34DC75' : '#C3CAD9',
            }}
          >
            <Stack direction="column" spacing={0.5} alignItems="center">
              <CreditCard size={24} />
              <Typography>
                {t('create.cashPayment.enterCreditManually')}
              </Typography>

              {stateRadioCreditPayment === 2 && (
                <CheckCircle
                  style={{ position: 'absolute', top: 5, right: 5 }}
                  size={16}
                />
              )}
            </Stack>
          </ButtonCustom>
        </Stack>
        {stateRadioCreditPayment === 2 && (
          <Box sx={{ marginBottom: '15px' }}>
            <Box sx={{ marginBottom: '15px' }}>
              <Controller
                control={control}
                name="number"
                render={({ field }) => (
                  <>
                    <InputLabelCustom error={!!errors.number}>
                      {t('create.cardNumber')}
                      <RequiredLabel />
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        {...field}
                        sx={{ background: '#FFFFFF' }}
                        name="number"
                        placeholder="Card number"
                        onChange={handleInputChange}
                        error={!!errors.number}
                      />

                      <FormHelperText error={!!errors.number}>
                        {errors.number && `${errors.number.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <Stack direction="row" spacing={2}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={control}
                  name="expiry"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom error={!!errors.expiry}>
                        Expiry
                        <RequiredLabel />
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          {...field}
                          name="expiry"
                          sx={{ background: '#FFFFFF' }}
                          placeholder={t('create.validThru')}
                          onChange={handleInputChange}
                          error={!!errors.expiry}
                        />
                        <FormHelperText error={!!errors.expiry}>
                          {errors.expiry && `${errors.expiry.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={control}
                  name="cvc"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        error={!!errors.cvc}
                        sx={{ textTransform: 'uppercase' }}
                      >
                        {t('create.cvv')}
                        <RequiredLabel />
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          {...field}
                          name="cvc"
                          sx={{ background: '#FFFFFF' }}
                          placeholder={t('create.cvv')}
                          onChange={handleInputChange}
                          error={!!errors.cvc}
                        />
                        <FormHelperText error={!!errors.cvc}>
                          {errors.cvc && `${errors.cvc.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
            </Stack>
          </Box>
        )}

        {stateDisplayCash && (
          <>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                padding: '15px',
                background: '#F8FAFB',
                marginBottom: '15px',
                color: '#595959',
                borderRadius: '5px',
              }}
            >
              <Typography sx={{ fontSize: '1.6rem' }}>
                {t('create.remaining')}
              </Typography>
              <Typography sx={{ fontSize: '1.6rem' }}>
                {formatMoney(
                  props.total -
                    (getValues('credit') ? getValues('credit') : 0) >=
                    0
                    ? props.total -
                        (getValues('credit') ? getValues('credit') : 0)
                    : 0
                )}
              </Typography>
            </Stack>
            <Box sx={{ marginBottom: '15px' }}>
              <Controller
                control={control}
                name="cash"
                render={() => (
                  <>
                    <InputLabelCustom htmlFor="cash" error={!!errors.cash}>
                      <RequiredLabel /> {t('create.cash')}
                    </InputLabelCustom>
                    <div className="input-number">
                      <CurrencyNumberFormat
                        defaultPrice={Number(
                          props.total -
                            (watch('credit') ? watch('credit') : 0) >=
                            0
                            ? props.total -
                                (watch('credit') ? watch('credit') : 0)
                            : 0
                        ).toFixed(2)}
                        propValue={(value) => {
                          console.log('value', value)
                          setValue('cash', Number(value))
                          trigger('cash')
                        }}
                      />
                    </div>
                    <FormHelperText error>
                      {errors.cash && `${errors.cash.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                padding: '15px',
                background: '#F8FAFB',
                marginBottom: '15px',
                color: '#595959',
                borderRadius: '5px',
              }}
            >
              <Typography sx={{ fontSize: '1.6rem' }}>
                {t('create.cashPayment.changes')}
              </Typography>
              <Typography sx={{ fontSize: '1.6rem' }}>
                {formatMoney(
                  Number(watch('cash')) -
                    (Number(props.total) - watch('credit')) >
                    0
                    ? Number(watch('cash')) -
                        (Number(props.total) - watch('credit'))
                    : 0
                )}
              </Typography>
            </Stack>
          </>
        )}
        <ButtonCustom
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={props.disableButton}
        >
          {t('create.cashPayment.proceedPayment')}
        </ButtonCustom>
      </form>
    </Box>
  )
}

export default CreditPaymentForm
