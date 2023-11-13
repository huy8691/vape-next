import { yupResolver } from '@hookform/resolvers/yup'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Badge,
  Box,
  Breadcrumbs,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Skeleton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { useTheme } from '@mui/material/styles'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import moment from 'moment'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  ArrowRight,
  CurrencyCircleDollar,
  Equalizer,
  FunnelSimple,
  Gear,
  PaperclipHorizontal,
  PencilSimple,
  ShoppingBag,
  WarningCircle,
} from '@phosphor-icons/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
  ButtonCancel,
  ButtonCustom,
  InfiniteScrollSelectMultiple,
  InputLabelCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldCustom,
  TypographyH2,
  TypographySectionTitle,
  TypographyTitlePage,
} from 'src/components'
import CurrencyNumberFormat from 'src/components/CurrencyNumberFormat'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  KEY_MODULE,
  PERMISSION_RULE,
  checkPermission,
  handlerGetErrMessage,
  isEmptyObject,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import { hasSpecialCharacterPrice } from '../list'
import {
  addToCart,
  adjustInstock,
  configLowStockAlertLevel,
  getDetailVariant,
  getQuantityOfProductVariant,
  getTransaction,
  getWarehouseforFilter,
  setRetailPrice,
} from './apiVariantDetail'
import {
  AddMultiVariantToCartType,
  AdjustInstockType,
  ArrayAddMultiVariantToCartType,
  LowStockDataType,
  QuantityOfProductVariantType,
  ReasonType,
  RetailPriceDataType,
  StockTransactionResponseType,
  StockTransactionType,
  SubmitDistributionChannelType,
  VariantDetailType,
  WarehouseListDataResponseType,
} from './modelProductDetail'
import classes from './styles.module.scss'
import {
  retailSchema,
  schemaFilter,
  schemaListDC,
  schemaLowStock,
  schemaUpdateInstock,
} from './validations'
import { useTranslation } from 'react-i18next'
import { cartActions } from 'src/store/cart/cartSlice'

const SwitchStyles = styled(Switch)(({ theme }) => ({
  width: 98,
  height: 31,
  borderRadius: '24px',
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(65px)',
      color: '#fff',

      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#E1E6EF' : '#1DB46A',
        opacity: 1,
        border: 0,
        '&:before': {
          opacity: 1,
        },
        '&:after': {
          opacity: 0,
        },
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 25,
    height: 25,
    transform: 'translate(2px ,1px)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E1E6EF' : '#1DB46A',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    '&:before, &:after': {
      display: 'inline-block',
      position: 'absolute',
      top: '50%',
      width: '50%',
      transform: 'translateY(-50%)',
      color: '#fff',
      textAlign: 'center',
    },
    '&:before': {
      content: '"Enabled"',
      left: 10,
      opacity: 0,
      fontWeight: 400,
      fontSize: '1.2rem',
    },
    '&:after': {
      content: '"Disabled"',
      right: 20,
      fontWeight: 400,
      fontSize: '1.2rem',
    },
  },
}))

const TypographyCustom = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))
const TypographyInformation = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: '500',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#1B1F27',
}))
const CustomBox = styled(Box)(({ theme }) => ({
  // background: '#F8F9FC',
  padding: '15px',
  borderRadius: '5px',
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
}))
const CustomStack = styled(Stack)(({ theme }) => ({
  // background: '#F8F9FC',
  padding: '15px',
  borderRadius: '5px',
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
}))
const CustomBoxDrawer = styled(Box)(() => ({
  width: '550px',
  background: '#FFF',
  borderRadius: '10px',
  padding: '30px',
}))
const TypographyHeading = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))

const VariantDetailComponent = () => {
  const { t } = useTranslation('product')
  const theme = useTheme()
  const reasonFilter = useMemo(
    () => [
      {
        id: 1,
        name: t('details.sold'),
      },
      {
        id: 2,
        name: t('details.restocked'),
      },
      {
        id: 3,
        name: t('details.returned'),
      },
      {
        id: 4,
        name: t('details.bought'),
      },
      {
        id: 5,
        name: t('details.other'),
      },
    ],
    [t]
  )
  const [stateVariantDetail, setStateVariantDetail] =
    useState<VariantDetailType>()
  const [stateOpenDrawerRetail, setStateOpenDrawerRetail] = useState(false)
  const [stateOpenDrawerLSAL, setStateOpenDrawerLSAL] = useState(false)
  const [stateOpenDrawerAdjustStock, setStateOpenDrawerAdjustStock] =
    useState(false)
  // state use for adjust stock
  const [stateErrorQuantity, setStateErrorQuantity] = useState<number>(0)
  const [stateDisableModal, setStateDisableModal] = useState(false)

  const [stateCurrentReason, setStateCurrentReason] = useState<ReasonType[]>()

  const [stateDisableQuantity, setStateDisableQuantity] = useState(true)
  const [stateQuantityInWarehouse, setStateQuantityInWarehouse] =
    useState<QuantityOfProductVariantType>()
  const [stateRerender, setStateRerender] = useState(false)
  const [stateTransaction, setStateTransaction] =
    useState<StockTransactionResponseType>()
  const [stateFilter, setStateFilter] = useState<number>(0)

  const [stateListWarehouse, setStateListWarehouse] =
    useState<WarehouseListDataResponseType>({
      data: [],
    })
  const [stateDrawerFilterStock, setStateDrawerFilterStock] = useState(false)
  const [stateDrawerSelectDistribution, setStateDrawerSelectDistribution] =
    useState(false)
  const handleOpenMenuFilter = () => {
    setStateDrawerFilterStock(true)
    handleGetListWarehouse('')
  }

  const handleGetListWarehouse = (value: string | null) => {
    getWarehouseforFilter(1, { name: value ? value : null })
      .then((res) => {
        const data = res.data

        setStateListWarehouse(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const optionReason = useMemo(
    () => [
      {
        id: 1,
        data: [
          {
            id: 1,
            name: t('details.restocked'),
            key: 'RESTOCKED',
          },
          {
            id: 2,
            name: t('details.returned'),
            key: 'RETURNED',
          },
          {
            id: 3,
            name: t('details.bought'),
            key: 'BOUGHT',
          },
          {
            id: 4,
            name: t('details.other'),
            key: 'OTHER',
          },
        ],
      },
      {
        id: 2,
        data: [
          {
            id: 1,
            name: t('details.sold'),
            key: 'SOLD',
          },
          {
            id: 2,
            name: t('details.damaged'),
            key: 'DAMAGED',
          },
          {
            id: 3,
            name: t('details.outOfDate'),
            key: 'OUT_OF_DATE',
          },
          {
            id: 4,
            name: t('details.adjustment'),
            key: 'ADJUSTMENT',
          },
          {
            id: 5,
            name: t('details.other'),
            key: 'OTHER',
          },
        ],
      },
    ],
    [t]
  )
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const handleGetVariantDetail = () => {
    dispatch(loadingActions.doLoading())
    getDetailVariant(Number(router.query.id))
      .then((res) => {
        const { data } = res.data
        setStateVariantDetail(data)

        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  const handleStockTransaction = (query: any) => {
    getTransaction(Number(router.query.id), query)
      .then((res) => {
        const { data } = res
        setStateTransaction(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  useEffect(() => {
    if (router.query.id) {
      handleGetVariantDetail()
      handleStockTransaction({})
    }
  }, [router.query.id])
  useEffect(() => {
    if (router.query.id) {
      const dataHolding = {
        from_date: '',
        to_date: '',
        warehouse: '',
        reason: '',
      }
      let count = 0
      for (const i in router.query) {
        // eslint-disable-next-line no-prototype-builtins
        if (dataHolding.hasOwnProperty(i)) {
          // ;(DataHolding as any)[i] = router.query[i]
          count++
        }
      }
      setValueFilter('from_date', router?.query?.from_date)
      setValueFilter('to_date', router?.query?.to_date)
      if (
        router?.query?.warehouse &&
        typeof router?.query?.warehouse === 'string'
      ) {
        setValueFilter('warehouse', router?.query?.warehouse.split(','))
      }

      if (router?.query?.reason && typeof router?.query?.reason === 'string') {
        setValueFilter('reason', router?.query?.reason.split(','))
      }
      setStateFilter(count)

      if (router.asPath.length !== router.pathname.length) {
        if (!isEmptyObject(router.query)) {
          handleStockTransaction(router.query)
        }
      } else {
        handleStockTransaction({})
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, dispatch])
  const handleGetCurrentWarehouseQuantity = (index: number) => {
    console.log('index from onchange', index)
    dispatch(loadingActions.doLoading())
    getQuantityOfProductVariant(index, Number(router.query.id))
      .then((res) => {
        const { data } = res.data
        setStateQuantityInWarehouse(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const {
    handleSubmit: handleSubmitFilter,
    control: controlFilter,
    setValue: setValueFilter,
    getValues: getValuesFilter,
    reset: resetFilter,
    clearErrors: clearErrorsFilter,
    formState: { errors: errorsFilter },
  } = useForm({
    resolver: yupResolver(schemaFilter(t)),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitSelectDC,
    control: controlSelectDC,

    reset: resetValueDC,
    clearErrors: clearErrorsDC,
    formState: { errors: errorsDC },
  } = useForm<SubmitDistributionChannelType>({
    resolver: yupResolver(schemaListDC(t)),
    mode: 'all',
  })
  const handleReset = () => {
    resetFilter({
      warehouse: [],
      reason: [],
      from_date: null,
      to_date: null,
    })
    setStateFilter(0)

    router.replace(
      {
        search: `${objToStringParam({
          id: router.query.id,
          warehouse: '',
          from_date: '',
          to_date: '',
          reason: '',
          page: 1,
          limit: router.query.limit,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }
  const {
    handleSubmit: handleSubmitRetail,
    control: controlRetail,
    setValue: setValueRetail,
    formState: { errors: errorsRetail },
    trigger: triggerRetail,
    clearErrors: clearErrorsRetail,
  } = useForm<RetailPriceDataType>({
    resolver: yupResolver(retailSchema(t)),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitConfigLowStockAlertLevel,
    control: controlLowStockLevel,
    clearErrors: clearErrorsLowStockAlertLevel,
    setValue: setValueLowStockAlertLevel,
    formState: { errors: errorLowStockAlertLevel },
  } = useForm<LowStockDataType>({
    resolver: yupResolver(schemaLowStock(t)),
    mode: 'all',
  })
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<AdjustInstockType>({
    resolver: yupResolver(schemaUpdateInstock(t)),
    mode: 'all',
  })
  const onSubmitRetail = (value: RetailPriceDataType) => {
    setRetailPrice(Number(router.query.id), value)
      .then(() => {
        handleCloseDrawerRetail()
        handleGetVariantDetail()
        pushMessage(t('details.setRetailPriceSuccessfully'), 'success')
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleOpenDrawerRetail = () => {
    setStateOpenDrawerRetail(true)
    setValueRetail(
      'retail_price',
      stateVariantDetail?.retail_information.retail_price
        ? stateVariantDetail?.retail_information.retail_price
        : 0
    )
  }
  const onSubmitFilter = (values: any) => {
    console.log('type', values.brand)

    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          warehouse: values.warehouse.toString(),
          reason: values.reason.toString(),
          from_date: values.from_date,
          to_date: values.to_date,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }
  const handleCloseDrawerRetail = () => {
    setStateOpenDrawerRetail(false)
    clearErrorsRetail()
  }
  const handleOpenDrawerLSAL = () => {
    setStateOpenDrawerLSAL(true)
    setValueLowStockAlertLevel(
      'low_stock_alert_level',
      stateVariantDetail?.low_stock_level.toString()
        ? stateVariantDetail.low_stock_level.toString()
        : '0'
    )
    setValueLowStockAlertLevel(
      'low_stock_notification_to_supplier',
      stateVariantDetail?.retail_information.low_stock_notification_to_supplier
        ? stateVariantDetail.retail_information
            .low_stock_notification_to_supplier
        : false
    )
  }
  const handleCloseDrawerLSAL = () => {
    setStateOpenDrawerLSAL(false)
    clearErrorsLowStockAlertLevel()
  }

  {
    const handleCloseDrawerAdjustStock = () => {
      setStateOpenDrawerAdjustStock(false)
      reset()
      setStateQuantityInWarehouse(undefined)

      setStateDisableModal(false)
      setStateDisableQuantity(true)
    }

    const onSubmitLowStockLevel = (value: LowStockDataType) => {
      console.log('value from low stock level', value)
      if (!router.query.id) return
      const lowStockLevel = {
        low_stock_alert_level: Number(
          value.low_stock_alert_level.replaceAll(',', '')
        ),
        low_stock_notification_to_supplier:
          value.low_stock_notification_to_supplier,
      }
      configLowStockAlertLevel(Number(router.query.id), lowStockLevel)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          // detailOrder()
          pushMessage(
            t('details.productLowStockAlertLevelHasBeenUpdatedSuccessfully'),
            'success'
          )
          handleCloseDrawerLSAL()
          if (router.query.id) {
            getDetailVariant(Number(router.query.id))
              .then((res) => {
                const { data } = res.data
                setStateVariantDetail(data)
                dispatch(loadingActions.doLoadingSuccess())
              })
              .catch(({ response }) => {
                const { status, data } = response
                pushMessage(handlerGetErrMessage(status, data), 'error')
                dispatch(loadingActions.doLoadingFailure())
              })
          }
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    const onSubmit = (values: any) => {
      if (Number(getValues('quantity')) > 10000000) {
        pushMessage(t('details.maximumQuantityAllowedIs_10_000_000'), 'error')
        return
      }
      if (
        Number(getValues('quantity')) === stateQuantityInWarehouse?.quantity
      ) {
        pushMessage(
          t('details.theNewQuantityCannotEqualToCurrentQuantityInStock'),
          'error'
        )
        return
      }
      const updateInstock = {
        product_variant: Number(router.query.id),
        warehouse: getValues('warehouse'),
        quantity: Number(values.quantity.replaceAll(',', '')),
        description: values.description,
        reason: values.reason,
      }
      dispatch(loadingActions.doLoading())
      adjustInstock(updateInstock)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('details.updateStockSuccessfully'), 'success')
          if (router.query.id) {
            getDetailVariant(Number(router.query.id))
              .then((res) => {
                const { data } = res.data
                setStateVariantDetail(data)
                dispatch(loadingActions.doLoadingSuccess())
              })
              .catch(({ response }) => {
                const { status, data } = response
                pushMessage(handlerGetErrMessage(status, data), 'error')
                dispatch(loadingActions.doLoadingFailure())
              })
          }
          // handleGetTransaction(router?.query?.id)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          dispatch(loadingActions.doLoadingFailure())
        })
      router.replace(
        {
          search: `${objToStringParam({
            ...router.query,
            page: 1,
          })}`,
        },
        undefined,
        { scroll: false }
      )
      reset()
      handleCloseDrawerAdjustStock()
    }
    const checkFieldDisable = () => {
      if (stateDisableModal && !stateErrorQuantity) {
        return false
      }
      return true
    }

    const handleChangeCurrentReason = () => {
      // check if user haven't select warehouse
      if (!stateQuantityInWarehouse) return
      setStateErrorQuantity(0)
      const inputQuantity = getValues('quantity')
      if (typeof inputQuantity !== 'number') {
        setStateDisableModal(false)
        return
      }
      if (inputQuantity > 10000000 || inputQuantity < 1) {
        setStateErrorQuantity(1)
        setStateDisableModal(false)
        return
      }
      const currentWareHouseQuantity = stateQuantityInWarehouse?.quantity
      if (inputQuantity === currentWareHouseQuantity) {
        setStateErrorQuantity(2)
        setStateDisableModal(false)
        return
      }
      setStateErrorQuantity(0)
      setStateDisableModal(true)

      if (inputQuantity > currentWareHouseQuantity) {
        if (
          stateCurrentReason &&
          stateCurrentReason?.length < optionReason[0].data.length
        ) {
          setValue('reason', '')
        }
        setStateCurrentReason(optionReason[0].data)

        // setStateRerender(!stateRerender)
        return
      }
      if (
        stateCurrentReason &&
        stateCurrentReason?.length > optionReason[1].data.length
      ) {
        setValue('reason', '')
      }
      setStateCurrentReason(optionReason[1].data)

      // setStateRerender(!stateRerender)
    }

    const handleOnChangeWarehouse = (event: any) => {
      console.log('event target value', event.target.value)
      setValue('warehouse', event.target.value)
      console.log('warehouse', event.target.value)
      // const tempChangeWarehouse = stateQuantityInWarehouse?.warehouses.find(
      //   (obj) => obj.id === event.target.value
      // )
      // if (!tempChangeWarehouse) return
      handleGetCurrentWarehouseQuantity(Number(event.target.value))
      // setStateCurrentWarehouse(tempChangeWarehouse)
      setStateDisableQuantity(false)
      setValue('quantity', 0)
      setValue('reason', '')
      setValue('description', '')
      setStateDisableModal(false)
    }
    const checkFieldDisableForSubmitButton = () => {
      const resultReason = getValues('reason')
      if (typeof resultReason === 'string' && resultReason.length > 0) {
        return false
      }
      return true
    }
    console.log(
      'checkFieldDisableForSubmitButton',
      checkFieldDisableForSubmitButton()
    )
    const handleChangeRowsPerPage = (event: any) => {
      router.replace(
        {
          search: `${objToStringParam({
            ...router.query,
            limit: Number(event.target.value),
            page: 1,
          })}`,
        },
        undefined,
        { scroll: false }
      )
    }
    const handleChangePagination = (event: any, page: number) => {
      console.log(event)
      router.replace(
        {
          search: `${objToStringParam({
            ...router.query,
            page: page,
          })}`,
        },
        undefined,
        { scroll: false }
      )
    }
    const fetchMoreDataWarehouse = useCallback(
      (value: { page: number; name: string }) => {
        getWarehouseforFilter(value.page, { name: value.name })
          .then((res) => {
            const { data } = res
            setStateListWarehouse((prev: any) => {
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
      [setStateListWarehouse]
    )
    const handleClickBuyMore = () => {
      if (!stateVariantDetail) return
      // if (!stateVariantDetail.stock_all) {
      //   pushMessage('This product is out of stock', 'error')
      //   return
      // }
      const submitValue: AddMultiVariantToCartType = {
        product_variant: Number(router.query.id),
        quantity: 1,
        distribution_channel: stateVariantDetail.distribution_channels[0].id,
      }
      const convertValue: ArrayAddMultiVariantToCartType = {
        list_variants: [submitValue],
      }
      addToCart(convertValue)
        .then(() => {
          pushMessage(t('details.addToCartSuccessfully'), 'success')
          dispatch(cartActions.doCart())
          router.push(`/retailer/market-place/cart`)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    const handleClickBuyMoreWithListDC = () => {
      setStateDrawerSelectDistribution(true)
    }
    const handleCloseDrawerSelectDistribution = () => {
      setStateDrawerSelectDistribution(false)
      resetValueDC()
      clearErrorsDC()
    }
    const handleClickBuyMoreSelectDistribution = (
      value: SubmitDistributionChannelType
    ) => {
      if (!stateVariantDetail) return
      // if (!stateVariantDetail.stock_all) {
      //   pushMessage('This product is out of stock', 'error')
      //   return
      // }
      const submitValue: AddMultiVariantToCartType = {
        product_variant: Number(router.query.id),
        quantity: 1,
        distribution_channel: value.distribution_channels,
      }
      const convertValue: ArrayAddMultiVariantToCartType = {
        list_variants: [submitValue],
      }
      addToCart(convertValue)
        .then(() => {
          pushMessage(t('details.addToCartSuccessfully'), 'success')

          router.push(`/retailer/market-place/cart`)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    return (
      <>
        <Head>
          <title>
            {stateVariantDetail?.attribute_options.length === 0
              ? t('details.productDetails')
              : t('details.variantDetails')}{' '}
            | TWSS
          </title>
        </Head>
        <TypographyTitlePage mb={2} variant="h1">
          {stateVariantDetail?.attribute_options.length === 0
            ? t('details.productDetails')
            : t('details.variantDetails')}
        </TypographyTitlePage>
        {stateVariantDetail ? (
          <Breadcrumbs
            separator=">"
            aria-label="breadcrumb"
            sx={{ marginBottom: '15px' }}
          >
            <Link href={`/${platform().toLowerCase()}/inventory/product/list`}>
              <a>{t('details.productManagement')}</a>
            </Link>
            <Typography>{stateVariantDetail.name}</Typography>
          </Breadcrumbs>
        ) : (
          <Skeleton
            sx={{ marginBottom: '15px' }}
            variant="rectangular"
            width="500px"
            height={16}
          />
        )}
        <Stack direction="row" justifyContent="flex-end" spacing={2} mb={2}>
          {!stateVariantDetail?.product.is_owner && (
            <ButtonCustom
              variant="outlined"
              size="small"
              startIcon={<ShoppingBag size={20} />}
              onClick={() => {
                if (!stateVariantDetail) return
                // if (!stateVariantDetail.stock_all) {
                //   pushMessage(t('details.thisProductIsOutOfStock'), 'error')
                //   return
                // }
                if (stateVariantDetail.distribution_channels.length > 1) {
                  console.log('buy more with dc')
                  handleClickBuyMoreWithListDC()
                } else {
                  console.log('buy more without dc')

                  handleClickBuyMore()
                }
              }}
            >
              {t('details.buyMore')}
            </ButtonCustom>
          )}

          {platform() == 'RETAILER' && (
            <>
              {checkPermission(
                arrayPermission,
                KEY_MODULE.Inventory,
                PERMISSION_RULE.SetRetailPrice
              ) && (
                <ButtonCustom
                  // onClick={handleDialogSetRetail}
                  onClick={() => handleOpenDrawerRetail()}
                  variant="outlined"
                  size="small"
                  startIcon={<CurrencyCircleDollar size={20} />}
                >
                  {t('details.setRetailPrice')}
                </ButtonCustom>
              )}
            </>
          )}
          {checkPermission(
            arrayPermission,
            KEY_MODULE.Inventory,
            PERMISSION_RULE.AdjustStock
          ) && (
            <ButtonCustom
              onClick={() => setStateOpenDrawerAdjustStock(true)}
              variant="outlined"
              size="small"
              startIcon={<Equalizer size={20} />}
            >
              {t('details.updateStock')}
            </ButtonCustom>
          )}

          {stateVariantDetail?.product.is_owner &&
            checkPermission(
              arrayPermission,
              KEY_MODULE.Inventory,
              PERMISSION_RULE.UpdateVariant
            ) && (
              <Link
                href={`/${platform().toLowerCase()}/inventory/product/variant-update/${Number(
                  router.query.id
                )}`}
              >
                <ButtonCustom
                  variant="outlined"
                  size="small"
                  startIcon={<PencilSimple size={20} />}
                >
                  {t('details.updateDetails')}
                </ButtonCustom>
              </Link>
            )}
          {checkPermission(
            arrayPermission,
            KEY_MODULE.Inventory,
            PERMISSION_RULE.ConfigLSAL
          ) && (
            <ButtonCustom
              onClick={handleOpenDrawerLSAL}
              variant="outlined"
              size="small"
              startIcon={<Gear size={20} />}
            >
              {t('details.configLowStock')}
            </ButtonCustom>
          )}
        </Stack>
        {stateVariantDetail ? (
          <CustomBox mb={2}>
            <TypographyHeading sx={{ marginBottom: '16px' }}>
              {t('details.thumbnail')}
            </TypographyHeading>
            <Box sx={{ cursor: 'pointer' }}>
              <PhotoProvider maskOpacity={0.5}>
                <PhotoView
                  src={
                    stateVariantDetail.thumbnail
                      ? stateVariantDetail.thumbnail
                      : '/' + '/images/vapeProduct.png'
                  }
                >
                  <Image
                    alt={`${stateVariantDetail.name}`}
                    src={
                      stateVariantDetail.thumbnail
                        ? stateVariantDetail.thumbnail
                        : '/' + '/images/vapeProduct.png'
                    }
                    width={100}
                    height={100}
                  />
                </PhotoView>
              </PhotoProvider>
            </Box>
          </CustomBox>
        ) : (
          <Skeleton
            sx={{ marginBottom: '15px' }}
            variant="rectangular"
            width="100%"
            height="155px"
          />
        )}

        {stateVariantDetail ? (
          <CustomBox mb={2}>
            <TypographyHeading sx={{ marginBottom: '16px' }}>
              {t('details.images')}
            </TypographyHeading>
            <PhotoProvider maskOpacity={0.5}>
              <Stack direction="row" spacing={2}>
                {stateVariantDetail.images &&
                stateVariantDetail.images.length === 0 ? (
                  <Box sx={{ cursor: 'pointer' }}>
                    <PhotoView src={'/images/default-brand.png'}>
                      <Image
                        alt="image"
                        src={'/' + '/images/default-brand.png'}
                        width={100}
                        height={100}
                      />
                    </PhotoView>
                  </Box>
                ) : (
                  stateVariantDetail.images &&
                  stateVariantDetail.images.map((item, index) => {
                    return (
                      // <Box key={index + Math.random()}>
                      //   <Image alt="image" src={item} width={100} height={100} />
                      // </Box>
                      <Box
                        key={index + Math.random()}
                        sx={{ cursor: 'pointer' }}
                      >
                        <PhotoView src={item}>
                          <Image
                            alt="image"
                            src={item}
                            width={100}
                            height={100}
                          />
                        </PhotoView>
                      </Box>
                    )
                  })
                )}
              </Stack>
            </PhotoProvider>
          </CustomBox>
        ) : (
          <Skeleton
            sx={{ marginBottom: '15px' }}
            variant="rectangular"
            width="100%"
            height="155px"
          />
        )}

        {stateVariantDetail?.documents &&
          stateVariantDetail?.documents.length > 0 && (
            <CustomBox mb={2}>
              <TypographyHeading sx={{ marginBottom: '16px' }}>
                {t('details.documents')}
              </TypographyHeading>
              <Stack spacing={2} direction="row" alignItems="center">
                {stateVariantDetail?.documents.map((value, index: number) => (
                  <Stack direction="row" alignItems="center" key={index}>
                    <PaperclipHorizontal
                      size={20}
                      color="#2F6FED"
                      style={{ transform: 'rotate(90deg)' }}
                    />
                    <Link href={value} target="_blank">
                      <a
                        style={{
                          width: '100%',
                          maxWidth: '135px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          direction: 'rtl',
                          color: '#2F6FED',
                        }}
                      >
                        {value}
                      </a>
                    </Link>
                  </Stack>
                ))}
              </Stack>
            </CustomBox>
          )}

        <Grid container spacing={2} mb={2}>
          <Grid xs={7}>
            {stateVariantDetail ? (
              <CustomStack spacing={2} mb={2}>
                <TypographyHeading>
                  {t('details.specification')}
                </TypographyHeading>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom>
                    {t('details.productCode')}
                  </TypographyCustom>
                  <TypographyInformation>
                    #{stateVariantDetail.code}
                  </TypographyInformation>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom>
                    {t('details.productName')}
                  </TypographyCustom>
                  <TypographyInformation>
                    {stateVariantDetail.name}
                  </TypographyInformation>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom>Product barcode</TypographyCustom>
                  <TypographyInformation>
                    {stateVariantDetail.bar_code
                      ? stateVariantDetail.bar_code
                      : 'N/A'}
                  </TypographyInformation>
                </Stack>
                {stateVariantDetail.attribute_options.length > 0 ? (
                  <Stack direction="row" justifyContent="space-between">
                    <TypographyCustom>
                      {t('details.productVariant')}
                    </TypographyCustom>
                    <TypographyInformation>
                      {stateVariantDetail.attribute_options
                        .map((item) => item.option)
                        .join(' - ')}
                    </TypographyInformation>
                  </Stack>
                ) : (
                  <></>
                )}
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom>
                    {t('details.productCategoryOnMarketplace')}
                  </TypographyCustom>
                  <TypographyInformation>
                    {stateVariantDetail?.category_marketplace
                      ? stateVariantDetail?.category_marketplace.name
                      : 'N/A'}
                  </TypographyInformation>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom>
                    {t('details.productCategory')}
                  </TypographyCustom>
                  {Object.keys(stateVariantDetail.category?.parent_category)
                    .length === 0 ? (
                    <>
                      <TypographyInformation>
                        {stateVariantDetail.category?.name
                          ? stateVariantDetail.category?.name
                          : 'N/A'}
                      </TypographyInformation>
                    </>
                  ) : (
                    <TypographyInformation>
                      {stateVariantDetail?.category?.parent_category?.name &&
                      stateVariantDetail.category.name ? (
                        <>
                          {stateVariantDetail?.category?.parent_category?.name}
                          {' > '}
                          {stateVariantDetail.category?.name}
                        </>
                      ) : (
                        'N/A'
                      )}
                    </TypographyInformation>
                  )}
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom>{t('details.brand')}</TypographyCustom>
                  <TypographyInformation>
                    {stateVariantDetail.brand
                      ? stateVariantDetail.brand.name
                      : 'N/A'}
                  </TypographyInformation>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom>
                    {t('details.manufacturer')}
                  </TypographyCustom>
                  <TypographyInformation>
                    {stateVariantDetail.manufacturer
                      ? stateVariantDetail.manufacturer.name
                      : 'N/A'}
                  </TypographyInformation>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom>
                    {t('details.lowStockAlertLevel')}
                  </TypographyCustom>
                  <TypographyInformation>
                    {stateVariantDetail.low_stock_level.toLocaleString('en-US')}
                  </TypographyInformation>
                </Stack>
                {platform() === 'RETAILER' && (
                  <Stack direction="row" justifyContent="space-between">
                    <TypographyCustom>
                      {t('details.retailPrice')}
                    </TypographyCustom>
                    <TypographyInformation>
                      {formatMoney(
                        stateVariantDetail.retail_information.retail_price
                      )}
                    </TypographyInformation>
                  </Stack>
                )}
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom>{t('details.basePrice')}</TypographyCustom>
                  <TypographyInformation>
                    {formatMoney(stateVariantDetail.wholesale_price)}
                  </TypographyInformation>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom>{t('details.weight')}</TypographyCustom>
                  <TypographyInformation>
                    {stateVariantDetail.weight && stateVariantDetail.uom ? (
                      <>
                        {stateVariantDetail.weight}{' '}
                        {stateVariantDetail.uom
                          ? t(`details.${stateVariantDetail.uom.name}` as any)
                          : 'N/A'}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </TypographyInformation>
                </Stack>
              </CustomStack>
            ) : (
              <Skeleton
                variant="rectangular"
                width="100%"
                height={350}
              ></Skeleton>
            )}
            {stateVariantDetail?.attribute_options &&
            stateVariantDetail?.attribute_options.length > 0 ? (
              <CustomStack spacing={2}>
                <TypographyHeading>
                  {t('details.variantDetails')}
                </TypographyHeading>
                {stateVariantDetail?.attribute_options.map((element, idx) => {
                  return (
                    <Stack
                      key={idx}
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography sx={{ color: '#49516F' }}>
                        {element.attribute}
                      </Typography>
                      <Typography sx={{ color: '#1B1F27', fontWeight: 500 }}>
                        {element.option}
                      </Typography>
                    </Stack>
                  )
                })}
              </CustomStack>
            ) : (
              <></>
            )}
          </Grid>
          <Grid xs={5}>
            <Stack
              direction="row"
              justifyContent="space-between"
              sx={{
                background: '#1DB46A',
                padding: '10px 15px',
                borderRadius: '5px',
              }}
            >
              <TypographyCustom sx={{ color: 'white' }}>
                {t('details.productStatus')}
              </TypographyCustom>
              <TypographyCustom sx={{ color: 'white', fontWeight: 700 }}>
                {stateVariantDetail?.status
                  ? t('details.active')
                  : t('details.deactive')}
              </TypographyCustom>
            </Stack>

            <CustomStack spacing={2} sx={{ marginBottom: '15px' }}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                sx={{
                  paddingBottom: '10px',
                  borderBottom: '1px solid #E1E6EF',
                }}
              >
                <TypographyHeading>
                  {' '}
                  {t('details.warehousesStock')}
                </TypographyHeading>
                {Number(stateVariantDetail?.low_stock_level) >
                  Number(stateVariantDetail?.stock_all) && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <WarningCircle size={18} weight="fill" color="#E02D3C" />
                    <Typography sx={{ fontWeight: 600 }} color="#E02D3C">
                      {t('details.theStockIsLow')}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Stack spacing={2}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography sx={{ fontWeight: 700, color: '#49516F' }}>
                    {t('details.warehouse')}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: '#49516F' }}>
                    {t('details.stock')}
                  </Typography>
                </Stack>
                {stateVariantDetail?.warehouses.map((item, index) => {
                  return (
                    <Stack
                      key={index}
                      direction="row"
                      justifyContent="space-between"
                    >
                      <TypographyCustom>{item.name}</TypographyCustom>
                      <TypographyInformation>
                        {item.quantity.toLocaleString('en-US')}
                      </TypographyInformation>
                    </Stack>
                  )
                })}
              </Stack>
            </CustomStack>
            <CustomStack spacing={2}>
              <TypographyHeading
                sx={{
                  paddingBottom: '10px',
                  borderBottom: '1px solid #E1E6EF',
                }}
              >
                {t('details.distributionChannel')}
              </TypographyHeading>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography sx={{ fontWeight: 700, color: '#49516F' }}>
                  {t('details.distributionChannel')}
                </Typography>
                <Typography sx={{ fontWeight: 700, color: '#49516F' }}>
                  {t('details.wholesalePrice')}
                </Typography>
              </Stack>
              <Stack spacing={1}>
                {stateVariantDetail?.distribution_channels.map(
                  (item, index) => {
                    return (
                      <Stack
                        key={index}
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography>{item.name}</Typography>
                        <Typography>
                          {formatMoney(item?.price ? item.price : 0)}
                          {'/'}
                          {t(
                            `${stateVariantDetail?.unit_type?.toLowerCase()}` as any
                          )}
                        </Typography>
                      </Stack>
                    )
                  }
                )}
              </Stack>
            </CustomStack>
          </Grid>
          <Grid xs={12}>
            {stateVariantDetail ? (
              <CustomBox mb={2}>
                <TypographyHeading mb={2}>
                  {t('details.shortDescription')}
                </TypographyHeading>
                <Typography variant="body2">
                  {stateVariantDetail.description
                    ? stateVariantDetail.description
                    : 'N/A'}
                </Typography>
              </CustomBox>
            ) : (
              <Skeleton
                sx={{ marginBottom: '15px' }}
                variant="rectangular"
                width="100%"
                height={137}
              />
            )}
            {stateVariantDetail ? (
              <CustomBox mb={2}>
                <TypographyHeading mb={2}>
                  {t('details.fullDescription')}
                </TypographyHeading>
                <Typography
                  variant="body2"
                  dangerouslySetInnerHTML={{
                    __html: stateVariantDetail?.longDescription
                      ? `${stateVariantDetail?.longDescription}`
                      : `<p>N/A</p>`,
                  }}
                ></Typography>
              </CustomBox>
            ) : (
              <Skeleton
                sx={{ marginBottom: '15px' }}
                variant="rectangular"
                width="100%"
                height={284}
              />
            )}
          </Grid>
        </Grid>
        <TypographySectionTitle sx={{ fontSize: '1.6rem' }}>
          {t('details.stockTransactions')}
        </TypographySectionTitle>
        <Grid
          xs
          container
          justifyContent="flex-end"
          sx={{ marginBottom: '15px' }}
        >
          <Badge
            badgeContent={stateFilter}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          >
            <ButtonCustom
              onClick={handleOpenMenuFilter}
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
        </Grid>
        {stateTransaction?.data.length === 0 ? (
          <Grid container spacing={2} justifyContent="center">
            <Grid>
              <Stack
                p={5}
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={'/' + '/images/not-found.svg'}
                  alt="Logo"
                  width="200"
                  height="200"
                />
                <Typography variant="h6" sx={{ marginTop: '0' }}>
                  {t('details.thereAreNoTransactionToShow')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        ) : (
          <>
            <TableContainerTws sx={{ marginTop: '0' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCellHeadingTextTws align="center" width={80}>
                    No.
                  </TableCellHeadingTextTws> */}
                    <TableCellTws>{t('details.date')}</TableCellTws>
                    <TableCellTws>{t('details.reason')}</TableCellTws>
                    <TableCellTws>{t('details.oldQuantity')}</TableCellTws>
                    <TableCellTws>{t('details.newQuantity')}</TableCellTws>
                    <TableCellTws>{t('details.changes')}</TableCellTws>
                    <TableCellTws>{t('details.warehouse')}</TableCellTws>
                    <TableCellTws>{t('details.description')}</TableCellTws>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stateTransaction?.data.map(
                    (row: StockTransactionType, index: number) => (
                      <TableRowTws key={`item-${index}`}>
                        <TableCellTws>
                          {moment(row.time).format('MM/DD/YYYY - hh:mm A')}{' '}
                        </TableCellTws>
                        <TableCellTws sx={{ textTransform: 'capitalize' }}>
                          {row.reason
                            ? t(`details.${row.reason.toLowerCase()}` as any)
                            : 'N/A'}
                        </TableCellTws>
                        <TableCellTws>
                          {row.from_stock
                            ? row.from_stock.toLocaleString('en-US')
                            : 0}{' '}
                          {t(
                            `${stateVariantDetail?.unit_type?.toLowerCase()}` as any
                          )}
                        </TableCellTws>
                        <TableCellTws>
                          {row.to_stock
                            ? row.to_stock.toLocaleString('en-US')
                            : 0}{' '}
                          {t(
                            `${stateVariantDetail?.unit_type?.toLowerCase()}` as any
                          )}
                        </TableCellTws>
                        <TableCellTws>
                          {row.to_stock - row.from_stock > 0 ? '+ ' : '- '}
                          {Math.abs(
                            row.from_stock - row.to_stock
                          ).toLocaleString('en-US')}
                        </TableCellTws>
                        <TableCellTws>{row.warehouse.name}</TableCellTws>
                        {row.description && row.description.length > 15 ? (
                          <Tooltip
                            title={row.description}
                            placement="top"
                            arrow
                            sx={{ fontSize: '14px' }}
                          >
                            <TableCellTws
                              style={{
                                maxWidth: '150px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {row.description}
                            </TableCellTws>
                          </Tooltip>
                        ) : (
                          <TableCellTws
                            style={{
                              maxWidth: '150px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {row.description ? row.description : 'N/A'}
                          </TableCellTws>
                        )}
                      </TableRowTws>
                    )
                  )}
                </TableBody>
              </Table>
            </TableContainerTws>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={2}
            >
              <Typography>{t('details.rowsPerPage')}</Typography>
              <FormControl sx={{ m: 1 }}>
                <SelectPaginationCustom
                  value={
                    Number(router.query.limit) ? Number(router.query.limit) : 10
                  }
                  onChange={handleChangeRowsPerPage}
                  displayEmpty
                >
                  <MenuItemSelectCustom value={10}>10</MenuItemSelectCustom>
                  <MenuItemSelectCustom value={20}>20</MenuItemSelectCustom>
                  <MenuItemSelectCustom value={50}>50</MenuItemSelectCustom>
                  <MenuItemSelectCustom value={100}>100</MenuItemSelectCustom>
                </SelectPaginationCustom>
              </FormControl>
              <Pagination
                color="primary"
                variant="outlined"
                shape="rounded"
                defaultPage={1}
                page={Number(router.query.page) ? Number(router.query.page) : 1}
                onChange={(event, page: number) =>
                  handleChangePagination(event, page)
                }
                count={stateTransaction ? stateTransaction?.totalPages : 0}
              />
            </Stack>
          </>
        )}
        <Drawer
          anchor="right"
          open={stateOpenDrawerAdjustStock}
          onClose={handleCloseDrawerAdjustStock}
        >
          <CustomBoxDrawer>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ marginBottom: '15px' }}
            >
              <IconButton onClick={handleCloseDrawerAdjustStock}>
                <ArrowRight size={24} />
              </IconButton>
              <TypographyH2 textAlign="center">
                {t('details.productQuantityAdjustment')}
              </TypographyH2>
            </Stack>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2}>
                <Controller
                  control={control}
                  name="warehouse"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="warehouse"
                        error={!!errors.warehouse}
                      >
                        <RequiredLabel />
                        {t('details.warehouse')}{' '}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="warehouse"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (!value) {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('details.selectWarehouse')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return stateVariantDetail?.warehouses.find(
                              (obj) => obj.id === value
                            )?.name
                          }}
                          {...field}
                          onChange={handleOnChangeWarehouse}
                        >
                          {stateVariantDetail?.warehouses?.map(
                            (item, index) => {
                              return (
                                <MenuItemSelectCustom
                                  value={item.id}
                                  key={index + Math.random()}
                                >
                                  {item.name}
                                </MenuItemSelectCustom>
                              )
                            }
                          )}
                        </SelectCustom>
                        <FormHelperText error={!!errors.warehouse}>
                          {errors.warehouse && `${errors.warehouse.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />

                <Stack direction="row" justifyContent="space-between">
                  <Typography>{t('details.currentStock')}</Typography>
                  <TypographyInformation sx={{ fontWeight: '700' }}>
                    {stateQuantityInWarehouse
                      ? stateQuantityInWarehouse.quantity.toLocaleString(
                          'en-US'
                        )
                      : 0}
                  </TypographyInformation>
                </Stack>
                <Typography
                  sx={{
                    fontStyle: 'italic',
                    borderTop: '1px solid #E1E6EF ',
                    paddingTop: '27px',
                  }}
                >
                  {t('details.newQuantityMust_10_000_000')}
                </Typography>
                {/* <Stack direction="row" justifyContent="space-between">
                <Typography>Total quantity being ordered</Typography>
                <TypographyInformation>
                  {stateDisableModal ? stateProductDetail?.quantity_order : 0}
                </TypographyInformation>
              </Stack> */}
                {/* <Stack direction="row" justifyContent="space-between">
                <Typography>Available Stock</Typography>
                <TypographyInformation>
                  {stateDisableModal ? stateProductDetail?.available_stock : 0}
                </TypographyInformation>
              </Stack> */}

                <Controller
                  control={control}
                  name="quantity"
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="quantity"
                        sx={{ fontSize: '1.2rem' }}
                        error={!!errors.quantity}
                      >
                        <RequiredLabel />
                        {t('details.newQuantity')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <div className={classes['input-number']}>
                          <NumericFormat
                            id="quantity"
                            placeholder="0"
                            isAllowed={(values) => {
                              const { floatValue, formattedValue } = values
                              if (!floatValue) {
                                return formattedValue === ''
                              }
                              return floatValue <= 10000000
                            }}
                            thousandSeparator=","
                            disabled={stateDisableQuantity}
                            allowNegative={false}
                            onKeyPress={(event: any) => {
                              if (hasSpecialCharacterPrice(event.key)) {
                                event.preventDefault()
                              }
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment
                                  position="end"
                                  sx={{ textTransform: 'capitalize' }}
                                >
                                  {stateVariantDetail?.unit_type
                                    ? t(
                                        `${stateVariantDetail?.unit_type?.toLowerCase()}` as any
                                      )
                                    : 'N/A'}
                                </InputAdornment>
                              ),
                            }}
                            decimalScale={0}
                            error={
                              !!errors.quantity ||
                              stateErrorQuantity === 1 ||
                              stateErrorQuantity === 2
                            }
                            customInput={TextField}
                            {...field}
                            onValueChange={(value: any) => {
                              setValue('quantity', value.floatValue)
                              // trigger('quantity')
                              handleChangeCurrentReason()
                            }}
                            // customInput={(field) => <TextFieldCustom variant='outlined' {...field} />}
                          ></NumericFormat>
                        </div>
                        {stateErrorQuantity === 1 && (
                          <FormHelperText error>
                            {t('details.quantityMustBeBetween_1To_10_000_000')}
                          </FormHelperText>
                        )}
                        {stateErrorQuantity === 2 && (
                          <FormHelperText error>
                            {t(
                              'details.theNewQuantityCannotEqualToCurrentQuantityInStock'
                            )}
                          </FormHelperText>
                        )}
                        <FormHelperText error={!!errors.quantity}>
                          {errors.quantity && `${errors.quantity.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
                <Controller
                  control={control}
                  name="reason"
                  defaultValue=""
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="reason"
                        sx={{ fontSize: '1.2rem' }}
                        error={!!errors.reason}
                      >
                        <RequiredLabel />
                        {t('details.reason')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="reason"
                          displayEmpty
                          disabled={checkFieldDisable()}
                          {...field}
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          style={{
                            cursor: checkFieldDisable()
                              ? 'not-allowed'
                              : 'default',
                          }}
                          renderValue={(value: any) => {
                            if (!value) {
                              return (
                                <PlaceholderSelect
                                  style={{
                                    cursor: checkFieldDisable()
                                      ? 'not-allowed'
                                      : 'default',
                                  }}
                                >
                                  <div>{t('details.selectReason')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            if (stateCurrentReason) {
                              return stateCurrentReason.find(
                                (obj: ReasonType) => obj.key === value
                              )?.name
                            }
                          }}
                          // {...field}
                          onChange={(event: any) => {
                            setValue('reason', event.target.value)
                            setStateRerender(!stateRerender)

                            // trigger('monthly_purchase')
                          }}
                        >
                          {}
                          {stateCurrentReason?.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.key}
                                key={index + Math.random()}
                                sx={{ textTransform: 'capitalize' }}
                              >
                                {item.name.toLowerCase()}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText error={!!errors.reason}>
                          {errors.reason && `${errors.reason.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />

                <Controller
                  control={control}
                  name="description"
                  defaultValue=""
                  render={({ field }) => (
                    <Box>
                      <InputLabelCustom
                        htmlFor="description"
                        sx={{ fontSize: '1.2rem' }}
                        error={!!errors.description}
                      >
                        {t('details.description')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="description"
                          error={!!errors.description}
                          disabled={checkFieldDisable()}
                          {...field}
                          placeholder={t('details.enterDescription')}
                        />
                        <FormHelperText error={!!errors.description}>
                          {errors.description &&
                            `${errors.description.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />

                <Stack direction="row" spacing={2}>
                  <ButtonCancel
                    onClick={handleCloseDrawerAdjustStock}
                    variant="outlined"
                    size="large"
                  >
                    {t('details.cancel')}
                  </ButtonCancel>
                  <ButtonCustom
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={checkFieldDisableForSubmitButton()}
                  >
                    {t('details.submit')}
                  </ButtonCustom>
                </Stack>
              </Stack>
            </form>
          </CustomBoxDrawer>
        </Drawer>
        <Drawer
          anchor="right"
          open={stateOpenDrawerRetail}
          onClose={handleCloseDrawerRetail}
        >
          <Box sx={{ width: '550px', padding: '30px' }}>
            <Stack direction="row" spacing={2} sx={{ marginBottom: '15px' }}>
              <IconButton onClick={handleCloseDrawerRetail}>
                <ArrowRight size={24} />
              </IconButton>
              <TypographyH2
                sx={{ fontSize: '2.4rem', marginBottom: '0px' }}
                alignSelf="center"
              >
                {t('details.setRetailPrice')}
              </TypographyH2>
            </Stack>
            <form
              onSubmit={handleSubmitRetail(onSubmitRetail)}
              // className={classes['cancel-dialog']}
            >
              <Grid container xs mb={2}>
                <Controller
                  control={controlRetail}
                  name="retail_price"
                  render={() => {
                    return (
                      <>
                        <InputLabelCustom
                          htmlFor="retail_price"
                          error={!!errorsRetail.retail_price}
                        >
                          <RequiredLabel />
                          {t('details.pleaseEnterTheRetailPriceForTheProduct')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <div className={classes['input-number-retail']}>
                            <CurrencyNumberFormat
                              propValue={(value) => {
                                console.log('Setting', value)
                                setValueRetail('retail_price', Number(value))
                                triggerRetail('retail_price')
                              }}
                              defaultPrice={
                                stateVariantDetail?.retail_information
                                  .retail_price
                                  ? stateVariantDetail?.retail_information.retail_price.toFixed(
                                      2
                                    )
                                  : 0
                              }
                              error={!!errorsRetail.retail_price}
                            />
                          </div>
                          <FormHelperText error={!!errorsRetail.retail_price}>
                            {errorsRetail.retail_price &&
                              `${errorsRetail.retail_price.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )
                  }}
                />
              </Grid>
            </form>
            <Stack spacing={2} direction="row">
              <ButtonCancel
                variant="outlined"
                size="large"
                onClick={handleCloseDrawerRetail}
              >
                {t('details.cancel')}
              </ButtonCancel>
              <ButtonCustom
                variant="contained"
                size="large"
                type="submit"
                onClick={handleSubmitRetail(onSubmitRetail)}
              >
                {t('details.submit')}
              </ButtonCustom>
            </Stack>
          </Box>
        </Drawer>
        <Drawer
          anchor="right"
          open={stateOpenDrawerLSAL}
          onClose={handleCloseDrawerLSAL}
        >
          <Box sx={{ width: '550px', padding: '30px' }}>
            <form
              onSubmit={handleSubmitConfigLowStockAlertLevel(
                onSubmitLowStockLevel
              )}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  marginBottom: '15px',
                }}
              >
                <IconButton onClick={handleCloseDrawerLSAL}>
                  <ArrowRight size={24} />
                </IconButton>
                <TypographyH2
                  sx={{
                    fontSize: '2.4rem',
                    textAlign: 'center',
                  }}
                >
                  {t('details.configLowStock')}
                </TypographyH2>
              </Stack>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={controlLowStockLevel}
                  name="low_stock_alert_level"
                  render={({ field }) => {
                    return (
                      <>
                        <InputLabelCustom
                          htmlFor="low_stock_alert_level"
                          sx={{ marginBottom: '10px' }}
                          error={
                            !!errorLowStockAlertLevel.low_stock_alert_level
                          }
                        >
                          <RequiredLabel />
                          {t('details.lowStockAlertLevel')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <div className={classes['input-number-retail']}>
                            <NumericFormat
                              // sx={{ width: '100%' }}
                              isAllowed={(values) => {
                                const { floatValue, formattedValue } = values
                                console.log('value', values)

                                if (!floatValue && floatValue !== 0) {
                                  return formattedValue === ''
                                }

                                return floatValue <= 10000000 && floatValue >= 0
                              }}
                              placeholder="0"
                              {...field}
                              thousandSeparator=","
                              decimalScale={0}
                              allowNegative={false}
                              onKeyPress={(event: any) => {
                                if (hasSpecialCharacterPrice(event.key)) {
                                  event.preventDefault()
                                }
                              }}
                              error={
                                !!errorLowStockAlertLevel.low_stock_alert_level
                              }
                              customInput={TextField}
                              // customInput={(field) => <TextFieldCustom variant='outlined' {...field} />}
                            ></NumericFormat>
                          </div>
                          <FormHelperText
                            error={
                              !!errorLowStockAlertLevel.low_stock_alert_level
                            }
                          >
                            {errorLowStockAlertLevel.low_stock_alert_level &&
                              `${errorLowStockAlertLevel.low_stock_alert_level.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )
                  }}
                />
                {!stateVariantDetail?.product.is_owner && (
                  <Controller
                    control={controlLowStockLevel}
                    name="low_stock_notification_to_supplier"
                    render={({ field }) => (
                      <>
                        <Typography
                          sx={{
                            fontSize: '1.6rem',
                            color: '#252626',
                            fontWeight: 400,
                          }}
                        >
                          Send notification to product supplier when stock is
                          low
                        </Typography>
                        <FormControl>
                          <SwitchStyles
                            {...field}
                            name="low_stock_notification_to_supplier"
                            checked={field.value}
                          />
                        </FormControl>
                      </>
                    )}
                  />
                )}
              </Box>

              <Stack spacing={2} direction="row">
                <ButtonCancel
                  variant="outlined"
                  size="large"
                  onClick={handleCloseDrawerLSAL}
                >
                  {t('details.cancel')}
                </ButtonCancel>
                <ButtonCustom variant="contained" size="large" type="submit">
                  {t('details.submit')}
                </ButtonCustom>
              </Stack>
            </form>
          </Box>
        </Drawer>
        <Drawer
          anchor="right"
          open={stateDrawerFilterStock}
          onClose={() => setStateDrawerFilterStock(false)}
        >
          <Box sx={{ padding: '25px', maxWidth: '550px' }}>
            <TypographyH2 sx={{ marginBottom: '10px' }}>
              {t('details.filterStockTransaction')}
            </TypographyH2>
            <form onSubmit={handleSubmitFilter(onSubmitFilter)}>
              <Box mb={2}>
                <InputLabelCustom
                  htmlFor="date"
                  sx={{
                    color: '#49516F',
                    fontSize: '1.2rem',
                  }}
                >
                  {t('details.date')}
                </InputLabelCustom>
                <Grid container spacing={2}>
                  <Grid xs>
                    <Controller
                      control={controlFilter}
                      defaultValue=""
                      name="from_date"
                      render={({ field }) => (
                        <Box>
                          <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                inputFormat="MM/DD/YYYY"
                                {...field}
                                onChange={(value: dayjs.Dayjs | null) => {
                                  if (!value) {
                                    console.log('?', value, field)
                                    setValueFilter('from_date', '', {
                                      shouldValidate: true,
                                    })
                                  } else {
                                    setValueFilter(
                                      'from_date',
                                      dayjs(value).format('MM/DD/YYYY'),
                                      { shouldValidate: true }
                                    )
                                  }
                                }}
                                // shouldDisableDate={(day: any) => {
                                //   const date = new Date()
                                //   console.log()
                                //   if (
                                //     dayjs(day).format('YYYY-MM-DD') >
                                //     dayjs(date).format('YYYY-MM-DD')
                                //   ) {
                                //     return true
                                //   }
                                //   return false
                                // }}
                                renderInput={(params: any) => {
                                  // params?.inputProps?.value = field.value
                                  // const value = params
                                  return (
                                    <TextFieldCustom
                                      {...params}
                                      error={!!errorsFilter.from_date}
                                    />
                                  )
                                }}
                              />
                            </LocalizationProvider>
                            <FormHelperText error={!!errorsFilter.from_date}>
                              {errorsFilter.from_date &&
                                `${errorsFilter.from_date.message}`}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid xs>
                    <Controller
                      control={controlFilter}
                      defaultValue=""
                      name="to_date"
                      render={({ field }) => (
                        <Box>
                          <FormControl fullWidth>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                inputFormat="MM/DD/YYYY"
                                {...field}
                                onChange={(value: dayjs.Dayjs | null) => {
                                  if (!value) {
                                    console.log('?', value)
                                    setValueFilter('to_date', '', {
                                      shouldValidate: true,
                                    })
                                  } else {
                                    setValueFilter(
                                      'to_date',
                                      dayjs(value).format('MM/DD/YYYY'),
                                      { shouldValidate: true }
                                    )
                                  }
                                }}
                                // shouldDisableDate={(day: any) => {
                                //   const date = new Date()

                                //   if (
                                //     dayjs(day).format('YYYY-MM-DD') >
                                //     dayjs(date).format('YYYY-MM-DD')
                                //   ) {
                                //     return true
                                //   }
                                //   return false
                                // }}
                                renderInput={(params) => (
                                  <TextFieldCustom
                                    {...params}
                                    error={!!errorsFilter.to_date}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                            <FormHelperText error={!!errorsFilter.to_date}>
                              {errorsFilter.to_date &&
                                `${errorsFilter.to_date.message}`}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid>
                </Grid>
              </Box>
              <Box mb={2}>
                <InputLabelCustom
                  htmlFor="warehouse"
                  sx={{
                    color: '#49516F',
                    fontSize: '1.2rem',
                  }}
                >
                  {t('details.warehouse')}
                </InputLabelCustom>
                <Controller
                  control={controlFilter}
                  defaultValue={[]}
                  name="warehouse"
                  render={({ field }) => (
                    <Box>
                      <FormControl fullWidth>
                        <SelectCustom
                          fullWidth
                          id="warehouse"
                          displayEmpty
                          // multiple
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (!value) {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('details.selectWarehouse')}</div>
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
                            propData={stateListWarehouse}
                            handleSearch={(value) => {
                              setStateListWarehouse({ data: [] })
                              handleGetListWarehouse(value)
                            }}
                            fetchMore={(value) => {
                              fetchMoreDataWarehouse(value)
                            }}
                            onClickSelectItem={(item: any) => {
                              setValueFilter('warehouse', item)
                              clearErrorsFilter('warehouse')

                              // setState({
                              //   ...state,
                              //   openCategory: false,
                              // })
                            }}
                            propsGetValue={getValuesFilter('warehouse')}
                            propName="name"
                          />
                        </SelectCustom>
                      </FormControl>
                    </Box>
                  )}
                />
              </Box>
              <Box mb={2}>
                <InputLabelCustom
                  htmlFor="reason"
                  sx={{
                    color: '#49516F',
                    fontSize: '1.2rem',
                  }}
                >
                  {t('details.reason')}
                </InputLabelCustom>
                <Controller
                  control={controlFilter}
                  name="reason"
                  defaultValue={[]}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <SelectCustom
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderRadius: '4px',
                            fontSize: '1.4rem',
                            borderWidth: '1px !important',
                            borderColor: '#E1E6EF',
                          },
                        }}
                        IconComponent={() => (
                          <KeyboardArrowDownIcon
                            sx={{ border: '1.5px #49516F' }}
                          />
                        )}
                        id="reason"
                        multiple
                        {...field}
                        value={field.value}
                        onChange={(event: any) => {
                          const {
                            target: { value },
                          } = event
                          setValueFilter(
                            'reason',
                            typeof value === 'string' ? value.split(',') : value
                          )
                        }}
                      >
                        {reasonFilter.map((item, index) => (
                          <MenuItemSelectCustom
                            key={index + 1}
                            value={item.name}
                          >
                            {item.name}
                          </MenuItemSelectCustom>
                        ))}
                      </SelectCustom>
                    </FormControl>
                  )}
                />
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
                    onClick={() => setStateDrawerFilterStock(false)}
                  >
                    {t('details.cancel')}
                  </ButtonCustom>
                </Grid>
                <Grid xs={4}>
                  <ButtonCancel
                    type="reset"
                    onClick={handleReset}
                    fullWidth
                    sx={{ color: '#49516F' }}
                  >
                    {t('details.reset')}
                  </ButtonCancel>
                </Grid>
                <Grid xs={4}>
                  <ButtonCustom variant="contained" fullWidth type="submit">
                    {t('details.filter')}
                  </ButtonCustom>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Drawer>
        <Drawer
          anchor="right"
          open={stateDrawerSelectDistribution}
          onClose={handleCloseDrawerSelectDistribution}
        >
          <CustomBoxDrawer>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ marginBottom: '15px' }}
            >
              <IconButton onClick={handleCloseDrawerSelectDistribution}>
                <ArrowRight size={24} />
              </IconButton>
              <TypographyH2 textAlign="center">
                {t('details.selectDistribution')}
              </TypographyH2>
            </Stack>
            <form
              onSubmit={handleSubmitSelectDC(
                handleClickBuyMoreSelectDistribution
              )}
            >
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={controlSelectDC}
                  name="distribution_channels"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="distribution_channels"
                        sx={{ marginBottom: '10px' }}
                        error={!!errorsDC.distribution_channels}
                      >
                        {t('details.distributionChannel')}
                        <RequiredLabel />
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="distribution_channels"
                          error={!!errorsDC.distribution_channels}
                          displayEmpty
                          {...field}
                          IconComponent={() => <KeyboardArrowDownIcon />}
                        >
                          {stateVariantDetail?.distribution_channels.map(
                            (item, index) => {
                              return (
                                <MenuItem key={index} value={item.id}>
                                  {item.name}{' '}
                                  {`(Price : ${item.price.toFixed(2)}$)`}
                                </MenuItem>
                              )
                            }
                          )}
                        </SelectCustom>
                      </FormControl>
                      <FormHelperText error={!!errorsDC.distribution_channels}>
                        {errorsDC?.distribution_channels &&
                          errorsDC?.distribution_channels?.message}
                      </FormHelperText>{' '}
                    </>
                  )}
                />
              </Box>
              <Stack direction="row" spacing={1}>
                <ButtonCustom
                  variant="outlined"
                  size="large"
                  onClick={handleCloseDrawerSelectDistribution}
                >
                  {t('details.cancel')}
                </ButtonCustom>
                <ButtonCustom variant="contained" size="large" type="submit">
                  {t('details.submit')}
                </ButtonCustom>
              </Stack>
            </form>
          </CustomBoxDrawer>
        </Drawer>
      </>
    )
  }
}

export default VariantDetailComponent
