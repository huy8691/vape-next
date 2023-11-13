import React, { useState, useEffect } from 'react'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/router'
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
  Divider,
  FormControl,
  Pagination,
  TableFooter,
  Chip,
} from '@mui/material'
import ImageDefault from 'public/images/logo.svg'
import { formatMoney } from 'src/utils/money.utils'
import { statusOrder, statusPayment } from 'src/utils/status.utils'
import {
  TypographyTitlePage,
  TableRowTws,
  TableCellTws,
  TableContainerTws,
  MenuItemSelectCustom,
  SelectPaginationCustom,
} from 'src/components'
import {
  SoldProductListResponseType,
  OrdersListResponseType,
  SettlementMoneyResponseType,
} from './settlementReportModels'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  getSoldProducts,
  getOrders,
  getSettlementMoney,
} from './settlementReportAPI'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import OverView from '../overView'
import { useTranslation } from 'next-i18next'
// import OverView from '../overView'

const SettlementReport = () => {
  const router = useRouter()
  const { t } = useTranslation('report')
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateOrdersList, setStateOrdersList] =
    useState<OrdersListResponseType>()
  const [stateSoldProductList, setStateSoldProductList] =
    useState<SoldProductListResponseType>()
  const [stateSettlementMoney, setStateSettlementMoney] = useState<
    SettlementMoneyResponseType['data']
  >({
    cash: 0,
    credit: 0,
    refund: 0,
  })

  const [statePaginationSoldProducts, setStatePaginationSoldProducts] =
    useState<{
      page: number
      limit: number
    }>({ page: 1, limit: 10 })
  const [statePaginationOrders, setStatePaginationOrders] = useState<{
    page: number
    limit: number
  }>({ page: 1, limit: 10 })
  const handleGetSoldProductList = (query: {
    fromDate: string
    toDate: string
    type?: string
    page?: number
    limit?: number
  }) => {
    console.log('12')
    dispatch(loadingActions.doLoading())
    getSoldProducts(query)
      .then((res) => {
        const data = res.data
        setStateSoldProductList(data)
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

  const handleGetSettlementMoney = (query: {
    fromDate: string
    toDate: string
    type?: string
  }) => {
    console.log('12')
    dispatch(loadingActions.doLoading())
    getSettlementMoney(query)
      .then((res) => {
        const { data } = res.data
        setStateSettlementMoney(data)
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
    if (
      router?.query?.tab === 'settlementReport' &&
      router?.query?.fromDate &&
      router?.query?.toDate
    ) {
      handleGetSettlementMoney({
        fromDate: `${router?.query?.fromDate}`,
        toDate: `${router?.query?.toDate}`,
        ...(router?.query?.type !== 'ALL' &&
          platform() === 'RETAILER' && {
            type: `${router?.query?.type}`,
          }),
      })
    }
  }, [router?.query])

  useEffect(() => {
    if (
      router?.query?.tab === 'settlementReport' &&
      router?.query?.fromDate &&
      router?.query?.toDate
    ) {
      handleGetSoldProductList({
        page: 1,
        limit: 10,
        fromDate: `${router?.query?.fromDate}`,
        toDate: `${router?.query?.toDate}`,
        ...(router?.query?.type !== 'ALL' &&
          platform() === 'RETAILER' && {
            type: `${router?.query?.type}`,
          }),
      })
    }
  }, [router?.query])

  useEffect(() => {
    if (
      router?.query?.tab === 'settlementReport' &&
      router?.query?.fromDate &&
      router?.query?.toDate
    ) {
      handleGetSoldProductList({
        fromDate: `${router?.query?.fromDate}`,
        toDate: `${router?.query?.toDate}`,
        ...(router?.query?.type !== 'ALL' &&
          platform() === 'RETAILER' && {
            type: `${router?.query?.type}`,
          }),
        ...statePaginationSoldProducts,
      })
    }
  }, [statePaginationSoldProducts])

  //

  useEffect(() => {
    if (
      router?.query?.tab === 'settlementReport' &&
      router?.query?.fromDate &&
      router?.query?.toDate
    ) {
      handleGetOrderList({
        fromDate: `${router?.query?.fromDate}`,
        toDate: `${router?.query?.toDate}`,
        ...(router?.query?.type !== 'ALL' &&
          platform() === 'RETAILER' && {
            type: `${router?.query?.type}`,
          }),
        page: 1,
        limit: 10,
      })
    }
  }, [router?.query])

  useEffect(() => {
    if (
      router?.query?.tab === 'settlementReport' &&
      router?.query?.fromDate &&
      router?.query?.toDate
    ) {
      handleGetOrderList({
        fromDate: `${router?.query?.fromDate}`,
        toDate: `${router?.query?.toDate}`,
        ...(router?.query?.type !== 'ALL' &&
          platform() === 'RETAILER' && {
            type: `${router?.query?.type}`,
          }),
        ...statePaginationOrders,
      })
    }
  }, [statePaginationOrders])
  return (
    <>
      <OverView
        titlePage={
          <TypographyTitlePage mb={2} variant="h1">
            {t('settlementReport.title')}
          </TypographyTitlePage>
        }
      />
      <Box padding={2} sx={{ background: '#ffffff' }}>
        <Grid container spacing={2} mb={2}>
          <Grid item xs={8}>
            <Typography
              style={{
                fontWeight: '500',
                fontSize: '16px',
              }}
              mb={1}
            >
              {t('settlementReport.soldProducts')}
            </Typography>
            <TableContainerTws sx={{ marginTop: '0px' }}>
              <Table sx={{ background: '#ffffff' }}>
                <TableHead>
                  <TableRow>
                    <TableCellTws>{t('settlementReport.product')}</TableCellTws>
                    <TableCellTws align="center">
                      {t('settlementReport.soldQty')}
                    </TableCellTws>
                    <TableCellTws align="right">
                      {t('settlementReport.soldAmount')}
                    </TableCellTws>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stateSoldProductList?.data?.map((item) => {
                    console.log('sadsdfsdf', item.unit.toLowerCase())
                    return (
                      <TableRowTws
                        key={item.id}
                        style={{
                          cursor: 'pointer',
                        }}
                        onClick={() => {
                          router.push(
                            platform() === 'RETAILER'
                              ? `/retailer/inventory/product/detail/${item.id}`
                              : `/supplier/inventory/product/detail/${item.id}`
                          )
                        }}
                      >
                        <TableCellTws>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Box
                              style={{
                                borderRadius: '50%',
                                border: '1px solid #D9D9D9',
                                width: '30px',
                                height: '30px',
                                overflow: 'hidden',
                              }}
                            >
                              {' '}
                              <Image
                                alt="product-image"
                                src={item.thumbnail || ImageDefault}
                                width={30}
                                height={30}
                              />
                            </Box>
                            <Typography>{item.name}</Typography>
                          </Stack>
                        </TableCellTws>
                        <TableCellTws align="center">
                          {item.sold_quantity}{' '}
                          {t(
                            `settlementReport.${item.unit.toLowerCase()}` as any
                          )}
                        </TableCellTws>
                        <TableCellTws align="right">
                          {formatMoney(item.total_value)}
                        </TableCellTws>
                      </TableRowTws>
                    )
                  })}
                </TableBody>
                <TableFooter sx={{ borderBottom: '1px solid #E1E6EF' }}>
                  <TableRow>
                    <TableCellTws colSpan={3} style={{ padding: '10px 15px' }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing={2}
                      >
                        <Typography>
                          {t('settlementReport.rowsPerPage')}
                        </Typography>
                        <FormControl sx={{ m: 1 }}>
                          <SelectPaginationCustom
                            value={statePaginationSoldProducts?.limit}
                            onChange={(e) => {
                              console.log('33333', e.target.value)
                              setStatePaginationSoldProducts({
                                page: 1,
                                limit: Number(e.target.value),
                              })
                            }}
                          >
                            <MenuItemSelectCustom value={10}>
                              10
                            </MenuItemSelectCustom>
                          </SelectPaginationCustom>
                        </FormControl>
                        <Pagination
                          color="primary"
                          variant="outlined"
                          shape="rounded"
                          defaultPage={1}
                          page={statePaginationSoldProducts?.page}
                          onChange={(e, page: number) => {
                            console.log('e', e)
                            setStatePaginationSoldProducts({
                              ...statePaginationSoldProducts,
                              page: page,
                            })
                          }}
                          count={stateSoldProductList?.totalPages}
                        />
                      </Stack>
                    </TableCellTws>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainerTws>
          </Grid>
          <Grid item xs={4}>
            <Typography
              style={{
                fontWeight: '500',
                fontSize: '16px',
              }}
              mb={1}
            >
              {t('settlementReport.overview')}
            </Typography>
            <Card variant="outlined">
              <CardContent>
                <Stack
                  spacing={2}
                  justifyContent="space-between"
                  direction="row"
                  mb={1}
                >
                  <Typography>{t('settlementReport.cash')}</Typography>
                  <Typography>
                    {formatMoney(stateSettlementMoney.cash)}
                  </Typography>
                </Stack>
                <Stack
                  spacing={2}
                  justifyContent="space-between"
                  direction="row"
                  mb={1}
                >
                  <Typography>{t('settlementReport.credit')}</Typography>
                  <Typography>
                    {formatMoney(stateSettlementMoney.credit)}
                  </Typography>
                </Stack>
                <Divider sx={{ margin: '10px 0px' }} />
                <Stack
                  spacing={2}
                  justifyContent="space-between"
                  direction="row"
                  mb={1}
                >
                  <Typography>{t('settlementReport.subtotal')}</Typography>
                  <Typography>
                    {formatMoney(
                      stateSettlementMoney.cash + stateSettlementMoney.credit
                    )}
                  </Typography>
                </Stack>
                <Stack
                  spacing={2}
                  justifyContent="space-between"
                  direction="row"
                  mb={1}
                >
                  <Typography>{t('settlementReport.refund')}</Typography>
                  <Typography>
                    {formatMoney(stateSettlementMoney.refund)}
                  </Typography>
                </Stack>
                <Divider sx={{ margin: '10px 0px 15px' }} />
                <Stack
                  spacing={2}
                  justifyContent="space-between"
                  direction="row"
                >
                  <Typography sx={{ fontWeight: '600' }}>
                    {t('settlementReport.totalGross')}
                  </Typography>
                  <Typography sx={{ fontWeight: '600' }}>
                    {formatMoney(
                      stateSettlementMoney.cash +
                        stateSettlementMoney.credit -
                        stateSettlementMoney.refund
                    )}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Typography
              style={{
                fontWeight: '500',
                fontSize: '16px',
              }}
              mb={1}
            >
              {t('settlementReport.orders')}
            </Typography>
            <TableContainerTws sx={{ marginTop: '0px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellTws align="center">
                      {t('settlementReport.orderNo')}
                    </TableCellTws>
                    <TableCellTws align="center">
                      {t('settlementReport.date')}
                    </TableCellTws>
                    <TableCellTws align="center">
                      {t('settlementReport.status')}
                    </TableCellTws>
                    <TableCellTws align="right">
                      {t('settlementReport.billing')}
                    </TableCellTws>
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
                          <TableCellTws align="center">
                            #{item.code}
                          </TableCellTws>
                          <TableCellTws align="center">
                            {moment(item.date).format('MM/DD/YYYY - hh:mm A')}
                          </TableCellTws>
                          <TableCellTws align="center">
                            <Chip
                              label={t(
                                `settlementReport.${
                                  statusOrder(item.status).text
                                }` as any
                              )}
                              sx={{
                                backgroundColor: statusOrder(item.status).color,
                                color: '#ffffff',
                                textTransform: 'uppercase',
                              }}
                              size="small"
                            />
                          </TableCellTws>
                          <TableCellTws align="right">
                            <Box>{formatMoney(item.total)}</Box>
                            <Box
                              sx={{
                                color: statusPayment(item.payment_status).color,
                              }}
                            >
                              {t(
                                `settlementReport.${
                                  statusPayment(item.payment_status).text
                                }` as any
                              )}
                            </Box>
                          </TableCellTws>
                        </TableRowTws>
                      </React.Fragment>
                    )
                  })}
                </TableBody>
                <TableFooter sx={{ borderBottom: '1px solid #E1E6EF' }}>
                  <TableRow>
                    <TableCellTws colSpan={4} style={{ padding: '10px 15px' }}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-end"
                        spacing={2}
                      >
                        <Typography>
                          {t('settlementReport.rowsPerPage')}
                        </Typography>
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
                          page={statePaginationOrders?.page}
                          onChange={(e, page: number) => {
                            console.log('e', e)
                            setStatePaginationOrders({
                              ...statePaginationOrders,
                              page: page,
                            })
                          }}
                          count={stateOrdersList?.totalPages}
                        />
                      </Stack>
                    </TableCellTws>
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainerTws>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
export default SettlementReport
