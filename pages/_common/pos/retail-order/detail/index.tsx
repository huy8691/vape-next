import { yupResolver } from '@hookform/resolvers/yup'
import {
  Avatar,
  Box,
  Breadcrumbs,
  Checkbox,
  Dialog,
  Divider,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  ArrowCounterClockwise,
  ArrowRight,
  CheckCircle,
  CreditCard,
  Money,
  X,
} from '@phosphor-icons/react'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import ImageDefault from 'public/images/logo.svg'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  BoxCustom,
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  TableCellTws,
  TableContainerTws,
  TextFieldCustom,
  TypographyH2,
  TypographySectionTitle,
  TypographyTitlePage,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  KEY_MODULE,
  PERMISSION_RULE,
  checkPermission,
  handlerGetErrMessage,
  platform,
} from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import * as Yup from 'yup'
import PrintOrder from '../printOrder'
import CurrencyNumberFormat from './CurrencyNumberFormat'
import {
  exportOrder,
  getRetailOrderDetail,
  refundRetailOrder,
  saveProductRefund,
  sendInvoiceToEmail,
} from './retailOrderDetailApi'
import {
  ListItemRetailOrder,
  OtherProductType,
  ProductDataType,
  RefundDetailType,
  RefundFormType,
  RetailOrderDetailDataResponseType,
  SaveProductRefundDetailType,
} from './retailOrderDetailModel'
import classes from './styles.module.scss'

const TypographyCustom = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: '400',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#1B1F27',
}))

const TypographyTotalCustom = styled(Typography)(() => ({
  fontSize: '1.8rem',
  fontWeight: '600',
  color: '#1CB25B',
}))

const RetailOrderDetail = () => {
  const { t } = useTranslation('retail-order-list')
  const permission = useAppSelector((state) => state.permission.data)
  const [pushMessage] = useEnqueueSnackbar()
  const [stateOpenDialog, setStateOpenDialog] = useState(false)
  const [stateAllowToBuyOutOfStock, setStateAllowToBuyOutOfStock] =
    useState(false)
  const [stateDrawerRefund, setStateDrawerRefund] = useState(false)
  const [stateCurrentReOrderType, setStateCurrentReOrderType] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const [stateRetailOrderRetail, setStateRetailOrderRetail] =
    useState<RetailOrderDetailDataResponseType>()
  const [stateRadioPaymentMethod, setStateRadioPaymentMethod] = useState(1)
  const [stateCurrentLimitTotalAmount, setStateCurrentLimitTotalAmount] =
    useState(0)
  const [
    stateSelectedListProductToRefund,
    setStateSelectedListProductToRefund,
  ] = useState<ListItemRetailOrder[]>([])
  const [
    stateSelectedListOtherProductToRefund,
    setStateSelectedListOtherProductToRefund,
  ] = useState<OtherProductType[]>([])
  const [stateCheckedRefundTip, setStateCheckedRefundTip] = useState(false)
  const [stateRefundDetail, setStateRefundDetail] = useState<RefundDetailType>({
    cash: 0,
    credit: 0,
  })
  const [stateReceiptSummary, setStateReceiptSummary] = useState(false)
  const [stateInvoiceUrl, setStateInvoiceUrl] = useState('')
  const [stateOpenSendInvoiceDrawer, setStateOpenSendInvoiceDrawer] =
    useState(false)
  useEffect(() => {
    if (router.query.id) {
      dispatch(loadingActions.doLoading())
      handleGetRetailOrderDetail()
    }
  }, [router.query])

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
  useEffect(() => {
    //calculate limit of total amount
    if (!stateRetailOrderRetail) return
    if (
      !stateCheckedRefundTip &&
      stateSelectedListProductToRefund.length === 0 &&
      stateSelectedListOtherProductToRefund.length === 0
    ) {
      setStateCurrentLimitTotalAmount(0)
      setValue('total_amount', 0)
      return
    }
    let limitRefundAmount = 0
    stateSelectedListProductToRefund.forEach(
      (item) => (limitRefundAmount += Number(item.total.toFixed(2)))
    )
    stateSelectedListOtherProductToRefund.forEach(
      (item) => (limitRefundAmount += Number(item.total.toFixed(2)))
    )
    if (stateCheckedRefundTip) {
      limitRefundAmount += Number(
        stateRetailOrderRetail?.data.total_tip?.toFixed(2)
      )
    }
    setStateCurrentLimitTotalAmount(Number(limitRefundAmount.toFixed(2)))
    setValue('total_amount', limitRefundAmount)
  }, [
    stateRetailOrderRetail,
    stateSelectedListOtherProductToRefund,
    stateSelectedListProductToRefund,
    stateCheckedRefundTip,
  ])

  const handleGetRetailOrderDetail = () => {
    getRetailOrderDetail(Number(router.query.id))
      .then((res) => {
        const { data } = res
        if (data.data.payment_status === 'PAID') {
          if (data.data.cash === 0) {
            setStateRadioPaymentMethod(2)
          }
          if (data.data.credit === 0) {
            setStateRadioPaymentMethod(1)
          }
        }
        setStateRetailOrderRetail(data)

        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        if (status === 404) {
          router.push('/404')
        }
        pushMessage(handlerGetErrMessage(status, data), 'error')
        console.log(response, status)
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  const handleOpenReOrderDialog = () => {
    setStateCurrentReOrderType(
      localStorage.getItem('listSelectedProduct') !== null ||
        localStorage.getItem('listOtherProduct') !== null
    )
    setStateOpenDialog(true)
  }
  const handleReOrderRetail = () => {
    if (!stateRetailOrderRetail) return
    if (stateCurrentReOrderType) {
      localStorage.removeItem('listSelectedProduct')
      localStorage.removeItem('listOtherProduct')
    }
    const resultIsOutOfStock = stateRetailOrderRetail.data.items.some(
      (item) => item.instock === 0
    )
    if (resultIsOutOfStock) {
      setStateOpenDialog(false)
      setStateAllowToBuyOutOfStock(true)
      return
    }
    if (stateRetailOrderRetail.data.items.length > 0) {
      const stateSelectedProduct: ProductDataType[] =
        stateRetailOrderRetail?.data.items.map((item) => {
          if (item.have_variant) {
            const variantItem: ProductDataType = {
              attribute_options: item.attribute_options,
              id: item.id,
              product_id: item.product_id,
              code: item.code,
              isSelected: true,
              name: item.name,
              quantity: item.instock,
              tempQuantity: item.quantity,
              thumbnail: item.thumbnail,
              is_active: item.is_active,
              retail_price: item.unit_price,
            }
            return variantItem
          } else {
            const productWithoutVariant: ProductDataType = {
              id: item.id,
              code: item.code,
              isSelected: true,
              name: item.name,
              tempQuantity: item.quantity,
              instock: item.instock,
              thumbnail: item.thumbnail,
              is_active: item.is_active,
              min_retail_price: item.unit_price,
              retail_price: item.unit_price,
              variants_count: 0,
            }
            return productWithoutVariant
          }
        })
      localStorage.setItem(
        'listSelectedProduct',
        JSON.stringify(stateSelectedProduct)
      )
    }
    if (stateRetailOrderRetail.data.other_products.length > 0) {
      const listOtherProduct: OtherProductType[] =
        stateRetailOrderRetail.data.other_products.map((item) => ({
          ...item,
        }))
      localStorage.setItem('listOtherProduct', JSON.stringify(listOtherProduct))
    }
    setStateOpenDialog(false)
    router.push(`/${platform()}/pos/retail-order/create`)
  }
  const handleNotToBuyOutOfStock = () => {
    if (!stateRetailOrderRetail) return
    const filteredListProduct = stateRetailOrderRetail?.data.items.filter(
      (item) => item.instock > 0
    )
    if (filteredListProduct.length > 0) {
      const stateSelectedProduct: ProductDataType[] = filteredListProduct.map(
        (item) => {
          if (item.have_variant) {
            const variantItem: ProductDataType = {
              attribute_options: item.attribute_options,
              id: item.id,
              product_id: item.product_id,
              code: item.code,
              isSelected: true,
              name: item.name,
              quantity: item.instock,
              tempQuantity: item.quantity,
              thumbnail: item.thumbnail,
              is_active: item.is_active,
              retail_price: item.unit_price,
            }
            return variantItem
          } else {
            const productWithoutVariant: ProductDataType = {
              id: item.id,
              code: item.code,
              isSelected: true,
              name: item.name,
              tempQuantity: item.quantity,
              instock: item.instock,
              thumbnail: item.thumbnail,
              is_active: item.is_active,
              min_retail_price: item.unit_price,
              retail_price: item.unit_price,
              variants_count: 0,
            }
            return productWithoutVariant
          }
        }
      )
      localStorage.setItem(
        'listSelectedProduct',
        JSON.stringify(stateSelectedProduct)
      )
    }
    if (stateRetailOrderRetail.data.other_products.length > 0) {
      const listOtherProduct: OtherProductType[] =
        stateRetailOrderRetail.data.other_products.map((item) => ({
          ...item,
        }))
      localStorage.setItem('listOtherProduct', JSON.stringify(listOtherProduct))
    }
    setStateAllowToBuyOutOfStock(false)
    router.push(`/${platform()}/pos/retail-order/create`)
  }
  const handleConfirmToBuyOutOfStock = () => {
    if (!stateRetailOrderRetail) return
    if (stateRetailOrderRetail.data.items.length > 0) {
      const stateSelectedProduct: ProductDataType[] =
        stateRetailOrderRetail?.data.items.map((item) => {
          if (item.have_variant) {
            if (item.instock === 0) {
              const variantItem: ProductDataType = {
                attribute_options: item.attribute_options,
                id: item.id,
                product_id: item.product_id,
                code: item.code,
                isSelected: true,
                name: item.name,
                quantity: item.instock,
                tempQuantity: 1,
                thumbnail: item.thumbnail,
                is_active: item.is_active,
                retail_price: item.unit_price,
                isAllowed: true,
              }
              return variantItem
            }
            const variantItem: ProductDataType = {
              attribute_options: item.attribute_options,
              id: item.id,
              product_id: item.product_id,
              code: item.code,
              isSelected: true,
              name: item.name,
              quantity: item.instock,
              tempQuantity: item.quantity,
              thumbnail: item.thumbnail,
              is_active: item.is_active,
              retail_price: item.unit_price,
            }
            return variantItem
          } else {
            if (item.instock === 0) {
              const productWithoutVariant: ProductDataType = {
                id: item.id,
                code: item.code,
                isSelected: true,
                name: item.name,
                tempQuantity: 1,
                instock: item.instock,
                thumbnail: item.thumbnail,
                is_active: item.is_active,
                min_retail_price: item.unit_price,
                retail_price: item.unit_price,
                isAllowed: true,
                variants_count: 0,
              }
              return productWithoutVariant
            }
            const productWithoutVariant: ProductDataType = {
              id: item.id,
              code: item.code,
              isSelected: true,
              name: item.name,
              tempQuantity: item.quantity,
              instock: item.instock,
              thumbnail: item.thumbnail,
              is_active: item.is_active,
              min_retail_price: item.unit_price,
              retail_price: item.unit_price,
              variants_count: 0,
            }
            return productWithoutVariant
          }
        })
      localStorage.setItem(
        'listSelectedProduct',
        JSON.stringify(stateSelectedProduct)
      )
    }
    if (stateRetailOrderRetail.data.other_products.length > 0) {
      const listOtherProduct: OtherProductType[] =
        stateRetailOrderRetail.data.other_products.map((item) => ({
          ...item,
        }))
      localStorage.setItem('listOtherProduct', JSON.stringify(listOtherProduct))
    }
    setStateAllowToBuyOutOfStock(false)
    router.push(`/${platform().toLowerCase()}/pos/retail-order/create`)
  }
  const handleCheckIsProductIsIncludedInListSelectedProduct = (
    index: number
  ) => {
    return stateSelectedListProductToRefund.some((item) => item.id === index)
  }
  const handleCheckIsOtherProductIsIncludedInListSelectedOtherProduct = (
    index: number
  ) => {
    return stateSelectedListOtherProductToRefund.some(
      (item) => item.other_product_id === index
    )
  }
  const handleChangeListSelectedOtherProduct = (item: OtherProductType) => {
    const cloneCurrentSelectedOtherProduct: OtherProductType[] = JSON.parse(
      JSON.stringify(stateSelectedListOtherProductToRefund)
    )
    if (
      handleCheckIsOtherProductIsIncludedInListSelectedOtherProduct(
        item.other_product_id
      )
    ) {
      const foundIndex = cloneCurrentSelectedOtherProduct.findIndex(
        (obj) => obj.other_product_id === item.other_product_id
      )

      cloneCurrentSelectedOtherProduct.splice(foundIndex, 1)
      setStateSelectedListOtherProductToRefund(cloneCurrentSelectedOtherProduct)
    } else {
      cloneCurrentSelectedOtherProduct.push(item)
      setStateSelectedListOtherProductToRefund(cloneCurrentSelectedOtherProduct)
    }
  }
  const handleChangeListSelectedProduct = (item: ListItemRetailOrder) => {
    const cloneCurrentSelectedProduct: ListItemRetailOrder[] = JSON.parse(
      JSON.stringify(stateSelectedListProductToRefund)
    )
    if (handleCheckIsProductIsIncludedInListSelectedProduct(item.id)) {
      const foundIndex = cloneCurrentSelectedProduct.findIndex(
        (obj) => obj.id === item.id
      )

      cloneCurrentSelectedProduct.splice(foundIndex, 1)
      setStateSelectedListProductToRefund(cloneCurrentSelectedProduct)
    } else {
      cloneCurrentSelectedProduct.push(item)
      setStateSelectedListProductToRefund(cloneCurrentSelectedProduct)
    }
  }

  const {
    handleSubmit,
    control,

    reset,
    clearErrors,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RefundFormType>({
    resolver: yupResolver(
      Yup.object().shape(
        {
          total_amount: Yup.number()
            .required(t('validate.totalAmount.required'))
            .positive(t('validate.totalAmount.positive'))
            .typeError(t('validate.totalAmount.typeError'))
            .min(
              stateCheckedRefundTip
                ? Number(stateRetailOrderRetail?.data?.total_tip)
                : 1,
              `${t('validate.totalAmount.min')} ${
                stateCheckedRefundTip
                  ? formatMoney(Number(stateRetailOrderRetail?.data?.total_tip))
                  : '1.00$'
              }`
            )
            .max(
              Number(stateCurrentLimitTotalAmount.toFixed(2)),
              `${t(
                'validate.totalAmount.max'
              )} ${stateCurrentLimitTotalAmount.toFixed(2)}$`
            ),
          reason: Yup.string()
            .nullable()
            .notRequired()
            .when('reason', {
              is: (value: any) => {
                return value || value === null
              },
              then: (rule) =>
                rule
                  .min(2, t('validate.reason.minMax'))
                  .max(1000, t('validate.reason.minMax')),
            }),
        },
        [['reason', 'reason']]
      )
    ),
    mode: 'all',
  })

  const handleChangeRefundTip = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateCheckedRefundTip(event.target.checked)
  }
  useEffect(() => {
    if (!stateRetailOrderRetail) return
    console.log('watch(total_amount', watch('total_amount'))
    if (!watch('total_amount')) {
      setStateRefundDetail({
        cash: 0,
        credit: 0,
      })
      return
    }
    console.log('')
    const cloneWatchCurrentLimitAmount: number = watch('total_amount')
    console.log('cloneWatchCurrentLimitAmount', cloneWatchCurrentLimitAmount)
    if (stateRadioPaymentMethod === 1) {
      if (
        cloneWatchCurrentLimitAmount > Number(stateRetailOrderRetail.data.cash)
      ) {
        setStateRefundDetail({
          cash: Number(stateRetailOrderRetail.data.cash?.toFixed(2)),
          credit: Number(
            (
              cloneWatchCurrentLimitAmount -
              Number(stateRetailOrderRetail.data.cash?.toFixed(2))
            ).toFixed(2)
          ),
        })
      } else {
        setStateRefundDetail({
          cash: Number(cloneWatchCurrentLimitAmount.toFixed(2)),
          credit: 0,
        })
      }
    }
    if (stateRadioPaymentMethod === 2) {
      if (
        cloneWatchCurrentLimitAmount >
        Number(stateRetailOrderRetail.data.credit)
      ) {
        setStateRefundDetail({
          credit: Number(stateRetailOrderRetail.data.credit?.toFixed(2)),
          cash: Number(
            (
              cloneWatchCurrentLimitAmount -
              Number(stateRetailOrderRetail.data.credit?.toFixed(2))
            ).toFixed(2)
          ),
        })
      } else {
        setStateRefundDetail({
          credit: Number(cloneWatchCurrentLimitAmount.toFixed(2)),
          cash: 0,
        })
      }
    }
  }, [
    watch('total_amount'),
    stateRadioPaymentMethod,
    stateRetailOrderRetail,
    stateSelectedListOtherProductToRefund,
    stateSelectedListProductToRefund,
    stateCheckedRefundTip,
  ])
  const handleCloseDrawer = () => {
    reset()
    clearErrors()
    setStateDrawerRefund(false)
    setStateSelectedListProductToRefund([])
    setStateSelectedListOtherProductToRefund([])
    setStateCheckedRefundTip(false)
    setStateCurrentLimitTotalAmount(0)
  }
  const onSubmitValue = (value: RefundFormType) => {
    dispatch(loadingActions.doLoading())
    const listIdSelectedProduct: number[] =
      stateSelectedListProductToRefund.map((item) => item.id)
    const listIdSelectedOtherProduct: number[] =
      stateSelectedListOtherProductToRefund.map((item) => item.other_product_id)
    const submitValueForSaveProductRefund: SaveProductRefundDetailType = {
      reason: value.reason ? value.reason : null,
      total_amount: value.total_amount,
      refund_include_tip: stateCheckedRefundTip,
      items: listIdSelectedProduct,
      other_products: listIdSelectedOtherProduct,
    }
    saveProductRefund(Number(router.query.id), submitValueForSaveProductRefund)
      .then(() => {
        pushMessage(t('message.saveProductForRefundSuccessfully'), 'success')
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    const submitCashAndCreditFor: RefundDetailType = {
      cash: stateRefundDetail.cash,
      credit: stateRefundDetail.credit,
    }
    refundRetailOrder(Number(router.query.id), submitCashAndCreditFor)
      .then(() => {
        handleGetRetailOrderDetail()

        handleCloseDrawer()
        pushMessage(t('message.refundForOrderSuccessfully'), 'success')
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  const handleOpenSendInvoiceDrawer = () => {
    if (!stateRetailOrderRetail) return
    dispatch(loadingActions.doLoading())
    exportOrder(stateRetailOrderRetail?.data.id)
      .then((res) => {
        const { data } = res.data
        setStateInvoiceUrl(data.url)
        dispatch(loadingActions.doLoadingSuccess())
        setStateOpenSendInvoiceDrawer(true)
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleSendInvoiceViaEmail = () => {
    if (!stateRetailOrderRetail || !stateInvoiceUrl) return
    dispatch(loadingActions.doLoading())
    sendInvoiceToEmail(stateRetailOrderRetail?.data.id, {
      invoice_url: stateInvoiceUrl,
    })
      .then(() => {
        pushMessage(t('message.sendEmailSuccessfully'), 'success')
        setStateOpenSendInvoiceDrawer(false)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
      <Head>
        <title>{t('title')} | VAPE</title>
      </Head>
      <Stack direction="row" spacing={20} alignItems="center">
        <TypographyTitlePage>{t('title')}</TypographyTitlePage>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          flex={1}
        >
          <Box>
            <ButtonCustom
              sx={{
                background: theme.palette.primary.main,
                color: 'white',
                textTransform: 'capitalize',
                borderRadius: '32px',
                padding: '10px 15px 10px 14px',
                mr: 2,
              }}
              onClick={handleOpenReOrderDialog}
              startIcon={
                <Box
                  sx={{
                    borderRadius: '50%',
                    background: 'white',
                    padding: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <ArrowCounterClockwise
                    color={theme.palette.primary.main}
                    size={20}
                  />
                </Box>
              }
              variant="contained"
            >
              <Typography sx={{ fontWeight: '600' }}>{t('reOrder')}</Typography>
            </ButtonCustom>
            {stateRetailOrderRetail?.data.payment_status === 'PAID' && (
              <ButtonCustom
                sx={{
                  background: theme.palette.error.main,
                  color: 'white',
                  textTransform: 'capitalize',
                  borderRadius: '32px',
                  padding: '10px 15px 10px 14px',
                }}
                onClick={() => setStateDrawerRefund(true)}
                startIcon={
                  <Box
                    sx={{
                      borderRadius: '50%',
                      background: 'white',
                      padding: '4px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Money color={theme.palette.error.main} size={20} />
                  </Box>
                }
                variant="contained"
              >
                <Typography sx={{ fontWeight: '600' }}>
                  {t('refund')}
                </Typography>
              </ButtonCustom>
            )}
          </Box>
          <Stack direction="row" spacing={1}>
            {stateRetailOrderRetail?.data.client && (
              <ButtonCustom
                variant="contained"
                size="large"
                onClick={handleOpenSendInvoiceDrawer}
              >
                {t('sendInvoice')}
              </ButtonCustom>
            )}
            <ButtonCustom
              variant="contained"
              size="large"
              onClick={() => setStateReceiptSummary(true)}
            >
              {t('print')}
            </ButtonCustom>
          </Stack>
        </Stack>
      </Stack>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '25px' }}
      >
        <Link
          href={`/${platform().toLowerCase()}/pos/retail-order//retail-order-list`}
        >
          <Typography sx={{ '&:hover': { cursor: 'pointer' } }}>
            {t('retailOrder')}
          </Typography>
        </Link>
        <Typography>
          {t('retailOrderDetails')} #{stateRetailOrderRetail?.data.code}
        </Typography>
      </Breadcrumbs>
      <Grid container spacing={2} sx={{ marginBottom: '25px' }}>
        <Grid item xs={8} alignItems="flex-start">
          <TypographySectionTitle sx={{ marginBottom: '10px' }}>
            {t('retailOrder')}
          </TypographySectionTitle>
          {stateRetailOrderRetail ? (
            <Box>
              <BoxCustom
                sx={{
                  padding: '15px',
                  borderRadius: '5px',
                  marginBottom: '15px',
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography> {t('orderNo')}</Typography>
                    <Typography>
                      #{stateRetailOrderRetail?.data.code}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography> {t('orderStatus')}</Typography>
                    <Box>
                      <Typography sx={{ textTransform: 'capitalize' }}>
                        {t(
                          `${stateRetailOrderRetail.data.status
                            .toLowerCase()
                            .replaceAll('_', ' ')}` as any
                        )}
                      </Typography>
                    </Box>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography> {t('orderDate')}</Typography>
                    <Typography>
                      {moment(stateRetailOrderRetail.data?.order_date).format(
                        'MM/DD/YYYY - hh:mm A'
                      )}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <TypographyCustom sx={{ fontSize: '14px' }}>
                      {t('paymentMethod')}
                    </TypographyCustom>
                    <TypographyCustom
                      sx={{ fontSize: '14px', textTransform: 'capitalize' }}
                    >
                      {stateRetailOrderRetail.data?.payment_method.toLowerCase()}
                    </TypographyCustom>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <TypographyCustom sx={{ fontSize: '14px' }}>
                      {t('paymentStatus')}
                    </TypographyCustom>
                    <TypographyCustom
                      sx={{ fontSize: '14px', textTransform: 'capitalize' }}
                    >
                      {t(
                        `${stateRetailOrderRetail.data.payment_status
                          .toLowerCase()
                          .replaceAll('_', ' ')}` as any
                      )}
                    </TypographyCustom>
                  </Stack>
                </Stack>
              </BoxCustom>
              {stateRetailOrderRetail &&
                stateRetailOrderRetail.data.items.length > 0 && (
                  <>
                    <TypographySectionTitle sx={{ marginBottom: '10px' }}>
                      {t('products')}
                    </TypographySectionTitle>
                    <TableContainerTws
                      sx={{
                        marginTop: 0,
                        marginBottom: '15px',
                        border: 'none',
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCellTws> {t('products')}</TableCellTws>
                            <TableCellTws align="right">
                              {t('quantity')}
                            </TableCellTws>
                            {/* <TableCellTws>{t('create.price')}</TableCellTws> */}
                            <TableCellTws width={100} align="right">
                              {t('subTotal')}
                            </TableCellTws>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {stateRetailOrderRetail?.data?.items.map(
                            (items, index: number) => {
                              return (
                                <TableRow
                                  key={`item-${index}`}
                                  sx={{
                                    borderLeft: '1px solid #E0E0DF',
                                    borderRight: '1px solid #E0E0DF',
                                  }}
                                >
                                  <TableCellTws>
                                    <Stack
                                      direction="row"
                                      alignItems="center"
                                      spacing={2}
                                    >
                                      <div className={classes['image-wrapper']}>
                                        {checkPermission(
                                          permission,
                                          KEY_MODULE.Inventory,
                                          PERMISSION_RULE.ViewDetails
                                        ) ? (
                                          <Link
                                            href={`/${platform().toLowerCase()}/inventory/product/detail/${
                                              items.id
                                            }`}
                                          >
                                            <a>
                                              <Image
                                                alt="product-image"
                                                src={
                                                  items.thumbnail ||
                                                  ImageDefault
                                                }
                                                width={50}
                                                height={50}
                                              />
                                            </a>
                                          </Link>
                                        ) : (
                                          <Image
                                            alt="product-image"
                                            src={
                                              items.thumbnail || ImageDefault
                                            }
                                            width={60}
                                            height={60}
                                          />
                                        )}
                                      </div>
                                      {checkPermission(
                                        permission,
                                        KEY_MODULE.Inventory,
                                        PERMISSION_RULE.ViewDetails
                                      ) ? (
                                        <Link
                                          href={`/${platform().toLowerCase()}/inventory/product/detail/${
                                            items.id
                                          }`}
                                        >
                                          <a>
                                            <Stack
                                              direction="row"
                                              divider={
                                                <Divider
                                                  orientation="vertical"
                                                  flexItem
                                                />
                                              }
                                              spacing={2}
                                            >
                                              <TypographyCustom
                                                sx={{
                                                  fontWeight: '300',
                                                }}
                                              >
                                                #{items.code}
                                              </TypographyCustom>
                                              <TypographyCustom>
                                                {items.name}
                                              </TypographyCustom>
                                            </Stack>
                                          </a>
                                        </Link>
                                      ) : (
                                        <Stack
                                          direction="row"
                                          divider={
                                            <Divider
                                              orientation="vertical"
                                              flexItem
                                            />
                                          }
                                          spacing={2}
                                        >
                                          <TypographyCustom
                                            sx={{
                                              fontWeight: '300',
                                            }}
                                          >
                                            #{items.code}
                                          </TypographyCustom>
                                          <TypographyCustom>
                                            {items.name}
                                          </TypographyCustom>
                                        </Stack>
                                      )}
                                    </Stack>
                                  </TableCellTws>
                                  <TableCellTws
                                    align="right"
                                    sx={{ textTransform: 'lowercase' }}
                                  >
                                    {items.quantity}{' '}
                                    {t(`${items.unit_type}` as any)}
                                  </TableCellTws>
                                  {/* <TableCellTws>
                                    <Typography
                                      sx={{
                                        fontWeight: 700,
                                        textTransform: 'lowercase',
                                      }}
                                    >
                                      {formatMoney(items.unit_price)}
                                      <span
                                        style={{
                                          fontWeight: '400',
                                          fontSize: '12px',
                                        }}
                                      >
                                        {''} / {t(`${items.unit_type}` as any)}
                                      </span>
                                    </Typography>
                                  </TableCellTws> */}
                                  <TableCellTws width={100} align="right">
                                    <TypographyTotalCustom
                                      sx={{ fontWeight: 700, fontSize: '16px' }}
                                    >
                                      {formatMoney(items.total)}
                                    </TypographyTotalCustom>
                                  </TableCellTws>
                                </TableRow>
                              )
                            }
                          )}
                        </TableBody>
                      </Table>
                    </TableContainerTws>
                  </>
                )}

              {stateRetailOrderRetail &&
                stateRetailOrderRetail?.data?.other_products.length > 0 && (
                  <>
                    <TypographySectionTitle sx={{ marginBottom: '10px' }}>
                      {t('otherProduct')}
                    </TypographySectionTitle>
                    <TableContainerTws
                      sx={{
                        marginTop: 0,
                        marginBottom: '15px',
                        border: 'none',
                      }}
                    >
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCellTws>{t('products')}</TableCellTws>
                            <TableCellTws>{t('quantity')}</TableCellTws>
                            <TableCellTws>{t('create.price')}</TableCellTws>
                            <TableCellTws width={100} align="right">
                              {t('subTotal')}
                            </TableCellTws>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {stateRetailOrderRetail?.data?.other_products.map(
                            (items, index: number) => {
                              return (
                                <TableRow
                                  sx={{
                                    borderLeft: '1px solid #E0E0DF',
                                    borderRight: '1px solid #E0E0DF',
                                  }}
                                  key={`item-${index}`}
                                >
                                  <TableCellTws>
                                    <TypographyCustom>
                                      {items.product_name}
                                    </TypographyCustom>
                                  </TableCellTws>
                                  <TableCellTws
                                    sx={{ textTransform: 'lowercase' }}
                                  >
                                    {items.quantity}{' '}
                                    {items.unit ? items.unit : 'unit'}
                                  </TableCellTws>
                                  <TableCellTws>
                                    <Typography
                                      sx={{
                                        fontWeight: 700,
                                        textTransform: 'lowercase',
                                      }}
                                    >
                                      {formatMoney(items.price)}
                                      <span
                                        style={{
                                          fontWeight: '400',
                                          fontSize: '12px',
                                        }}
                                      >
                                        {''} /{' '}
                                        {items.unit ? items.unit : 'unit'}
                                      </span>
                                    </Typography>
                                  </TableCellTws>
                                  <TableCellTws width={100} align="right">
                                    <TypographyTotalCustom
                                      sx={{
                                        fontWeight: 500,
                                        fontSize: '16px',
                                        color: '#1DB46A',
                                      }}
                                    >
                                      {formatMoney(items.total)}
                                    </TypographyTotalCustom>
                                  </TableCellTws>
                                </TableRow>
                              )
                            }
                          )}
                        </TableBody>
                      </Table>
                    </TableContainerTws>
                  </>
                )}
            </Box>
          ) : (
            <Skeleton variant="rounded" width="100%" height={140} />
          )}
        </Grid>

        <Grid item xs={4}>
          {' '}
          <TypographySectionTitle sx={{ marginBottom: '10px' }}>
            {t('billing')}
          </TypographySectionTitle>
          <BoxCustom
            sx={{
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '15px',
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 500 }}>
                  {t('subTotal')}
                </Typography>
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 500 }}>
                  {formatMoney(stateRetailOrderRetail?.data?.total_value)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 500 }}>
                  {t('tip')}
                </Typography>
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 500 }}>
                  {formatMoney(stateRetailOrderRetail?.data?.total_tip)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 500 }}>
                  Rounded up amount
                </Typography>
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 500 }}>
                  {formatMoney(stateRetailOrderRetail?.data?.round_up_amount)}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ borderTop: '1px solid #D1D1D1', paddingTop: '5px' }}
              >
                <Typography
                  sx={{
                    fontSize: '1.6rem',
                    color: '#49516F',
                    fontWeight: 700,
                  }}
                >
                  {t('totalBilling')}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '1.6rem',
                    color: '#49516F',
                    fontWeight: 500,
                  }}
                >
                  {formatMoney(stateRetailOrderRetail?.data?.total_billing)}
                </Typography>
              </Stack>
            </Stack>
          </BoxCustom>
          <TypographySectionTitle sx={{ marginBottom: '10px' }}>
            Payment
          </TypographySectionTitle>
          <BoxCustom
            sx={{ marginBottom: '15px', padding: '15px', borderRadius: '5px' }}
          >
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>{t('paymentMethod')}</Typography>
                <Typography
                  sx={{
                    textTransform: 'capitalize',
                    fontWeight: 500,
                  }}
                >
                  {stateRetailOrderRetail?.data?.payment_method.toLowerCase()}
                </Typography>
              </Stack>

              {stateRetailOrderRetail?.data &&
                stateRetailOrderRetail?.data?.payment_method === 'CREDIT' && (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <div className={classes['image-wrapper']}>
                        <Image
                          alt="cardType"
                          src={
                            `/` +
                            `/images/${renderLogoCreditCard(
                              stateRetailOrderRetail?.data?.card_information
                                .type
                            )}`
                          }
                          width={40}
                          height={40}
                        />
                      </div>
                    </Box>
                    <Box>
                      <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={2}
                      >
                        <Typography>{`**** **** **** ${stateRetailOrderRetail?.data?.card_information.last4}`}</Typography>
                        <Typography>{`Expiry ${stateRetailOrderRetail?.data?.card_information.expiry_month}/${stateRetailOrderRetail?.data?.card_information.expiry_year}`}</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                )}
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ textTransform: 'capitalize' }}>
                  {stateRetailOrderRetail?.data?.payment_method.toLowerCase()}
                </Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {formatMoney(stateRetailOrderRetail?.data.total_billing)}
                </Typography>
              </Stack>
            </Stack>
          </BoxCustom>
          <TypographySectionTitle sx={{ marginBottom: '10px' }}>
            Customer Info
          </TypographySectionTitle>
          <BoxCustom
            sx={{
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '15px',
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Customer Name</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {stateRetailOrderRetail?.data.customer?.full_name
                    ? stateRetailOrderRetail?.data.customer?.full_name
                    : 'N/A'}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Phone number</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {stateRetailOrderRetail?.data.customer?.phone_number
                    ? stateRetailOrderRetail?.data.customer?.phone_number
                    : 'N/A'}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Email</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {stateRetailOrderRetail?.data.customer?.email
                    ? stateRetailOrderRetail?.data.customer?.email
                    : 'N/A'}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Business Name</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {stateRetailOrderRetail?.data.customer?.business_name
                    ? stateRetailOrderRetail?.data.customer?.business_name
                    : 'N/A'}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Street Address</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {stateRetailOrderRetail?.data.customer?.address
                    ? stateRetailOrderRetail?.data.customer?.address
                    : 'N/A'}
                </Typography>
              </Stack>
            </Stack>
          </BoxCustom>
          {/* hold in this phase 3/11 */}
          {/* {stateRetailOrderRetail?.data.client && (
            <>
              <TypographySectionTitle sx={{ marginBottom: '10px' }}>
                {t('clientDetails')}
              </TypographySectionTitle>
              {
                <>
                  {stateRetailOrderRetail?.data ? (
                    <BoxCustom
                      sx={{
                        padding: '15px',
                        borderRadius: '5px',
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Typography> {t('businessName')}</Typography>
                          <Typography>
                            {stateRetailOrderRetail.data.client.business_name
                              ? stateRetailOrderRetail.data.client.business_name
                              : 'N/A'}
                          </Typography>
                        </Stack>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Typography> {t('phoneNumber')}</Typography>
                          <Typography>
                            {formatPhoneNumber(
                              stateRetailOrderRetail.data.client.phone_number
                            )}
                          </Typography>
                        </Stack>
                  

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Typography> {t('address')}</Typography>
                          <Typography>
                            {stateRetailOrderRetail.data.client.address
                              ? stateRetailOrderRetail.data.client.address
                              : 'N/A'}
                          </Typography>
                        </Stack>
                      </Stack>
                    </BoxCustom>
                  ) : (
                    <Skeleton variant="rounded" width="100%" height={120} />
                  )}
                </>
              }
            </>
          )} */}
        </Grid>
      </Grid>

      <Dialog open={stateOpenDialog} onClose={() => setStateOpenDialog(false)}>
        <DialogTitleTws>
          <IconButton onClick={() => setStateOpenDialog(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('reOrder')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {stateCurrentReOrderType
              ? t('theCartIsNotEmptyDoYouWantToReplaceIt')
              : t('AreYouSureToReOrder')}
          </DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => setStateOpenDialog(false)}
              variant="outlined"
              size="large"
            >
              {t('no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleReOrderRetail}
              size="large"
            >
              {t('yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      <Dialog
        open={stateAllowToBuyOutOfStock}
        onClose={() => setStateAllowToBuyOutOfStock(false)}
      >
        <DialogTitleTws>
          <IconButton onClick={() => setStateAllowToBuyOutOfStock(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('allowToBuyOutOfStock')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {t('someProductsAreOutOfStockDoYouAllowToBuyOfStockProduct')}
          </DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => handleNotToBuyOutOfStock()}
              variant="outlined"
              size="large"
            >
              {t('no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={() => handleConfirmToBuyOutOfStock()}
              size="large"
            >
              {t('yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      <Drawer
        anchor="right"
        open={stateDrawerRefund}
        onClose={() => handleCloseDrawer()}
      >
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
          <Box sx={{ padding: '25px', minWidth: '500px', height: '100%' }}>
            <Typography sx={{ fontSize: '2.4rem', color: '#0A0D14' }}>
              {t('billingDetails')}
            </Typography>
            <Stack
              spacing={2}
              divider={
                <Divider
                  orientation="horizontal"
                  flexItem
                  sx={{ margin: '0px 12px' }}
                />
              }
              sx={{
                background: '#F8FAFB',
                padding: '15px',
                borderRadius: '5px',
                marginBottom: '15px',
              }}
            >
              {stateRetailOrderRetail?.data.items.map((item, index) => {
                return (
                  <Stack
                    key={index}
                    direction="row"
                    justifyContent="space-between"
                  >
                    <Typography
                      sx={{
                        width: '200px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOVerflow: 'ellipsis',
                      }}
                    >
                      {item.name}
                    </Typography>
                    <Typography>x{item.quantity}</Typography>
                    <Typography>{formatMoney(item.total)}</Typography>
                  </Stack>
                )
              })}
            </Stack>
            <Stack
              spacing={2}
              sx={{
                padding: '15px',
                background: '#F8FAFB',
                borderRadius: '5px',
                marginBottom: '15px',
              }}
            >
              <Stack
                spacing={2}
                divider={
                  <Divider
                    orientation="horizontal"
                    flexItem
                    sx={{ margin: '0px 12px' }}
                  />
                }
              >
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{t('subTotal')}</Typography>
                    <Typography>
                      {formatMoney(stateRetailOrderRetail?.data.total_value)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{t('create.discount')}</Typography>
                    <Typography>{formatMoney(0)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{t('create.tax')} (0%)</Typography>
                    <Typography>{formatMoney(0)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{t('tip')} (0%)</Typography>
                    <Typography>
                      {formatMoney(stateRetailOrderRetail?.data.total_tip)}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '1.8rem',
                      color: '#0A0D14',
                    }}
                  >
                    {t('Total')}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '1.8rem',
                      color: '#0A0D14',
                    }}
                  >
                    {formatMoney(stateRetailOrderRetail?.data.total_billing)}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Box>
              <Typography
                sx={{
                  fontWeight: 500,
                  color: '#49516F',
                  marginBottom: '10px',
                }}
              >
                {t('paymentMethod')}
              </Typography>
              <Stack
                spacing={2}
                sx={{
                  padding: '10px',
                  background: '#F8FAFB',
                  borderRadius: '5px',
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('create.cash')}</Typography>
                  <Typography>
                    {formatMoney(stateRetailOrderRetail?.data.cash)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('create.creditCard')}</Typography>
                  <Typography>
                    {formatMoney(stateRetailOrderRetail?.data.credit)}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Box>
          <Box sx={{ padding: '25px', minWidth: '500px', height: '100%' }}>
            <Typography
              sx={{
                fontSize: '2.4rem',
                color: '#0A0D14',
                marginBottom: '15px',
              }}
            >
              {t('selectProductToRefund')}
            </Typography>
            <Typography sx={{ marginBottom: '10px' }}>
              {t('products')}
            </Typography>
            <Box sx={{ marginBottom: '15px' }}>
              {stateRetailOrderRetail?.data.items.map((item, index) => {
                return (
                  <Stack
                    direction="row"
                    spacing={2}
                    key={index}
                    sx={{
                      padding: '15px',
                      border:
                        handleCheckIsProductIsIncludedInListSelectedProduct(
                          item.id
                        )
                          ? '1px solid #1DB46A'
                          : '1px solid #E1E6EF',
                      borderRadius: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <Checkbox
                      checked={handleCheckIsProductIsIncludedInListSelectedProduct(
                        item.id
                      )}
                      onChange={() => handleChangeListSelectedProduct(item)}
                    />
                    <Stack spacing={1} sx={{ width: '100%' }}>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          fontSize: '1.6rem',
                          color: '#223263',
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Stack direction="row" justifyContent="space-between">
                        <Stack direction="row" spacing={1}>
                          <Typography
                            sx={{ color: '#BABABA', fontWeight: 500 }}
                          >
                            {t('qty')}:
                          </Typography>
                          <Typography
                            sx={{ fontWeight: 500, color: '#595959' }}
                          >
                            {formatMoney(item.unit_price)} x{item.quantity}
                          </Typography>
                        </Stack>
                        <Typography sx={{ fontWeight: 500, color: '#E02D3C' }}>
                          {formatMoney(item.total)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                )
              })}
            </Box>

            <Typography sx={{ marginBottom: '10px' }}>
              {t('otherProduct')}
            </Typography>
            <Box>
              {stateRetailOrderRetail?.data.other_products.map(
                (item, index) => {
                  return (
                    <Stack
                      direction="row"
                      spacing={2}
                      key={index}
                      sx={{
                        padding: '15px',
                        border:
                          handleCheckIsOtherProductIsIncludedInListSelectedOtherProduct(
                            item.other_product_id
                          )
                            ? '1px solid #1DB46A'
                            : '1px solid #E1E6EF',
                        borderRadius: '10px',
                        marginBottom: '10px',
                      }}
                    >
                      <Checkbox
                        checked={handleCheckIsOtherProductIsIncludedInListSelectedOtherProduct(
                          item.other_product_id
                        )}
                        onChange={() =>
                          handleChangeListSelectedOtherProduct(item)
                        }
                      />
                      <Stack spacing={1} sx={{ width: '100%' }}>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: '1.6rem',
                            color: '#223263',
                          }}
                        >
                          {item.product_name}
                        </Typography>
                        <Stack direction="row" justifyContent="space-between">
                          <Stack direction="row" spacing={1}>
                            <Typography
                              sx={{ color: '#BABABA', fontWeight: 500 }}
                            >
                              {t('qty')}:
                            </Typography>
                            <Typography
                              sx={{ fontWeight: 500, color: '#595959' }}
                            >
                              {formatMoney(item.price)} x{item.quantity}
                            </Typography>
                          </Stack>
                          <Typography
                            sx={{ fontWeight: 500, color: '#E02D3C' }}
                          >
                            {formatMoney(item.total)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  )
                }
              )}
            </Box>
          </Box>
          <Box sx={{ padding: '25px', minWidth: '500px', height: '100%' }}>
            <Typography
              sx={{
                fontSize: '2.4rem',
                color: '#0A0D14',
                marginBottom: '15px',
              }}
            >
              {t('refundSummary')}
            </Typography>
            <Typography
              sx={{ fontWeight: 500, color: '#49516F', marginBottom: '10px' }}
            >
              {t('refundMethod')}
            </Typography>
            <Stack sx={{ marginBottom: '15px' }} direction="row" spacing={1}>
              <ButtonCustom
                size="large"
                variant="outlined"
                disabled={stateRetailOrderRetail?.data.cash === 0}
                fullWidth
                onClick={() => setStateRadioPaymentMethod(1)}
                sx={{
                  position: 'relative',
                  border: `1px solid ${
                    stateRadioPaymentMethod === 1 ? '#34DC75' : '#C3CAD9'
                  }`,
                  color: stateRadioPaymentMethod === 1 ? '#34DC75' : '#C3CAD9',
                }}
              >
                <Stack direction="column" spacing={0.5} alignItems="center">
                  <Money size={24} />
                  <Typography>{t('create.cash')}</Typography>
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
                disabled={stateRetailOrderRetail?.data.credit === 0}
                onClick={() => setStateRadioPaymentMethod(2)}
                sx={{
                  position: 'relative',
                  border: `1px solid ${
                    stateRadioPaymentMethod === 2 ? '#34DC75' : '#C3CAD9'
                  }`,
                  color: stateRadioPaymentMethod === 2 ? '#34DC75' : '#C3CAD9',
                }}
              >
                <Stack direction="column" spacing={0.5} alignItems="center">
                  <CreditCard size={24} />
                  <Typography>{t('create.creditCard')}</Typography>
                </Stack>

                {stateRadioPaymentMethod === 2 && (
                  <CheckCircle
                    style={{ position: 'absolute', top: 5, right: 5 }}
                    size={16}
                  />
                )}
              </ButtonCustom>
            </Stack>
            <form onSubmit={handleSubmit(onSubmitValue)}>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={control}
                  name="reason"
                  render={({ field }) => (
                    <>
                      <Typography sx={{ fontWeight: 500, color: '#49516F' }}>
                        {t('refundReason')}
                      </Typography>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          placeholder={t('enterRefundReason')}
                          {...field}
                          error={!!errors.reason}
                        >
                          {t('refundReason')}
                        </TextFieldCustom>
                        <FormHelperText error>
                          {errors.reason && errors.reason.message}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ marginBottom: '15px' }}
              >
                <Typography sx={{ fontWeight: 500, color: '#49516F' }}>
                  {t('refundTips')}
                </Typography>
                <Switch
                  disabled={stateRetailOrderRetail?.data.total_tip === 0}
                  checked={stateCheckedRefundTip}
                  onChange={handleChangeRefundTip}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Stack>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={control}
                  name="reason"
                  render={() => (
                    <>
                      <Typography
                        sx={{
                          fontWeight: 500,
                          color: '#49516F',
                          marginBottom: '10px',
                        }}
                      >
                        {t('refundAmount')}
                      </Typography>
                      <FormControl fullWidth>
                        <div className={classes['input-number']}>
                          <CurrencyNumberFormat
                            disabled={
                              stateSelectedListOtherProductToRefund.length ===
                                0 &&
                              stateSelectedListProductToRefund.length === 0 &&
                              !stateCheckedRefundTip
                            }
                            defaultPrice={
                              watch('total_amount')
                                ? watch('total_amount').toFixed(2).toString()
                                : null
                            }
                            propValue={(value) => {
                              setValue('total_amount', Number(value))
                              trigger('total_amount')
                            }}
                          />
                        </div>

                        <FormHelperText error>
                          {errors.total_amount && errors.total_amount.message}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Typography
                sx={{
                  fontWeight: 500,
                  color: '#49516F',
                  marginBottom: '10px',
                }}
              >
                {t('refundDetails')}
              </Typography>
              <Stack
                spacing={2}
                sx={{
                  padding: '10px',
                  background: '#F8FAFB',
                  marginBottom: '15px',
                }}
              >
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('create.cash')}</Typography>
                  <Typography>{formatMoney(stateRefundDetail.cash)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('credit')}</Typography>
                  <Typography>
                    {formatMoney(stateRefundDetail.credit)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack spacing={2}>
                <ButtonCustom
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={
                    stateSelectedListOtherProductToRefund.length === 0 &&
                    stateSelectedListProductToRefund.length === 0 &&
                    !stateCheckedRefundTip
                  }
                >
                  {t('proceedRefund')}
                </ButtonCustom>
                <ButtonCustom
                  onClick={() => handleCloseDrawer()}
                  variant="outlined"
                  size="large"
                >
                  {t('create.cancel')}
                </ButtonCustom>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Drawer>

      {/* print */}

      <Dialog
        open={stateReceiptSummary}
        onClose={() => {
          setStateReceiptSummary(false)
        }}
      >
        <PrintOrder
          data={{
            code: stateRetailOrderRetail?.data?.code,
            order_date: stateRetailOrderRetail?.data?.order_date,
            items: stateRetailOrderRetail?.data?.items
              ? stateRetailOrderRetail?.data?.items
              : [],
            other_products: stateRetailOrderRetail?.data?.other_products
              ? stateRetailOrderRetail?.data?.other_products
              : [],
            total_billing: stateRetailOrderRetail?.data?.total_billing,
            total_tip: stateRetailOrderRetail?.data?.total_tip,
            total_value: stateRetailOrderRetail?.data?.total_value,
          }}
          closePopup={() => setStateReceiptSummary(false)}
        />
      </Dialog>
      <Drawer
        open={stateOpenSendInvoiceDrawer}
        onClose={() => setStateOpenSendInvoiceDrawer(false)}
        anchor="right"
      >
        <Box
          sx={{
            background: 'white',
            width: `400px`,
            height: '100%',
            padding: '25px',
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginBottom: '10px' }}
          >
            <IconButton onClick={() => setStateOpenSendInvoiceDrawer(false)}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>
              {t('sendInvoice')}
            </Typography>
          </Stack>
          <Typography sx={{ marginBottom: '15px' }}>
            {t('theInvoiceWillBeSentToTheRecipientBelow')}.
          </Typography>
          <Box
            sx={{
              background: '#F8FAFB',
              width: '100%',
              minHeight: '150px',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '15px',
            }}
          >
            <Typography sx={{ marginBottom: '10px' }}>
              {t('RECIPIENT')}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ marginBottom: '10px' }}
            >
              <Avatar
                sx={{ width: 56, height: 56 }}
                alt={stateRetailOrderRetail?.data?.client?.full_name}
                src={''}
              />
              <Typography>
                {stateRetailOrderRetail?.data?.client?.full_name}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <Typography>{t('email')}:</Typography>
              <Typography>
                {stateRetailOrderRetail?.data?.client?.email}
              </Typography>
            </Stack>
            <a
              rel="noopener noreferrer"
              target="_blank"
              style={{ color: '#2F6FED', textDecoration: 'underline' }}
              href={stateInvoiceUrl}
            >
              {t('previewTheInvoicePdf')}
            </a>
          </Box>
          <Stack direction="row" spacing={1}>
            <ButtonCancel
              size="large"
              onClick={() => setStateOpenSendInvoiceDrawer(false)}
            >
              {t('create.cancel')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              size="large"
              onClick={handleSendInvoiceViaEmail}
            >
              {t('send')}
            </ButtonCustom>
          </Stack>
        </Box>
      </Drawer>
    </>
  )
}

export default RetailOrderDetail
