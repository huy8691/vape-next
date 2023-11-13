import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Image from 'next/image'
// mui
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'
import {
  Typography,
  CardContent,
  Card,
  Stack,
  Grid,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Box,
  Chip,
  TextField,
  Divider,
  FormControl,
  Pagination,
  Checkbox,
} from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { styled } from '@mui/material/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dynamic from 'next/dynamic'
import {
  // TypographyTitlePage,
  TableRowTws,
  TableCellTws,
  TableContainerTws,
  TextFieldCustom,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  ButtonCustom,
} from 'src/components'
import {
  SalesTrendListResponseType,
  OrdersTrendListResponseType,
  BestSellerListResponseType,
  OrdersListResponseType,
  ProductListResponseType,
  ProductDetailType,
  ArrayAddMultiVariantToCartType,
  AddMultiVariantToCartType,
  // OverViewOrdersType,
} from './dashBoardModels'
import { CalendarBlank } from '@phosphor-icons/react'
import ImageDefault from 'public/images/logo.svg'
import { statusOrder, statusPayment } from 'src/utils/status.utils'
import { formatMoney } from 'src/utils/money.utils'
import {
  handlerGetErrMessage,
  platform,
  // formatNumberLarge,
  // percentIncrease,
} from 'src/utils/global.utils'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  // getOverView,
  getSalesTrend,
  getOrdersTrend,
  getBestSeller,
  getOrders,
  getProductSlowMoving,
  getProductLowStock,
  addToCart,
} from './dashBoardAPI'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import OverView from '../overView'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

// const CardCustom = styled(Card)(() => ({
//   maxWidth: '300px',
//   borderRadius: '10px',
// }))
const CardTwsCustom = styled(Card)(() => ({
  borderRadius: '10px',
  '& .MuiCardContent-root:last-child': {
    paddingBottom: '5px',
  },
}))
const TableCellTwsCustom = styled(TableCellTws)(() => ({
  border: 'none',
  fontSize: '13px',
  padding: '10px 10px',
}))
const CardContentCustom = styled(CardContent)(() => ({
  padding: '10px 5px 0px 5px',
  borderRadius: '10px',
  '&:last-child': {
    paddingBottom: '0px',
  },
}))

const CalendarIcon = () => {
  return <CalendarBlank size={16} />
}

const TextFieldDate = styled(TextField)({
  width: '100px',
  '& .MuiInput-underline': {
    fontSize: '12px',
    '&:hover': {
      '&:before': {
        borderBottomWidth: '1px !important',
      },
    },
    '&:before': {
      border: 'none',
    },
    '&:after': {
      borderWidth: '1px',
    },
    '& .MuiButtonBase-root': {
      marginTop: '-3px',
    },
  },
})

// const CardSection = styled(Card)(({ theme }) => ({
//   backgroundColor:
//     theme.palette.mode === 'light' ? '#F1F3F9' : theme.palette.action.hover,
//   // boxShadow: 'none',
// }))

const Dashboard = () => {
  const router = useRouter()
  const { t } = useTranslation('report')
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  // const [stateOverview, setStateOverview] = useState<OverViewOrdersType[]>([
  //   {
  //     total_sales: 0,
  //     total_orders: 0,
  //     sold_quantity: 0,
  //   },
  //   {
  //     total_sales: 0,
  //     total_orders: 0,
  //     sold_quantity: 0,
  //   },
  // ])
  const [stateSalesTrendList, setStateSalesTrendList] = useState<
    SalesTrendListResponseType['data']
  >([])
  const [stateOrdersTrendList, setStateOrdersTrendList] = useState<
    OrdersTrendListResponseType['data']
  >([])
  const [stateBestSellerList, setStateBestSellerList] = useState<
    BestSellerListResponseType['data']
  >([])
  const [stateOrdersList, setStateOrdersList] =
    useState<OrdersListResponseType>()
  const [stateProductSlowMovingList, setStateProductSlowMovingList] = useState<{
    data: {
      name: string
      id: number
      thumbnail: string
      sold_products: number
      unit_type: string
    }[]
    totalPages?: number
  }>({ data: [] })
  const [stateProductLowStockList, setStateProductLowStockList] = useState<{
    data: {
      id: number
      name: string
      thumbnail: string
      stock: string
      low_stock_alert: string
      unit: string
      is_own?: boolean
      dc_id: number
    }[]
    totalPages?: number
  }>({ data: [] })
  const [stateDateRangeSalesTrend, setStateDateRangeSalesTrend] =
    React.useState<{
      fromDate: Dayjs | null
      toDate: Dayjs | null
    }>({
      fromDate: dayjs().startOf('year'),
      toDate: dayjs().endOf('year'),
    })
  const [stateDateRangeOrdersTrend, setStateDateRangeOrdersTrend] =
    React.useState<{
      fromDate: Dayjs | null
      toDate: Dayjs | null
    }>({
      fromDate: dayjs().startOf('year'),
      toDate: dayjs().endOf('year'),
    })
  const [stateDateRangeOrders, setStateDateRangeOrders] = React.useState<{
    fromDate: Dayjs | null
    toDate: Dayjs | null
  }>({
    fromDate: dayjs().subtract(7, 'd'),
    toDate: dayjs(),
  })
  const [stateDateRangeBestSeller, setStateDateRangeBestSeller] =
    React.useState<{
      fromDate: Dayjs | null
      toDate: Dayjs | null
    }>({
      fromDate: dayjs().subtract(7, 'd'),
      toDate: dayjs(),
    })
  const [statePaginationOrders, setStatePaginationOrders] = useState<{
    page: number
    limit: number
  }>({ page: 1, limit: 10 })
  const [
    statePaginationSlowMovingProducts,
    setStatePaginationSlowMovingProducts,
  ] = useState<{
    page: number
    limit: number
  }>({ page: 1, limit: 10 })
  const [statePaginationSlowStock, setStatePaginationSlowStock] = useState<{
    page: number
    limit: number
  }>({ page: 1, limit: 10 })
  const [stateCurrentSelectedLSALProduct, setStateCurrentSelectedLSALProduct] =
    useState<ProductListResponseType['data']>([])
  const chartSalesTrend = {
    options: {
      xaxis: {
        categories: stateSalesTrendList?.map((item) => {
          return item.month
        }),
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            console.log('vale', val)
            return val.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: [theme.palette.primary.main],
      grid: {
        borderColor: '#E1E6EF',
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      title: {
        text: t('dashboard.salesTrend'),
        style: {
          fontWeight: '500',
          fontSize: '16px',
          fontFamily: 'Poppins',
        },
      },
      noData: {
        text: 'No data',
      },
    },
    series: [
      {
        name: 'Sales Trend',
        data: stateSalesTrendList?.map((item) => {
          return item.total
        }),
      },
    ],
  }
  const chartOrdersTrend = {
    options: {
      xaxis: {
        categories: stateOrdersTrendList?.map((item) => {
          return item.month
        }),
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            console.log('vale', val)
            return val.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      colors: [theme.palette.primary.main],
      grid: {
        borderColor: '#E1E6EF',
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      title: {
        text: t('dashboard.ordersTrend'),
        style: {
          fontWeight: '500',
          fontSize: '16px',
          fontFamily: 'Poppins',
        },
      },
      noData: {
        text: 'No data',
      },
    },
    series: [
      {
        name: t('dashboard.salesTrend'),
        data: stateOrdersTrendList?.map((item) => {
          return item.numOrder
        }),
      },
    ],
  }
  const chartBestSeller = {
    series: [
      {
        name: t('dashboard.bestSeller'),
        data: stateBestSellerList?.map((item) => {
          return item.sold_quantity
        }),
      },
    ],
    options: {
      plotOptions: {
        bar: {
          horizontal: true,
          distributed: true,
        },
      },
      dataLabels: {
        enabled: true,
      },
      grid: {
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
        borderColor: '#E1E6EF',
        strokeDashArray: 5,
      },
      xaxis: {
        categories: stateBestSellerList?.map((item) => {
          return item.name
        }),
      },
      title: {
        text: t('dashboard.bestSeller'),
        style: {
          fontWeight: '500',
          fontSize: '16px',
          fontFamily: 'Poppins',
        },
      },

      legend: {
        show: false,
      },
      noData: {
        text: 'No data',
      },
    },
  }

  // const handleGetOverview = (value?: string) => {
  //   console.log('12')
  //   dispatch(loadingActions.doLoading())
  //   const overviewOrdersLastMonth = getOverView({
  //     fromDate: dayjs()
  //       .subtract(1, 'month')
  //       .startOf('month')
  //       .format('YYYY-MM-DD'),
  //     toDate: dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
  //     ...(value &&
  //       value !== 'ALL' && {
  //         type: value,
  //       }),
  //   }).then((res) => {
  //     const { data } = res.data
  //     return data
  //   })
  //   const overviewOrdersCurrentMonth = getOverView({
  //     fromDate: dayjs().startOf('month').format('YYYY-MM-DD'),
  //     toDate: dayjs().endOf('month').format('YYYY-MM-DD'),
  //     ...(value &&
  //       value !== 'ALL' && {
  //         type: value,
  //       }),
  //   }).then((res) => {
  //     const { data } = res.data
  //     return data
  //   })

  //   Promise.all([overviewOrdersLastMonth, overviewOrdersCurrentMonth])
  //     .then((values) => {
  //       console.log('6547', values)
  //       setStateOverview(values)
  //       dispatch(loadingActions.doLoadingSuccess())
  //       return values
  //     })
  //     .catch((response) => {
  //       dispatch(loadingActions.doLoadingFailure())
  //       const { status, data } = response
  //       pushMessage(handlerGetErrMessage(status, data), 'error')
  //     })
  // }

  const handleGetSalesTrendList = (query: {
    fromDate: string
    toDate: string
    type?: string
  }) => {
    console.log('12')
    dispatch(loadingActions.doLoading())
    getSalesTrend(query)
      .then((res) => {
        const { data } = res.data
        setStateSalesTrendList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        console.log('response', response)
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleGetOrdersTrendList = (query: {
    fromDate: string
    toDate: string
    type?: string
  }) => {
    console.log('12')
    dispatch(loadingActions.doLoading())
    getOrdersTrend(query)
      .then((res) => {
        const { data } = res.data
        console.log('345')
        setStateOrdersTrendList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        console.log('response', response)
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleGetBestSellerList = (query: {
    fromDate: string
    toDate: string
    type?: string
  }) => {
    console.log('12')
    dispatch(loadingActions.doLoading())
    getBestSeller(query)
      .then((res) => {
        const { data } = res.data
        setStateBestSellerList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        console.log('response', response)
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleGetOrderList = (query: {
    fromDate: string
    toDate: string
    type?: string
    page?: number
    limit?: number
  }) => {
    console.log('12')
    dispatch(loadingActions.doLoading())
    getOrders(query)
      .then((res) => {
        const data = res.data
        setStateOrdersList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        console.log('response', response)
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleGetProductLowStockList = () => {
    dispatch(loadingActions.doLoading())
    getProductLowStock(statePaginationSlowStock)
      .then((res) => {
        const data = res.data
        console.log('345')
        setStateProductLowStockList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        console.log('response', response)
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleGetProductSlowMovingList = () => {
    dispatch(loadingActions.doLoading())
    getProductSlowMoving(statePaginationSlowMovingProducts)
      .then((res) => {
        const data = res.data
        console.log('data', data)
        setStateProductSlowMovingList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        console.log('response', response)
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    handleGetProductLowStockList()
    handleGetProductSlowMovingList()
    if (platform() === 'SUPPLIER') {
      handleGetSalesTrendList({
        fromDate: `${stateDateRangeSalesTrend?.fromDate?.format('YYYY-MM-DD')}`,
        toDate: `${stateDateRangeSalesTrend?.toDate?.format('YYYY-MM-DD')}`,
      })
      handleGetOrdersTrendList({
        fromDate: `${stateDateRangeOrdersTrend?.fromDate?.format(
          'YYYY-MM-DD'
        )}`,
        toDate: `${stateDateRangeOrdersTrend?.toDate?.format('YYYY-MM-DD')}`,
      })
      handleGetBestSellerList({
        fromDate: `${stateDateRangeBestSeller?.fromDate?.format('YYYY-MM-DD')}`,
        toDate: `${stateDateRangeBestSeller?.toDate?.format('YYYY-MM-DD')}`,
      })
    }
  }, [])

  useEffect(() => {
    if (platform() === 'SUPPLIER') {
      handleGetOrderList({
        fromDate: `${stateDateRangeOrders?.fromDate?.format('YYYY-MM-DD')}`,
        toDate: `${stateDateRangeOrders?.toDate?.format('YYYY-MM-DD')}`,
        ...statePaginationOrders,
      })
    }
  }, [statePaginationOrders])

  useEffect(() => {
    handleGetProductSlowMovingList()
  }, [statePaginationSlowMovingProducts])

  useEffect(() => {
    handleGetProductLowStockList()
  }, [statePaginationSlowStock])

  useEffect(() => {
    if (platform() === 'RETAILER' && router?.query?.type) {
      handleGetSalesTrendList({
        fromDate: `${stateDateRangeSalesTrend?.fromDate?.format('YYYY-MM-DD')}`,
        toDate: `${stateDateRangeSalesTrend?.toDate?.format('YYYY-MM-DD')}`,
        ...(router?.query?.type !== 'ALL' && {
          type: `${router?.query?.type}`,
        }),
      })
      handleGetOrdersTrendList({
        fromDate: `${stateDateRangeOrdersTrend?.fromDate?.format(
          'YYYY-MM-DD'
        )}`,
        toDate: `${stateDateRangeOrdersTrend?.toDate?.format('YYYY-MM-DD')}`,
        ...(router?.query?.type !== 'ALL' && {
          type: `${router?.query?.type}`,
        }),
      })
      handleGetBestSellerList({
        fromDate: `${stateDateRangeBestSeller?.fromDate?.format('YYYY-MM-DD')}`,
        toDate: `${stateDateRangeBestSeller?.toDate?.format('YYYY-MM-DD')}`,
        ...(router?.query?.type !== 'ALL' && {
          type: `${router?.query?.type}`,
        }),
      })
    }
  }, [router?.query.type])

  useEffect(() => {
    if (platform() === 'RETAILER' && router?.query?.type) {
      handleGetOrderList({
        fromDate: `${stateDateRangeOrders?.fromDate?.format('YYYY-MM-DD')}`,
        toDate: `${stateDateRangeOrders?.toDate?.format('YYYY-MM-DD')}`,
        ...(router?.query?.type !== 'ALL' && {
          type: `${router?.query?.type}`,
        }),
        ...statePaginationOrders,
      })
    }
  }, [statePaginationOrders])

  useEffect(() => {
    if (platform() === 'RETAILER' && router?.query?.type) {
      handleGetOrderList({
        fromDate: `${stateDateRangeOrders?.fromDate?.format('YYYY-MM-DD')}`,
        toDate: `${stateDateRangeOrders?.toDate?.format('YYYY-MM-DD')}`,
        ...(router?.query?.type !== 'ALL' && {
          type: `${router?.query?.type}`,
        }),
        page: 1,
        limit: 10,
      })
    }
  }, [router?.query.type])
  const handleCheckIsContainInLSALSelectedProduct = (index: number) => {
    return stateCurrentSelectedLSALProduct.some((item) => item.id === index)
  }
  const handleChangeLSALSelectedProduct = (item: ProductDetailType) => {
    const cloneCurrentSelectedLSALProductList: ProductListResponseType['data'] =
      JSON.parse(JSON.stringify(stateCurrentSelectedLSALProduct))
    if (handleCheckIsContainInLSALSelectedProduct(item.id)) {
      const result = cloneCurrentSelectedLSALProductList.findIndex(
        (obj) => obj.id === item.id
      )

      cloneCurrentSelectedLSALProductList.splice(result, 1)
      setStateCurrentSelectedLSALProduct(cloneCurrentSelectedLSALProductList)
    } else {
      cloneCurrentSelectedLSALProductList.push(item)
      setStateCurrentSelectedLSALProduct(cloneCurrentSelectedLSALProductList)
    }
  }
  const handleOrderSelectedLSALProduct = () => {
    const submitValue: AddMultiVariantToCartType[] =
      stateCurrentSelectedLSALProduct.map((item) => {
        return {
          product_variant: item.id,
          quantity: 1,
          distribution_channel: item.dc_id,
        }
      })
    const convertValue: ArrayAddMultiVariantToCartType = {
      list_variants: submitValue,
    }
    addToCart(convertValue)
      .then(() => {
        pushMessage(t('dashboard.message.addToCartSuccessfully'), 'success')
        router.push('/retailer/market-place/cart')
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
      {/* <Stack mb={2} direction="row" spacing={2}>
        <CardCustom variant="outlined">
          <CardContent>
            <Typography mb={1}>Total Sales</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ minWidth: '20px' }}>
                <Image
                  src={
                    '/' +
                    (stateOverview[1].total_sales > stateOverview[0].total_sales
                      ? '/images/uptrend.svg'
                      : '/images/downtrend.svg')
                  }
                  alt="Twss"
                  width="20"
                  height="20"
                />
              </Box>

              <Tooltip
                title={`Last month: ${formatNumberLarge(
                  stateOverview[0].total_sales
                )}`}
                arrow
                placement="right"
              >
                <Typography variant="h5" sx={{ fontWeight: '600' }}>
                  {formatNumberLarge(stateOverview[1].total_sales)}
                </Typography>
              </Tooltip>
              <Typography
                variant="subtitle2"
                sx={{ color: '#BABABA', fontSize: '12px' }}
              >
                {percentIncrease(
                  stateOverview[0].total_sales,
                  stateOverview[1].total_sales
                )}
                %
              </Typography>
            </Stack>
            <Typography
              variant="subtitle2"
              sx={{ color: '#BABABA', fontSize: '12px' }}
            >
              Compare from Last Month
            </Typography>
          </CardContent>
        </CardCustom>
        <CardCustom variant="outlined">
          <CardContent>
            <Typography mb={1}>Total Orders</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ minWidth: '20px' }}>
                <Image
                  src={
                    '/' +
                    (stateOverview[1].total_orders >
                    stateOverview[0].total_orders
                      ? '/images/uptrend.svg'
                      : '/images/downtrend.svg')
                  }
                  alt="Twss"
                  width="20"
                  height="20"
                />
              </Box>

              <Tooltip
                title={`Last month: ${formatNumberLarge(
                  stateOverview[0].total_orders
                )}`}
                arrow
                placement="right"
              >
                <Typography variant="h5" sx={{ fontWeight: '600' }}>
                  {formatNumberLarge(stateOverview[1].total_orders)}
                </Typography>
              </Tooltip>
              <Typography
                variant="subtitle2"
                sx={{ color: '#BABABA', fontSize: '12px' }}
              >
                {percentIncrease(
                  stateOverview[0].total_orders,
                  stateOverview[1].total_orders
                )}
                %
              </Typography>
            </Stack>
            <Typography
              variant="subtitle2"
              sx={{ color: '#BABABA', fontSize: '12px' }}
            >
              Compare from Last Month
            </Typography>
          </CardContent>
        </CardCustom>
        <CardCustom variant="outlined">
          <CardContent>
            <Typography mb={1}>Sold Quantitys</Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ minWidth: '20px' }}>
                <Image
                  src={
                    '/' +
                    (stateOverview[1].sold_quantity >
                    stateOverview[0].sold_quantity
                      ? '/images/uptrend.svg'
                      : '/images/downtrend.svg')
                  }
                  alt="Twss"
                  width="20"
                  height="20"
                />
              </Box>

              <Tooltip
                title={`Last month: ${formatNumberLarge(
                  stateOverview[0].sold_quantity
                )}`}
                arrow
                placement="right"
              >
                <Typography variant="h5" sx={{ fontWeight: '600' }}>
                  {formatNumberLarge(stateOverview[1].sold_quantity)}
                </Typography>
              </Tooltip>
              <Typography
                variant="subtitle2"
                sx={{ color: '#BABABA', fontSize: '12px' }}
              >
                {percentIncrease(
                  stateOverview[0].sold_quantity,
                  stateOverview[1].sold_quantity
                )}
                %
              </Typography>
            </Stack>
            <Typography
              variant="subtitle2"
              sx={{ color: '#BABABA', fontSize: '12px' }}
            >
              Compare from Last Month
            </Typography>
          </CardContent>
        </CardCustom>
      </Stack> */}
      <OverView />
      <Box padding={2} sx={{ background: '#ffffff' }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <CardTwsCustom variant="outlined">
              <CardContentCustom>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="flex-end"
                  useFlexGap
                  flexWrap="wrap"
                  sx={{
                    marginBottom: '-28px',
                    marginTop: '10px',
                    paddingRight: '40px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={['year']}
                      minDate={dayjs('2021')
                        .startOf('year')
                        .format('YYYY-MM-DD')}
                      maxDate={dayjs().endOf('year').format('YYYY-MM-DD')}
                      value={stateDateRangeSalesTrend?.fromDate?.format('YYYY')}
                      onChange={(newValue) => {
                        if (!newValue) return
                        setStateDateRangeSalesTrend({
                          fromDate: dayjs(newValue).startOf('year'),
                          toDate: dayjs(newValue).endOf('year'),
                        })
                        handleGetSalesTrendList({
                          fromDate: dayjs(newValue)
                            .startOf('year')
                            .format('YYYY-MM-DD'),
                          toDate: dayjs(newValue)
                            .endOf('year')
                            .format('YYYY-MM-DD'),
                          ...(router?.query?.type !== 'ALL' &&
                            platform() === 'RETAILER' && {
                              type: `${router?.query?.type}`,
                            }),
                        })
                        console.log('value', newValue)
                      }}
                      renderInput={(params) => (
                        <TextFieldCustom
                          sx={{
                            width: '100px',
                            fontSize: '12px',
                            '& .MuiInputBase-root': {
                              fontSize: '12px',
                              '& .MuiInputBase-input': {
                                padding: '7px 10px',
                              },
                            },
                          }}
                          {...params}
                        />
                      )}
                      components={{
                        OpenPickerIcon: CalendarIcon,
                      }}
                    />
                  </LocalizationProvider>
                </Stack>
                <Chart
                  options={chartSalesTrend.options}
                  series={chartSalesTrend.series}
                  type="bar"
                  height="350"
                />
              </CardContentCustom>
            </CardTwsCustom>
          </Grid>
          <Grid item xs={6}>
            <CardTwsCustom variant="outlined">
              <CardContentCustom>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="flex-end"
                  useFlexGap
                  flexWrap="wrap"
                  sx={{
                    marginBottom: '-28px',
                    marginTop: '10px',
                    paddingRight: '40px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      views={['year']}
                      minDate={dayjs('2021')
                        .startOf('year')
                        .format('YYYY-MM-DD')}
                      maxDate={dayjs().endOf('year').format('YYYY-MM-DD')}
                      value={stateDateRangeOrdersTrend?.fromDate?.format(
                        'YYYY'
                      )}
                      onChange={(newValue) => {
                        if (!newValue) return
                        setStateDateRangeOrdersTrend({
                          fromDate: dayjs(newValue).startOf('year'),
                          toDate: dayjs(newValue).endOf('year'),
                        })
                        handleGetOrdersTrendList({
                          fromDate: dayjs(newValue)
                            .startOf('year')
                            .format('YYYY-MM-DD'),
                          toDate: dayjs(newValue)
                            .endOf('year')
                            .format('YYYY-MM-DD'),
                          ...(router?.query?.type !== 'ALL' &&
                            platform() === 'RETAILER' && {
                              type: `${router?.query?.type}`,
                            }),
                        })
                        console.log('value', newValue)
                      }}
                      renderInput={(params) => (
                        <TextFieldCustom
                          sx={{
                            width: '100px',
                            fontSize: '12px',
                            '& .MuiInputBase-root': {
                              fontSize: '12px',
                              '& .MuiInputBase-input': {
                                padding: '7px 10px',
                              },
                            },
                          }}
                          {...params}
                        />
                      )}
                      components={{
                        OpenPickerIcon: CalendarIcon,
                      }}
                    />
                  </LocalizationProvider>
                </Stack>
                <Chart
                  options={chartOrdersTrend.options}
                  series={chartOrdersTrend.series}
                  type="bar"
                  height="350"
                />
              </CardContentCustom>
            </CardTwsCustom>
          </Grid>
          <Grid item xs={8}>
            <CardTwsCustom variant="outlined">
              <CardContentCustom>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent="flex-end"
                  useFlexGap
                  flexWrap="wrap"
                  sx={{
                    marginBottom: '-28px',
                    marginTop: '10px',
                    paddingRight: '40px',
                    zIndex: 1,
                    position: 'relative',
                  }}
                >
                  <Box>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{
                          border: '1px solid #E1E6EF',
                          padding: '5px 10px 1px',
                          borderRadius: '8px',
                        }}
                      >
                        <Typography sx={{ fontSize: '12px' }}>
                          {t('dashboard.from')}:
                        </Typography>
                        <DatePicker
                          inputFormat="MM/DD/YYYY"
                          renderInput={(props) => (
                            <TextFieldDate
                              size="small"
                              variant="standard"
                              {...props}
                            />
                          )}
                          value={stateDateRangeBestSeller.fromDate}
                          onChange={(newValue) => {
                            if (
                              newValue &&
                              stateDateRangeBestSeller.toDate &&
                              newValue > stateDateRangeBestSeller.toDate
                            ) {
                              setStateDateRangeBestSeller({
                                fromDate: newValue,
                                toDate: newValue,
                              })
                            } else {
                              setStateDateRangeBestSeller({
                                ...stateDateRangeBestSeller,
                                fromDate: newValue,
                              })
                            }
                            handleGetBestSellerList({
                              fromDate: `${newValue?.format('YYYY-MM-DD')}`,
                              toDate: `${stateDateRangeBestSeller.toDate?.format(
                                'YYYY-MM-DD'
                              )}`,
                              ...(router?.query?.type !== 'ALL' &&
                                platform() === 'RETAILER' && {
                                  type: `${router?.query?.type}`,
                                }),
                            })
                          }}
                          components={{
                            OpenPickerIcon: CalendarIcon,
                          }}
                        />
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{ margin: '5px 5px 7px 15px !important' }}
                        />
                        <Typography sx={{ fontSize: '12px' }}>
                          {t('dashboard.to')}:
                        </Typography>
                        <DatePicker
                          inputFormat="MM/DD/YYYY"
                          renderInput={(props) => (
                            <TextFieldDate
                              size="small"
                              variant="standard"
                              {...props}
                            />
                          )}
                          value={stateDateRangeBestSeller.toDate}
                          onChange={(newValue) => {
                            setStateDateRangeBestSeller({
                              ...stateDateRangeBestSeller,
                              toDate: newValue,
                            })
                            handleGetBestSellerList({
                              fromDate: `${stateDateRangeBestSeller.fromDate?.format(
                                'YYYY-MM-DD'
                              )}`,
                              toDate: `${newValue?.format('YYYY-MM-DD')}`,
                              ...(router?.query?.type !== 'ALL' &&
                                platform() === 'RETAILER' && {
                                  type: `${router?.query?.type}`,
                                }),
                            })
                          }}
                          components={{
                            OpenPickerIcon: CalendarIcon,
                          }}
                          shouldDisableDate={(day) => {
                            if (!stateDateRangeBestSeller.fromDate) return false
                            return day < stateDateRangeBestSeller.fromDate
                          }}
                        />
                      </Stack>
                    </LocalizationProvider>
                  </Box>

                  <Chip
                    label={t('dashboard.currentMonth')}
                    variant="outlined"
                    size="small"
                    onClick={() => {
                      setStateDateRangeBestSeller({
                        fromDate: dayjs().startOf('month'),
                        toDate: dayjs().endOf('month'),
                      })
                      handleGetBestSellerList({
                        fromDate: dayjs().startOf('month').format('YYYY-MM-DD'),
                        toDate: dayjs().endOf('month').format('YYYY-MM-DD'),
                        ...(router?.query?.type !== 'ALL' &&
                          platform() === 'RETAILER' && {
                            type: `${router?.query?.type}`,
                          }),
                      })
                    }}
                  />
                </Stack>
                <Chart
                  options={chartBestSeller.options}
                  series={chartBestSeller.series}
                  type="bar"
                  height="500"
                />
              </CardContentCustom>
            </CardTwsCustom>
          </Grid>
          <Grid item xs={4}>
            <CardTwsCustom variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Image
                      src={'/' + '/images/WarningOctagon.svg'}
                      alt="Twss"
                      width="30"
                      height="30"
                    />
                    <Typography
                      style={{
                        fontWeight: '500',
                        fontSize: '16px',
                      }}
                    >
                      {t('dashboard.slowMovingProducts')}
                    </Typography>
                  </Stack>
                </Stack>
                <TableContainerTws
                  sx={{ border: 'none', padding: '0px', marginTop: '20px' }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCellTwsCustom>
                          {t('dashboard.product')}
                        </TableCellTwsCustom>
                        <TableCellTwsCustom align="right">
                          {t('dashboard.soldQty')}
                        </TableCellTwsCustom>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stateProductSlowMovingList?.data?.map((item) => {
                        return (
                          <React.Fragment key={item.id}>
                            <TableRowTws>
                              <TableCellTwsCustom>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  <Box
                                    style={{
                                      borderRadius: '50%',
                                      border: '1px solid #D9D9D9',
                                      minWidth: '30px',
                                      minHeight: '30px',
                                      width: '30px',
                                      height: '30px',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <Link
                                      href={
                                        platform() === 'RETAILER'
                                          ? `/retailer/inventory/product/detail/${item.id}`
                                          : `/supplier/inventory/product/detail/${item.id}`
                                      }
                                    >
                                      <Image
                                        style={{ cursor: 'pointer' }}
                                        alt="product-image"
                                        src={item.thumbnail || ImageDefault}
                                        width={30}
                                        height={30}
                                      />
                                    </Link>
                                  </Box>
                                  <Link
                                    href={
                                      platform() === 'RETAILER'
                                        ? `/retailer/inventory/product/detail/${item.id}`
                                        : `/supplier/inventory/product/detail/${item.id}`
                                    }
                                  >
                                    <Typography
                                      sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                          color: '#222222',
                                        },
                                      }}
                                    >
                                      {item.name}
                                    </Typography>
                                  </Link>
                                </Stack>
                              </TableCellTwsCustom>
                              <TableCellTwsCustom align="right">
                                <span
                                  style={{
                                    color: '#E02D3C',
                                    marginRight: '5px',
                                  }}
                                >
                                  {item.sold_products}
                                </span>
                                <span style={{ textTransform: 'lowercase' }}>
                                  {t(`dashboard.${item.unit_type}` as any)}
                                </span>
                              </TableCellTwsCustom>
                            </TableRowTws>
                          </React.Fragment>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainerTws>
                {stateProductSlowMovingList?.totalPages &&
                  stateProductSlowMovingList?.totalPages > 1 && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      spacing={2}
                      mb={2}
                    >
                      <FormControl sx={{ m: 1 }}>
                        <SelectPaginationCustom
                          value={statePaginationSlowMovingProducts?.limit}
                          onChange={(e) => {
                            console.log('33333', e.target.value)
                            setStatePaginationSlowMovingProducts({
                              page: 1,
                              limit: Number(e.target.value),
                            })
                          }}
                        >
                          <MenuItemSelectCustom value={10}>
                            10
                          </MenuItemSelectCustom>
                          <MenuItemSelectCustom value={20}>
                            20
                          </MenuItemSelectCustom>
                          <MenuItemSelectCustom value={50}>
                            50
                          </MenuItemSelectCustom>
                          <MenuItemSelectCustom value={100}>
                            100
                          </MenuItemSelectCustom>
                        </SelectPaginationCustom>
                      </FormControl>
                      <Pagination
                        color="primary"
                        variant="outlined"
                        shape="rounded"
                        defaultPage={1}
                        page={statePaginationSlowMovingProducts?.page}
                        onChange={(e, page: number) => {
                          console.log(e)
                          setStatePaginationSlowMovingProducts({
                            ...statePaginationSlowMovingProducts,
                            page: page,
                          })
                        }}
                        count={stateProductSlowMovingList?.totalPages}
                      />
                    </Stack>
                  )}
              </CardContent>
            </CardTwsCustom>
          </Grid>
          <Grid item xs={8}>
            <CardTwsCustom variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography
                    style={{
                      fontWeight: '500',
                      fontSize: '16px',
                    }}
                  >
                    {t('dashboard.orders')}
                  </Typography>
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="flex-end"
                    useFlexGap
                    flexWrap="wrap"
                  >
                    <Box>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{
                            border: '1px solid #E1E6EF',
                            padding: '5px 10px 1px',
                            borderRadius: '8px',
                          }}
                        >
                          <Typography sx={{ fontSize: '12px' }}>
                            {t('dashboard.from')}:
                          </Typography>
                          <DatePicker
                            inputFormat="MM/DD/YYYY"
                            renderInput={(props) => (
                              <TextFieldDate
                                size="small"
                                variant="standard"
                                {...props}
                              />
                            )}
                            value={stateDateRangeOrders.fromDate}
                            onChange={(newValue) => {
                              if (
                                newValue &&
                                stateDateRangeOrders.toDate &&
                                newValue > stateDateRangeOrders.toDate
                              ) {
                                setStateDateRangeOrders({
                                  fromDate: newValue,
                                  toDate: newValue,
                                })
                              } else {
                                setStateDateRangeOrders({
                                  ...stateDateRangeOrders,
                                  fromDate: newValue,
                                })
                              }
                              handleGetOrderList({
                                fromDate: `${newValue?.format('YYYY-MM-DD')}`,
                                toDate: `${stateDateRangeOrders.toDate?.format(
                                  'YYYY-MM-DD'
                                )}`,
                                ...(router?.query?.type !== 'ALL' &&
                                  platform() === 'RETAILER' && {
                                    type: `${router?.query?.type}`,
                                  }),
                                page: 1,
                                limit: 10,
                              })
                            }}
                            components={{
                              OpenPickerIcon: CalendarIcon,
                            }}
                          />
                          <Divider
                            orientation="vertical"
                            flexItem
                            sx={{ margin: '5px 5px 7px 15px !important' }}
                          />
                          <Typography sx={{ fontSize: '12px' }}>
                            {t('dashboard.to')}:
                          </Typography>
                          <DatePicker
                            inputFormat="MM/DD/YYYY"
                            renderInput={(props) => (
                              <TextFieldDate
                                size="small"
                                variant="standard"
                                {...props}
                              />
                            )}
                            value={stateDateRangeOrders.toDate}
                            onChange={(newValue: any) => {
                              setStateDateRangeOrders({
                                ...stateDateRangeOrders,
                                toDate: newValue,
                              })
                              handleGetOrderList({
                                fromDate: `${stateDateRangeOrders.fromDate?.format(
                                  'YYYY-MM-DD'
                                )}`,
                                toDate: `${newValue?.format('YYYY-MM-DD')}`,
                                ...(router?.query?.type !== 'ALL' &&
                                  platform() === 'RETAILER' && {
                                    type: `${router?.query?.type}`,
                                  }),
                                page: 1,
                                limit: 10,
                              })
                            }}
                            components={{
                              OpenPickerIcon: CalendarIcon,
                            }}
                            shouldDisableDate={(day) => {
                              if (!stateDateRangeOrders.fromDate) return false
                              return day < stateDateRangeOrders.fromDate
                            }}
                          />
                        </Stack>
                      </LocalizationProvider>
                    </Box>

                    <Chip
                      label={t('dashboard.currentMonth')}
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setStateDateRangeOrders({
                          fromDate: dayjs().startOf('month'),
                          toDate: dayjs().endOf('month'),
                        })
                        handleGetOrderList({
                          fromDate: dayjs()
                            .startOf('month')
                            .format('YYYY-MM-DD'),
                          toDate: dayjs().endOf('month').format('YYYY-MM-DD'),
                          ...(router?.query?.type !== 'ALL' &&
                            platform() === 'RETAILER' && {
                              type: `${router?.query?.type}`,
                            }),
                          page: 1,
                          limit: 10,
                        })
                      }}
                    />
                  </Stack>
                </Stack>
                <TableContainerTws
                  sx={{ border: 'none', padding: '0px', marginTop: '15px' }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCellTwsCustom align="center">
                          {t('dashboard.orderNo')}
                        </TableCellTwsCustom>
                        <TableCellTwsCustom align="center">
                          {t('dashboard.date')}
                        </TableCellTwsCustom>
                        <TableCellTwsCustom align="center">
                          {t('dashboard.status')}
                        </TableCellTwsCustom>
                        <TableCellTwsCustom align="right">
                          {t('dashboard.billing')}
                        </TableCellTwsCustom>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stateOrdersList?.data?.map((item) => {
                        return (
                          <React.Fragment key={item.code}>
                            <TableRowTws
                              style={{
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                router.push(
                                  platform() === 'RETAILER'
                                    ? `/retailer/market-place/online-orders/detail/${item.id}`
                                    : `/supplier/market-place/orders/detail/${item.id}`
                                )
                              }}
                            >
                              <TableCellTwsCustom align="center">
                                #{item.code}
                              </TableCellTwsCustom>
                              <TableCellTwsCustom align="center">
                                {moment(item.date).format(
                                  'MM/DD/YYYY - hh:mm A'
                                )}
                              </TableCellTwsCustom>
                              <TableCellTwsCustom align="center">
                                <Chip
                                  label={t(
                                    `dashboard.${
                                      statusOrder(item.status).text
                                    }` as any
                                  )}
                                  sx={{
                                    backgroundColor: statusOrder(item.status)
                                      .color,
                                    color: '#ffffff',
                                    // textTransform: 'uppercase',
                                  }}
                                  size="small"
                                />
                              </TableCellTwsCustom>
                              <TableCellTwsCustom align="right">
                                <Box>{formatMoney(item.total)}</Box>
                                <Box
                                  sx={{
                                    color: statusPayment(item.payment_status)
                                      .color,
                                  }}
                                >
                                  {t(
                                    `dashboard.${
                                      statusPayment(item.payment_status).text
                                    }` as any
                                  )}
                                </Box>
                              </TableCellTwsCustom>
                            </TableRowTws>
                          </React.Fragment>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainerTws>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="flex-end"
                  spacing={2}
                  mb={2}
                >
                  <Typography>{t('dashboard.rowsPerPage')}</Typography>
                  <FormControl sx={{ m: 1 }}>
                    <SelectPaginationCustom
                      value={statePaginationOrders?.limit}
                      onChange={(e) => {
                        console.log('33333', e.target.value)
                        setStatePaginationOrders({
                          page: 1,
                          limit: Number(e.target.value),
                        })
                      }}
                    >
                      <MenuItemSelectCustom value={10}>10</MenuItemSelectCustom>
                      <MenuItemSelectCustom value={20}>20</MenuItemSelectCustom>
                      <MenuItemSelectCustom value={50}>50</MenuItemSelectCustom>
                      <MenuItemSelectCustom value={100}>
                        100
                      </MenuItemSelectCustom>
                    </SelectPaginationCustom>
                  </FormControl>
                  <Pagination
                    color="primary"
                    variant="outlined"
                    shape="rounded"
                    defaultPage={1}
                    page={statePaginationOrders?.page}
                    onChange={(e, page: number) => {
                      console.log(e)
                      setStatePaginationOrders({
                        ...statePaginationOrders,
                        page: page,
                      })
                    }}
                    count={stateOrdersList?.totalPages}
                  />
                </Stack>
              </CardContent>
            </CardTwsCustom>
          </Grid>
          <Grid item xs={4}>
            <CardTwsCustom variant="outlined">
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Image
                      src={'/' + '/images/WarningOctagon.svg'}
                      alt="Twss"
                      width="30"
                      height="30"
                    />
                    <Typography
                      style={{
                        fontWeight: '500',
                        fontSize: '16px',
                      }}
                    >
                      {t('dashboard.lowStockAlert')}
                    </Typography>
                  </Stack>

                  {platform() === 'RETAILER' && (
                    <ButtonCustom
                      variant="contained"
                      onClick={handleOrderSelectedLSALProduct}
                      disabled={stateCurrentSelectedLSALProduct.length === 0}
                    >
                      {t('dashboard.orderProduct')}
                    </ButtonCustom>
                  )}
                </Stack>

                <TableContainerTws
                  sx={{ border: 'none', padding: '0px', marginTop: '20px' }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCellTwsCustom>
                          {t('dashboard.product')}
                        </TableCellTwsCustom>
                        <TableCellTwsCustom align="right">
                          {t('dashboard.stock')}
                        </TableCellTwsCustom>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stateProductLowStockList?.data?.map((item) => {
                        return (
                          <React.Fragment key={item.id}>
                            <TableRowTws>
                              <TableCellTwsCustom>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  {!item.is_own && (
                                    <Checkbox
                                      checked={handleCheckIsContainInLSALSelectedProduct(
                                        item.id
                                      )}
                                      onChange={(e) => {
                                        console.log(e)

                                        handleChangeLSALSelectedProduct(item)
                                      }}
                                      inputProps={{
                                        'aria-label': 'controlled',
                                      }}
                                    />
                                  )}

                                  <Box
                                    style={{
                                      borderRadius: '50%',
                                      border: '1px solid #D9D9D9',
                                      minWidth: '30px',
                                      minHeight: '30px',
                                      width: '30px',
                                      height: '30px',
                                      overflow: 'hidden',
                                    }}
                                  >
                                    <Link
                                      href={
                                        platform() === 'RETAILER'
                                          ? `/retailer/inventory/product/detail/${item.id}`
                                          : `/supplier/inventory/product/detail/${item.id}`
                                      }
                                    >
                                      <Image
                                        style={{ cursor: 'pointer' }}
                                        alt="product-image"
                                        src={item.thumbnail || ImageDefault}
                                        width={30}
                                        height={30}
                                      />
                                    </Link>
                                  </Box>
                                  <Link
                                    href={
                                      platform() === 'RETAILER'
                                        ? `/retailer/inventory/product/detail/${item.id}`
                                        : `/supplier/inventory/product/detail/${item.id}`
                                    }
                                  >
                                    <Typography
                                      sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                          color: '#222222',
                                        },
                                      }}
                                    >
                                      {item.name}
                                    </Typography>
                                  </Link>
                                </Stack>
                              </TableCellTwsCustom>
                              <TableCellTwsCustom align="right">
                                <span
                                  style={{
                                    color: '#E02D3C',
                                    marginRight: '5px',
                                  }}
                                >
                                  {item.stock}
                                </span>
                                <span style={{ textTransform: 'lowercase' }}>
                                  {t(`dashboard.${item.unit}` as any)}
                                </span>
                              </TableCellTwsCustom>
                            </TableRowTws>
                          </React.Fragment>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainerTws>
                {stateProductLowStockList?.totalPages && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    spacing={2}
                    mb={2}
                  >
                    <FormControl sx={{ m: 1 }}>
                      <SelectPaginationCustom
                        value={statePaginationSlowStock?.limit}
                        onChange={(e) => {
                          console.log('33333', e.target.value)
                          setStatePaginationSlowStock({
                            page: 1,
                            limit: Number(e.target.value),
                          })
                        }}
                      >
                        <MenuItemSelectCustom value={10}>
                          10
                        </MenuItemSelectCustom>
                        <MenuItemSelectCustom value={20}>
                          20
                        </MenuItemSelectCustom>
                        <MenuItemSelectCustom value={50}>
                          50
                        </MenuItemSelectCustom>
                        <MenuItemSelectCustom value={100}>
                          100
                        </MenuItemSelectCustom>
                      </SelectPaginationCustom>
                    </FormControl>
                    <Pagination
                      color="primary"
                      variant="outlined"
                      shape="rounded"
                      defaultPage={1}
                      page={statePaginationSlowStock?.page}
                      onChange={(e, page: number) => {
                        console.log(e)
                        setStatePaginationSlowStock({
                          ...statePaginationSlowStock,
                          page: page,
                        })
                      }}
                      count={stateProductLowStockList?.totalPages}
                      size="small"
                    />
                  </Stack>
                )}
              </CardContent>
            </CardTwsCustom>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default Dashboard
