import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Pagination from '@mui/material/Pagination'
import { SelectChangeEvent } from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableHead from '@mui/material/TableHead'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import React, { ChangeEvent, useEffect, useState } from 'react'
import {
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import { getOnlineOrders, getRetailOrders } from '../../apiVoucherDetail'
import { OnlineOrderDataType } from '../../modelVoucherDetail'
import { useTranslation } from 'next-i18next'

const TableAppliedOrder: React.FC<{
  type: string
  voucherId: number | undefined
}> = (props) => {
  const { t } = useTranslation('voucher')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  })
  const [stateOnlineRetailOrders, setStateOnlineRetailOrders] =
    useState<OnlineOrderDataType>()
  const [pushMessage] = useEnqueueSnackbar()

  const dispatch = useAppDispatch()

  const handleChangeRowsPerPage = (event: SelectChangeEvent<unknown>) => {
    setPagination(() => ({
      page: 1,
      limit: Number(event.target.value),
    }))
  }

  const handleChangePagination = (
    _event: ChangeEvent<unknown>,
    page: number
  ) => {
    setPagination((prev) => ({
      ...prev,
      page: page,
    }))
  }

  const handleGetListOnlineOrder = (voucherId?: number) => {
    dispatch(loadingActions.doLoading())

    getOnlineOrders({
      ...pagination,
      applied_voucher: voucherId,
    })
      .then((response) => {
        const data = response.data
        setStateOnlineRetailOrders(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetListRetailOrder = (voucherId?: number) => {
    dispatch(loadingActions.doLoading())
    getRetailOrders({
      ...pagination,
      applied_voucher: voucherId,
    })
      .then((response) => {
        const data = response.data
        setStateOnlineRetailOrders(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    if (!props.voucherId) return
    setStateOnlineRetailOrders({
      data: [],
    })
    if (props.type === 'online-orders') {
      handleGetListOnlineOrder(props.voucherId)
    }

    if (props.type === 'retail-orders') {
      handleGetListRetailOrder(props.voucherId)
    }
  }, [props.type, props.voucherId, pagination])

  return (
    <>
      <TableContainerTws>
        <Table>
          <TableHead>
            <TableRowTws>
              <TableCellTws>{t('orderNo')}</TableCellTws>
              <TableCellTws>{t('date')}</TableCellTws>
              <TableCellTws sx={{ width: '200px' }}>{t('status')}</TableCellTws>
              <TableCellTws align="right">
                {t('totalBillingPaymentStatus')}
              </TableCellTws>
            </TableRowTws>
          </TableHead>
          <TableBody>
            {stateOnlineRetailOrders?.data?.map((item, index: number) => {
              return (
                <React.Fragment key={`item-${index}`}>
                  <TableRowTws>
                    <TableCellTws>#{item.code}</TableCellTws>
                    <TableCellTws>
                      <Stack>
                        <Typography
                          sx={{
                            color: '#595959',
                            fontSize: '16px',
                            fontWeight: 500,
                          }}
                        >
                          {item.orderDate &&
                            moment(item.orderDate).format('MM/DD/YYYY')}
                        </Typography>
                        <Typography
                          sx={{
                            color: '#9098B1',
                            fontSize: '14px',
                            fontWeight: 400,
                          }}
                        >
                          {item.orderDate &&
                            moment(item.orderDate).format('hh:mm a')}
                        </Typography>
                      </Stack>
                    </TableCellTws>
                    <TableCellTws>
                      {item.status === 'APPROVED' ? (
                        <Box
                          style={{
                            backgroundColor: '#1DB46A',
                            padding: '5px 15px',
                            borderRadius: '40px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: '16px',
                              color: '#fff',
                              textAlign: 'center',
                            }}
                          >
                            {t('approved')}
                          </Typography>
                        </Box>
                      ) : (
                        <Box
                          style={{
                            backgroundColor: '#E02D3C',
                            padding: '5px 15px',
                            borderRadius: '40px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: '16px',
                              color: '#fff',
                              textAlign: 'center',
                            }}
                          >
                            {t('deactivated')}
                          </Typography>
                        </Box>
                      )}
                      {/* <Box
                          sx={{
                            borderRadius: '40px',
                            backgroundColor: '#1DB46A',
                            padding: '5px 15px',
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: '16px',
                              color: '#fff',
                              textAlign: 'center',
                            }}
                          >
                            {item.status}
                          </Typography>
                        </Box> */}
                    </TableCellTws>
                    <TableCellTws align="right">
                      <Stack>
                        <Typography
                          sx={{
                            color: '#595959',
                            fontSize: '16px',
                            fontWeight: 500,
                          }}
                        >
                          {formatMoney(item.total_billing)}
                        </Typography>
                        <Typography>{item.payment_status}</Typography>
                      </Stack>
                    </TableCellTws>
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
      >
        <Typography>{t('rowsPerPage')}</Typography>
        <FormControl sx={{ m: 1 }}>
          <SelectPaginationCustom
            value={pagination.limit}
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
          page={pagination.page}
          onChange={(e, page: number) => handleChangePagination(e, page)}
          count={
            stateOnlineRetailOrders ? stateOnlineRetailOrders.totalPages : 0
          }
        />
      </Stack>
    </>
  )
}

export default TableAppliedOrder
