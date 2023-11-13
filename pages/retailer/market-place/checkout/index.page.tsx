// react
import React, { useEffect, useState } from 'react'
// next
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
// next

// mui
import {
  Autocomplete,
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Dialog,
  Divider,
  Drawer,
  FormControl,
  // FormControlLabel,
  FormHelperText,
  IconButton,
  LinearProgress,
  Radio,
  // RadioGroup,
  Stack,
  // Switch,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import InfiniteScroll from 'react-infinite-scroll-component'
// mui

// form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { schema, schemaAddress } from './validations'

// api

import { useAppDispatch, useAppSelector } from 'src/store/hooks'
// api

// layout
import type { NextPageWithLayout } from 'pages/_app.page'
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
// layout

// other
import {
  ArrowLeft,
  ArrowRight,

  // Check,
  CircleWavyCheck,
  CurrencyCircleDollar,
  MapPinLine,
  NotePencil,
  PencilSimpleLine,
  PlusCircle,
  ShoppingCart,
  WarningCircle,
  X,
  CaretRight,
} from '@phosphor-icons/react'
import { formatMoney } from 'src/utils/money.utils'
// other

// custom style
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldCustom,
  TypographyH2,
} from 'src/components'

// style
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  createOrderV2,
  getItemForCheckoutV2,
  verifyCartItem,
} from './checkoutAPI'
import {
  CalculateOrderType,
  CartItemGroupingByOrganizationType,
  ListCartItemGroupByOrgType,
  ListItemCheckoutType,
  // PaymentMethodListType,
  PropDataType,
  RetailerCreateOrderType,
} from './checkoutModel'

// import { useRouter } from 'next/router'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { invalidCartItemType } from 'pages/retailer/market-place/cart/cartModel'
import { getListAddress } from 'pages/_common/account/_address-book/listAddressAPI'
import { AddressDataType } from 'pages/_common/account/_address-book/listAddressModels'
import dataState from 'pages/_common/account/_address-book/states.json'
import { createAddressBookAPI } from 'pages/_common/account/_address-book/_create-address/createAddressAPI'
import { updateAddressBook } from 'pages/_common/account/_address-book/_update-address/detailAddressBookAPI'
import { useTranslation } from 'react-i18next'
import { PatternFormat } from 'react-number-format'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { cartActions } from 'src/store/cart/cartSlice'
import {
  formatPhoneNumber,
  handlerGetErrMessage,
  truncateToTwoDecimalPlaces,
} from 'src/utils/global.utils'
import { getListCard } from './parts/CardCheckout/cardCheckoutAPI'
import { CardDetailInListCardType } from './parts/CardCheckout/cardCheckoutModel'
// import CheckoutSuccess from './parts/CheckoutSuccess'
import CreditCards from './parts/CreditCards/creditCards'
import ProductOfOrganization from './parts/ProductsOfOrganization'
import classes from './styles.module.scss'

// style

// custom style
const DividerCustom = styled('div')(() => ({
  backgroundColor: '#49516F',
  height: '15px',
  width: '1px',
  marginRight: '10px',
}))
const CardPage = styled(Card)(() => ({
  boxShadow: 'none',
  marginLeft: '-16px',
  marginRight: '-16px',
}))
const CardCustom = styled(Card)(() => ({
  boxShadow: 'none',
  height: '100%',
}))
// const ButtonCheckboxCustom = styled(Button)(() => ({
//   boxShadow: 'none',
//   borderRadius: '4px',
// }))
const CardHeaderCustom = styled(CardHeader)(() => ({
  paddingBottom: '0px',
}))
const CardContentCustom = styled(CardContent)(() => ({
  paddingBottom: '0px !important',
}))
const TypographyH1 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))

const TypographyTotal = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: '600',
  color: theme.palette.primary.main,
}))

// const FormControlLabelCustom = styled(FormControlLabel)(({ theme }) => ({
//   position: 'relative',
//   overflow: 'hidden',
//   '& .MuiTypography-root': {
//     position: 'absolute',
//     bottom: '-6px',
//     right: 0,
//     color: '#fff',
//     fontSize: '1.2rem',
//   },
//   '&:before': {
//     position: 'absolute',
//     bottom: '-10px',
//     right: '-15px',
//     backgroundColor: theme.palette.primary.main,
//     width: '20px',
//     height: '30px',
//     content: '""',
//     transform: 'rotate(45deg)',
//   },
//   '&.Mui-disabled': {
//     '&:before': {
//       display: 'none',
//     },
//     '& .MuiTypography-root': {
//       display: 'none',
//     },
//   },
// }))

// const PaymentMethodList: PaymentMethodListType[] = [
//   { id: 1, method: 'Cash' },
//   { id: 2, method: 'Credit Card' },
// ]
// custom style
export const ContextCart: any = React.createContext([])
const Checkout: NextPageWithLayout = () => {
  const { t } = useTranslation('checkout')

  const theme = useTheme()
  const router = useRouter()
  // const cart = useAppSelector((state) => state.cart)
  const [pushMessage] = useEnqueueSnackbar()

  const dispatch = useAppDispatch()

  // state use for temporary invalid item
  const [valueInput, setValueInput] = useState<{
    name: string
    abbreviation: string
  }>({
    name: '',
    abbreviation: '',
  })
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(2)
  const [tempInvalid, setTempInvalid] = useState<number[]>([])
  const [stateCalculate, setStateCalculate] = useState<CalculateOrderType>({
    sub_total: 0,
    delivery_fee: 0,
    total: 0,
    remaining: 0,
  })
  // const [stateCheckoutCase, setStateCheckoutCase] = useState<number>(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [stateOpenDialogAddress, setStateOpenDialogAddress] = useState(false)
  const [openCreditCards, setOpenCreditCards] = useState(false)
  const [stateListAddress, setStateListAddress] = useState<{
    data: {
      id: number
      name: string
      phone_number: string
      receiver_name: string
      address: string
      default_address: boolean
      city: string
      state: string
      postal_zipcode: string
    }[]
    errors?: any
    nextPage?: number | null
  }>({
    data: [],
  })
  // =============================NEW STATE====================================

  //Select Address
  const [stateSelectedValue, setStateSelectedValue] = useState<number>()
  //Default Address
  const [stateDefaultAddress, setStateDefaultAddress] =
    useState<AddressDataType>()
  const [stateDialogAddress, setStateDialogAddress] =
    useState<string>('default')
  // const [stateRadioIndex, setStateRadioIndex] = useState<number>(2)

  const { type } = useAppSelector((state) => state.paymentType)

  const [selectCard, setSelectCard] = useState<CardDetailInListCardType>()
  const [stateListItemCheckoutV2, setStateListItemCheckoutV2] = useState<
    ListItemCheckoutType[]
  >([])
  const [stateListItemOfOrg, setStateListItemOfOrg] = useState<
    ListCartItemGroupByOrgType[]
  >([])
  const [stateSwitchGroup, setStateSwitchGroup] = useState(true)
  const [stateGroupProduct, setStateGroupProduct] = useState<
    CartItemGroupingByOrganizationType[]
  >([])
  const [stateListCustomAmount, setStateListCustomAmount] = useState<
    {
      id: number
      amount: number
      type: string
    }[]
  >([])
  const [stateAcceptTerm, setStateAcceptTerm] = useState(false)
  // const handleChangeSwitchGroup = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setStateSwitchGroup(event.target.checked)
  // }
  const handleDialog = () => {
    setOpenDialog(!openDialog)
  }

  // const handleChangeRadioButton = (event: any) => {
  //   setStateRadioIndex(Number(event.target.value))
  //   console.log('event from handle change radio button', event.target.value)
  // }

  const getDataAddressBook = () => {
    dispatch(loadingActions.doLoading())
    getListAddress()
      .then((res) => {
        const { data } = res

        setStateListAddress(data)
        for (const i in data.data) {
          if (data?.data[parseInt(i)]?.default_address) {
            setStateDefaultAddress(data?.data[parseInt(i)])
            console.log(`data?.data[parseInt(${i})])`, data.data[parseInt(i)])
            console.log(
              `data?.data[parseInt(${i})]) id`,
              data.data[parseInt(i)].id
            )
            setStateSelectedValue(data?.data[parseInt(i)].id)
          }
        }
        if (res.data?.data?.length === 0 || !res.data.nextPage) {
          setHasMore(false)
        }
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const fetchMoreData = () => {
    console.log('33333')
    if (!hasMore) return
    setPage((prev) => {
      getListAddress({ page: prev }).then((res) => {
        const { data } = res.data
        if (data?.length === 0 || !res.data.nextPage) {
          setHasMore(false)
        }
        setStateListAddress((prev) => {
          return {
            ...prev,
            data: [...prev.data, ...data],
          }
        })
      })
      return page + 1
    })
  }

  const handleChangeRadio = (currentAddress: AddressDataType) => {
    setStateSelectedValue(Number(currentAddress.id))
  }

  //select Address

  const handleDialogAddress = () => {
    reset({
      name: '',
      phone_number: '',
      address: '',
      receiver_name: '',
      city: '',
      state: {
        name: '',
        abbreviation: '',
      },
      postal_zipcode: '',
    })
    setValueInput({
      name: '',
      abbreviation: '',
    })
    setStateDialogAddress('default')
    setStateSelectedValue(stateDefaultAddress?.id)
    setStateOpenDialogAddress(true)
  }
  const handleBackToDefaultDialog = () => {
    reset({
      name: '',
      phone_number: '',
      address: '',
      receiver_name: '',
      city: '',
      state: {
        name: '',
        abbreviation: '',
      },
      postal_zipcode: '',
    })
    setValueInput({
      name: '',
      abbreviation: '',
    })
    setStateDialogAddress('default')
    setStateSelectedValue(stateDefaultAddress?.id)
  }
  const handleCloseDialog = () => {
    reset({
      name: '',
      phone_number: '',
      address: '',
      receiver_name: '',
      city: '',
      state: {
        name: '',
        abbreviation: '',
      },
      postal_zipcode: '',
    })
    setValueInput({
      name: '',
      abbreviation: '',
    })
    setStateOpenDialogAddress(false)
  }
  const handleOpenCreateAddress = () => {
    reset({
      name: '',
      phone_number: '',
      address: '',
      receiver_name: '',
      city: '',
      state: {
        name: '',
        abbreviation: '',
      },
      postal_zipcode: '',
    })
    setValueInput({
      name: '',
      abbreviation: '',
    })
    setStateDialogAddress('create')
    setStateOpenDialogAddress(!stateOpenDialogAddress)
  }

  //Choose Address
  const handleConfirmAddress = () => {
    for (const i in stateListAddress?.data) {
      if (stateListAddress?.data[Number(i)].id == stateSelectedValue) {
        setStateDefaultAddress(stateListAddress?.data[Number(i)])
      }
    }
    reset({
      name: '',
      phone_number: '',
      address: '',
      receiver_name: '',
      city: '',
      state: {
        name: '',
        abbreviation: '',
      },
      postal_zipcode: '',
    })
    setValueInput({
      name: '',
      abbreviation: '',
    })
    setStateOpenDialogAddress(false)
    pushMessage(t('changeAddress'), 'success')
  }

  // react-hook-form
  const { handleSubmit } = useForm({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  const {
    handleSubmit: handleSubmitAddress,
    control: controlAddress,
    setValue: setValueAddress,
    reset,
    trigger: triggerAddress,
    getValues: getValuesAddress,
    formState: { errors: errorsAddress },
  } = useForm<{
    id?: number
    name: string
    receiver_name: string
    phone_number: string
    address: string
    city: string
    state: {
      name: string
      abbreviation: string
    }
    postal_zipcode: string
  }>({
    resolver: yupResolver(schemaAddress(t)),
    mode: 'all',
  })

  const updateAddress = (value: {
    id: number
    name: string
    receiver_name: string
    phone_number: string
    address: string
    city?: string
    state?: string
    postal_zipcode?: string
  }) => {
    setValueAddress('id', value.id)
    setValueAddress('name', value.name)
    setValueAddress('phone_number', formatPhoneNumber(value.phone_number))
    setValueAddress('receiver_name', value.receiver_name)
    setValueAddress('address', value.address)
    const filtered = dataState.find(
      (i: { abbreviation: string }) => i?.abbreviation === value?.state
    )
    setValueAddress('city', value.city ? value.city : '')
    setValueAddress('state', {
      name: filtered?.name ? filtered?.name : '',
      abbreviation: value.state ? value.state : '',
    })
    setValueInput({
      name: filtered?.name ? filtered?.name : '',
      abbreviation: value.state ? value.state : '',
    })
    setValueAddress(
      'postal_zipcode',
      value.postal_zipcode ? value.postal_zipcode : ''
    )
  }

  const handleCheckout = () => {
    dispatch(loadingActions.doLoading())
    const cartItem: number[] = JSON.parse(
      localStorage.getItem('listCartItemId') as string
    )
    console.log(cartItem)
    verifyCartItem(cartItem)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        handleDialog()
      })
      .catch((error) => {
        const { data } = error.response.data
        dispatch(loadingActions.doLoadingFailure())
        const invalidListItem: number[] = []
        data.forEach((item: invalidCartItemType) => {
          invalidListItem.push(item.productId)
          console.log(item.productId)
        })
        setTempInvalid(invalidListItem)
        pushMessage(t('invalidItemInOrder'), 'error')
      })
  }
  const handleConfirmCreateOrder = () => {
    if (!stateDefaultAddress) return
    const submitCreateOrder: RetailerCreateOrderType = {
      payment_method: 2,
      shipping_method: 1,
      address_name: stateDefaultAddress.name,
      recipient_name: stateDefaultAddress.receiver_name,
      phone_number: stateDefaultAddress.phone_number,
      address: stateDefaultAddress.address,
      city: stateDefaultAddress.city,
      state: stateDefaultAddress.state,
      postal_zipcode: stateDefaultAddress.postal_zipcode,
      items: stateListItemOfOrg,
    }
    // if (stateRadioIndex === 1) {
    //   createOrderV2(submitCreateOrder)
    //     .then((response) => {
    //       dispatch(loadingActions.doLoadingSuccess())
    //       pushMessage(t('orderSuccess'), 'success')
    //       console.log('response', response)
    //       dispatch(cartActions.doCart())
    //       // router.push('/order-success')
    //       setStateCheckoutCase(1)
    //       localStorage.setItem('order-success', 'true')
    //       localStorage.removeItem('listCartItemId')
    //     })
    //     .catch((response) => {
    //       dispatch(loadingActions.doLoadingFailure())
    //       const { status, data } = response
    //       pushMessage(handlerGetErrMessage(status, data), 'error')
    //     })
    // }

    createOrderV2(submitCreateOrder)
      .then((response) => {
        const { data } = response.data
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('orderSuccess'), 'success')
        // const listOrderId = data.map((item) => item.order_code).toString()
        const isAllPayLater = stateListCustomAmount.every(
          (item) => item.type === 'later'
        )
        if (isAllPayLater) {
          pushMessage('Create order success', 'success')
          dispatch(loadingActions.doLoadingSuccess())
          router.replace(`/retailer/market-place/purchase-orders/list`)
          return
        }
        const listOrderId: string[] = []
        const listOrderIdPartial: string[] = []
        console.log('stateListCustomAmount', stateListCustomAmount)
        stateListItemCheckoutV2.forEach((item, index) => {
          const foundIndexInListCustomAmount = stateListCustomAmount.findIndex(
            (obj) => obj.id === item.organization.id
          )
          console.log(
            'foundIndexInListCustomAmount',
            foundIndexInListCustomAmount
          )
          const foundIndexInListOfOrg = stateListItemOfOrg.findIndex(
            (obj) => obj.organization === item.organization.id
          )
          console.log('foundIndexOfOrg', foundIndexInListOfOrg)
          if (foundIndexInListCustomAmount >= 0) {
            if (
              stateListCustomAmount[foundIndexInListCustomAmount].type ===
              'custom'
            ) {
              const subtotal = item.items.reduce((prev, current) => {
                return Number(prev) + Number(current.subTotal)
              }, 0)

              if (
                stateListCustomAmount[foundIndexInListCustomAmount].amount <
                subtotal +
                  Number(stateListItemOfOrg[foundIndexInListOfOrg].shipping_fee)
              ) {
                listOrderIdPartial.push(
                  `${data[index].order_code}-${truncateToTwoDecimalPlaces(
                    stateListCustomAmount[foundIndexInListCustomAmount].amount
                  ).toFixed(2)}`
                )
                // console.log(
                //   `${data[index].order_code}-${stateListCustomAmount[foundIndexInListCustomAmount].amount}`
                // )
                // console.log('listOrderIdPartial', listOrderIdPartial)
                listOrderId.push(`${data[index].order_code}`)
              }
              if (
                stateListCustomAmount[foundIndexInListCustomAmount].amount ===
                subtotal +
                  Number(stateListItemOfOrg[foundIndexInListOfOrg].shipping_fee)
              ) {
                listOrderId.push(`${data[index].order_code}`)
              }

              // if(stateListCustomAmount[foundIndex].amount === item.)
            }
            if (
              stateListCustomAmount[foundIndexInListCustomAmount].type ===
              'full'
            ) {
              listOrderId.push(`${data[index].order_code}`)
            }
          } else {
            listOrderId.push(`${data[index].order_code}`)
          }
        })
        console.log('listOrderId', listOrderId)
        console.log('listOrderIdPartial', listOrderIdPartial)
        console.log('response', data)
        dispatch(cartActions.doCart())
        // router.push('/order-success')

        // setStateCheckoutCase(2)
        localStorage.setItem('order-success', 'true')
        localStorage.removeItem('listCartItemId')

        if (type === 'REVITPAY') {
          fetch(
            `https://api.sandbox.revitgate.com/api/v2/transactions/charge`,
            {
              method: 'POST',
              headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                Authorization:
                  'basic ' +
                  window.btoa('03jjMnOQiURCVMAIL4yNFTsDRkZiU2jp:223366'),
              },
              body: JSON.stringify({
                source: 'pm-' + selectCard?.id,
                amount: truncateToTwoDecimalPlaces(
                  stateCalculate.total - stateCalculate.remaining
                ),
                amount_details: {
                  tip: 0,
                },
                custom_fields: {
                  custom1: listOrderId.toString(),
                  custom2: 'WHOLESALE',
                  ...(listOrderIdPartial.length > 0 && {
                    custom3: listOrderIdPartial.toString(),
                  }),
                },
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
              pushMessage(t('makePaymentSuccess'), 'success')
              dispatch(loadingActions.doLoadingSuccess())
              router.replace(`/retailer/market-place/purchase-orders/list`)
            })
            .catch(({ response }) => {
              const { status, data } = response
              pushMessage(handlerGetErrMessage(status, data), 'error')
              dispatch(loadingActions.doLoadingFailure())
            })
        } else {
          fetch(
            `https://sandbox.api.mxmerchant.com/checkout/v3/payment?echo=false&includeCustomerMatches=false`,
            {
              method: 'POST',
              headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: 'Basic a2FpQGV4bm9kZXMudm46RXhub2RlczEyMyFAIw==',
              },
              body: JSON.stringify({
                online: listOrderId.toString(),
                ...(listOrderIdPartial.length > 0 && {
                  partially_paid: listOrderIdPartial.toString(),
                }),
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
              pushMessage(t('makePaymentSuccess'), 'success')
              dispatch(loadingActions.doLoadingSuccess())
              router.replace(`/retailer/market-place/purchase-orders/list`)
            })
            .catch(({ response }) => {
              const { status, data } = response
              pushMessage(handlerGetErrMessage(status, data), 'error')
              dispatch(loadingActions.doLoadingFailure())
            })
          // makeAPaymentWithOrder({
          //   order_ids: data,
          //   payment_token: selectCard?.token as string,
          // })
          //   .then(() => {
          //     pushMessage(t('makePaymentSuccess'), 'success')
          //     dispatch(loadingActions.doLoadingSuccess())
          //     router.replace(
          //       `/retailer/market-place/online-orders/detail/${data}`
          //     )
          //   })
          //   .catch(({ response }) => {
          //     const { status, data } = response
          //     pushMessage(handlerGetErrMessage(status, data), 'error')
          //     dispatch(loadingActions.doLoadingFailure())
          //   })
        }
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const onSubmit = () => {
    console.log('onsubmit')
    const isAllPayLater = stateListCustomAmount.every(
      (item) => item.type === 'later'
    )
    console.log('stateListCustomAmount', stateListCustomAmount)
    if (!isAllPayLater && !selectCard) {
      pushMessage(`Please select card for checkout`, 'error')
      return
    }
    const result = stateListItemOfOrg.every((item) => {
      if (
        !item.service_shipping ||
        !item.carrier ||
        !item.shipping_fee ||
        !item.weight
      )
        return false
      const foundIndexInCustomAmount = stateListCustomAmount.findIndex(
        (obj) => obj.id === item.organization
      )
      const foundIndexInList = stateListItemCheckoutV2.findIndex(
        (obj) => obj.organization.id === item.organization
      )

      if (foundIndexInCustomAmount >= 0) {
        if (
          stateListCustomAmount[foundIndexInCustomAmount].type === 'custom' &&
          stateListCustomAmount[foundIndexInCustomAmount].amount < 1
        ) {
          return false
        }
        let temporaryAmount = 0
        if (foundIndexInList >= 0) {
          temporaryAmount = stateListItemCheckoutV2[
            foundIndexInList
          ].items.reduce((prev, current) => {
            return truncateToTwoDecimalPlaces(
              Number(prev) + Number(current.subTotal)
            )
          }, 0)
          if (
            stateListCustomAmount[foundIndexInCustomAmount].type === 'custom' &&
            stateListCustomAmount[foundIndexInCustomAmount].amount >
              temporaryAmount
          ) {
            return false
          }
        }
      }
      return true
    })
    if (!result) {
      pushMessage(t('checkOrderAgain'), 'error')
      return
    }

    handleCheckout()
  }

  const onSubmitAddress = (values: {
    id?: number
    name: string
    receiver_name: string
    phone_number: string
    address: string
    city: string
    state: {
      name: string
      abbreviation: string
    }
    postal_zipcode: string
  }) => {
    values.phone_number = values.phone_number.replace(/\D/g, '')
    console.log('valueSubmit', values)
    dispatch(loadingActions.doLoading())
    if (stateDialogAddress === 'create') {
      createAddressBookAPI({
        ...values,
        state: values?.state?.abbreviation,
      })
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('createAddressSuccess'), 'success')
          getDataAddressBook()
          setStateDialogAddress('default')
          reset({
            name: '',
            phone_number: '',
            address: '',
            receiver_name: '',
            city: '',
            state: {
              name: '',
              abbreviation: '',
            },
            postal_zipcode: '',
          })
          setValueInput({
            name: '',
            abbreviation: '',
          })
          setHasMore(true)
          setPage(2)
        })
        .catch((response) => {
          const { status, data } = response.response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    if (stateDialogAddress === 'update') {
      updateAddressBook(Number(getValuesAddress('id')), {
        ...values,
        state: values?.state?.abbreviation,
      })
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('updateAddressSuccess'), 'success')
          getDataAddressBook()
          setStateDialogAddress('default')
          reset({
            name: '',
            phone_number: '',
            address: '',
            receiver_name: '',
            city: '',
            state: {
              name: '',
              abbreviation: '',
            },
            postal_zipcode: '',
          })
          setValueInput({
            name: '',
            abbreviation: '',
          })
          setHasMore(true)
          setPage(2)
        })
        .catch((response) => {
          const { status, data } = response.response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  useEffect(() => {
    if (!type || type === 'REVITPAY') return
    //priority
    getListCard()
      .then((res) => {
        const { data } = res.data
        setSelectCard(data.records.filter((item) => item.isDefault)[0])
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }, [type, dispatch])

  useEffect(() => {
    getDataAddressBook()
    const cartItem: number[] = JSON.parse(
      localStorage.getItem('listCartItemId') as string
    )

    // check if local storage is empty => redirect to page cart
    if (!cartItem || localStorage.getItem('order-success') === 'false') {
      router.push('/retailer/market-place/cart')
    }

    getItemForCheckoutV2(cartItem)
      .then((res) => {
        const { data } = res.data
        setStateListItemCheckoutV2(data)
        const temporaryGroupProduct: CartItemGroupingByOrganizationType[] = []
        data.forEach((item) => {
          item.items.forEach((obj) => {
            temporaryGroupProduct.push(obj)
          })
        })
        setStateGroupProduct(temporaryGroupProduct)
        const ListItemForCheckoutV2: ListCartItemGroupByOrgType[] = []
        data.forEach((item) => {
          const itemForCheckoutV2: ListCartItemGroupByOrgType = {
            organization: item.organization.id,
            cartItemIds: item.items.map((obj) => obj.cartItemId),
          }
          ListItemForCheckoutV2.push(itemForCheckoutV2)
        })

        // group product

        setStateListItemOfOrg(ListItemForCheckoutV2)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    // clean up
    return () => {
      // localStorage.removeItem('listCartItemId')
      console.log('effect')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router])

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
  const handleCheckItemIsInvalid = (id: number) => {
    return tempInvalid.some((item) => item === id)
  }
  const handleChangeShippingMethod = (value: PropDataType, index: number) => {
    const cloneCurrentListItemOfOrg: ListCartItemGroupByOrgType[] = JSON.parse(
      JSON.stringify(stateListItemOfOrg)
    )
    cloneCurrentListItemOfOrg[index] = {
      ...cloneCurrentListItemOfOrg[index],
      service_shipping: value.value,
      shipping_fee: value.shippingFee,
      weight: Number(value.weight.toFixed(2)),
      carrier: value.carrier_id,
      notes: value.notes,
    }
    setStateListItemOfOrg(cloneCurrentListItemOfOrg)
  }
  useEffect(() => {
    if (!stateListItemOfOrg || !stateListItemCheckoutV2) return

    const cloneCurrentListItemOfOrg: ListCartItemGroupByOrgType[] = JSON.parse(
      JSON.stringify(stateListItemOfOrg)
    )

    const cloneCurrentListItemCheckoutV2: ListItemCheckoutType[] = JSON.parse(
      JSON.stringify(stateListItemCheckoutV2)
    )

    const totalShipping: number = cloneCurrentListItemOfOrg.reduce(
      (prev, current) => {
        if (!current.shipping_fee) return Number(prev) + 0
        return Number(prev) + Number(current.shipping_fee)
      },
      0
    )
    const subTotal = cloneCurrentListItemCheckoutV2.reduce((prev, current) => {
      return (
        Number(prev) +
        Number(
          current.items.reduce((previous, prod) => {
            return Number(previous) + Number(prod.subTotal)
          }, 0)
        )
      )
    }, 0)

    console.log('total shipping', totalShipping)
    console.log('subtotal', subTotal)
    setStateCalculate((prev) => ({
      ...prev,
      sub_total: truncateToTwoDecimalPlaces(Number(subTotal)),
      delivery_fee: truncateToTwoDecimalPlaces(Number(totalShipping)),
      total: truncateToTwoDecimalPlaces(Number(totalShipping + subTotal)),
    }))
  }, [stateListItemCheckoutV2, stateListItemOfOrg])

  useEffect(() => {
    const cloneListItemCheckoutV2: ListItemCheckoutType[] = JSON.parse(
      JSON.stringify(stateListItemCheckoutV2)
    )
    if (!stateCalculate.total) return
    let remaining = 0

    const cloneListAmount: { id: number; amount: number }[] = JSON.parse(
      JSON.stringify(stateListCustomAmount)
    )
    cloneListItemCheckoutV2.forEach((item) => {
      const foundIndex = stateListItemOfOrg.findIndex(
        (obj) => obj.organization === item.organization.id
      )

      if (foundIndex >= 0) {
        if (item.payment_term.delay_payment) {
          const index = cloneListAmount.findIndex(
            (obj) => obj.id === item.organization.id
          )
          if (index >= 0) {
            remaining += Number(cloneListAmount[index].amount)
              ? cloneListAmount[index].amount
              : 0
            console.log('remaining after have delay payment', remaining)
          }
        }
        if (!item.payment_term.delay_payment) {
          if (stateListItemOfOrg[foundIndex].shipping_fee) {
            remaining += Number(stateListItemOfOrg[foundIndex].shipping_fee)
          }
          console.log('remaining after plus shuooubg ', remaining)

          const tempTotal = item.items.reduce((prev, current) => {
            return Number(prev) + Number(current.subTotal)
          }, 0)
          console.log('temptotal', tempTotal)
          console.log('remaining after plus temptotal ', remaining)

          remaining += tempTotal
        }
        // if (!item.payment_term.delay_payment) {
        //   if (Number(stateListItemOfOrg[foundIndex].shipping_fee)) {
        //     console.log(
        //       'Number(stateListItemOfOrg[foundIndex].shipping_fee)',
        //       Number(stateListItemOfOrg[foundIndex].shipping_fee)
        //     )
        //     remaining -= Number(stateListItemOfOrg[foundIndex].shipping_fee)
        //   }
        // }

        // console.log('temptotal', tempTotal)
        // remaining -= tempTotal
      }

      // if(!item.payment_term.delay_payment){
      //   remaining -= item.items.
      // }
    })
    console.log('tateCalculate.total)', stateCalculate.total)
    console.log('stateCal remaining', remaining)
    remaining = stateCalculate.total * 100 - remaining * 100
    console.log('remaing', remaining)
    setStateCalculate((prev) => ({
      ...prev,
      remaining: truncateToTwoDecimalPlaces(remaining / 100),
    }))
  }, [
    stateCalculate?.total,
    stateListCustomAmount,
    stateListItemCheckoutV2,
    stateListItemOfOrg,
  ])
  const handleChangeAcceptTerm = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateAcceptTerm(event.target.checked)
  }
  return (
    <ContextCart.Provider
      value={{
        stateListCustomAmount,
        setStateListCustomAmount,
      }}
    >
      {/* {stateCheckoutCase === 1 && <CheckoutSuccess />} */}

      {
        <div>
          <Head>
            <title>{t('checkout')} | TWSS</title>
          </Head>
          <TypographyH1 variant="h1" mb={3}>
            {t('shoppingCart')}
          </TypographyH1>
          <Breadcrumbs
            separator=">"
            aria-label="breadcrumb"
            sx={{ marginBottom: '15px' }}
          >
            <Link href="/">
              <a style={{ color: '#2F6FED', fontSize: '1.4rem' }}>
                {t('marketplace')}
              </a>
            </Link>
            <Link href="/retailer/market-place/cart">
              <a style={{ color: '#2F6FED', fontSize: '1.4rem' }}>
                {t('shoppingCart')}
              </a>
            </Link>
            <Link href="/retailer/market-place/checkout">
              <a style={{ fontSize: '1.4rem' }}>{t('checkout')}</a>
            </Link>
          </Breadcrumbs>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardPage>
              <Grid container spacing={2}>
                <Grid xs={8}>
                  <Box mb={2}>
                    <CardCustom>
                      <CardHeaderCustom
                        avatar={
                          <MapPinLine
                            size={20}
                            style={{ color: theme.palette.primary.main }}
                          />
                        }
                        title={
                          <Typography
                            sx={{
                              fontWeight: '500',
                              fontSize: '16px',
                            }}
                          >
                            {t('shippingAddress')}
                          </Typography>
                        }
                      />
                      <CardContentCustom>
                        <Stack direction="row" spacing={2}>
                          <Typography
                            sx={{
                              color: '#49516F',
                              fontWeight: '400',
                              fontSize: '1.6rem',
                            }}
                          >
                            {stateDefaultAddress ? (
                              <>
                                <span
                                  style={{
                                    fontWeight: '600',
                                    color: '#1B1F27',
                                  }}
                                >
                                  {stateDefaultAddress?.name} -{' '}
                                </span>
                                {stateDefaultAddress?.receiver_name} -{' '}
                                {formatPhoneNumber(
                                  `${stateDefaultAddress?.phone_number}`
                                )}{' '}
                                - {stateDefaultAddress?.address}
                              </>
                            ) : (
                              <>{t('pleaseCreateAddress')}</>
                            )}
                          </Typography>
                          <Typography
                            sx={{
                              color: '#2F6FED',
                              textDecoration: 'underline',
                              fontSize: '1.6rem',
                              '&:hover': {
                                cursor: 'pointer',
                                opacity: '0.8',
                              },
                              textAlign: 'right',
                              paddingRight: '15px',
                            }}
                            onClick={() => {
                              if (!stateDefaultAddress) {
                                handleOpenCreateAddress()
                              } else {
                                handleDialogAddress()
                              }
                            }}
                          >
                            {stateDefaultAddress ? (
                              <>{t('change')}</>
                            ) : (
                              <>{t('createAddress')}</>
                            )}
                            <PencilSimpleLine
                              size={18}
                              style={{
                                marginLeft: '5px',
                                position: 'relative',
                                top: '5px',
                              }}
                            />
                          </Typography>
                        </Stack>
                      </CardContentCustom>
                    </CardCustom>
                  </Box>
                  {/*  Group by Product */}

                  <Box mb={2}>
                    <CardCustom>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ padding: '16px', paddingBottom: '0px' }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <ShoppingCart
                            size={20}
                            style={{ color: theme.palette.primary.main }}
                          />
                          <Typography
                            sx={{
                              fontWeight: '500',
                              fontSize: '16px',
                            }}
                          >
                            Cart
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography>Group by</Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{
                              backgroundColor: '#F1F3F9',
                              borderRadius: '30px',
                              padding: '3px',
                            }}
                          >
                            <Typography
                              sx={{
                                padding: '5px 10px',
                                backgroundColor: stateSwitchGroup
                                  ? '#F1F3F9'
                                  : '#ffffff',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                ...(stateSwitchGroup && {
                                  color: '#BABABA',
                                  '&:hover': {
                                    color: 'rgba(0, 0, 0, 0.87)',
                                  },
                                }),
                              }}
                              onClick={() => setStateSwitchGroup(false)}
                            >
                              Product
                            </Typography>
                            <Typography
                              sx={{
                                padding: '5px 10px',
                                backgroundColor: stateSwitchGroup
                                  ? '#ffffff'
                                  : '#F1F3F9',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                ...(!stateSwitchGroup && {
                                  color: '#BABABA',
                                  '&:hover': {
                                    color: 'rgba(0, 0, 0, 0.87)',
                                  },
                                }),
                              }}
                              onClick={() => setStateSwitchGroup(true)}
                            >
                              Store
                            </Typography>
                          </Stack>
                          {/* <Switch
                            checked={stateSwitchGroup}
                            onChange={handleChangeSwitchGroup}
                          /> */}
                          {/* <SwitchCustom defaultChecked /> */}
                        </Stack>
                      </Stack>
                      <CardContentCustom>
                        {!stateSwitchGroup && (
                          <TableContainerTws>
                            <Table>
                              <TableHead>
                                <TableRow>
                                  <TableCellTws>Product</TableCellTws>
                                  <TableCellTws align="right">Qty</TableCellTws>
                                  <TableCellTws align="right">
                                    Price
                                  </TableCellTws>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {stateGroupProduct.map((item, index) => {
                                  return (
                                    <TableRowTws key={index}>
                                      <TableCellTws>
                                        <Stack
                                          direction="row"
                                          alignItems="center"
                                          spacing={2}
                                        >
                                          <div
                                            className={classes['image-wrapper']}
                                          >
                                            <Link
                                              href={`/retailer/market-place/product-detail/${item?.product.id}?variant=${item.productId}`}
                                            >
                                              <a>
                                                <Image
                                                  src={
                                                    item.productThumbnail
                                                      ? item.productThumbnail
                                                      : '/' +
                                                        '/images/vapeProduct.png'
                                                  }
                                                  alt="product"
                                                  width={50}
                                                  height={50}
                                                />
                                              </a>
                                            </Link>
                                          </div>

                                          <Stack spacing={1}>
                                            <Typography>
                                              #{item.productCode} |{' '}
                                              {item.productName}
                                            </Typography>
                                            {item.attribute_options && (
                                              <Stack
                                                direction="row"
                                                spacing={1}
                                              >
                                                {item.attribute_options.map(
                                                  (att, idx) => {
                                                    return (
                                                      <Stack
                                                        direction="row"
                                                        key={idx}
                                                        spacing={1}
                                                      >
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
                                                  }
                                                )}
                                              </Stack>
                                            )}
                                          </Stack>
                                        </Stack>
                                      </TableCellTws>
                                      <TableCellTws align="right">
                                        {item.quantity}
                                      </TableCellTws>
                                      <TableCellTws align="right">
                                        {formatMoney(item.subTotal)}
                                      </TableCellTws>
                                    </TableRowTws>
                                  )
                                })}
                              </TableBody>
                            </Table>
                          </TableContainerTws>
                        )}

                        {stateListItemCheckoutV2.map((item, index) => {
                          return (
                            <ProductOfOrganization
                              product={item}
                              key={index}
                              groupByStore={stateSwitchGroup}
                              handleCheckItemIsInValid={
                                handleCheckItemIsInvalid
                              }
                              currentAddress={stateDefaultAddress}
                              handleChangeShippingMethod={(value) =>
                                handleChangeShippingMethod(value, index)
                              }
                            />
                          )
                        })}
                      </CardContentCustom>
                    </CardCustom>
                  </Box>

                  <Dialog open={openDialog} onClose={handleDialog}>
                    <DialogTitleTws>
                      <IconButton onClick={handleDialog}>
                        <X size={20} />
                      </IconButton>
                    </DialogTitleTws>
                    <TypographyH2
                      sx={{ fontSize: '2.4rem' }}
                      alignSelf="center"
                    >
                      {t('confirmation')}
                    </TypographyH2>
                    <DialogContentTws>
                      <DialogContentTextTws>
                        {t('confirmPlaceOrder')}
                      </DialogContentTextTws>
                    </DialogContentTws>
                    <DialogActionsTws>
                      <Stack spacing={2} direction="row">
                        <ButtonCancel
                          onClick={handleDialog}
                          variant="outlined"
                          size="large"
                        >
                          {t('cancel')}
                        </ButtonCancel>
                        <ButtonCustom
                          variant="contained"
                          size="large"
                          onClick={handleConfirmCreateOrder}
                        >
                          {t('confirm')}
                        </ButtonCustom>
                      </Stack>
                    </DialogActionsTws>
                  </Dialog>
                </Grid>

                {/* Payment summary */}
                <Grid xs={4}>
                  <Box>
                    <Box mb={2}>
                      <CardCustom>
                        <CardContentCustom>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            sx={{ padding: 0 }}
                          >
                            <CurrencyCircleDollar
                              size={20}
                              style={{ color: theme.palette.primary.main }}
                            />
                            <Typography
                              sx={{
                                fontWeight: '500',
                                fontSize: '16px',
                              }}
                            >
                              {t('paymentMethod')}:
                            </Typography>
                          </Stack>
                          {/* <Stack direction="row" alignItems="center" spacing={4}>
                          <FormControl>
                            <RadioGroup
                              name="payment_method"
                              row
                              value={stateRadioIndex}
                            >
                              {t('paymentMethod')}:
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={4}
                          >
                            <FormControl>
                              <RadioGroup
                                name="payment_method"
                                row
                                value={stateRadioIndex}
                              >
                                {PaymentMethodList.map((item) => {
                                  if (Number(stateRadioIndex) === item.id) {
                                    return (
                                      <FormControlLabelCustom
                                        key={item.id}
                                        value={item.id}
                                        control={
                                          <ButtonCheckboxCustom
                                            size="large"
                                            variant="outlined"
                                            onClick={handleChangeRadioButton}
                                          >
                                            {item.method}
                                          </ButtonCheckboxCustom>
                                        }
                                        label={<Check size={10} />}
                                      />
                                    )
                                  }
                                  return (
                                    <FormControlLabel
                                      key={item.id}
                                      value={item.id}
                                      control={
                                        <ButtonCheckboxCustom
                                          size="large"
                                          // variant="outlined"
                                          sx={{
                                            color: '#49516F',
                                            opacity: 0.5,
                                          }}
                                          onClick={handleChangeRadioButton}
                                        >
                                          {item.method}
                                        </ButtonCheckboxCustom>
                                      }
                                      label={<></>}
                                    />
                                  )
                                })}
                              </RadioGroup>
                            </FormControl>
                          </Stack>
                          {stateRadioIndex === 2 && selectCard && (
                            <Stack
                              mt={2}
                              sx={{
                                border: '1px solid #53D1B6',
                                borderRadius: '10px',
                                padding: '22px',
                              }}
                              direction="row"
                              alignItems={'center'}
                              justifyContent={'space-between'}
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
                                      `/images/${renderLogoCreditCard(
                                        selectCard.cardType
                                      )}`
                                    }
                                    alt="Logo"
                                    width="40"
                                    height="30"
                                  />
                                )
                              })}
                            </RadioGroup>
                          </FormControl>
                        </Stack> */}
                          {selectCard && type !== 'REVITPAY' && (
                            <Stack
                              mt={2}
                              sx={{
                                border: '1px solid #53D1B6',
                                borderRadius: '10px',
                                padding: '22px',
                              }}
                              direction="row"
                              alignItems={'center'}
                              justifyContent={'space-between'}
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
                                      `/images/${renderLogoCreditCard(
                                        selectCard.cardType
                                      )}`
                                    }
                                    alt="Logo"
                                    width="40"
                                    height="30"
                                  />
                                  <Box>
                                    <Stack
                                      direction="row"
                                      alignItems={'center'}
                                      gap={1}
                                    >
                                      <Typography
                                        sx={{
                                          color: '#595959',
                                          fontWeight: '400',
                                          fontSize: '1.6rem',
                                        }}
                                      >
                                        {t('expire')}: {selectCard?.expiryMonth}
                                        /{selectCard?.expiryYear}
                                      </Typography>
                                      {selectCard?.isDefault && (
                                        <Box
                                          sx={{
                                            borderRadius: '10px',
                                            backgroundColor: '#53D1B6',
                                            padding: '5px 10px',
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              color: '#fff',
                                              fontWeight: 600,
                                              fontSize: '1.2rem',
                                              padding: 0,
                                            }}
                                          >
                                            DEFAULT
                                          </Typography>
                                        </Box>
                                      )}
                                    </Stack>
                                    <Typography
                                      sx={{
                                        color: '#595959',
                                        fontWeight: '400',
                                        fontSize: '1.6rem',
                                      }}
                                    >
                                      {t('expire')}: {selectCard?.expiryMonth}/
                                      {selectCard?.expiryYear}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Box>
                              <ButtonCustom
                                variant="outlined"
                                size="large"
                                onClick={() => setOpenCreditCards(true)}
                              >
                                {t('change')}
                              </ButtonCustom>
                            </Stack>
                          )}
                          {selectCard && type === 'REVITPAY' ? (
                            <Stack
                              mt={2}
                              sx={{
                                border: '1px solid #E1E6EF',
                                borderRadius: '10px',
                                padding: '15px 20px',
                              }}
                              direction="row"
                              alignItems={'center'}
                              justifyContent={'space-between'}
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
                                      `/images/${renderLogoCreditCard(
                                        selectCard.card_type as string
                                      )}`
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
                                    **** **** **** **** {selectCard?.last4}
                                  </Typography>
                                </Stack>
                              </Box>
                              <IconButton
                                onClick={() => setOpenCreditCards(true)}
                              >
                                <CaretRight size={20} weight="bold" />
                              </IconButton>
                            </Stack>
                          ) : (
                            <ButtonCustom
                              sx={{ marginTop: '10px' }}
                              variant="outlined"
                              size="large"
                              onClick={() => setOpenCreditCards(true)}
                            >
                              Select card
                            </ButtonCustom>
                          )}
                        </CardContentCustom>
                      </CardCustom>
                    </Box>

                    {/* //! todo */}
                    {stateListItemCheckoutV2.map((item, index) => {
                      // calculate subtotal
                      const subTotal = item.items.reduce((prev, product) => {
                        return Number(prev) + Number(product.subTotal)
                      }, 0)
                      const foundIndex = stateListItemOfOrg.findIndex(
                        (org) => org.organization === item.organization.id
                      )

                      // calculate shipping fee
                      let shippingFee = 0
                      if (foundIndex >= 0) {
                        shippingFee = stateListItemOfOrg[foundIndex]
                          .shipping_fee
                          ? Number(stateListItemOfOrg[foundIndex].shipping_fee)
                          : 0
                      }
                      // found index payment custom
                      const indexForCustom = stateListCustomAmount.findIndex(
                        (obj) => obj.id === item.organization.id
                      )
                      return (
                        <Box
                          p={2}
                          sx={{ background: '#F8F9FC' }}
                          mb={1}
                          key={index}
                        >
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            mb={1}
                          >
                            <Avatar
                              src={item.organization.logo}
                              alt={item.organization.name}
                            />
                            <Typography>{item.organization.name}</Typography>
                          </Stack>
                          <Stack spacing={1}>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography>Subtotal</Typography>
                              <Typography>
                                {formatMoney(
                                  truncateToTwoDecimalPlaces(subTotal)
                                )}
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography>Shipping fee</Typography>
                              <Typography>
                                {formatMoney(
                                  truncateToTwoDecimalPlaces(shippingFee)
                                )}
                              </Typography>
                            </Stack>
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                            >
                              <Typography
                                sx={{ fontWeight: 600, color: '#0A0D14' }}
                              >
                                Total
                              </Typography>

                              <Stack direction="row" spacing={2}>
                                {stateListCustomAmount.length > 0 &&
                                indexForCustom >= 0 ? (
                                  <Box
                                    sx={{
                                      padding: '2px 10px',
                                      border: '1px solid #1DB46A',
                                      borderRadius: '15px',
                                    }}
                                  >
                                    <Typography sx={{ color: '#1DB46A' }}>
                                      Pay{' '}
                                      {formatMoney(
                                        truncateToTwoDecimalPlaces(
                                          stateListCustomAmount[indexForCustom]
                                            .amount
                                        )
                                      )}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box
                                    sx={{
                                      padding: '2px 10px',
                                      border: '1px solid #000',
                                      borderRadius: '15px',
                                    }}
                                  >
                                    <Typography>Pay now</Typography>
                                  </Box>
                                )}

                                <Typography
                                  sx={{
                                    fontWeight: 500,
                                    color: '#1DB46A',
                                    fontSize: '1.6rem',
                                  }}
                                >
                                  {formatMoney(
                                    truncateToTwoDecimalPlaces(
                                      subTotal + shippingFee
                                    )
                                  )}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Stack>
                        </Box>
                      )
                    })}
                    <Box mb={2}>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        mb={1}
                      >
                        <TypographyTotal>{t('total')}:</TypographyTotal>
                        <TypographyTotal>
                          {formatMoney(
                            truncateToTwoDecimalPlaces(stateCalculate?.total)
                          )}
                        </TypographyTotal>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        mb={1}
                      >
                        <Typography>Remaining</Typography>
                        <Typography>
                          {/* {formatMoney(
                          stateCalculate?.total -
                            stateListCustomAmount.reduce((prev, current) => {
                              return Number(prev) + Number(current.amount)
                            }, 0)
                        )} */}
                          {formatMoney(
                            stateCalculate.remaining > 0
                              ? truncateToTwoDecimalPlaces(
                                  stateCalculate.remaining
                                )
                              : 0
                          )}
                        </Typography>
                      </Stack>
                    </Box>
                    <Box mb={2}>
                      <Stack direction="row" spacing={2}>
                        <Checkbox
                          checked={stateAcceptTerm}
                          onChange={handleChangeAcceptTerm}
                          inputProps={{ 'aria-label': 'controlled' }}
                        />
                        <Typography>
                          For each store you have purchased, you will receive
                          individual invoices, receipts, and transaction
                          records.
                        </Typography>
                      </Stack>
                    </Box>
                    <ButtonCustom
                      variant="contained"
                      disabled={!stateAcceptTerm}
                      sx={{ width: '100%' }}
                      size="large"
                      type="submit"
                    >
                      {t('checkout')}
                    </ButtonCustom>
                    <Box pl={2} pr={2} mb={5}>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{
                          borderTop: '1px solid #E1E6EF',
                          paddingTop: '16px',
                        }}
                      >
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <WarningCircle
                            size={20}
                            style={{ color: theme.palette.error.main }}
                          />
                          <Typography sx={{ fontWeight: '500' }}>
                            {t('clickTerm')}{' '}
                            <Link href="https://twssolutions.us/term-condition/">
                              <a
                                style={{
                                  color: '#2F6FED',
                                }}
                              >
                                {t('term')}
                              </a>
                            </Link>{' '}
                            {t('ofTWSSolutions')}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardPage>
          </form>
        </div>
      }
      <Drawer
        anchor="right"
        open={stateOpenDialogAddress}
        onClose={handleCloseDialog}
      >
        <DialogTitleTws
          sx={{
            justifyContent: 'space-between',
            padding: '25px 30px',
            fontSize: '2.4rem',
            fontWeight: 700,
            color: '#49516F',
          }}
        >
          <Stack direction="row">
            {stateDialogAddress !== 'default' ? (
              <IconButton onClick={handleBackToDefaultDialog}>
                <ArrowLeft size={24} />
              </IconButton>
            ) : (
              <IconButton onClick={handleCloseDialog}>
                <ArrowRight size={24} />
              </IconButton>
            )}
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {stateDialogAddress === 'default' ? (
                <>{t('addressBook')}</>
              ) : stateDialogAddress === 'create' ? (
                <>{t('createAddress')}</>
              ) : (
                <>{t('updateAddress')}</>
              )}
            </TypographyH2>
          </Stack>
        </DialogTitleTws>

        {stateDialogAddress === 'default' ? (
          <>
            <DialogContentTws
              sx={{
                padding: '0 20px',
                justifyItems: 'center',
                width: '100%',
                marginBottom: '20px',
              }}
            >
              <DialogContentTextTws />
              <InfiniteScroll
                dataLength={stateListAddress?.data.length}
                next={fetchMoreData}
                hasMore={hasMore}
                height="calc(100vh - 237px)"
                loader={
                  <LinearProgress
                    style={{
                      marginBottom: '20px',
                      width: '100%',
                    }}
                  />
                }
              >
                {stateListAddress?.data?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      borderRadius: '10px',
                      padding: '15px',
                      backgroundColor: '#F8F9FC',
                    }}
                    mb={2}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Radio
                          checked={stateSelectedValue === item.id}
                          onChange={() => handleChangeRadio(item)}
                          value={item.id}
                          name={item.name}
                          inputProps={{ 'aria-label': item.name }}
                          color="primary"
                          sx={{
                            color: theme.palette.primary.main,
                            padding: '0px',
                          }}
                        />
                        <Typography
                          textAlign="center"
                          sx={{
                            fontSize: '1.6rem',
                            color: '#3F444D',
                            alignItems: 'center',
                          }}
                        >
                          {' '}
                          {item.name}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        // sx={{ marginBottom: '15px' }}
                      >
                        {item.default_address ? (
                          <>
                            <CircleWavyCheck
                              color={theme.palette.primary.main}
                              size={24}
                              weight="duotone"
                            />
                            <ButtonCustom
                              variant="contained"
                              size="small"
                              sx={{
                                fontSize: '1.4rem',
                                gap: '8px',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                height: '25px',
                              }}
                            >
                              {t('default')}
                            </ButtonCustom>
                          </>
                        ) : (
                          <></>
                        )}
                        <IconButton
                          onClick={() => (
                            updateAddress(item), setStateDialogAddress('update')
                          )}
                        >
                          <NotePencil
                            size={24}
                            color="#49516F"
                            weight="duotone"
                          />
                        </IconButton>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ padding: '15px 0px' }}
                      alignItems="center"
                    >
                      <Typography sx={{ color: '#3F444D', fontWeight: '400' }}>
                        {item.receiver_name}
                      </Typography>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{
                          // height: '1.4rem',
                          marginTop: '3px !important',
                          marginBottom: '3px !important',
                          borderColor: '#3F444D',
                          border: '1px line #3F444D',
                        }}
                      />
                      <Typography
                        sx={{
                          color: '#3F444D',
                          fontWeight: '400',
                          fontSize: '1.4rem',
                        }}
                      >
                        {formatPhoneNumber(item.phone_number)}
                      </Typography>
                    </Stack>
                    <Typography sx={{ color: '#3F444D', fontWeight: '400' }}>
                      {item.address}
                    </Typography>
                  </Box>
                ))}
              </InfiniteScroll>

              <Grid xs={12} spacing={2}>
                <Button
                  sx={{
                    border: `1px dashed ${theme.palette.primary.main}`,
                    borderRadius: '10px',
                    // marginBottom: '35px',
                    alignItems: 'center',
                    height: '50px',
                    width: '100%',
                    backgroundColor: '#F8F9FC',
                    justifyContent: 'space-between',
                  }}
                  onClick={() => setStateDialogAddress('create')}
                >
                  <Typography
                    sx={{
                      fontSize: '1.6rem',
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    {' '}
                    {t('addNewAddress')}
                  </Typography>
                  <PlusCircle size={25} color={theme.palette.primary.main} />
                </Button>
              </Grid>
            </DialogContentTws>
            <DialogActionsTws sx={{ padding: '0 30px 25px 30px' }}>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="flex-end"
                sx={{ width: '100%' }}
              >
                <ButtonCancel
                  onClick={handleCloseDialog}
                  variant="outlined"
                  size="large"
                >
                  {t('cancel')}
                </ButtonCancel>
                <ButtonCustom
                  variant="contained"
                  disabled={stateListAddress?.data?.length === 0}
                  onClick={() => handleConfirmAddress()}
                  size="large"
                >
                  {t('confirm')}
                </ButtonCustom>
              </Stack>
            </DialogActionsTws>
          </>
        ) : stateDialogAddress === 'create' ||
          stateDialogAddress === 'update' ? (
          <>
            <DialogContentTws
              sx={{
                padding: '0 30px',
                justifyItems: 'center',
                width: '100%',
                // marginBottom: '20px',
              }}
            >
              <form onSubmit={handleSubmitAddress(onSubmitAddress)}>
                <Stack
                  sx={{
                    width: '100%',
                    borderRadius: '10px',
                    marginBottom: '35px',
                  }}
                  spacing={2}
                >
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="name"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="name"
                            error={!!errorsAddress.name}
                          >
                            <RequiredLabel />
                            {t('addressName')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              placeholder={t('placeholderAddressName')}
                              id="name"
                              error={!!errorsAddress.name}
                              {...field}
                            />
                            <FormHelperText error={!!errorsAddress.name}>
                              {errorsAddress.name &&
                                `${errorsAddress.name.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="receiver_name"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="receiver_name"
                            error={!!errorsAddress.receiver_name}
                          >
                            <RequiredLabel />
                            {t('receiverName')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              placeholder={t('placeholderReceiverName')}
                              id="receiver_name"
                              error={!!errorsAddress.receiver_name}
                              {...field}
                            />
                            <FormHelperText
                              error={!!errorsAddress.receiver_name}
                            >
                              {errorsAddress.receiver_name &&
                                `${errorsAddress.receiver_name.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="phone_number"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="phone_number"
                            error={!!errorsAddress.phone_number}
                          >
                            <RequiredLabel />
                            {t('phoneNumber')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <div className="input-number">
                              <PatternFormat
                                placeholder="(xxx) xxx xxxx "
                                id="phone_number"
                                customInput={TextField}
                                {...field}
                                error={!!errorsAddress.phone_number}
                                format="(###) ### ####"
                              />
                            </div>
                            <FormHelperText
                              error={!!errorsAddress.phone_number}
                            >
                              {errorsAddress.phone_number &&
                                `${errorsAddress.phone_number.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="address"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="address"
                            error={!!errorsAddress.address}
                          >
                            <RequiredLabel />
                            {t('address')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              placeholder={t('placeholderAddress')}
                              id="address"
                              multiline
                              rows={6}
                              error={!!errorsAddress.address}
                              {...field}
                            />
                            <FormHelperText error={!!errorsAddress.address}>
                              {errorsAddress.address &&
                                `${errorsAddress.address.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="city"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="city"
                            error={!!errorsAddress.city}
                          >
                            <RequiredLabel />
                            {t('city')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="city"
                              error={!!errorsAddress.city}
                              {...field}
                            />
                            <FormHelperText error={!!errorsAddress.city}>
                              {errorsAddress.city &&
                                `${errorsAddress.city.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="state"
                      render={() => (
                        <>
                          <InputLabelCustom
                            htmlFor="state"
                            error={!!errorsAddress.state?.name}
                          >
                            <RequiredLabel />
                            {t('state')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <Autocomplete
                              getOptionLabel={(option) => option.name}
                              options={dataState}
                              value={valueInput}
                              renderInput={(params) => (
                                <TextFieldCustom
                                  error={!!errorsAddress.state?.name}
                                  {...(params as any)}
                                />
                              )}
                              onChange={(_, newValue) => {
                                if (newValue) {
                                  setValueAddress('state', newValue)
                                  setValueInput(newValue)
                                } else {
                                  setValueAddress('state', {
                                    name: '',
                                    abbreviation: '',
                                  })
                                  setValueInput({
                                    name: '',
                                    abbreviation: '',
                                  })
                                }
                                triggerAddress('state')
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root .MuiAutocomplete-input':
                                  {
                                    padding: '1px 5px',
                                  },
                              }}
                            />
                            <FormHelperText error={!!errorsAddress.state?.name}>
                              {errorsAddress.state?.name &&
                                `${errorsAddress.state?.name?.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="postal_zipcode"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="postal_zipcode"
                            error={!!errorsAddress.postal_zipcode}
                          >
                            <RequiredLabel />
                            {t('postalZipcode')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="postal_zipcode"
                              error={!!errorsAddress.postal_zipcode}
                              {...field}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setValueAddress(
                                  'postal_zipcode',
                                  e.target.value
                                )
                                triggerAddress('postal_zipcode')
                              }}
                            />
                            <FormHelperText
                              error={!!errorsAddress.postal_zipcode}
                            >
                              {errorsAddress.postal_zipcode &&
                                `${errorsAddress.postal_zipcode.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                </Stack>
              </form>
            </DialogContentTws>
            <DialogActionsTws sx={{ padding: '0 30px 25px 30px' }}>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="flex-end"
                sx={{ width: '100%' }}
              >
                <ButtonCancel
                  onClick={handleCloseDialog}
                  variant="outlined"
                  size="large"
                >
                  {t('cancel')}
                </ButtonCancel>
                <ButtonCustom
                  variant="contained"
                  onClick={handleSubmitAddress(onSubmitAddress)}
                  size="large"
                >
                  {t('confirm')}
                </ButtonCustom>
              </Stack>
            </DialogActionsTws>
          </>
        ) : (
          <></>
        )}
      </Drawer>

      <CreditCards
        open={openCreditCards}
        onClose={setOpenCreditCards}
        setSelectCard={setSelectCard}
        selectCard={selectCard}
        isAbleToGetListCard={true}
      />
    </ContextCart.Provider>
  )
}

export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'checkout',
      ])),
    },
  }
}

Checkout.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default Checkout
