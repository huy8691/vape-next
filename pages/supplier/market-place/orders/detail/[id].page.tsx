import {
  Avatar,
  Box,
  Breadcrumbs,
  ButtonGroup,
  // InputAdornment,
  Checkbox,
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
  CheckCircle,
  CircleWavyCheck,
  ClockClockwise,
  CurrencyDollar,
  Star,
  Truck,
  X,
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
  sendInvoiceToEmail,
  updateOrderDetail,
  updatePaymentDetail,
} from './apiOrderDetail'
import {
  CancelOrderType,
  OrderDataType,
  OrderDetailType,
  OrderStatusType,
  ValidateWarehouseType,
  WarehouseAndQuantityDataType,
  WarehouseAndQuantityType,
  WarehouseWithQuantityType,
} from './modelOrderDetail'
import classes from './styles.module.scss'

// other
import { yupResolver } from '@hookform/resolvers/yup'
import Grid from '@mui/material/Unstable_Grid2'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import Head from 'next/head'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  KEY_MODULE,
  PERMISSION_RULE,
  checkPermission,
  handlerGetErrMessage,
  truncateToTwoDecimalPlaces,
} from 'src/utils/global.utils'
import { schema, schemaCancelOrder } from './validations'

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
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const [stateOpenSendInvoiceDrawer, setStateOpenSendInvoiceDrawer] =
    useState(false)
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
  const [stateInvoiceUrl, setStateInvoiceUrl] = useState('')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const submitArr: WarehouseAndQuantityDataType[] = []
  const currentDate = new Date()
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
            `${t('changeOrderStatus')} ${optionStatus[selectedIndex].text} ${t(
              'successfully'
            )}.`,
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
      pushMessage(t('pleaseCheckAgain'), 'error')
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
            'Order status has been changed to Confirmed successfully.',
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
    resolver: yupResolver(schema),
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
    resolver: yupResolver(schemaCancelOrder),
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
          )}.`,
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
      `Adjust quantity for  ${stateTempOrderItem?.name} successfully`,
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
  const checkIsShippingStatus = () => {
    if (!stateOrderDetail) return false
    if (
      stateOrderDetail.status === 'READY_FOR_SHIPPING' ||
      stateOrderDetail.status === 'DELIVERING' ||
      stateOrderDetail.status === 'DELIVERED'
    )
      return true
  }
  // const handleAutoSelect = () => {
  //   // check if there are no state warehouse & quantity
  //   if (!stateQuantityAndWarehouse || !stateTempOrderItem) return
  //   // loop through the warehouse

  //   stateQuantityAndWarehouse.every((item: WarehouseAndQuantityType, index) => {
  //     // check if quantity is fullfill -> break loop
  //     if (summary.totalMissingQuantity === 0) {
  //       return false
  //     }
  //     if (item.quantity === 0) return true
  //     /* TODO if item is check -> have case :
  //     + current item selected quantity <= totalMissing quantity -> return true
  //     + current item selected quantity > totalMissing quantitty
  //     */
  //     if (item.isChecked && summary.totalMissingQuantity > 0) {
  //       summary.totalMissingQuantity += Number(
  //         getValues(`warehouse_quantity.${index}.quantity`)
  //       )
  //       setValue(`warehouse_quantity.${index}.quantity`, 0)
  //     }
  //     item.isChecked = true
  //     console.log('item.warehouse.name', item.warehouse.name)
  //     console.log('item.warehouse.id', item.warehouse.id)
  //     console.log(index)
  //     if (item.quantity <= summary.totalMissingQuantity) {
  //       setValue(`warehouse_quantity.${index}.quantity`, item.quantity)
  //       setValue(`warehouse_quantity.${index}.warehouse`, item.warehouse.id)
  //       calculateTotalSelectedQuantity()
  //       summary.totalMissingQuantity -= item.quantity
  //       return true
  //     } else {
  //       // setValue(
  //       //   `warehouse_quantity.${index}.quantity`,
  //       //   stateSummary.totalMissingQuantity
  //       // )
  //       setValue(
  //         `warehouse_quantity.${index}.quantity`,
  //         summary.totalMissingQuantity
  //       )
  //       setValue(`warehouse_quantity.${index}.warehouse`, item.warehouse.id)
  //       summary.totalMissingQuantity -= 0
  //       // setValue(`warehouse_quantity.${index}.warehouse`, item.warehouse.id)
  //       calculateTotalSelectedQuantity()
  //     }
  //   })
  // }

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
          Send Invoice
        </ButtonCustom>
      </Stack>
      {stateOrderDetail ? (
        <Breadcrumbs
          separator=">"
          aria-label="breadcrumb"
          sx={{ marginBottom: '15px' }}
        >
          <Link href="/supplier/market-place/orders/list">
            <a>{t('orderManagement')}</a>
          </Link>
          <Link
            href={`/supplier/market-place/orders/detail/${stateOrderDetail.id}`}
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
        <Grid xs={8} alignItems="flex-start">
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
            <TypographySectionTitle sx={{ marginBottom: 0 }}>
              {t('products')}
            </TypographySectionTitle>

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
                                stateOrderDetail.shipping_information
                                  .delivery_fee
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
                            stateOrderDetail.shipping_information
                              .shipping_address.city
                          }
                          {/* {stateOrderDetail?.shipping_address.} */}
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography>Postal code</Typography>
                        <Typography sx={{ fontWeight: 500 }}>
                          {
                            stateOrderDetail.shipping_information
                              .shipping_address.postal_zipcode
                          }
                          {/* {stateOrderDetail?.shipping_address.} */}
                        </Typography>
                      </Stack>
                    </Stack>
                  </BoxCustom>
                </Box>
              )}
          </Box>
        </Grid>
        <Grid xs={4} alignItems="flex-end">
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
              <Stack direction="row" justifyContent="space-between">
                <Typography>Loyalty Discount</Typography>
                <Typography sx={{ fontWeight: 500 }}>
                  {formatMoney(
                    Number(stateOrderDetail?.loyalty_discount_price)
                  )}
                </Typography>
              </Stack>
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
                            )
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
      </BoxCustom> */}
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
            {t('confirmUpdateOrderStatus')}{' '}
            <span style={{ textTransform: 'capitalize' }}>
              {optionStatus[selectedIndex].text.toLocaleLowerCase()}
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
            {t('confirmUpdateOrderStatus')} ?
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
                                    {t('selected')} -{' '}
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
                        {t('submit')}
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
              Send Invoice
            </Typography>
          </Stack>
          <Typography sx={{ marginBottom: '15px' }}>
            The invoice will be sent to the recipient below.
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
            <Typography sx={{ marginBottom: '10px' }}>RECIPIENT</Typography>
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
              <Typography>Email:</Typography>
              <Typography>{stateOrderDetail?.recipient.email}</Typography>
            </Stack>
            <a
              rel="noopener noreferrer"
              target="_blank"
              style={{ color: '#2F6FED', textDecoration: 'underline' }}
              href={stateInvoiceUrl}
            >
              Preview the invoice PDF
            </a>
          </Box>
          <Stack direction="row" spacing={1}>
            <ButtonCancel
              size="large"
              onClick={() => setStateOpenSendInvoiceDrawer(false)}
            >
              Cancel
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              size="large"
              onClick={handleSendInvoiceViaEmail}
            >
              Send
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
