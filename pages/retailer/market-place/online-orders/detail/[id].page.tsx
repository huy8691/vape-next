import {
  Avatar,
  Box,
  Breadcrumbs,
  ButtonGroup,
  // InputAdornment,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  Divider,
  Drawer,
  Fade,
  FormControl,
  FormHelperText,
  Grow,
  IconButton,
  InputAdornment,
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
import {
  Archive,
  ArrowRight,
  CircleWavyCheck,
  ClockClockwise,
  Truck,
  CheckCircle,
  CurrencyDollar,
  Star,
  X,
  Money,
  CreditCard,
} from '@phosphor-icons/react'

import { styled, useTheme } from '@mui/material/styles'
import { NextPageWithLayout } from 'pages/_app.page'
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import NestedLayout from 'src/layout/nestedLayout'

import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  BoxIconCustom,
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldCustom,
  TypographyH2,
  TypographySectionTitle,
  TypographyTitlePage,
} from 'src/components'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { formatMoney } from 'src/utils/money.utils'
import {
  approveOrder,
  exportOrder,
  getOrderDetail,
  getWarehouseAndQuantity,
  refundRetailOrder,
  saveProductRefund,
  sendInvoiceToEmail,
  updateOrderDetail,
  updatePaymentDetail,
} from './apiOrderDetail'
import {
  CancelOrderType,
  HistoryType,
  OrderDataType,
  OrderDetailType,
  OrderStatusType,
  RefundDetailType,
  RefundFormType,
  SaveProductRefundDetailType,
  ValidateWarehouseType,
  WarehouseAndQuantityDataType,
  WarehouseAndQuantityType,
  WarehouseWithQuantityType,
} from './modelOrderDetail'
import classes from './styles.module.scss'

// other
import { yupResolver } from '@hookform/resolvers/yup'
import Grid from '@mui/material/Unstable_Grid2'
import Head from 'next/head'
import { Controller, useForm } from 'react-hook-form'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  KEY_MODULE,
  PERMISSION_RULE,
  checkPermission,
  formatPhoneNumber,
  handlerGetErrMessage,
  isEmpty,
} from 'src/utils/global.utils'
import { schema, schemaCancelOrder } from './validations'
import * as Yup from 'yup'
import CurrencyNumberFormat from './CurrencyNumberFormat'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const TypographyCustom = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: '400',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#1B1F27',
}))
const TypographyTotalCustom = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: '600',
  color: theme.palette.primary.main,
}))

const BoxCustom = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#F8F9FC',
  border: theme.palette.mode === 'dark' ? '1px solid #E1E6EF' : 'none',
}))

const ButtonStatusPayment = styled(ButtonCustom)(({ theme }) => ({
  backgroundColor: '#1CB25B',
  color: theme.palette.mode === 'dark' ? '#121212' : '#F8F9FC',
  textTransform: 'capitalize',
  borderRadius: '32px',
  padding: '10px 15px 10px 14px',
  '&:hover': {
    backgroundColor: '#1CB25B',
  },
}))
const BoxModalCustom = styled(Box)(({ theme }) => ({
  width: 1000,
  borderRadius: '8px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
}))

const OrderDetail: NextPageWithLayout = () => {
  const { t } = useTranslation('order')

  const theme = useTheme()
  const [pushMessage] = useEnqueueSnackbar()

  const [open, setOpen] = React.useState(false)
  const [openPaymentStatus, setOpenPaymentStatus] =
    React.useState<boolean>(false)
  const [stateTempStatus, setStateTempStatus] = useState<OrderStatusType[]>([])
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const anchorRefStatusPayment = React.useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState<number>(1)
  // ref use for store index
  const statusCurrent = useRef<number>(0)
  const [stateOrderDetail, setStateOrderDetail] = useState<OrderDetailType>()
  const [openDialog, setOpenDialog] = useState(false)
  const [openDialogPayment, setOpenDialogPayment] = useState<boolean>(false)
  // state used for approve
  const [stateSidebar, setStateSidebar] = useState(false)
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [stateOpenPopper, setStateOpenPopper] = React.useState(false)
  const [stateListOrderItem, setStateListOrderItem] =
    useState<OrderDataType[]>()
  const [stateQuantityAndWarehouse, setStateQuantityAndWarehouse] = useState<
    WarehouseAndQuantityType[]
  >([])
  const [stateTempOrderItem, setStateTempOrderItem] = useState<OrderDataType>()
  const [stateDisabled, setStateDisabled] = useState<boolean>(false)
  const [stateOpenDialog, setStateOpenDialog] = useState(false)
  const [stateOpenDialogRefund, setStateOpenDialogRefund] = useState(false)
  const [stateOpenDrawerRefund, setStateOpenDrawerRefund] = useState(false)
  const [stateProductSelected, setStateProductSelected] = useState<
    OrderDataType[]
  >([])
  const [stateCurrentLimitTotalAmount, setStateCurrentLimitTotalAmount] =
    useState(0)
  const [stateOpenSendInvoiceDrawer, setStateOpenSendInvoiceDrawer] =
    useState(false)
  const arrayPermission = useAppSelector((state) => state.permission.data)

  const isStatusPayment = useMemo(
    () =>
      stateOrderDetail?.payment_status === 'WAITING FOR PAYMENT' ? true : false,
    [stateOrderDetail?.payment_status]
  )

  interface Summary {
    totalSelectedQuantity: number
    totalMissingQuantity: number
  }
  const [stateSummary, setStateSummary] = useState<Summary>({
    totalSelectedQuantity: 0,
    totalMissingQuantity: 0,
  })
  const [stateRefundDetail, setStateRefundDetail] = useState<{
    cash: number
    credit: number
  }>({
    cash: 0,
    credit: 0,
  })
  const [stateRadioPaymentMethod, setStateRadioPaymentMethod] = useState(2)
  const [stateInvoiceUrl, setStateInvoiceUrl] = useState('')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const submitArr: WarehouseAndQuantityDataType[] = []
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

  // dialog
  const handleDialog = () => {
    setOpenDialog(!openDialog)
  }
  const handleDialogPayment = () => {
    setOpenDialogPayment(!openDialogPayment)
  }

  useEffect(() => {
    if (router.query.id) {
      dispatch(loadingActions.doLoading())
      handleGetOrderDetail(Number(router.query.id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, dispatch, optionStatus])
  useEffect(() => {
    //calculate limit of total amount
    if (!stateOrderDetail) return
    if (stateProductSelected.length === 0) {
      setStateCurrentLimitTotalAmount(0)
      setValueRefund('total_amount', 0)
      return
    }
    let limitRefundAmount = 0
    stateProductSelected.forEach(
      (item) => (limitRefundAmount += Number(item.total.toFixed(2)))
    )
    setStateCurrentLimitTotalAmount(Number(limitRefundAmount.toFixed(2)))
    setValueRefund('total_amount', limitRefundAmount)
  }, [stateOrderDetail, stateProductSelected])

  const handleGetOrderDetail = (id: number) => {
    getOrderDetail(id)
      .then((res) => {
        const { data } = res.data
        setStateOrderDetail(data)
        const newOrderArr = data?.items?.map((item: OrderDataType) => {
          return {
            ...item,
            isSelected: false,
          }
        })
        setStateListOrderItem(newOrderArr)
        // store temporary status array
        const temporaryStatus: OrderStatusType[] = []
        optionStatus.every((item, index) => {
          if (data?.status === 'DELIVERED') {
            return true
          }
          if (data?.status === item.text) {
            return true
          }
          if (
            data?.status !== 'CANCELLED' &&
            optionStatus.findIndex((item) => item.text === data?.status) ===
              index - 1
          ) {
            console.log('item 1 ', optionStatus[index - 1].text)
            console.log('item 2 ', optionStatus[index].text)
            temporaryStatus.push(item)
            return true
          }
          // if (index === optionStatus.length - 1) {
          //   temporaryStatus.push(item)
          //   return true
          // }
          if (optionStatus[index].text === 'CANCELLED') {
            temporaryStatus.push(optionStatus[index])
            return true
          }
          return true
        })
        console.log('temporaryStatus', temporaryStatus)
        setStateTempStatus(temporaryStatus)
        statusCurrent.current = optionStatus.findIndex(
          (item) => item.text === data?.status
        )
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index)
    setOpen(false)
    handleDialog()
    if (index === 5) {
      if (stateOrderDetail?.payment_status === 'PAID') {
        setOpenDialog(false)
        setStateOpenDrawerRefund(true)
        return
      }
      handleDialogCancelOrder()
      setOpenDialog(false)
    }
  }
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }
  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }
    setOpen(false)
  }

  //handle  Popper Payment status
  const handleTogglePaymentStatus = () => {
    setOpenPaymentStatus((prevOpen) => !prevOpen)
  }
  const handleDialogCancelOrder = () => {
    setStateOpenDialog(!stateOpenDialog)
  }

  const handleClosePaymentStatus = (event: Event) => {
    if (
      anchorRefStatusPayment.current &&
      anchorRefStatusPayment.current.contains(event.target as HTMLElement)
    ) {
      return
    }
    setOpenPaymentStatus(false)
  }
  const handleConfirmUpdateStatus = () => {
    if (selectedIndex === 1) {
      toggleDrawer()
      return
    }
    try {
      dispatch(loadingActions.doLoading())
      updateOrderDetail(
        router.query?.id as string,
        optionStatus[selectedIndex].text
      )
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          setOpen(false)
          handleDialog()
          pushMessage(
            `Order status has been changed to ${optionStatus[selectedIndex].text} successfully.`,
            'success'
          )
          if (router.query.id) {
            handleGetOrderDetail(Number(router.query.id))
          }
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    } catch (error) {
      return
    }
  }
  const toggleDrawer = () => {
    setOpenDialog(false)
    handleClosePopper()
    setStateSidebar((prev) => !prev)
  }
  const handleOpenPopper = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget)
    setStateOpenPopper((prev) => !prev)
  }
  const handleClosePopper = () => {
    setStateOpenPopper(false)
    resetField('warehouse_quantity')
  }
  const handleSetCheckItem = (
    items: WarehouseAndQuantityType,
    index: number
  ) => {
    const newArr = stateQuantityAndWarehouse?.map(
      (item: WarehouseAndQuantityType) => {
        if (item.warehouse.id === items.warehouse.id) {
          if (item.isChecked === true) {
            resetField(`warehouse_quantity.${index}.quantity`)
            resetField(`warehouse_quantity.${index}.warehouse`)
            calculateTotalSelectedQuantity()
          } else {
            if (items.quantity <= stateSummary.totalMissingQuantity) {
              setValue(`warehouse_quantity.${index}.quantity`, items.quantity)
              calculateTotalSelectedQuantity()
              setValue(
                `warehouse_quantity.${index}.warehouse`,
                Number(item.warehouse.id)
              )
            } else {
              setValue(
                `warehouse_quantity.${index}.quantity`,
                stateSummary.totalMissingQuantity
              )
              setValue(
                `warehouse_quantity.${index}.warehouse`,
                item.warehouse.id
              )
              calculateTotalSelectedQuantity()
            }
            clearErrors(`warehouse_quantity.${index}.quantity`)
          }
          return { ...item, isChecked: !item.isChecked }
        }
        return {
          ...item,
        }
      }
    )
    setStateQuantityAndWarehouse(newArr)
  }

  const handleSetSelectedItem = (items: OrderDataType) => {
    setStateTempOrderItem(items)
    const newArr = stateListOrderItem?.map((item: OrderDataType) => {
      if (item.id === items.id) return { ...item, isSelected: !item.isSelected }
      return {
        ...item,
        isSelected: false,
      }
    })

    if (newArr) {
      setStateListOrderItem(newArr)
    }

    getWarehouseAndQuantity(items.id)
      .then((res) => {
        const data = res.data
        console.log(data)
        // get is_default warehouse then splice it and unshift to warehouse array
        let temporaryArr = []
        const indexIsDefault = data.data.findIndex(
          (item: WarehouseAndQuantityType) => item.warehouse.is_default === true
        )
        if (indexIsDefault === -1) {
          temporaryArr = data.data
        } else {
          const objectIsDefault = data.data[indexIsDefault]
          data.data.splice(indexIsDefault, 1)
          data.data.sort((a, b) => {
            return b.quantity - a.quantity
          })
          if (objectIsDefault) {
            data.data.unshift(objectIsDefault)
          }
          temporaryArr = data.data
        }

        if (items.warehouse_quantity) {
          const newArr: WarehouseAndQuantityType[] = temporaryArr.map(
            (item: WarehouseAndQuantityType, index) => {
              if (!items.warehouse_quantity)
                return {
                  ...item,
                  isChecked: false,
                }
              const condition = items.warehouse_quantity.find(
                (warehouse: WarehouseWithQuantityType) => {
                  return warehouse.warehouse === item.warehouse.id
                }
              )
              if (
                items.warehouse_quantity &&
                // typeof items.warehouse_quantity[index] !== 'undefined' &&
                typeof condition !== 'undefined'
              ) {
                setValue(
                  `warehouse_quantity.${index}.quantity`,
                  // items.warehouse_quantity[index].quantity
                  condition.quantity
                )
                setValue(
                  `warehouse_quantity.${index}.warehouse`,
                  // items.warehouse_quantity[index].warehouse
                  condition.warehouse
                )
                return {
                  ...item,
                  isChecked: true,
                }
              }
              return {
                ...item,
                isChecked: false,
              }
            }
          )
          setStateQuantityAndWarehouse(newArr)
        } else {
          const newArr = temporaryArr.map((item: WarehouseAndQuantityType) => {
            return {
              ...item,
              isChecked: false,
            }
          })
          setStateQuantityAndWarehouse(newArr)
        }
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleSubmitWarehouseSelection = () => {
    if (!stateListOrderItem) return
    if (
      stateListOrderItem.some((item: OrderDataType) => {
        return (
          !Object.prototype.hasOwnProperty.call(item, 'warehouse_quantity') ||
          (item.missing && item.missing > 0)
        )
      })
    ) {
      pushMessage('Please check again', 'error')
    } else {
      const submitArr = stateListOrderItem.map(
        ({ order_item_id, warehouse_quantity }) => ({
          order_item: order_item_id,
          warehouse_quantity,
        })
      )
      const fakeObj: ValidateWarehouseType = {
        items: submitArr,
      }
      if (!stateOrderDetail) return
      approveOrder(stateOrderDetail.id, fakeObj)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(
            'Order status has been changed to Approved successfully.',
            'success'
          )
          handleGetOrderDetail(Number(router.query.id))
          // setFlagUpdateStatus('update status' + new Date())

          setStateSidebar(false)
        })
        .catch(({ response }) => {
          const { status, data } = response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    register,
    watch,
    clearErrors,
    resetField,
    trigger,
    formState: { errors },
  } = useForm<WarehouseAndQuantityDataType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
    // reValidateMode: 'onChange',
  })
  const {
    handleSubmit: handleSubmitCancelOrder,
    control: controlHandlerCancelOrder,
    clearErrors: clearErrorsCancelOrder,
    resetField: resetFieldCancelOrder,
    formState: { errors: errorsCancelOrder },
  } = useForm<CancelOrderType>({
    resolver: yupResolver(schemaCancelOrder(t)),
    mode: 'all',
    // reValidateMode: 'onChange',
  })
  const {
    handleSubmit: handleSubmitRefund,
    control: controlRefund,
    reset: resetRefund,
    clearErrors: clearErrorsRefund,

    watch: watchRefund,
    setValue: setValueRefund,
    trigger: triggerRefund,
    formState: { errors: errorsRefund },
  } = useForm<RefundFormType>({
    resolver: yupResolver(
      Yup.object().shape(
        {
          total_amount: Yup.number()
            .required('Refund amount is required')
            .positive('Refund amount must be a positive number')
            .typeError('Refund amount must be a number')
            .min(1, `Refund amount must be greater than or equal to 1.00$`)
            .max(
              Number(stateCurrentLimitTotalAmount.toFixed(2)),
              `Refund amount be lower than or equal to ${stateCurrentLimitTotalAmount.toFixed(
                2
              )}$`
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
                  .min(2, 'Reason must be between 2 and 1000 characters')
                  .max(1000, 'Reason must be between 2 and 1000 characters'),
            }),
        },
        [['reason', 'reason']]
      )
    ),

    mode: 'all',
    // reValidateMode: 'onChange',
  })

  const onSubmitCancelOrder = (value: CancelOrderType) => {
    const { reason } = value
    updateOrderDetail(
      router.query?.id as string,
      optionStatus[selectedIndex].text,
      reason
    )
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        setOpen(false)

        pushMessage(
          `${t('changeOrderStatus')} ${optionStatus[selectedIndex].text} ${t(
            'successfully'
          )}`,
          'success'
        )
        handleCloseCancelOrderDialog()
        handleGetOrderDetail(Number(router.query.id))
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleCloseCancelOrderDialog = () => {
    resetFieldCancelOrder('reason')
    clearErrorsCancelOrder()
    setStateOpenPopper(false)
    setStateOpenDialog(false)
  }
  const calculateTotalSelectedQuantity = useCallback(() => {
    console.log('watch', watch('warehouse_quantity'))
    let totalSelectedQuantity = 0
    let totalMissingQuantity = 0
    let orderQuantity = 0
    if (!stateTempOrderItem) return

    orderQuantity = stateTempOrderItem.quantity

    if (stateQuantityAndWarehouse) {
      for (let i = 0; i < stateQuantityAndWarehouse?.length; i++) {
        if (!watch(`warehouse_quantity.${i}.quantity`)) {
          continue
        }
        totalSelectedQuantity += Number(
          watch(`warehouse_quantity.${i}.quantity`)
        )
      }
    }
    totalMissingQuantity = orderQuantity - totalSelectedQuantity
    if (totalMissingQuantity <= 0) {
      setStateDisabled(true)
      totalMissingQuantity = 0
    } else {
      setStateDisabled(false)
    }
    setStateSummary({
      totalSelectedQuantity,
      totalMissingQuantity,
    })
    // setStateTempTotal(totalSelectedQuantity)
  }, [watch, stateQuantityAndWarehouse, stateTempOrderItem])

  useEffect(() => {
    calculateTotalSelectedQuantity()
  }, [calculateTotalSelectedQuantity])
  const onSubmitQuantityWarehouse = (data: {
    warehouse_quantity: WarehouseWithQuantityType[]
  }) => {
    if (
      stateSummary.totalSelectedQuantity > Number(stateTempOrderItem?.quantity)
    ) {
      pushMessage(t('errorMessage.totalSelectCanNotLargerThan'), 'error')
      return
    }
    if (stateSummary.totalSelectedQuantity === 0) {
      pushMessage(t('errorMessage.youMustChooseAtLeast'), 'error')
      return
    }

    const newArr = data.warehouse_quantity.filter(
      (item: WarehouseWithQuantityType) => item.quantity
    )
    if (stateTempOrderItem) {
      submitArr.push({
        order_item: stateTempOrderItem.order_item_id,
        warehouse_quantity: newArr,
      })
      const cloneArr = stateListOrderItem?.map((item: OrderDataType) => {
        if (item.order_item_id === stateTempOrderItem.order_item_id) {
          return {
            ...item,
            isSelected: false,
            warehouse_quantity: newArr,
            missing: stateSummary.totalMissingQuantity,
          }
        }
        return { ...item, isSelected: false }
      })
      setStateListOrderItem(cloneArr)
    }
    pushMessage(
      `${t('adjustQuantityFor')} ${stateTempOrderItem?.name} ${t(
        'successfully'
      )}`,
      'success'
    )
    handleClosePopper()
  }
  const summary = { ...stateSummary }
  console.log('summary', summary)
  const handleConfirmUpdatePaymentStatus = () => {
    dispatch(loadingActions.doLoading())
    const orderId = Number(router.query.id)
    updatePaymentDetail(orderId)
      .then(() => {
        handleDialogPayment()
        pushMessage(t('markOrderAsPaid'), 'success')
        getOrderDetail(orderId)
          .then((res) => {
            const { data } = res.data
            setStateOrderDetail(data)
            dispatch(loadingActions.doLoadingSuccess())
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
            dispatch(loadingActions.doLoadingFailure())
          })
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleAutoSelectApproveMultiWarehouse = () => {
    if (!stateQuantityAndWarehouse || !stateTempOrderItem) return

    const temporaryArrayQuantityWarehouse = stateQuantityAndWarehouse.map(
      (item, index) => {
        resetField(`warehouse_quantity.${index}.quantity`)
        return { ...item, isChecked: false }
      }
    )
    summary.totalSelectedQuantity = 0
    summary.totalMissingQuantity = stateTempOrderItem.quantity
    // same old handleAutoSelect
    temporaryArrayQuantityWarehouse.every((item, index) => {
      if (item.quantity === 0) return true

      if (item.isChecked && summary.totalMissingQuantity > 0) {
        summary.totalMissingQuantity += Number(
          getValues(`warehouse_quantity.${index}.quantity`)
        )
        setValue(`warehouse_quantity.${index}.quantity`, 0)
      }
      item.isChecked = true
      console.log('item.warehouse.name', item.warehouse.name)
      console.log('item.warehouse.id', item.warehouse.id)
      console.log(index)
      if (item.quantity <= summary.totalMissingQuantity) {
        setValue(`warehouse_quantity.${index}.quantity`, item.quantity)
        setValue(`warehouse_quantity.${index}.warehouse`, item.warehouse.id)
        calculateTotalSelectedQuantity()
        summary.totalMissingQuantity -= item.quantity
        return true
      } else {
        // setValue(
        //   `warehouse_quantity.${index}.quantity`,
        //   stateSummary.totalMissingQuantity
        // )
        setValue(
          `warehouse_quantity.${index}.quantity`,
          summary.totalMissingQuantity
        )
        setValue(`warehouse_quantity.${index}.warehouse`, item.warehouse.id)
        summary.totalMissingQuantity -= 0
        // setValue(`warehouse_quantity.${index}.warehouse`, item.warehouse.id)
        calculateTotalSelectedQuantity()
      }
    })
    setStateQuantityAndWarehouse(temporaryArrayQuantityWarehouse)
  }
  const handleOpenDrawerRefund = () => {
    setStateOpenDialogRefund(false)
    setStateOpenDrawerRefund(true)
  }

  const handleCheckIsProductIsIncludedInListSelectedProduct = (
    index: number
  ) => {
    return stateProductSelected.some((item) => item.id === index)
  }
  const handleChangeListSelectedProduct = (item: OrderDataType) => {
    const cloneCurrentSelectedProduct: OrderDataType[] = JSON.parse(
      JSON.stringify(stateProductSelected)
    )
    if (handleCheckIsProductIsIncludedInListSelectedProduct(item.id)) {
      const foundIndex = cloneCurrentSelectedProduct.findIndex(
        (obj) => obj.id === item.id
      )

      cloneCurrentSelectedProduct.splice(foundIndex, 1)
      setStateProductSelected(cloneCurrentSelectedProduct)
    } else {
      cloneCurrentSelectedProduct.push(item)
      setStateProductSelected(cloneCurrentSelectedProduct)
    }
  }
  const handleCloseDrawer = () => {
    resetRefund()
    clearErrorsRefund()
    setStateOpenDrawerRefund(false)
    setStateProductSelected([])
    setStateCurrentLimitTotalAmount(0)
  }
  const onSubmitRefund = (value: RefundFormType) => {
    console.log('value', value)
    dispatch(loadingActions.doLoading())
    const listIdSelectedProduct: number[] = stateProductSelected.map(
      (item) => item.id
    )
    const submitValueForSaveProductRefund: SaveProductRefundDetailType = {
      reason: value.reason ? value.reason : null,
      total_amount: value.total_amount,
      refund_include_tip: false,
      items: listIdSelectedProduct,
      other_products: [],
    }
    if (!value.reason) {
      delete submitValueForSaveProductRefund.reason
    }
    saveProductRefund(Number(router.query.id), submitValueForSaveProductRefund)
      .then(() => {
        pushMessage(t('saveProductForRefund'), 'success')
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    const submitCashAndCreditFor: RefundDetailType = {
      cash: 0,
      credit: stateRefundDetail.credit,
    }
    refundRetailOrder(Number(router.query.id), submitCashAndCreditFor)
      .then(() => {
        handleGetOrderDetail(Number(router.query.id))

        handleCloseDrawer()
        pushMessage(t('refundForOrderSuccess'), 'success')
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  useEffect(() => {
    if (!stateOrderDetail) return
    console.log('watch(total_amount', watchRefund('total_amount'))
    if (!watchRefund('total_amount')) {
      setStateRefundDetail({
        cash: 0,
        credit: 0,
      })
      return
    }
    const cloneWatchCurrentLimitAmount: number = watchRefund('total_amount')
    // console.log('cloneWatchCurrentLimitAmount', cloneWatchCurrentLimitAmount)
    // if (stateRadioPaymentMethod === 1) {
    //   if (cloneWatchCurrentLimitAmount > Number(stateOrderDetail.cash)) {
    //     setStateRefundDetail({
    //       cash: Number(stateOrderDetail.cash?.toFixed(2)),
    //       credit: Number(
    //         (
    //           cloneWatchCurrentLimitAmount -
    //           Number(stateOrderDetail.cash?.toFixed(2))
    //         ).toFixed(2)
    //       ),
    //     })
    //   } else {
    //     setStateRefundDetail({
    //       cash: Number(cloneWatchCurrentLimitAmount.toFixed(2)),
    //       credit: 0,
    //     })
    //   }
    // }
    if (stateRadioPaymentMethod === 2) {
      if (cloneWatchCurrentLimitAmount > Number(stateOrderDetail.credit)) {
        setStateRefundDetail({
          credit: Number(stateOrderDetail.credit?.toFixed(2)),
          cash: Number(
            (
              cloneWatchCurrentLimitAmount -
              Number(stateOrderDetail.credit?.toFixed(2))
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
    watchRefund('total_amount'),
    stateRadioPaymentMethod,
    stateOrderDetail,
    stateProductSelected,
  ])
  const handleOpenSendInvoiceDrawer = () => {
    if (!stateOrderDetail) return
    dispatch(loadingActions.doLoading())
    exportOrder(stateOrderDetail?.id)
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
    if (!stateOrderDetail || !stateInvoiceUrl) return
    dispatch(loadingActions.doLoading())
    sendInvoiceToEmail(stateOrderDetail.id, { invoice_url: stateInvoiceUrl })
      .then(() => {
        pushMessage('Send email successfully', 'success')
        setStateOpenSendInvoiceDrawer(false)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <Stack direction="row" alignItems="center" spacing={4} mb={'5px'}>
        {stateOrderDetail ? (
          <TypographyTitlePage variant="h1">
            {t('title')} #{stateOrderDetail?.code}
          </TypographyTitlePage>
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
            <ButtonGroup variant="outlined" ref={anchorRef}>
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
                }}
                startIcon={
                  <BoxIconCustom>
                    {optionStatus[statusCurrent.current] ? (
                      optionStatus[statusCurrent.current].icon
                    ) : (
                      <Archive color={theme.palette.primary.main} size={20} />
                    )}
                  </BoxIconCustom>
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
                    : 'Default'}
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
                        autoFocusItem
                        className={classes['list-status']}
                      >
                        {stateTempStatus.map((item) => (
                          <MenuItem
                            key={item.text}
                            onClick={(event) =>
                              handleMenuItemClick(event, item.id)
                            }
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
                                <BoxIconCustom>{item.icon}</BoxIconCustom>
                              }
                              variant="contained"
                              onClick={handleToggle}
                            >
                              <Typography sx={{ fontWeight: '600' }}>
                                {item.textDisplay === 'Cancelled' ||
                                item.textDisplay === 'Approved' ? (
                                  <>
                                    {item.textDisplay === 'Cancelled'
                                      ? 'Cancel'
                                      : 'Approve'}
                                  </>
                                ) : (
                                  <>{item.textDisplay}</>
                                )}
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
        {stateOrderDetail ? (
          <>
            <ButtonGroup variant="outlined" ref={anchorRefStatusPayment}>
              <ButtonCustom
                sx={{
                  backgroundColor: `${isStatusPayment ? '#49516F' : '#1DB46A'}`,
                  color: 'white',
                  textTransform: 'capitalize',
                  borderRadius: '32px',
                  padding: '10px 15px 10px 14px',
                }}
                startIcon={
                  <BoxIconCustom>
                    {isStatusPayment ? (
                      <CurrencyDollar size={20} color="#49516F" />
                    ) : (
                      <CheckCircle size={20} color="#1DB46A" />
                    )}
                  </BoxIconCustom>
                }
                variant="contained"
                onClick={() => {
                  if (
                    checkPermission(
                      arrayPermission,
                      KEY_MODULE.Order,
                      PERMISSION_RULE.UpdatePaymentStatus
                    )
                  )
                    handleTogglePaymentStatus()
                }}
              >
                <Typography sx={{ fontWeight: '600' }}>
                  {stateOrderDetail?.payment_status
                    .replaceAll('_', ' ')
                    .toLowerCase()}
                </Typography>
              </ButtonCustom>
            </ButtonGroup>
            {isStatusPayment && stateOrderDetail?.status !== 'CANCELLED' && (
              <Popper
                sx={{
                  zIndex: 1,
                }}
                open={openPaymentStatus}
                anchorEl={anchorRefStatusPayment.current}
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
                    <Paper
                      sx={{ background: 'transparent', boxShadow: 'none' }}
                    >
                      <ClickAwayListener onClickAway={handleClosePaymentStatus}>
                        <MenuList
                          autoFocusItem
                          className={classes['list-status']}
                        >
                          <ButtonStatusPayment onClick={handleDialogPayment}>
                            {t('markAsPaid')}
                          </ButtonStatusPayment>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            )}
          </>
        ) : (
          <Skeleton variant="rounded" width={300} height={60} />
        )}
        <ButtonCustom
          variant="contained"
          onClick={handleOpenSendInvoiceDrawer}
          size="large"
        >
          {t('sendInvoice')}
        </ButtonCustom>
      </Stack>
      {stateOrderDetail ? (
        <Breadcrumbs
          separator=">"
          aria-label="breadcrumb"
          sx={{ marginBottom: '15px' }}
        >
          <Link href="/supplier/market-place/online-orders/list">
            <a>{t('orderManagement')}</a>
          </Link>
          <Link
            href={`/supplier/market-place/online-orders/detail/${stateOrderDetail.id}`}
          >
            <a>
              {t('title')} #{stateOrderDetail.code}
            </a>
          </Link>
        </Breadcrumbs>
      ) : (
        <Skeleton
          animation="wave"
          variant="text"
          sx={{ fontSize: '1.4rem' }}
          width={300}
        />
      )}
      <Grid container spacing={2} sx={{ marginBottom: '17px' }}>
        <Grid xs={6} alignItems="flex-start">
          <TypographySectionTitle sx={{ marginBottom: '10px' }}>
            {t('title')}
          </TypographySectionTitle>
          {stateOrderDetail ? (
            <BoxCustom
              sx={{
                padding: '15px',
                borderRadius: '5px',
                height: '168px',
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
        </Grid>
        <Grid xs={6} alignItems="flex-end">
          <TypographySectionTitle sx={{ marginBottom: '10px' }}>
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
          )}
        </Grid>
      </Grid>
      <TypographySectionTitle sx={{ marginBottom: '10px' }}>
        {t('products')}
      </TypographySectionTitle>
      {stateOrderDetail ? (
        <TableContainerTws sx={{ marginTop: '0', marginBottom: '25px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCellTws>{t('product')}</TableCellTws>
                <TableCellTws>{t('quantity')}</TableCellTws>
                <TableCellTws>{t('price')}</TableCellTws>
                <TableCellTws width={100} align="right">
                  {t('subtotal')}
                </TableCellTws>
              </TableRow>
            </TableHead>
            <TableBody>
              {stateOrderDetail?.items.map((items, index: number) => {
                const fieldVariantName = items.attribute_options
                  .map((element) => element.option)
                  .join(' - ')
                console.log('fieldVariantName', fieldVariantName)
                return (
                  <TableRowTws key={`item-${index}`}>
                    <TableCellTws>
                      <Stack direction="row" alignItems="center">
                        <div className={classes['image-wrapper']}>
                          {checkPermission(
                            arrayPermission,
                            KEY_MODULE.Inventory,
                            PERMISSION_RULE.ViewDetails
                          ) ? (
                            <Link
                              href={`/supplier/inventory/product/detail/${items.id}`}
                            >
                              <a>
                                <Image
                                  alt="product-image"
                                  src={
                                    items.thumbnail
                                      ? items.thumbnail
                                      : '/' + '/images/defaultProductImage.png'
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
                                  : '/' + '/images/defaultProductImage.png'
                              }
                              width={60}
                              height={60}
                            />
                          )}
                        </div>
                        {/* <Link
                          href={`/supplier/inventory/product/detail/${items.id}`}
                        >
                          <a>
                            <Stack padding={2}>
                              <TypographyCustom>{items.name}</TypographyCustom>
                              <TypographyCustom
                                sx={{ fontSize: '14px', fontWeight: '300' }}
                              >
                                #{items.code}
                              </TypographyCustom>
                            </Stack>
                          </a>
                        </Link> */}
                        {checkPermission(
                          arrayPermission,
                          KEY_MODULE.Inventory,
                          PERMISSION_RULE.ViewDetails
                        ) ? (
                          <Link
                            href={`/supplier/inventory/product/detail/${items.id}`}
                          >
                            <a>
                              <Stack padding={2}>
                                <TypographyCustom>
                                  {items.name}
                                </TypographyCustom>
                                {items.attribute_options.length > 0 && (
                                  <Stack direction="row" spacing={2}>
                                    {items.attribute_options.map((obj, pos) => {
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
                                            sx={{ fontSize: '1.2rem' }}
                                          >
                                            {obj.option}
                                          </Typography>
                                        </Stack>
                                      )
                                    })}
                                  </Stack>
                                )}

                                <TypographyCustom
                                  sx={{ fontSize: '14px', fontWeight: '300' }}
                                >
                                  #{items.code} {items.is_sample && 'is_sample'}
                                </TypographyCustom>
                              </Stack>
                            </a>
                          </Link>
                        ) : (
                          <Stack padding={2}>
                            <TypographyCustom>{items.name}</TypographyCustom>
                            {items.attribute_options && (
                              <Typography
                                sx={{ fontSize: '1.2rem', fontWeight: 300 }}
                              >
                                {fieldVariantName}
                              </Typography>
                            )}

                            <TypographyCustom
                              sx={{ fontSize: '14px', fontWeight: '300' }}
                            >
                              #{items.code}
                            </TypographyCustom>
                          </Stack>
                        )}
                      </Stack>
                    </TableCellTws>
                    <TableCellTws sx={{ textTransform: 'lowercase' }}>
                      {items.quantity} {items.unit_type}
                    </TableCellTws>
                    <TableCellTws>
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
                    </TableCellTws>
                    <TableCellTws width={100} align="right">
                      <TypographyTotalCustom
                        sx={{ fontWeight: 'bold', fontSize: '16px' }}
                      >
                        {formatMoney(items.total)}
                      </TypographyTotalCustom>
                    </TableCellTws>
                  </TableRowTws>
                )
              })}
            </TableBody>
          </Table>
        </TableContainerTws>
      ) : (
        <Skeleton variant="rounded" width="100%" height={400} />
      )}
      <TypographySectionTitle sx={{ marginBottom: '10px' }}>
        {t('shippingAddress')}
      </TypographySectionTitle>
      {stateOrderDetail ? (
        <BoxCustom
          sx={{
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '25px',
          }}
        >
          <Stack spacing={2}>
            <Stack direction="row" spacing={1}>
              <Typography sx={{ color: '#49516F' }}>
                {/* Recipient&apos;s name:{' '} */}
                {t('recipientName')}
              </Typography>
              <Typography sx={{ color: '#1B1F27' }}>
                {stateOrderDetail?.shipping_address.receiver_name}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography sx={{ color: '#49516F' }}>Phone number: </Typography>
              <Typography sx={{ color: '#1B1F27' }}>
                {formatPhoneNumber(
                  stateOrderDetail?.shipping_address.phone_number
                )}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography sx={{ color: '#49516F' }}> Address: </Typography>
              <Typography sx={{ color: '#1B1F27' }}>
                {stateOrderDetail?.shipping_address.address}
              </Typography>
            </Stack>
          </Stack>
        </BoxCustom>
      ) : (
        <Skeleton variant="rounded" width="100%" height={100} />
      )}
      <TypographySectionTitle sx={{ marginBottom: '10px' }}>
        {t('shippingMethod')}
      </TypographySectionTitle>
      {stateOrderDetail ? (
        <BoxCustom
          sx={{
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '25px',
          }}
        >
          <Typography>
            {/* {stateOrderDetail?.shipping_method} */}
            {t('basicShipping')}
          </Typography>
        </BoxCustom>
      ) : (
        <Skeleton variant="rounded" width="100%" height={50} />
      )}
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
          {stateOrderDetail.notes === null || stateOrderDetail.notes == '' ? (
            <Typography>{t('nothingNoted')}</Typography>
          ) : (
            <Typography>{stateOrderDetail?.notes}</Typography>
          )}
        </BoxCustom>
      ) : (
        <Skeleton variant="rounded" width="100%" height={50} />
      )}
      <TypographySectionTitle sx={{ marginBottom: '10px' }}>
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
              console.log('item new status', item.new_status)
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
                            ) >= 0
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
                          ) !== -1
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
      </BoxCustom>
      <Dialog open={openDialog} onClose={handleDialog} disableEnforceFocus>
        <DialogTitleTws>
          <IconButton onClick={handleDialog}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('changeOrderStatusTitle')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {t('confirmUpdateOrderStatus')}
            <span style={{ textTransform: 'capitalize' }}>
              {optionStatus[selectedIndex].textDisplay.toLocaleLowerCase()}
            </span>{' '}
            ?
          </DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={handleDialog}
              variant="outlined"
              size="large"
            >
              {t('no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleConfirmUpdateStatus}
              size="large"
            >
              {t('yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>

      <Dialog open={openDialogPayment} onClose={handleDialogPayment}>
        <DialogTitleTws>
          <IconButton onClick={handleDialogPayment}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('changePaymentStatus')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {t('confirmUpdatePaymentStatus')}
          </DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={handleDialogPayment}
              variant="outlined"
              size="large"
            >
              {t('no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleConfirmUpdatePaymentStatus}
              size="large"
            >
              {t('yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      <React.Fragment>
        <Drawer
          anchor={'right'}
          open={stateSidebar}
          onClose={toggleDrawer}
          disableEnforceFocus
        >
          {/* <DrawerHeader></DrawerHeader> */}
          <Box
            sx={{
              background: 'white',
              width: `900px`,
              height: '100%',
              padding: '25px',
            }}
          >
            <Typography sx={{ fontSize: '24px', fontWeight: 600 }}>
              {t('warehouseSelection')}
            </Typography>
            <Typography
              sx={{
                // fontSize: '16px',
                marginBottom: '25px',
                color: '#49516F',
              }}
            >
              {t('requiredSelectWarehouse')}
            </Typography>
            <Grid
              container
              mb={2}
              sx={{
                borderBottom: '1px solid #E1E6EF',
                paddingBottom: '15px',
              }}
            >
              <Grid xs={6}>
                <Typography
                  sx={{
                    color: '#1B1F27',
                  }}
                >
                  {t('product')}
                </Typography>
              </Grid>
              <Grid xs={2} sx={{ textAlign: 'center' }}>
                <Typography
                  sx={{
                    color: '#1B1F27',
                  }}
                >
                  {t('orderQuantity')}
                </Typography>
              </Grid>
              <Grid xs={4} sx={{ textAlign: 'end' }}>
                <Typography
                  sx={{
                    color: '#1B1F27',
                  }}
                >
                  {t('targetWarehouse')}
                </Typography>
              </Grid>
            </Grid>
            <Box
              mb={2}
              sx={{
                paddingTop: '15px',
                paddingBottom: '15px',
              }}
            >
              {stateListOrderItem?.map((item: OrderDataType, index) => {
                return (
                  <Grid
                    container
                    key={`grid-item-${index}`}
                    alignItems="center"
                    sx={{
                      border:
                        item.isSelected && stateOpenPopper === true
                          ? `1px solid ${theme.palette.primary.main}`
                          : 'none',
                      padding: '15px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                    }}
                  >
                    <Grid xs={6}>
                      <Stack direction="row" spacing={2}>
                        <div className={classes['image-wrapper']}>
                          <Link
                            href={`/supplier/inventory/product/detail/${item.id}`}
                          >
                            <a>
                              <Image
                                src={
                                  item.thumbnail
                                    ? item.thumbnail
                                    : '/' + '/images/defaultProductImage.png'
                                }
                                alt="Logo"
                                width="50"
                                height="50"
                              />
                            </a>
                          </Link>
                        </div>
                        <Stack direction="column">
                          <Typography
                            sx={{
                              // fontSize: '1px',
                              color: '#1B1F27',
                              width: '250px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {item.name}
                          </Typography>
                          <Typography
                            sx={{ fontWeight: 300, color: '#1B1F27' }}
                          >
                            #{item.code}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid xs={2} sx={{ textAlign: 'center' }}>
                      {item.quantity.toLocaleString('en-US')}{' '}
                      {item.unit_type.toLowerCase()}
                    </Grid>
                    <Grid xs={4} sx={{ textAlign: 'end' }}>
                      {item.warehouse_quantity ? (
                        <>
                          {item.warehouse_quantity.map(
                            (child_item: WarehouseWithQuantityType) => {
                              return (
                                <>
                                  <Typography>
                                    {child_item.quantity}{' '}
                                    {item.unit_type.toLowerCase()}{' '}
                                    {t('selected')}-{' '}
                                    {
                                      stateQuantityAndWarehouse?.find(
                                        (item: WarehouseAndQuantityType) =>
                                          item.warehouse.id ===
                                          child_item.warehouse
                                      )?.warehouse.name
                                    }
                                  </Typography>
                                </>
                              )
                            }
                          )}
                          {item.missing ? (
                            <>
                              <Typography sx={{ color: 'red' }}>
                                {t('notEnoughStock')}, {item.missing}{' '}
                                {stateTempOrderItem?.unit_type.toLowerCase()}{' '}
                                {t('needed')}
                              </Typography>
                              <ButtonCustom
                                sx={{ padding: '5px 0' }}
                                disabled={stateOpenPopper}
                                onClick={(
                                  e: React.MouseEvent<
                                    HTMLButtonElement,
                                    MouseEvent
                                  >
                                ) => {
                                  handleSetSelectedItem(item)
                                  handleOpenPopper(e)
                                }}
                              >
                                {t('clickTargetMoreWarehouse')}
                              </ButtonCustom>
                            </>
                          ) : (
                            <ButtonCustom
                              sx={{ padding: '5px 0' }}
                              disabled={stateOpenPopper}
                              onClick={(
                                e: React.MouseEvent<
                                  HTMLButtonElement,
                                  MouseEvent
                                >
                              ) => {
                                handleSetSelectedItem(item)
                                handleOpenPopper(e)
                              }}
                            >
                              {t('change')}
                            </ButtonCustom>
                          )}
                        </>
                      ) : (
                        <ButtonCustom
                          sx={{ padding: '5px 0' }}
                          disabled={stateOpenPopper}
                          onClick={(
                            e: React.MouseEvent<HTMLButtonElement, MouseEvent>
                          ) => {
                            handleSetSelectedItem(item)
                            handleOpenPopper(e)
                          }}
                        >
                          {t('clickSelectWarehouse')}
                        </ButtonCustom>
                      )}
                    </Grid>
                  </Grid>
                )
              })}
            </Box>

            <Stack
              spacing={2}
              direction="row"
              justifyContent="end"
              sx={{ borderTop: '1px solid #E1E6EF', paddingTop: '25px' }}
            >
              <ButtonCancel
                variant="outlined"
                size="large"
                onClick={() => setStateSidebar(false)}
              >
                {t('cancel')}
              </ButtonCancel>
              <ButtonCustom
                variant="contained"
                size="large"
                onClick={handleSubmitWarehouseSelection}
                disabled={stateListOrderItem?.some((item: OrderDataType) => {
                  return (
                    !Object.prototype.hasOwnProperty.call(
                      item,
                      'warehouse_quantity'
                    ) ||
                    (item.missing && item.missing > 0)
                  )
                })}
              >
                {t('confirm')}
              </ButtonCustom>
            </Stack>
          </Box>
        </Drawer>
      </React.Fragment>
      <BoxModalCustom>
        {stateSidebar && stateOpenPopper && (
          <Popper
            open={stateOpenPopper}
            anchorEl={anchorEl}
            placement="bottom-start"
            transition
            // modifiers={[
            //   {
            //     name: 'arrow',
            //     enabled: true,
            //   },
            // ]}

            sx={{ zIndex: 1300 }}
          >
            {({ TransitionProps }) => (
              <Fade {...TransitionProps} timeout={350}>
                <Paper
                  sx={{
                    width: '830px',
                    // height: '400px',
                    padding: '20px',
                    background: '#F8F9FC',
                  }}
                >
                  <form onSubmit={handleSubmit(onSubmitQuantityWarehouse)}>
                    <Grid
                      container
                      mb={2}
                      sx={{
                        borderBottom: '1px solid #E1E6EF',
                        paddingBottom: '20px',
                      }}
                    >
                      <Grid xs={6}>
                        <Typography
                          sx={{
                            color: '#1B1F27',
                          }}
                        >
                          {t('warehouse')}
                        </Typography>
                      </Grid>
                      <Grid xs={3}>
                        <Stack direction="row" justifyContent="center">
                          <Typography
                            sx={{
                              color: '#1B1F27',
                            }}
                          >
                            {t('availableStock')}
                          </Typography>
                          {/* <Typography
                            sx={{

                              color: '#1B1F27',
                            }}
                          >
                            {stateTempOrderItem?.quantity}
                          </Typography> */}
                        </Stack>
                      </Grid>
                      <Grid xs={3} sx={{ textAlign: 'end' }}>
                        <Stack direction="row" justifyContent="flex-end">
                          <Typography
                            sx={{
                              color: '#1B1F27',
                            }}
                          >
                            {t('selectedQuantity')}
                          </Typography>
                          {/* <Typography
                            sx={{
                              fontSize: 16,
                              color: '#1B1F27',
                            }}
                          >
                            {summary.totalMissingQuantity}
                          </Typography> */}
                        </Stack>
                      </Grid>
                      {/* <Grid xs={3} sx={{ textAlign: 'end' }}>
                        <Stack direction="row">
                          <Typography
                            sx={{
                              fontSize: 16,
                              color: '#1B1F27',
                            }}
                          >
                            Missing quantity
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: 16,
                              color: '#1B1F27',
                            }}
                          >

                            {summary.totalMissingQuantity}
                          </Typography>
                        </Stack>
                      </Grid> */}
                    </Grid>
                    <Box sx={{ maxHeight: '200px', overflow: 'scroll' }}>
                      <Controller
                        control={control}
                        name="warehouse_quantity"
                        render={() => {
                          return (
                            <>
                              {stateQuantityAndWarehouse?.map(
                                (item: WarehouseAndQuantityType, index) => {
                                  const fieldName = `warehouse_quantity.${index}`
                                  return (
                                    <Grid
                                      container
                                      key={`grid-item-${fieldName}`}
                                      alignItems="center"
                                      sx={{
                                        padding: '20px 15px',
                                        marginBottom: '5px',
                                        background: item.isChecked
                                          ? '#F1F3F9'
                                          : '',
                                      }}
                                    >
                                      <Grid xs={6}>
                                        <Stack direction="row" spacing={2}>
                                          <Checkbox
                                            disabled={
                                              (!item.isChecked &&
                                                stateDisabled) ||
                                              item.quantity === 0
                                                ? true
                                                : false
                                            }
                                            onChange={() =>
                                              handleSetCheckItem(item, index)
                                            }
                                            checked={item.isChecked}
                                          />
                                          <Stack direction="column">
                                            <Typography
                                              sx={{
                                                color: '#1B1F27',
                                                width: '250px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                              }}
                                            >
                                              {item.warehouse.name}{' '}
                                              {item.warehouse.is_default &&
                                              index === 0 ? (
                                                <Star
                                                  style={{ color: 'red' }}
                                                  size={16}
                                                />
                                              ) : (
                                                ''
                                              )}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                fontWeight: 300,
                                                color: '#1B1F27',
                                                width: '250px',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                              }}
                                            >
                                              {item.warehouse.address}
                                            </Typography>
                                          </Stack>
                                        </Stack>
                                      </Grid>
                                      <Grid
                                        xs={3}
                                        display="flex"
                                        justifyContent="center"
                                      >
                                        {item.quantity}{' '}
                                        {stateTempOrderItem?.unit_type.toLowerCase()}
                                      </Grid>
                                      <Grid xs={3} sx={{ textAlign: 'end' }}>
                                        <TextFieldCustom
                                          type="number"
                                          className={classes['input-number']}
                                          disabled={!item.isChecked}
                                          sx={{ textAlign: 'end' }}
                                          inputProps={{
                                            min: 0,
                                            max: item.quantity,
                                          }}
                                          {...register(
                                            `warehouse_quantity.${index}.quantity`
                                          )}
                                          error={
                                            errors.warehouse_quantity &&
                                            Boolean(
                                              errors.warehouse_quantity[index]
                                                ?.quantity
                                            )
                                          }
                                          onChange={(e) => {
                                            setValue(
                                              `warehouse_quantity.${index}.quantity`,
                                              e.target.value
                                            )
                                            trigger(
                                              `warehouse_quantity.${index}.quantity`
                                            )

                                            calculateTotalSelectedQuantity()
                                          }}
                                          value={watch(
                                            `warehouse_quantity.${index}.quantity`
                                          )}
                                          InputProps={{
                                            endAdornment: (
                                              <InputAdornment position="start">
                                                {stateTempOrderItem?.unit_type.toLowerCase()}
                                              </InputAdornment>
                                            ),
                                          }}
                                        />
                                        <FormHelperText
                                          error={
                                            errors.warehouse_quantity &&
                                            Boolean(
                                              errors.warehouse_quantity[index]
                                                ?.quantity
                                            )
                                          }
                                        >
                                          {errors?.warehouse_quantity &&
                                            Boolean(
                                              errors?.warehouse_quantity[index]
                                                ?.quantity
                                            ) &&
                                            `${errors.warehouse_quantity[index]?.quantity?.message}`}
                                        </FormHelperText>

                                        {Number(
                                          getValues(
                                            `warehouse_quantity.${index}.quantity`
                                          )
                                        ) > item.quantity ? (
                                          <FormHelperText error={true}>
                                            {t('quantityCanNotLargerThan')}
                                          </FormHelperText>
                                        ) : (
                                          ''
                                        )}
                                      </Grid>
                                    </Grid>
                                  )
                                }
                              )}
                            </>
                          )
                        }}
                      />
                    </Box>

                    <Grid
                      container
                      sx={{ padding: '15px 25px', background: '#F1F3F9' }}
                      mb={3}
                    >
                      <Grid xs={6}></Grid>
                      <Grid xs={3} display="flex" justifyContent="center">
                        {' '}
                        <Typography
                          sx={{
                            color: '#49516F',
                          }}
                        >
                          {t('selectedQuantity')}
                        </Typography>
                      </Grid>
                      <Grid xs={3} display="flex" justifyContent="flex-end">
                        {' '}
                        <Typography
                          sx={{
                            fontSize: 16,
                            color: '#1B1F27',
                            fontWeight: 700,
                          }}
                        >
                          {summary.totalSelectedQuantity}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Stack
                      direction="row"
                      spacing={3}
                      alignItems="center"
                      justifyContent="flex-end"
                      sx={{
                        borderTop: '1px solid #E1E6EF',
                        paddingTop: '20px',
                      }}
                    >
                      <ButtonCancel
                        variant="outlined"
                        size="large"
                        onClick={handleClosePopper}
                      >
                        {t('cancel')}
                      </ButtonCancel>
                      <ButtonCustom
                        variant="contained"
                        size="large"
                        onClick={handleAutoSelectApproveMultiWarehouse}
                      >
                        {t('autoSelect')}
                      </ButtonCustom>
                      <ButtonCustom
                        variant="contained"
                        size="large"
                        type="submit"
                      >
                        {t('confirm')}
                      </ButtonCustom>
                    </Stack>
                  </form>
                </Paper>
              </Fade>
            )}
          </Popper>
        )}
      </BoxModalCustom>

      <Dialog
        open={stateOpenDialog}
        onClose={handleCloseCancelOrderDialog}
        disableEnforceFocus
        sx={{ width: '100%', '& .MuiDialog-paper': { width: '100%' } }}
      >
        <form onSubmit={handleSubmitCancelOrder(onSubmitCancelOrder)}>
          <DialogTitleTws>
            <IconButton onClick={handleCloseCancelOrderDialog}>
              <X size={20} />
            </IconButton>
          </DialogTitleTws>

          <TypographyH2
            sx={{
              fontSize: '2.4rem',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
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
            <Grid container xs={12} mb={2}>
              <Controller
                control={controlHandlerCancelOrder}
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
                          error={!!errorsCancelOrder.reason}
                          {...field}
                        />
                        <FormHelperText error={!!errorsCancelOrder.reason}>
                          {errorsCancelOrder.reason &&
                            `${errorsCancelOrder.reason.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )
                }}
              />
            </Grid>
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
              sx={{ width: '100%' }}
            >
              {t('submit')}
            </ButtonCustom>
          </DialogActions>
        </form>
      </Dialog>
      <Dialog
        open={stateOpenDialogRefund}
        onClose={() => setStateOpenDialogRefund(false)}
      >
        <DialogTitleTws>
          <IconButton onClick={() => setStateOpenDialogRefund(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('refundOrder')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>{t('askForRefund')}</DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => setStateOpenDialogRefund(false)}
              variant="outlined"
              size="large"
            >
              {t('no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleOpenDrawerRefund}
              size="large"
            >
              {t('yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      <Drawer
        anchor="right"
        open={stateOpenDrawerRefund}
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
              {t('billingDetail')}
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
              {stateOrderDetail?.items.map((item, index) => {
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
                    <Typography>{t('subtotal')}</Typography>
                    <Typography>
                      {formatMoney(stateOrderDetail?.sub_total)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{t('discount')}</Typography>
                    <Typography>{formatMoney(0)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography>{t('tax')} (0%)</Typography>
                    <Typography>{formatMoney(0)}</Typography>
                  </Stack>
                  {/* <Stack direction="row" justifyContent="space-between">
                    <Typography>Tips (0%)</Typography>
                    <Typography>
                      {formatMoney(stateRetailOrderRetail?.data.total_tip)}
                    </Typography>
                  </Stack> */}
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '1.8rem',
                      color: '#0A0D14',
                    }}
                  >
                    {t('total')}
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 500,
                      fontSize: '1.8rem',
                      color: '#0A0D14',
                    }}
                  >
                    {formatMoney(Number(stateOrderDetail?.total_billing))}
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
                  <Typography>{t('cash')}</Typography>
                  <Typography>{formatMoney(0)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('credit')}</Typography>
                  <Typography>
                    {formatMoney(Number(stateOrderDetail?.credit))}
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
              {t('product')}
            </Typography>
            <Box sx={{ marginBottom: '15px' }}>
              {stateOrderDetail?.items.map((item, index) => {
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
                disabled
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
                  <Typography>{t('cash')}</Typography>
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
                disabled={stateOrderDetail?.credit === 0}
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
                  <Typography>{t('creditCard')}</Typography>
                </Stack>

                {stateRadioPaymentMethod === 2 && (
                  <CheckCircle
                    style={{ position: 'absolute', top: 5, right: 5 }}
                    size={16}
                  />
                )}
              </ButtonCustom>
            </Stack>
            <form onSubmit={handleSubmitRefund(onSubmitRefund)}>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={controlRefund}
                  name="reason"
                  render={({ field }) => (
                    <>
                      <Typography sx={{ fontWeight: 500, color: '#49516F' }}>
                        {t('refundReason')}
                      </Typography>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          placeholder="Enter refund reason"
                          {...field}
                          error={!!errorsRefund.reason}
                        >
                          {t('refundReason')}
                        </TextFieldCustom>
                        <FormHelperText error>
                          {errorsRefund.reason && errorsRefund.reason.message}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>

              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={controlRefund}
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
                        <div className={classes['input-number-refund']}>
                          <CurrencyNumberFormat
                            disabled={stateProductSelected.length === 0}
                            defaultPrice={
                              watchRefund('total_amount')
                                ? watchRefund('total_amount')
                                    .toFixed(2)
                                    .toString()
                                : null
                            }
                            propValue={(value) => {
                              setValueRefund('total_amount', Number(value))
                              triggerRefund('total_amount')
                            }}
                          />
                        </div>

                        <FormHelperText error>
                          {errorsRefund.total_amount &&
                            errorsRefund.total_amount.message}
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
                {t('refundDetail')}
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
                  <Typography>{t('cash')}</Typography>
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
                  disabled={stateProductSelected.length === 0}
                >
                  {t('proceedRefund')}
                </ButtonCustom>
                <ButtonCustom
                  onClick={() => handleCloseDrawer()}
                  variant="outlined"
                  size="large"
                >
                  {t('cancel')}
                </ButtonCustom>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Drawer>
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
            {t('theInvoiceWillBeSentToTheRecipientBelow')}
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
              {t('recipient')}
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ marginBottom: '10px' }}
            >
              <Avatar
                sx={{ width: 56, height: 56 }}
                alt={stateOrderDetail?.recipient.name}
                src={stateOrderDetail?.recipient.avatar}
              />
              <Typography>{stateOrderDetail?.recipient.name}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5}>
              <Typography>{t('email')}:</Typography>
              <Typography>{stateOrderDetail?.recipient.email}</Typography>
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
              {t('cancel')}
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
