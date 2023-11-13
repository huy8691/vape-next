import { NextPageWithLayout } from 'pages/_app.page'
import { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  Avatar,
  Box,
  Breadcrumbs,
  ButtonGroup,
  Checkbox,
  ClickAwayListener,
  Dialog,
  Drawer,
  Fade,
  FormHelperText,
  Grow,
  IconButton,
  InputAdornment,
  MenuItem,
  MenuList,
  Paper,
  Popover,
  Popper,
  Skeleton,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { Stack, styled } from '@mui/system'
import moment from 'moment'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CircleWavyCheck, ClockClockwise, Star, X } from '@phosphor-icons/react'
import ImageDefault from 'public/images/logo.svg'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  checkPermission,
  formatPhoneNumber,
  handlerGetErrMessage,
  KEY_MODULE,
  PERMISSION_RULE,
  platform,
} from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import {
  approveOrder,
  getPurchaseOrderDetail,
  getWarehouseAndQuantity,
  updateApprovedPurchase,
} from './purchaseApi'
import {
  OrderDataType,
  purchaseOrderTypeData,
  ValidateWarehouseType,
  WarehouseAndQuantityDataType,
  WarehouseAndQuantityType,
  WarehouseWithQuantityType,
} from './purchaseModel'
import classes from './styles.module.scss'
import { schema } from './validations'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const TypographyTotalCustom = styled(Typography)(() => ({
  fontSize: '1.8rem',
  fontWeight: '600',
  color: '#1CB25B',
}))
const TypographyCustom = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: '400',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#1B1F27',
}))
const BoxCustom = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#F8F9FC',
  border: theme.palette.mode === 'dark' ? '1px solid #E1E6EF' : 'none',
}))
const BoxModalCustom = styled(Box)(({ theme }) => ({
  width: 1000,
  borderRadius: '8px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
}))
interface Summary {
  totalSelectedQuantity: number
  totalMissingQuantity: number
}
const DetailPurchase: NextPageWithLayout = () => {
  const { t } = useTranslation('order')

  const permission = useAppSelector((state) => state.permission.data)
  // const anchorRef = React.useRef<HTMLDivElement>(null)
  const [flagUpdateStatus, setFlagUpdateStatus] = useState<string>('')
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [open, setOpen] = React.useState<boolean>(false)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [statePurchase, setStatePurchase] = useState<purchaseOrderTypeData>()
  const [stateUpdateStatus, setStateUpdateStatus] = useState<string>('')
  const [stateListOrderItem, setStateListOrderItem] =
    useState<OrderDataType[]>()

  const [stateOpenPopperForApprove, setStateOpenPopperForApprove] =
    React.useState(false)
  const [stateDisabled, setStateDisabled] = useState<boolean>(false)
  const [stateQuantityAndWarehouse, setStateQuantityAndWarehouse] = useState<
    WarehouseAndQuantityType[]
  >([])
  const [stateSummary, setStateSummary] = useState<Summary>({
    totalSelectedQuantity: 0,
    totalMissingQuantity: 0,
  })
  const [stateTempOrderItem, setStateTempOrderItem] = useState<OrderDataType>()
  const [stateSidebar, setStateSidebar] = useState(false)
  const statusCurrent = useRef<number>(0)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const submitArr: WarehouseAndQuantityDataType[] = []
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
  const [anchorElForApprove, setAnchorElforApprove] =
    React.useState<HTMLElement | null>(null)
  const optionStatus = useMemo(
    () => [
      {
        text: 'APPROVED',
        icon: <CircleWavyCheck color="#1DB46A" size={20} />,
        color: '#1DB46A',
        display: 'block',
        textDisplay: t('confirmed'),
      },
      {
        text: 'REJECTED',
        icon: (
          <span
            style={{ color: '#E02D3C' }}
            className="icon-cancelstatus-converted"
          ></span>
        ),
        color: '#E02D3C',
        display: 'block',
        textDisplay: t('rejected'),
      },
      {
        text: 'WAITING_FOR_APPROVED',
        icon: <ClockClockwise color="#49516F" size={20} />,
        color: '#49516F',
        display: 'block',
        textDisplay: t('confirmation'),
      },
    ],
    []
  )
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
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }
  // dialog
  const handleDialog = () => {
    setOpenDialog(!openDialog)
  }

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }
  const openSellerInformation = Boolean(anchorEl)
  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }
  const handleMenuItemClick = (status: string) => {
    setStateUpdateStatus(status)
    setOpen(false)
    handleDialog()
  }
  //call aip
  const handleGetPurchaseDetail = (event: any) => {
    dispatch(loadingActions.doLoading())
    getPurchaseOrderDetail(event)
      .then((res) => {
        const { data } = res.data
        setStatePurchase(data)
        const newOrderArr = data.items.map((item: OrderDataType) => {
          return {
            ...item,
            isSelected: false,
          }
        })
        setStateListOrderItem(newOrderArr)
        statusCurrent.current = optionStatus.findIndex(
          (item) => item.text === data?.status
        )
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
        if (status === 404) {
          router.push('/404')
        }
      })
  }
  useEffect(() => {
    if (router.query.id) {
      handleGetPurchaseDetail(router.query.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, dispatch, flagUpdateStatus])
  const toggleDrawer = () => {
    setOpenDialog(false)
    handleClosePopper()
    setStateSidebar((prev) => !prev)
  }
  const handleConfirmUpdateStatus = () => {
    if (stateUpdateStatus === 'APPROVED') {
      toggleDrawer()
      return
    }
    try {
      dispatch(loadingActions.doLoading())
      updateApprovedPurchase(router.query?.id as string, stateUpdateStatus)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          handleDialog()
          setFlagUpdateStatus('update status' + new Date())
          pushMessage(
            `${t('updateOrderStatus')} ${stateUpdateStatus?.toLowerCase()} ${t(
              'successfully'
            )}`,
            'success'
          )
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { data, status } = response
          pushMessage(handlerGetErrMessage(data, status), 'error')
        })
    } catch (error) {
      return
    }
  }

  const handleOpenPopper = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorElforApprove(e.currentTarget)
    setStateOpenPopperForApprove((prev) => !prev)
  }
  const handleClosePopper = () => {
    setStateOpenPopperForApprove(false)
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
        ({ purchase_order_item_id, warehouse_quantity }) => ({
          purchase_order_item: purchase_order_item_id,
          warehouse_quantity,
        })
      )
      const fakeObj: ValidateWarehouseType = {
        items: submitArr,
      }
      if (!statePurchase) return
      approveOrder(statePurchase.id, fakeObj)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('changeOrderStatusToConfirmed'), 'success')
          handleGetPurchaseDetail(router.query.id)
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
  const handleSetSelectedItem = (items: OrderDataType) => {
    console.log('items', items)
    setStateTempOrderItem(items)
    const newArr = stateListOrderItem?.map((item: OrderDataType) => {
      console.log('item', item.isSelected)
      if (item.id === items.id) return { ...item, isSelected: !item.isSelected }
      return {
        ...item,
        isSelected: false,
      }
    })
    0

    if (newArr) {
      setStateListOrderItem(newArr)
    }

    getWarehouseAndQuantity(items.id)
      .then((res) => {
        const data = res.data
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
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const calculateTotalSelectedQuantity = useCallback(() => {
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
  const summary = { ...stateSummary }
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
        purchase_order_item: stateTempOrderItem.purchase_order_item_id,
        warehouse_quantity: newArr,
      })
      const cloneArr = stateListOrderItem?.map((item: OrderDataType) => {
        if (
          item.purchase_order_item_id ===
          stateTempOrderItem.purchase_order_item_id
        ) {
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

  // const handleAutoSelect = () => {
  //   if (!stateQuantityAndWarehouse || !stateTempOrderItem) return
  //   stateQuantityAndWarehouse.every((item: WarehouseAndQuantityType, index) => {
  //     if (summary.totalMissingQuantity === 0) {
  //       return false
  //     }
  //     if (item.quantity === 0) return true
  //     if (item.isChecked) return true
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
  return (
    <>
      <Head>
        <title>{t('title')} | VAPE</title>
      </Head>
      <Stack direction="row" alignItems="center" spacing={4} mb={'5px'}>
        {statePurchase ? (
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
        {statePurchase ? (
          <>
            <ButtonGroup variant="outlined" ref={anchorRef}>
              <ButtonCustom
                sx={{
                  backgroundColor: `${
                    optionStatus[statusCurrent.current].color
                  }`,
                  color: 'white',
                  textTransform: 'capitalize',
                  borderRadius: '32px',
                  padding: '10px 15px 10px 14px',
                  '&:hover': {
                    backgroundColor: `${
                      optionStatus[statusCurrent.current].color
                    }`,
                  },
                }}
                startIcon={
                  <BoxIconCustom>
                    {optionStatus[statusCurrent.current].icon}
                  </BoxIconCustom>
                }
                variant="contained"
                onClick={() => {
                  if (
                    checkPermission(
                      permission,
                      KEY_MODULE.PurchaseOrder,
                      PERMISSION_RULE.ApproveReject
                    )
                  ) {
                    handleToggle()
                  }
                }}
              >
                <Typography sx={{ fontWeight: '600' }}>
                  {optionStatus[statusCurrent.current].textDisplay}
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
                        {optionStatus[statusCurrent.current].text ===
                          'WAITING FOR APPROVED' &&
                          optionStatus
                            .filter(
                              (item) => item?.text !== 'WAITING FOR APPROVED'
                            )
                            .map((item) => (
                              <MenuItem key={item.text}>
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
                                  onClick={() => {
                                    handleToggle()
                                    handleMenuItemClick(item.text)
                                  }}
                                >
                                  <Typography sx={{ fontWeight: '600' }}>
                                    {item.textDisplay}
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
      </Stack>
      <Box sx={{ marginBottom: '15px' }}>
        {statePurchase ? (
          <Breadcrumbs separator=">" aria-label="breadcrumb">
            <Typography>
              <Link
                href={`/${platform().toLowerCase()}/market-place/field-sales-orders/list`}
              >
                {t('fieldSaleOrder')}
              </Link>
            </Typography>
            <Typography>
              {t('title')} #{statePurchase?.code}
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
      </Box>

      <Grid container sx={{ marginBottom: '15px' }} spacing={3}>
        <Grid xs={6} alignItems="flex-start">
          <TypographySectionTitle>{t('title')}</TypographySectionTitle>
          {statePurchase ? (
            <BoxCustom
              sx={{
                padding: '15px',
                borderRadius: '10px',
                height: '199px',
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('orderNo')}</Typography>
                  <Typography>#{statePurchase?.code}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('orderStatus')}</Typography>
                  <Box>
                    <Typography sx={{ textTransform: 'capitalize' }}>
                      {statePurchase?.status === 'WAITING FOR APPROVED' &&
                        t('confirmation')}
                      {statePurchase?.status === 'REJECTED' && t('rejected')}
                      {statePurchase?.status === 'APPROVED' && t('confirmed')}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('orderDate')}</Typography>
                  <Typography>
                    {moment(statePurchase?.order_date).format(
                      'MM/DD/YYYY - hh:mm A'
                    )}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('sellerName')}</Typography>
                  <Typography
                    aria-owns={
                      openSellerInformation ? 'mouse-over-popover' : undefined
                    }
                    aria-haspopup="true"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                  >
                    {statePurchase?.seller.name}
                  </Typography>
                </Stack>
              </Stack>
            </BoxCustom>
          ) : (
            <Skeleton variant="rounded" width="100%" height={140} />
          )}
        </Grid>
        <Grid xs={6} alignItems="flex-end">
          <TypographySectionTitle>{t('leadInfo')}</TypographySectionTitle>
          {statePurchase ? (
            <BoxCustom
              sx={{
                padding: '15px',
                borderRadius: '10px',
                // height: '100%',
              }}
            >
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                >
                  <Typography sx={{ fontSize: '14px' }}>
                    {t('businessName')}
                  </Typography>
                  <Typography sx={{ fontSize: '14px' }}>
                    {statePurchase?.contact?.business_name}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '14px' }}>
                    {t('federalTaxId')}
                  </Typography>
                  <Typography sx={{ fontSize: '14px' }}>
                    {statePurchase?.contact?.federal_tax_id}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography sx={{ fontSize: '14px' }}>
                    {t('phoneNumber')}
                  </Typography>
                  <Typography sx={{ fontSize: '14px' }}>
                    {formatPhoneNumber(statePurchase?.contact?.phone_number)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('fullName')}</Typography>
                  <Typography>
                    {statePurchase?.contact?.first_name}{' '}
                    {statePurchase?.contact?.last_name}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('address')}</Typography>
                  <Typography>{statePurchase?.contact?.address}</Typography>
                </Stack>
              </Stack>
            </BoxCustom>
          ) : (
            <Skeleton variant="rounded" width="100%" height={400} />
          )}
        </Grid>
      </Grid>
      {statePurchase && statePurchase?.items.length > 0 && (
        <>
          <TypographySectionTitle sx={{ marginBottom: '10px' }}>
            {t('products')}
          </TypographySectionTitle>
          {statePurchase ? (
            <TableContainerTws sx={{ marginTop: '0px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellTws>{t('product')}</TableCellTws>
                    <TableCellTws>{t('quantity')}</TableCellTws>
                    <TableCellTws>{t('price')}</TableCellTws>
                    <TableCellTws align="right">{t('amount')}</TableCellTws>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statePurchase.items.map((item, index: number) => {
                    return (
                      <TableRowTws key={`item-${index}`}>
                        <TableCellTws>
                          <Stack direction="row" alignItems="center">
                            <div className={classes['image-wrapper']}>
                              <Link
                                href={`/${platform().toLowerCase()}/inventory/product/detail/${
                                  item.id
                                }`}
                              >
                                <a>
                                  <Image
                                    alt="product-image"
                                    src={item.thumbnail || ImageDefault}
                                    width={60}
                                    height={60}
                                  />
                                </a>
                              </Link>
                            </div>
                            <Link
                              href={`/${platform().toLowerCase()}/inventory/product/detail/${
                                item.id
                              }`}
                            >
                              <a>
                                <Stack padding={2}>
                                  <TypographyCustom>
                                    {item.name}
                                  </TypographyCustom>
                                  <TypographyCustom
                                    sx={{ fontSize: '14px', fontWeight: '300' }}
                                  >
                                    #{item.code}
                                  </TypographyCustom>
                                  <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="center"
                                  >
                                    {item.attribute_options?.map(
                                      (element, index) => {
                                        return (
                                          <Stack
                                            direction="row"
                                            spacing={1}
                                            key={index}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: '1.2rem',
                                                color: '#1B1F27',
                                                fontWeight: 700,
                                              }}
                                            >
                                              {element.attribute}
                                            </Typography>
                                            <Typography
                                              sx={{
                                                fontSize: '1.2rem',
                                                color: '#1B1F27',
                                                fontWeight: 300,
                                              }}
                                            >
                                              {element.option}
                                            </Typography>
                                          </Stack>
                                        )
                                      }
                                    )}
                                  </Stack>
                                </Stack>
                              </a>
                            </Link>
                          </Stack>
                        </TableCellTws>
                        <TableCellTws sx={{ textTransform: 'lowercase' }}>
                          {item.quantity} {item.unit_type}
                        </TableCellTws>
                        <TableCellTws>
                          <Typography
                            sx={{
                              fontWeight: 'bold',
                              textTransform: 'lowercase',
                            }}
                          >
                            {formatMoney(item.unit_price)}
                            <span
                              style={{ fontWeight: '400', fontSize: '12px' }}
                            >
                              {''} / {item.unit_type}
                            </span>
                          </Typography>
                        </TableCellTws>
                        <TableCellTws width={100} align="right">
                          <TypographyTotalCustom
                            sx={{ fontWeight: 'bold', fontSize: '16px' }}
                          >
                            {formatMoney(item.total)}
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
        </>
      )}

      {statePurchase?.other_products &&
        statePurchase?.other_products.length > 0 && (
          <>
            <TypographySectionTitle sx={{ marginBottom: '10px' }}>
              {t('otherProduct')}
            </TypographySectionTitle>
            <TableContainerTws sx={{ marginTop: '0 !important' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellTws>{t('product')}</TableCellTws>
                    <TableCellTws>{t('quantity')}</TableCellTws>
                    <TableCellTws>{t('price')}</TableCellTws>
                    <TableCellTws align="right">{t('amount')}</TableCellTws>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {statePurchase.other_products.map((item, index) => {
                    return (
                      <TableRowTws key={index}>
                        <TableCellTws>{item.product_name}</TableCellTws>
                        <TableCellTws sx={{ textTransform: 'lowercase' }}>
                          {item.quantity} {item.unit}
                        </TableCellTws>
                        <TableCellTws>
                          <Typography
                            sx={{
                              fontWeight: 'bold',
                              textTransform: 'lowercase',
                            }}
                          >
                            {formatMoney(item.price)}
                            <span
                              style={{ fontWeight: '400', fontSize: '12px' }}
                            >
                              {''} / {item.unit}
                            </span>
                          </Typography>
                        </TableCellTws>
                        <TableCellTws width={100} align="right">
                          <TypographyTotalCustom
                            sx={{ fontWeight: 'bold', fontSize: '16px' }}
                          >
                            {formatMoney(item.total)}
                          </TypographyTotalCustom>
                        </TableCellTws>
                      </TableRowTws>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainerTws>
          </>
        )}
      <Grid container spacing={2} sx={{ marginBottom: '15px' }}>
        <Grid xs={6} alignItems="flex-end">
          <TypographySectionTitle>
            {t('shippingAddress')}
          </TypographySectionTitle>
          {statePurchase ? (
            <BoxCustom
              sx={{
                padding: '15px',
                borderRadius: '10px',
                height: '131px',
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={1}>
                  <Typography sx={{ color: '#49516F' }}>
                    {t('recipientName')}:{' '}
                  </Typography>
                  <Typography sx={{ color: '#1B1F27' }}>
                    {statePurchase?.recipient_name
                      ? statePurchase?.recipient_name
                      : 'N/A'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography sx={{ color: '#49516F' }}>
                    {t('phoneNumber')}:{' '}
                  </Typography>
                  <Typography sx={{ color: '#1B1F27' }}>
                    {statePurchase?.phone_number
                      ? formatPhoneNumber(statePurchase?.phone_number)
                      : 'N/A'}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography sx={{ color: '#49516F' }}>
                    {t('address')}:
                  </Typography>
                  <Typography sx={{ color: '#1B1F27' }}>
                    {statePurchase?.address ? statePurchase?.address : 'N/A'}
                  </Typography>
                </Stack>
              </Stack>
            </BoxCustom>
          ) : (
            <Skeleton variant="rounded" width="100%" height={100} />
          )}
        </Grid>
        <Grid xs={6} alignItems="flex-start">
          <TypographySectionTitle sx={{ marginBottom: '10px' }}>
            {t('paymentDetail')}
          </TypographySectionTitle>
          {statePurchase ? (
            <BoxCustom
              sx={{
                padding: '15px',
                borderRadius: '10px',
                // height: '100%',
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
                    {formatMoney(statePurchase?.sub_total)}
                  </TypographyCustom>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom sx={{ fontSize: '14px' }}>
                    {t('totalShipping')}
                  </TypographyCustom>
                  {statePurchase?.delivery_fee === '0' ? (
                    <TypographyCustom sx={{ fontSize: '14px' }}>
                      {t('free')}
                    </TypographyCustom>
                  ) : (
                    <TypographyCustom sx={{ fontSize: '14px' }}>
                      {formatMoney(statePurchase?.delivery_fee)}
                    </TypographyCustom>
                  )}
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyTotalCustom>{t('total')}</TypographyTotalCustom>
                  <TypographyTotalCustom>
                    {formatMoney(statePurchase?.total_billing)}
                  </TypographyTotalCustom>
                </Stack>
              </Stack>
            </BoxCustom>
          ) : (
            <Skeleton variant="rounded" width="100%" height={120} />
          )}
        </Grid>
      </Grid>
      <TypographySectionTitle>{t('shippingMethod')}</TypographySectionTitle>
      {statePurchase ? (
        <BoxCustom
          sx={{
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '25px',
          }}
        >
          {statePurchase.shipping_method === null ||
          statePurchase.shipping_method?.name == '' ? (
            <Typography>{t('nothingNoted')}</Typography>
          ) : (
            <Typography>{statePurchase?.shipping_method?.name}</Typography>
          )}
        </BoxCustom>
      ) : (
        <Skeleton variant="rounded" width="100%" height={50} />
      )}
      <TypographySectionTitle>{t('paymentMethod')}</TypographySectionTitle>
      {statePurchase ? (
        <BoxCustom
          sx={{
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '25px',
          }}
        >
          {statePurchase.payment_method === null ||
          statePurchase.payment_method.name == '' ? (
            <Typography>{t('nothingNoted')}</Typography>
          ) : (
            <Typography>{statePurchase?.payment_method.name}</Typography>
          )}
        </BoxCustom>
      ) : (
        <Skeleton variant="rounded" width="100%" height={50} />
      )}
      <TypographySectionTitle>{t('noteForSupplier')}</TypographySectionTitle>
      {statePurchase ? (
        <BoxCustom
          sx={{
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '25px',
          }}
        >
          {statePurchase.notes === null || statePurchase.notes == '' ? (
            <Typography>{t('nothingNoted')}</Typography>
          ) : (
            <Typography>{statePurchase?.notes}</Typography>
          )}
        </BoxCustom>
      ) : (
        <Skeleton variant="rounded" width="100%" height={50} />
      )}

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
              sx={{ borderBottom: '1px solid #E1E6EF', paddingBottom: '15px' }}
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
                        item.isSelected && stateOpenPopperForApprove === true
                          ? '1px solid #1DB46A'
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
                                src={item.thumbnail}
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
                      {item.unit_type ? item.unit_type.toLowerCase() : 'N/A'}
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
                                disabled={stateOpenPopperForApprove}
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
                              disabled={stateOpenPopperForApprove}
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
                          disabled={stateOpenPopperForApprove}
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
        {stateSidebar && stateOpenPopperForApprove && (
          <Popper
            open={stateOpenPopperForApprove}
            anchorEl={anchorElForApprove}
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
                                              item.quantity === 0 ||
                                              (!item.isChecked && stateDisabled)
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
                                            {t('quantityCanNotLargerThan')}{' '}
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

      <Dialog open={openDialog} onClose={handleDialog}>
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
              {' '}
              {stateUpdateStatus === 'REJECTED' && 'Rejected'}
              {stateUpdateStatus === 'APPROVED' && 'Confirmed'}
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
              {t('cancel')}
            </ButtonCancel>
            <ButtonCustom
              onClick={handleConfirmUpdateStatus}
              variant="contained"
              size="large"
            >
              {t('confirm')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>

      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={openSellerInformation}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Stack p="15px" spacing="15px" direction="column" borderRadius="10px">
          <Typography fontSize="1.6rem" color="#49516F">
            {t('sellerAccount')}
          </Typography>
          <Stack spacing="15px" direction="row">
            <Avatar
              alt={statePurchase?.seller.name}
              src={statePurchase?.seller.avatar}
              sx={{ width: 90, height: 90, border: '1px solid #53D1B6' }}
            />
            <Stack spacing="12px" direction="column">
              <Typography fontSize="1.6rem">
                {statePurchase?.seller.name}
              </Typography>
              <Typography color="#49516F">
                {statePurchase?.seller.email}
              </Typography>
              <Typography color="#49516F">
                {statePurchase?.seller.phone_number
                  ? formatPhoneNumber(statePurchase?.seller.phone_number)
                  : 'N/A'}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Popover>
    </>
  )
}

DetailPurchase.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
DetailPurchase.permissionPage = {
  key_module: KEY_MODULE.PurchaseOrder,
  permission_rule: PERMISSION_RULE.ViewDetails,
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
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'order',
        'field-sales-orders',
      ])),
    },
  }
}
export default DetailPurchase
