import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  FormControl,
  FormHelperText,
  Stack,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import Payment from 'payment'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ButtonCustom, InputLabelCustom, TextFieldCustom } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import {
  getListCard,
  removeCard,
  setDefaultCard,
  getCustomerIdRevitPay,
  removeCardRevitpay,
} from './paymentApi'
import {
  AddCardType,
  CardDetailInListCardType,
  CardTypeOfRevitPay,
  ListCardResponseType,
  ValidateCardType,
} from './paymentModel'
import { schema } from './validation'
import { PlusCircle } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'

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

const PaymentMethodComponent: React.FC = () => {
  const { t } = useTranslation('business')
  const [idCustomer, setIdCustomer] = useState('')
  const { type } = useAppSelector((state) => state.paymentType)
  const [stateValidExpiry, setStateValidExpiry] = useState(true)
  const [stateAddNewMethod, setStateAddNewMethod] = useState(false)
  const [stateListCard, setStateListCard] = useState<ListCardResponseType>()
  const [isRefresh, setIsRefresh] = useState('')
  const [stateListCardRevitPay, setStateListCardRevitPay] = useState<
    CardTypeOfRevitPay[]
  >([])

  useEffect(() => {
    dispatch(loadingActions.doLoading())
    if (!type) return
    if (type === 'REVITPAY') {
      getCustomerIdRevitPay().then((res) => {
        const { data } = res.data

        fetch(
          `https://api.sandbox.revitgate.com/api/v2/customers/${data.customer_id}/payment-methods`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              Authorization:
                'basic ' +
                window.btoa('03jjMnOQiURCVMAIL4yNFTsDRkZiU2jp:223366'),
            },
          }
        )
          .then((response) => {
            if (response.ok) {
              return response.json()
            }
            throw new Error('Something went wrong')
          })
          .then((res) => {
            setStateListCardRevitPay(res)
            dispatch(loadingActions.doLoadingSuccess())
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')

            dispatch(loadingActions.doLoadingFailure())
          })
        setIdCustomer(data.customer_id)
      })
    } else {
      getListCard()
        .then((res) => {
          const { data } = res
          setStateListCard(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          dispatch(loadingActions.doLoadingFailure())
        })
    }
  }, [isRefresh, type])

  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()

  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
  })
  const {
    setValue,
    trigger,
    formState: { errors },
    control,
    reset,
    // getValues,
    handleSubmit,
  } = useForm<ValidateCardType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const formatCVC = (value: string) => {
    const clearValue = clearNumber(value)

    // if (getValues('number')) {
    //   const issuer = Payment.fns.cardType(getValues('number'))
    //   maxLength = issuer === 'amex' ? 4 : 3
    // }
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
  const onSubmitAddCard = (value: ValidateCardType) => {
    const expiryMonth = value.expiry.slice(0, 2)
    const expiryYear = value.expiry.slice(3)
    const submitValue: AddCardType = {
      number: value.number,
      expiryMonth: expiryMonth,
      expiryYear: expiryYear,
      cvc: value.cvc,
    }
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic a2FpQGV4bm9kZXMudm46RXhub2RlczEyMyFAIw==',
      },
      body: JSON.stringify(submitValue),
    }

    dispatch(loadingActions.doLoading())
    if (type === 'REVITPAY') {
      if (!idCustomer) return
      fetch(
        `https://api.sandbox.revitgate.com/api/v2/customers/${idCustomer}/payment-methods`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization:
              'basic ' + window.btoa('03jjMnOQiURCVMAIL4yNFTsDRkZiU2jp:223366'),
          },
          body: JSON.stringify({
            card: value.number!.replace(/\s/g, ''),
            expiry_month: Number(expiryMonth),
            expiry_year: Number('20' + expiryYear),
          }),
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Something went wrong')
        })
        .then(() => {
          pushMessage('Vault card successfully', 'success')
          dispatch(loadingActions.doLoadingSuccess())
          setIsRefresh('' + new Date().getTime())
          handleClosePaymentMethod()
        })
        .catch(() => {
          dispatch(loadingActions.doLoadingFailure())
          pushMessage('Vault card failed', 'error')
        })
    } else {
      fetch(
        'https://sandbox.api.mxmerchant.com/checkout/v3/customercardaccount?id=10000000988082&echo=true',
        options
      )
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Something went wrong')
        })
        .then(() => {
          pushMessage('Vault card successfully', 'success')
          dispatch(loadingActions.doLoadingSuccess())
          setIsRefresh('' + new Date().getTime())
          handleClosePaymentMethod()
        })
        .catch((response) => {
          // const { status, data } = response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage('Vault card failed', 'error')
          console.log(response)
        })
    }
  }

  // const handleCallListCard = () => {
  //   getListCard()
  //     .then((res) => {
  //       const { data } = res
  //       console.log('data', data)
  //       // setStateListCard(data)
  //       dispatch(loadingActions.doLoadingSuccess())
  //     })
  //     .catch(({ response }) => {
  //       const { status, data } = response

  //       pushMessage(handlerGetErrMessage(status, data), 'error')

  //       dispatch(loadingActions.doLoadingFailure())
  //     })
  // }
  //   useEffect(() => {
  //     handleCallListCard()
  //   }, [])
  //   console.log('stateListCard', stateListCard)
  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target
    if (name === 'cvc') {
      const formattedValue = formatCVC(value)
      setValue(name, formattedValue)
      trigger(name)
      setState((prev) => ({ ...prev, [name]: formattedValue }))
    }
    if (name === 'number') {
      const formattedValue = formatCreditCardNumber(value)
      setValue(name, formattedValue)
      trigger(name)
      setState((prev) => ({ ...prev, [name]: formattedValue }))
    }
    if (name === 'expiry') {
      const formattedValue = formatExpirationDate(value)
      setValue(name, formattedValue)
      trigger(name)
      setState((prev) => ({ ...prev, [name]: formattedValue }))
    }
  }
  const handleClosePaymentMethod = () => {
    setStateAddNewMethod(false)
    setState({ number: '', expiry: '', cvc: '' })
    reset()
  }
  const renderLogoCreditCard = (cardType: string) => {
    switch (cardType) {
      case 'MasterCard':
        return 'MasterCard.png'
      case 'American Express':
        return 'AmericanExpress.png'
      case 'Discover':
        return 'Discover.png'
      case 'Visa':
        return 'VISA.png'
      case 'JCB':
        return 'JCB.png'
      case `'Diner's Club Carte Blanche`:
        return "Diner's Club.png"
      default:
        return 'VISA.png'
    }
  }
  const handleSetDefaultCard = (item: CardDetailInListCardType) => {
    dispatch(loadingActions.doLoading())

    setDefaultCard(item.token, item.id)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        setIsRefresh('' + new Date().getTime())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')

        dispatch(loadingActions.doLoadingFailure())
      })
  }

  const handleRemoveCard = (item: any) => {
    if (!type) return
    dispatch(loadingActions.doLoading())
    if (type === 'REVITPAY') {
      removeCardRevitpay(item.id)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          setIsRefresh('' + new Date().getTime())
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')

          dispatch(loadingActions.doLoadingFailure())
        })
    } else {
      removeCard(item.id)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          setIsRefresh('' + new Date().getTime())
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')

          dispatch(loadingActions.doLoadingFailure())
        })
    }
  }
  return (
    <Box
      sx={{
        width: '100%',
        border: '1px solid #E1E6EF',
        padding: '25px',
        borderRadius: '10px',
      }}
    >
      <Box sx={{ marginBottom: '15px' }}>
        {type === 'REVITPAY' &&
          stateListCardRevitPay.map((item, index) => {
            return (
              <Stack
                key={index}
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  width: '100%',
                  marginBottom: '10px',
                  padding: '15px',
                  borderRadius: '10px',
                }}
              >
                <Stack direction="row" spacing={1}>
                  <Image
                    alt="image"
                    src={
                      '/' +
                      `/images/${renderLogoCreditCard(
                        item.card_type as string
                      )}`
                    }
                    width={50}
                    height={50}
                  />
                  <Stack spacing={1}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography
                        sx={{
                          color: '#595959',
                          fontSize: '1.6rem',
                          fontWeight: 600,
                        }}
                      >
                        {'**** '} {item.last4}
                      </Typography>
                    </Stack>
                    <Typography sx={{ color: '#595959' }}>
                      Expire {item.expiry_month}/{item.expiry_year}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <ButtonCustom
                    variant="outlined"
                    size="large"
                    onClick={() => handleRemoveCard(item)}
                  >
                    Remove
                  </ButtonCustom>
                </Stack>
              </Stack>
            )
          })}
        {stateListCard?.data.records.map((item, index) => {
          return (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                width: '100%',
                marginBottom: '10px',
                padding: '15px',
                border: item.isDefault ? '1px solid #1DB46A' : '',
                borderRadius: '10px',
              }}
            >
              <Stack direction="row" spacing={1}>
                <Image
                  alt="image"
                  src={'/' + `/images/${renderLogoCreditCard(item.cardType)}`}
                  width={50}
                  height={50}
                />
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography
                      sx={{
                        color: '#595959',
                        fontSize: '1.6rem',
                        fontWeight: 600,
                      }}
                    >
                      {'**** '} {item.last4}
                    </Typography>
                    {item.isDefault && (
                      <Box
                        sx={{
                          backgroundColor: '#1DB46A',
                          padding: '5px 10px',
                          color: '#fff',
                          borderRadius: '10px',
                          fontSize: '1.2rem',
                        }}
                      >
                        {t('default')}
                      </Box>
                    )}
                  </Stack>
                  <Typography sx={{ color: '#595959' }}>
                    {t('expire')} {item.expiryMonth}/{item.expiryYear}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={2}>
                {!item.isDefault && (
                  <ButtonCustom
                    variant="outlined"
                    size="large"
                    sx={{
                      border: '1px solid #6B7A99',
                      color: '#6B7A99',
                    }}
                    onClick={() => handleSetDefaultCard(item)}
                  >
                    {t('makeDefault')}
                  </ButtonCustom>
                )}
                {!item.isDefault && (
                  <ButtonCustom
                    variant="outlined"
                    size="large"
                    onClick={() => handleRemoveCard(item)}
                  >
                    {t('remove')}
                  </ButtonCustom>
                )}
              </Stack>
            </Stack>
          )
        })}
      </Box>
      {stateAddNewMethod ? (
        <Box
          sx={{ background: '#F8F9FC', padding: '15px', borderRadius: '10px' }}
        >
          <Typography
            sx={{ color: '#595959', fontWeight: 600, marginBottom: '15px' }}
          >
            {t('addAPaymentMethod')}
          </Typography>
          <form onSubmit={handleSubmit(onSubmitAddCard)}>
            <Stack spacing={2} sx={{ marginBottom: '15px' }}>
              <Box>
                <Controller
                  control={control}
                  name="number"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom error={!!errors.number}>
                        {t('cardNumber')}
                        <RequiredLabel />
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          {...field}
                          sx={{ background: '#FFFFFF' }}
                          value={state.number}
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
                        <InputLabelCustom
                          error={!!errors.expiry || !stateValidExpiry}
                        >
                          {t('expiry')}
                          <RequiredLabel />
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            {...field}
                            name="expiry"
                            sx={{ background: '#FFFFFF' }}
                            placeholder={t('validThru')}
                            onChange={handleInputChange}
                            error={!!errors.expiry || !stateValidExpiry}
                          />
                          {!errors.expiry && !stateValidExpiry && (
                            <FormHelperText error>
                              {t('monthExpiryIsInvalid')}
                            </FormHelperText>
                          )}
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
                        <InputLabelCustom error={!!errors.cvc}>
                          CVC
                          <RequiredLabel />
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            {...field}
                            name="cvc"
                            sx={{ background: '#FFFFFF' }}
                            placeholder="CVC"
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
            </Stack>
            <Stack direction="row" spacing={2}>
              <ButtonCustom
                sx={{ background: '#FFFFFF' }}
                onClick={() => handleClosePaymentMethod()}
                variant="outlined"
                size="large"
              >
                {t('cancel')}
              </ButtonCustom>
              <ButtonCustom type="submit" variant="contained" size="large">
                {t('submit')}
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      ) : (
        <ButtonCustom
          variant="outlined"
          size="large"
          sx={{ padding: '11px 30px !important' }}
          startIcon={<PlusCircle size={24} />}
          onClick={() => setStateAddNewMethod(true)}
        >
          {t('addAPaymentMethod')}
        </ButtonCustom>
      )}
    </Box>
  )
}

export default PaymentMethodComponent
