import React, { useEffect } from 'react'
import {
  Card,
  Divider,
  Stack,
  IconButton,
  Typography,
  CardContent,
  TextField,
  Box,
} from '@mui/material'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { styled } from '@mui/material/styles'
import { CalendarBlank, CaretLeft, CaretRight } from '@phosphor-icons/react'
// import { useTheme } from '@mui/material/styles'
import { useTheme } from '@mui/material/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import { MenuItemSelectCustom, SelectCustom } from 'src/components'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { useTranslation } from 'react-i18next'
const CalendarIcon = () => {
  return <CalendarBlank size={16} />
}
const CardCustom = styled(Card)(() => ({
  width: '250px',
  borderRadius: '10px',
}))

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
      border: 'none !important',
    },
    '&:after': {
      borderWidth: '1px',
    },
    '& .MuiButtonBase-root': {
      marginTop: '-3px',
    },
  },
})
const typeDayjs = (value?: string) => {
  switch (value) {
    case 'day':
      return 'day'
    case 'year':
      return 'year'
    default:
      return 'month'
  }
}
type Props = {
  api: string
  count: number
  dateRange: {
    fromDate: Dayjs
    toDate: Dayjs
  }
  title: string
  type: string
  money?: boolean
}
const ListCard: React.FC<Props> = (props) => {
  const { t } = useTranslation('report')
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateDateRange, setStateDateRange] = React.useState<{
    fromDate: Dayjs
    toDate: Dayjs
  }>({
    fromDate: dayjs().startOf('month'),
    toDate: dayjs().endOf('month'),
  })
  const [stateTypeDay, setStateTypeDay] = React.useState<
    'day' | 'year' | 'month'
  >('month')
  const [stateListData, setStateListData] = React.useState<
    {
      store: string
      values?: number
      cogs?: number
      gross_margin?: number
      all_store: boolean
    }[]
  >([])

  const handleGetInfo = () => {
    dispatch(loadingActions.doLoading())
    callAPIWithToken({
      url: props.api,
      method: 'get',
      params: {
        fromDate: stateDateRange.fromDate.format('YYYY-MM-DD'),
        toDate: stateDateRange.toDate.format('YYYY-MM-DD'),
      },
    })
      .then((res) => {
        const { data } = res.data
        console.log('data', data)
        setStateListData(
          data.sort(
            (
              a: {
                all_store: boolean
              },
              b: {
                all_store: boolean
              }
            ) => Number(b.all_store) - Number(a.all_store)
          )
        )
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        console.log('response', response)
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleValue = (value: {
    store: string
    values?: number
    cogs?: number
    gross_margin?: number
    all_store: boolean
  }) => {
    switch (props.type) {
      case 'cogs':
        return formatMoney(value.cogs)
      case 'gross_margin':
        return formatMoney(value.gross_margin)
      default:
        return props.money === true ? formatMoney(value.values) : value.values
    }
  }

  useEffect(() => {
    if (props.count > 0) {
      setStateDateRange({
        fromDate: props.dateRange.fromDate,
        toDate: props.dateRange.toDate,
      })
    }
  }, [props.count])
  useEffect(() => {
    handleGetInfo()
  }, [stateDateRange])
  return (
    <Box
      sx={{
        p: 2,
        background: '#ffffff',
        mb: 2,
        borderRadius: '8px',
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography sx={{ fontWeight: '500' }}>{props.title}</Typography>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          spacing={1}
        >
          <SelectCustom
            value={stateTypeDay}
            sx={{
              '& .MuiSelect-select': {
                padding: '5px 10px',
              },
            }}
            onChange={(event) => {
              if (event) {
                setStateDateRange({
                  fromDate: dayjs().startOf(
                    typeDayjs(`${event?.target?.value}`)
                  ),
                  toDate: dayjs().endOf(typeDayjs(`${event?.target?.value}`)),
                })
                setStateTypeDay(typeDayjs(`${event?.target?.value}`))
              }
            }}
          >
            <MenuItemSelectCustom value="day">
              {t('dashBoardMaster.custom')}
            </MenuItemSelectCustom>
            <MenuItemSelectCustom value="month">
              {t('dashBoardMaster.month')}
            </MenuItemSelectCustom>
            <MenuItemSelectCustom value="year">
              {t('dashBoardMaster.year')}
            </MenuItemSelectCustom>
          </SelectCustom>
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              sx={{
                border: '1px solid #C3CAD9',
                boxShadow: '0px 2px 5px 0px rgba(38, 51, 77, 0.03)',
              }}
              onClick={() => {
                setStateDateRange({
                  fromDate: dayjs(
                    dayjs(stateDateRange.fromDate).subtract(1, stateTypeDay)
                  ).startOf(stateTypeDay),
                  toDate: dayjs(
                    dayjs(stateDateRange.toDate).subtract(1, stateTypeDay)
                  ).endOf(stateTypeDay),
                })
              }}
              size="small"
            >
              <CaretLeft size={20} />
            </IconButton>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  border: '1px solid #E1E6EF',
                  padding: '5px 10px 0px',
                  borderRadius: '8px',
                }}
              >
                <DatePicker
                  inputFormat="MM/DD/YYYY"
                  renderInput={(props) => (
                    <TextFieldDate size="small" variant="standard" {...props} />
                  )}
                  onChange={(e) => {
                    if (e) {
                      if (e > stateDateRange.toDate) {
                        setStateDateRange({
                          fromDate: e,
                          toDate: e,
                        })
                      } else {
                        setStateDateRange({
                          ...stateDateRange,
                          fromDate: e,
                        })
                      }
                    }
                  }}
                  value={stateDateRange.fromDate}
                  readOnly={stateTypeDay === 'day' ? false : true}
                  // disabled
                  shouldDisableDate={(day: any) => {
                    const date = new Date()
                    if (
                      dayjs(day).format('YYYY-MM-DD') >
                      dayjs(date).format('YYYY-MM-DD')
                    ) {
                      return true
                    }
                    return false
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
                <DatePicker
                  inputFormat="MM/DD/YYYY"
                  renderInput={(props) => (
                    <TextFieldDate size="small" variant="standard" {...props} />
                  )}
                  value={stateDateRange.toDate}
                  onChange={(e) => {
                    if (e) {
                      setStateDateRange({
                        ...stateDateRange,
                        toDate: e,
                      })
                    }
                  }}
                  // readOnly
                  // disabled
                  readOnly={stateTypeDay === 'day' ? false : true}
                  shouldDisableDate={(day: any) => {
                    const date = new Date()
                    if (
                      dayjs(day).format('YYYY-MM-DD') <
                      stateDateRange?.fromDate?.format('YYYY-MM-DD')
                    ) {
                      return true
                    }
                    if (
                      dayjs(day).format('YYYY-MM-DD') >
                      dayjs(date).format('YYYY-MM-DD')
                    ) {
                      return true
                    }
                    return false
                  }}
                  components={{
                    OpenPickerIcon: CalendarIcon,
                  }}
                />
              </Stack>
            </LocalizationProvider>
            <IconButton
              sx={{
                border: '1px solid #C3CAD9',
                boxShadow: '0px 2px 5px 0px rgba(38, 51, 77, 0.03)',
              }}
              onClick={() => {
                setStateDateRange({
                  fromDate: dayjs(
                    dayjs(stateDateRange.fromDate).add(1, stateTypeDay)
                  ).startOf(stateTypeDay),
                  toDate: dayjs(
                    dayjs(stateDateRange.toDate).add(1, stateTypeDay)
                  ).endOf(stateTypeDay),
                })
              }}
              size="small"
            >
              <CaretRight size={20} />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>

      <Stack mb={0} direction="row" spacing={2}>
        {stateListData.map((item, index) => {
          return (
            <CardCustom
              variant="outlined"
              key={index}
              sx={
                index === 0
                  ? { border: `1px solid ${theme.palette.primary.main}` }
                  : {}
              }
            >
              <CardContent>
                <Typography mb={2}>{item.store}</Typography>
                <Typography variant="h5" sx={{ fontWeight: '600' }}>
                  {handleValue(item)}
                </Typography>
              </CardContent>
            </CardCustom>
          )
        })}
      </Stack>
    </Box>
  )
}

export default ListCard
