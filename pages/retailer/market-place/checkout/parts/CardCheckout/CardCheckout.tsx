import { yupResolver } from '@hookform/resolvers/yup'
import Payment from 'payment'
import React, { useEffect, useState } from 'react'
import Cards from 'react-credit-cards-2'

import { Controller, useForm } from 'react-hook-form'

import {
  Box,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  RadioGroup,
  Stack,
  styled,
} from '@mui/material'
import { ArrowRight } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'
import {
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
  TypographyH2,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { getCustomerId, getListCard } from './cardCheckoutAPI'
import {
  AddCardType,
  CardDetailInListCardType,
  ListCardResponseType,
  VaultCardType,
} from './cardCheckoutModel'
import { schemaValidation } from './validations'
function clearNumber(value = '') {
  return value.replace(/\D+/g, '')
}
const handleUppercase = (value: string) => {
  return value.toUpperCase()
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

const BoxModalCustom = styled(Box)(() => ({
  width: '600px',
  background: 'white',
  borderStyle: 'none',
  padding: '50px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '10px',
}))
interface Props {
  customerId: string
  orderId: number[]
}
const CardCheckout: React.FC<Props> = () => {
  const { t } = useTranslation('checkout')

  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  })
  const [stateValidExpiry, setStateValidExpiry] = useState(true)
  const [stateDrawer, setStateDrawer] = useState(false)
  const [stateListCard, setStateListCard] = useState<ListCardResponseType>()
  const [stateCurrentCard, setStateCurrentCard] = useState(0)
  const dispatch = useAppDispatch()
  const [stateCustomerId, setStateCustomerId] = useState(0)
  const [pushMessage] = useEnqueueSnackbar()
  const handleCallListCard = () => {
    // const options = {
    //   method: 'GET',
    //   headers: {
    //     accept: 'application/json',
    //     authorization: 'Basic a2FpQGV4bm9kZXMudm46RXhub2RlczEyMyFAIw==',
    //   },
    // }
    // fetch(
    //   `https://sandbox.api.mxmerchant.com/checkout/v3/customercardaccount?id=${prop.customerId}`,
    //   options
    // )
    //   .then((response) => response.json())
    //   .then((response) => {
    //     // response.json()
    //     console.log('response1', response)
    //     setStateListCard(response)
    //   })
    //   .catch((err) => console.error(err))

    getListCard()
      .then((res) => {
        const { data } = res
        console.log('data', data)
        setStateListCard(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response

        pushMessage(handlerGetErrMessage(status, data), 'error')

        dispatch(loadingActions.doLoadingFailure())
      })
  }

  useEffect(() => {
    getCustomerId()
      .then((res) => {
        const { data } = res.data
        setStateCustomerId(data.customer_id)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    handleCallListCard()
  }, [])
  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target
    if (name === 'name') {
      const formattedValue = handleUppercase(value)
      setState((prev) => ({ ...prev, [name]: formattedValue }))
      setValue(name, formattedValue)
      return
    }
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

  const handleInputFocus = (
    evt: React.FocusEvent<HTMLInputElement, Element>
  ) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }))
  }
  const {
    trigger,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<AddCardType>({
    resolver: yupResolver(schemaValidation),
    mode: 'all',
    reValidateMode: 'onSubmit',
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
  const handleCheckIssuer = (value: string) => {
    let issuer = ''
    if (value === `Diner's Club International`) {
      console.log('issue diner club')
      issuer = 'dinersclub'
    }
    if (value === `American Express`) {
      issuer = 'amex'
    } else {
      issuer = value
    }
    return issuer
  }
  const handleGenerateScrambleCardNumber = (value: string, type: string) => {
    let scrambleCardNumber = ''
    if (type === `Diner's Club International`) {
      scrambleCardNumber = `**** ******* *7048`
    } else if (type === `American Express`) {
      scrambleCardNumber = `**** ****** *${value}`
    } else {
      scrambleCardNumber = `**** **** **** ${value}`
    }
    return scrambleCardNumber
  }

  const onSubmitAddCard = (data: AddCardType) => {
    console.log('data', data)
    if (!stateCustomerId) return
    const expiryMonth = data.expiry.slice(0, 2)
    const expiryYear = data.expiry.slice(3)
    const submitValue: VaultCardType = {
      number: data.number,
      expiryMonth: expiryMonth,
      expiryYear: expiryYear,
      code: 'card',
      name: data.name,
      isDefault: true,
      cvc: data.cvc,
    }
    // call api vault card
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: 'Basic a2FpQGV4bm9kZXMudm46RXhub2RlczEyMyFAIw==',
      },
      body: JSON.stringify(submitValue),
    }
    fetch(
      `https://sandbox.api.mxmerchant.com/checkout/v3/customercardaccount?id=${stateCustomerId}&echo=true`,
      options
    )
      .then((response) => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Something went wrong')
      })
      .then((response) => {
        pushMessage('Vault card successfully', 'success')
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(loadingActions.doLoading())
        const responseSubmitCard: CardDetailInListCardType = response
        console.log(responseSubmitCard)
        // makeAPaymentWithOrder({
        //   order_ids: prop.orderId,
        //   payment_token: responseSubmitCard.token,
        // })
        //   .then(() => {
        //     pushMessage('Make a payment successfully', 'success')
        //     dispatch(loadingActions.doLoadingSuccess())
        //     setStateDrawer(false)

        //     router.replace(
        //       `/retailer/market-place/online-orders/detail/${prop.orderId}`
        //     )
        //   })
        //   .catch(({ response }) => {
        //     const { status, data } = response
        //     pushMessage(handlerGetErrMessage(status, data), 'error')
        //     dispatch(loadingActions.doLoadingFailure())
        //   })

        // handleCallListCard()
      })
      .catch((response) => {
        // const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage('Vault card failed', 'error')
        console.log(response)
      })
  }
  const handleCloseDrawer = () => {
    setStateDrawer(false)
    setState({
      number: '',
      expiry: '',
      cvc: '',
      name: '',
      focus: '',
    })
  }
  // const handleOnchangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setStateCurrentCard(Number(event.target.value))
  // }
  const handleOnClickRadio = (index: number) => {
    setStateCurrentCard(Number(index))
  }
  const handleSubmitAddCard = () => {
    if (!stateListCard?.data.records) return
    // makeAPaymentWithOrder({
    //   order_ids: prop.orderId,
    //   payment_token:
    //     stateListCard?.data?.records[stateCurrentCard]?.token.toString(),
    // })
    //   .then(() => {
    //     pushMessage('Make a payment successfully', 'success')
    //     dispatch(loadingActions.doLoadingSuccess())
    //     setStateDrawer(false)

    //     router.replace(
    //       `/retailer/market-place/online-orders/detail/${prop.orderId}`
    //     )
    //   })
    //   .catch(({ response }) => {
    //     const { status, data } = response
    //     pushMessage(handlerGetErrMessage(status, data), 'error')
    //     dispatch(loadingActions.doLoadingFailure())
    //   })
  }
  return (
    <Box>
      <TypographyH2 sx={{ marginBottom: '15px' }}>
        {t('selectCard')}
      </TypographyH2>

      <ButtonCustom
        variant="contained"
        size="large"
        onClick={() => setStateDrawer(true)}
      >
        {t('addCardAndCheckout')}
      </ButtonCustom>

      <RadioGroup
        sx={{ marginBottom: '15px', marginTop: '15px' }}
        value={stateCurrentCard}
        // onChange={handleOnchangeRadio}
      >
        <Stack direction="row" flexWrap="wrap">
          {stateListCard?.data.records &&
            stateListCard?.data.records.length > 0 &&
            stateListCard?.data.records.map((item, index) => {
              return (
                <FormControlLabel
                  key={index}
                  value={item.token}
                  control={
                    <Box
                      key={index}
                      sx={{
                        marginBottom: '15px !important',
                        padding: '20px',
                        border:
                          stateCurrentCard === index ? '1px solid #1DB46A' : '',
                        borderRadius: '15px',
                      }}
                    >
                      <Cards
                        name={item.name}
                        number={handleGenerateScrambleCardNumber(
                          item.last4,
                          item.cardType
                        )}
                        expiry={''}
                        cvc={''}
                        issuer={handleCheckIssuer(item.cardType)}
                        preview={true}
                      />
                    </Box>
                  }
                  onClick={() => handleOnClickRadio(index)}
                  label={<></>}
                ></FormControlLabel>
              )
            })}
        </Stack>
      </RadioGroup>
      <ButtonCustom
        onClick={() => handleSubmitAddCard()}
        variant="contained"
        size="large"
      >
        {t('checkout')}
      </ButtonCustom>
      <Drawer anchor="right" open={stateDrawer} onClose={handleCloseDrawer}>
        <BoxModalCustom>
          <Stack
            direction="row"
            spacing={1}
            sx={{ marginBottom: '15px' }}
            alignItems="center"
          >
            <IconButton onClick={handleCloseDrawer}>
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2>{t('addCard')}</TypographyH2>
          </Stack>
          <Stack sx={{ marginBottom: '15px', justifyContent: 'flex-start' }}>
            <Cards
              number={state.number}
              expiry={state.expiry}
              cvc={state.cvc}
              name={state.name}
              focused={state.focus as any}
            />
          </Stack>
          <Box>
            <form onSubmit={handleSubmit(onSubmitAddCard)}>
              <Stack spacing={2} sx={{ marginBottom: '15px' }}>
                <Box sx={{ width: '100%' }}>
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
                            value={state.number}
                            name="number"
                            placeholder="Card number"
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
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
                <Box sx={{ width: '100%' }}>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom error={!!errors.name}>
                          {t('name')}
                          <RequiredLabel />
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            {...field}
                            name="name"
                            placeholder={t('name')}
                            value={state.name}
                            sx={{ width: '100%' }}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            error={!!errors.name}
                          />
                          <FormHelperText error={!!errors.name}>
                            {errors.name && `${errors.name.message}`}
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
                      name="cvc"
                      render={({ field }) => (
                        <>
                          <InputLabelCustom error={!!errors.cvc}>
                            {t('cvv')}
                            <RequiredLabel />
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              {...field}
                              name="cvc"
                              placeholder={t('cvv')}
                              onChange={handleInputChange}
                              onFocus={handleInputFocus}
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
                              placeholder={t('validThru')}
                              onChange={handleInputChange}
                              onFocus={handleInputFocus}
                              error={!!errors.expiry || !stateValidExpiry}
                            />
                            {!errors.expiry && !stateValidExpiry && (
                              <FormHelperText error>
                                {t('invalidMonth')}
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
                </Stack>
              </Stack>
              <ButtonCustom variant="contained" size="large" type="submit">
                {t('submit')}
              </ButtonCustom>
            </form>
          </Box>
        </BoxModalCustom>
      </Drawer>
    </Box>
  )
}

export default CardCheckout
