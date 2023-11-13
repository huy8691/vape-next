import React, { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/router'
// mui
import {
  Typography,
  FormControl,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Pagination,
  SelectChangeEvent,
  Box,
} from '@mui/material'
import { formatMoney } from 'src/utils/money.utils'

import {
  TypographyTitlePage,
  TableRowTws,
  TableCellTws,
  TableContainerTws,
  SelectPaginationCustom,
  MenuItemSelectCustom,
} from 'src/components'
import { SellersInsightsResponseType } from './sellersReportModels'
import {
  handlerGetErrMessage,
  objToStringParam,
  // platform,
} from 'src/utils/global.utils'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { getSellersInsights } from './sellersReportAPI'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import OverView from '../overView'
import { useTranslation } from 'next-i18next'
// import OverView from '../overView'

const SellersReport = () => {
  const router = useRouter()
  const { t } = useTranslation('report')
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()

  const [stateSellersInsights, setStateSellersInsights] =
    useState<SellersInsightsResponseType>()

  const handleGetSellersInsights = (query: {
    fromDate: string
    toDate: string
    page?: number
    limit?: number
  }) => {
    console.log('12')
    dispatch(loadingActions.doLoading())
    getSellersInsights(query)
      .then((res) => {
        const data = res.data
        setStateSellersInsights(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        console.log('response', response)
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleChangeRowsPerPage = (event: SelectChangeEvent<unknown>) => {
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

  // handleChangePagination
  const handleChangePagination = (
    event: ChangeEvent<unknown>,
    page: number
  ) => {
    console.log('event', event)
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

  useEffect(() => {
    if (
      router?.query?.tab === 'sellerReport' &&
      router?.query?.fromDate &&
      router?.query?.toDate
    ) {
      handleGetSellersInsights({
        fromDate: `${router?.query?.fromDate}`,
        toDate: `${router?.query?.toDate}`,
        ...(router?.query?.page && {
          page: Number(router?.query?.page),
        }),
        ...(router?.query?.limit && {
          limit: Number(router?.query?.limit),
        }),
      })
    }
  }, [router?.query])
  return (
    <>
      <OverView
        titlePage={
          <TypographyTitlePage mb={2} variant="h1">
            {t('fieldSales.sellersReport')}
          </TypographyTitlePage>
        }
      />
      <Box padding={2} sx={{ background: '#ffffff' }}>
        <Typography
          style={{
            fontWeight: '500',
            fontSize: '16px',
          }}
          mb={1}
        >
          {t('fieldSales.sellerInsights')}
        </Typography>
        <TableContainerTws sx={{ marginTop: '0px' }}>
          <Table sx={{ background: '#ffffff' }}>
            <TableHead>
              <TableRow>
                <TableCellTws> {t('fieldSales.seller')}</TableCellTws>
                <TableCellTws align="center">
                  {t('fieldSales.purchaseOrders')}
                </TableCellTws>
                <TableCellTws align="right">
                  {t('fieldSales.completedOrders')}
                </TableCellTws>
                <TableCellTws align="right">
                  {t('fieldSales.totalSales')}
                </TableCellTws>
                <TableCellTws align="right">
                  {t('fieldSales.totalCommission')}
                </TableCellTws>
              </TableRow>
            </TableHead>
            <TableBody>
              {stateSellersInsights?.data?.map((item) => {
                return (
                  <TableRowTws
                    key={item.id}
                    // style={{
                    //   cursor: 'pointer',
                    // }}
                    // onClick={() => {
                    //   router.push(
                    //     platform() === 'RETAILER'
                    //       ? `/retailer/market-place/order/detail/${item.id}`
                    //       : `/supplier/market-place/order/detail/${item.id}`
                    //   )
                    // }}
                  >
                    <TableCellTws>
                      {item.first_name} {item.last_name}
                    </TableCellTws>
                    <TableCellTws align="center">
                      {item.total_purchase_order}
                    </TableCellTws>
                    <TableCellTws align="right">
                      {item.total_order}
                    </TableCellTws>
                    <TableCellTws align="right">
                      {formatMoney(item.total_sales)}
                    </TableCellTws>
                    <TableCellTws align="right">
                      {formatMoney(item.total_commissions)}
                    </TableCellTws>
                  </TableRowTws>
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
        >
          <Typography>{t('fieldSales.rowsPerPage')}</Typography>
          <FormControl sx={{ m: 1 }}>
            <SelectPaginationCustom
              value={
                Number(router.query.limit) ? Number(router.query.limit) : 10
              }
              onChange={handleChangeRowsPerPage}
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
            onChange={(e, page: number) => handleChangePagination(e, page)}
            count={stateSellersInsights ? stateSellersInsights?.totalPages : 0}
          />
        </Stack>
      </Box>
    </>
  )
}
export default SellersReport
