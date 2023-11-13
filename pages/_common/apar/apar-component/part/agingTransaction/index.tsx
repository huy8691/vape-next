import {
  Box,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment, { Moment } from 'moment'
import React, { useEffect, useState } from 'react'
import {
  ButtonCustom,
  InputLabelCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldCustom,
} from 'src/components'
import { Share } from '@phosphor-icons/react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import { useRouter } from 'next/router'
import {
  exportAgingTransaction,
  getReportAgingTransaction,
} from './agingTransactionAPI'
import {
  FilterDataType,
  TransactionDetailResponseType,
} from './agingTransactionModel'
import { useTranslation } from 'react-i18next'
import ExternalOrderDetailComponent from 'pages/_common/apar/external-order/detail'

const AgingTransactionComponent: React.FC = () => {
  const { t } = useTranslation('account')
  const router = useRouter()
  const now = new Date()
  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  const [openDetailExternal, setOpenDetailExternal] = useState(false)
  const [itemExternalOrder, setItemExternalOrder] = useState<
    number | undefined
  >(undefined)
  const [flagRefreshDelete, setFlagRefreshDelete] = useState('')
  const [stateAgingTransaction, setStateAgingTransaction] =
    useState<TransactionDetailResponseType>()
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
  console.log(firstDay) // 👉️ Sun Jan 01 2023 ...

  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  console.log(lastDay) // 👉️ Tue Jan 31 2023 ...
  const [stateFilter, setStateFilter] = useState<FilterDataType>({
    fromDate: firstDay,
    toDate: lastDay,
  })
  const [stateTotal, setStateTotal] = useState(0)
  useEffect(() => {
    dispatch(loadingActions.doLoading())
    getReportAgingTransaction({
      fromDate: moment(stateFilter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(stateFilter.toDate).format('YYYY-MM-DD'),
    })
      .then((res) => {
        const { data } = res
        setStateAgingTransaction(data)
        dispatch(loadingActions.doLoadingSuccess())
        const total = data.data.reduce((previous, obj) => {
          return Number(previous) + Number(obj.amount)
        }, 0)
        setStateTotal(total)
      })

      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }, [stateFilter, flagRefreshDelete])

  const handleExportCurrentReport = () => {
    exportAgingTransaction({
      fromDate: moment(stateFilter.fromDate).format('YYYY-MM-DD'),
      toDate: moment(stateFilter.toDate).format('YYYY-MM-DD'),
      export: true,
    })
      .then((res) => {
        const { data } = res
        const openUrl = window.open(data.data.url, '_blank')
        if (openUrl) {
          openUrl.focus()
        }
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  return (
    <>
      <Stack
        direction="row"
        alignItems="flex-end"
        justifyContent="space-between"
        sx={{ marginBottom: 1 }}
        spacing={2}
      >
        <Stack direction="row" spacing={2} alignItems="flex-end">
          <Box>
            <InputLabelCustom>{t('fromDate')}</InputLabelCustom>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                inputFormat="YYYY-MM-DD"
                value={stateFilter.fromDate}
                onChange={(value: Moment | null) => {
                  if (!value) {
                    const date = new Date()

                    setStateFilter((prev) => {
                      return {
                        ...prev,
                        fromDate: date,
                      }
                    })
                  } else {
                    console.log('value', value)
                    setStateFilter((prev) => {
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
            <InputLabelCustom>{t('toDate')}</InputLabelCustom>

            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                inputFormat="YYYY-MM-DD"
                value={stateFilter.toDate}
                onChange={(value: Moment | null) => {
                  if (!value) {
                    const date = new Date()

                    setStateFilter((prev) => {
                      return {
                        ...prev,
                        toDate: date,
                      }
                    })
                  } else {
                    console.log('value', value)
                    setStateFilter((prev) => {
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
        <ButtonCustom
          variant="contained"
          onClick={handleExportCurrentReport}
          size="medium"
          endIcon={<Share />}
        >
          {t('export')}
        </ButtonCustom>
      </Stack>

      <TableContainerTws>
        <Table>
          <TableHead>
            <TableRow>
              <TableCellTws>{t('date')}</TableCellTws>
              <TableCellTws>
                {platform() === 'RETAILER'
                  ? 'Supplier/Manufacturer'
                  : 'RETAILER'}
              </TableCellTws>
              <TableCellTws>{t('invoice')} #</TableCellTws>
              <TableCellTws>Order Type</TableCellTws>
              <TableCellTws>{t('receipt')} #</TableCellTws>
              <TableCellTws align="right">{t('amount')}</TableCellTws>
            </TableRow>
          </TableHead>
          <TableBody>
            {stateAgingTransaction?.data.map((item, index) => {
              return (
                <TableRowTws
                  key={index}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    if (item.is_external) {
                      setOpenDetailExternal(true)
                      setItemExternalOrder(item.order_id)
                      // router.push(
                      //   `/retailer/market-place/purchase-orders/detail/${obj.order_id}`
                      // )
                    } else {
                      router.push(
                        `/retailer/market-place/purchase-orders/detail/${item.order_id}`
                      )
                    }
                  }}
                >
                  <TableCellTws>
                    {moment(item.date).format('MMMM DD, YYYY')}
                  </TableCellTws>
                  <TableCellTws>{item.retailer}</TableCellTws>
                  <TableCellTws>
                    {item.invoice_number ? item.invoice_number : ''}
                  </TableCellTws>
                  <TableCellTws>
                    {item.is_external ? 'External' : 'Purchase'}
                  </TableCellTws>
                  <TableCellTws>
                    {item.receipt_number ? item.receipt_number : ''}
                  </TableCellTws>
                  <TableCellTws align="right">
                    {formatMoney(item.amount)}
                  </TableCellTws>
                </TableRowTws>
              )
            })}
          </TableBody>
        </Table>
      </TableContainerTws>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          position: 'sticky',
          bottom: '0px',
          background: '#1BB56A',
          padding: '15px',
          borderRadius: '5px',
          color: 'white',
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: '1.6rem' }}>
          {t('total')}
        </Typography>
        <Typography sx={{ fontWeight: 700, fontSize: '1.6rem' }}>
          {formatMoney(stateTotal)}
        </Typography>
      </Stack>

      <ExternalOrderDetailComponent
        open={openDetailExternal}
        onClose={setOpenDetailExternal}
        idExternalOrder={itemExternalOrder}
        setFlagRefreshDelete={setFlagRefreshDelete}
      />
    </>
  )
}

export default AgingTransactionComponent
