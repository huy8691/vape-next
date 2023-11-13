import {
  Box,
  Breadcrumbs,
  ButtonGroup,
  Dialog,
  DialogActions,
  Divider,
  Drawer,
  FormControl,
  FormHelperText,
  Grow,
  IconButton,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import * as Yup from 'yup'

import { yupResolver } from '@hookform/resolvers/yup'
import Grid from '@mui/material/Unstable_Grid2'
import { useTheme } from '@mui/material/styles'
import {
  Archive,
  ArrowCounterClockwise,
  ArrowRight,
  CaretRight,
  CircleWavyCheck,
  ClockClockwise,
  Truck,
  X,
} from '@phosphor-icons/react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app.page'
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import NestedLayout from 'src/layout/nestedLayout'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  KEY_MODULE,
  PERMISSION_RULE,
  checkPermission,
  handlerGetErrMessage,
  truncateToTwoDecimalPlaces,
} from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import { apiReOrder, cancelOrder, getOrderDetail } from './apiOrderDetail'
import {
  OrderDetailType,
  OrderStatusType,
  ReasonCancelDataType,
} from './modelOrderDetail'
import classes from './styles.module.scss'
import { schema } from './validations'

// other

//styled
import { styled } from '@mui/material/styles'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  ButtonCancel,
  ButtonCustom,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  TableCellTws,
  TableContainerTws,
  TextFieldCustom,
  TypographyH2,
  TypographySectionTitle,
  TypographyTitlePage,
} from 'src/components'
import { cartActions } from 'src/store/cart/cartSlice'
import WithPermission from 'src/utils/permission.utils'
import { getListCard } from './part/CreditCards/cardCheckoutAPI'
import { CardDetailInListCardType } from './part/CreditCards/cardCheckoutModel'
import CreditCards from './part/CreditCards/creditCards'
import CurrencyNumberFormat from './part/CurrencyNumberFormat'
import { BoxCustom, TypographyCustom, TypographyTotalCustom } from './styled'
const DividerCustom = styled('div')(() => ({
  backgroundColor: '#49516F',
  height: '15px',
  width: '1px',
  marginRight: '10px',
}))
const OrderDetail: NextPageWithLayout = () => {
  const { t } = useTranslation('order')
  const { type } = useAppSelector((state) => state.paymentType)

  const theme = useTheme()
  const [stateOrderDetail, setStateOrderDetail] = useState<OrderDetailType>()
  const [statePaymentDrawer, setStatePaymentDrawer] = useState(false)
  const [selectCard, setSelectCard] = useState<CardDetailInListCardType>()
  const [openCreditCards, setOpenCreditCards] = useState(false)
  const router = useRouter()
  const arrayPermission = useAppSelector((state) => state.permission.data)

  const dispatch = useAppDispatch()
  const [pushMessgage] = useEnqueueSnackbar()
  const statusCurrent = useRef<number>(0)
  const optionStatus = useMemo(
    () => [
      {
        id: 0,
        text: 'WAITING_FOR_APPROVED',
        icon: <ClockClockwise color="#49516F" size={20} />,
        color: '#49516F',
        textDisplay: t('confirmation'),
      },
      {
        id: 1,
        text: 'APPROVED',
        icon: <CircleWavyCheck color="#1DB46A" size={20} />,
        color: '#1DB46A',
        textDisplay: t('confirmed'),
      },
      {
        id: 2,
        text: 'READY_FOR_SHIPPING',
        icon: <CircleWavyCheck color="#1DB46A" size={20} />,
        color: '#1DB46A',
        textDisplay: t('readyForShipping'),
      },
      {
        id: 3,
        text: 'DELIVERING',
        icon: <Truck color="#2F6FED" size={20} />,
        color: '#2F6FED',

        textDisplay: t('delivering'),
      },
      {
        id: 4,
        text: 'DELIVERED',
        icon: <ClockClockwise color="#1DB46A" size={20} />,
        color: '#1DB46A',

        textDisplay: t('delivered'),
      },
      {
        id: 5,
        text: 'CANCELLED',
        icon: (
          <span
            className="icon-cancelstatus-converted"
            style={{ color: '#E02D3C' }}
          ></span>
        ),
        color: '#E02D3C',
        textDisplay: t('cancelled'),
      },
      // {
      //   id: 6,
      //   text: 'WAITING_FOR_APPROVED',
      //   icon: <ClockClockwise color="#49516F" size={20} />,
      //   color: '#49516F',
      //   textDisplay: 'Confirmation',
      // },
    ],
    []
  )

  const [open, setOpen] = React.useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  // const open = Boolean(anchorEl)

  const [stateTempStatus, setStateTempStatus] = useState<OrderStatusType[]>([])
  const anchorRef = React.useRef<HTMLDivElement>(null)

  //Popper
  const handleMenuItemClick = () => {
    setOpen(false)
    // handleDialogDelete()
    handleDialog()
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  //dialog
  const handleDialog = () => {
    setOpenDialog(!openDialog)
  }

  //Cancel

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }
    setOpen(false)
  }

  const {
    handleSubmit,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<ReasonCancelDataType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitAmount,
    control: controlAmount,
    reset: resetAmount,
    clearErrors: clearErrorsAmount,
    setValue: setValueAmount,
    trigger: triggerAmount,
    getValues: getValuesAmount,
    formState: { errors: errorsAmount },
    watch: watchAmount,
  } = useForm<{ amount: number | null }>({
    resolver: yupResolver(
      Yup.object().shape({
        amount: Yup.number()
          .typeError('Amount is required')
          .required('Amount is required')
          .min(
            1 / 100,
            `amount must be between $0.01 and ${
              stateOrderDetail?.payment_term.due_amount
                ? stateOrderDetail.payment_term.due_amount
                : 0
            }`
          )
          .max(
            stateOrderDetail?.payment_term.due_amount
              ? stateOrderDetail?.payment_term.due_amount
              : 0
          ),
      })
    ),
    mode: 'all',
  })
  const handleCloseCancelOrderDialog = () => {
    clearErrors()
    setOpenDialog(false)
  }
  const onSubmit = (values: ReasonCancelDataType) => {
    console.log('values', values, router.query.id)
    cancelOrder(router?.query?.id, values)
      .then((res) => {
        console.log('res', res)
        dispatch(loadingActions.doLoadingSuccess())
        detailOrder()
        pushMessgage(t('cancelOrderSuccess'), 'success')
        handleCloseCancelOrderDialog()
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        console.log('check', status, data)
        pushMessgage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const detailOrder = useCallback(() => {
    if (router.query.id) {
      dispatch(loadingActions.doLoading())
      getOrderDetail(router.query.id)
        .then((res) => {
          const { data } = res.data
          setStateOrderDetail(data)
          const temporaryStatus: OrderStatusType[] = []
          // optionStatus.every((item, index) => {
          //   if (data?.status === 'DELIVERED') {
          //     return true
          //   }
          //   if (data?.status === item.text) {
          //     return true
          //   }
          //   if (
          //     optionStatus.findIndex((item) => item.text === data?.status) ===
          //     index - 1
          //   ) {
          //     temporaryStatus.push(item)
          //     return true
          //   }
          //   if (index === optionStatus.length - 1) {
          //     temporaryStatus.push(item)
          //     return true
          //   }
          //   return true
          // })
          for (const i in optionStatus) {
            if (
              data?.status == 'WAITING_FOR_APPROVED' &&
              optionStatus[i].text == 'CANCELLED'
            ) {
              temporaryStatus.push(optionStatus[i])
            }
          }
          setStateTempStatus(temporaryStatus)
          statusCurrent.current = optionStatus.findIndex(
            (item) => item.text === data?.status
          )
          console.log(temporaryStatus)
          console.log('statusCurrent', statusCurrent.current)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response.response
          pushMessgage(handlerGetErrMessage(status, data), 'error')
          if (status === 404) {
            router.push('/404')
          }
        })
    }
  }, [router.query])
  const handleGetDetailOrder = () => {
    if (router.query.id) {
      dispatch(loadingActions.doLoading())
      getOrderDetail(router.query.id)
        .then((res) => {
          const { data } = res.data
          setStateOrderDetail(data)
          const temporaryStatus: OrderStatusType[] = []

          for (const i in optionStatus) {
            if (
              data?.status == 'WAITING FOR APPROVED' &&
              optionStatus[i].text == 'CANCELLED'
            ) {
              temporaryStatus.push(optionStatus[i])
            }
          }
          setStateTempStatus(temporaryStatus)
          statusCurrent.current = optionStatus.findIndex(
            (item) => item.text === data?.status
          )
          console.log('statusCurrent', statusCurrent.current)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response.response
          pushMessgage(handlerGetErrMessage(status, data), 'error')
          if (status === 404) {
            router.push('/404')
          }
        })
    }
  }
  useEffect(() => {
    detailOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, dispatch, optionStatus])
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
  const handleReorder = () => {
    if (router.query.id) {
      apiReOrder(Number(router.query.id))
        .then((res) => {
          const { data } = res

          dispatch(cartActions.doCart())
          const listCartId: Array<number> = Object.values(data.data)
          localStorage.setItem('ListCartItem', JSON.stringify(listCartId))
          router.push('/retailer/market-place/cart')
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessgage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }
  const checkIsShippingStatus = () => {
    if (!stateOrderDetail) return false
    if (
      stateOrderDetail.status === 'READY_FOR_SHIPPING' ||
      stateOrderDetail.status === 'DELIVERING' ||
      stateOrderDetail.status === 'DELIVERED'
    )
      return true
  }
  const currentDate = new Date()
  const handleCloseDrawer = () => {
    setStatePaymentDrawer(false)
    resetAmount()
    clearErrorsAmount()
  }
  const onSubmitAmount = (value: { amount: number | null }) => {
    console.log('value', value)
    if (!getValuesAmount('amount')) return
    if (!selectCard?.id) {
      pushMessgage('Please select a card for payment', 'error')
      return
    }

    dispatch(loadingActions.doLoading())
    if (type === 'REVITPAY') {
      fetch(`https://api.sandbox.revitgate.com/api/v2/transactions/charge`, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization:
            'basic ' + window.btoa('03jjMnOQiURCVMAIL4yNFTsDRkZiU2jp:223366'),
        },
        body: JSON.stringify({
          source: 'pm-' + selectCard?.id,
          amount: Number(getValuesAmount('amount')),

          // Number(Number(getValuesAmount('amount')).toFixed(2)),
          // amount_details: {
          //   tip: 0,
          // }
          custom_fields: {
            custom1: stateOrderDetail?.code,
            custom2: 'WHOLESALE',
            ...(Number(stateOrderDetail?.payment_term.due_amount) >
              Number(getValuesAmount('amount')) && {
              custom3: `${stateOrderDetail?.code}-${Number(
                getValuesAmount('amount')
              ).toFixed(2)}`,
            }),
          },
        }),
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          }
          throw new Error('Something went wrong')
        })
        .then(() => {
          pushMessgage('Pay successfully', 'success')
          setTimeout(() => {
            handleGetDetailOrder()
            handleCloseDrawer()
          }, 2000)

          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(() => {
          // const { status, data } = response
          pushMessgage('Something went wrong', 'error')
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
            online: stateOrderDetail?.code,
            ...(Number(stateOrderDetail?.payment_term.due_amount) >
              Number(getValuesAmount('amount')) && {
              partially_paid: `${stateOrderDetail?.code}-${Number(
                getValuesAmount('amount')
              ).toFixed(2)}`,
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
          pushMessgage('Pay successfully', 'success')
          setTimeout(() => {
            handleGetDetailOrder()
            handleCloseDrawer()
          }, 2000)

          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(() => {
          pushMessgage('Something went wrong', 'error')
          dispatch(loadingActions.doLoadingFailure())
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
        pushMessgage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }, [type, dispatch])
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <Stack direction="row" alignItems="center" spacing={4} mb={'5px'}>
        {stateOrderDetail ? (
          <TypographyTitlePage variant="h1">{t('title')}</TypographyTitlePage>
        ) : (
          <Box mb={1}>
            <Skeleton
              animation="wave"
              variant="text"
              sx={{ fontSize: '3.2rem' }}
              width={400}
            />
          </Box>
        )}
        {stateOrderDetail ? (
          <>
            <ButtonGroup
              variant="outlined"
              aria-label="outlined button group"
              ref={anchorRef}
            >
              <ButtonCustom
                sx={{
                  background: `${
                    optionStatus[statusCurrent.current]
                      ? optionStatus[statusCurrent.current].color
                      : theme.palette.primary.main
                  }`,
                  color: 'white',
                  textTransform: 'capitalize',
                  borderRadius: '32px',
                  padding: '10px 15px 10px 14px',
                  cursor: 'default',
                  '&:hover': {
                    backgroundColor: `${
                      optionStatus[statusCurrent.current]
                        ? optionStatus[statusCurrent.current].color
                        : theme.palette.primary.main
                    }`,
                    boxShadow: 'none',
                    cursor: 'pointer',
                  },
                }}
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
                    {optionStatus[statusCurrent.current] ? (
                      optionStatus[statusCurrent.current].icon
                    ) : (
                      <Archive color={theme.palette.primary.main} size={20} />
                    )}
                  </Box>
                }
                variant="contained"
                onClick={() => {
                  if (
                    checkPermission(
                      arrayPermission,
                      KEY_MODULE.Order,
                      PERMISSION_RULE.UpdateOrderStatus
                    )
                  ) {
                    handleToggle()
                  } else {
                    return
                  }
                }}
              >
                <Typography sx={{ fontWeight: '600' }}>
                  {optionStatus[statusCurrent.current]
                    ? optionStatus[statusCurrent.current].textDisplay
                    : 'N/A'}
                </Typography>
              </ButtonCustom>
            </ButtonGroup>
            <Popper
              sx={{
                zIndex: 1,
              }}
              open={open}
              anchorEl={anchorRef.current}
              transition
            >
              {({
                TransitionProps,
                placement,
              }): JSX.Element | JSX.Element[] => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper sx={{ background: 'transparent', boxShadow: 'none' }}>
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        id="split-button-menu"
                        autoFocusItem
                        className={classes['list-status']}
                      >
                        {stateTempStatus.map((item) => (
                          <MenuItem
                            key={item.text}
                            onClick={() => handleMenuItemClick()}
                          >
                            <ButtonCustom
                              sx={{
                                background: `${item.color}`,
                                color: 'white',
                                textTransform: 'capitalize',
                                borderRadius: '32px',
                                padding: '10px 15px 10px 14px',
                              }}
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
                                  {item.icon}
                                </Box>
                              }
                              variant="contained"
                              onClick={handleToggle}
                            >
                              <Typography sx={{ fontWeight: '600' }}>
                                {item.textDisplay === 'Cancelled'
                                  ? 'Cancel'
                                  : item.textDisplay}
                              </Typography>
                            </ButtonCustom>
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        ) : (
          <Skeleton variant="rounded" width={300} height={60} />
        )}
        {/* <ButtonCustom variant="contained" size="large" onClick={handleReorder}>
      </ButtonCustom> */}
        {WithPermission(
          <ButtonCustom
            sx={{
              background: theme.palette.primary.main,
              color: 'white',
              textTransform: 'capitalize',
              borderRadius: '32px',
              padding: '10px 15px 10px 14px',
            }}
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
            onClick={handleReorder}
          >
            <Typography sx={{ fontWeight: '600' }}>{t('reOrder')}</Typography>
          </ButtonCustom>,
          KEY_MODULE.Order,
          PERMISSION_RULE.ReOrder
        )}
      </Stack>
      {stateOrderDetail ? (
        <Breadcrumbs
          separator=">"
          aria-label="breadcrumb"
          sx={{ marginBottom: '15px' }}
        >
          <Link href="/retailer/market-place/purchase-orders/list">
            <a>{t('purchaseOrder')}</a>
          </Link>
          <Typography>
            {t('title')} #{stateOrderDetail?.code}
          </Typography>
        </Breadcrumbs>
      ) : (
        <Skeleton
          animation="wave"
          variant="text"
          sx={{ fontSize: '1.4rem' }}
          width={300}
        />
      )}
      {/* Grid have padding around 8px so use marginBottom 7px to get total 15px */}
      <Grid container spacing={2} sx={{ marginBottom: '17px' }}>
        <Grid xs={8}>
          <TypographySectionTitle sx={{ marginBottom: '10px' }}>
            {t('title')}
          </TypographySectionTitle>
          {stateOrderDetail ? (
            <BoxCustom
              sx={{
                padding: '15px',
                borderRadius: '5px',

                marginBottom: '15px',
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('orderNo')}</Typography>
                  <Typography>#{stateOrderDetail?.code}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('orderStatus')}</Typography>
                  <Box>
                    <Typography sx={{ textTransform: 'capitalize' }}>
                      {
                        optionStatus.find(
                          (item) => item.text === stateOrderDetail?.status
                        )?.textDisplay
                      }
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('orderDate')}</Typography>
                  <Typography>
                    {moment(stateOrderDetail?.order_date).format(
                      'MM/DD/YYYY - hh:mm A'
                    )}
                  </Typography>
                </Stack>
              </Stack>
            </BoxCustom>
          ) : (
            <Skeleton variant="rounded" width="100%" height={140} />
          )}
          <Box sx={{ marginBottom: '15px' }}>
            <TypographySectionTitle>{t('products')}</TypographySectionTitle>

            {stateOrderDetail ? (
              <TableContainerTws sx={{ marginTop: 0, border: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCellTws>{t('product')}</TableCellTws>
                      <TableCellTws align="right">{t('quantity')}</TableCellTws>
                      {/* <TableCellTws>{t('price')}</TableCellTws> */}
                      <TableCellTws align="right">{t('subtotal')}</TableCellTws>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stateOrderDetail?.items.map((items, index: number) => {
                      return (
                        <TableRow
                          sx={{
                            borderRight: '1px solid #E0E0E0',
                            borderLeft: '1px solid #E0E0E0',
                          }}
                          key={`item-${index}`}
                        >
                          <TableCellTws>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <div className={classes['image-wrapper']}>
                                {checkPermission(
                                  arrayPermission,
                                  KEY_MODULE.Product,
                                  PERMISSION_RULE.ViewDetails
                                ) ? (
                                  <Link
                                    href={
                                      items.attribute_options.length > 0
                                        ? `/retailer/market-place/product-detail/${items.product.id}?variant=${items.id}`
                                        : `/retailer/market-place/product-detail/${items.product.id}`
                                    }
                                  >
                                    <a>
                                      <Image
                                        alt="product-image"
                                        src={
                                          items.thumbnail
                                            ? items.thumbnail
                                            : '/' +
                                              '/images/defaultProductImage.png'
                                        }
                                        width={60}
                                        height={60}
                                      />
                                    </a>
                                  </Link>
                                ) : (
                                  <Image
                                    alt="product-image"
                                    src={
                                      items.thumbnail
                                        ? items.thumbnail
                                        : '/' +
                                          '/images/defaultProductImage.png'
                                    }
                                    width={60}
                                    height={60}
                                  />
                                )}
                              </div>
                              {checkPermission(
                                arrayPermission,
                                KEY_MODULE.Product,
                                PERMISSION_RULE.ViewDetails
                              ) ? (
                                <Link
                                  href={
                                    items.attribute_options.length > 0
                                      ? `/retailer/market-place/product-detail/${items.product.id}?variant=${items.id}`
                                      : `/retailer/market-place/product-detail/${items.product.id}`
                                  }
                                >
                                  <a>
                                    <Stack
                                      direction="row"
                                      spacing={2}
                                      alignItems="center"
                                      divider={
                                        <Divider
                                          orientation="vertical"
                                          flexItem
                                        />
                                      }
                                    >
                                      <TypographyCustom
                                        sx={{
                                          fontSize: '14px',
                                          fontWeight: '300',
                                        }}
                                      >
                                        #{items.code}
                                      </TypographyCustom>
                                      <Stack>
                                        <TypographyCustom>
                                          {items.name}
                                        </TypographyCustom>
                                        {items.attribute_options.length > 0 && (
                                          <Stack direction="row" spacing={2}>
                                            {items.attribute_options.map(
                                              (obj, pos) => {
                                                return (
                                                  <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    key={pos}
                                                  >
                                                    <Typography
                                                      sx={{
                                                        fontSize: '1.2rem',
                                                        fontWeight: 700,
                                                      }}
                                                    >
                                                      {obj.attribute}
                                                    </Typography>
                                                    <Typography
                                                      sx={{
                                                        fontSize: '1.2rem',
                                                      }}
                                                    >
                                                      {obj.option}
                                                    </Typography>
                                                  </Stack>
                                                )
                                              }
                                            )}
                                          </Stack>
                                        )}
                                      </Stack>
                                    </Stack>
                                  </a>
                                </Link>
                              ) : (
                                <Stack padding={2}>
                                  <TypographyCustom>
                                    {items.name}
                                  </TypographyCustom>
                                  <TypographyCustom
                                    sx={{ fontSize: '14px', fontWeight: '300' }}
                                  >
                                    #{items.code}
                                  </TypographyCustom>
                                </Stack>
                              )}
                            </Stack>
                          </TableCellTws>
                          <TableCellTws
                            align="right"
                            sx={{ textTransform: 'lowercase' }}
                          >
                            {items.quantity} {items.unit_type}
                          </TableCellTws>
                          {/* <TableCellTws>
                      {!isEmpty(items.price_discount) ? (
                        <>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="baseline"
                          >
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                textTransform: 'lowercase',
                              }}
                            >
                              {formatMoney(items.price_discount)}
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 300,
                                fontSize: '1rem',
                                textDecoration: 'line-through',
                              }}
                            >
                              {formatMoney(items.unit_price)}
                            </Typography>
                            <span
                              style={{ fontWeight: '400', fontSize: '12px' }}
                            >
                              {''} / {items.unit_type.toLowerCase()}
                            </span>
                          </Stack>
                        </>
                      ) : (
                        <>
                          <Stack
                            direction="row"
                            spacing={0.5}
                            alignItems="baseline"
                          >
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                textTransform: 'lowercase',
                              }}
                            >
                              {formatMoney(items.unit_price)}
                            </Typography>
                            <span
                              style={{ fontWeight: '400', fontSize: '12px' }}
                            >
                              {''} / {items.unit_type.toLowerCase()}
                            </span>
                          </Stack>
                        </>
                      )}
                    </TableCellTws> */}
                          <TableCellTws align="right">
                            <TypographyTotalCustom
                              sx={{ fontWeight: 'bold', fontSize: '16px' }}
                            >
                              {formatMoney(items.total)}
                            </TypographyTotalCustom>
                          </TableCellTws>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainerTws>
            ) : (
              <Skeleton variant="rounded" width="100%" height={400} />
            )}
          </Box>

          {stateOrderDetail &&
            stateOrderDetail.shipping_information &&
            Object.keys(stateOrderDetail.shipping_information).length > 0 && (
              <Box sx={{ marginBottom: '15px' }}>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ marginBottom: '10px' }}
                >
                  <TypographySectionTitle>Delivery</TypographySectionTitle>
                  {checkIsShippingStatus() && (
                    <Box
                      sx={{
                        padding: '5px 15px',
                        borderRadius: '25px',
                        background: '#D2D4DB',
                      }}
                    >
                      <Typography sx={{ textTransform: 'capitalize' }}>
                        {stateOrderDetail.status
                          .replaceAll('_', ' ')
                          .toLowerCase()}
                      </Typography>
                    </Box>
                  )}
                </Stack>

                <BoxCustom
                  sx={{
                    padding: '15px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                  }}
                >
                  <Typography sx={{ fontWeight: 600, marginBottom: '10px' }}>
                    Shipping Services
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ marginBottom: '15px' }}
                    divider={<Divider orientation="vertical" flexItem />}
                  >
                    <Image
                      alt={'image'}
                      objectFit="contain"
                      src={
                        stateOrderDetail?.shipping_information?.service?.logo
                      }
                      width={60}
                      height={60}
                    />
                    <Stack spacing={1}>
                      <Stack
                        direction="row"
                        spacing={1}
                        divider={<Divider orientation="vertical" flexItem />}
                      >
                        <Typography>
                          {stateOrderDetail.shipping_information.service.code}
                        </Typography>
                        <Typography>
                          {stateOrderDetail.shipping_information.service.name}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5}>
                        <Stack direction="row" spacing={0.5}>
                          <Typography>Get it by</Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            {moment(
                              stateOrderDetail.shipping_information.ship_date
                            ).format('MMMM Do, YYYY - hh:mm A')}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5}>
                          <Typography>Delivery Fee</Typography>
                          <Typography sx={{ fontWeight: 600 }}>
                            {formatMoney(
                              stateOrderDetail.shipping_information.delivery_fee
                            )}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Typography sx={{ fontWeight: 600 }}>
                    Shipping Address
                  </Typography>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Receiver</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {stateOrderDetail?.shipping_address.receiver_name}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Address</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {stateOrderDetail?.shipping_address.address}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>State</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {/* {stateOrderDetail?.shipping_address.} */}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>City</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {
                          stateOrderDetail.shipping_information.shipping_address
                            .city
                        }
                        {/* {stateOrderDetail?.shipping_address.} */}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Postal code</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {
                          stateOrderDetail.shipping_information.shipping_address
                            .postal_zipcode
                        }
                        {/* {stateOrderDetail?.shipping_address.} */}
                      </Typography>
                    </Stack>
                  </Stack>
                </BoxCustom>
              </Box>
            )}
        </Grid>
        <Grid xs={4} alignItems="flex-end">
          {/* <TypographySectionTitle sx={{ marginBottom: '10px' }}>
            {t('paymentDetail')}
          </TypographySectionTitle>
          {stateOrderDetail ? (
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
                  <TypographyCustom sx={{ fontSize: '14px' }}>
                    {t('subtotal')}
                  </TypographyCustom>
                  <TypographyCustom sx={{ fontSize: '14px' }}>
                    {formatMoney(stateOrderDetail?.sub_total)}
                  </TypographyCustom>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom sx={{ fontSize: '14px' }}>
                    {t('totalShipping')}
                  </TypographyCustom>
                  {stateOrderDetail?.delivery_fee === 0 ? (
                    <TypographyCustom sx={{ fontSize: '14px' }}>
                      {t('free')}
                    </TypographyCustom>
                  ) : (
                    <TypographyCustom sx={{ fontSize: '14px' }}>
                      {formatMoney(stateOrderDetail?.delivery_fee)}
                    </TypographyCustom>
                  )}
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom sx={{ fontSize: '14px' }}>
                    {t('paymentStatus')}
                  </TypographyCustom>
                  <TypographyCustom
                    sx={{ fontSize: '14px', textTransform: 'capitalize' }}
                  >
                    {stateOrderDetail.payment_status
                      .replaceAll('_', ' ')
                      .toLowerCase()}
                  </TypographyCustom>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyTotalCustom>{t('total')}</TypographyTotalCustom>
                  <TypographyTotalCustom>
                    {formatMoney(stateOrderDetail?.total_billing)}
                  </TypographyTotalCustom>
                </Stack>
              </Stack>
            </BoxCustom>
          ) : (
            <Skeleton variant="rounded" width="100%" height={120} />
          )} */}
          <TypographySectionTitle sx={{ marginBottom: '10px' }}>
            Status
          </TypographySectionTitle>
          <Stack direction="row" spacing={1} mb={2}>
            <Box
              sx={{
                padding: '5px 15px',
                background: '#D2D4DB',
                borderRadius: '25px',
              }}
            >
              <Typography sx={{ textTransform: 'capitalize' }}>
                {stateOrderDetail?.status === 'WAITING_FOR_APPROVED'
                  ? 'Confirmation'
                  : stateOrderDetail?.status === 'APPROVED'
                  ? 'Confirmed'
                  : stateOrderDetail?.status.replaceAll('_', ' ').toLowerCase()}
              </Typography>
            </Box>
            {checkIsShippingStatus() && (
              <Box
                sx={{
                  padding: '5px 15px',
                  background: '#CBDCFB',
                  borderRadius: '25px',
                }}
              >
                <Typography
                  sx={{ textTransform: 'capitalize', color: '#2E6FED' }}
                >
                  {stateOrderDetail?.status.replaceAll('_', ' ').toLowerCase()}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                padding: '5px 15px',
                background: '#C5ECDA',
                borderRadius: '25px',
              }}
            >
              <Typography
                sx={{ textTransform: 'capitalize', color: '#1DB46A' }}
              >
                {stateOrderDetail?.payment_status
                  .replaceAll('_', ' ')
                  .toLowerCase()}
              </Typography>
            </Box>
          </Stack>
          <TypographySectionTitle sx={{ marginBottom: '10px' }}>
            Billing
          </TypographySectionTitle>
          <BoxCustom
            sx={{ padding: '15px', borderRadius: '5px', marginBottom: '15px' }}
          >
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Subtotal</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {formatMoney(Number(stateOrderDetail?.sub_total))}
                </Typography>
              </Stack>
              {/* <Stack direction="row" justifyContent="space-between">
                <Typography>Loyalty Discount</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {formatMoney(
                    Number(stateOrderDetail?.loyalty_discount_price)
                  )}
                </Typography>
              </Stack> */}
              <Stack direction="row" justifyContent="space-between">
                <Typography>Loyalty Discount</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {formatMoney(
                    Number(stateOrderDetail?.loyalty_discount_price)
                  )}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Delivery fee</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {formatMoney(
                    Number(
                      stateOrderDetail?.shipping_information.delivery_fee
                        ? stateOrderDetail?.shipping_information.delivery_fee
                        : 0
                    )
                  )}
                </Typography>
              </Stack>
              <Stack
                sx={{ paddingTop: '5px', borderTop: '1px solid #D1D1D1' }}
                direction="row"
                justifyContent="space-between"
              >
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 700 }}>
                  Total
                </Typography>
                <Typography sx={{ fontSize: '1.6rem', fontWeight: 500 }}>
                  {formatMoney(Number(stateOrderDetail?.total_billing))}
                </Typography>
              </Stack>
              {stateOrderDetail?.payment_term &&
                Object.keys(stateOrderDetail.payment_term).length > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>Paid Amount</Typography>
                    <Typography>
                      {formatMoney(
                        truncateToTwoDecimalPlaces(
                          stateOrderDetail?.total_billing -
                            stateOrderDetail?.payment_term.due_amount
                        )
                      )}
                    </Typography>
                  </Stack>
                )}
            </Stack>
          </BoxCustom>
          {stateOrderDetail?.payment_term &&
            Object.keys(stateOrderDetail.payment_term).length > 0 && (
              <>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ marginBottom: '10px' }}
                >
                  <TypographySectionTitle sx={{ marginBottom: '10px' }}>
                    Payment Terms
                  </TypographySectionTitle>
                  <Box
                    sx={{
                      padding: '5px 15px',
                      background: '#C5ECDA',
                      borderRadius: '25px',
                    }}
                  >
                    <Typography
                      sx={{ textTransform: 'capitalize', color: '#1DB46A' }}
                    >
                      {stateOrderDetail?.payment_status
                        .replaceAll('_', ' ')
                        .toLowerCase()}
                    </Typography>
                  </Box>
                  {(stateOrderDetail.payment_status === 'PARTIALLY_PAID' ||
                    stateOrderDetail.payment_status === 'WAITING_FOR_PAYMENT' ||
                    stateOrderDetail.payment_status === 'DELAY_PAYMENT') && (
                    <ButtonCustom
                      onClick={() => setStatePaymentDrawer(true)}
                      variant="contained"
                    >
                      Pay
                    </ButtonCustom>
                  )}
                </Stack>
                <Box
                  sx={{
                    padding: '10px',
                    border: '1px solid #E1E6EF',
                    marginBottom: '15px',
                  }}
                >
                  <Stack spacing={1}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Payment terms</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {stateOrderDetail?.payment_term.payment_term}{' '}
                        {stateOrderDetail?.payment_term?.payment_term > 1
                          ? 'days'
                          : 'day'}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Due amount</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {formatMoney(stateOrderDetail?.payment_term.due_amount)}{' '}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography>Due date</Typography>
                      <Typography sx={{ fontWeight: 500 }}>
                        {moment(stateOrderDetail?.payment_term.due_date).format(
                          'MMMM Do, YYYY - hh:mm A'
                        )}{' '}
                      </Typography>
                    </Stack>
                    {(new Date(stateOrderDetail.payment_term.due_date).setHours(
                      0,
                      0,
                      0,
                      0
                    ) -
                      currentDate.setHours(0, 0, 0, 0)) /
                      (24 * 60 * 60 * 1000) >
                    0 ? (
                      <>
                        <Typography
                          sx={{ fontStyle: 'italic', color: '#1DB46A' }}
                        >
                          The order will be due in{' '}
                          <span>
                            {/* {currentDate.getTime() -
                          new Date(
                            stateOrderDetail.payment_term.due_date
                          ).getTime() >
                        0
                          ? 
                          : 0} */}
                            {(new Date(
                              stateOrderDetail.payment_term.due_date
                            ).setHours(0, 0, 0, 0) -
                              currentDate.setHours(0, 0, 0, 0)) /
                              (24 * 60 * 60 * 1000)}
                          </span>{' '}
                          day
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography
                          sx={{ fontStyle: 'italic', color: '#1DB46A' }}
                        >
                          The order has been due for{' '}
                          <span>
                            {/* {currentDate.getTime() -
                          new Date(
                            stateOrderDetail.payment_term.due_date
                          ).getTime() >
                        0
                          ? 
                          : 0} */}
                            {(currentDate.setHours(0, 0, 0, 0) -
                              new Date(
                                stateOrderDetail.payment_term.due_date
                              ).setHours(0, 0, 0, 0)) /
                              (24 * 60 * 60 * 1000)}
                          </span>{' '}
                          day
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Box>
                <TypographySectionTitle sx={{ marginBottom: '10px' }}>
                  {t('noteForRetailer')}
                </TypographySectionTitle>
                {stateOrderDetail ? (
                  <BoxCustom
                    sx={{
                      padding: '15px',
                      borderRadius: '5px',
                      marginBottom: '25px',
                    }}
                  >
                    {stateOrderDetail.notes === null ||
                    stateOrderDetail.notes == '' ? (
                      <Typography>{t('nothingNoted')}</Typography>
                    ) : (
                      <Typography>{stateOrderDetail?.notes}</Typography>
                    )}
                  </BoxCustom>
                ) : (
                  <Skeleton variant="rounded" width="100%" height={50} />
                )}
              </>
            )}
        </Grid>
      </Grid>

      {/* <TypographySectionTitle sx={{ marginBottom: '10px' }}>
        {t('history')}
      </TypographySectionTitle>
      <BoxCustom
        sx={{
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '25px',
        }}
      >
        <Stack spacing={4}>
          {stateOrderDetail &&
            stateOrderDetail.history_actions.map((item: HistoryType) => {
              console.log(item.new_status)
              return (
                <Stack
                  key={Math.random() + 'id'}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Typography>
                    {moment(item.time).format('MM/DD/YYYY - hh:mm A')}
                  </Typography>

                  {item.new_status !== item.old_status ? (
                    <>
                      <Typography sx={{ fontWeight: 600 }}>
                        {item.action.substring(
                          0,
                          item.action.indexOf('updated') + 7
                        )}
                      </Typography>
                      <Chip
                        sx={{
                          backgroundColor: `${
                            optionStatus.findIndex(
                              (option) => option.text === item.old_status
                            ) !== -1
                              ? optionStatus[
                                  optionStatus.findIndex(
                                    (option) => option.text === item.old_status
                                  )
                                ].color
                              : '#1DB46A'
                          }`,
                          color: 'white',
                          fontWeight: '600',
                        }}
                        label={
                          optionStatus.findIndex(
                            (option) => option.text === item.old_status
                          ) !== -1
                            ? optionStatus[
                                optionStatus.findIndex(
                                  (option) => option.text === item.old_status
                                )
                              ].textDisplay
                            : 'Old status'
                        }
                      />
                      <ArrowRight size={18} />

                      <Chip
                        sx={{
                          backgroundColor: `${
                            optionStatus.findIndex(
                              (option) => option.text === item.new_status
                            ) !== -1
                              ? optionStatus[
                                  optionStatus.findIndex(
                                    (option) => option.text === item.new_status
                                  )
                                ].color
                              : '#1DB46A'
                          }`,
                          color: 'white',
                          fontWeight: '600',
                        }}
                        label={
                          optionStatus.findIndex(
                            (option) => option.text === item.new_status
                          )
                            ? optionStatus[
                                optionStatus.findIndex(
                                  (option) => option.text === item.new_status
                                )
                              ].textDisplay
                            : 'New status'
                        }
                      />
                    </>
                  ) : (
                    <Typography sx={{ fontWeight: 600 }}>
                      {item.action}
                    </Typography>
                  )}
                </Stack>
              )
            })}
        </Stack>
      </BoxCustom> */}
      <Dialog
        open={openDialog}
        onClose={handleCloseCancelOrderDialog}
        disableEnforceFocus
        sx={{ width: '100%', '& .MuiDialog-paper': { width: '100%' } }}
      >
        <DialogTitleTws>
          <IconButton onClick={handleCloseCancelOrderDialog}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>

        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('orderCancelation')}
        </TypographyH2>
        <DialogContentTws
          sx={{ padding: '0 20px', justifyItems: 'center', width: '100%' }}
        >
          <DialogContentTextTws
            sx={{
              width: '100%',
              marginBottom: '20px',
              textAlign: 'center',
            }}
          >
            {t('enterReasonCancelOrder')}
          </DialogContentTextTws>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container xs={12} mb={2}>
              <Controller
                control={control}
                name="reason"
                defaultValue=""
                render={({ field }) => {
                  return (
                    <>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          placeholder={t('enterCancelReason')}
                          id="reason"
                          multiline
                          rows={10}
                          {...field}
                          error={!!errors.reason}
                        />
                        <FormHelperText error={!!errors.reason}>
                          {errors.reason && `${errors.reason.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )
                }}
              />
            </Grid>
          </form>
        </DialogContentTws>
        <DialogActions
          sx={{
            padding: '0 20px 20px',
            display: 'flex',
          }}
        >
          <ButtonCancel
            variant="outlined"
            size="large"
            onClick={handleCloseCancelOrderDialog}
            sx={{ width: '50%' }}
          >
            {t('cancel')}
          </ButtonCancel>

          <ButtonCustom
            variant="contained"
            size="large"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            sx={{ width: '100%' }}
          >
            {t('submit')}
          </ButtonCustom>
        </DialogActions>
      </Dialog>
      <Drawer
        anchor="right"
        open={statePaymentDrawer}
        onClose={handleCloseDrawer}
      >
        <Box sx={{ padding: '20px', width: '500px' }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginBottom: '10px' }}
          >
            <IconButton onClick={handleCloseDrawer}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              Order Payment
            </Typography>
          </Stack>
          <TypographySectionTitle sx={{ marginBottom: '10px' }}>
            Payment term
          </TypographySectionTitle>
          <BoxCustom
            sx={{
              padding: '15px',

              marginBottom: '15px',
            }}
          >
            <Stack mb={2} spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography sx={{ fontWeight: 700 }}>Due amount</Typography>
                <Typography sx={{ fontWeight: 700 }}>
                  {formatMoney(stateOrderDetail?.payment_term.due_amount)}{' '}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Payment terms</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {stateOrderDetail?.payment_term.payment_term}{' '}
                  {Number(stateOrderDetail?.payment_term?.payment_term) > 1
                    ? 'days'
                    : 'day'}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography>Due date</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {moment(stateOrderDetail?.payment_term.due_date).format(
                    'MMMM Do, YYYY - hh:mm A'
                  )}{' '}
                </Typography>
              </Stack>
              <Typography>131234</Typography>

              {stateOrderDetail && stateOrderDetail.payment_term && (
                <>
                  {(new Date(stateOrderDetail.payment_term.due_date).setHours(
                    0,
                    0,
                    0,
                    0
                  ) -
                    currentDate.setHours(0, 0, 0, 0)) /
                    (24 * 60 * 60 * 1000) >
                  0 ? (
                    <>
                      <Typography
                        sx={{ fontStyle: 'italic', color: '#1DB46A' }}
                      >
                        The order will be due in{' '}
                        <span>
                          {/* {currentDate.getTime() -
                          new Date(
                            stateOrderDetail.payment_term.due_date
                          ).getTime() >
                        0
                          ? 
                          : 0} */}
                          {(new Date(
                            stateOrderDetail.payment_term.due_date
                          ).setHours(0, 0, 0, 0) -
                            currentDate.setHours(0, 0, 0, 0)) /
                            (24 * 60 * 60 * 1000)}
                        </span>{' '}
                        day
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography
                        sx={{ fontStyle: 'italic', color: '#1DB46A' }}
                      >
                        The order has been due for{' '}
                        <span>
                          {/* {currentDate.getTime() -
                          new Date(
                            stateOrderDetail.payment_term.due_date
                          ).getTime() >
                        0
                          ? 
                          : 0} */}
                          {(currentDate.setHours(0, 0, 0, 0) -
                            new Date(
                              stateOrderDetail.payment_term.due_date
                            ).setHours(0, 0, 0, 0)) /
                            (24 * 60 * 60 * 1000)}
                        </span>{' '}
                        day
                      </Typography>
                    </>
                  )}
                </>
              )}
            </Stack>
            <form onSubmit={handleSubmitAmount(onSubmitAmount)}>
              <Controller
                name="amount"
                control={controlAmount}
                render={() => (
                  <>
                    <Typography sx={{ fontWeight: 700 }}>Payment</Typography>
                    <InputLabelCustom>
                      Enter The Amount You Want To Pay
                    </InputLabelCustom>
                    <div
                      style={{ marginBottom: '10px', background: '#fff' }}
                      className={classes['input-number']}
                    >
                      <CurrencyNumberFormat
                        defaultPrice={truncateToTwoDecimalPlaces(
                          Number(stateOrderDetail?.payment_term.due_amount)
                        )}
                        propValue={(value) => {
                          setValueAmount('amount', value)
                          triggerAmount('amount')
                        }}
                      />
                    </div>
                    <FormHelperText error={!!errorsAmount.amount}>
                      {errorsAmount.amount && `${errorsAmount.amount.message}`}
                    </FormHelperText>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mb={2}
                    >
                      <Typography>Remaining Due Amount:</Typography>
                      <Typography>
                        {Number(stateOrderDetail?.payment_term.due_amount) -
                          Number(watchAmount('amount')) >
                        0
                          ? formatMoney(
                              truncateToTwoDecimalPlaces(
                                Number(
                                  stateOrderDetail?.payment_term.due_amount
                                ) - Number(watchAmount('amount'))
                              )
                            )
                          : formatMoney(0)}
                      </Typography>
                    </Stack>
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
                                  {`Expire`}: {selectCard?.expiryMonth}/
                                  {selectCard?.expiryYear}
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
                                {`Expire`} : {selectCard?.expiryMonth}/
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
                    <Box sx={{ marginBottom: '15px' }}>
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
                          <IconButton onClick={() => setOpenCreditCards(true)}>
                            <CaretRight size={20} weight="bold" />
                          </IconButton>
                        </Stack>
                      ) : (
                        <ButtonCustom
                          sx={{ marginTop: '10px', background: '#fff' }}
                          variant="outlined"
                          size="large"
                          onClick={() => setOpenCreditCards(true)}
                        >
                          Select card
                        </ButtonCustom>
                      )}
                    </Box>

                    <CreditCards
                      open={openCreditCards}
                      onClose={setOpenCreditCards}
                      setSelectCard={setSelectCard}
                      selectCard={selectCard}
                      isAbleToGetListCard={true}
                    />
                  </>
                )}
              />

              <Stack direction="row" spacing={2}>
                <ButtonCancel sx={{ background: '#fff' }} size="large">
                  Cancel
                </ButtonCancel>
                <ButtonCustom variant="contained" type="submit" size="large">
                  Submit
                </ButtonCustom>
              </Stack>
            </form>
          </BoxCustom>
        </Box>
      </Drawer>
    </>
  )
}
OrderDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'account', 'order'])),
    },
  }
}
export default OrderDetail
