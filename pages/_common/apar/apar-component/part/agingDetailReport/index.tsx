import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import {
  Checkbox,
  IconButton,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { Share } from '@phosphor-icons/react'
import { Box } from '@mui/system'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import moment, { Moment } from 'moment'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { useRouter } from 'next/router'
import {
  ButtonCustom,
  InputLabelCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldCustom,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import { useDebouncedCallback } from 'use-debounce'
import {
  exportReport,
  getListSupplierRetailer,
  getReportPayableAgingDetail,
} from './agingDetailAPI'
import {
  AgingDetailResponseType,
  FilterDataType,
  ListSupplierRetailerResponseType,
} from './agingDetailModel'
import classes from './styles.module.scss'
import { useTranslation } from 'react-i18next'
import ExternalOrderDetailComponent from 'pages/_common/apar/external-order/detail'
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
}
const AgingDetailReportComponent: React.FC = () => {
  const router = useRouter()
  const { t } = useTranslation(['account'])
  const [stateAgingDetail, setStateAgingDetail] =
    useState<AgingDetailResponseType>()
  const [stateFilter, setStateFilter] = useState<FilterDataType>({
    date_as_of: new Date(),
    days_per_aging: 30,
    number_of_periods: 4,
    retailer: [],
  })
  const dispatch = useAppDispatch()
  const [openDetailExternal, setOpenDetailExternal] = useState(false)
  const [itemExternalOrder, setItemExternalOrder] = useState<
    number | undefined
  >(undefined)
  const [stateIndexCollapse, setStateIndexCollapse] = useState(-1)
  const [pushMessage] = useEnqueueSnackbar()
  const [stateListSupplierRetailer, setStateListSupplierRetailer] =
    useState<ListSupplierRetailerResponseType>({ data: [] })
  const [stateListManufacturer, setStateListManufacturer] =
    useState<ListSupplierRetailerResponseType>({ data: [] })

  const [flagRefreshDelete, setFlagRefreshDelete] = useState('')

  useEffect(() => {
    handleGetSupplierRetailer()
    if (platform() === 'RETAILER') {
      handleGetManufacturer()
    }
  }, [])
  useEffect(() => {
    dispatch(loadingActions.doLoading())
    getReportPayableAgingDetail({
      date_as_of: moment(stateFilter.date_as_of).format('YYYY-MM-DD'),
      ...(stateFilter.days_per_aging && {
        days_per_aging: stateFilter.days_per_aging,
      }),
      ...(stateFilter.number_of_periods && {
        number_of_periods: stateFilter.number_of_periods,
      }),
      ...(stateFilter.retailer.length > 0 && {
        retailer: stateFilter.retailer.join(','),
      }),
    })
      .then((res) => {
        const { data } = res
        setStateAgingDetail(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [stateFilter, flagRefreshDelete])
  const debounceForDayPerAging = useDebouncedCallback((value: number) => {
    setStateFilter((prev) => {
      return { ...prev, days_per_aging: value }
    })
  }, 500)
  const debounceForNumberOfPeriod = useDebouncedCallback((value: number) => {
    setStateFilter((prev) => {
      return { ...prev, number_of_periods: value }
    })
  }, 500)
  const handleExportReport = () => {
    exportReport({
      date_as_of: moment(stateFilter.date_as_of).format('YYYY-MM-DD'),
      ...(stateFilter.days_per_aging && {
        days_per_aging: stateFilter.days_per_aging,
      }),
      ...(stateFilter.number_of_periods && {
        number_of_periods: stateFilter.number_of_periods,
      }),
      ...(stateFilter.retailer.length > 0 && {
        retailer: stateFilter.retailer.join(','),
      }),
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
      })
  }
  const handleGetSupplierRetailer = () => {
    getListSupplierRetailer('RETAILER')
      .then((res) => {
        const { data } = res
        setStateListSupplierRetailer(data)
      })
      .catch(({ response }) => {
        const { status, data } = response

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetManufacturer = () => {
    getListSupplierRetailer('MANUFACTURER')
      .then((res) => {
        const { data } = res
        setStateListManufacturer(data)
      })
      .catch(({ response }) => {
        const { status, data } = response

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleChangeRetailer = (
    event: SelectChangeEvent<typeof stateFilter.retailer>
  ) => {
    const {
      target: { value },
    } = event
    if (typeof value === 'string') return
    setStateFilter((prev) => {
      return {
        ...prev,

        retailer: value,
      }
    })
  }
  const handleCheckIsChecked = (id: number) => {
    const cloneRetailer: number[] = JSON.parse(
      JSON.stringify(stateFilter.retailer)
    )
    return cloneRetailer.some((idx) => idx === id)
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
            <InputLabelCustom>
              {platform() === 'RETAILER' ? t('supplier') : t('retailer')}
            </InputLabelCustom>
            <Select
              sx={{
                borderRadius: '8px',
                width: '200px',
                '& .MuiSelect-select': {
                  paddingTop: '10px',
                  paddingBottom: '10px',
                },
                '& .MuiOutlinedInput-root': {
                  borderColor: '#E1E6EF',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderWidth: '1px !important',
                  borderColor: '#E1E6EF',
                },
              }}
              multiple
              value={stateFilter.retailer}
              MenuProps={MenuProps}
              onChange={handleChangeRetailer}
              renderValue={(selected) => {
                const temporaryListSupplier: string[] = []
                selected.forEach((item) => {
                  const result = stateListSupplierRetailer?.data?.findIndex(
                    (obj) => obj.id === item
                  )
                  if (result >= 0) {
                    temporaryListSupplier.push(
                      stateListSupplierRetailer.data[result].name
                    )
                  }
                })
                return temporaryListSupplier.join(', ')
              }}
            >
              {stateListSupplierRetailer?.data.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  <Checkbox checked={handleCheckIsChecked(item.id)} />
                  <ListItemText primary={item.name} />
                </MenuItem>
              ))}
            </Select>
          </Box>
          {platform() === 'RETAILER' && (
            <Box>
              <InputLabelCustom>{t('manufacturer')}</InputLabelCustom>
              <Select
                sx={{
                  borderRadius: '8px',
                  width: '200px',
                  '& .MuiSelect-select': {
                    paddingTop: '10px',
                    paddingBottom: '10px',
                  },
                  '& .MuiOutlinedInput-root': {
                    borderColor: '#E1E6EF',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '1px !important',
                    borderColor: '#E1E6EF',
                  },
                }}
                multiple
                value={stateFilter.retailer}
                MenuProps={MenuProps}
                onChange={handleChangeRetailer}
                renderValue={(selected) => {
                  const temporaryListSupplier: string[] = []
                  selected.forEach((item) => {
                    const result = stateListManufacturer?.data?.findIndex(
                      (obj) => obj.id === item
                    )
                    if (result >= 0) {
                      temporaryListSupplier.push(
                        stateListManufacturer.data[result].name
                      )
                    }
                  })
                  return temporaryListSupplier.join(', ')
                }}
              >
                {stateListManufacturer?.data.map((item, index) => (
                  <MenuItem key={index} value={item.id}>
                    <Checkbox checked={handleCheckIsChecked(item.id)} />
                    <ListItemText primary={item.name} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
          )}

          <Box>
            <InputLabelCustom>{t('asOf')}</InputLabelCustom>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                inputFormat="YYYY-MM-DD"
                value={stateFilter.date_as_of}
                onChange={(value: Moment | null) => {
                  if (!value) {
                    const date = new Date()

                    setStateFilter((prev) => {
                      return {
                        ...prev,
                        date_as_of: date,
                      }
                    })
                  } else {
                    console.log('value', value)
                    setStateFilter((prev) => {
                      return {
                        ...prev,
                        date_as_of: value.toDate(),
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
            <InputLabelCustom>{t('daysPerAgingPeriod')}</InputLabelCustom>
            <NumericFormat
              defaultValue={30}
              style={{ width: '100%' }}
              placeholder={t('enterDayPerAgingPeriod')}
              customInput={TextField}
              allowNegative={false}
              onValueChange={(value) => {
                if (value.floatValue) {
                  debounceForDayPerAging(value.floatValue)
                }
              }}
              isAllowed={(values) => {
                const { floatValue, formattedValue } = values
                if (floatValue === 0) {
                  return floatValue >= 0
                }
                if (!floatValue) {
                  return formattedValue === ''
                }
                return floatValue <= 365 && floatValue >= 1
              }}
              className={classes['input-number']}
            />
          </Box>
          <Box>
            <InputLabelCustom>{t('numberOfPeriod')}</InputLabelCustom>
            <NumericFormat
              defaultValue={4}
              style={{ width: '100%' }}
              placeholder={t('enterNumberOfPeriod')}
              customInput={TextField}
              allowNegative={false}
              onValueChange={(value) => {
                if (value.floatValue) {
                  debounceForNumberOfPeriod(value.floatValue)
                }
              }}
              isAllowed={(values) => {
                const { floatValue, formattedValue } = values
                if (floatValue === 0) {
                  return floatValue >= 0
                }
                if (!floatValue) {
                  return formattedValue === ''
                }
                return floatValue <= 6 && floatValue >= 1
              }}
              className={classes['input-number']}
            />
          </Box>
        </Stack>
        <Box>
          <ButtonCustom
            onClick={handleExportReport}
            size="medium"
            variant="contained"
            endIcon={<Share />}
          >
            {t('export')}
          </ButtonCustom>
        </Box>
      </Stack>

      <TableContainerTws>
        <Table>
          <TableHead>
            <TableRow>
              <TableCellTws>
                {platform() === 'RETAILER'
                  ? t('supplierManufacturer')
                  : t('retailer')}
              </TableCellTws>
              <TableCellTws>{t('invoice')}#</TableCellTws>
              <TableCellTws>{t('order')}#</TableCellTws>
              <TableCellTws>Order Type</TableCellTws>
              <TableCellTws>{t('invalidDate')}</TableCellTws>
              <TableCellTws>{t('dueDate')}</TableCellTws>
              <TableCellTws>{t('pastDue')}</TableCellTws>
              <TableCellTws>{t('amount')}</TableCellTws>
              <TableCellTws>{t('amountDue')}</TableCellTws>
            </TableRow>
          </TableHead>
          {stateAgingDetail?.data?.map((item, index) => {
            const totalAmount = item.data.reduce((prev, obj) => {
              return Number(prev) + Number(obj.amount)
            }, 0)
            const totalAmountDue = item.data.reduce((prev, obj) => {
              return Number(prev) + Number(obj.amount_due)
            }, 0)
            return (
              <React.Fragment key={index}>
                <TableBody>
                  <TableRowTws>
                    <TableCellTws colSpan={7}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()

                          if (stateIndexCollapse === index) {
                            setStateIndexCollapse(-1)
                            return
                          }
                          console.log('index', index)

                          setStateIndexCollapse(index)
                        }}
                      >
                        {stateIndexCollapse === index ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                      <Typography>{item.group}</Typography>
                    </TableCellTws>
                    <TableCellTws>{formatMoney(totalAmount)}</TableCellTws>
                    <TableCellTws>{formatMoney(totalAmountDue)}</TableCellTws>
                  </TableRowTws>
                </TableBody>
                <TableBody
                  style={{
                    display:
                      stateIndexCollapse === index ? 'table-row-group' : 'none',
                  }}
                >
                  {item.data.length > 0 &&
                    item.data.map((obj, idx) => {
                      return (
                        <TableRowTws
                          key={idx}
                          hover
                          sx={{ cursor: 'pointer' }}
                          onClick={() => {
                            if (obj.is_external) {
                              setOpenDetailExternal(true)
                              setItemExternalOrder(obj.order_id)
                              // router.push(
                              //   `/retailer/market-place/purchase-orders/detail/${obj.order_id}`
                              // )
                            } else {
                              router.push(
                                `/retailer/market-place/purchase-orders/detail/${obj.order_id}`
                              )
                            }
                          }}
                        >
                          <TableCellTws>{obj.retailer}</TableCellTws>
                          <TableCellTws>{obj.invoice_number}</TableCellTws>
                          <TableCellTws>{obj.order_code}</TableCellTws>
                          <TableCellTws>
                            {obj.is_external ? 'External' : 'Purchase'}
                          </TableCellTws>
                          <TableCellTws>
                            {moment(obj.invoice_date).format('YYYY-MM-DD')}
                          </TableCellTws>
                          <TableCellTws>
                            {moment(obj.due_date).format('YYYY-MM-DD')}
                          </TableCellTws>
                          <TableCellTws>
                            {formatMoney(obj.past_due)}
                          </TableCellTws>
                          <TableCellTws>{formatMoney(obj.amount)}</TableCellTws>
                          <TableCellTws>
                            {formatMoney(obj.amount_due)}
                          </TableCellTws>
                        </TableRowTws>
                      )
                    })}
                </TableBody>
              </React.Fragment>
            )
          })}
        </Table>
      </TableContainerTws>

      <ExternalOrderDetailComponent
        open={openDetailExternal}
        onClose={setOpenDetailExternal}
        idExternalOrder={itemExternalOrder}
        setFlagRefreshDelete={setFlagRefreshDelete}
      />
    </>
  )
}

export default AgingDetailReportComponent
