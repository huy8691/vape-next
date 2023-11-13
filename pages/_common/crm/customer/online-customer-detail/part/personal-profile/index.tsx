import {
  Box,
  FormControl,
  Pagination,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'

import React, { ChangeEvent, useEffect, useState } from 'react'

import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  formatPhoneNumber,
  handlerGetErrMessage,
  isEmptyObject,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import {
  ButtonCustom,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
} from 'src/components'
import Grid from '@mui/material/Unstable_Grid2'
import { formatMoney } from 'src/utils/money.utils'
import moment from 'moment'
import {
  OnlineCustomerDetailType,
  OrderHistoryByClientResponseType,
  SetVipType,
} from '../../customerDetailModel'
import {
  getDetailOnlineCustomer,
  getOrderHistoryByClient,
  setVipClient,
} from '../../customerDetailAPI'
import { useTranslation } from 'next-i18next'

const PersonalProfile = () => {
  const { t } = useTranslation('customer')
  const [stateDetailClient, setStateDetailClient] =
    useState<OnlineCustomerDetailType>()
  const [stateOrderHistory, setStateOrderHistory] =
    useState<OrderHistoryByClientResponseType>()
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const handleGetDetailOnlineCustomer = () => {
    if (router.query.id) {
      getDetailOnlineCustomer(Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          setStateDetailClient(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }
  useEffect(() => {
    handleGetDetailOnlineCustomer()
  }, [router.query.id])
  const handleGetOrderHistoryByClient = (query: object) => {
    if (router.query.id) {
      getOrderHistoryByClient(Number(router.query.id), query)
        .then((res) => {
          const { data } = res
          setStateOrderHistory(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }
  useEffect(() => {
    if (!isEmptyObject(router.query)) {
      handleGetOrderHistoryByClient(router.query)
    } else {
      handleGetOrderHistoryByClient({})
    }
  }, [router.query])
  const handleSetVipType = () => {
    if (!stateDetailClient) return
    const submitValue: SetVipType = {
      is_vip: !stateDetailClient?.is_vip,
    }
    setVipClient(Number(router.query.id), submitValue)
      .then(() => {
        pushMessage(t('message.setVipSuccessfully'), 'success')
        handleGetDetailOnlineCustomer()

        getOrderHistoryByClient(Number(router.query.id))
          .then((res) => {
            const { data } = res
            setStateOrderHistory(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  //pagination
  const handleChangePagination = (
    event: ChangeEvent<unknown>,
    page: number
  ) => {
    console.log(event)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }

  /**
   * It takes the event from the select component, and then it replaces the current URL with a new URL
   * that has the new limit and page number
   */
  const handleChangeRowsPerPage = (event: SelectChangeEvent<unknown>) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid xs={3}>
          {' '}
          <Stack
            spacing={1}
            sx={{
              background: '#F8FAFB',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '15px',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>
                {stateDetailClient?.first_name} {stateDetailClient?.last_name}
              </Typography>
              {stateDetailClient?.is_vip && (
                <ButtonCustom variant="outlined">VIP</ButtonCustom>
              )}
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>{t('details.businessName')}</Typography>
              <Typography>
                {stateDetailClient?.business_name
                  ? stateDetailClient?.business_name
                  : 'N/A '}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>{t('details.email')}</Typography>
              <Typography>
                {stateDetailClient?.email ? stateDetailClient.email : 'N/A'}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>{t('details.phoneNumber')}</Typography>
              <Typography>
                {formatPhoneNumber(String(stateDetailClient?.phone_number))}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography>{t('details.address')}</Typography>
              <Typography>
                {stateDetailClient?.address ? stateDetailClient.address : 'N/A'}
              </Typography>
            </Stack>
          </Stack>
          <ButtonCustom
            size="large"
            sx={{ width: '100%', marginBottom: '15px' }}
            variant={'outlined'}
            onClick={() => handleSetVipType()}
          >
            {stateDetailClient?.is_vip
              ? t('details.unmarkVip')
              : t('details.markAsVip')}
          </ButtonCustom>
          <Stack
            direction="row"
            justifyContent="space-between"
            sx={{
              background: '#F8FAFB',
              padding: '15px',
              borderRadius: '5px',
            }}
          >
            <Typography sx={{ fontSize: '2rem' }}>
              {t('details.totalPaidAmount')}
            </Typography>
            <Typography sx={{ fontSize: '2rem' }}>
              {' '}
              {formatMoney(stateDetailClient?.total_paid_amount)}
            </Typography>
          </Stack>
        </Grid>
        <Grid xs={9}>
          <TableContainerTws sx={{ marginTop: '0 !important' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws align="center">
                    {t('details.orderNo')}
                  </TableCellTws>
                  <TableCellTws align="center">
                    {t('details.date')}
                  </TableCellTws>
                  <TableCellTws align="center">
                    {t('details.totalBilling')}
                  </TableCellTws>
                  <TableCellTws align="center">
                    {t('details.paymentMethod')}
                  </TableCellTws>
                  <TableCellTws align="center">
                    {t('details.paymentStatus')}
                  </TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateOrderHistory?.data.map((item, index) => {
                  return (
                    <TableRowTws
                      key={index}
                      hover
                      onClick={() => {
                        router.push(
                          `/${platform().toLowerCase()}/purchase-orders/detail/${
                            item.id
                          }`
                        )
                      }}
                    >
                      <TableCellTws align="center">#{item.code}</TableCellTws>
                      <TableCellTws align="center">
                        {moment(item.created_at).format('MM/DD/YYYY - hh:mm A')}
                      </TableCellTws>
                      <TableCellTws align="center">
                        {formatMoney(item.total_billing)}
                      </TableCellTws>
                      <TableCellTws
                        align="center"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {item.payment_method.name.toLowerCase()}
                      </TableCellTws>
                      <TableCellTws
                        align="center"
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {item.payment_status === 'WAITING_FOR_PAYMENT'
                          ? t('details.waitingForPayment')
                          : item.payment_status.toLowerCase()}
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
              count={stateOrderHistory ? stateOrderHistory.totalPages : 0}
            />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PersonalProfile
