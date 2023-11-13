import React, { useState, useEffect } from 'react'
// import moment from 'moment'
import Image from 'next/image'
// import { useRouter } from 'next/router'
// mui
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
  FormControl,
  Pagination,
  Avatar,
  // Chip,
  // Checkbox,
} from '@mui/material'
import Link from 'next/link'
import ImageDefault from 'public/images/logo.svg'
// import { formatMoney } from 'src/utils/money.utils'
// import { statusOrder, statusPayment } from 'src/utils/status.utils'
import {
  TypographyTitlePage,
  TableRowTws,
  TableCellTws,
  TableContainerTws,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TextFieldCustom,
  InputLabelCustom,
  ButtonCustom,
  // ButtonCustom,
} from 'src/components'
// import {
//   SoldProductListResponseType,
//   OrdersListResponseType,
//   SettlementMoneyResponseType,
// } from './inventoryReportModels'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  getProductPurchasedLowStock,
  getProductExistingLowStock,
  getSummaryNumber,
  getInventoryWarehouses,
  getInventoryCategories,
  getInventoryProductConsumption,
  getListEnumConsumption,
} from './inventoryReportAPI'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useTranslation } from 'next-i18next'
// import OverView from '../overView'
import { styled } from '@mui/material/styles'
import {
  DataForPieChartType,
  InventoryCategoryResponseType,
  InventoryProductConsumptionFilterType,
  InventoryProductConsumptionsResponseType,
  InventorySummaryResponseRetailType,
  InventoryWarehousesResponseType,
  ListEnumForConsumptionResponseType,
} from './inventoryReportModels'
import dynamic from 'next/dynamic'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment, { Moment } from 'moment'
import { formatMoney } from 'src/utils/money.utils'
const CardCustom = styled(Card)(() => ({
  width: '250px',
  borderRadius: '10px',
}))

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
const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
})

const InventoryReport = () => {
  // const router = useRouter()
  const now = new Date()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  console.log(firstDay) // 👉️ Sun Jan 01 2023 ...

  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  console.log(lastDay) // 👉️ Tue Jan 31 2023 ...
  const { t } = useTranslation('report')
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [
    statePaginationProductPurchasedSlowStock,
    setStatePaginationProductPurchasedSlowStock,
  ] = useState<{
    page: number
    limit: number
  }>({ page: 1, limit: 10 })
  const [
    stateProductPurchasedLowStockList,
    setStateProductPurchasedLowStockList,
  ] = useState<{
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
  const [stateInventorySummary, setStateInventorySummary] =
    useState<InventorySummaryResponseRetailType>()
  //
  const [
    statePaginationProductExistingSlowStock,
    setStatePaginationProductExistingSlowStock,
  ] = useState<{
    page: number
    limit: number
  }>({ page: 1, limit: 10 })
  const [
    stateProductExistingLowStockList,
    setStateProductExistingLowStockList,
  ] = useState<{
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

  const [stateInventoryWarehouses, setStateInventoryWarehouses] =
    useState<InventoryWarehousesResponseType>({ data: [] })
  const [stateInventoryProductByCategory, setStateInventoryProductByCategory] =
    useState<InventoryCategoryResponseType>({ data: [] })
  const [stateListEnumForConsumption, setStateListEnumForConsumption] =
    useState<ListEnumForConsumptionResponseType>({ data: [] })
  const [stateDataForPieChart, setStateDataForPieChart] = useState<
    DataForPieChartType[]
  >([])
  const [stateProductConsumption, setStateProductConsumption] =
    useState<InventoryProductConsumptionsResponseType>({ data: [] })

  const [
    stateFilterForProductConsumption,
    setStateFilterForProductConsumption,
  ] = useState<InventoryProductConsumptionFilterType>({
    fromDate: firstDay,
    toDate: lastDay,
    type: '',
  })
  const [
    stateCurrentProductConsumptionIndex,
    setStateCurrentProductConsumptionIndex,
  ] = useState(0)
  const pieChartWarehouse = {
    series: stateDataForPieChart.map((item) => item.percentage),
    chart: {
      width: 200,
      type: 'pie',
    },
    options: {
      chart: {
        width: 200,
      },

      labels: stateDataForPieChart.map((item) => item.name),
    },
    // responsive: [
    //   {
    //     breakpoint: 480,
    //     options: {
    //       chart: {
    //         width: 200,
    //       },
    //       legend: {
    //         position: 'bottom',
    //       },
    //     },
    //   },
    // ],
  }
  const handleGetProductPurchasedLowStockList = (value: {
    page: number
    limit: number
  }) => {
    dispatch(loadingActions.doLoading())
    getProductPurchasedLowStock(value)
      .then((res) => {
        const data = res.data
        setStateProductPurchasedLowStockList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        console.log('response', response)
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleGetProductExistingLowStockList = (value: {
    page: number
    limit: number
  }) => {
    dispatch(loadingActions.doLoading())
    getProductExistingLowStock(value)
      .then((res) => {
        const data = res.data
        setStateProductExistingLowStockList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        console.log('response', response)
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetSummaryProduct = () => {
    getSummaryNumber()
      .then((res) => {
        const { data } = res
        setStateInventorySummary(data)
      })
      .catch((response) => {
        console.log('response', response)
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetInventoryWarehouse = () => {
    getInventoryWarehouses()
      .then((res) => {
        const { data } = res
        setStateInventoryWarehouses(data)
        const total = data.data.reduce((prev, current) => {
          return Number(prev) + Number(current.total_products)
        }, 0)
        const temporaryArray: DataForPieChartType[] = []
        data.data.forEach((item) => {
          temporaryArray.push({
            name: item.name,
            percentage: (item.total_products * 100) / total,
          })
        })
        setStateDataForPieChart(temporaryArray)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetProductByCategory = () => {
    getInventoryCategories()
      .then((res) => {
        const { data } = res
        setStateInventoryProductByCategory(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    dispatch(loadingActions.doLoading())
    getListEnumConsumption({
      fromDate: moment(stateFilterForProductConsumption.fromDate).format(
        'YYYY-MM-DD'
      ),
      toDate: moment(stateFilterForProductConsumption.toDate).format(
        'YYYY-MM-DD'
      ),
    })
      .then((res) => {
        const { data } = res
        setStateListEnumForConsumption(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }, [stateFilterForProductConsumption])
  useEffect(() => {
    getInventoryProductConsumption({
      fromDate: moment(stateFilterForProductConsumption.fromDate).format(
        'YYYY-MM-DD'
      ),
      toDate: moment(stateFilterForProductConsumption.toDate).format(
        'YYYY-MM-DD'
      ),
      ...(stateFilterForProductConsumption.type && {
        type: stateFilterForProductConsumption.type,
      }),
    })
      .then((res) => {
        const { data } = res
        setStateProductConsumption(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [stateFilterForProductConsumption])
  useEffect(() => {
    handleGetProductPurchasedLowStockList({
      page: 1,
      limit: 10,
    })

    handleGetProductExistingLowStockList({
      page: 1,
      limit: 10,
    })
    handleGetSummaryProduct()
    handleGetInventoryWarehouse()
    handleGetProductByCategory()
  }, [])
  const handleChangeProductConsumptionStatus = (index: number) => {
    setStateCurrentProductConsumptionIndex(index)
    setStateFilterForProductConsumption((prev) => {
      return {
        ...prev,
        type: stateListEnumForConsumption.data[index].key,
      }
    })
  }
  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        {/* {props?.titlePage} */}
        <TypographyTitlePage>{t('inventoryReport.title')}</TypographyTitlePage>
      </Stack>
      <Box p={2} sx={{ background: '#ffffff', paddingBottom: '0px' }}>
        <Stack mb={0} direction="row" spacing={2}>
          <CardCustom variant="outlined">
            <CardContent sx={{ paddingBottom: '10px !important' }}>
              <Typography mb={1}>
                {t('inventoryReport.totalProducts')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: '600' }}>
                {stateInventorySummary?.data.total_products
                  ? stateInventorySummary.data.total_products
                  : 0}
              </Typography>
            </CardContent>
          </CardCustom>
          {platform() === 'RETAILER' && (
            <CardCustom variant="outlined">
              <CardContent sx={{ paddingBottom: '10px !important' }}>
                <Typography mb={1}>
                  {t('inventoryReport.existingProducts')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: '600' }}>
                  {stateInventorySummary?.data.existing_products
                    ? stateInventorySummary?.data.existing_products
                    : 0}
                </Typography>
              </CardContent>
            </CardCustom>
          )}
          {platform() === 'RETAILER' && (
            <CardCustom variant="outlined">
              <CardContent sx={{ paddingBottom: '10px !important' }}>
                <Typography mb={1}>
                  {t('inventoryReport.purchasedProducts')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: '600' }}>
                  {stateInventorySummary?.data.purchased_products
                    ? stateInventorySummary?.data.purchased_products
                    : 0}
                </Typography>
              </CardContent>
            </CardCustom>
          )}

          <CardCustom variant="outlined">
            <CardContent sx={{ paddingBottom: '10px !important' }}>
              <Typography mb={1}>
                {t('inventoryReport.lowStockProducts')}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: '600' }}>
                {stateInventorySummary?.data.low_stock_products
                  ? stateInventorySummary?.data.low_stock_products
                  : 0}
              </Typography>
            </CardContent>
          </CardCustom>
        </Stack>
      </Box>
      <Box padding={2} mb={2} sx={{ background: '#ffffff' }}>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={8}>
            <CardTwsCustom variant="outlined" sx={{ mb: 2 }}>
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

                  {/* {platform() === 'RETAILER' && (
                    <ButtonCustom
                      variant="contained"
                      onClick={handleOrderSelectedLSALProduct}
                      disabled={stateCurrentSelectedLSALProduct.length === 0}
                    >
                      {t('dashboard.orderProduct')}
                    </ButtonCustom>
                  )} */}
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
                      {stateProductPurchasedLowStockList?.data?.map((item) => {
                        return (
                          <React.Fragment key={item.id}>
                            <TableRowTws hover>
                              <TableCellTwsCustom>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  {/* {!item.is_own && (
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
                                  )} */}

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
                                  {t(`inventoryReport.${item.unit}` as any)}
                                </span>
                              </TableCellTwsCustom>
                            </TableRowTws>
                          </React.Fragment>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainerTws>
                {stateProductPurchasedLowStockList?.totalPages &&
                  stateProductPurchasedLowStockList?.totalPages > 1 && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      spacing={2}
                      mb={2}
                    >
                      <FormControl sx={{ m: 1 }}>
                        <SelectPaginationCustom
                          value={
                            statePaginationProductPurchasedSlowStock?.limit
                          }
                          onChange={(e) => {
                            setStatePaginationProductPurchasedSlowStock({
                              page: 1,
                              limit: Number(e.target.value),
                            })
                            handleGetProductPurchasedLowStockList({
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
                        page={statePaginationProductPurchasedSlowStock?.page}
                        onChange={(e, page: number) => {
                          console.log(e)
                          setStatePaginationProductPurchasedSlowStock({
                            ...statePaginationProductPurchasedSlowStock,
                            page: page,
                          })
                          handleGetProductPurchasedLowStockList({
                            ...statePaginationProductPurchasedSlowStock,
                            page: page,
                          })
                        }}
                        count={stateProductPurchasedLowStockList?.totalPages}
                        size="small"
                      />
                    </Stack>
                  )}
              </CardContent>
            </CardTwsCustom>
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

                  {/* {platform() === 'RETAILER' && (
                    <ButtonCustom
                      variant="contained"
                      onClick={handleOrderSelectedLSALProduct}
                      disabled={stateCurrentSelectedLSALProduct.length === 0}
                    >
                      {t('dashboard.orderProduct')}
                    </ButtonCustom>
                  )} */}
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
                      {stateProductExistingLowStockList?.data?.map((item) => {
                        return (
                          <React.Fragment key={item.id}>
                            <TableRowTws hover>
                              <TableCellTwsCustom>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  {/* {!item.is_own && (
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
                                  )} */}

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
                                  {t(`inventoryReport.${item.unit}` as any)}
                                </span>
                              </TableCellTwsCustom>
                            </TableRowTws>
                          </React.Fragment>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainerTws>
                {stateProductExistingLowStockList?.totalPages &&
                  stateProductExistingLowStockList?.totalPages > 1 && (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                      spacing={2}
                      mb={2}
                    >
                      <FormControl sx={{ m: 1 }}>
                        <SelectPaginationCustom
                          value={statePaginationProductExistingSlowStock?.limit}
                          onChange={(e) => {
                            setStatePaginationProductExistingSlowStock({
                              page: 1,
                              limit: Number(e.target.value),
                            })
                            handleGetProductExistingLowStockList({
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
                        page={statePaginationProductExistingSlowStock?.page}
                        onChange={(e, page: number) => {
                          console.log(e)
                          setStatePaginationProductExistingSlowStock({
                            ...statePaginationProductExistingSlowStock,
                            page: page,
                          })
                          handleGetProductPurchasedLowStockList({
                            ...statePaginationProductExistingSlowStock,
                            page: page,
                          })
                        }}
                        count={stateProductExistingLowStockList?.totalPages}
                        size="small"
                      />
                    </Stack>
                  )}
              </CardContent>
            </CardTwsCustom>
          </Grid>
          <Grid item xs={4}>
            <CardTwsCustom variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '1.6rem',
                    marginBottom: '10px',
                  }}
                >
                  {t('inventoryReport.warehouse')}
                </Typography>
                <TableContainerTws
                  sx={{ border: 'none', padding: '0px', marginTop: '20px' }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCellTwsCustom align="left">
                          {t('inventoryReport.warehouse')}
                        </TableCellTwsCustom>
                        <TableCellTwsCustom align="right">
                          {t('inventoryReport.products')}
                        </TableCellTwsCustom>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stateInventoryWarehouses.data.map((item, index) => {
                        return (
                          <TableRowTws key={index} hover>
                            <TableCellTwsCustom align="left">
                              <Typography
                                sx={{
                                  width: '200px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {item.name}
                              </Typography>
                            </TableCellTwsCustom>
                            <TableCellTwsCustom align="right">
                              <Typography
                                sx={{
                                  color: '#E02D3C',
                                  display: 'inline',
                                  marginRight: '5px',
                                }}
                              >
                                {item.total_products ? item.total_products : 0}
                              </Typography>
                              <Typography sx={{ display: 'inline' }}>
                                {t('inventoryReport.products')}
                              </Typography>
                            </TableCellTwsCustom>
                          </TableRowTws>
                        )
                      })}
                    </TableBody>
                  </Table>
                </TableContainerTws>

                <Chart
                  series={pieChartWarehouse.series}
                  options={pieChartWarehouse.options}
                  type="pie"
                />
              </CardContent>
            </CardTwsCustom>
            <CardTwsCustom>
              <CardContent>
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: '1.6rem',
                    marginBottom: '15px',
                  }}
                >
                  {t('inventoryReport.productByCategory')}
                </Typography>
                <TableContainerTws
                  sx={{ border: 'none', padding: '0px', marginTop: '20px' }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCellTwsCustom>
                          {' '}
                          {t('inventoryReport.category')}
                        </TableCellTwsCustom>
                        <TableCellTwsCustom align="right">
                          {t('inventoryReport.product')}
                        </TableCellTwsCustom>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stateInventoryProductByCategory.data.map(
                        (item, index) => {
                          return (
                            <TableRowTws key={index} hover>
                              <TableCellTwsCustom align="left">
                                <Typography
                                  sx={{
                                    width: '200px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                  }}
                                >
                                  {item.name}
                                </Typography>
                              </TableCellTwsCustom>
                              <TableCellTwsCustom align="right">
                                <Typography
                                  sx={{
                                    color: '#E02D3C',
                                    display: 'inline',
                                    marginRight: '5px',
                                  }}
                                >
                                  {item.total_product ? item.total_product : 0}
                                </Typography>
                                <Typography sx={{ display: 'inline' }}>
                                  {t('inventoryReport.products')}
                                </Typography>
                              </TableCellTwsCustom>
                            </TableRowTws>
                          )
                        }
                      )}
                    </TableBody>
                  </Table>
                </TableContainerTws>
              </CardContent>
            </CardTwsCustom>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <CardTwsCustom variant="outlined" sx={{ mb: 2 }}>
          <CardContent>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography sx={{ fontSize: '1.6rem', fontWeight: 500 }}>
                {t('inventoryReport.productConsumption')}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Box>
                  <InputLabelCustom>
                    {' '}
                    {t('inventoryReport.fromDate')}
                  </InputLabelCustom>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="YYYY-MM-DD"
                      value={stateFilterForProductConsumption.fromDate}
                      onChange={(value: Moment | null) => {
                        if (!value) {
                          const date = new Date()

                          setStateFilterForProductConsumption((prev) => {
                            return {
                              ...prev,
                              fromDate: date,
                            }
                          })
                        } else {
                          console.log('value', value)
                          setStateFilterForProductConsumption((prev) => {
                            return {
                              ...prev,
                              fromDate: value.toDate(),
                            }
                          })
                        }
                      }}
                      //   shouldDisableDate={(day: any) => {
                      //     const date = new Date()
                      //     if (
                      //       moment(day).format('YYYY-MM-DD') >
                      //       moment(date).format('YYYY-MM-DD')
                      //     ) {
                      //       return true
                      //     }
                      //     return false
                      //   }}
                      renderInput={(params: any) => {
                        return <TextFieldCustom {...params} />
                      }}
                    />
                  </LocalizationProvider>
                </Box>
                <Box>
                  <InputLabelCustom>
                    {' '}
                    {t('inventoryReport.toDate')}
                  </InputLabelCustom>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="YYYY-MM-DD"
                      value={stateFilterForProductConsumption.toDate}
                      onChange={(value: Moment | null) => {
                        if (!value) {
                          const date = new Date()

                          setStateFilterForProductConsumption((prev) => {
                            return {
                              ...prev,
                              toDate: date,
                            }
                          })
                        } else {
                          console.log('value', value)
                          setStateFilterForProductConsumption((prev) => {
                            return {
                              ...prev,
                              toDate: value.toDate(),
                            }
                          })
                        }
                      }}
                      //   shouldDisableDate={(day: any) => {
                      //     const date = new Date()
                      //     if (
                      //       moment(day).format('YYYY-MM-DD') >
                      //       moment(date).format('YYYY-MM-DD')
                      //     ) {
                      //       return true
                      //     }
                      //     return false
                      //   }}
                      renderInput={(params: any) => {
                        return <TextFieldCustom {...params} />
                      }}
                    />
                  </LocalizationProvider>
                </Box>
              </Stack>
            </Stack>
            <Stack direction="row" spacing={2} mb={2}>
              {stateListEnumForConsumption.data.map((item, index) => {
                return (
                  <ButtonCustom
                    key={index}
                    onClick={() => handleChangeProductConsumptionStatus(index)}
                    variant={
                      stateCurrentProductConsumptionIndex === index
                        ? 'contained'
                        : 'outlined'
                    }
                  >
                    <Typography>
                      {t(`inventoryReport.${item.key}` as any)} ({item.values})
                    </Typography>
                  </ButtonCustom>
                )
              })}
            </Stack>
            <Box>
              <TableContainerTws>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCellTwsCustom>
                        <Typography> {t('inventoryReport.product')}</Typography>
                      </TableCellTwsCustom>
                      <TableCellTwsCustom>
                        <Typography> {t('inventoryReport.qtyUsed')}</Typography>
                      </TableCellTwsCustom>
                      <TableCellTwsCustom>
                        <Typography align="right">
                          {' '}
                          {t('inventoryReport.basePrice')}
                        </Typography>
                      </TableCellTwsCustom>
                      <TableCellTwsCustom>
                        <Typography align="right">
                          {' '}
                          {t('inventoryReport.total')}
                        </Typography>
                      </TableCellTwsCustom>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stateProductConsumption.data.map((item, index) => {
                      return (
                        <TableRowTws key={index}>
                          <TableCellTwsCustom>
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <Avatar
                                src={item.product_thumbnail}
                                alt={item.product_name}
                              />
                              <Stack spacing={0.5}>
                                <Typography
                                  sx={{
                                    width: '300px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    fontWeight: 500,
                                  }}
                                >
                                  {item.product_name}
                                </Typography>
                                <Typography
                                  sx={{ color: '#BABABA', fontWeight: 500 }}
                                >
                                  #{item.product_code}
                                </Typography>
                              </Stack>
                            </Stack>
                          </TableCellTwsCustom>
                          <TableCellTwsCustom>
                            {item.quantity_used} {item.unit.toLowerCase()}
                          </TableCellTwsCustom>
                          <TableCellTwsCustom align="right">
                            {formatMoney(item.base_price)}
                          </TableCellTwsCustom>
                          <TableCellTwsCustom align="right">
                            {formatMoney(item.base_price * item.quantity_used)}
                          </TableCellTwsCustom>
                        </TableRowTws>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainerTws>
            </Box>
          </CardContent>
        </CardTwsCustom>
      </Box>
    </>
  )
}
export default InventoryReport
