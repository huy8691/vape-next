import {
  Checkbox,
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
import moment, { Moment } from 'moment'
import React, { useEffect, useState } from 'react'

import { NumericFormat } from 'react-number-format'
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
  exportAgingSummary,
  getListSupplierRetailer,
  getReportPayableAgingSummary,
} from './agingSummaryAPI'
import {
  FilterDataType,
  ListSupplierRetailerResponseType,
  SummarayResponseType,
} from './agingSummaryModel'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'

import classes from './styles.module.scss'
import { useTranslation } from 'react-i18next'
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
    },
  },
}
const AgingSummaryReportComponent: React.FC = () => {
  const { t } = useTranslation(['account'])
  const [stateFilter, setStateFilter] = useState<FilterDataType>({
    date_as_of: new Date(),
    days_per_aging: 30,
    number_of_periods: 4,
    retailer: [],
  })
  const dispatch = useAppDispatch()
  const [stateAgingSummary, setStateAgingSummary] =
    useState<SummarayResponseType>()
  const [stateTotal, setStateTotal] = useState(0)
  const [stateListSupplierRetailer, setStateListSupplierRetailer] =
    useState<ListSupplierRetailerResponseType>({ data: [] })
  const [stateListManufacturer, setStateListManufacturer] =
    useState<ListSupplierRetailerResponseType>({ data: [] })
  const [pushMessage] = useEnqueueSnackbar()
  useEffect(() => {
    handleGetSupplierRetailer()
    if (platform() === 'RETAILER') {
      handleGetManufacturer()
    }
  }, [])
  useEffect(() => {
    const date = new Date()
    dispatch(loadingActions.doLoading())
    getReportPayableAgingSummary({
      date_as_of: stateFilter.date_as_of
        ? moment(stateFilter.date_as_of).format('YYYY-MM-DD')
        : moment(date).format('YYYY-MM-DD'),
      ...(stateFilter.days_per_aging && {
        days_per_aging: stateFilter.days_per_aging,
      }),
      ...(stateFilter.number_of_periods && {
        number_of_periods: stateFilter.number_of_periods,
      }),
    })
      .then((res) => {
        const { data } = res
        setStateAgingSummary(data)
        dispatch(loadingActions.doLoadingSuccess())
        if (data.data) {
          const total = data.data.reduce((previous, obj) => {
            return (
              Number(previous) +
              Number(
                obj.data.reduce((prev, item) => {
                  return prev + item.total_amount_due
                }, 0)
              )
            )
          }, 0)
          setStateTotal(total)
        }
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }, [stateFilter])

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
  const handleExportReport = () => {
    exportAgingSummary({
      date_as_of: moment(stateFilter.date_as_of).format('YYYY-MM-DD'),
      ...(stateFilter.days_per_aging && {
        days_per_aging: stateFilter.days_per_aging,
      }),
      ...(stateFilter.number_of_periods && {
        number_of_periods: stateFilter.number_of_periods,
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
        dispatch(loadingActions.doLoadingFailure())
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
              {platform() === 'SUPPLIER' ? t('retailer') : t('supplier')}
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

        <ButtonCustom
          variant="contained"
          onClick={handleExportReport}
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
              <TableCellTws>
                {platform() === 'RETAILER'
                  ? t('supplierManufacturer')
                  : t('retailer')}
              </TableCellTws>
              {stateAgingSummary?.data?.[0].data.map((item, index) => {
                return <TableCellTws key={index}>{item.group}</TableCellTws>
              })}
              <TableCellTws align="right">{t('total')}</TableCellTws>
            </TableRow>
          </TableHead>
          <TableBody>
            {stateAgingSummary?.data?.map((item, index) => {
              let total = 0

              return (
                <TableRowTws key={index}>
                  <TableCellTws>
                    {item.supplier ? item.supplier : item.retailer}
                  </TableCellTws>
                  {item.data.map((obj, idx) => {
                    total += obj.total_amount_due
                    return (
                      <TableCellTws key={idx}>
                        {formatMoney(obj.total_amount_due)}
                      </TableCellTws>
                    )
                  })}
                  <TableCellTws align="right">
                    {formatMoney(total)}
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
    </>
  )
}

export default AgingSummaryReportComponent
