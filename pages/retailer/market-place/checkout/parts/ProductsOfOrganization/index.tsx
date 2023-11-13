import { yupResolver } from '@hookform/resolvers/yup'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Collapse,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import { ArrowRight, CaretRight, Check, Warning } from '@phosphor-icons/react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  ButtonCancel,
  ButtonCustom,
  TextFieldCustom,
  TypographyH2,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  handlerGetErrMessage,
  isEmpty,
  truncateToTwoDecimalPlaces,
} from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import { getCarrierOfOrganization, getPickUpLocation } from '../../checkoutAPI'
import {
  CarrierOfOrganizationType,
  ListItemCheckoutType,
} from '../../checkoutModel'
import { ContextCart } from '../../index.page'
import classes from '../../styles.module.scss'
import { schema } from '../../validations'
import CurrencyNumberFormat from './part/CurrencyNumberFormat'
import { calculateShippingFee } from './productOfOrgAPI'
import {
  AddressDataType,
  CalculateShippingType,
  GroupingShippingMethodType,
  PropDataType,
  SubmitPickUpType,
} from './productOfOrgModel'

//! props type
interface PropType {
  product: ListItemCheckoutType
  handleCheckItemIsInValid: (value: number) => boolean
  currentAddress?: AddressDataType
  handleChangeShippingMethod: (value: PropDataType) => void
  groupByStore: boolean
}
const TypographyPrice = styled(Typography)(() => ({
  fontSize: '1.6rem',
  fontWeight: '700',
  color: '#0A0D14',
}))
const CustomBoxDrawer = styled(Box)(() => ({
  width: '500px',
  background: '#FFF',
  borderRadius: '10px',
  padding: '30px',
}))

const ProductOfOrganization: React.FC<PropType> = (props) => {
  const { t } = useTranslation('checkout')

  const dispatch = useAppDispatch()
  const context: any = useContext(ContextCart)
  const [stateCurrentCarrierOfOrg, setStateCurrentCarrierOfOrg] = useState<
    CarrierOfOrganizationType[]
  >([])
  const [stateDrawerCarrier, setStateDrawerCarrier] = useState(false)
  const [pushMessage] = useEnqueueSnackbar()
  const [stateOpenListItem, setStateOpenListItem] = useState(-1)

  const [stateListShippingMethodInfo, setStateListShippingMethodInfo] =
    useState<CalculateShippingType[]>([])
  const [stateRadioShippingMethod, setStateRadioShippingMethod] = useState('0')
  const [stateCurrentCarrierSelected, setStateCurrentCarrierSelected] =
    useState('')
  const [stateCurrentShippingMethod, setStateCurrentShippingMethod] =
    useState<CalculateShippingType>()
  const [stateGroupingMethod, setStateGroupingMethod] =
    useState<GroupingShippingMethodType>()
  const [stateDisableShippingButton, setStateDisableShippingButton] =
    useState(false)
  const [statePaymentSummary, setStatePaymentSummary] = useState<{
    subtotal: number
    delivery_fee: number
    total_billing: number
  }>({
    subtotal: 0,
    delivery_fee: 0,
    total_billing: 0,
  })

  const [stateCustomAmount, setStateCustomAmount] = useState<number | null>(0)
  const [stateRadioPayment, setStateRadioPayment] = useState('full')
  const handleChangeRadioRadioPayment = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateRadioPayment((event.target as HTMLInputElement).value)
  }
  useEffect(() => {
    const cloneArray: { id: number; amount: number; type: string }[] = [
      ...context.stateListCustomAmount,
    ]
    if (
      props.product.payment_term.delay_payment &&
      context &&
      stateRadioPayment !== 'custom' &&
      context.stateListCustomAmount.length >= 0
    ) {
      console.log('contaxt', context)
      console.log('hehe')

      console.log('cloneArray', cloneArray)
      const result = cloneArray.findIndex(
        (item) => item.id === props.product.organization.id
      )
      console.log('result', result)
      if (result < 0) {
        cloneArray.push({
          id: props.product.organization.id,
          amount:
            stateRadioPayment === 'full'
              ? truncateToTwoDecimalPlaces(
                  statePaymentSummary.subtotal +
                    statePaymentSummary.delivery_fee
                )
              : 0,
          type: stateRadioPayment,
        })
      } else {
        cloneArray[result] = {
          ...cloneArray[result],
          amount:
            stateRadioPayment === 'full'
              ? truncateToTwoDecimalPlaces(
                  statePaymentSummary.subtotal +
                    statePaymentSummary.delivery_fee
                )
              : 0,
          type: stateRadioPayment,
        }
        console.log('///', cloneArray[result])
      }
      console.log('cloneArrayaaa', cloneArray)
      context.setStateListCustomAmount(cloneArray)
    }
    if (
      props.product.payment_term.delay_payment &&
      context &&
      stateRadioPayment === 'custom' &&
      context.stateListCustomAmount.length >= 0
    ) {
      const result = cloneArray.findIndex(
        (item) => item.id === props.product.organization.id
      )
      console.log('result', result)
      if (result < 0) {
        cloneArray.push({
          id: props.product.organization.id,
          amount: stateCustomAmount ? stateCustomAmount : 0,
          type: stateRadioPayment,
        })
      } else {
        cloneArray[result] = {
          ...cloneArray[result],
          amount: stateCustomAmount ? stateCustomAmount : 0,
          type: stateRadioPayment,
        }

        console.log('///', cloneArray[result])
      }
      context.setStateListCustomAmount(cloneArray)
    }
    if (!props.product.payment_term.delay_payment) {
      const result = cloneArray.findIndex(
        (item) => item.id === props.product.organization.id
      )
      console.log('result', result)
      if (result < 0) {
        cloneArray.push({
          id: props.product.organization.id,
          amount: truncateToTwoDecimalPlaces(
            statePaymentSummary.subtotal +
              (stateCurrentShippingMethod
                ? stateCurrentShippingMethod.confirmation_amount.amount +
                  stateCurrentShippingMethod.insurance_amount.amount +
                  stateCurrentShippingMethod.other_amount.amount +
                  stateCurrentShippingMethod.shipping_amount.amount
                : 0)
          ),
          type: 'full',
        })
      } else {
        cloneArray[result] = {
          ...cloneArray[result],
          amount: truncateToTwoDecimalPlaces(
            statePaymentSummary.subtotal +
              (stateCurrentShippingMethod
                ? stateCurrentShippingMethod.confirmation_amount.amount +
                  stateCurrentShippingMethod.insurance_amount.amount +
                  stateCurrentShippingMethod.other_amount.amount +
                  stateCurrentShippingMethod.shipping_amount.amount
                : 0)
          ),
          type: 'full',
        }
      }
      context.setStateListCustomAmount(cloneArray)
      // else {
      //   const cloneArray: { id: number; amount: number }[] = JSON.parse(
      //     JSON.stringify(context.stateListCustomAmount)
      //   )
      //   const result = cloneArray.findIndex(
      //     (item) => item.id === props.product.organization.id
      //   )
      //   if (result < 0) {
      //     cloneArray.push({
      //       id: props.product.organization.id,
      //       amount: stateCustomAmount ? stateCustomAmount : 0,
      //     })
      //   } else {
      //     cloneArray[result] = {
      //       ...cloneArray[result],
      //       amount: stateCustomAmount ? stateCustomAmount : 0,
      //     }
      //   }
      //   context.setStateListCustomAmount(cloneArray)
      // }
    }
  }, [
    props.product.organization.id,
    props.product.payment_term.delay_payment,
    stateCustomAmount,
    statePaymentSummary.delivery_fee,
    statePaymentSummary.subtotal,
    stateRadioPayment,
  ])
  const handleGetShippingMethod = (id_org: number) => {
    getCarrierOfOrganization(id_org)
      .then((res) => {
        const { data } = res.data
        setStateCurrentCarrierOfOrg(data)
        const listCarrierId: string[] = data.map((item) => item.carrier_id)
        handleGetPickUp(props.product.organization.id, listCarrierId)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleConvertWeightToGram = (weight: number, uom: string) => {
    switch (uom) {
      case 'pound':
        return weight * 453.59237
      case 'kilogram':
        return weight * 1000
      case 'ounch':
        return weight * 28.34952
      case 'gram':
        return weight
      default:
        return weight
    }
  }
  const handleGetPickUp = (id_org: number, listCarrierId: string[]) => {
    dispatch(loadingActions.doLoading())
    getPickUpLocation(id_org)
      .then((res) => {
        const { data } = res.data

        if (!props.currentAddress) return
        if (listCarrierId.length === 0) return
        const totalWeight: number = props.product.items.reduce(
          (previous, product) => {
            return (
              Number(previous) +
              handleConvertWeightToGram(product.weight, product.uom) *
                product.quantity
            )
          },
          0
        )

        const submitValueForCalculating: SubmitPickUpType = {
          carrier_ids: listCarrierId,
          from_country_code: 'US',
          from_postal_code: data.postal_zipcode,
          from_city_locality: data.city,
          from_state_province: data.state,
          to_country_code: 'US',
          to_postal_code: props.currentAddress.postal_zipcode,
          to_city_locality: props.currentAddress.city,
          to_state_province: props.currentAddress.state,
          weight: {
            unit: 'gram',
            value: totalWeight,
          },
        }
        calculateShippingFee(submitValueForCalculating).then((res) => {
          const { data } = res

          if (!data.result) {
            pushMessage('Can not estimate shipping fee', 'error')
            dispatch(loadingActions.doLoadingFailure())
            setStateDisableShippingButton(true)
            return
          }

          const result: GroupingShippingMethodType = data.result.reduce(
            function (key, value) {
              key[value.carrier_id] = key[value.carrier_id] || []
              key[value.carrier_id].push(value)
              return key
            },
            Object.create(null)
          )

          setStateGroupingMethod(result)
          setStateListShippingMethodInfo(data.result)
          dispatch(loadingActions.doLoadingSuccess())
        })
        // .catch(({ response }) => {
        //   console.log('message', response)
        // })
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  const {
    control,
    getValues,

    formState: { errors },
  } = useForm<{ note: string | null }>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })
  useEffect(() => {
    handleGetShippingMethod(props.product.organization.id)
  }, [props.currentAddress])
  useEffect(() => {
    const total = props.product.items.reduce((prev, item) => {
      return Number(prev) + Number(item.subTotal)
    }, 0)
    setStatePaymentSummary((prev) => ({ ...prev, subtotal: total }))
  }, [props.product, props.currentAddress])

  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateRadioShippingMethod((event.target as HTMLInputElement).value)

    //get index of current shipping method information
  }
  const handleCloseDrawerCarrier = () => {
    if (stateCurrentShippingMethod) {
      const foundIndexCurrentShippingMethod =
        stateListShippingMethodInfo.findIndex(
          (item) =>
            item.service_code === stateCurrentShippingMethod?.service_code
        )

      setStateRadioShippingMethod(
        `${stateCurrentCarrierSelected}-${foundIndexCurrentShippingMethod}`
      )
    }
    setStateOpenListItem(-1)
    setStateDrawerCarrier(false)
  }
  const handleConfirmSelectShippingMethod = () => {
    if (!stateGroupingMethod) return
    const currentShippingMethodIndex = stateRadioShippingMethod.slice(
      stateRadioShippingMethod.indexOf('-') + 1
    )
    if (isNaN(Number(currentShippingMethodIndex))) return
    const currentCarrierIndex = stateRadioShippingMethod.slice(
      0,
      stateRadioShippingMethod.indexOf('-')
    )
    const result =
      stateGroupingMethod?.[
        stateCurrentCarrierOfOrg[Number(currentCarrierIndex)].carrier_id
      ][Number(currentShippingMethodIndex)]

    setStateCurrentCarrierSelected(currentCarrierIndex)
    setStateCurrentShippingMethod(result)

    const shippingFee =
      result.confirmation_amount.amount +
      result.insurance_amount.amount +
      result.other_amount.amount +
      result.shipping_amount.amount
    const totalWeight: number = props.product.items.reduce(
      (previous, product) => {
        return (
          Number(previous) +
          handleConvertWeightToGram(product.weight, product.uom)
        )
      },
      0
    )
    const carrier = result.carrier_id

    const submitValue: PropDataType = {
      value: result,
      shippingFee: shippingFee,
      weight: totalWeight,
      carrier_id: carrier,
      notes: getValues('note'),
    }
    setStateDrawerCarrier(false)
    setStatePaymentSummary((prev) => ({ ...prev, delivery_fee: shippingFee }))
    props.handleChangeShippingMethod(submitValue)
  }
  console.log('product', props.groupByStore)
  const handleChangeCurrencyNumberFormat = (value: number | null) => {
    setStateCustomAmount(value)
    const cloneArray: { id: number; amount: number; type: string }[] =
      JSON.parse(JSON.stringify(context.stateListCustomAmount))
    const result = cloneArray.findIndex(
      (item) => item.id === props.product.organization.id
    )
    if (result < 0) {
      cloneArray.push({
        id: props.product.organization.id,
        amount: value ? value : 0,
        type: 'custom',
      })
    } else {
      cloneArray[result] = {
        ...cloneArray[result],
        amount: value ? value : 0,
        type: 'custom',
      }
    }
    context.setStateListCustomAmount(cloneArray)
  }
  return (
    <Box
      sx={{
        border: '1px solid #E1E6EF',
        borderRadius: '10px',
        marginBottom: '16px',
      }}
    >
      <Stack divider={<Divider orientation="horizontal" flexItem />}>
        <Box p={2}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{
              marginBottom: '15px',
            }}
          >
            <Avatar
              src={props.product.organization.logo}
              alt={props.product.organization.name}
            />
            <Box>
              <Typography
                sx={{
                  fontSize: '1.6rem',
                  color: '#49516F',
                  fontWeight: 500,
                }}
              >
                {props.product.organization.name}
              </Typography>
              <Typography>
                x{props.product.items.length} {t('products')}
              </Typography>
            </Box>
          </Stack>
        </Box>
        {props.groupByStore && (
          <Box p={2}>
            <Grid
              spacing={2}
              container
              direction="row"
              alignItems="center"
              justifyContent="end"
            >
              <Grid xs={8}>
                <Typography
                  sx={{
                    color: '#49516F',
                    fontSize: '1.6rem',
                  }}
                >
                  {t('products')}
                </Typography>
              </Grid>
              <Grid xs={2}>
                <Typography
                  sx={{
                    textAlign: 'right',
                    color: '#49516F',
                    fontSize: '1.6rem',
                  }}
                >
                  {t('unit')}
                </Typography>
              </Grid>
              <Grid xs={2}>
                <Typography
                  sx={{
                    textAlign: 'right',
                    color: '#49516F',
                    fontSize: '1.6rem',
                  }}
                >
                  Price
                </Typography>
              </Grid>
            </Grid>

            {props.product.items.map((obj, index) => {
              return (
                <Box
                  sx={{ marginBottom: '15px' }}
                  key={`${obj.productId} ${index}`}
                >
                  <Grid
                    spacing={2}
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="end"
                    sx={{
                      background: props.handleCheckItemIsInValid(obj.productId)
                        ? '#FEF1F2'
                        : '',
                    }}
                  >
                    <Grid xs>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <div className={classes['image-wrapper']}>
                          <Link
                            href={`/retailer/market-place/product-detail/${obj?.product.id}?variant=${obj.productId}`}
                          >
                            <a>
                              <Image
                                src={
                                  obj.productThumbnail
                                    ? obj.productThumbnail
                                    : '/' + '/images/vapeProduct.png'
                                }
                                alt="product"
                                width={50}
                                height={50}
                              />
                            </a>
                          </Link>
                        </div>
                        <Stack>
                          <Stack direction="row" spacing={1}>
                            <Typography
                              sx={{
                                opacity: props.handleCheckItemIsInValid(
                                  obj.productId
                                )
                                  ? '0.35'
                                  : '',
                              }}
                              component="div"
                            >
                              #{obj?.productCode}
                            </Typography>
                            <div>|</div>
                            <Link
                              href={`/retailer/market-place/product-detail/${obj?.product.id}?variant=${obj.productId}`}
                            >
                              <a>
                                <Typography
                                  component="div"
                                  sx={{
                                    opacity: props.handleCheckItemIsInValid(
                                      obj.productId
                                    )
                                      ? '0.35'
                                      : '',
                                  }}
                                >
                                  {obj?.productName}
                                </Typography>
                              </a>
                            </Link>
                          </Stack>
                          <Stack direction="row" spacing={1}>
                            {obj.attribute_options.map((att, idx) => {
                              return (
                                <Stack direction="row" key={idx} spacing={1}>
                                  <Typography
                                    sx={{
                                      color: '#1B1F27',
                                      fontSize: '1.4rem',
                                    }}
                                  >
                                    {att.attribute}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: '#1DB46A',
                                      fontSize: '1.4rem',
                                    }}
                                  >
                                    {att.option}
                                  </Typography>
                                </Stack>
                              )
                            })}
                          </Stack>
                        </Stack>
                        {props.handleCheckItemIsInValid(obj.productId) && (
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                          >
                            <Warning size={18} style={{ color: 'red' }} />
                            <Typography sx={{ color: 'red' }}>
                              {t('theProductIsNotAvailable')}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Grid>
                    <Grid
                      xs={2}
                      sx={{
                        opacity: props.handleCheckItemIsInValid(obj.productId)
                          ? '0.35'
                          : '',
                        textAlign: 'right',
                      }}
                    >
                      <Typography sx={{ textTransform: 'lowercase' }}>
                        {obj?.quantity} {obj.unitType}
                      </Typography>
                    </Grid>

                    <Grid
                      xs={2}
                      sx={{
                        textAlign: 'right',
                      }}
                    >
                      {!isEmpty(obj.price_discount) ? (
                        <TypographyPrice
                          sx={{
                            opacity: props.handleCheckItemIsInValid(
                              obj.productId
                            )
                              ? '0.35'
                              : '',
                          }}
                        >
                          {formatMoney(
                            Number(obj?.quantity) * Number(obj?.price_discount)
                          )}
                        </TypographyPrice>
                      ) : (
                        <TypographyPrice
                          sx={{
                            opacity: props.handleCheckItemIsInValid(
                              obj.productId
                            )
                              ? '0.35'
                              : '',
                          }}
                        >
                          {formatMoney(
                            Number(obj?.quantity) * Number(obj?.unitPrice)
                          )}
                        </TypographyPrice>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              )
            })}
          </Box>
        )}

        <Box p={2}>
          <Typography
            sx={{
              fontSize: '1.6rem',
              color: '#3F444D',
              marginBottom: '15px',
            }}
          >
            {t('shippingMethod')}
          </Typography>
          {/* {stateCurrentShippingMethod?.service_code} */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            {!stateCurrentShippingMethod && (
              <Typography sx={{ color: '#F08420', fontStyle: 'italic' }}>
                {t('chooseShippingMethod')}
              </Typography>
            )}
            {stateCurrentShippingMethod && (
              <Stack spacing={1}>
                <Stack
                  direction="row"
                  alignItems="center"
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={2}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Avatar
                      src={
                        stateCurrentCarrierOfOrg[
                          Number(stateCurrentCarrierSelected)
                        ].logo
                      }
                      alt={
                        stateCurrentCarrierOfOrg[
                          Number(stateCurrentCarrierSelected)
                        ].name
                      }
                    />
                    <Typography>
                      {
                        stateCurrentCarrierOfOrg[
                          Number(stateCurrentCarrierSelected)
                        ].name
                      }
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: '#1DB46A', fontWeight: 500 }}>
                    {stateCurrentShippingMethod &&
                      formatMoney(
                        stateCurrentShippingMethod.confirmation_amount.amount +
                          stateCurrentShippingMethod.insurance_amount.amount +
                          stateCurrentShippingMethod.other_amount.amount +
                          stateCurrentShippingMethod.shipping_amount.amount
                      )}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Typography sx={{ fontWeight: 700 }}>Get it by</Typography>
                    <Typography sx={{ color: '#1DB46A', fontWeight: 700 }}>
                      {moment(
                        stateCurrentShippingMethod.estimated_delivery_date
                      ).format('MMMM Do, YYYY - hh:mm A')}
                    </Typography>
                  </Stack>
                </Stack>

                {/* <Typography>
                    {stateCurrentShippingMethod.carrier_friendly_name}
                  </Typography>
                  <Typography>
                    {moment(
                      stateCurrentShippingMethod.estimated_delivery_date
                    ).format('MMMM DD, YYYY - hh:mm A')}
                  </Typography> */}
              </Stack>
            )}
            <IconButton onClick={() => setStateDrawerCarrier(true)}>
              <CaretRight size={24} />
            </IconButton>
          </Stack>
        </Box>
        <Box p={2}>
          <Typography
            sx={{
              fontSize: '1.6rem',
              color: '#0A0D14',
              marginBottom: '15px',
              textTransform: 'uppercase',
              fontWeight: 500,
            }}
          >
            Payment
          </Typography>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem />}
            spacing={2}
            sx={{ marginBottom: '10px' }}
          >
            <Stack direction="row" spacing={1}>
              <Typography>Subtotal</Typography>
              <Typography sx={{ color: '#1DB46A', fontWeight: 500 }}>
                {formatMoney(
                  truncateToTwoDecimalPlaces(statePaymentSummary.subtotal)
                )}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography>Delivery fee</Typography>
              <Typography sx={{ color: '#1DB46A', fontWeight: 500 }}>
                {stateCurrentShippingMethod
                  ? formatMoney(
                      truncateToTwoDecimalPlaces(
                        stateCurrentShippingMethod.confirmation_amount.amount +
                          stateCurrentShippingMethod.insurance_amount.amount +
                          stateCurrentShippingMethod.other_amount.amount +
                          stateCurrentShippingMethod.shipping_amount.amount
                      )
                    )
                  : 'N/A'}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography>Total billing</Typography>
              <Typography sx={{ color: '#1DB46A', fontWeight: 500 }}>
                {formatMoney(
                  truncateToTwoDecimalPlaces(
                    statePaymentSummary.subtotal +
                      (stateCurrentShippingMethod
                        ? stateCurrentShippingMethod.confirmation_amount
                            .amount +
                          stateCurrentShippingMethod.insurance_amount.amount +
                          stateCurrentShippingMethod.other_amount.amount +
                          stateCurrentShippingMethod.shipping_amount.amount
                        : 0)
                  )
                )}
              </Typography>
            </Stack>
          </Stack>

          {props.product.payment_term.delay_payment ? (
            <>
              <Typography
                sx={{
                  color: '#1DB46A',
                  fontStyle: 'italic',
                  marginBottom: '10px',
                }}
              >
                Your payment terms on this supplier is{' '}
                {props.product.payment_term.duration} days
              </Typography>
              <FormControl component="fieldset">
                <RadioGroup
                  name="gender1"
                  value={stateRadioPayment}
                  onChange={handleChangeRadioRadioPayment}
                >
                  <FormControlLabel
                    value="full"
                    control={<Radio />}
                    label="Fully Pay Now"
                  />
                  <FormControlLabel
                    value="custom"
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography>Pay With A Custom Amount</Typography>
                        <div className={classes['input-number']}>
                          <CurrencyNumberFormat
                            defaultPrice={stateCustomAmount}
                            disable={stateRadioPayment !== 'custom'}
                            propValue={(value) =>
                              handleChangeCurrencyNumberFormat(value)
                            }
                          />
                        </div>
                        {stateRadioPayment === 'custom' &&
                          Number(stateCustomAmount) >=
                            truncateToTwoDecimalPlaces(
                              statePaymentSummary.subtotal +
                                (stateCurrentShippingMethod
                                  ? stateCurrentShippingMethod
                                      .confirmation_amount.amount +
                                    stateCurrentShippingMethod.insurance_amount
                                      .amount +
                                    stateCurrentShippingMethod.other_amount
                                      .amount +
                                    stateCurrentShippingMethod.shipping_amount
                                      .amount
                                  : 0)
                            ) && (
                            <Typography
                              sx={{ color: '#BA2532', fontSize: '1.2rem' }}
                            >
                              Invalid custom amount
                            </Typography>
                          )}
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value="later"
                    control={<Radio />}
                    label="Pay Later"
                  />
                </RadioGroup>
              </FormControl>
            </>
          ) : (
            <Typography sx={{ color: '#BA2532', fontStyle: 'italic' }}>
              You must fully pay for this Supplier
            </Typography>
          )}
        </Box>
        <Box p={2}>
          <Typography
            sx={{
              fontSize: '1.6rem',
              color: '#3F444D',
              marginBottom: '15px',
            }}
          >
            {t('noteForStore')}
          </Typography>
          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <>
                <FormControl fullWidth>
                  <TextFieldCustom
                    id="note"
                    error={!!errors.note}
                    multiline
                    rows={3}
                    {...field}
                  />
                  <FormHelperText error={!!errors.note}>
                    {errors.note && `${errors.note.message}`}
                  </FormHelperText>
                </FormControl>
              </>
            )}
          />
        </Box>
      </Stack>

      <Drawer
        anchor="right"
        open={stateDrawerCarrier}
        onClose={handleCloseDrawerCarrier}
      >
        <CustomBoxDrawer>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton onClick={handleCloseDrawerCarrier}>
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2 textAlign="center">
              {t('shippingMethod')}
            </TypographyH2>
          </Stack>
          <Box sx={{ marginBottom: '15px' }}>
            {stateCurrentCarrierOfOrg.map((item, index) => {
              return (
                <Box key={index}>
                  <ListItemButton
                    onClick={() => {
                      if (stateOpenListItem === index) {
                        setStateOpenListItem(-1)
                        return
                      }
                      setStateOpenListItem(index)
                    }}
                  >
                    <ListItemText
                      primary={
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          key={index}
                        >
                          <Avatar src={item.logo} alt={item.name} />
                          <Typography>{item.name}</Typography>
                          {stateCurrentCarrierSelected === index.toString() && (
                            <Check color="#1DB46A" size={24} />
                          )}
                        </Stack>
                      }
                    />
                    {stateOpenListItem === index ? (
                      <ExpandLess />
                    ) : (
                      <ExpandMore />
                    )}
                  </ListItemButton>
                  <Collapse
                    in={stateOpenListItem === index}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      <RadioGroup
                        sx={{ width: '100%' }}
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={stateRadioShippingMethod}
                        onChange={handleChangeRadio}
                      >
                        {/* {['fedex', 'ups'].map((item) => {
                        return item
                      })} */}

                        {stateGroupingMethod && item.carrier_id && (
                          <>
                            {stateGroupingMethod[item.carrier_id] &&
                              stateGroupingMethod[item.carrier_id].map(
                                (obj, idx) => {
                                  return (
                                    <Box key={idx} mb={2}>
                                      <FormControlLabel
                                        key={idx}
                                        value={`${index}-${idx}`}
                                        control={<Radio />}
                                        label={
                                          <Stack
                                            direction="row"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            spacing={2}
                                          >
                                            <Stack spacing={0.5}>
                                              <Typography>
                                                {obj.service_type}
                                              </Typography>
                                              <Typography>
                                                {obj.estimated_delivery_date
                                                  ? moment(
                                                      obj.estimated_delivery_date
                                                    ).format(
                                                      'MMMM DD, YYYY - hh:mm A'
                                                    )
                                                  : 'N/A'}
                                              </Typography>
                                            </Stack>
                                            <Typography>
                                              {obj.confirmation_amount &&
                                              obj.insurance_amount &&
                                              obj.other_amount &&
                                              obj.shipping_amount
                                                ? formatMoney(
                                                    obj.confirmation_amount
                                                      .amount +
                                                      obj.insurance_amount
                                                        .amount +
                                                      obj.other_amount.amount +
                                                      obj.shipping_amount.amount
                                                  )
                                                : 'N/A'}
                                            </Typography>
                                          </Stack>
                                        }
                                      />
                                    </Box>
                                  )
                                }
                              )}
                          </>
                        )}
                      </RadioGroup>
                    </List>
                  </Collapse>
                </Box>
              )
            })}
          </Box>

          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={handleCloseDrawerCarrier}
              variant="outlined"
              size="large"
            >
              {t('cancel')}
            </ButtonCancel>
            <ButtonCustom
              disabled={stateDisableShippingButton}
              onClick={handleConfirmSelectShippingMethod}
              variant="contained"
              size="large"
            >
              {t('confirm')}
            </ButtonCustom>
          </Stack>
        </CustomBoxDrawer>
      </Drawer>
    </Box>
  )
}

export default ProductOfOrganization
