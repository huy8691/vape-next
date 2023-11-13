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
import { SalesByEmployeeClientResponseType } from './salesByEmployeeClientModels'
import { handlerGetErrMessage, objToStringParam } from 'src/utils/global.utils'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { getSalesByEmployeeClient } from './salesByEmployeeClientAPI'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import OverView from '../overView'
import { useTranslation } from 'next-i18next'
// import OverView from '../overView'

const SalesByEmployeeClient = () => {
  const { t } = useTranslation('report')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()

  const [stateSalesByEmployeeClient, setStateSalesByEmployeeClient] =
    useState<SalesByEmployeeClientResponseType>()

  const handleSalesByEmployeeClient = (query: {
    fromDate: string
    toDate: string
    page?: number
    limit?: number
    tab: string
  }) => {
    console.log('12')
    dispatch(loadingActions.doLoading())
    getSalesByEmployeeClient(query)
      .then((res) => {
        const data = res.data
        setStateSalesByEmployeeClient(data)
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
      (router?.query?.tab === 'salesByClients' ||
        router?.query?.tab === 'salesByEmployee') &&
      router?.query?.fromDate &&
      router?.query?.toDate
    ) {
      handleSalesByEmployeeClient({
        fromDate: `${router?.query?.fromDate}`,
        toDate: `${router?.query?.toDate}`,
        ...(router?.query?.page && {
          page: Number(router?.query?.page),
        }),
        ...(router?.query?.limit && {
          limit: Number(router?.query?.limit),
        }),
        tab: router?.query?.tab,
      })
    }
  }, [router?.query])
  return (
    <>
      <OverView
        titlePage={
          <TypographyTitlePage mb={2} variant="h1">
            {router?.query?.tab === 'salesByClients'
              ? t('salesByEmployee.salesByCustomers')
              : t('salesByEmployee.title')}
          </TypographyTitlePage>
        }
      />
      <Box padding={2} sx={{ background: '#ffffff' }}>
        <TableContainerTws sx={{ marginTop: '0px' }}>
          <Table sx={{ background: '#ffffff' }}>
            <TableHead>
              <TableRow>
                <TableCellTws>
                  {router?.query?.tab === 'salesByClients'
                    ? t('salesByEmployee.client')
                    : t('salesByEmployee.employee')}
                </TableCellTws>
                <TableCellTws align="center">
                  {t('salesByEmployee.productQty')}
                </TableCellTws>
                <TableCellTws align="right">
                  {t('salesByEmployee.order')}
                </TableCellTws>
                <TableCellTws align="right">
                  {t('salesByEmployee.refund')}
                </TableCellTws>
                <TableCellTws align="right">
                  {t('salesByEmployee.totalSales')}
                </TableCellTws>
              </TableRow>
            </TableHead>
            <TableBody>
              {stateSalesByEmployeeClient?.data?.map((item) => {
                return (
                  <TableRowTws
                    key={item.id}
                    style={{
                      cursor:
                        router?.query?.tab === 'salesByClients'
                          ? 'pointer'
                          : 'default',
                    }}
                    onClick={() => {
                      router?.query?.tab === 'salesByClients' &&
                        router.push(`/retailer/pos/client/detail/${item.id}`)
                    }}
                  >
                    <TableCellTws>
                      {item.first_name} {item.last_name}
                    </TableCellTws>
                    <TableCellTws align="center">
                      {item.sold_products}
                    </TableCellTws>
                    <TableCellTws align="right">
                      {item.completed_orders}
                    </TableCellTws>
                    <TableCellTws align="right">
                      {formatMoney(item.refund_amount)}
                    </TableCellTws>
                    <TableCellTws align="right">
                      {formatMoney(item.total_sales)}
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
          <Typography>{t('salesByEmployee.rowsPerPage')}</Typography>
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
            count={
              stateSalesByEmployeeClient
                ? stateSalesByEmployeeClient?.totalPages
                : 0
            }
          />
        </Stack>
      </Box>
    </>
  )
}
export default SalesByEmployeeClient
