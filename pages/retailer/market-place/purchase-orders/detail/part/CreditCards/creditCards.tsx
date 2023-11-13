import {
  Box,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  RadioGroup,
  Stack,
  Typography,
  styled,
} from '@mui/material'
import Payment from 'payment'
import { ArrowRight, PlusCircle } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import Cards from 'react-credit-cards-2'
import {
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
  TypographyH2,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'

import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import RequiredLabel from 'src/components/requiredLabel'
import { useTranslation } from 'react-i18next'

import Image from 'next/image'
import {
  AddCardType,
  CardDetailInListCardType,
  ListCardResponseType,
  VaultCardType,
} from './cardCheckoutModel'
import { schemaValidation } from './validations'
import {
  getCustomerId,
  getCustomerIdRevitPay,
  getListCard,
} from './cardCheckoutAPI'

const DividerCustom = styled('div')(() => ({
  backgroundColor: '#49516F',
  height: '15px',
  width: '1px',
  marginRight: '10px',
}))

const BoxModalCustom = styled(Box)(() => ({
  width: '450px',
  background: 'white',
  borderStyle: 'none',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '10px',
}))

const CreditCards: React.FC<{
  open: boolean
  isAbleToGetListCard: boolean
  onClose: React.Dispatch<React.SetStateAction<boolean>>
  setSelectCard: React.Dispatch<
    React.SetStateAction<CardDetailInListCardType | undefined>
  >
  selectCard: CardDetailInListCardType | undefined
}> = (props) => {
  const { t } = useTranslation('checkout')
  const { type } = useAppSelector((state) => state.paymentType)
  const [stateCustomerId, setStateCustomerId] = useState(0)
  const [stateValidExpiry, setStateValidExpiry] = useState(true)
  const dispatch = useAppDispatch()
  const [stateListCard, setStateListCard] = useState<ListCardResponseType>()
  const [stateListCardRevitPay, setStateListCardRevitPay] = useState<any[]>([])
  const [selectCardRevitPay, setSelectCardRevitPay] = useState('')
  const [idCustomer, setIdCustomer] = useState('')
  const [stateCurrentCard, setStateCurrentCard] = useState(0)
  const [pushMessage] = useEnqueueSnackbar()
  const [isAddCard, setIsAddCard] = useState(false)
  const [isRefresh, setIsRefresh] = useState<string>('')

  const handleCloseDrawer = () => {
    props.onClose(false)
  }

  const handleOnClickRadio = (index: number, infoCard: any) => {
    setStateCurrentCard(Number(index))
    props.setSelectCard(infoCard)
  }

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm<AddCardType>({
    resolver: yupResolver(schemaValidation),
    mode: 'all',
    reValidateMode: 'onSubmit',
    defaultValues: {
      number: '',
      name: '',
      cvc: '',
      expiry: '',
    },
  })

  useEffect(() => {
    if (!props.isAbleToGetListCard || !props.open || !type) return
    if (type === 'REVITPAY') {
      getCustomerIdRevitPay().then((res) => {
        const { data } = res.data
        setIdCustomer(data.customer_id)
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
      })
    } else {
      getListCard()
        .then((res) => {
          const { data } = res
          setStateListCard(data)
          setStateCurrentCard(
            data.data.records.filter((item) => item.isDefault)[0].id
          )
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          dispatch(loadingActions.doLoadingFailure())
        })
    }
    reset()
    setIsAddCard(false)
  }, [isRefresh, props.isAbleToGetListCard, props.open, type])

  useEffect(() => {
    if (type && type !== 'REVITPAY') {
      getCustomerId()
        .then((res) => {
          const { data } = res.data
          setStateCustomerId(data.customer_id)
        })
        .catch(({ response }) => {
          if (!response) {
            pushMessage('Something went wrong', 'error')
            return
          }
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      setSelectCardRevitPay(String(props.selectCard?.id as number))
    }
  }, [type])

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

  const handleCheckIssuer = (value: string) => {
    let issuer = ''
    if (value === `Diner's Club International`) {
      issuer = 'dinersclub'
    }
    if (value === `American Express`) {
      issuer = 'amex'
    } else {
      issuer = value
    }
    return issuer
  }

  const formatCreditCardNumber = (value: string) => {
    if (!value) {
      return value
    }
    const issuer = Payment.fns.cardType(value)
    const clearValue = value.replace(/\D+/g, '')
    let nextValue
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
    return nextValue.trim()
  }

  const formatExpirationDate = (value: string) => {
    const clearValue = value.replace(/\D+/g, '')

    if (clearValue.length >= 3) {
      setStateValidExpiry(
        Number(clearValue.slice(0, 2)) <= 12 &&
          Number(clearValue.slice(0, 2)) >= 1
      )
      return `${clearValue.slice(0, 2)}/${clearValue.slice(2, 4)}`
    }

    return clearValue
  }

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target
    if (name === 'name') {
      const formattedValue = value.toUpperCase()
      setValue(name, formattedValue)
      return
    }
    if (name === 'cvc') {
      const formattedValue = value.replace(/\D+/g, '').slice(0, 3)
      setValue(name, formattedValue)
      trigger(name)
    }
    if (name === 'number') {
      const formattedValue = formatCreditCardNumber(value)
      setValue(name, formattedValue)
      trigger(name)
    }
    if (name === 'expiry') {
      const formattedValue = formatExpirationDate(value)
      setValue(name, formattedValue)
      trigger(name)
    }
  }

  const onSubmitAddCard = (data: AddCardType) => {
    console.log('data', data)
    if (type !== 'REVITPAY' && !stateCustomerId) return
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
            card: submitValue.number!.replace(/\s/g, ''),
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
          reset()
        })
        .catch(() => {
          dispatch(loadingActions.doLoadingFailure())
          pushMessage('Vault card failed', 'error')
        })
    } else {
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
        .then(() => {
          pushMessage(t('vaultCardSuccess'), 'success')
          reset()
          setIsRefresh('' + new Date().getTime())
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(() => {
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(t('vaultCardSuccess'), 'error')
        })
    }
  }

  return (
    <Drawer
      anchor={'right'}
      open={props.open}
      onClose={() => props.onClose(false)}
    >
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
          <TypographyH2>{t('creditCard')}</TypographyH2>
        </Stack>
        <Typography
          sx={{
            marginBottom: '15px',
            color: '#595959',
            fontWeight: '600',
            fontSize: '1.6rem',
          }}
        >
          {t('selectPaymentMethod')}
        </Typography>
        <RadioGroup sx={{ marginBottom: '15px', marginTop: '15px' }}>
          <Stack direction="column" sx={{ marginBottom: '15px' }}>
            {stateListCardRevitPay.map((item, index) => {
              return (
                <Stack
                  key={index}
                  mt={2}
                  sx={{
                    border:
                      selectCardRevitPay === item.id
                        ? '1px solid #53D1B6'
                        : '1px solid #E1E6EF',
                    borderRadius: '10px',
                    padding: '15px 20px',
                    cursor: 'pointer',
                  }}
                  direction="row"
                  alignItems={'center'}
                  justifyContent={'space-between'}
                  onClick={() => {
                    setSelectCardRevitPay(item.id)
                    props.setSelectCard(item)
                  }}
                >
                  <Box>
                    <Stack
                      direction="row"
                      alignItems={'center'}
                      justifyContent={'space-between'}
                      gap={2}
                    >
                      <Image
                        src={
                          '/' +
                          `/images/${renderLogoCreditCard(item.card_type)}`
                        }
                        alt="Logo"
                        width="40"
                        height="30"
                      />
                      <DividerCustom />

                      <Typography
                        sx={{
                          color: '#595959',
                          fontWeight: '600',
                          fontSize: '1.8rem',
                        }}
                      >
                        *** {item?.last4}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              )
            })}

            {stateListCard?.data.records &&
              stateListCard?.data.records.length > 0 &&
              stateListCard?.data.records.map((item, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    value={item.token}
                    sx={{
                      marginRight: '0px',
                    }}
                    control={
                      <Box
                        key={index}
                        sx={{
                          padding: '20px',
                          border:
                            stateCurrentCard === item.id
                              ? '1px solid #1DB46A'
                              : '',
                          borderRadius: '15px',
                          width: '100%',
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
                    onClick={() => handleOnClickRadio(item.id, item)}
                    label={false}
                  ></FormControlLabel>
                )
              })}
          </Stack>
        </RadioGroup>
        {!isAddCard && (
          <ButtonCustom
            variant="outlined"
            size="large"
            onClick={() => setIsAddCard(true)}
          >
            <PlusCircle size={24} />
            {t('addCard')}
          </ButtonCustom>
        )}

        {isAddCard && (
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
                            // value={field.value}
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
                            sx={{ width: '100%' }}
                            onChange={handleInputChange}
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
                              placeholder="Valid Thru"
                              onChange={handleInputChange}
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
              <Stack direction={'row'} gap={2}>
                <ButtonCustom
                  variant="outlined"
                  size="large"
                  onClick={() => {
                    reset()
                    setIsAddCard(false)
                  }}
                >
                  {t('cancel')}
                </ButtonCustom>
                <ButtonCustom variant="contained" size="large" type="submit">
                  {t('submit')}
                </ButtonCustom>
              </Stack>
            </form>
          </Box>
        )}
      </BoxModalCustom>
    </Drawer>
  )
}

export default CreditCards
