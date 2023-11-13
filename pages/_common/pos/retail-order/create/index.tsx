import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Dialog,
  Divider,

  // Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  LinearProgress,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  formatPhoneNumber,
  handlerGetErrMessage,
  hasSpecialCharacterPrice,
  objToStringParam,
  truncateToTwoDecimalPlaces,
} from 'src/utils/global.utils'
import PrintOrder from '../printOrder'
import {
  createRetailOrder,
  getConfigPayment,
  getDetailVoucherByCode,
  getListProductByBarcode,
  getProductBrand,
  getProductCategory,
  getProductForRetailOrder,
  getProductManufacturer,
  getProductVariantDetail,
  getRetailDetailOrder,
  paidByCashForRetailOrder,
} from './createRetailOrderApi'
import {
  ContactDetailType,
  createRetailOrderType,
  DetailVoucherByCodeType,
  InvalidItemRetailOrderType,
  ListProductDataType,
  OtherProductType,
  ProductBrandResponseType,
  ProductCategoryResponseType,
  ProductDataType,
  ProductManufacturerResponseType,
  ProductRetailType,
  RetailOrderDetailType,
  SubmitCashPaymentType,
  VoucherCodeType,
} from './createRetailOrderModels'

import { yupResolver } from '@hookform/resolvers/yup'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  ArrowRight,
  CheckCircle,
  CreditCard,
  FunnelSimple,
  MagnifyingGlass,
  Notebook,
  Pencil,
  PencilLine,
  Plus,
  Trash,
  Warning,
  X,
  XCircle,
} from '@phosphor-icons/react'
import Head from 'next/head'
import Image from 'next/image'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NumberFormatValues, NumericFormat } from 'react-number-format'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InfiniteScrollSelectMultiple,
  InputLabelCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
  TextFieldSearchCustom,
  TypographyH2,
} from 'src/components'
import { formatMoney } from 'src/utils/money.utils'
import ItemProduct from './part/itemProduct'
import classes from './styles.module.scss'
import { filterSchema, schema, schemaTip, schemaVoucher } from './validations'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AddOtherProductForm from './part/AddOtherProduct'

import CurrencyNumberFormat from 'src/components/CurrencyNumberFormat'
import RequiredLabel from 'src/components/requiredLabel'
import AddContactForm from './part/AddContactForm'
import CashPaymentForm from './part/CashPayment'
import { CreditType } from './part/CashPayment/cardPaymentModel'
import CreditPaymentForm from './part/CreditPayment'
import EditPriceFormForProduct from './part/EditPriceForm'
import EditPriceFormForOtherProduct from './part/EditPriceFormForOtherProduct'
import { useTranslation } from 'next-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import useDeepCompareEffect from 'use-deep-compare-effect'

const CardCustom = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#F8F9FC' : theme.palette.action.hover,
  boxShadow: 'none',
  height: '100%',
}))
const GridProduct = styled(Grid)(() => ({
  ['@media (min-width:1536px) and (max-width:1700px)']: {
    flexBasis: '25%',
    maxWidth: '25%',
  },
}))

// const NumericFormatCustom = styled(NumericFormat)<any>(() => ({
//   '& .MuiOutlinedInput-root': {
//     borderRadius: '8px',
//     fontSize: '1.4rem',
//     overflow: 'hidden',
//     borderColor: '#E1E6EF',
//     height: '40px',
//   },
//   '& .MuiOutlinedInput-notchedOutline': {
//     borderWidth: '1px !important',
//     borderColor: '#E1E6EF',
//   },
//   '& .MuiInputBase-multiline': {
//     padding: '0px',
//   },
//   '& .MuiInputBase-input': {
//     padding: '10px 15px',
//   },
// }))

const ButtonIncreaseDecrease = styled(Button)(() => ({
  borderRadius: '10px',
  // borderColor:
  //   theme.palette.mode === 'dark'
  //     ? 'rgba(255, 255, 255, 0.23)'
  //     : 'rgba(0, 0, 0, 0.23)',
}))

const TypographyPayment = styled(Typography)(() => ({
  fontSize: '1.6rem',
  color: '#595959',
}))
const NumericFormatCustom = styled(NumericFormat)<any>(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: '1.4rem',
    overflow: 'hidden',
    borderColor: '#E1E6EF',
    height: '40px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px !important',
    borderColor: '#E1E6EF',
  },
  '& .MuiInputBase-multiline': {
    padding: '0px',
  },
  '& .MuiInputBase-input': {
    padding: '10px 15px',
  },
}))
// const BoxShadowCustom = styled(Box)(() => ({
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%,-50%)',
//   width: '500px',
// }))
const CreateRetailOrder: React.FC = () => {
  const { t } = useTranslation('retail-order-list')

  const [stateRadioPaymentMethod, setStateRadioPaymentMethod] = useState(1)
  const [stateSwitch, setStateSwitch] = useState(false)
  const [stateSwitchRoundedUp, setStateSwitchRoundedUp] = useState(false)
  const theme = useTheme()
  const limit = useMediaQuery('(max-width:1400px)')
  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [stateListProduct, setStateListProduct] =
    useState<ListProductDataType>()

  const [stateTotalSelected, setStateTotalSelected] = useState<number>(0)
  const [stateProductSelected, setStateProductSelected] = useState<
    ProductDataType[]
  >([])
  const [statePayment, setStatePayment] = useState<boolean>(false)
  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)
  const [stateHasMore, setStateHasMore] = useState<boolean>(false)
  const [stateListCategory, setStateListCategory] =
    useState<ProductCategoryResponseType>({ data: [] })
  const [stateListBrand, setStateListBrand] =
    useState<ProductBrandResponseType>({
      data: [],
    })
  const [stateListManufacturer, setStateListManufacturer] =
    useState<ProductManufacturerResponseType>({
      data: [],
    })
  const [
    stateListProductSelectedFromLocalStorage,
    setStateListProductSelectedFromLocalStorage,
  ] = useState<ProductDataType[]>([])

  const [stateOpenModalClearAll, setStateOpenModalClearAll] =
    useState<boolean>(false)
  const [stateOpenModalAddProductVariant, setStateOpenModalAddProductVariant] =
    useState(false)
  const [
    stateTemporaryProductVariantDetail,
    setStateTemporaryProductVariantDetail,
  ] = useState<ProductDataType[]>([])
  const [filter, setFilter] = useState<number>()
  const [stateMethodForm, setStateMethodForm] = useState(false)
  const [stateAddOtherProductForm, setStateAddOtherProductForm] =
    useState(false)
  const [stateOtherProductList, setStateOtherProductList] = useState<
    OtherProductType[]
  >([])

  const [
    stateHandleOpenEditPriceForOtherProduct,
    setStateHandleOpenEditPriceForOtherProduct,
  ] = useState(false)
  const [stateCurrentOtherProductIndex, setStateCurrentOtherProductIndex] =
    useState<number>()
  const [stateCurrentOtherProductDetail, setStateCurrentOtherProductDetail] =
    useState<OtherProductType>()
  const [
    stateHandleOpenEditPriceForProduct,
    setStateHandleOpenEditPriceForProduct,
  ] = useState(false)
  const [stateCurrentProductIndex, setStateCurrentProductIndex] =
    useState<number>(-1)
  const [stateCurrentProductDataDetail, setStateCurrentProductDataDetail] =
    useState<ProductDataType>()

  const [stateConfirmBuyOverStockProduct, setStateConfirmBuyOverStockProduct] =
    useState(false)
  const [
    stateConfirmBuyOverStockProductIncrease,
    setStateConfirmBuyOverStockProductIncrease,
  ] = useState(false)
  const [
    stateConfirmBuyOverStockProductVariant,
    setStateConfirmBuyOverStockProductVariant,
  ] = useState(false)
  const [
    stateConfirmBuyOutOfStockProduct,
    setStateConfirmBuyOutOfStockProduct,
  ] = useState(false)
  const [
    stateConfirmBuyOutOfStockProductVariant,
    setStateConfirmBuyOutOfStockProductVariant,
  ] = useState(false)
  const [stateContactForm, setStateContactForm] = useState(false)
  const [stateContactDetail, setStateContactDetail] =
    useState<ContactDetailType>()
  const [stateReceiptSummary, setStateReceiptSummary] = useState(false)
  const [stateResponseCreateOrderDetail, setStateResponseCreateOrderDetail] =
    useState<RetailOrderDetailType>()
  const [stateCurrentProductFromBarcode, setStateCurrentProductFromBarcode] =
    useState<ProductDataType>()
  const [
    stateConfirmBuyOutOfStockForBarcode,
    setStateConfirmBuyOutOfStockForBarcode,
  ] = useState(false)
  const [
    stateConfirmBuyOverStockForBarcode,
    setStateConfirmBuyOverStockForBarcode,
  ] = useState(false)
  const [stateApplyVoucherForm, setStateApplyVoucherForm] = useState(false)
  const [stateCheckVoucherIsValid, setStateCheckVoucherIsValid] =
    useState(false)

  const [stateCurrentVoucher, setStateCurrentVoucher] =
    useState<DetailVoucherByCodeType>()

  const [statePriceSummary, setStatePriceSummary] = useState<{
    price_discount: number
    apply_voucher_price: number
  }>({ price_discount: 0, apply_voucher_price: 0 })
  const [stateFinalTotal, setStateFinalTotal] = useState(0)
  const [stateCurrentRadioDiscount, setStateCurrentRadioDiscount] =
    useState('customer')
  const handleChangeRadioDiscount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateCurrentRadioDiscount((event.target as HTMLInputElement).value)
  }
  const fetchMoreData = (page: number) => {
    getProductForRetailOrder({ ...router.query, page: page })
      .then((res) => {
        const { data } = res
        setStateHasMore(data.nextPage == null ? false : true)
        if (stateProductSelected && stateProductSelected.length > 0) {
          // const temporaryListProductFromAPI: ProductDataType[] = JSON.parse(
          //   JSON.stringify(data.data)
          // )
          // find product from list product from api that match list product selected
          const temporaryListProductSelected: ProductDataType[] = JSON.parse(
            JSON.stringify(stateListProductSelectedFromLocalStorage)
          )
          const temporaryListProductFromAPI: ProductDataType[] = JSON.parse(
            JSON.stringify(data.data)
          )
          for (let i = 0; i < temporaryListProductFromAPI.length; i++) {
            for (let j = 0; j < temporaryListProductSelected.length; j++) {
              if (
                temporaryListProductSelected[j].id ===
                temporaryListProductFromAPI[i].id
              ) {
                temporaryListProductFromAPI[i] = {
                  ...temporaryListProductFromAPI[i],
                  isSelected: true,
                  tempQuantity: temporaryListProductSelected[j].tempQuantity,
                }
              }
            }
            // if (result.includes(temporaryListProductFromAPI[i])) {
            //   temporaryListProductFromAPI[i] = {
            //     ...temporaryListProductFromAPI[i],
            //     isSelected: true,
            //   }
            // }
          }
          setStateListProduct((prev: any) => {
            return {
              ...data,
              data: [...prev.data, ...temporaryListProductFromAPI],
            }
          })
          return
        }
        setStateListProduct((prev: any) => {
          return {
            ...data,
            data: [...prev.data, ...res.data.data],
          }
        })
      })
      .catch((error) => {
        const { status, data } = error.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  //filter
  const openFilter = Boolean(anchorFilter)

  const handleOpenMenuFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorFilter(event.currentTarget)
    handleGetCategory('')
    handleGetBrand('')
    handleGetManufacturer('')
  }

  const handleCloseMenuFilter = () => {
    setAnchorFilter(null)
  }

  const handleTogglePayment = () => {
    setStatePayment(!statePayment)
    setValueTip('tip', null)
  }
  const {
    handleSubmit: handleSubmitFilter,
    setValue: setValueFilter,
    control: controlFilter,
    getValues: getValuesFilter,
    reset: resetFilter,
    formState: { errors: errorsFilter },
  } = useForm({
    resolver: yupResolver(filterSchema),
    mode: 'all',
  })
  const {
    setValue: setValueTip,
    control: controlTip,
    getValues: getValuesTip,
    trigger: triggerValueTip,
    watch: watchTip,
    formState: { errors: errorsTip },
  } = useForm({
    resolver: yupResolver(schemaTip),
    mode: 'all',
  })

  const {
    control: controlVoucher,

    reset: resetVoucher,
    clearErrors: clearErrorsVoucher,
    handleSubmit: handleSubmitVoucher,
    formState: { errors: errorsVoucher },
  } = useForm<VoucherCodeType>({
    resolver: yupResolver(schemaVoucher),
    mode: 'all',
  })

  useEffect(() => {
    const dataHolding = {
      category: '',
      brand: '',
      manufacturer: '',
      instock_gte: '',
      instock_lte: '',
      retail_price_gte: '',
      retail_price_lte: '',
    }
    let count = 0

    // Check if field in query parameter exists in Dataholding and Count
    for (const i in router.query) {
      // eslint-disable-next-line no-prototype-builtins
      if (dataHolding.hasOwnProperty(i)) {
        // ;(DataHolding as any)[i] = router.query[i]
        count++
      }
    }
    // setValue('brand', DataHolding?.brand.split(/[\s,]+/))
    // setValue('manufacturer', DataHolding.manufacturer.split(/[\s,]+/))
    if (
      router?.query?.category &&
      typeof router?.query?.category === 'string'
    ) {
      setValueFilter('category', router?.query?.category.split(','))
    }

    if (router?.query?.brand && typeof router?.query?.brand === 'string') {
      setValueFilter('brand', router?.query?.brand.split(','))
    }

    if (
      router?.query?.manufacturer &&
      typeof router?.query?.manufacturer === 'string'
    ) {
      setValueFilter('manufacturer', router?.query?.manufacturer.split(','))
    }

    setValueFilter(
      'instock_gte',
      typeof router?.query?.instock_gte === 'string'
        ? parseInt(router?.query?.instock_gte)
        : ''
    )
    setValueFilter(
      'instock_lte',
      typeof router?.query?.instock_lte === 'string'
        ? parseInt(router?.query?.instock_lte)
        : ''
    )

    setValueFilter(
      'retail_price_gte',
      typeof router?.query?.retail_price_gte === 'string'
        ? Number(router?.query?.retail_price_gte)
        : ''
    )
    setValueFilter(
      'retail_price_lte',
      typeof router?.query?.retail_price_lte === 'string'
        ? Number(router?.query?.retail_price_lte)
        : ''
    )
    setFilter(count)
  }, [router.query])
  const handleSubmitCreateRetailOrder = () => {
    if (!stateListProduct) return
    dispatch(loadingActions.doLoading())

    const listProductSelected: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    const listOtherProduct: OtherProductType[] = JSON.parse(
      JSON.stringify(
        stateOtherProductList.map((item) => {
          return {
            ...item,
            total: Number(item.price * item.quantity).toFixed(2),
          }
        })
      )
    )
    // const checkIfRetailOrderHaveCustomerDiscount = () => {
    //   if (
    //     stateContactDetail &&
    //     stateCurrentVoucher &&
    //     stateCurrentRadioDiscount === 'customer'
    //   )
    //     return true
    //   if (stateContactDetail && !stateCurrentVoucher) return true
    //   return false
    // }
    const listProductInRetailOrder: ProductRetailType[] =
      listProductSelected.map((item) => {
        return {
          product_variant: item.id,
          quantity: Number(item.tempQuantity),
          ...(item.edited_price && {
            price: Number(truncateToTwoDecimalPlaces(item.edited_price)),
          }),
          // ...(checkIfRetailOrderHaveCustomerDiscount() &&
          //   item.price_discount && {
          //     price_discount: Number(
          //       truncateToTwoDecimalPlaces(
          //         Number(item.retail_price) - item.price_discount
          //       )
          //     ),
          //   }),
        }
      })
    const checkIfRetailOrderHaveVoucher = () => {
      if (
        stateContactDetail &&
        stateCurrentVoucher &&
        stateCurrentRadioDiscount === 'voucher'
      )
        return true
      if (!stateContactDetail && stateCurrentVoucher) return true
      return false
    }
    const submitCreateRetailOrder: createRetailOrderType = {
      shipping_method: 1,
      payment_method: 1,
      items: listProductInRetailOrder,
      ...((stateContactDetail || stateCurrentVoucher) && {
        apply_type:
          stateCurrentRadioDiscount === 'customer' ? 'DISCOUNT' : 'VOUCHER',
      }),
      ...(listOtherProduct.length > 0 && { other_products: listOtherProduct }),
      ...(stateContactDetail?.phone_number && {
        phone_number: stateContactDetail?.phone_number
          ?.replace(')', '')
          .replace('(', '')
          .replaceAll(' ', ''),
      }),
      ...(stateSwitchRoundedUp && { round_up: true }),
      ...(checkIfRetailOrderHaveVoucher() && {
        voucher_code: stateCurrentVoucher?.code,
      }),
      ...(watchTip('tip') && { tips: watchTip('tip') }),
    }
    createRetailOrder(submitCreateRetailOrder)
      .then((res) => {
        const { data } = res.data
        setStateCurrentVoucher(undefined)
        getRetailDetailOrder(data.code)
          .then((res) => {
            const { data } = res.data
            setStateResponseCreateOrderDetail(data)
            setStateReceiptSummary(true)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        pushMessage(
          t('create.message.retailOrderHasBeenCreatedSuccessfully'),
          'success'
        )
        setStateReceiptSummary(true)
        localStorage.removeItem('listSelectedProduct')
        localStorage.removeItem('listOtherProduct')
        setStateProductSelected([])
        setStateOtherProductList([])
        setStateMethodForm(false)
        const cloneListProductInventory: ProductDataType[] =
          stateListProduct.data.map((item) => {
            return { ...item, isSelected: false, quantity: undefined }
          })
        setStateListProduct((prev: any) => {
          return { ...prev, data: cloneListProductInventory }
        })
        handleClearAllProduct()
        setStateOpenModalClearAll(false)
        handleGetProductRetailOrder(router.query)
        setStatePayment(false)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        if (status === 400) {
          data.data.forEach((item: InvalidItemRetailOrderType) => {
            pushMessage(item.errorMessage, 'error')
          })
          const temporaryListProductInvalid: InvalidItemRetailOrderType[] =
            JSON.parse(JSON.stringify(data.data))
          const temporaryListProductSelected: ProductDataType[] = JSON.parse(
            JSON.stringify(stateProductSelected)
          )

          for (let i = 0; i < temporaryListProductSelected.length; i++) {
            if (
              temporaryListProductInvalid.some(
                (item: InvalidItemRetailOrderType) => {
                  return (
                    Number(item.productId) ===
                    temporaryListProductSelected[i].id
                  )
                }
              )
            ) {
              temporaryListProductSelected[i] = {
                ...temporaryListProductSelected[i],
                isInvalid: true,
              }
            }
          }

          setStateProductSelected(temporaryListProductSelected)
          dispatch(loadingActions.doLoadingFailure())
          return
        }
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleCheckoutByCash = (value: CreditType) => {
    if (!stateListProduct) return
    dispatch(loadingActions.doLoading())

    const listOtherProduct: OtherProductType[] = JSON.parse(
      JSON.stringify(
        stateOtherProductList.map((item) => {
          return {
            ...item,
            total: Number(item.price * item.quantity).toFixed(2),
          }
        })
      )
    )

    const submitCreateRetailOrder: createRetailOrderType = {
      shipping_method: 1,
      payment_method: value.credit ? 3 : 4,
      ...((stateContactDetail || stateCurrentVoucher) && {
        apply_type:
          stateCurrentRadioDiscount === 'customer' ? 'DISCOUNT' : 'VOUCHER',
      }),
      items: handleValidateValueCreateOrderBeforeCheckout(),
      other_products: listOtherProduct,
      phone_number: stateContactDetail?.phone_number
        ?.replace(')', '')
        .replace('(', '')
        .replaceAll(' ', ''),
      ...(checkIfRetailOrderHaveVoucher() && {
        voucher_code: stateCurrentVoucher?.code,
      }),
      ...(watchTip('tip') && { tips: watchTip('tip') }),
      ...(stateSwitchRoundedUp && { round_up: true }),
    }
    if (submitCreateRetailOrder.phone_number === '') {
      delete submitCreateRetailOrder.phone_number
    }
    if (listOtherProduct.length === 0) {
      delete submitCreateRetailOrder.other_products
    }
    createRetailOrder(submitCreateRetailOrder)
      .then((res) => {
        const { data } = res.data
        setStateCurrentVoucher(undefined)

        getRetailDetailOrder(data.code)
          .then((res) => {
            const { data } = res.data
            setStateResponseCreateOrderDetail(data)
            setStateReceiptSummary(true)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        let change = 0

        if (getValuesTip('tip')) {
          change = Number(
            (
              Number(value.cash) -
              Number(stateTotalSelected) -
              Number(getValuesTip('tip'))
            ).toFixed(2)
          )
        } else {
          change = Number(
            (Number(value.cash) - Number(stateTotalSelected)).toFixed(2)
          )
        }
        const submitPaidByCash: SubmitCashPaymentType = {
          retail_order: data.id,
          amount: data.total,
          change: change > 0 ? change : 0,
          tip: data.tip,
        }
        if (!getValuesTip('tip') || Number(value.cash) < Number(value.credit)) {
          delete submitPaidByCash.tip
        }

        paidByCashForRetailOrder(submitPaidByCash)
          .then(() => {
            if (value.credit) {
              const options = {
                method: 'POST',
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                  authorization:
                    'Basic a2FpQGV4bm9kZXMudm46RXhub2RlczEyMyFAIw==',
                },
                body:
                  getValuesTip('tip') &&
                  Number(value.cash) < Number(value.credit)
                    ? JSON.stringify({
                        paymentType: 'Sale',
                        cardAccount: {
                          number: value.number,
                          expiryMonth: value.expiryMonth,
                          expiryYear: value.expiryYear,
                          cvv: value.cvc,
                        },
                        entryClas: 'WEB',
                        authOnly: false,
                        isAuth: false,
                        isSettleFunds: false,
                        source: 'API',
                        taxExempt: false,
                        tenderType: 'Card',
                        meta: `{'order': ${data.id}}`,
                        merchantId: 1000015872,
                        amount: value.credit,
                        tip: Number(getValuesTip('tip')),
                      })
                    : JSON.stringify({
                        paymentType: 'Sale',
                        cardAccount: {
                          number: value.number,
                          expiryMonth: value.expiryMonth,
                          expiryYear: value.expiryYear,
                          cvv: value.cvc,
                        },
                        entryClas: 'WEB',
                        authOnly: false,
                        isAuth: false,
                        isSettleFunds: false,
                        source: 'API',
                        taxExempt: false,
                        tenderType: 'Card',
                        meta: `{'order': ${data.id}}`,
                        merchantId: 1000015872,
                        amount: value.credit,
                      }),
              }

              fetch(
                'https://sandbox.api.mxmerchant.com/checkout/v3/payment?echo=true&includeCustomerMatches=false',
                options
              )
                .then((response) => {
                  if (response.ok) {
                    return response.json()
                  }
                  throw new Error('Something went wrong')
                })
                .then(() => {
                  pushMessage(
                    'Retail order has been created successfully',
                    'success'
                  )
                  setStateMethodForm(false)
                  localStorage.removeItem('listSelectedProduct')
                  localStorage.removeItem('listOtherProduct')
                  setStateProductSelected([])
                  setStateOtherProductList([])
                  const cloneListProductInventory: ProductDataType[] =
                    stateListProduct.data.map((item) => {
                      return {
                        ...item,
                        isSelected: false,
                        tempQuantity: undefined,
                      }
                    })
                  setStateListProduct((prev: any) => {
                    return { ...prev, data: cloneListProductInventory }
                  })
                  // handleClearAllProduct()
                  setStateContactDetail(undefined)

                  setStateOpenModalClearAll(false)
                  handleGetProductRetailOrder(router.query)
                  setStatePayment(false)
                  dispatch(loadingActions.doLoadingSuccess())
                })
                .catch(() => {
                  pushMessage('Payment failed', 'error')
                })
            } else {
              pushMessage(
                'Retail order has been created successfully',
                'success'
              )
              localStorage.removeItem('listSelectedProduct')
              localStorage.removeItem('listOtherProduct')
              setStateProductSelected([])
              setStateOtherProductList([])
              const cloneListProductInventory: ProductDataType[] =
                stateListProduct.data.map((item) => {
                  return { ...item, isSelected: false, quantity: undefined }
                })
              setStateListProduct((prev: any) => {
                return { ...prev, data: cloneListProductInventory }
              })
              handleClearAllProduct()
              setStateMethodForm(false)
              setStateOpenModalClearAll(false)
              handleGetProductRetailOrder(router.query)
              setStatePayment(false)
              dispatch(loadingActions.doLoadingSuccess())
            }
          })
          .catch(({ response }) => {
            const { status, data } = response
            dispatch(loadingActions.doLoadingFailure())
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')

        // if (status === 400) {
        //   data.data.forEach((item: InvalidItemRetailOrderType) => {
        //     pushMessage(item.errorMessage, 'error')
        //   })
        //   const temporaryListProductInvalid: InvalidItemRetailOrderType[] =
        //     JSON.parse(JSON.stringify(data.data))
        //   const temporaryListProductSelected: ProductDataType[] = JSON.parse(
        //     JSON.stringify(stateProductSelected)
        //   )

        //   for (let i = 0; i < temporaryListProductSelected.length; i++) {
        //     if (
        //       temporaryListProductInvalid.some(
        //         (item: InvalidItemRetailOrderType) => {
        //           return (
        //             Number(item.productId) ===
        //             temporaryListProductSelected[i].id
        //           )
        //         }
        //       )
        //     ) {
        //       temporaryListProductSelected[i] = {
        //         ...temporaryListProductSelected[i],
        //         isInvalid: true,
        //       }
        //     }
        //   }

        //   setStateProductSelected(temporaryListProductSelected)
        //   dispatch(loadingActions.doLoadingFailure())
        //   return
        // }
      })
      .finally(() => {
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  const checkIfRetailOrderHaveVoucher = () => {
    if (
      stateContactDetail &&
      stateCurrentVoucher &&
      stateCurrentRadioDiscount === 'voucher'
    )
      return true
    if (!stateContactDetail && stateCurrentVoucher) return true
    return false
  }
  const handleValidateValueCreateOrderBeforeCheckout = () => {
    const listProductSelected: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )

    const listProductInRetailOrder: ProductRetailType[] =
      listProductSelected.map((item) => {
        return {
          product_variant: item.id,
          quantity: Number(item.tempQuantity),
          ...(item.edited_price && { price: item.edited_price }),
          // ...(stateCurrentRadioDiscount === 'customer' &&
          //   item.price_discount && {
          //     price_discount: Number(
          //       truncateToTwoDecimalPlaces(
          //         Number(item.retail_price) - item.price_discount
          //       )
          //     ),
          //   }),
        }
      })
    console.log('listProductInRetailOrder', listProductInRetailOrder)
    return listProductInRetailOrder
  }
  const handleCheckoutByCreditCard = (value: CreditType) => {
    if (!stateListProduct) return

    dispatch(loadingActions.doLoading())

    const listOtherProduct: OtherProductType[] = JSON.parse(
      JSON.stringify(
        stateOtherProductList.map((item) => {
          return {
            ...item,
            total: Number(item.price * item.quantity).toFixed(2),
          }
        })
      )
    )
    const checkIfRetailOrderHaveVoucher = () => {
      if (
        stateContactDetail &&
        stateCurrentVoucher &&
        stateCurrentRadioDiscount === 'voucher'
      )
        return true
      if (!stateContactDetail && stateCurrentVoucher) return true
      return false
    }
    const submitCreateRetailOrder: createRetailOrderType = {
      shipping_method: 1,
      payment_method: value.cash ? 3 : 2,
      items: handleValidateValueCreateOrderBeforeCheckout(),
      other_products: listOtherProduct,
      phone_number: stateContactDetail?.phone_number
        ?.replace(')', '')
        .replace('(', '')
        .replaceAll(' ', ''),
      ...(checkIfRetailOrderHaveVoucher() && {
        voucher_code: stateCurrentVoucher?.code,
      }),
      ...(watchTip('tip') && { tips: watchTip('tip') }),
      ...(stateSwitchRoundedUp && { round_up: true }),
    }
    if (submitCreateRetailOrder.phone_number === '') {
      delete submitCreateRetailOrder.phone_number
    }
    if (listOtherProduct.length === 0) {
      delete submitCreateRetailOrder.other_products
    }

    createRetailOrder(submitCreateRetailOrder)
      .then((res) => {
        setStateCurrentVoucher(undefined)

        const { data } = res.data
        getRetailDetailOrder(data.code)
          .then((res) => {
            const { data } = res.data
            setStateResponseCreateOrderDetail(data)
            setStateReceiptSummary(true)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        let change = 0
        if (getValuesTip('tip')) {
          change = Number(
            (
              Number(value.cash) -
              Number(stateTotalSelected) -
              Number(getValuesTip('tip'))
            ).toFixed(2)
          )
        } else {
          change = Number(
            (Number(value.cash) - Number(stateTotalSelected)).toFixed(2)
          )
        }

        const submitPaidByCash: SubmitCashPaymentType = {
          retail_order: data.id,
          amount: Number(value.cash),
          change: change > 0 ? change : 0,
          tip: Number(getValuesTip('tip')),
        }
        if (!getValuesTip('tip') || Number(value.cash) < Number(value.credit)) {
          delete submitPaidByCash.tip
        }
        console.log('getValuesTip', getValuesTip('tip'))
        const options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            Authorization: 'Basic a2FpQGV4bm9kZXMudm46RXhub2RlczEyMyFAIw==',
          },
          body:
            !getValuesTip('tip') || Number(value.cash) > Number(value.credit)
              ? JSON.stringify({
                  paymentType: 'Sale',
                  cardAccount: {
                    number: value.number,
                    expiryMonth: value.expiry?.slice(0, 2),
                    expiryYear: value.expiry?.slice(3, 5),
                    cvv: value.cvc,
                  },
                  entryClas: 'WEB',
                  authOnly: false,
                  isAuth: false,
                  isSettleFunds: false,
                  source: 'API',
                  taxExempt: false,
                  tenderType: 'Card',
                  meta: `{'order': ${data.id}}`,
                  merchantId: 1000015872,
                  amount: value.credit,
                })
              : JSON.stringify({
                  paymentType: 'Sale',
                  cardAccount: {
                    number: value.number,
                    expiryMonth: value.expiry?.slice(0, 2),
                    expiryYear: value.expiry?.slice(3, 5),
                    cvv: value.cvc,
                  },
                  entryClas: 'WEB',
                  authOnly: false,
                  isAuth: false,
                  isSettleFunds: false,
                  source: 'API',
                  taxExempt: false,
                  tenderType: 'Card',
                  tip: Number(getValuesTip('tip')),

                  meta: `{'order': ${data.id}}`,
                  merchantId: 1000015872,
                  amount: value.credit,
                }),
        }

        getConfigPayment().then((res) => {
          const { payment_gateway } = res.data.data
          if (payment_gateway === 'REVITPAY') {
            fetch(
              'https://api.sandbox.revitgate.com/api/v2/transactions/charge',
              {
                method: 'POST',
                headers: {
                  accept: 'application/json',
                  'content-type': 'application/json',
                  Authorization:
                    'basic ' +
                    window.btoa('03jjMnOQiURCVMAIL4yNFTsDRkZiU2jp:223366'),
                },
                body:
                  !getValuesTip('tip') ||
                  Number(value.cash) > Number(value.credit)
                    ? JSON.stringify({
                        custom_fields: {
                          custom1: data.code,
                          custom2: 'RETAIL',
                        },
                        card: value.number!.replace(/\s/g, ''),
                        amount: value.credit,
                        expiry_month: Number(value.expiry?.slice(0, 2)),
                        expiry_year: Number('20' + value.expiry?.slice(3, 5)),
                      })
                    : JSON.stringify({
                        custom_fields: {
                          custom1: data.code,
                          custom2: 'RETAIL',
                        },
                        card: value.number!.replace(/\s/g, ''),
                        expiry_month: Number(value.expiry?.slice(0, 2)),
                        expiry_year: Number('20' + value.expiry?.slice(3, 5)),
                        amount_details: {
                          tip: Number(getValuesTip('tip')),
                        },
                        amount: value.credit,
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
                if (value.cash) {
                  paidByCashForRetailOrder(submitPaidByCash)
                    .then(() => {
                      pushMessage(
                        'Retail order has been created successfully',
                        'success'
                      )
                      setStateMethodForm(false)
                      localStorage.removeItem('listSelectedProduct')
                      localStorage.removeItem('listOtherProduct')
                      setStateProductSelected([])
                      setStateOtherProductList([])
                      const cloneListProductInventory: ProductDataType[] =
                        stateListProduct.data.map((item) => {
                          return {
                            ...item,
                            isSelected: false,
                            quantity: undefined,
                          }
                        })
                      setStateListProduct((prev: any) => {
                        return { ...prev, data: cloneListProductInventory }
                      })
                      handleClearAllProduct()
                      setStateOpenModalClearAll(false)
                      handleGetProductRetailOrder(router.query)
                      setStatePayment(false)
                      dispatch(loadingActions.doLoadingSuccess())
                    })
                    .catch(({ response }) => {
                      const { status, data } = response
                      pushMessage(handlerGetErrMessage(status, data), 'error')
                    })
                } else {
                  pushMessage(
                    'Retail order has been created successfully',
                    'success'
                  )
                  localStorage.removeItem('listSelectedProduct')
                  localStorage.removeItem('listOtherProduct')
                  setStateProductSelected([])
                  setStateMethodForm(false)
                  setStateOtherProductList([])
                  const cloneListProductInventory: ProductDataType[] =
                    stateListProduct.data.map((item) => {
                      return { ...item, isSelected: false, quantity: undefined }
                    })
                  setStateListProduct((prev: any) => {
                    return { ...prev, data: cloneListProductInventory }
                  })
                  handleClearAllProduct()
                  setStateOpenModalClearAll(false)
                  handleGetProductRetailOrder(router.query)
                  setStatePayment(false)
                  dispatch(loadingActions.doLoadingSuccess())
                }
              })
              .catch(() => {
                pushMessage('Payment failed', 'error')
              })
          } else {
            fetch(
              'https://sandbox.api.mxmerchant.com/checkout/v3/payment?echo=true&includeCustomerMatches=false',
              options
            )
              .then((response) => {
                if (response.ok) {
                  return response.json()
                }
                throw new Error('Something went wrong')
              })
              .then(() => {
                if (value.cash) {
                  paidByCashForRetailOrder(submitPaidByCash)
                    .then(() => {
                      pushMessage(
                        'Retail order has been created successfully',
                        'success'
                      )
                      setStateMethodForm(false)
                      localStorage.removeItem('listSelectedProduct')
                      localStorage.removeItem('listOtherProduct')
                      setStateProductSelected([])
                      setStateOtherProductList([])
                      const cloneListProductInventory: ProductDataType[] =
                        stateListProduct.data.map((item) => {
                          return {
                            ...item,
                            isSelected: false,
                            quantity: undefined,
                          }
                        })
                      setStateListProduct((prev: any) => {
                        return { ...prev, data: cloneListProductInventory }
                      })
                      handleClearAllProduct()
                      setStateOpenModalClearAll(false)
                      handleGetProductRetailOrder(router.query)
                      setStatePayment(false)
                      dispatch(loadingActions.doLoadingSuccess())
                    })
                    .catch(({ response }) => {
                      const { status, data } = response
                      pushMessage(handlerGetErrMessage(status, data), 'error')
                    })
                } else {
                  pushMessage(
                    'Retail order has been created successfully',
                    'success'
                  )
                  localStorage.removeItem('listSelectedProduct')
                  localStorage.removeItem('listOtherProduct')
                  setStateProductSelected([])
                  setStateMethodForm(false)
                  setStateOtherProductList([])
                  const cloneListProductInventory: ProductDataType[] =
                    stateListProduct.data.map((item) => {
                      return { ...item, isSelected: false, quantity: undefined }
                    })
                  setStateListProduct((prev: any) => {
                    return { ...prev, data: cloneListProductInventory }
                  })
                  handleClearAllProduct()
                  setStateOpenModalClearAll(false)
                  handleGetProductRetailOrder(router.query)
                  setStatePayment(false)
                  dispatch(loadingActions.doLoadingSuccess())
                }
              })
              .catch(() => {
                pushMessage('Payment failed', 'error')
              })
          }
        })
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')

        // if (status === 400) {
        //   data.data.forEach((item: InvalidItemRetailOrderType) => {
        //     pushMessage(item.errorMessage, 'error')
        //   })
        //   const temporaryListProductInvalid: InvalidItemRetailOrderType[] =
        //     JSON.parse(JSON.stringify(data.data))
        //   const temporaryListProductSelected: ProductDataType[] = JSON.parse(
        //     JSON.stringify(stateProductSelected)
        //   )

        //   for (let i = 0; i < temporaryListProductSelected.length; i++) {
        //     if (
        //       temporaryListProductInvalid.some(
        //         (item: InvalidItemRetailOrderType) => {
        //           return (
        //             Number(item.productId) ===
        //             temporaryListProductSelected[i].id
        //           )
        //         }
        //       )
        //     ) {
        //       temporaryListProductSelected[i] = {
        //         ...temporaryListProductSelected[i],
        //         isInvalid: true,
        //       }
        //     }
        //   }

        //   setStateProductSelected(temporaryListProductSelected)
        //   dispatch(loadingActions.doLoadingFailure())
        //   return
        // }
      })
      .finally(() => {
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  const handleGetManufacturer = (value: string | null) => {
    getProductManufacturer(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListManufacturer(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetBrand = (value: string | null) => {
    getProductBrand(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListBrand(data)
      })
      .catch(({ response }) => {
        const { status, data } = response

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetCategory = (value: string | null) => {
    getProductCategory(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListCategory(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const fetchMoreDataBrand = useCallback(
    (value: { page: number; name: string }) => {
      getProductBrand(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListBrand((prev: any) => {
            return {
              ...data,
              data: [...prev.data, ...res.data.data],
            }
          })
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    },
    [setStateListBrand]
  )

  const fetchMoreDataCategory = useCallback(
    (value: { page: number; name: string }) => {
      getProductCategory(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListCategory((prev: any) => {
            return {
              ...data,
              data: [...prev.data, ...res.data.data],
            }
          })
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setStateListCategory]
  )

  const fetchMoreDataManufacturer = useCallback(
    (value: { page: number; name: string }) => {
      getProductManufacturer(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListManufacturer((prev: any) => {
            return {
              ...data,
              data: [...prev.data, ...res.data.data],
            }
          })
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setStateListManufacturer]
  )

  const handleDeleteProduct = (id: number, index: number) => {
    if (!stateListProduct) return
    const cloneListProductInventory: ProductDataType[] = JSON.parse(
      JSON.stringify(stateListProduct.data)
    )
    const cloneListSelectedProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    const indexDuplicateProduct = cloneListProductInventory.findIndex(
      (product) => product.id === id && product.variants_count === 0
    )
    pushMessage(
      `Delete product ${cloneListSelectedProduct[index].name}`,
      'success'
    )
    if (indexDuplicateProduct >= 0) {
      cloneListProductInventory[indexDuplicateProduct] = {
        ...cloneListProductInventory[indexDuplicateProduct],
        tempQuantity: undefined,
        isSelected: false,
        isAllowed: false,
      }

      setStateListProduct((prev: any) => {
        return {
          ...prev,
          data: cloneListProductInventory,
        }
      })
    }
    cloneListSelectedProduct.splice(index, 1)
    setStateProductSelected(cloneListSelectedProduct)

    if (cloneListSelectedProduct.length === 0) {
      localStorage.removeItem('listSelectedProduct')
    } else {
      handleSetItemInLocalStorage(cloneListSelectedProduct)
    }
  }
  const handleDeleteProductVariant = (item: ProductDataType, index: number) => {
    // id : id product variant
    if (!stateListProduct) return
    const cloneListProductInventory: ProductDataType[] = JSON.parse(
      JSON.stringify(stateListProduct.data)
    )
    const cloneListSelectedProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    // id variant group from list product
    const indexDuplicateProduct = cloneListProductInventory.findIndex(
      (product) => product.id === item.product_id
    )

    if (
      indexDuplicateProduct >= 0 &&
      Number(cloneListProductInventory[indexDuplicateProduct].tempQuantity) !==
        Number(item.tempQuantity)
    ) {
      cloneListProductInventory[indexDuplicateProduct] = {
        ...cloneListProductInventory[indexDuplicateProduct],
        isSelected: true,
        tempQuantity:
          Number(
            cloneListProductInventory[indexDuplicateProduct].tempQuantity
          ) - Number(item.tempQuantity),
      }

      setStateListProduct((prev: any) => {
        return {
          ...prev,
          data: cloneListProductInventory,
        }
      })
      pushMessage(
        `Delete product ${cloneListSelectedProduct[index].name}`,
        'success'
      )
      cloneListSelectedProduct.splice(index, 1)
    } else {
      cloneListProductInventory[indexDuplicateProduct] = {
        ...cloneListProductInventory[indexDuplicateProduct],
        tempQuantity: undefined,
        isSelected: false,
      }

      setStateListProduct((prev: any) => {
        return {
          ...prev,
          data: cloneListProductInventory,
        }
      })
      cloneListSelectedProduct.splice(index, 1)
    }

    setStateProductSelected(cloneListSelectedProduct)
    if (cloneListSelectedProduct.length === 0) {
      localStorage.removeItem('listSelectedProduct')
    } else {
      handleSetItemInLocalStorage(cloneListSelectedProduct)
    }
  }

  const handleClearAllProduct = () => {
    if (!stateListProduct) return
    setStateProductSelected([])
    const cloneListProductInventory: ProductDataType[] =
      stateListProduct.data.map((item) => {
        return { ...item, isSelected: false, tempQuantity: undefined }
      })
    setStateListProduct((prev: any) => {
      return { ...prev, data: cloneListProductInventory }
    })
    setStateOpenModalClearAll(false)
    setStateContactDetail(undefined)
    localStorage.removeItem('listSelectedProduct')
    localStorage.removeItem('listOtherProduct')
    pushMessage('Clear all product successfully', 'success')
  }
  // use for both product and product variant discount from contact
  const handleCheckIfItemHaveDiscountFromContact = (item: ProductDataType) => {
    //! must check contact is existence before use
    if (!stateContactDetail)
      return (item = {
        ...item,
        retail_price: item.edited_price
          ? item.edited_price
          : item.min_retail_price
          ? item.min_retail_price
          : item.retail_price,
        base_price: item.min_retail_price,
        isSelected: true,
        tempQuantity: item.tempQuantity ? item.tempQuantity : 1,
      })
    const foundIndex = stateContactDetail?.specific_discount.findIndex(
      (contact) => contact.id === item.id
    )
    if (foundIndex >= 0) {
      let contactPriceDiscount = 0

      if (
        stateContactDetail.specific_discount[foundIndex].discount.type ===
        'PERCENTAGE'
      ) {
        if (
          !stateContactDetail.specific_discount[foundIndex].discount
            .max_discount_amount ||
          (Number(
            item.edited_price
              ? item.edited_price
              : item.retail_price
              ? item.retail_price
              : item.min_retail_price
          ) *
            stateContactDetail.specific_discount[foundIndex].discount
              .discount_amount) /
            100 <=
            Number(
              stateContactDetail.specific_discount[foundIndex].discount
                .max_discount_amount
            )
        ) {
          contactPriceDiscount =
            (Number(
              item.edited_price
                ? item.edited_price
                : item.retail_price
                ? item.retail_price
                : item.min_retail_price
            ) *
              stateContactDetail.specific_discount[foundIndex].discount
                .discount_amount) /
            100
        } else {
          contactPriceDiscount = Number(
            stateContactDetail.specific_discount[foundIndex].discount
              .max_discount_amount
          )
        }
      } else {
        contactPriceDiscount =
          stateContactDetail.specific_discount[foundIndex].discount
            .discount_amount
      }
      item = {
        ...item,
        price_discount: contactPriceDiscount,
        // base_price: item.min_retail_price
        //   ? item.min_retail_price
        //   : item.retail_price,

        isSelected: true,
        tempQuantity: item.tempQuantity ? item.tempQuantity : 1,
      }
      return item
    }
    if (stateContactDetail.general_discount) {
      let contactPriceGeneralDiscount = 0

      if (stateContactDetail.general_discount.type === 'PERCENTAGE') {
        if (
          (Number(
            item.edited_price
              ? item.edited_price
              : item.retail_price
              ? item.retail_price
              : item.min_retail_price
          ) *
            stateContactDetail.general_discount.discount_amount) /
            100 <
            Number(stateContactDetail.general_discount.max_discount_amount) ||
          !stateContactDetail.general_discount.max_discount_amount
        ) {
          contactPriceGeneralDiscount =
            (Number(
              item.edited_price
                ? item.edited_price
                : item.retail_price
                ? item.retail_price
                : item.min_retail_price
            ) *
              stateContactDetail.general_discount.discount_amount) /
            100
        } else {
          contactPriceGeneralDiscount = Number(
            stateContactDetail.general_discount.max_discount_amount
          )
        }
        item = {
          ...item,
          price_discount: contactPriceGeneralDiscount,
          // base_price: item.min_retail_price
          //   ? item.min_retail_price
          //   : item.retail_price,

          isSelected: true,
          tempQuantity: 1,
        }
        return item
      }
    }
    return (item = {
      ...item,
      isSelected: true,
      tempQuantity: 1,
    })
  }

  const handleSelectProduct = (item: ProductDataType, index: number) => {
    //! allow buy sold out product
    if (item.instock === 0 && !item.isAllowed) {
      setStateConfirmBuyOutOfStockProduct(true)
      setStateCurrentProductIndex(index)
      return
    }
    if (item.instock === item.tempQuantity && !item.isAllowed) {
      setStateConfirmBuyOverStockProduct(true)
      // get Current indexdiscount_price
      setStateCurrentProductIndex(index)
      return
    }
    //deep copy array list product selected
    const cloneSelectedProductListArray: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    //deep copy list product from api
    const cloneProductListArray: ProductDataType[] = JSON.parse(
      JSON.stringify(stateListProduct?.data)
    )
    //deep copy current product
    const temporaryProduct: ProductDataType = JSON.parse(
      JSON.stringify(cloneProductListArray[index])
    )

    if (!item.isSelected) {
      cloneProductListArray[index] = {
        ...temporaryProduct,
        retail_price: item.min_retail_price,
        base_price: item.retail_price
          ? item.retail_price
          : item.min_retail_price,
        isSelected: true,
        tempQuantity: 1,
      }

      setStateListProduct((prev: any) => {
        return {
          ...prev,
          data: cloneProductListArray,
        }
      })
      if (stateContactDetail) {
        const newItem = handleCheckIfItemHaveDiscountFromContact(item)
        cloneSelectedProductListArray.push(newItem)
        handleSetItemInLocalStorage(cloneSelectedProductListArray)
        setStateProductSelected(cloneSelectedProductListArray)
        return
      }
      const newProduct: ProductDataType = {
        ...item,
        retail_price: item.min_retail_price
          ? item.min_retail_price
          : item.retail_price,
        base_price: item.min_retail_price
          ? item.min_retail_price
          : item.retail_price,
        isSelected: true,
        tempQuantity: 1,
      }
      cloneSelectedProductListArray.push(newProduct)
      handleSetItemInLocalStorage(cloneSelectedProductListArray)
      setStateProductSelected(cloneSelectedProductListArray)
    } else {
      console.log(
        'cloneProductListArray[index] before',
        cloneProductListArray[index]
      )
      cloneProductListArray[index] = {
        ...temporaryProduct,
        base_price: item.min_retail_price
          ? item.min_retail_price
          : item.retail_price,
        retail_price: item.min_retail_price
          ? item.min_retail_price
          : item.retail_price,
        tempQuantity: Number(temporaryProduct?.tempQuantity) + 1,
      }

      setStateListProduct((prev: any) => {
        return {
          ...prev,
          data: cloneProductListArray,
        }
      })
      const indexDuplicateProduct = cloneSelectedProductListArray.findIndex(
        (product) => product.id === item.id
      )
      if (indexDuplicateProduct >= 0) {
        cloneSelectedProductListArray[indexDuplicateProduct] = {
          ...cloneSelectedProductListArray[indexDuplicateProduct],
          retail_price: cloneSelectedProductListArray[indexDuplicateProduct]
            .min_retail_price
            ? cloneSelectedProductListArray[indexDuplicateProduct]
                .min_retail_price
            : cloneSelectedProductListArray[indexDuplicateProduct].retail_price,
          base_price:
            cloneSelectedProductListArray[indexDuplicateProduct].base_price,
          tempQuantity:
            Number(
              cloneSelectedProductListArray[indexDuplicateProduct].tempQuantity
            ) + 1,
        }
      }

      setStateProductSelected(cloneSelectedProductListArray)
      handleSetItemInLocalStorage(cloneSelectedProductListArray)
    }
  }

  const handleSelectProductVariant = (item: ProductDataType) => {
    //! allow buy sold out product
    if (item.quantity === 0 && !item.isAllowed) {
      setStateCurrentProductDataDetail(item)
      setStateConfirmBuyOutOfStockProductVariant(true)
      return
    }
    //! allow buy over stock product
    if (Number(item.tempQuantity) >= Number(item.quantity) && !item.isAllowed) {
      setStateCurrentProductDataDetail(item)
      setStateConfirmBuyOverStockProductVariant(true)
      return
    }
    const cloneProductListArray: ProductDataType[] = JSON.parse(
      JSON.stringify(stateListProduct?.data)
    )
    const foundIndexVariantGroupInProductList: number =
      cloneProductListArray.findIndex(
        (element) => element.id === item.product_id
      )
    const cloneSelectedProductListArray: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    // check temporary array with list product selected
    const cloneCurrentProductVariantArray: ProductDataType[] = JSON.parse(
      JSON.stringify(stateTemporaryProductVariantDetail)
    )
    const foundIndex = cloneCurrentProductVariantArray.findIndex(
      (element) => element.id === item.id
    )
    if (!item.tempQuantity) {
      // set state selected for parent for product list

      cloneProductListArray[foundIndexVariantGroupInProductList] = {
        ...cloneProductListArray[foundIndexVariantGroupInProductList],
        isSelected: true,

        tempQuantity: cloneProductListArray[foundIndexVariantGroupInProductList]
          .tempQuantity
          ? Number(
              cloneProductListArray[foundIndexVariantGroupInProductList]
                .tempQuantity
            ) + 1
          : 1,
      }
      setStateListProduct((prev: any) => {
        return {
          ...prev,
          data: cloneProductListArray,
        }
      })

      if (stateContactDetail) {
        const newItem = handleCheckIfItemHaveDiscountFromContact(
          cloneCurrentProductVariantArray[foundIndex]
        )
        cloneCurrentProductVariantArray[foundIndex] = newItem
        console.log('new item ', cloneCurrentProductVariantArray[foundIndex])
      } else {
        cloneCurrentProductVariantArray[foundIndex] = {
          ...cloneCurrentProductVariantArray[foundIndex],
          isSelected: true,
          tempQuantity: 1,
          // base_price: cloneCurrentProductVariantArray[foundIndex].retail_price,
        }
      }

      cloneSelectedProductListArray.push(
        cloneCurrentProductVariantArray[foundIndex]
      )
      setStateProductSelected(cloneSelectedProductListArray)
      // is it nesccesary ?
      handleSetItemInLocalStorage(cloneSelectedProductListArray)
      setStateTemporaryProductVariantDetail(cloneCurrentProductVariantArray)
      pushMessage(
        `Add product variant ${cloneCurrentProductVariantArray[foundIndex].name} to order successfully`,
        'success'
      )
      return
    }
    // neu da ton tai trong product detail
    cloneCurrentProductVariantArray[foundIndex] = {
      ...cloneCurrentProductVariantArray[foundIndex],
      tempQuantity:
        Number(cloneCurrentProductVariantArray[foundIndex].tempQuantity) + 1,
    }
    const foundIndexInListProductSelected =
      cloneSelectedProductListArray.findIndex(
        (element) => element.id === item.id
      )
    if (stateContactDetail) {
      const newItem = handleCheckIfItemHaveDiscountFromContact(
        cloneSelectedProductListArray[foundIndexInListProductSelected]
      )
      cloneCurrentProductVariantArray[foundIndex] = newItem
      console.log('new item ', cloneCurrentProductVariantArray[foundIndex])
    } else {
      cloneSelectedProductListArray[foundIndexInListProductSelected] = {
        ...cloneSelectedProductListArray[foundIndexInListProductSelected],
        tempQuantity:
          Number(
            cloneSelectedProductListArray[foundIndexInListProductSelected]
              .tempQuantity
          ) + 1,
      }
    }

    cloneProductListArray[foundIndexVariantGroupInProductList] = {
      ...cloneProductListArray[foundIndexVariantGroupInProductList],
      isSelected: true,
      tempQuantity:
        Number(
          cloneProductListArray[foundIndexVariantGroupInProductList]
            .tempQuantity
        ) + 1,
    }
    setStateListProduct((prev: any) => {
      return {
        ...prev,
        data: cloneProductListArray,
      }
    })
    setStateProductSelected(cloneSelectedProductListArray)

    handleSetItemInLocalStorage(cloneSelectedProductListArray)

    // is it nesccesary ?
    setStateTemporaryProductVariantDetail(cloneCurrentProductVariantArray)
  }

  const handleSelectProductHaveVariant = (item: ProductDataType) => {
    //! allow to buy sold out product
    // if (item.instock === 0) {
    //   return
    // }
    dispatch(loadingActions.doLoading())
    getProductVariantDetail(item.id)
      .then((res) => {
        const { data } = res.data

        if (!data?.variants) return

        const cloneSelectedProductListArray: ProductDataType[] = JSON.parse(
          JSON.stringify(stateProductSelected)
        )

        let result = -1
        data.variants.every((item) => {
          result = cloneSelectedProductListArray.findIndex(
            (idx) => idx.id === item.id
          )

          if (result >= 0) return false
          return true
        })

        if (result < 0) {
          setStateTemporaryProductVariantDetail(data?.variants)
          setStateOpenModalAddProductVariant(true)
          dispatch(loadingActions.doLoadingSuccess())
          return
        }

        const cloneDataVariantFromAPI: ProductDataType[] = JSON.parse(
          JSON.stringify(data.variants)
        )

        cloneDataVariantFromAPI.forEach((obj, id) => {
          const foundIndexInSelectedProductList =
            cloneSelectedProductListArray.findIndex((idx) => idx.id === obj.id)

          if (foundIndexInSelectedProductList >= 0) {
            cloneDataVariantFromAPI[id] = {
              ...cloneSelectedProductListArray[foundIndexInSelectedProductList],
            }
          }
        })
        setStateTemporaryProductVariantDetail(cloneDataVariantFromAPI)

        setStateOpenModalAddProductVariant(true)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  const handleIncreaseTempQuantityForProductVariant = (
    item: ProductDataType,
    index: number
  ) => {
    const cloneArrayListProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateListProduct?.data)
    )
    const indexCurrentProduct = cloneArrayListProduct.findIndex(
      (product) => product.id === item.product_id
    )
    if (indexCurrentProduct >= 0) {
      cloneArrayListProduct[indexCurrentProduct].tempQuantity =
        Number(cloneArrayListProduct[indexCurrentProduct].tempQuantity) + 1
      setStateListProduct((prev: any) => {
        return {
          ...prev,
          data: cloneArrayListProduct,
        }
      })
    }
    const cloneArraySelectedProduct = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    cloneArraySelectedProduct[index].tempQuantity =
      Number(cloneArraySelectedProduct[index].tempQuantity) + 1
    setStateProductSelected(cloneArraySelectedProduct)
    handleSetItemInLocalStorage(cloneArraySelectedProduct)
  }
  const handleDecreaseTempQuantityForProductVariant = (
    item: ProductDataType,
    index: number
  ) => {
    const cloneArrayListProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateListProduct?.data)
    )
    const indexCurrentProduct = cloneArrayListProduct.findIndex(
      (product) => product.id === item.product_id
    )
    if (indexCurrentProduct >= 0 && Number(item.tempQuantity) > 1) {
      cloneArrayListProduct[indexCurrentProduct].tempQuantity =
        Number(cloneArrayListProduct[indexCurrentProduct].tempQuantity) - 1
      setStateListProduct((prev: any) => {
        return {
          ...prev,
          data: cloneArrayListProduct,
        }
      })
    }
    const cloneArraySelectedProduct = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    cloneArraySelectedProduct[index].tempQuantity =
      Number(cloneArraySelectedProduct[index].tempQuantity) - 1
    handleSetItemInLocalStorage(cloneArraySelectedProduct)
    setStateProductSelected(cloneArraySelectedProduct)
  }
  const handleDecreaseTempQuantityForOtherProduct = (index: number) => {
    const cloneArrayOtherProductList: OtherProductType[] = JSON.parse(
      JSON.stringify(stateOtherProductList)
    )
    cloneArrayOtherProductList[index].quantity =
      Number(cloneArrayOtherProductList[index].quantity) - 1
    localStorage.setItem(
      'listOtherProduct',
      JSON.stringify(cloneArrayOtherProductList)
    )
    setStateOtherProductList(cloneArrayOtherProductList)
  }
  const handleIncreaseTempQuantityForOtherProduct = (index: number) => {
    const cloneArrayOtherProductList: OtherProductType[] = JSON.parse(
      JSON.stringify(stateOtherProductList)
    )
    cloneArrayOtherProductList[index].quantity =
      Number(cloneArrayOtherProductList[index].quantity) + 1
    localStorage.setItem(
      'listOtherProduct',
      JSON.stringify(cloneArrayOtherProductList)
    )
    setStateOtherProductList(cloneArrayOtherProductList)
  }

  const handleOnValueChangeTempQuantityForProductVariant = (
    value: NumberFormatValues,
    item: ProductDataType,
    index: number
  ) => {
    // id : product variant id

    const cloneArrayListProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateListProduct?.data)
    )
    const cloneArraySelectedProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    const indexCurrentProduct = cloneArrayListProduct.findIndex(
      (product) => product.id === item.product_id
    )
    const indexCurrentVariantGroup = cloneArraySelectedProduct.findIndex(
      (idx) => idx.id === item.id
    )
    const previousValue: number = JSON.parse(
      JSON.stringify(cloneArraySelectedProduct[index].tempQuantity)
    )
    if (value.value === '') {
      if (indexCurrentProduct >= 0) {
        cloneArrayListProduct[indexCurrentProduct].tempQuantity =
          Number(cloneArrayListProduct[indexCurrentProduct].tempQuantity) -
          previousValue +
          1
        setStateListProduct((prev: any) => {
          return {
            ...prev,
            data: cloneArrayListProduct,
          }
        })
      }
      // check here

      cloneArraySelectedProduct[indexCurrentVariantGroup].tempQuantity = 1
      setStateProductSelected(cloneArraySelectedProduct)
      handleSetItemInLocalStorage(cloneArraySelectedProduct)
    } else if (
      Number(value.floatValue) <=
      Number(item.instock ? Number(item.instock) : Number(item.quantity))
    ) {
      if (indexCurrentProduct >= 0) {
        cloneArrayListProduct[indexCurrentProduct].tempQuantity =
          Number(cloneArrayListProduct[indexCurrentProduct].tempQuantity) -
          previousValue +
          Number(value.floatValue)
        setStateListProduct((prev: any) => {
          return {
            ...prev,
            data: cloneArrayListProduct,
          }
        })
      }

      cloneArraySelectedProduct[indexCurrentVariantGroup].tempQuantity =
        Number(
          cloneArraySelectedProduct[indexCurrentVariantGroup].tempQuantity
        ) -
        previousValue +
        Number(value.floatValue)

      setStateProductSelected(cloneArraySelectedProduct)
      handleSetItemInLocalStorage(cloneArraySelectedProduct)
    }
  }
  const handleOnValueChangeTempQuantityForOtherProduct = (
    value: NumberFormatValues,
    index: number
  ) => {
    const cloneListOtherProduct: OtherProductType[] = JSON.parse(
      JSON.stringify(stateOtherProductList)
    )
    const previousValue = JSON.parse(
      JSON.stringify(cloneListOtherProduct[index].quantity)
    )
    if (value.value === '') {
      cloneListOtherProduct[index].quantity =
        Number(cloneListOtherProduct[index].quantity) - previousValue + 1
      setStateOtherProductList(cloneListOtherProduct)
      localStorage.setItem(
        'listOtherProduct',
        JSON.stringify(cloneListOtherProduct)
      )
      return
    }
    cloneListOtherProduct[index].quantity =
      Number(cloneListOtherProduct[index].quantity) -
      previousValue +
      Number(value.floatValue)
    setStateOtherProductList(cloneListOtherProduct)
    localStorage.setItem(
      'listOtherProduct',
      JSON.stringify(cloneListOtherProduct)
    )
  }
  useEffect(() => {
    const cloneSelectedProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    const cloneOtherProduct: OtherProductType[] = JSON.parse(
      JSON.stringify(stateOtherProductList)
    )
    const total = cloneSelectedProduct.reduce((previous, product) => {
      return (
        Number(previous) +
        Number(product.retail_price) * Number(product.tempQuantity)
      )
    }, 0)
    console.log('total', total)
    const totalOtherProduct = cloneOtherProduct.reduce((previous, product) => {
      return Number(previous) + product.price * product.quantity
    }, 0)
    setStateTotalSelected(Number(total) + Number(totalOtherProduct))
  }, [stateProductSelected, stateOtherProductList])
  useEffect(() => {
    //calculate total for discount
    const cloneSelectedProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    const cloneOtherProduct: OtherProductType[] = JSON.parse(
      JSON.stringify(stateOtherProductList)
    )

    const totalOtherProduct = cloneOtherProduct.reduce((previous, product) => {
      return Number(previous) + product.price * product.quantity
    }, 0)
    console.log('before calculate', cloneSelectedProduct)
    if (!stateContactDetail) {
      setStatePriceSummary((prev) => ({ ...prev, price_discount: 0 }))
      return
    }
    const listProductIdHaveDiscount: number[] = []
    let totalDiscount = 0
    if (stateContactDetail.specific_discount.length > 0) {
      cloneSelectedProduct.forEach((item) => {
        const foundIndex = stateContactDetail.specific_discount.findIndex(
          (obj) => obj.id === item.id
        )
        if (foundIndex >= 0) {
          listProductIdHaveDiscount.push(foundIndex)
          if (
            stateContactDetail.specific_discount[foundIndex].discount.type ===
            'PERCENTAGE'
          ) {
            if (
              stateContactDetail.specific_discount[foundIndex].discount
                .max_discount_amount
            ) {
              const priceDiscount =
                Number(
                  stateContactDetail.specific_discount[foundIndex].discount
                    .max_discount_amount
                ) -
                  (Number(item.retail_price) *
                    Number(item.tempQuantity) *
                    stateContactDetail.specific_discount[foundIndex].discount
                      .discount_amount) /
                    100 >
                0
                  ? (Number(item.retail_price) *
                      Number(item.tempQuantity) *
                      stateContactDetail.specific_discount[foundIndex].discount
                        .discount_amount) /
                    100
                  : Number(
                      stateContactDetail.specific_discount[foundIndex].discount
                        .max_discount_amount
                    )
              totalDiscount += priceDiscount
            } else {
              const priceDiscount =
                (Number(item.retail_price) *
                  Number(item.tempQuantity) *
                  stateContactDetail.specific_discount[foundIndex].discount
                    .discount_amount) /
                100
              totalDiscount += priceDiscount
            }
          }
          if (
            stateContactDetail.specific_discount[foundIndex].discount.type ===
            'FIXED'
          ) {
            const priceDiscount =
              stateContactDetail.specific_discount[foundIndex].discount
                .discount_amount -
                Number(item.retail_price) * Number(item.tempQuantity) >
              0
                ? truncateToTwoDecimalPlaces(
                    stateContactDetail.specific_discount[foundIndex].discount
                      .discount_amount -
                      Number(item.retail_price) * Number(item.tempQuantity)
                  )
                : stateContactDetail.specific_discount[foundIndex].discount
                    .discount_amount
            totalDiscount += priceDiscount
          }
        }
      })
    }
    const filteredAfterApplySpecific = cloneSelectedProduct.filter(
      (item) => !listProductIdHaveDiscount.includes(item.id)
    )
    let temporaryRemainingTotal = filteredAfterApplySpecific.reduce(
      (prev, current) => {
        return (
          Number(prev) +
          Number(current.retail_price) * Number(current.tempQuantity)
        )
      },
      0
    )
    temporaryRemainingTotal += totalOtherProduct
    if (stateContactDetail.general_discount) {
      if (stateContactDetail.general_discount.type === 'PERCENTAGE') {
        if (stateContactDetail.general_discount.max_discount_amount) {
          const priceDiscount =
            (temporaryRemainingTotal *
              stateContactDetail.general_discount.discount_amount) /
              100 -
              stateContactDetail.general_discount.max_discount_amount >=
            0
              ? stateContactDetail.general_discount.max_discount_amount
              : truncateToTwoDecimalPlaces(
                  (temporaryRemainingTotal *
                    stateContactDetail.general_discount.discount_amount) /
                    100
                )
          totalDiscount += priceDiscount
        } else {
          const priceDiscount = truncateToTwoDecimalPlaces(
            (temporaryRemainingTotal *
              stateContactDetail.general_discount.discount_amount) /
              100
          )
          totalDiscount += priceDiscount
        }
      }
      if (stateContactDetail.general_discount.type === 'FIXEDAMOUNT') {
        const priceDiscount =
          stateContactDetail.general_discount.discount_amount -
            temporaryRemainingTotal >
          0
            ? truncateToTwoDecimalPlaces(
                stateContactDetail.general_discount.discount_amount -
                  temporaryRemainingTotal
              )
            : stateContactDetail.general_discount.discount_amount
        totalDiscount += priceDiscount
      }
    }
    // const total = cloneSelectedProduct.reduce((previous, product) => {
    //   console.log('product.discount', product.price_discount)
    //   return (
    //     Number(previous) +
    //     Number(product.price_discount ? product.price_discount : 0) *
    //       Number(product.tempQuantity)
    //   )
    // }, 0)
    setStatePriceSummary((prev) => ({ ...prev, price_discount: totalDiscount }))
  }, [stateProductSelected, stateContactDetail, stateOtherProductList])

  useEffect(() => {
    //calculate total for voucher
    const cloneSelectedProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    const cloneOtherProduct: OtherProductType[] = JSON.parse(
      JSON.stringify(stateOtherProductList)
    )
    const totalOtherProduct = cloneOtherProduct.reduce((previous, product) => {
      return Number(previous) + product.price * product.quantity
    }, 0)
    console.log('before calculate', cloneSelectedProduct)
    if (!stateCurrentVoucher) {
      setStatePriceSummary((prev) => ({ ...prev, apply_voucher_price: 0 }))
      return
    }
    const totalOrigin = cloneSelectedProduct.reduce((previous, product) => {
      console.log('product.discount', product.price_discount)
      return (
        Number(previous) +
        Number(product.retail_price) * Number(product.tempQuantity)
      )
    }, 0)
    if (
      totalOrigin + totalOtherProduct <
      Number(stateCurrentVoucher.minimum_spend)
    ) {
      setStatePriceSummary((prev) => ({ ...prev, apply_voucher_price: 0 }))
      pushMessage('Voucher do not meet minimum spending conditions', 'error')
      return
    }
    if (
      stateCurrentVoucher.product_coverage === 'ALL' &&
      stateCurrentVoucher.type === 'FIXEDAMOUNT'
    ) {
      setStatePriceSummary((prev) => ({
        ...prev,
        apply_voucher_price:
          totalOrigin +
            totalOtherProduct -
            stateCurrentVoucher.discount_amount >
          0
            ? stateCurrentVoucher.discount_amount
            : truncateToTwoDecimalPlaces(
                totalOrigin +
                  totalOtherProduct -
                  stateCurrentVoucher.discount_amount
              ),
      }))
      return
    }
    if (
      stateCurrentVoucher.product_coverage === 'ALL' &&
      stateCurrentVoucher.type === 'PERCENTAGE'
    ) {
      if (stateCurrentVoucher.max_discount_amount) {
        setStatePriceSummary((prev) => ({
          ...prev,
          apply_voucher_price:
            ((totalOrigin + totalOtherProduct) *
              stateCurrentVoucher.discount_amount) /
              100 >=
            Number(stateCurrentVoucher.max_discount_amount)
              ? Number(stateCurrentVoucher.max_discount_amount)
              : truncateToTwoDecimalPlaces(
                  ((totalOrigin + totalOtherProduct) *
                    stateCurrentVoucher.discount_amount) /
                    100
                ),
        }))
      } else {
        setStatePriceSummary((prev) => ({
          ...prev,
          apply_voucher_price: truncateToTwoDecimalPlaces(
            ((totalOrigin + totalOtherProduct) *
              stateCurrentVoucher.discount_amount) /
              100
          ),
        }))
      }
    }
    if (stateCurrentVoucher.product_coverage === 'SPECIFIC') {
      let totalPriceDiscount = 0
      if (stateCurrentVoucher.specific_products.length > 0) {
        cloneSelectedProduct.forEach((item) => {
          const foundIndex = stateCurrentVoucher.specific_products.findIndex(
            (obj) => obj.id === item.id
          )
          console.log('foundIndex', foundIndex)
          if (foundIndex >= 0) {
            if (stateCurrentVoucher.type === 'PERCENTAGE') {
              if (stateCurrentVoucher.max_discount_amount) {
                const priceDiscount =
                  stateCurrentVoucher.max_discount_amount -
                    (Number(item.retail_price) *
                      Number(item.tempQuantity) *
                      stateCurrentVoucher.discount_amount) /
                      100 >
                  0
                    ? (Number(item.retail_price) *
                        Number(item.tempQuantity) *
                        stateCurrentVoucher.discount_amount) /
                      100
                    : stateCurrentVoucher.max_discount_amount
                console.log('priceDiscount', priceDiscount)
                totalPriceDiscount += priceDiscount
              } else {
                const priceDiscount =
                  (Number(item.retail_price) *
                    Number(item.tempQuantity) *
                    stateCurrentVoucher.discount_amount) /
                  100

                totalPriceDiscount += priceDiscount
              }
            }
            if (stateCurrentVoucher.type === 'FIXEDAMOUNT') {
              const priceDiscount =
                stateCurrentVoucher.discount_amount -
                  Number(item.retail_price) * Number(item.tempQuantity) >
                0
                  ? truncateToTwoDecimalPlaces(
                      stateCurrentVoucher.discount_amount -
                        Number(item.retail_price) * Number(item.tempQuantity)
                    )
                  : stateCurrentVoucher.discount_amount
              totalPriceDiscount += priceDiscount
            }
          }
        })
      }
      setStatePriceSummary((prev) => ({
        ...prev,
        apply_voucher_price: totalPriceDiscount,
      }))
    }
  }, [stateCurrentVoucher, stateOtherProductList, stateProductSelected])
  console.log('watchTip', watchTip('tip'))
  const tip = watchTip('tip')

  useDeepCompareEffect(
    () => {
      console.log('run')
      let discountPrice = 0
      if (stateContactDetail && stateCurrentVoucher) {
        if (stateCurrentRadioDiscount === 'customer') {
          discountPrice = statePriceSummary.price_discount
        } else {
          discountPrice = statePriceSummary.apply_voucher_price
        }
      } else {
        if (stateContactDetail) {
          discountPrice = statePriceSummary.price_discount
        }
        if (stateCurrentVoucher) {
          discountPrice = statePriceSummary.apply_voucher_price
        }
      }
      let totalSummary =
        (truncateToTwoDecimalPlaces(stateTotalSelected) * 100 -
          truncateToTwoDecimalPlaces(discountPrice) * 100 +
          (tip ? tip * 100 : 0)) /
        100

      console.log('watchTip', watchTip('tip'))
      console.log('totalSummar', totalSummary)
      if (stateSwitchRoundedUp) {
        totalSummary = Math.ceil(totalSummary)
      }
      setStateFinalTotal(totalSummary > 0 ? totalSummary : 0)
    },
    // query is a string, but variables is an object. With the way Query is used
    // in the example above, `variables` will be a new object every render.
    // useDeepCompareEffect will do a deep comparison and your callback is only
    // run when the variables object actually has changes.
    [
      stateTotalSelected,
      statePriceSummary,
      tip,
      stateContactDetail,
      stateCurrentVoucher,
      stateCurrentRadioDiscount,
      stateSwitchRoundedUp,
    ]
  )
  const handleGetProductRetailOrder = useCallback(
    (query: any) => {
      dispatch(loadingActions.doLoading())
      console.log(
        'statelistproductfrom local storage',
        stateListProductSelectedFromLocalStorage
      )
      getProductForRetailOrder({
        ...query,
        category: handleIdQuery(query?.category),
        manufacturer: handleIdQuery(query?.manufacturer),
        brand: handleIdQuery(query?.brand),
      })
        .then((res) => {
          const { data } = res

          if (
            stateListProductSelectedFromLocalStorage &&
            stateListProductSelectedFromLocalStorage.length > 0
          ) {
            const temporaryListProductSelected: ProductDataType[] = JSON.parse(
              JSON.stringify(stateListProductSelectedFromLocalStorage)
            )
            const temporaryListProductFromAPI: ProductDataType[] = JSON.parse(
              JSON.stringify(data.data)
            )
            for (let i = 0; i < temporaryListProductFromAPI.length; i++) {
              for (let j = 0; j < temporaryListProductSelected.length; j++) {
                if (
                  temporaryListProductSelected[j].id ===
                  temporaryListProductFromAPI[i].id
                ) {
                  temporaryListProductFromAPI[i] = {
                    ...temporaryListProductFromAPI[i],
                    isSelected: true,
                    isAllowed: temporaryListProductSelected[j].isAllowed,
                    tempQuantity: Number(
                      temporaryListProductSelected[j].tempQuantity
                    ),
                  }
                  continue
                }

                if (
                  temporaryListProductSelected[j].product_id ===
                  temporaryListProductFromAPI[i].id
                ) {
                  //! double the tempquantity

                  temporaryListProductFromAPI[i] = {
                    ...temporaryListProductFromAPI[i],
                    isSelected: true,
                    isAllowed: temporaryListProductSelected[j].isAllowed,
                    tempQuantity: temporaryListProductFromAPI[i].tempQuantity
                      ? Number(temporaryListProductFromAPI[i].tempQuantity) +
                        Number(temporaryListProductSelected[j].tempQuantity)
                      : Number(temporaryListProductSelected[j].tempQuantity),
                  }
                }
                // temp
              }
            }

            setStateListProduct({
              ...data,
              data: temporaryListProductFromAPI,
            })
            setStateHasMore(data?.nextPage == null ? false : true)
            dispatch(loadingActions.doLoadingSuccess())

            return
          }
          setStateListProduct(data)
          setStateHasMore(data?.nextPage == null ? false : true)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          const { status, data } = response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    },
    [stateListProductSelectedFromLocalStorage]
  )

  const handleIdQuery = (value: string | null) => {
    if (!value) return
    const newArr = value
      .split(',')
      .map(function (item: string) {
        return item.slice(0, item.indexOf('-'))
      })
      .toString()
    return newArr
  }
  useEffect(() => {
    if (localStorage.getItem('listSelectedProduct') !== null) {
      setStateListProductSelectedFromLocalStorage(
        JSON.parse(String(localStorage.getItem('listSelectedProduct')))
      )
      setStateProductSelected(
        JSON.parse(String(localStorage.getItem('listSelectedProduct')))
      )
    }
    if (localStorage.getItem('listOtherProduct') !== null) {
      setStateOtherProductList(
        JSON.parse(String(localStorage.getItem('listOtherProduct')))
      )
    }
  }, [])

  // useEffect(() => {
  //   handleGetProductRetailOrder(router.query)
  // }, [router.query])
  useEffect(() => {
    handleGetProductRetailOrder(router.query)
  }, [handleGetProductRetailOrder, router.query])

  const handleReset = () => {
    resetFilter({
      category: [],
      brand: [],
      manufacturer: [],
      instock_gte: 0,
      instock_lte: 0,
      retail_price_gte: 0,
      retail_price_lte: 0,
    })

    router.replace({
      search: `${objToStringParam({
        page: 1,
        limit: router.query.limit,
      })}`,
    })
    handleCloseMenuFilter()
  }

  const renderResult = () => {
    if (!stateListProduct?.data) {
      return (
        <Box mb={4} sx={{ padding: '0 20px' }}>
          <Grid container spacing={2}>
            {Array.from(Array(limit ? 18 : 16).keys()).map((index: number) => (
              <GridProduct xs={2.4} key={index}>
                <CardCustom variant="outlined">
                  <Box mb={1}>
                    <Skeleton animation="wave" variant="rounded" height={204} />
                  </Box>
                  <CardContent style={{ paddingBottom: '16px' }}>
                    <Skeleton variant="text" sx={{ fontSize: '1.4rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.6rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.6rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
                  </CardContent>
                </CardCustom>
              </GridProduct>
            ))}
          </Grid>
        </Box>
      )
    }
    if (stateListProduct?.data?.length === 0) {
      return (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Image
            src={'/' + '/images/not-found.svg'}
            alt="Logo"
            width="300"
            height="300"
          />
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            {t('create.listRender.thereAreNoAvailableProductsAtThisTime')}
          </Typography>
        </Grid>
      )
    }
    return (
      <InfiniteScroll
        dataLength={Number(stateListProduct?.data?.length)}
        next={() => fetchMoreData(Number(stateListProduct?.nextPage))}
        hasMore={stateHasMore}
        loader={
          <LinearProgress
            style={{
              margin: '20px',
            }}
          />
        }
        height={'calc(100vh - 178px)'}
        endMessage={<Box sx={{ marginBottom: '100px' }}></Box>}
      >
        <Box sx={{ padding: '0 20px' }}>
          <Grid container spacing={2}>
            {stateListProduct?.data.map(
              (item: ProductDataType, index: number) => {
                if (item.is_active) {
                  return (
                    <GridProduct
                      // lg={3}
                      // xl={2}
                      xs={4}
                      lg={2.4}
                      key={index}
                      onClick={() => {
                        if (Number(item.variants_count) > 0) {
                          handleSelectProductHaveVariant(item)
                          return
                        }
                        handleSelectProduct(item, index)
                      }}
                    >
                      <ItemProduct dataProduct={item} />
                    </GridProduct>
                  )
                }
              }
            )}
          </Grid>
        </Box>
      </InfiniteScroll>
    )
  }

  const changeInputFormFilter = (event: any) => {
    const {
      target: { value },
    } = event
    const {
      target: { name },
    } = event

    if (!value) {
      setValueFilter(name, null, {
        shouldValidate: true,
      })
    } else {
      setValueFilter(name, parseFloat(value.replace(/,/g, '')), {
        shouldValidate: true,
      })
    }
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const onSubmitSearch = (values: any) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          key: values.search,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }
  const onSubmitFilter = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        category: values.category.toString(),
        brand: values.brand.toString(),
        manufacturer: values.manufacturer.toString(),
        instock_gte:
          typeof values.instock_gte === 'string'
            ? parseInt(values.instock_gte?.replace(/,/g, ''))
            : values.instock_gte,
        instock_lte:
          typeof values.instock_lte === 'string'
            ? parseInt(values.instock_lte?.replace(/,/g, ''))
            : values.instock_lte,
        retail_price_gte:
          typeof values.retail_price_gte === 'string'
            ? parseInt(values.retail_price_gte?.replace(/,/g, ''))
            : values.retail_price_gte,
        retail_price_lte:
          typeof values.price_lte === 'string'
            ? parseInt(values.retail_price_lte?.replace(/,/g, ''))
            : values.retail_price_lte,
        page: 1,
      })}`,
    })

    handleCloseMenuFilter()
  }
  const handleSetItemInLocalStorage = (arr: ProductDataType[]) => {
    localStorage.setItem('listSelectedProduct', JSON.stringify(arr))
  }
  const handleCheckoutAfterSelectPaymentMethod = () => {
    setStateMethodForm(true)
  }
  const handleOpenAddOtherProductForm = () => {
    setStateAddOtherProductForm(true)
  }
  const handleSubmitAddOtherProduct = (value: OtherProductType) => {
    const cloneArray: OtherProductType[] = JSON.parse(
      JSON.stringify(stateOtherProductList)
    )
    cloneArray.push(value)
    localStorage.setItem('listOtherProduct', JSON.stringify(cloneArray))

    setStateOtherProductList(cloneArray)
  }
  const handleDeleteOtherProduct = (index: number) => {
    const cloneArray: OtherProductType[] = JSON.parse(
      JSON.stringify(stateOtherProductList)
    )
    cloneArray.splice(index, 1)
    if (cloneArray.length === 0) {
      localStorage.removeItem('listOtherProduct')
    } else {
      localStorage.setItem('listOtherProduct', JSON.stringify(cloneArray))
    }

    setStateOtherProductList(cloneArray)
    pushMessage(t('create.message.deleteProductSuccessfully'), 'success')
  }
  const handleOpenEditPriceForOtherProduct = (
    index: number,
    item: OtherProductType
  ) => {
    setStateCurrentOtherProductIndex(index)
    setStateHandleOpenEditPriceForOtherProduct(true)
    setStateCurrentOtherProductDetail(item)
  }
  const handleOpenEditPriceForProduct = (
    item: ProductDataType,
    index: number
  ) => {
    setStateHandleOpenEditPriceForProduct(true)
    setStateCurrentProductIndex(index)
    setStateCurrentProductDataDetail(item)
  }
  const handleSubmitEditPriceForOtherProduct = (
    value: number,
    index: number
  ) => {
    const cloneArrayOtherProduct: OtherProductType[] = JSON.parse(
      JSON.stringify(stateOtherProductList)
    )
    cloneArrayOtherProduct[index].price = value
    localStorage.setItem(
      'listOtherProduct',
      JSON.stringify(cloneArrayOtherProduct)
    )

    setStateOtherProductList(cloneArrayOtherProduct)
    setStateHandleOpenEditPriceForOtherProduct(false)
    pushMessage(t('create.message.editPriceSuccessfully'), 'success')
  }
  const handleSubmitEditPriceForProduct = (value: number, index: number) => {
    const cloneArraySelectedProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    cloneArraySelectedProduct[index].retail_price = value
    cloneArraySelectedProduct[index].edited_price = value

    // store base price

    localStorage.setItem(
      'listSelectedProduct',
      JSON.stringify(cloneArraySelectedProduct)
    )
    setStateProductSelected(cloneArraySelectedProduct)

    setStateHandleOpenEditPriceForProduct(false)
    pushMessage(t('create.message.editPriceSuccessfully'), 'success')
  }

  const handleClickAllowToBuyOverStockProduct = () => {
    const cloneListProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateListProduct?.data)
    )
    const cloneSelectedProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    const foundIndex = cloneSelectedProduct.findIndex(
      (item) => item.id === cloneListProduct[stateCurrentProductIndex].id
    )

    cloneListProduct[stateCurrentProductIndex] = {
      ...cloneListProduct[stateCurrentProductIndex],
      isAllowed: true,
      tempQuantity:
        Number(cloneListProduct[stateCurrentProductIndex].tempQuantity) + 1,
    }

    setStateListProduct((prev: any) => {
      return {
        ...prev,
        data: cloneListProduct,
      }
    })
    if (foundIndex < 0) return
    cloneSelectedProduct[foundIndex] = {
      ...cloneSelectedProduct[foundIndex],
      isAllowed: true,
      tempQuantity: Number(cloneSelectedProduct[foundIndex].tempQuantity) + 1,
    }
    setStateProductSelected(cloneSelectedProduct)
    setStateConfirmBuyOverStockProduct(false)
  }
  const handleClickIncreaseTempQuantityAllowToBuyOverStockProduct = () => {
    if (!stateListProduct) return
    const cloneSelectedProductList: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    const cloneProductList: ProductDataType[] = JSON.parse(
      JSON.stringify(stateListProduct?.data)
    )

    cloneSelectedProductList[stateCurrentProductIndex] = {
      ...cloneSelectedProductList[stateCurrentProductIndex],
      isAllowed: true,
      tempQuantity:
        Number(
          cloneSelectedProductList[stateCurrentProductIndex].tempQuantity
        ) + 1,
    }
    setStateProductSelected(cloneSelectedProductList)
    const foundIndex = cloneProductList.findIndex(
      (product: ProductDataType) => {
        if (cloneSelectedProductList[stateCurrentProductIndex].product_id) {
          return (
            product.id ===
            cloneSelectedProductList[stateCurrentProductIndex].product_id
          )
        }
        return (
          product.id ===
            cloneSelectedProductList[stateCurrentProductIndex].id &&
          product.variants_count === 0
        )
      }
    )

    if (foundIndex >= 0) {
      cloneProductList[foundIndex] = {
        ...cloneProductList[foundIndex],
        isAllowed: true,
        tempQuantity: Number(cloneProductList[foundIndex].tempQuantity) + 1,
      }
      setStateListProduct((prev: any) => {
        return {
          ...prev,
          data: cloneProductList,
        }
      })
    }
    setStateConfirmBuyOverStockProductIncrease(false)
  }
  const handleClickAllowToBuyOverStockProductVariant = () => {
    const cloneProductList: ProductDataType[] = JSON.parse(
      JSON.stringify(stateListProduct?.data)
    )
    const foundIndexVariantGroupInProductList: number =
      cloneProductList.findIndex(
        (element) => element.id === stateCurrentProductDataDetail?.product_id
      )
    const cloneSelectedProductListArray: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    const cloneCurrentProductVariantArray: ProductDataType[] = JSON.parse(
      JSON.stringify(stateTemporaryProductVariantDetail)
    )
    const foundIndex = cloneCurrentProductVariantArray.findIndex(
      (element) => element.id === stateCurrentProductDataDetail?.id
    )
    cloneCurrentProductVariantArray[foundIndex] = {
      ...cloneCurrentProductVariantArray[foundIndex],
      tempQuantity:
        Number(cloneCurrentProductVariantArray[foundIndex].tempQuantity) + 1,
      isAllowed: true,
    }
    const foundIndexInListProductSelected =
      cloneSelectedProductListArray.findIndex(
        (element) => element.id === stateCurrentProductDataDetail?.id
      )
    cloneSelectedProductListArray[foundIndexInListProductSelected] = {
      ...cloneSelectedProductListArray[foundIndexInListProductSelected],
      tempQuantity:
        Number(
          cloneSelectedProductListArray[foundIndexInListProductSelected]
            .tempQuantity
        ) + 1,
      isAllowed: true,
    }
    cloneProductList[foundIndexVariantGroupInProductList] = {
      ...cloneProductList[foundIndexVariantGroupInProductList],
      isSelected: true,
      tempQuantity:
        Number(
          cloneProductList[foundIndexVariantGroupInProductList].tempQuantity
        ) + 1,
      isAllowed: true,
    }
    setStateListProduct((prev: any) => {
      return {
        ...prev,
        data: cloneProductList,
      }
    })
    setStateProductSelected(cloneSelectedProductListArray)
    handleSetItemInLocalStorage(cloneSelectedProductListArray)

    setStateTemporaryProductVariantDetail(cloneCurrentProductVariantArray)
    setStateConfirmBuyOverStockProductVariant(false)
  }

  const handleClickAllowToBuyProductOutOfStock = () => {
    const cloneProductList: ProductDataType[] = JSON.parse(
      JSON.stringify(stateListProduct?.data)
    )
    const cloneSelectedProductList: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    const foundIndex = cloneProductList.findIndex(
      (item) =>
        item.id === cloneProductList[stateCurrentProductIndex].id &&
        !item.variants_count
    )
    if (stateContactDetail) {
      const newItem = handleCheckIfItemHaveDiscountFromContact(
        cloneProductList[foundIndex]
      )
      cloneProductList[foundIndex] = {
        ...newItem,
        isAllowed: true,
      }
    }
    {
      cloneProductList[foundIndex] = {
        ...cloneProductList[foundIndex],
        retail_price: cloneProductList[foundIndex].min_retail_price,
        base_price: cloneProductList[foundIndex].min_retail_price,
        isSelected: true,
        tempQuantity: 1,
        isAllowed: true,
      }
    }

    setStateListProduct((prev: any) => {
      return {
        ...prev,
        data: cloneProductList,
      }
    })

    cloneSelectedProductList.push(cloneProductList[stateCurrentProductIndex])
    handleSetItemInLocalStorage(cloneSelectedProductList)
    setStateProductSelected(cloneSelectedProductList)

    setStateConfirmBuyOutOfStockProduct(false)
  }
  const handleClickAllowToBuyProductVariantOutOfStock = () => {
    const cloneProductListArray: ProductDataType[] = JSON.parse(
      JSON.stringify(stateListProduct?.data)
    )
    const cloneCurrentProductVariantArray: ProductDataType[] = JSON.parse(
      JSON.stringify(stateTemporaryProductVariantDetail)
    )
    const cloneSelectedProductListArray: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    const foundIndexVariantGroupInProductList: number =
      cloneProductListArray.findIndex(
        (element) => element.id === stateCurrentProductDataDetail?.product_id
      )
    const foundIndex = cloneCurrentProductVariantArray.findIndex(
      (element) => element.id === stateCurrentProductDataDetail?.id
    )
    if (stateContactDetail) {
      const newItem = handleCheckIfItemHaveDiscountFromContact(
        cloneCurrentProductVariantArray[foundIndex]
      )
      cloneCurrentProductVariantArray[foundIndex] = {
        ...newItem,
        isAllowed: true,
      }
    } else {
      cloneCurrentProductVariantArray[foundIndex] = {
        ...cloneCurrentProductVariantArray[foundIndex],
        base_price: cloneCurrentProductVariantArray[foundIndex].retail_price,
        isSelected: true,
        tempQuantity: 1,
        isAllowed: true,
      }
    }

    cloneSelectedProductListArray.push(
      cloneCurrentProductVariantArray[foundIndex]
    )
    // set state for product list

    cloneProductListArray[foundIndexVariantGroupInProductList] = {
      ...cloneProductListArray[foundIndexVariantGroupInProductList],
      isSelected: true,
      tempQuantity: cloneProductListArray[foundIndexVariantGroupInProductList]
        .tempQuantity
        ? Number(
            cloneProductListArray[foundIndexVariantGroupInProductList]
              .tempQuantity
          ) + 1
        : 1,
    }
    setStateListProduct((prev: any) => {
      return {
        ...prev,
        data: cloneProductListArray,
      }
    })
    setStateProductSelected(cloneSelectedProductListArray)
    // is it nesccesary ?
    handleSetItemInLocalStorage(cloneSelectedProductListArray)
    setStateTemporaryProductVariantDetail(cloneCurrentProductVariantArray)

    setStateConfirmBuyOutOfStockProductVariant(false)

    return
  }
  //! scan barcode function
  let barcodeScan = ''
  useEffect(() => {
    function handleKeydown(e: any) {
      if (
        e.keyCode === 13 &&
        barcodeScan.length > 3 &&
        barcodeScan.substring(0, 3) === 'TWS'
      ) {
        handleScanBarcode(barcodeScan)
        return
      }
      if (e.keyCode === 16) {
        return
      }
      barcodeScan += e.key
    }
    // setTimeout(() => {
    //   barcodeScan = ''
    // }, 100)

    document.addEventListener('keydown', handleKeydown)
    return function cleanup() {
      document.removeEventListener('keydown', handleKeydown)
    }
  })
  const handleGetProductFromBarcode = (item: ProductDataType) => {
    //! allow buy sold out product
    //deep copy array list product selected
    const cloneSelectedProductListArray: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    console.log('foundIndex')
    const foundIndex = cloneSelectedProductListArray.findIndex(
      (obj) => obj.id === item.id
    )
    if (item.instock === 0 && !item.isAllowed && foundIndex < 0) {
      setStateConfirmBuyOutOfStockForBarcode(true)
      // setStateCurrentProductIndex(index)
      setStateCurrentProductFromBarcode(item)
      return
    }

    if (
      foundIndex >= 0 &&
      item.instock === cloneSelectedProductListArray[foundIndex].tempQuantity &&
      !item.isAllowed
    ) {
      setStateConfirmBuyOverStockForBarcode(true)

      setStateCurrentProductFromBarcode(item)
      // setStateCurrentProductIndex(index)
      return
    }
    if (!cloneSelectedProductListArray.some((obj) => obj.id === item.id)) {
      const newProduct: ProductDataType = {
        ...item,
        retail_price: item.retail_price,
        isSelected: true,
        tempQuantity: 1,
      }

      cloneSelectedProductListArray.push(newProduct)
      handleSetItemInLocalStorage(cloneSelectedProductListArray)
      setStateProductSelected(cloneSelectedProductListArray)
      setStateListProductSelectedFromLocalStorage(cloneSelectedProductListArray)
      pushMessage(t('create.message.addToCartSuccessfully'), 'success')
    } else {
      const indexDuplicateProduct = cloneSelectedProductListArray.findIndex(
        (product) => product.id === item.id
      )

      if (indexDuplicateProduct >= 0) {
        cloneSelectedProductListArray[indexDuplicateProduct] = {
          ...cloneSelectedProductListArray[indexDuplicateProduct],
          retail_price:
            cloneSelectedProductListArray[indexDuplicateProduct].retail_price,

          tempQuantity:
            Number(
              cloneSelectedProductListArray[indexDuplicateProduct].tempQuantity
            ) + 1,
        }
      }
      setStateProductSelected(cloneSelectedProductListArray)
      handleSetItemInLocalStorage(cloneSelectedProductListArray)
      setStateListProductSelectedFromLocalStorage(cloneSelectedProductListArray)
      pushMessage(t('create.message.addToCartSuccessfully'), 'success')
    }
  }
  const handleAllowToBuyProductOutOfStockFromBarcode = () => {
    if (!stateCurrentProductFromBarcode) return

    const cloneSelectedProductList: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )

    const productOutOfStock: ProductDataType = {
      ...stateCurrentProductFromBarcode,
      retail_price: stateCurrentProductFromBarcode?.retail_price
        ? stateCurrentProductFromBarcode?.retail_price
        : stateCurrentProductFromBarcode?.min_retail_price,
      base_price: stateCurrentProductFromBarcode?.retail_price
        ? stateCurrentProductFromBarcode?.retail_price
        : stateCurrentProductFromBarcode?.min_retail_price,
      isSelected: true,
      tempQuantity: 1,
      isAllowed: true,
    }

    cloneSelectedProductList.push(productOutOfStock)
    handleSetItemInLocalStorage(cloneSelectedProductList)
    setStateProductSelected(cloneSelectedProductList)
    setStateListProductSelectedFromLocalStorage(cloneSelectedProductList)
    setStateConfirmBuyOutOfStockForBarcode(false)
  }
  const handleClickAllowToBuyOverStockProductFromBarcode = () => {
    if (!stateCurrentProductFromBarcode) return
    const cloneSelectedProduct: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    const foundIndex = cloneSelectedProduct.findIndex(
      (obj) => obj.id === stateCurrentProductFromBarcode?.id
    )
    if (foundIndex < 0) return

    cloneSelectedProduct[foundIndex] = {
      ...cloneSelectedProduct[foundIndex],
      isAllowed: true,
      tempQuantity: Number(cloneSelectedProduct[foundIndex].tempQuantity) + 1,
    }

    setStateProductSelected(cloneSelectedProduct)
    setStateListProductSelectedFromLocalStorage(cloneSelectedProduct)
    setStateConfirmBuyOverStockForBarcode(false)
  }
  const handleScanBarcode = (barcode: string) => {
    getListProductByBarcode(barcode)
      .then((res) => {
        const { data } = res.data
        console.log('getlistproductbybarcode', data)
        if (data.length === 0) {
          pushMessage(t('create.message.invalidBarcode'), 'error')
          return
        }
        handleGetProductFromBarcode(data[0])
        barcodeScan = ''
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleAddContactToRetail = (contact: ContactDetailType) => {
    //deep copy array list product selected
    setStateContactDetail(contact)
    // console.log('contact detail', contact)
    // const cloneSelectedProductListArray: ProductDataType[] = JSON.parse(
    //   JSON.stringify(stateProductSelected)
    // )
    // let totalDiscount = 0
    // for (let i = 0; i < cloneSelectedProductListArray.length; i++) {
    //   if (contact.specific_discount.length > 0) {
    //     const foundIndex = contact.specific_discount.findIndex(
    //       (item) => item.id === cloneSelectedProductListArray[i].id
    //     )
    //     if (foundIndex >= 0) {
    //       let contactPriceDiscount = 0
    //       if (
    //         contact.specific_discount[foundIndex].discount.type === 'PERCENTAGE'
    //       ) {
    //         const currentSelectProductPrice = cloneSelectedProductListArray[i]
    //           .edited_price
    //           ? cloneSelectedProductListArray[i].edited_price
    //           : cloneSelectedProductListArray[i].base_price
    //         if (
    //           (Number(currentSelectProductPrice) *
    //             contact.specific_discount[foundIndex].discount
    //               .discount_amount) /
    //             100 <=
    //           Number(
    //             contact.specific_discount[foundIndex].discount
    //               .max_discount_amount
    //           )
    //         ) {
    //           contactPriceDiscount =
    //             (Number(currentSelectProductPrice) *
    //               contact.specific_discount[foundIndex].discount
    //                 .discount_amount) /
    //             100
    //         } else {
    //           contactPriceDiscount = Number(
    //             contact.specific_discount[foundIndex].discount
    //               .max_discount_amount
    //           )
    //         }
    //       } else {
    //         contactPriceDiscount =
    //           contact.specific_discount[foundIndex].discount.discount_amount
    //       }

    //       cloneSelectedProductListArray[i] = {
    //         ...cloneSelectedProductListArray[i],
    //         price_discount: contactPriceDiscount,
    //       }
    //       totalDiscount += contactPriceDiscount
    //       continue
    //     }
    //   }
    //   if (contact.general_discount) {
    //     if (
    //       contact.general_discount.max_discount_amount &&
    //       (Number(cloneSelectedProductListArray[i].retail_price) *
    //         contact.general_discount.discount_amount) /
    //         100 >=
    //         contact.general_discount.max_discount_amount
    //     ) {
    //       cloneSelectedProductListArray[i] = {
    //         ...cloneSelectedProductListArray[i],
    //         price_discount: contact.general_discount.max_discount_amount,
    //       }

    //       totalDiscount += contact.general_discount.max_discount_amount
    //     } else {
    //       cloneSelectedProductListArray[i] = {
    //         ...cloneSelectedProductListArray[i],
    //         price_discount:
    //           (Number(cloneSelectedProductListArray[i].retail_price) *
    //             contact.general_discount.discount_amount) /
    //           100,
    //       }

    //       totalDiscount +=
    //         (Number(cloneSelectedProductListArray[i].retail_price) *
    //           contact.general_discount.discount_amount) /
    //         100
    //     }
    //   }
    // }
    // setStatePriceSummary((prev) => ({
    //   ...prev,
    //   price_discount: totalDiscount,
    // }))
    // setStateProductSelected(cloneSelectedProductListArray)
    // handleSetItemInLocalStorage(cloneSelectedProductListArray)
    pushMessage('Add customer to retail order successfully', 'success')
  }

  const handleDeleteContactRetail = () => {
    setStateContactDetail(undefined)
    const cloneSelectedProductListArray: ProductDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    for (let i = 0; i < cloneSelectedProductListArray.length; i++) {
      if (cloneSelectedProductListArray[i].price_discount) {
        delete cloneSelectedProductListArray[i].price_discount
      }
    }
    setStatePriceSummary((prev) => ({ ...prev, price_discount: 0 }))
    setStateProductSelected(cloneSelectedProductListArray)
    handleSetItemInLocalStorage(cloneSelectedProductListArray)
  }

  // useEffect(() => {
  //   ;(() => {
  //     // Beginning of function
  //     if (window.performance) {
  //       if (performance.navigation.type == 1) {
  //         if (stateProductSelected.length > 0) {
  //           console.log('window.performance', stateProductSelected)

  //           const newArray = stateProductSelected.map((item) => {
  //             return {
  //               ...item,
  //               retail_price: item.edited_price
  //                 ? item.edited_price
  //                 : item.base_price,
  //               price_discount: undefined,
  //             }
  //           })
  //           handleSetItemInLocalStorage(newArray)
  //         }
  //       }
  //     }
  //   })()
  // }, [stateProductSelected])
  // End of function //calls the function execution e.g. myFunc()
  const onSubmitVoucher = (value: VoucherCodeType) => {
    console.log('onSubmitVoucher', value)
    let paramForClientId = ''
    if (stateContactDetail) {
      paramForClientId = `&client=${stateContactDetail.id}`
    }
    getDetailVoucherByCode(value.voucher_code, paramForClientId)
      .then((res) => {
        const { data } = res.data
        console.log('data', data)
        const currentDate = new Date()
        const expiryDate = new Date(data.expiry_date)
        const foundIndex = data.availability.findIndex(
          (item) => item === 'AT_STORE'
        )
        if (foundIndex < 0) {
          pushMessage(t('message.voucherNotFound'), 'error')
          setStateCheckVoucherIsValid(false)
          return
        }
        if (expiryDate < currentDate) {
          pushMessage(t('message.voucherHasBeenExpired'), 'error')
          setStateCheckVoucherIsValid(false)
          return
        }
        if (data.minimum_spend > Number(stateTotalSelected)) {
          pushMessage(
            t('message.voucherDoesNotMeetTheMinimumSpentCondition'),
            'error'
          )
          setStateCheckVoucherIsValid(false)
          return
        }
        if (data.product_coverage === 'SPECIFIC') {
          const hasSameId = (id1: number, id2: number) => {
            return id1 === id2
          }
          const checkIfContained = data.specific_products.some((prod) =>
            stateProductSelected.some((obj) => hasSameId(prod.id, obj.id))
          )
          if (!checkIfContained) {
            pushMessage(t('message.voucherNotFound'), 'error')
            setStateCheckVoucherIsValid(false)

            return
          }
        }
        // handleApplyVoucher(data)
        setStateCheckVoucherIsValid(true)
        setStateApplyVoucherForm(false)
        pushMessage(t('message.applyVoucherSuccessfully'), 'success')
        setStateCurrentVoucher(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleCloseVoucherDialog = () => {
    resetVoucher()
    clearErrorsVoucher()
    setStateApplyVoucherForm(false)
  }
  // const handleApplyVoucher = (data: DetailVoucherByCodeType) => {
  //   if (!data) return
  //   const cloneProductSelected: ProductDataType[] = JSON.parse(
  //     JSON.stringify(stateProductSelected)
  //   )
  //   let cloneVoucherDiscount = 0
  //   const applyVoucherPrice = (price: number) => {
  //     let initPrice = 0
  //     if (data.type === 'PERCENTAGE') {
  //       initPrice =
  //         data.max_discount_amount &&
  //         (price * data.discount_amount) / 100 > data.max_discount_amount
  //           ? Number(data.max_discount_amount)
  //           : (price * data.discount_amount) / 100
  //     }

  //     return initPrice
  //   }
  //   if (data.product_coverage === 'ALL') {
  //     if (data.type === 'FIXEDAMOUNT') {
  //       cloneVoucherDiscount += data.discount_amount
  //     }

  //     for (let i = 0; i < cloneProductSelected.length; i++) {
  //       cloneProductSelected[i] = {
  //         ...cloneProductSelected[i],
  //         apply_voucher_price:
  //           Number(cloneProductSelected[i].retail_price) -
  //             Number(
  //               applyVoucherPrice(Number(cloneProductSelected[i].retail_price))
  //             ) <
  //           0
  //             ? Number(cloneProductSelected[i].retail_price)
  //             : Number(
  //                 applyVoucherPrice(
  //                   Number(cloneProductSelected[i].retail_price)
  //                 )
  //               ),
  //       }
  //       if (data.type === 'PERCENTAGE') {
  //         cloneVoucherDiscount += applyVoucherPrice(
  //           Number(cloneProductSelected[i].retail_price)
  //         )
  //       }
  //     }
  //     setStateProductSelected(cloneProductSelected)
  //     setStatePriceSummary((prev) => ({
  //       ...prev,
  //       apply_voucher_price: cloneVoucherDiscount,
  //     }))
  //   }
  //   if (data.product_coverage === 'SPECIFIC') {
  //     let initVoucherDiscount = 0
  //     for (let i = 0; i < cloneProductSelected.length; i++) {
  //       const foundIndex = data.specific_products.findIndex(
  //         (item) => item.id === cloneProductSelected[i].id
  //       )
  //       if (foundIndex >= 0) {
  //         if (data.type === 'PERCENTAGE') {
  //           cloneProductSelected[i] = {
  //             ...cloneProductSelected[i],
  //             apply_voucher_price:
  //               Number(cloneProductSelected[i].retail_price) -
  //                 Number(
  //                   applyVoucherPrice(
  //                     Number(cloneProductSelected[i].retail_price)
  //                   )
  //                 ) <
  //               0
  //                 ? Number(cloneProductSelected[i].retail_price)
  //                 : Number(
  //                     applyVoucherPrice(
  //                       Number(cloneProductSelected[i].retail_price)
  //                     )
  //                   ),
  //           }
  //           initVoucherDiscount +=
  //             Number(cloneProductSelected[i].retail_price) -
  //               Number(
  //                 applyVoucherPrice(
  //                   Number(cloneProductSelected[i].retail_price)
  //                 )
  //               ) <
  //             0
  //               ? Number(cloneProductSelected[i].retail_price)
  //               : Number(
  //                   applyVoucherPrice(
  //                     Number(cloneProductSelected[i].retail_price)
  //                   )
  //                 )
  //         } else {
  //           cloneProductSelected[i] = {
  //             ...cloneProductSelected[i],
  //             apply_voucher_price:
  //               Number(cloneProductSelected[i].retail_price) -
  //                 data.discount_amount <=
  //               0
  //                 ? Number(cloneProductSelected[i].retail_price) *
  //                   Number(cloneProductSelected[i].tempQuantity)
  //                 : Number(cloneProductSelected[i].retail_price) -
  //                   data.discount_amount,
  //           }
  //           initVoucherDiscount +=
  //             Number(cloneProductSelected[i].retail_price) *
  //               Number(cloneProductSelected[i].tempQuantity) -
  //               data.discount_amount <=
  //             0
  //               ? Number(cloneProductSelected[i].retail_price)
  //               : Number(cloneProductSelected[i].retail_price) -
  //                 data.discount_amount
  //         }

  //         setStateProductSelected(cloneProductSelected)
  //         setStatePriceSummary((prev) => ({
  //           ...prev,
  //           apply_voucher_price: initVoucherDiscount,
  //         }))
  //       }
  //     }
  //   }
  // }
  const handleChangeRoundUp = () => {
    setStateSwitchRoundedUp((prev) => !prev)
  }
  const handleDeleteVoucher = () => {
    setStateCurrentVoucher(undefined)
    resetVoucher()
    setStateCurrentRadioDiscount('customer')
  }
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <Box
        sx={{
          background: '#F8F9FC',
          borderRadius: '10px 10px 0px 0px',
          width: { xs: 'calc(100% - 250px)', md: 'calc(100% - 400px)' },
          position: 'relative',
          top: '24px',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ padding: '20px', marginTop: '-24px' }}
        >
          <form onSubmit={handleSubmit(onSubmitSearch)} className="form-search">
            <Controller
              control={control}
              name="search"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="search"
                    error={!!errors.search}
                    placeholder={t('create.searchProduct')}
                    {...field}
                  />
                </FormControl>
              )}
            />
            <IconButton
              aria-label="Search"
              type="submit"
              className="form-search__button"
            >
              <MagnifyingGlass size={20} />
            </IconButton>
          </form>
          <Badge
            badgeContent={filter}
            color="primary"
            sx={{ fontSize: '25px' }}
          >
            <ButtonCustom
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
                handleOpenMenuFilter(e)
              }
              variant="outlined"
              size="large"
              style={{ padding: '14px 0' }}
              sx={{
                border: '1px solid #E1E6EF',
                color: '#49516F',
                minWidth: '50px',
              }}
            >
              <FunnelSimple size={20} />
            </ButtonCustom>
          </Badge>
        </Stack>
        {renderResult()}
      </Box>
      <Box
        sx={{
          background: '#F8F9FC',
          position: 'fixed',
          bottom: '0px',
          top: '65px',
          right: '0px',
          width: { xs: '250px', md: '400px' },
          height: 'calc(100% - 65px)',
        }}
      >
        <Box
          sx={{
            overflow: 'auto',
            height: '100%',
            padding: { xs: '10px 10px 120px 10px', lg: '20px 20px 150px 20px' },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              marginBottom: { xs: '15px', lg: '25px' },
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '1.6rem', lg: '2.1rem' },
              }}
            >
              {/* Create Retail Order */}
              {t('create.title')}
            </Typography>

            <ButtonCustom
              variant="contained"
              disabled={stateProductSelected.length === 0}
              onClick={() => setStateOpenModalClearAll(true)}
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem', lg: '1.4rem' },
                paddingRight: { xs: '1.2rem', md: '2rem', lg: '2.5rem' },
                paddingLeft: { xs: '1.2rem', md: '2rem', lg: '2.5rem' },
              }}
            >
              {t('create.clearAll')}
            </ButtonCustom>
          </Stack>
          <Box>
            <Box sx={{ marginBottom: '15px' }}>
              <Typography sx={{ marginBottom: '15px' }}>
                {' '}
                {t('create.product')}
              </Typography>
              <Stack
                sx={{
                  marginBottom: '15px',
                  // position: 'relative',
                  // maxHeight: '750px',
                  // overflow: 'auto',
                }}
              >
                {stateProductSelected.length > 0 &&
                  stateProductSelected?.map((item, index) => {
                    return (
                      <Box
                        key={index}
                        sx={{
                          marginBottom: '15px',
                          background: '#ffffff',
                          padding: '10px',
                          borderRadius: '5px',
                          borderBottom: '1px solid #E1E6EF',
                        }}
                      >
                        <Stack
                          direction="row"
                          sx={{
                            // borderBottom: '1px solid #E1E6EF',
                            paddingBottom: '10px',
                            marginBottom: '10px',
                            borderBottom: '1px solid #E1E6EF',
                          }}
                          spacing={1}
                        >
                          <div className={classes['image-wrapper']}>
                            <a>
                              <Image
                                src={`${item.thumbnail}` || ''}
                                alt="product"
                                layout="fill"
                                className="custom-img"
                                // width={53}
                                // height={53}
                              />
                            </a>
                          </div>
                          <Stack>
                            <Stack direction="row" spacing={1}>
                              <Typography
                                sx={{
                                  maxWidth: {
                                    xs: '140px',
                                    md: '240px',
                                  },
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {item.name}
                              </Typography>
                              {item.isInvalid && (
                                <Warning
                                  size={16}
                                  style={{
                                    color: 'red',
                                    marginRight: '10px',
                                  }}
                                />
                              )}
                            </Stack>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <Typography sx={{ fontWeight: 500 }}>
                                {formatMoney(item.retail_price)}
                              </Typography>

                              <IconButton
                                onClick={() =>
                                  handleOpenEditPriceForProduct(item, index)
                                }
                              >
                                <PencilLine size={16} />
                              </IconButton>
                            </Stack>

                            {item.attribute_options && (
                              <Stack
                                direction="row"
                                flexWrap="wrap"
                                spacing={1}
                                sx={{ paddingRight: '5px !important' }}
                              >
                                {item.attribute_options.map((att, index) => {
                                  return (
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      key={index}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: '1rem',
                                          fontWeight: 700,
                                          color: '#1B1F27',
                                        }}
                                      >
                                        {att.attribute}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: '1rem',
                                          fontWeight: 300,
                                          color: '#1B1F27',
                                        }}
                                      >
                                        {att.option}
                                      </Typography>
                                    </Stack>
                                  )
                                })}
                              </Stack>
                            )}
                          </Stack>
                        </Stack>
                        <Stack
                          direction="row"
                          spacing={2}
                          justifyContent="space-between"
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            flexWrap="wrap"
                            spacing={2}
                          >
                            <ButtonGroup
                              variant="outlined"
                              sx={{ background: '#F8F9FC' }}
                            >
                              <ButtonIncreaseDecrease
                                disabled={
                                  Number(item.tempQuantity) <= 1 ? true : false
                                }
                                sx={{
                                  borderRightColor:
                                    Number(item.tempQuantity) <= 1
                                      ? 'rgba(0, 0, 0, 0.12) !important'
                                      : `${theme.palette.primary.main} !important`,
                                }}
                                onClick={() => {
                                  if (item.product_id) {
                                    handleDecreaseTempQuantityForProductVariant(
                                      item,
                                      index
                                    )
                                    return
                                  }

                                  const cloneArrayListProduct: ProductDataType[] =
                                    JSON.parse(
                                      JSON.stringify(stateListProduct?.data)
                                    )
                                  const indexCurrentProduct =
                                    cloneArrayListProduct.findIndex(
                                      (product) => product.id === item.id
                                    )
                                  if (
                                    indexCurrentProduct >= 0 &&
                                    Number(item.tempQuantity) > 1
                                  ) {
                                    cloneArrayListProduct[
                                      indexCurrentProduct
                                    ].tempQuantity =
                                      Number(
                                        cloneArrayListProduct[
                                          indexCurrentProduct
                                        ].tempQuantity
                                      ) - 1
                                    setStateListProduct((prev: any) => {
                                      return {
                                        ...prev,
                                        data: cloneArrayListProduct,
                                      }
                                    })
                                  }
                                  const cloneArraySelectedProduct = JSON.parse(
                                    JSON.stringify(stateProductSelected)
                                  )
                                  cloneArraySelectedProduct[
                                    index
                                  ].tempQuantity =
                                    Number(
                                      cloneArraySelectedProduct[index]
                                        .tempQuantity
                                    ) - 1
                                  handleSetItemInLocalStorage(
                                    cloneArraySelectedProduct
                                  )
                                  setStateProductSelected(
                                    cloneArraySelectedProduct
                                  )
                                }}
                              >
                                -
                              </ButtonIncreaseDecrease>
                              <div className={classes['input-number']}>
                                <NumericFormat
                                  sx={{
                                    minWidth: '70px',
                                    maxWidth: '70px',
                                  }}
                                  inputProps={{
                                    style: { textAlign: 'center' },
                                  }}
                                  thousandSeparator=","
                                  allowNegative={false}
                                  value={item.tempQuantity}
                                  defaultValue={1}
                                  customInput={TextField}
                                  isAllowed={(values) => {
                                    const { floatValue, formattedValue } =
                                      values
                                    // if (
                                    //   floatValue == null ||
                                    //   floatValue === undefined
                                    // ) {
                                    //   return floatValue === 1
                                    // }
                                    // return (
                                    //   Number(formattedValue) === 1 ||
                                    //   Number(floatValue) < item.inStock
                                    // )
                                    if (floatValue == null) {
                                      return formattedValue === ''
                                    } else {
                                      return (
                                        floatValue <=
                                          (item.instock
                                            ? Number(item.instock)
                                            : Number(item.quantity)) &&
                                        floatValue >= 1
                                      )
                                    }
                                  }}
                                  onValueChange={(value) => {
                                    if (item.product_id) {
                                      handleOnValueChangeTempQuantityForProductVariant(
                                        value,
                                        item,
                                        index
                                      )
                                      return
                                    }
                                    if (value.value === '') {
                                      const cloneArrayListProduct: ProductDataType[] =
                                        JSON.parse(
                                          JSON.stringify(stateListProduct?.data)
                                        )
                                      const indexCurrentProduct =
                                        cloneArrayListProduct.findIndex(
                                          (product) => product.id === item.id
                                        )
                                      if (indexCurrentProduct >= 0) {
                                        cloneArrayListProduct[
                                          indexCurrentProduct
                                        ].tempQuantity = 1
                                        setStateListProduct((prev: any) => {
                                          return {
                                            ...prev,
                                            data: cloneArrayListProduct,
                                          }
                                        })
                                      }
                                      const cloneArraySelectedProduct =
                                        JSON.parse(
                                          JSON.stringify(stateProductSelected)
                                        )
                                      cloneArraySelectedProduct[
                                        index
                                      ].tempQuantity = 1
                                      setStateProductSelected(
                                        cloneArraySelectedProduct
                                      )
                                      handleSetItemInLocalStorage(
                                        cloneArraySelectedProduct
                                      )
                                    } else if (
                                      Number(value.floatValue) <=
                                      Number(
                                        item.instock
                                          ? Number(item.instock)
                                          : Number(item.quantity)
                                      )
                                    ) {
                                      const cloneArrayListProduct: ProductDataType[] =
                                        JSON.parse(
                                          JSON.stringify(stateListProduct?.data)
                                        )
                                      const indexCurrentProduct =
                                        cloneArrayListProduct.findIndex(
                                          (product) => product.id === item.id
                                        )
                                      if (indexCurrentProduct >= 0) {
                                        cloneArrayListProduct[
                                          indexCurrentProduct
                                        ].tempQuantity = value.floatValue
                                        setStateListProduct((prev: any) => {
                                          return {
                                            ...prev,
                                            data: cloneArrayListProduct,
                                          }
                                        })
                                      }
                                      const cloneArraySelectedProduct =
                                        JSON.parse(
                                          JSON.stringify(stateProductSelected)
                                        )
                                      cloneArraySelectedProduct[
                                        index
                                      ].tempQuantity = value.floatValue
                                      setStateProductSelected(
                                        cloneArraySelectedProduct
                                      )
                                      handleSetItemInLocalStorage(
                                        cloneArraySelectedProduct
                                      )
                                    }
                                  }}
                                  onKeyPress={(event: any) => {
                                    if (hasSpecialCharacterPrice(event.key)) {
                                      event.preventDefault()
                                    }
                                  }}
                                  decimalScale={0}
                                />
                              </div>
                              <ButtonIncreaseDecrease
                                // disabled={
                                //   Number(item.tempQuantity) >=
                                //   Number(
                                //     item.instock
                                //       ? Number(item.instock)
                                //       : Number(item.quantity)
                                //   )
                                //     ? true
                                //     : false
                                // }
                                // sx={{
                                //   borderRightColor: '#C4C4C4 !important',
                                // }}
                                onClick={() => {
                                  if (
                                    Number(item.tempQuantity) >=
                                      Number(
                                        item.instock
                                          ? Number(item.instock)
                                          : Number(item.quantity)
                                      ) &&
                                    !item.isAllowed
                                  ) {
                                    setStateConfirmBuyOverStockProductIncrease(
                                      true
                                    )
                                    setStateCurrentProductIndex(index)
                                    return
                                  }

                                  if (item.product_id) {
                                    handleIncreaseTempQuantityForProductVariant(
                                      item,
                                      index
                                    )
                                    return
                                  }

                                  const cloneArrayListProduct: ProductDataType[] =
                                    JSON.parse(
                                      JSON.stringify(stateListProduct?.data)
                                    )
                                  const indexCurrentProduct =
                                    cloneArrayListProduct.findIndex(
                                      (product) =>
                                        product.id === item.id &&
                                        !product.variants_count
                                    )
                                  if (indexCurrentProduct >= 0) {
                                    cloneArrayListProduct[
                                      indexCurrentProduct
                                    ].tempQuantity =
                                      Number(
                                        cloneArrayListProduct[
                                          indexCurrentProduct
                                        ].tempQuantity
                                      ) + 1

                                    setStateListProduct((prev: any) => {
                                      return {
                                        ...prev,
                                        data: cloneArrayListProduct,
                                      }
                                    })
                                  }
                                  const cloneArraySelectedProduct = JSON.parse(
                                    JSON.stringify(stateProductSelected)
                                  )
                                  cloneArraySelectedProduct[
                                    index
                                  ].tempQuantity =
                                    Number(
                                      cloneArraySelectedProduct[index]
                                        .tempQuantity
                                    ) + 1
                                  setStateProductSelected(
                                    cloneArraySelectedProduct
                                  )
                                  handleSetItemInLocalStorage(
                                    cloneArraySelectedProduct
                                  )
                                }}
                              >
                                +
                              </ButtonIncreaseDecrease>
                            </ButtonGroup>
                            <Box sx={{ padding: '10px 0px' }}>
                              <Typography
                                sx={{
                                  fontWeight: 500,
                                }}
                              >
                                {formatMoney(
                                  Number(item.retail_price) *
                                    Number(item.tempQuantity)
                                )}
                              </Typography>
                            </Box>
                          </Stack>
                          <Button
                            variant="text"
                            onClick={() => {
                              if (item.product_id) {
                                handleDeleteProductVariant(item, index)
                                return
                              }
                              handleDeleteProduct(item.id, index)
                            }}
                            sx={{
                              maxWidth: '48px',
                              // aspectRatio: 1 / 1,
                              maxHeight: '48px',
                              minWidth: '48px',
                              background: '#F8F9FC',
                            }}
                          >
                            <Trash size={24} color="red" />
                          </Button>
                        </Stack>
                      </Box>
                    )
                  })}
                {stateProductSelected.length === 0 && (
                  <Stack p={1} alignItems="center" justifyContent="center">
                    <Image
                      src={'/' + '/images/not-found.svg'}
                      alt="Logo"
                      width="200"
                      height="200"
                    />
                    <Typography variant="h6" sx={{ marginTop: '0' }}>
                      {t('create.thereAreNoProductToShow')}
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Box>
            {/* Other Product */}
            <Box>
              <Typography sx={{ marginBottom: '15px' }}>
                {t('create.otherProduct')}
              </Typography>
              <Stack sx={{ marginBottom: '15px' }}>
                {stateOtherProductList.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        marginBottom: '15px',
                        background: '#ffffff',
                        padding: '10px',
                        borderRadius: '5px',
                        borderBottom: '1px solid #E1E6EF',
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          // borderBottom: '1px solid #E1E6EF',
                          paddingBottom: '10px',
                          marginBottom: '10px',
                          borderBottom: '1px solid #E1E6EF',
                        }}
                        spacing={1}
                      >
                        <div className={classes['image-wrapper']}>
                          <a>
                            <Image
                              src={'/' + '/images/defaultProductImage.png'}
                              alt="product"
                              layout="fill"
                              className="custom-img"
                              width={53}
                              height={53}
                            />
                          </a>
                        </div>
                        <Stack>
                          <Stack direction="row" spacing={1}>
                            <Typography
                              sx={{
                                maxWidth: {
                                  xs: '140px',
                                  md: '240px',
                                },
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.product_name}
                            </Typography>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography
                              sx={{ fontSize: '1.4rem', fontWeight: 500 }}
                            >
                              {formatMoney(item.price)}
                            </Typography>
                            <IconButton
                              onClick={() =>
                                handleOpenEditPriceForOtherProduct(index, item)
                              }
                            >
                              <PencilLine size={16} />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          flexWrap="wrap"
                          spacing={2}
                        >
                          <ButtonGroup
                            variant="outlined"
                            sx={{ background: '#F8F9FC' }}
                          >
                            <ButtonIncreaseDecrease
                              disabled={
                                Number(item.quantity) <= 1 ? true : false
                              }
                              onClick={() =>
                                handleDecreaseTempQuantityForOtherProduct(index)
                              }
                              sx={{
                                borderRightColor:
                                  Number(item.quantity) <= 1
                                    ? 'rgba(0, 0, 0, 0.12) !important'
                                    : `${theme.palette.primary.main} !important`,
                              }}
                            >
                              -
                            </ButtonIncreaseDecrease>
                            <div className={classes['input-number']}>
                              <NumericFormat
                                sx={{
                                  minWidth: '70px',
                                  maxWidth: '70px',
                                }}
                                inputProps={{
                                  style: { textAlign: 'center' },
                                }}
                                thousandSeparator=","
                                allowNegative={false}
                                value={item.quantity}
                                defaultValue={1}
                                customInput={TextField}
                                isAllowed={(values) => {
                                  const { floatValue, formattedValue } = values
                                  // if (
                                  //   floatValue == null ||
                                  //   floatValue === undefined
                                  // ) {
                                  //   return floatValue === 1
                                  // }
                                  // return (
                                  //   Number(formattedValue) === 1 ||
                                  //   Number(floatValue) < item.inStock
                                  // )
                                  if (floatValue == null) {
                                    return formattedValue === ''
                                  } else {
                                    return floatValue <= 10000000
                                  }
                                }}
                                onValueChange={(value) => {
                                  handleOnValueChangeTempQuantityForOtherProduct(
                                    value,
                                    index
                                  )
                                }}
                                onKeyPress={(event: any) => {
                                  if (hasSpecialCharacterPrice(event.key)) {
                                    event.preventDefault()
                                  }
                                }}
                                decimalScale={0}
                              />
                            </div>
                            <ButtonIncreaseDecrease
                              onClick={() =>
                                handleIncreaseTempQuantityForOtherProduct(index)
                              }
                            >
                              +
                            </ButtonIncreaseDecrease>
                          </ButtonGroup>
                          <Box sx={{ padding: '10px 0px' }}>
                            <Typography
                              sx={{
                                fontWeight: 500,
                              }}
                            >
                              {item.price
                                ? formatMoney(
                                    Number(item.price) * Number(item.quantity)
                                  )
                                : formatMoney(
                                    Number(item.price) * Number(item.quantity)
                                  )}
                            </Typography>
                          </Box>
                        </Stack>
                        <Button
                          variant="text"
                          onClick={() => {
                            handleDeleteOtherProduct(index)
                          }}
                          sx={{
                            maxWidth: '48px',
                            // aspectRatio: 1 / 1,
                            maxHeight: '48px',
                            minWidth: '48px',
                            background: '#F8F9FC',
                          }}
                        >
                          <Trash size={24} color="red" />
                        </Button>
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
              <Stack sx={{ marginBottom: '15px' }}>
                <ButtonCustom
                  onClick={() => handleOpenAddOtherProductForm()}
                  startIcon={<Plus size={32} />}
                  fullWidth
                  variant="outlined"
                  sx={{ border: '1px dashed #1DB46A !important' }}
                >
                  {t('create.addOtherProduct')}
                </ButtonCustom>
              </Stack>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            // background: '#F8F9FC',
            padding: '50px 20px 20px 20px',
            position: 'absolute',
            bottom: '0',
            width: { lg: 'calc(100% - 15px)', xs: '100%' },
            right: { lg: '15px', xs: '0' },
            // right: '15px',
            // width: '100%',
            backgroundImage:
              'linear-gradient(transparent,#F8F9FC,#E1E6EF,#E1E6EF,#E1E6EF,#E1E6EF)',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{ marginBottom: '10px' }}
          >
            <Typography sx={{ fontSize: '1.6rem' }}>
              {' '}
              {t('create.total')}
            </Typography>
            <Typography
              sx={{
                fontSize: '1.6rem',
                fontWeight: 500,
                color: theme.palette.error.main,
              }}
            >
              {formatMoney(stateTotalSelected)}
            </Typography>
          </Stack>
          <ButtonCustom
            variant="contained"
            sx={{ width: '100%', height: '50px' }}
            disabled={
              stateProductSelected.length === 0 &&
              stateOtherProductList.length === 0
            }
            onClick={handleTogglePayment}
          >
            {t('create.createRetailOrder')}
          </ButtonCustom>
        </Box>
      </Box>

      <Drawer anchor="right" open={statePayment} onClose={handleTogglePayment}>
        <Stack
          direction="row"
          divider={
            <Divider
              orientation="vertical"
              flexItem
              sx={{ margin: '24px 0px' }}
            />
          }
          sx={{ height: '100%' }}
        >
          <Box
            sx={{
              padding: '25px',
              minWidth: '500px',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,

              // borderRight: '1px solid #C3CAD9 ',
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: '2.4rem',
                  color: '#49516',
                  fontWeight: '700',
                  marginBottom: '20px',
                }}
              >
                {t('create.retailOrder')}
              </Typography>
              {stateContactDetail ? (
                <>
                  <Typography>Customer info</Typography>
                  <Stack
                    spacing={1}
                    sx={{
                      width: '100%',
                      background: '#F8FAFA',
                      padding: '10px',
                      borderRadius: '10px',
                      marginBottom: '15px',
                    }}
                  >
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography sx={{ fontWeight: 700 }}>
                          Customer name:
                        </Typography>
                        <Typography>
                          {stateContactDetail.first_name}{' '}
                          {stateContactDetail.last_name}
                        </Typography>
                      </Stack>

                      <IconButton onClick={() => setStateContactForm(true)}>
                        <Pencil color="#1DB46A" size={20} />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteContactRetail()}>
                        <XCircle color="#1DB46A" size={20} />
                      </IconButton>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography sx={{ fontWeight: 700 }}>
                        Phone number:
                      </Typography>
                      <Typography>
                        {formatPhoneNumber(stateContactDetail.phone_number)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography sx={{ fontWeight: 700 }}>
                        Loyalty Level:
                      </Typography>
                      <Typography>
                        {stateContactDetail.loyalty_info &&
                        stateContactDetail.loyalty_info.tiered_loyalty_level
                          ? stateContactDetail.loyalty_info &&
                            stateContactDetail.loyalty_info.tiered_loyalty_level
                          : 'N/A'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography sx={{ fontWeight: 700 }}>
                        Loyalty point:
                      </Typography>
                      <Typography>
                        {stateContactDetail.loyalty_info &&
                        stateContactDetail.loyalty_info.current_points
                          ? stateContactDetail.loyalty_info &&
                            stateContactDetail.loyalty_info.current_points
                          : 'N/A'}
                      </Typography>
                    </Stack>
                  </Stack>
                </>
              ) : (
                <ButtonCustom
                  variant="outlined"
                  size="large"
                  onClick={() => setStateContactForm(true)}
                  startIcon={<Notebook color="#49516F" size={20} />}
                  sx={{
                    marginBottom: '15px',
                    width: '100%',
                    border: '1px solid #E1E6EF !important',
                    color: '#49516F',
                  }}
                >
                  {t('addCustomer')}
                </ButtonCustom>
              )}

              <Box>
                <Typography> {t('create.product')}</Typography>
              </Box>
              <Stack
                sx={{
                  marginBottom: '15px',
                }}
              >
                {stateProductSelected?.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        marginBottom: '15px',
                        backgroundColor: '#F8FAFA',
                        padding: '10px',
                        borderRadius: '10px',
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          paddingBottom: '10px',
                          marginBottom: '10px',
                          borderBottom: '1px solid #E1E6EF',
                        }}
                        spacing={1}
                      >
                        <div className={classes['image-wrapper']}>
                          <Image
                            src={`${item.thumbnail}` || ''}
                            alt="product"
                            width={60}
                            height={60}
                          />
                        </div>
                        <Stack>
                          <Stack direction="row" spacing={1}>
                            <Typography
                              sx={{
                                maxWidth: '400px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.name}
                            </Typography>
                            {item.isInvalid && (
                              <Warning
                                size={16}
                                style={{ color: 'red', marginRight: '10px' }}
                              />
                            )}
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography sx={{ fontWeight: 500 }}>
                              {formatMoney(item.retail_price)}
                            </Typography>

                            <IconButton
                              onClick={() =>
                                handleOpenEditPriceForProduct(item, index)
                              }
                            >
                              <PencilLine size={16} />
                            </IconButton>
                          </Stack>
                          {item.attribute_options && (
                            <Stack direction="row" spacing={1}>
                              {item.attribute_options.map((att, index) => {
                                return (
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    key={index}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        color: '#1B1F27',
                                      }}
                                    >
                                      {att.attribute}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: '1rem',
                                        fontWeight: 300,
                                        color: '#1B1F27',
                                      }}
                                    >
                                      {att.option}
                                    </Typography>
                                  </Stack>
                                )
                              })}
                            </Stack>
                          )}
                        </Stack>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        justifyContent="space-between"
                        flexWrap="wrap"
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <ButtonGroup variant="outlined">
                            <ButtonIncreaseDecrease
                              disabled={
                                Number(item.tempQuantity) <= 1 ? true : false
                              }
                              sx={{
                                borderRightColor: '#C4C4C4 !important',
                              }}
                              onClick={() => {
                                if (item.product_id) {
                                  handleDecreaseTempQuantityForProductVariant(
                                    item,
                                    index
                                  )
                                  return
                                }
                                const cloneArrayListProduct: ProductDataType[] =
                                  JSON.parse(
                                    JSON.stringify(stateListProduct?.data)
                                  )
                                const indexCurrentProduct =
                                  cloneArrayListProduct.findIndex(
                                    (product) => product.id === item.id
                                  )
                                if (
                                  indexCurrentProduct >= 0 &&
                                  Number(item.tempQuantity) > 1
                                ) {
                                  cloneArrayListProduct[
                                    indexCurrentProduct
                                  ].tempQuantity =
                                    Number(
                                      cloneArrayListProduct[indexCurrentProduct]
                                        .tempQuantity
                                    ) - 1
                                  setStateListProduct((prev: any) => {
                                    return {
                                      ...prev,
                                      data: cloneArrayListProduct,
                                    }
                                  })
                                }
                                const cloneArraySelectedProduct = JSON.parse(
                                  JSON.stringify(stateProductSelected)
                                )
                                cloneArraySelectedProduct[index].tempQuantity =
                                  Number(
                                    cloneArraySelectedProduct[index]
                                      .tempQuantity
                                  ) - 1
                                handleSetItemInLocalStorage(
                                  cloneArraySelectedProduct
                                )
                                setStateProductSelected(
                                  cloneArraySelectedProduct
                                )
                              }}
                            >
                              -
                            </ButtonIncreaseDecrease>
                            <div className={classes['input-number']}>
                              <NumericFormat
                                thousandSeparator=","
                                allowNegative={false}
                                value={item.tempQuantity}
                                customInput={TextField}
                                isAllowed={(values) => {
                                  const { floatValue, formattedValue } = values
                                  // if (
                                  //   floatValue == null ||
                                  //   floatValue === undefined
                                  // ) {
                                  //   return floatValue === 1
                                  // }
                                  // return (
                                  //   Number(formattedValue) === 1 ||
                                  //   Number(floatValue) < item.inStock
                                  // )
                                  if (floatValue == null) {
                                    return formattedValue === ''
                                  } else {
                                    return (
                                      floatValue <=
                                        Number(
                                          item.instock
                                            ? Number(item.instock)
                                            : Number(item.quantity)
                                        ) && floatValue >= 1
                                    )
                                  }
                                }}
                                onValueChange={(value) => {
                                  if (item.product_id) {
                                    handleOnValueChangeTempQuantityForProductVariant(
                                      value,
                                      item,
                                      index
                                    )
                                    return
                                  }
                                  if (value.value === '') {
                                    const cloneArrayListProduct: ProductDataType[] =
                                      JSON.parse(
                                        JSON.stringify(stateListProduct?.data)
                                      )
                                    const indexCurrentProduct =
                                      cloneArrayListProduct.findIndex(
                                        (product) => product.id === item.id
                                      )
                                    if (indexCurrentProduct >= 0) {
                                      cloneArrayListProduct[
                                        indexCurrentProduct
                                      ].tempQuantity = 1
                                      setStateListProduct((prev: any) => {
                                        return {
                                          ...prev,
                                          data: cloneArrayListProduct,
                                        }
                                      })
                                    }
                                    const cloneArraySelectedProduct =
                                      JSON.parse(
                                        JSON.stringify(stateProductSelected)
                                      )
                                    cloneArraySelectedProduct[
                                      index
                                    ].tempQuantity = 1
                                    handleSetItemInLocalStorage(
                                      cloneArraySelectedProduct
                                    )
                                    setStateProductSelected(
                                      cloneArraySelectedProduct
                                    )
                                  } else if (
                                    Number(value.floatValue) <=
                                    Number(
                                      item.instock
                                        ? Number(item.instock)
                                        : Number(item.quantity)
                                    )
                                  ) {
                                    const cloneArrayListProduct: ProductDataType[] =
                                      JSON.parse(
                                        JSON.stringify(stateListProduct?.data)
                                      )
                                    const indexCurrentProduct =
                                      cloneArrayListProduct.findIndex(
                                        (product) => product.id === item.id
                                      )
                                    if (indexCurrentProduct >= 0) {
                                      cloneArrayListProduct[
                                        indexCurrentProduct
                                      ].tempQuantity = value.floatValue
                                      setStateListProduct((prev: any) => {
                                        return {
                                          ...prev,
                                          data: cloneArrayListProduct,
                                        }
                                      })
                                    }
                                    const cloneArraySelectedProduct =
                                      JSON.parse(
                                        JSON.stringify(stateProductSelected)
                                      )
                                    cloneArraySelectedProduct[
                                      index
                                    ].tempQuantity = value.floatValue
                                    handleSetItemInLocalStorage(
                                      cloneArraySelectedProduct
                                    )
                                    setStateProductSelected(
                                      cloneArraySelectedProduct
                                    )
                                  }
                                }}
                                onKeyPress={(event: any) => {
                                  if (hasSpecialCharacterPrice(event.key)) {
                                    event.preventDefault()
                                  }
                                }}
                                decimalScale={0}
                              />
                            </div>
                            <ButtonIncreaseDecrease
                              sx={{
                                borderRightColor: '#C4C4C4 !important',
                              }}
                              onClick={() => {
                                if (
                                  Number(item.tempQuantity) >=
                                    Number(
                                      item.instock
                                        ? Number(item.instock)
                                        : Number(item.quantity)
                                    ) &&
                                  !item.isAllowed
                                ) {
                                  setStateConfirmBuyOverStockProductIncrease(
                                    true
                                  )
                                  setStateCurrentProductIndex(index)
                                  return
                                }
                                if (item.product_id) {
                                  handleIncreaseTempQuantityForProductVariant(
                                    item,
                                    index
                                  )
                                  return
                                }
                                const cloneArrayListProduct: ProductDataType[] =
                                  JSON.parse(
                                    JSON.stringify(stateListProduct?.data)
                                  )
                                const indexCurrentProduct =
                                  cloneArrayListProduct.findIndex(
                                    (product) => product.id === item.id
                                  )
                                if (indexCurrentProduct >= 0) {
                                  cloneArrayListProduct[
                                    indexCurrentProduct
                                  ].tempQuantity =
                                    Number(
                                      cloneArrayListProduct[indexCurrentProduct]
                                        .tempQuantity
                                    ) + 1
                                  setStateListProduct((prev: any) => {
                                    return {
                                      ...prev,
                                      data: cloneArrayListProduct,
                                    }
                                  })
                                }
                                const cloneArraySelectedProduct = JSON.parse(
                                  JSON.stringify(stateProductSelected)
                                )
                                cloneArraySelectedProduct[index].tempQuantity =
                                  Number(
                                    cloneArraySelectedProduct[index]
                                      .tempQuantity
                                  ) + 1
                                handleSetItemInLocalStorage(
                                  cloneArraySelectedProduct
                                )
                                setStateProductSelected(
                                  cloneArraySelectedProduct
                                )
                              }}
                            >
                              +
                            </ButtonIncreaseDecrease>
                          </ButtonGroup>
                          <Typography sx={{ fontWeight: 500 }}>
                            {formatMoney(
                              Number(item.retail_price) *
                                Number(item.tempQuantity)
                            )}
                          </Typography>
                        </Stack>
                        <Button
                          variant="text"
                          sx={{ border: 'none' }}
                          onClick={() => {
                            if (item.product_id) {
                              handleDeleteProductVariant(item, index)
                              return
                            }
                            handleDeleteProduct(item.id, index)
                          }}
                          style={{ width: '48px', height: '48px' }}
                        >
                          <Trash size={24} color="red" />
                        </Button>
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
            </Box>
            {/* Other Product */}
            <Box>
              <Typography sx={{ marginBottom: '15px' }}>
                {t('create.otherProduct')}
              </Typography>
              <Stack sx={{ marginBottom: '15px' }}>
                {stateOtherProductList.map((item, index) => {
                  return (
                    <Box
                      key={index}
                      sx={{
                        marginBottom: '15px',
                        background: '#ffffff',
                        padding: '10px',
                        borderRadius: '5px',
                        borderBottom: '1px solid #E1E6EF',
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{
                          // borderBottom: '1px solid #E1E6EF',
                          paddingBottom: '10px',
                          marginBottom: '10px',
                          borderBottom: '1px solid #E1E6EF',
                        }}
                        spacing={1}
                      >
                        <div className={classes['image-wrapper']}>
                          <a>
                            <Image
                              src={'/' + '/images/defaultProductImage.png'}
                              alt="product"
                              layout="fill"
                              className="custom-img"
                              width={53}
                              height={53}
                            />
                          </a>
                        </div>
                        <Stack>
                          <Stack direction="row" spacing={1}>
                            <Typography
                              sx={{
                                maxWidth: {
                                  xs: '140px',
                                  md: '240px',
                                },
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.product_name}
                            </Typography>
                          </Stack>
                          <Typography
                            sx={{ fontSize: '1.4rem', fontWeight: 500 }}
                          >
                            {formatMoney(item.price)}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={2}
                        justifyContent="space-between"
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          flexWrap="wrap"
                          spacing={2}
                        >
                          <ButtonGroup
                            variant="outlined"
                            sx={{ background: '#F8F9FC' }}
                          >
                            <ButtonIncreaseDecrease
                              disabled={
                                Number(item.quantity) <= 1 ? true : false
                              }
                              onClick={() =>
                                handleDecreaseTempQuantityForOtherProduct(index)
                              }
                              sx={{
                                borderRightColor:
                                  Number(item.quantity) <= 1
                                    ? 'rgba(0, 0, 0, 0.12) !important'
                                    : `${theme.palette.primary.main} !important`,
                              }}
                            >
                              -
                            </ButtonIncreaseDecrease>
                            <div className={classes['input-number']}>
                              <NumericFormat
                                sx={{
                                  minWidth: '70px',
                                  maxWidth: '70px',
                                }}
                                inputProps={{
                                  style: { textAlign: 'center' },
                                }}
                                thousandSeparator=","
                                allowNegative={false}
                                value={item.quantity}
                                defaultValue={1}
                                customInput={TextField}
                                isAllowed={(values) => {
                                  const { floatValue, formattedValue } = values
                                  // if (
                                  //   floatValue == null ||
                                  //   floatValue === undefined
                                  // ) {
                                  //   return floatValue === 1
                                  // }
                                  // return (
                                  //   Number(formattedValue) === 1 ||
                                  //   Number(floatValue) < item.inStock
                                  // )
                                  if (floatValue == null) {
                                    return formattedValue === ''
                                  } else {
                                    return floatValue <= 10000000
                                  }
                                }}
                                onValueChange={(value) =>
                                  handleOnValueChangeTempQuantityForOtherProduct(
                                    value,
                                    index
                                  )
                                }
                                onKeyPress={(event: any) => {
                                  if (hasSpecialCharacterPrice(event.key)) {
                                    event.preventDefault()
                                  }
                                }}
                                decimalScale={0}
                              />
                            </div>
                            <ButtonIncreaseDecrease
                              disabled={
                                Number(item.quantity) >= 10000000 ? true : false
                              }
                              onClick={() =>
                                handleIncreaseTempQuantityForOtherProduct(index)
                              }
                            >
                              +
                            </ButtonIncreaseDecrease>
                          </ButtonGroup>
                          <Box sx={{ padding: '10px 0px' }}>
                            <Typography
                              sx={{
                                fontWeight: 500,
                              }}
                            >
                              {item.price
                                ? formatMoney(
                                    Number(item.price) * Number(item.quantity)
                                  )
                                : formatMoney(
                                    Number(item.price) * Number(item.quantity)
                                  )}
                            </Typography>
                          </Box>
                        </Stack>
                        <Button
                          variant="text"
                          onClick={() => {
                            handleDeleteOtherProduct(index)
                          }}
                          sx={{
                            maxWidth: '48px',
                            // aspectRatio: 1 / 1,
                            maxHeight: '48px',
                            minWidth: '48px',
                            background: '#F8F9FC',
                          }}
                        >
                          <Trash size={24} color="red" />
                        </Button>
                      </Stack>
                    </Box>
                  )
                })}
              </Stack>
              <Stack sx={{ marginBottom: '15px' }}>
                <ButtonCustom
                  onClick={() => handleOpenAddOtherProductForm()}
                  startIcon={<Plus size={32} />}
                  fullWidth
                  variant="outlined"
                  sx={{ border: '1px dashed #1DB46A !important' }}
                >
                  {t('create.addOtherProduct')}
                </ButtonCustom>
              </Stack>
            </Box>
            <Box sx={{ borderTop: '1px solid #E1E6EF', paddingTop: '10px' }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  marginBottom: '25px',
                  backgroundColor: '#F8FAFB',
                  padding: '10px ',
                  borderRadius: '10px',
                }}
              >
                <Typography sx={{ fontSize: '1.6rem' }}>
                  {' '}
                  {t('create.subtotal')}
                </Typography>
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 500 }}>
                  {formatMoney(stateTotalSelected)}
                </Typography>
              </Stack>
            </Box>
          </Box>
          <Box sx={{ padding: '25px', minWidth: '500px', height: '100%' }}>
            <Box>
              <Typography
                sx={{
                  fontSize: '2.4rem',
                  color: '#49516',
                  fontWeight: '700',
                  marginBottom: '20px',
                }}
              >
                {t('create.tips')}
              </Typography>
              <Stack
                sx={{
                  padding: '15px',
                  background: '#F8F9FC',
                  borderRadius: '5px',
                }}
                direction="column"
                // divider={
                //   <Divider
                //     orientation="vertical"
                //     flexItem
                //     sx={{ margin: '0 16px ' }}
                //   />
                // }
                divider={<Divider orientation="horizontal" flexItem />}
                spacing={2}
              >
                <Stack direction="row" spacing={1}>
                  <ButtonCustom
                    variant="outlined"
                    sx={{ background: 'white', padding: '5px 15px !important' }}
                    size="small"
                    onClick={() => {
                      setValueTip('tip', (Number(stateFinalTotal) * 5) / 100)
                      triggerValueTip('tip')
                    }}
                  >
                    5%
                  </ButtonCustom>
                  <ButtonCustom
                    variant="outlined"
                    sx={{ background: 'white', padding: '5px 15px !important' }}
                    size="small"
                    onClick={() => {
                      setValueTip('tip', (Number(stateFinalTotal) * 10) / 100)
                      triggerValueTip('tip')
                    }}
                  >
                    10%
                  </ButtonCustom>
                  <ButtonCustom
                    variant="outlined"
                    sx={{ background: 'white', padding: '5px 15px !important' }}
                    size="small"
                    onClick={() => {
                      setValueTip('tip', (Number(stateFinalTotal) * 15) / 100)
                      triggerValueTip('tip')
                    }}
                  >
                    15%
                  </ButtonCustom>
                  <ButtonCustom
                    variant="outlined"
                    sx={{ background: 'white', padding: '5px 15px !important' }}
                    size="small"
                    onClick={() => {
                      setValueTip('tip', (Number(stateFinalTotal) * 20) / 100)
                      triggerValueTip('tip')
                    }}
                  >
                    20%
                  </ButtonCustom>
                  <ButtonCustom
                    variant="outlined"
                    sx={{ background: 'white', padding: '5px 15px !important' }}
                    size="small"
                    onClick={() => {
                      setValueTip('tip', (Number(stateFinalTotal) * 25) / 100)
                      triggerValueTip('tip')
                    }}
                  >
                    25%
                  </ButtonCustom>
                </Stack>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    control={controlTip}
                    name="tip"
                    defaultValue={0}
                    render={() => (
                      <>
                        <InputLabelCustom>
                          {' '}
                          {t('create.tipsAmount')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <div className={classes['input-number-tip']}>
                            <CurrencyNumberFormat
                              defaultPrice={
                                getValuesTip('tip')
                                  ? Number(getValuesTip('tip')).toFixed(2)
                                  : 0
                              }
                              propValue={(value) => {
                                setValueTip('tip', Number(value), {
                                  shouldValidate: true,
                                })
                                console.log('Number value', value)
                                triggerValueTip('tip')
                              }}
                            />
                          </div>
                          <FormHelperText error>
                            {errorsTip.tip && `${errorsTip.tip.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
              </Stack>
            </Box>
          </Box>

          {stateMethodForm ? (
            <>
              {stateRadioPaymentMethod === 1 && (
                <CashPaymentForm
                  handleBackToPrevious={() => setStateMethodForm(false)}
                  total={truncateToTwoDecimalPlaces(stateFinalTotal)}
                  handleSubmit={(value) => handleCheckoutByCash(value)}
                  disableButton={
                    stateProductSelected.length === 0 &&
                    stateOtherProductList.length === 0
                  }
                />
              )}
              {stateRadioPaymentMethod === 2 && (
                <CreditPaymentForm
                  handleBackToPrevious={() => setStateMethodForm(false)}
                  total={truncateToTwoDecimalPlaces(stateFinalTotal)}
                  handleSubmit={(value) => {
                    handleCheckoutByCreditCard(value)
                  }}
                  disableButton={
                    stateProductSelected.length === 0 &&
                    stateOtherProductList.length === 0
                  }
                />
              )}
            </>
          ) : (
            <Box sx={{ padding: '25px', minWidth: '500px' }}>
              <Typography
                sx={{
                  fontSize: '2.4rem',
                  color: '#49516',
                  fontWeight: '700',
                  marginBottom: '20px',
                }}
              >
                {t('create.payment')}
              </Typography>
              {stateCurrentVoucher ? (
                <Stack spacing={1}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                      background: '#F8FAFB',
                      borderRadius: '5px',
                      padding: '10px',
                      marginBottom: '15px',
                    }}
                  >
                    <Typography>
                      {t('voucher')} : {stateCurrentVoucher?.code}
                    </Typography>
                    <IconButton onClick={() => handleDeleteVoucher()}>
                      <XCircle size={20} />
                    </IconButton>
                  </Stack>
                </Stack>
              ) : (
                <ButtonCustom
                  variant="outlined"
                  size="large"
                  fullWidth
                  startIcon={<Plus size={24} />}
                  sx={{ marginBottom: '15px' }}
                  onClick={() => setStateApplyVoucherForm(true)}
                >
                  {t('applyVoucher')}
                </ButtonCustom>
              )}
              {stateCurrentVoucher && stateContactDetail && (
                <Box sx={{ marginBottom: '15px' }}>
                  <Typography id="demo-radio-buttons-group-label">
                    {t('select_1VoucherToApply')}
                  </Typography>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      value={stateCurrentRadioDiscount}
                      name="radio-buttons-group"
                      onChange={handleChangeRadioDiscount}
                    >
                      <FormControlLabel
                        value="customer"
                        control={<Radio />}
                        label={t('applyVoucherDiscount')}
                      />
                      <FormControlLabel
                        value="voucher"
                        control={<Radio />}
                        label={t('applyCustomerDiscount')}
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
              )}

              <Stack
                sx={{
                  background: '#F8FAFB',
                  borderRadius: '5px',
                  padding: '10px',
                }}
                spacing={1}
              >
                <Stack direction="row" justifyContent="space-between">
                  <TypographyPayment> {t('create.subtotal')}</TypographyPayment>
                  <TypographyPayment>
                    {formatMoney(Number(stateTotalSelected))}
                  </TypographyPayment>
                </Stack>
                {stateContactDetail && (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      opacity:
                        stateContactDetail &&
                        stateCurrentVoucher &&
                        stateCurrentRadioDiscount === 'voucher'
                          ? '0.3'
                          : '',
                    }}
                  >
                    <TypographyPayment>{t('discount')}</TypographyPayment>
                    <TypographyPayment>
                      {formatMoney(
                        truncateToTwoDecimalPlaces(
                          statePriceSummary.price_discount
                        )
                      )}
                    </TypographyPayment>
                  </Stack>
                )}

                {stateCurrentVoucher && (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      opacity:
                        stateContactDetail &&
                        stateCurrentVoucher &&
                        stateCurrentRadioDiscount === 'customer'
                          ? '0.3'
                          : '',
                    }}
                  >
                    <TypographyPayment>
                      {t('voucherDiscount')}
                    </TypographyPayment>
                    <TypographyPayment>
                      {formatMoney(
                        truncateToTwoDecimalPlaces(
                          statePriceSummary.apply_voucher_price
                        )
                      )}
                    </TypographyPayment>
                  </Stack>
                )}

                <Stack direction="row" justifyContent="space-between">
                  <TypographyPayment> {t('create.tips')}</TypographyPayment>
                  <TypographyPayment>
                    {formatMoney(watchTip('tip') ? watchTip('tip') : 0)}
                  </TypographyPayment>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <TypographyPayment> {t('create.tax')}(0%)</TypographyPayment>
                  <TypographyPayment>$0.00</TypographyPayment>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    sx={{ color: '#595959', fontWeight: 700, fontSize: '2rem' }}
                  >
                    {t('create.TOTAL')}
                  </Typography>
                  <Typography
                    sx={{ color: '#595959', fontWeight: 700, fontSize: '2rem' }}
                  >
                    {formatMoney(truncateToTwoDecimalPlaces(stateFinalTotal))}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1}>
                <ButtonCustom
                  size="large"
                  variant="outlined"
                  fullWidth
                  onClick={() => setStateRadioPaymentMethod(1)}
                  sx={{
                    position: 'relative',
                    border: `1px solid ${
                      stateRadioPaymentMethod === 1 ? '#34DC75' : '#C3CAD9'
                    }`,
                    color:
                      stateRadioPaymentMethod === 1 ? '#34DC75' : '#C3CAD9',
                  }}
                >
                  <Stack direction="column" spacing={0.5} alignItems="center">
                    <CreditCard size={24} />
                    <Typography> {t('create.cash')}</Typography>
                  </Stack>
                  {stateRadioPaymentMethod === 1 && (
                    <CheckCircle
                      style={{ position: 'absolute', top: 5, right: 5 }}
                      size={16}
                    />
                  )}
                </ButtonCustom>
                <ButtonCustom
                  size="large"
                  variant="outlined"
                  fullWidth
                  onClick={() => setStateRadioPaymentMethod(2)}
                  sx={{
                    position: 'relative',
                    border: `1px solid ${
                      stateRadioPaymentMethod === 2 ? '#34DC75' : '#C3CAD9'
                    }`,
                    color:
                      stateRadioPaymentMethod === 2 ? '#34DC75' : '#C3CAD9',
                  }}
                >
                  <Stack direction="column" spacing={0.5} alignItems="center">
                    <CreditCard size={24} />
                    <Typography> {t('create.creditCard')}</Typography>
                  </Stack>

                  {stateRadioPaymentMethod === 2 && (
                    <CheckCircle
                      style={{ position: 'absolute', top: 5, right: 5 }}
                      size={16}
                    />
                  )}
                </ButtonCustom>
              </Stack>

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ marginBottom: '' }}
              >
                <Typography> {t('create.enableTaxForThisBill')}</Typography>
                <Switch
                  checked={stateSwitch}
                  onChange={() => setStateSwitch((prev) => !prev)}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>{t('create.roundedUp')}</Typography>
                <Switch
                  checked={stateSwitchRoundedUp}
                  onChange={() => handleChangeRoundUp()}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Stack>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1}>
                  <ButtonCustom
                    variant="outlined"
                    onClick={() => handleTogglePayment()}
                    size="large"
                  >
                    {t('create.cancel')}
                  </ButtonCustom>
                  <ButtonCustom
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={
                      (stateProductSelected.length === 0 &&
                        stateOtherProductList.length === 0) ||
                      (stateCurrentVoucher &&
                        statePriceSummary.apply_voucher_price === 0)
                    }
                    onClick={handleCheckoutAfterSelectPaymentMethod}
                  >
                    {t('create.checkout')}
                  </ButtonCustom>
                </Stack>
                <ButtonCustom variant="outlined">
                  {' '}
                  {t('create.unknownPayment')}
                </ButtonCustom>
                <ButtonCustom
                  disabled={
                    stateProductSelected.length === 0 &&
                    stateOtherProductList.length === 0
                  }
                  onClick={handleSubmitCreateRetailOrder}
                  variant="outlined"
                >
                  {t('create.holdReceipt')}
                </ButtonCustom>
              </Stack>
            </Box>
          )}
        </Stack>
      </Drawer>

      <Drawer
        anchor={'right'}
        open={openFilter}
        onClose={handleCloseMenuFilter}
      >
        <Box sx={{ padding: '30px', width: '550px' }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              marginBottom: '10px',
            }}
          >
            <IconButton onClick={handleCloseMenuFilter}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              {t('create.filter')}
            </Typography>
          </Stack>
          <Box sx={{ padding: '15px 20px', maxWidth: '550px' }}>
            <form onSubmit={handleSubmitFilter(onSubmitFilter)}>
              <Box mb={2}>
                <InputLabelCustom
                  htmlFor="retail_price_gte"
                  sx={{
                    color: '#49516F',
                    fontSize: '1.2rem',
                  }}
                >
                  {t('create.price')}
                </InputLabelCustom>
                <Grid container spacing={2}>
                  <Grid xs>
                    <Controller
                      control={controlFilter}
                      defaultValue=""
                      name="retail_price_gte"
                      render={({ field }) => (
                        <Box>
                          <FormControl fullWidth>
                            <NumericFormatCustom
                              id="retail_price_gte"
                              placeholder="0"
                              {...field}
                              thousandSeparator=","
                              allowNegative={false}
                              onChange={(event: any) =>
                                changeInputFormFilter(event)
                              }
                              onKeyPress={(event: any) => {
                                if (hasSpecialCharacterPrice(event.key)) {
                                  event.preventDefault()
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {t('create.from')} $
                                  </InputAdornment>
                                ),
                              }}
                              decimalScale={2}
                              error={!!errorsFilter.price_gte}
                              customInput={TextField}
                            />
                          </FormControl>
                          <FormHelperText error>
                            {errorsFilter.retail_price_gte &&
                              `${errorsFilter.retail_price_gte.message}`}
                          </FormHelperText>
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid xs>
                    <Controller
                      control={controlFilter}
                      defaultValue=""
                      name="retail_price_lte"
                      render={({ field }) => (
                        <Box>
                          <FormControl fullWidth>
                            <NumericFormatCustom
                              thousandSeparator=","
                              sx={{ borderColor: '#E1E6EF' }}
                              id="retail_price_lte"
                              placeholder="0"
                              {...field}
                              allowNegative={false}
                              onChange={(event: any) =>
                                changeInputFormFilter(event)
                              }
                              onKeyPress={(event: any) => {
                                if (hasSpecialCharacterPrice(event.key)) {
                                  event.preventDefault()
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {t('create.to')} $
                                  </InputAdornment>
                                ),
                              }}
                              decimalScale={2}
                              error={!!errorsFilter.retail_price_lte}
                              customInput={TextField}
                            />
                          </FormControl>
                          <FormHelperText error>
                            {errorsFilter.retail_price_lte &&
                              `${errorsFilter.retail_price_lte.message}`}
                          </FormHelperText>
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box mb={2}>
                <InputLabelCustom
                  sx={{
                    color: '#49516F',
                    fontSize: '1.2rem',
                  }}
                >
                  {t('create.quantity')}
                </InputLabelCustom>
                <Grid container spacing={2}>
                  <Grid xs>
                    <Controller
                      control={controlFilter}
                      defaultValue=""
                      name="instock_gte"
                      render={({ field }) => (
                        <Box>
                          <FormControl fullWidth>
                            <NumericFormatCustom
                              id="instock_gte"
                              placeholder="0"
                              {...field}
                              thousandSeparator=","
                              onChange={(event: any) =>
                                changeInputFormFilter(event)
                              }
                              allowNegative={false}
                              onKeyPress={(event: any) => {
                                if (hasSpecialCharacterPrice(event.key)) {
                                  event.preventDefault()
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {t('create.from')}
                                  </InputAdornment>
                                ),
                              }}
                              decimalScale={2}
                              error={!!errorsFilter.instock_gte}
                              customInput={TextField}
                            />
                          </FormControl>
                          <FormHelperText error>
                            {errorsFilter.instock_gte &&
                              `${errorsFilter.instock_gte.message}`}
                          </FormHelperText>
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid xs>
                    <Controller
                      control={controlFilter}
                      defaultValue=""
                      name="instock_lte"
                      render={({ field }) => (
                        <Box>
                          <FormControl fullWidth>
                            <NumericFormatCustom
                              id="instock_lte"
                              placeholder="0"
                              {...field}
                              thousandSeparator=","
                              onChange={(event: any) =>
                                changeInputFormFilter(event)
                              }
                              allowNegative={false}
                              onKeyPress={(event: any) => {
                                if (hasSpecialCharacterPrice(event.key)) {
                                  event.preventDefault()
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {t('create.to')}
                                  </InputAdornment>
                                ),
                              }}
                              decimalScale={2}
                              error={!!errorsFilter.instock_lte}
                              customInput={TextField}
                            />
                          </FormControl>
                          <FormHelperText error>
                            {errorsFilter.instock_lte &&
                              `${errorsFilter.instock_lte.message}`}
                          </FormHelperText>
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box mb={2}>
                <Grid container spacing={2}>
                  <Grid xs={6}>
                    <InputLabelCustom
                      htmlFor="Category"
                      sx={{
                        color: '#49516F',
                        fontSize: '1.2rem',
                      }}
                    >
                      {t('create.category')}
                    </InputLabelCustom>
                    <Controller
                      control={controlFilter}
                      name="category"
                      defaultValue={[]}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <SelectCustom
                            id="category"
                            displayEmpty
                            IconComponent={() => <KeyboardArrowDownIcon />}
                            renderValue={(value: any) => {
                              if (!value) {
                                return (
                                  <PlaceholderSelect>
                                    <div> {t('create.selectCategory')}</div>
                                  </PlaceholderSelect>
                                )
                              }
                              return value.map(function (
                                item: string,
                                idx: number
                              ) {
                                return (
                                  <span key={idx}>
                                    {idx > 0 ? ', ' : ''}
                                    {item.slice(
                                      item.indexOf('-') + 1,
                                      item.length
                                    )}
                                  </span>
                                )
                              })
                            }}
                            {...field}
                          >
                            <InfiniteScrollSelectMultiple
                              propData={stateListCategory}
                              handleSearch={(value) => {
                                setStateListCategory({ data: [] })
                                handleGetCategory(value)
                              }}
                              fetchMore={(value) => {
                                fetchMoreDataCategory(value)
                              }}
                              onClickSelectItem={(item: string[]) => {
                                setValueFilter('category', item)
                              }}
                              propsGetValue={getValuesFilter('category')}
                              propName="name"
                            />
                          </SelectCustom>
                        </FormControl>
                      )}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <InputLabelCustom
                      htmlFor="Manufacture"
                      sx={{
                        color: '#49516F',
                        fontSize: '1.2rem',
                      }}
                    >
                      {t('create.manufacture')}
                    </InputLabelCustom>
                    <Controller
                      control={controlFilter}
                      name="manufacturer"
                      defaultValue={[]}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <SelectCustom
                            id="manufacturer"
                            displayEmpty
                            defaultValue=""
                            IconComponent={() => <KeyboardArrowDownIcon />}
                            renderValue={(value: any) => {
                              if (!value) {
                                return (
                                  <PlaceholderSelect>
                                    <div>{t('create.selectManufacturer')}</div>
                                  </PlaceholderSelect>
                                )
                              }
                              return value.map(function (
                                item: string,
                                idx: number
                              ) {
                                return (
                                  <span key={idx}>
                                    {idx > 0 ? ', ' : ''}
                                    {item.slice(
                                      item.indexOf('-') + 1,
                                      item.length
                                    )}
                                  </span>
                                )
                              })
                            }}
                            {...field}
                          >
                            <InfiniteScrollSelectMultiple
                              propData={stateListManufacturer}
                              handleSearch={(value) => {
                                setStateListManufacturer({ data: [] })
                                handleGetManufacturer(value)
                              }}
                              fetchMore={(value) => {
                                fetchMoreDataManufacturer(value)
                              }}
                              onClickSelectItem={(item: string[]) => {
                                setValueFilter('manufacturer', item)
                              }}
                              propsGetValue={getValuesFilter('manufacturer')}
                              propName="name"
                            />
                          </SelectCustom>
                        </FormControl>
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Box mb={2}>
                <>
                  <InputLabelCustom
                    htmlFor="Brand"
                    sx={{
                      color: '#49516F',
                      fontSize: '1.2rem',
                    }}
                  >
                    {t('create.brand')}
                  </InputLabelCustom>
                  <Controller
                    control={controlFilter}
                    name="brand"
                    defaultValue={[]}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <SelectCustom
                          id="brand"
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (!value) {
                              return (
                                <PlaceholderSelect>
                                  <div> {t('create.selectBrand')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return value.map(function (
                              item: string,
                              idx: number
                            ) {
                              return (
                                <span key={idx}>
                                  {idx > 0 ? ', ' : ''}
                                  {item.slice(
                                    item.indexOf('-') + 1,
                                    item.length
                                  )}
                                </span>
                              )
                            })
                          }}
                          {...field}
                        >
                          <InfiniteScrollSelectMultiple
                            propData={stateListBrand}
                            handleSearch={(value) => {
                              setStateListBrand({ data: [] })
                              handleGetBrand(value)
                            }}
                            fetchMore={(value) => {
                              fetchMoreDataBrand(value)
                            }}
                            onClickSelectItem={(item: string[]) => {
                              setValueFilter('brand', item)
                            }}
                            propsGetValue={getValuesFilter('brand')}
                            propName="name"
                          />
                        </SelectCustom>
                      </FormControl>
                    )}
                  />
                </>
              </Box>

              <Grid container spacing={2} direction="row">
                <Grid xs={4}>
                  <ButtonCustom
                    fullWidth
                    sx={{
                      border: '#E1E6EF 0.1px solid',
                      color: '#49516F',
                    }}
                    variant="outlined"
                    onClick={handleCloseMenuFilter}
                  >
                    {t('create.cancel')}
                  </ButtonCustom>
                </Grid>
                <Grid xs={4}>
                  <ButtonCancel
                    type="reset"
                    onClick={handleReset}
                    fullWidth
                    sx={{ color: '#49516F' }}
                  >
                    {t('create.reset')}
                  </ButtonCancel>
                </Grid>
                <Grid xs={4}>
                  <ButtonCustom variant="contained" fullWidth type="submit">
                    {t('create.filter')}
                  </ButtonCustom>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Box>
      </Drawer>
      <Dialog
        open={stateOpenModalClearAll}
        onClose={() => {
          setStateOpenModalClearAll(false)
        }}
      >
        <DialogTitleTws>
          <IconButton
            onClick={() => {
              setStateOpenModalClearAll(false)
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('create.clearAllProduct')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {t('create.areYouSureToClearAllProduct')}
          </DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => {
                setStateOpenModalClearAll(false)
              }}
              variant="outlined"
              size="large"
            >
              {t('create.no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleClearAllProduct}
              size="large"
            >
              {t('create.yes')}{' '}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      <Dialog
        open={stateOpenModalAddProductVariant}
        onClose={() => setStateOpenModalAddProductVariant(false)}
        maxWidth={'xl'}
      >
        <DialogTitleTws>
          <IconButton
            onClick={() => {
              setStateOpenModalAddProductVariant(false)
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('create.selectProductVariant')}
        </TypographyH2>
        <DialogContentTws>
          <Box>
            <Grid container spacing={2} sx={{ width: '1000px' }}>
              {stateTemporaryProductVariantDetail?.map((item, index) => {
                if (!item.is_active) {
                  return
                }

                return (
                  <>
                    <GridProduct
                      // lg={3}
                      // xl={2}
                      xs={4}
                      lg={2.4}
                      key={index}
                      onClick={() => {
                        handleSelectProductVariant(item)
                      }}
                    >
                      <ItemProduct dataProduct={item} />
                    </GridProduct>
                  </>
                )
              })}
            </Grid>
          </Box>
        </DialogContentTws>
      </Dialog>

      {stateAddOtherProductForm && (
        <AddOtherProductForm
          stateOpen={stateAddOtherProductForm}
          setStateOpen={() => setStateAddOtherProductForm(false)}
          onSubmitAddOtherProduct={(value) =>
            handleSubmitAddOtherProduct(value)
          }
        />
      )}
      {stateHandleOpenEditPriceForOtherProduct && (
        <EditPriceFormForOtherProduct
          stateOpen={stateHandleOpenEditPriceForOtherProduct}
          setStateOpen={() => setStateHandleOpenEditPriceForOtherProduct(false)}
          stateProduct={stateCurrentOtherProductDetail}
          stateIndex={Number(stateCurrentOtherProductIndex)}
          handleSubmitEditPrice={(value, index) =>
            handleSubmitEditPriceForOtherProduct(value, index)
          }
        />
      )}
      {stateHandleOpenEditPriceForProduct && (
        <EditPriceFormForProduct
          stateOpen={stateHandleOpenEditPriceForProduct}
          setStateOpen={() => setStateHandleOpenEditPriceForProduct(false)}
          stateProduct={stateCurrentProductDataDetail}
          stateIndex={Number(stateCurrentProductIndex)}
          handleSubmitEditPrice={(value, index) =>
            handleSubmitEditPriceForProduct(value, index)
          }
        />
      )}
      <Dialog
        open={stateConfirmBuyOutOfStockProduct}
        onClose={() => setStateConfirmBuyOutOfStockProduct(false)}
      >
        <DialogTitleTws>
          <IconButton
            onClick={() => {
              setStateConfirmBuyOutOfStockProduct(false)
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <DialogContentTws>
          <DialogContentTextTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('create.thisProductIsOutOfStockDoYouWantToContinue')}
            </TypographyH2>
          </DialogContentTextTws>
        </DialogContentTws>

        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => {
                setStateConfirmBuyOutOfStockProduct(false)
              }}
              variant="outlined"
              size="large"
            >
              {t('create.no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleClickAllowToBuyProductOutOfStock}
              size="large"
            >
              {t('create.yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      <Dialog
        open={stateConfirmBuyOutOfStockProductVariant}
        onClose={() => setStateConfirmBuyOutOfStockProductVariant(false)}
      >
        <DialogTitleTws>
          <IconButton
            onClick={() => {
              setStateConfirmBuyOutOfStockProductVariant(false)
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <DialogContentTws>
          <DialogContentTextTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('create.thisProductIsOutOfStockDoYouWantToContinue')}
            </TypographyH2>
          </DialogContentTextTws>
        </DialogContentTws>

        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => {
                setStateConfirmBuyOutOfStockProductVariant(false)
              }}
              variant="outlined"
              size="large"
            >
              {t('create.no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleClickAllowToBuyProductVariantOutOfStock}
              size="large"
            >
              {t('create.yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      <Dialog
        open={stateConfirmBuyOverStockProduct}
        onClose={() => setStateConfirmBuyOverStockProduct(false)}
      >
        <DialogTitleTws>
          <IconButton
            onClick={() => {
              setStateConfirmBuyOverStockProduct(false)
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <DialogContentTws>
          <DialogContentTextTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('create.theQuantityIsOverTheStockLimitDoYouWantToContinue')}
            </TypographyH2>
          </DialogContentTextTws>
        </DialogContentTws>

        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => {
                setStateConfirmBuyOverStockProduct(false)
              }}
              variant="outlined"
              size="large"
            >
              {t('create.no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleClickAllowToBuyOverStockProduct}
              size="large"
            >
              {t('create.yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      {/* for button increase in state selected */}
      <Dialog
        open={stateConfirmBuyOverStockProductIncrease}
        onClose={() => setStateConfirmBuyOverStockProductIncrease(false)}
      >
        <DialogTitleTws>
          <IconButton
            onClick={() => {
              setStateConfirmBuyOverStockProductIncrease(false)
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <DialogContentTws>
          <DialogContentTextTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('create.theQuantityIsOverTheStockLimitDoYouWantToContinue')}
            </TypographyH2>
          </DialogContentTextTws>
        </DialogContentTws>

        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => {
                setStateConfirmBuyOverStockProductIncrease(false)
              }}
              variant="outlined"
              size="large"
            >
              {t('create.no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={
                handleClickIncreaseTempQuantityAllowToBuyOverStockProduct
              }
              size="large"
            >
              {t('create.yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      {/* for product variant  */}

      <Dialog
        open={stateConfirmBuyOverStockProductVariant}
        onClose={() => setStateConfirmBuyOverStockProductVariant(false)}
      >
        <DialogTitleTws>
          <IconButton
            onClick={() => {
              setStateConfirmBuyOverStockProductVariant(false)
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <DialogContentTws>
          <DialogContentTextTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('create.theQuantityIsOverTheStockLimitDoYouWantToContinue')}
            </TypographyH2>
          </DialogContentTextTws>
        </DialogContentTws>

        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => {
                setStateConfirmBuyOverStockProductVariant(false)
              }}
              variant="outlined"
              size="large"
            >
              {t('create.no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={() => {
                handleClickAllowToBuyOverStockProductVariant()
              }}
              size="large"
            >
              {t('create.yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      {stateContactForm && (
        <AddContactForm
          stateOpen={stateContactForm}
          setStateOpen={() => setStateContactForm(false)}
          setDrawerRetailOrderClose={() => setStatePayment(false)}
          addContactToRetail={(value) => handleAddContactToRetail(value)}
        />
      )}
      <Dialog
        open={stateReceiptSummary}
        onClose={() => {
          setStateReceiptSummary(false)
        }}
      >
        <PrintOrder
          data={{
            code: stateResponseCreateOrderDetail?.code,
            order_date: stateResponseCreateOrderDetail?.order_date,
            items: stateResponseCreateOrderDetail?.items
              ? stateResponseCreateOrderDetail?.items
              : [],
            other_products: stateResponseCreateOrderDetail?.other_products
              ? stateResponseCreateOrderDetail?.other_products
              : [],
            total_billing: stateResponseCreateOrderDetail?.total_billing,
            total_tip: stateResponseCreateOrderDetail?.total_tip,
            total_value: stateResponseCreateOrderDetail?.total_value,
          }}
          closePopup={() => setStateReceiptSummary(false)}
        />
      </Dialog>
      {/*! Dialog for barcode */}
      <Dialog
        open={stateConfirmBuyOutOfStockForBarcode}
        onClose={() => setStateConfirmBuyOutOfStockForBarcode(false)}
      >
        <DialogTitleTws>
          <IconButton
            onClick={() => {
              setStateConfirmBuyOutOfStockForBarcode(false)
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <DialogContentTws>
          <DialogContentTextTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('create.thisProductIsOutOfStockDoYouWantToContinue')}
            </TypographyH2>
          </DialogContentTextTws>
        </DialogContentTws>

        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => {
                setStateConfirmBuyOutOfStockForBarcode(false)
              }}
              variant="outlined"
              size="large"
            >
              {t('create.no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleAllowToBuyProductOutOfStockFromBarcode}
              size="large"
            >
              {t('create.yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      <Dialog
        open={stateConfirmBuyOverStockForBarcode}
        onClose={() => setStateConfirmBuyOverStockForBarcode(false)}
      >
        <DialogTitleTws>
          <IconButton
            onClick={() => {
              setStateConfirmBuyOverStockForBarcode(false)
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <DialogContentTws>
          <DialogContentTextTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('create.thisProductIsOutOfStockDoYouWantToContinue')}
            </TypographyH2>
          </DialogContentTextTws>
        </DialogContentTws>

        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => {
                setStateConfirmBuyOverStockForBarcode(false)
              }}
              variant="outlined"
              size="large"
            >
              {t('create.no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={() => {
                handleClickAllowToBuyOverStockProductFromBarcode()
              }}
              size="large"
            >
              {t('create.yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      <Dialog open={stateApplyVoucherForm} onClose={handleCloseVoucherDialog}>
        <DialogTitleTws>
          <IconButton onClick={handleCloseVoucherDialog}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <DialogContentTws>
          <DialogContentTextTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('create.voucherApplicationForm')}
            </TypographyH2>
            <form onSubmit={handleSubmitVoucher(onSubmitVoucher)}>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={controlVoucher}
                  name="voucher_code"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="voucher_code"
                        sx={{ textAlign: 'left' }}
                        error={!!errorsVoucher.voucher_code}
                      >
                        <RequiredLabel />
                        {t('create.voucherCode')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          error={!!errorsVoucher.voucher_code}
                          {...field}
                        />
                      </FormControl>

                      <FormHelperText error={!!errorsVoucher.voucher_code}>
                        {errorsVoucher.voucher_code &&
                          `${errorsVoucher.voucher_code.message}`}
                      </FormHelperText>
                    </>
                  )}
                />
              </Box>
              <Stack
                direction="row"
                sx={{ marginBottom: '15px' }}
                spacing={1}
                alignItems="center"
              >
                {stateCheckVoucherIsValid ? (
                  <CheckCircle size={24} color="#1DB46A" weight="fill" />
                ) : (
                  <Warning size={24} color="#F6CC47" weight="fill" />
                )}
                <Typography sx={{ textAlign: 'left' }}>
                  {stateCheckVoucherIsValid ? t('codeValid') : t('codeInvalid')}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <ButtonCancel onClick={handleCloseVoucherDialog} size="large">
                  {t('create.cancel')}
                </ButtonCancel>
                <ButtonCustom variant="contained" size="large" type="submit">
                  {t('create.submit')}
                </ButtonCustom>
              </Stack>
            </form>
          </DialogContentTextTws>
        </DialogContentTws>
      </Dialog>
    </>
  )
}

export default CreateRetailOrder
