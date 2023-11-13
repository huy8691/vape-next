import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
// mui
import {
  Typography,
  CardContent,
  Card,
  Stack,
  Box,
  Tooltip,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  ButtonGroup,
  Button,
  Divider,
  TextField,
  IconButton,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  CalendarBlank,
  CaretLeft,
  CaretRight,
  Minus,
} from '@phosphor-icons/react'
import { objToStringParam } from 'src/utils/global.utils'
import { styled } from '@mui/material/styles'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs, { Dayjs } from 'dayjs'
import {
  handlerGetErrMessage,
  platform,
  formatNumberLarge,
  percentIncrease,
} from 'src/utils/global.utils'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  getOverView,
  getCustomersOverView,
  getSellersOverView,
} from './overViewAPI'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useTranslation } from 'next-i18next'
// import OverView from '../overView'
const CalendarIcon = () => {
  return <CalendarBlank size={16} />
}
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

const CardCustom = styled(Card)(() => ({
  width: '250px',
  borderRadius: '10px',
}))

const typeDayjs = (value?: string) => {
  switch (value) {
    case 'day':
      return 'day'
      break
    case 'week':
      return 'week'
      break
    default:
      return 'month'
  }
}

interface Props {
  titlePage?: React.ReactNode
}

const OverView: React.FC<Props> = (props) => {
  const router = useRouter()
  const { t } = useTranslation('report')
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateDateRangeOverView, setStateDateRangeOverView] = React.useState<{
    fromDate: Dayjs | null
    toDate: Dayjs | null
  }>({
    fromDate: dayjs().startOf('day'),
    toDate: dayjs().endOf('day'),
  })
  const [stateOverview, setStateOverview] = useState<
    {
      total_sales: number
      total_orders: number
      sold_quantity: number
    }[]
  >([
    {
      total_sales: 0,
      total_orders: 0,
      sold_quantity: 0,
    },
    {
      total_sales: 0,
      total_orders: 0,
      sold_quantity: 0,
    },
  ])
  const [stateCustomersOverview, setStateCustomersOverview] = useState<
    {
      all_customer: number
      new_customer: number
    }[]
  >([
    {
      all_customer: 0,
      new_customer: 0,
    },
    {
      all_customer: 0,
      new_customer: 0,
    },
  ])

  const [stateSellersOverView, setStateSellersOverView] = useState<
    {
      total_sales: number
      total_purchase_order: number
      total_order: number
      total_commissions: number
    }[]
  >([
    {
      total_sales: 0,
      total_purchase_order: 0,
      total_order: 0,
      total_commissions: 0,
    },
    {
      total_sales: 0,
      total_purchase_order: 0,
      total_order: 0,
      total_commissions: 0,
    },
  ])
  const handleChangeType = (newValue: string) => {
    console.log('newValue', newValue)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        type: newValue,
      })}`,
    })
  }
  const handleGetOverview = (value: {
    fromDate: string
    type?: string
    time: 'day' | 'week' | 'month'
  }) => {
    console.log('456190')
    dispatch(loadingActions.doLoading())
    const paramLast = {
      ...value,
      fromDate: dayjs(dayjs(value.fromDate).subtract(1, value.time))
        .startOf(value.time)
        .format('YYYY-MM-DD'),
      toDate: dayjs(dayjs(value.fromDate).subtract(1, value.time))
        .endOf(value.time)
        .format('YYYY-MM-DD'),
    }
    const paramCurrent = {
      ...value,
      fromDate: dayjs(dayjs(value.fromDate))
        .startOf(value.time)
        .format('YYYY-MM-DD'),
      toDate: dayjs(dayjs(value.fromDate))
        .endOf(value.time)
        .format('YYYY-MM-DD'),
    }
    const overviewOrdersLast = getOverView(paramLast).then((res) => {
      const { data } = res.data
      return data
    })
    const overviewOrdersCurrent = getOverView(paramCurrent).then((res) => {
      const { data } = res.data
      return data
    })

    Promise.all([overviewOrdersLast, overviewOrdersCurrent])
      .then((values) => {
        console.log('6547', values)
        setStateOverview(values)
        dispatch(loadingActions.doLoadingSuccess())
        return values
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetCustomersOverView = (value: {
    fromDate: string
    type?: string
    time: 'day' | 'week' | 'month'
  }) => {
    dispatch(loadingActions.doLoading())
    const paramLast = {
      ...value,
      fromDate: dayjs(dayjs(value.fromDate).subtract(1, value.time))
        .startOf(value.time)
        .format('YYYY-MM-DD'),
      toDate: dayjs(dayjs(value.fromDate).subtract(1, value.time))
        .endOf(value.time)
        .format('YYYY-MM-DD'),
    }
    const paramCurrent = {
      ...value,
      fromDate: dayjs(dayjs(value.fromDate))
        .startOf(value.time)
        .format('YYYY-MM-DD'),
      toDate: dayjs(dayjs(value.fromDate))
        .endOf(value.time)
        .format('YYYY-MM-DD'),
    }
    const overviewCustomersLast = getCustomersOverView(paramLast).then(
      (res) => {
        const { data } = res.data
        return data
      }
    )
    const overviewCustomersCurrent = getCustomersOverView(paramCurrent).then(
      (res) => {
        const { data } = res.data
        return data
      }
    )
    Promise.all([overviewCustomersLast, overviewCustomersCurrent])
      .then((values) => {
        setStateCustomersOverview(values)
        dispatch(loadingActions.doLoadingSuccess())
        return values
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  // SellersOverView
  const handleGetSellersOverView = (value: {
    fromDate: string
    time: 'day' | 'week' | 'month'
  }) => {
    console.log('456190')
    dispatch(loadingActions.doLoading())
    const paramLast = {
      ...value,
      fromDate: dayjs(dayjs(value.fromDate).subtract(1, value.time))
        .startOf(value.time)
        .format('YYYY-MM-DD'),
      toDate: dayjs(dayjs(value.fromDate).subtract(1, value.time))
        .endOf(value.time)
        .format('YYYY-MM-DD'),
    }
    const paramCurrent = {
      ...value,
      fromDate: dayjs(dayjs(value.fromDate))
        .startOf(value.time)
        .format('YYYY-MM-DD'),
      toDate: dayjs(dayjs(value.fromDate))
        .endOf(value.time)
        .format('YYYY-MM-DD'),
    }
    const sellersOverViewLast = getSellersOverView(paramLast).then((res) => {
      const { data } = res.data
      return data
    })
    const sellersOverViewCurrent = getSellersOverView(paramCurrent).then(
      (res) => {
        const { data } = res.data
        return data
      }
    )

    Promise.all([sellersOverViewLast, sellersOverViewCurrent])
      .then((values) => {
        console.log('6547', values)
        setStateSellersOverView(values)
        dispatch(loadingActions.doLoadingSuccess())
        return values
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    if (router?.query?.fromDate && router?.query?.toDate) {
      setStateDateRangeOverView({
        fromDate: dayjs(`${router?.query?.fromDate}`),
        toDate: dayjs(`${router?.query?.toDate}`),
      })
    }
  }, [router?.query?.fromDate, router?.query?.toDate])

  useEffect(() => {
    if (router?.query?.tab === 'dashboard') {
      handleGetOverview({
        fromDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        time: 'month',
        ...(router?.query?.type !== 'ALL' &&
          platform() === 'RETAILER' && {
            type: `${router?.query?.type}`,
          }),
      })
    }
    if (
      router?.query?.tab === 'settlementReport' &&
      router?.query?.time &&
      router?.query?.fromDate
    ) {
      handleGetOverview({
        fromDate: `${router?.query?.fromDate}`,
        time: typeDayjs(`${router?.query?.time}`),
        ...(router?.query?.type !== 'ALL' &&
          platform() === 'RETAILER' && {
            type: `${router?.query?.type}`,
          }),
      })
      handleGetCustomersOverView({
        fromDate: `${router?.query?.fromDate}`,
        time: typeDayjs(`${router?.query?.time}`),
        ...(router?.query?.type !== 'ALL' &&
          platform() === 'RETAILER' && {
            type: `${router?.query?.type}`,
          }),
      })
    }
    if (
      router?.query?.tab === 'sellerReport' &&
      router?.query?.time &&
      router?.query?.fromDate
    ) {
      handleGetSellersOverView({
        fromDate: `${router?.query?.fromDate}`,
        time: typeDayjs(`${router?.query?.time}`),
      })
    }
  }, [router?.query])

  console.log('==========', props)
  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        {props?.titlePage}
        <Box>
          {platform() == 'RETAILER' &&
            (router?.query?.tab === 'settlementReport' ||
              router?.pathname === '/retailer/dashboard') && (
              <>
                <FormControl>
                  <RadioGroup
                    row
                    name="type"
                    defaultValue="ALL"
                    value={router?.query?.type}
                    onChange={(e) => {
                      handleChangeType(e.target.value)
                    }}
                  >
                    <FormControlLabel
                      value="ALL"
                      control={<Radio />}
                      label={t('dashboard.overView.all')}
                    />
                    <FormControlLabel
                      value="RETAIL"
                      control={<Radio />}
                      label={t('dashboard.overView.retail')}
                    />
                    <FormControlLabel
                      value="ONLINE"
                      control={<Radio />}
                      label={t('dashboard.overView.online')}
                    />
                  </RadioGroup>
                </FormControl>
              </>
            )}
        </Box>
      </Stack>
      <Box p={2} sx={{ background: '#ffffff', paddingBottom: '0px' }}>
        {(router?.pathname === '/supplier/report' ||
          router?.pathname === '/retailer/report') &&
          router?.query?.tab !== 'dashboard' && (
            <Stack
              mb={2}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <ButtonGroup variant="outlined">
                {[
                  { name: t('dashboard.overView.day'), value: 'day' },
                  { name: t('dashboard.overView.week'), value: 'week' },
                  { name: t('dashboard.overView.month'), value: 'month' },
                ].map(function (item, index) {
                  console.log('test')
                  return (
                    <Button
                      key={index}
                      onClick={() => {
                        router.replace({
                          search: `${objToStringParam({
                            ...router.query,
                            time: item.value,
                            fromDate: dayjs()
                              .startOf(typeDayjs(item.value))
                              .format('YYYY-MM-DD'),
                            toDate: dayjs()
                              .endOf(typeDayjs(item.value))
                              .format('YYYY-MM-DD'),
                          })}`,
                        })
                        setStateDateRangeOverView({
                          fromDate: dayjs().startOf(typeDayjs(item.value)),
                          toDate: dayjs().endOf(typeDayjs(item.value)),
                        })
                      }}
                      style={{
                        textTransform: 'unset',
                        borderColor: '#C3CAD9',
                        color: !router?.query?.time
                          ? item.value === 'day'
                            ? theme.palette.primary.main
                            : '#C3CAD9'
                          : router?.query?.time === item.value
                          ? theme.palette.primary.main
                          : '#C3CAD9',
                      }}
                    >
                      {item.name}
                    </Button>
                  )
                })}
              </ButtonGroup>
              <Stack direction="row" spacing={1}>
                <IconButton
                  sx={{
                    border: '1px solid #C3CAD9',
                    boxShadow: '0px 2px 5px 0px rgba(38, 51, 77, 0.03)',
                  }}
                  onClick={() => {
                    router.replace({
                      search: `${objToStringParam({
                        ...router.query,
                        fromDate: dayjs(
                          dayjs(stateDateRangeOverView?.fromDate).subtract(
                            1,
                            typeDayjs(`${router?.query?.time}`)
                          )
                        )
                          .startOf(typeDayjs(`${router?.query?.time}`))
                          .format('YYYY-MM-DD'),
                        toDate: dayjs(
                          dayjs(stateDateRangeOverView?.fromDate).subtract(
                            1,
                            typeDayjs(`${router?.query?.time}`)
                          )
                        )
                          .endOf(typeDayjs(`${router?.query?.time}`))
                          .format('YYYY-MM-DD'),
                      })}`,
                    })
                    setStateDateRangeOverView({
                      fromDate: dayjs(
                        dayjs(stateDateRangeOverView.fromDate).subtract(
                          1,
                          typeDayjs(`${router?.query?.time}`)
                        )
                      ).startOf(typeDayjs(`${router?.query?.time}`)),
                      toDate: dayjs(
                        dayjs(stateDateRangeOverView.toDate).subtract(
                          1,
                          typeDayjs(`${router?.query?.time}`)
                        )
                      ).endOf(typeDayjs(`${router?.query?.time}`)),
                    })
                  }}
                >
                  <CaretLeft size={20} />
                </IconButton>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      border: '1px solid #E1E6EF',
                      padding: '8px 10px 1px',
                      borderRadius: '8px',
                    }}
                  >
                    <Typography sx={{ fontSize: '12px' }}>
                      {t('dashboard.overView.from')}:
                    </Typography>
                    <DatePicker
                      inputFormat="MM/DD/YYYY"
                      renderInput={(props) => (
                        <TextFieldDate
                          size="small"
                          variant="standard"
                          {...props}
                        />
                      )}
                      onChange={(e) => console.log(e)}
                      value={stateDateRangeOverView.fromDate}
                      readOnly
                      disabled
                      components={{
                        OpenPickerIcon: CalendarIcon,
                      }}
                    />
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ margin: '5px 5px 7px 15px !important' }}
                    />
                    <Typography sx={{ fontSize: '12px' }}>
                      {t('dashboard.overView.to')}:
                    </Typography>
                    <DatePicker
                      inputFormat="MM/DD/YYYY"
                      renderInput={(props) => (
                        <TextFieldDate
                          size="small"
                          variant="standard"
                          {...props}
                        />
                      )}
                      onChange={(e) => console.log(e)}
                      readOnly
                      disabled
                      value={stateDateRangeOverView.toDate}
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
                  disabled={
                    dayjs(stateDateRangeOverView?.fromDate)
                      .startOf(typeDayjs(`${router?.query?.time}`))
                      .format('YYYY-MM-DD') ==
                    dayjs()
                      .startOf(typeDayjs(`${router?.query?.time}`))
                      .format('YYYY-MM-DD')
                  }
                  onClick={() => {
                    router.replace({
                      search: `${objToStringParam({
                        ...router.query,
                        fromDate: dayjs(
                          dayjs(stateDateRangeOverView?.fromDate).add(
                            1,
                            typeDayjs(`${router?.query?.time}`)
                          )
                        )
                          .startOf(typeDayjs(`${router?.query?.time}`))
                          .format('YYYY-MM-DD'),
                        toDate: dayjs(
                          dayjs(stateDateRangeOverView?.fromDate).add(
                            1,
                            typeDayjs(`${router?.query?.time}`)
                          )
                        )
                          .endOf(typeDayjs(`${router?.query?.time}`))
                          .format('YYYY-MM-DD'),
                      })}`,
                    })

                    setStateDateRangeOverView({
                      fromDate: dayjs(
                        dayjs(stateDateRangeOverView.fromDate).add(
                          1,
                          typeDayjs(`${router?.query?.time}`)
                        )
                      ).startOf(typeDayjs(`${router?.query?.time}`)),
                      toDate: dayjs(
                        dayjs(stateDateRangeOverView.toDate).add(
                          1,
                          typeDayjs(`${router?.query?.time}`)
                        )
                      ).endOf(typeDayjs(`${router?.query?.time}`)),
                    })
                  }}
                >
                  <CaretRight size={20} />
                </IconButton>
              </Stack>
            </Stack>
          )}
        <Stack mb={0} direction="row" spacing={2}>
          {(router?.query?.tab === 'settlementReport' ||
            router?.query?.tab === 'dashboard') && (
            <>
              <CardCustom variant="outlined">
                <CardContent sx={{ paddingBottom: '10px !important' }}>
                  <Typography mb={1}>
                    {t('dashboard.overView.totalSales')}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ minWidth: '20px' }}>
                      {stateOverview[1].total_sales ===
                      stateOverview[0].total_sales ? (
                        <Minus size={32} color="#ffb74d" />
                      ) : (
                        <Image
                          src={
                            '/' +
                            (stateOverview[1].total_sales >
                            stateOverview[0].total_sales
                              ? '/images/uptrend.svg'
                              : '/images/downtrend.svg')
                          }
                          alt="Twss"
                          width="20"
                          height="20"
                        />
                      )}
                    </Box>
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.last')}
                            {router?.query?.time
                              ? `${router?.query?.time}`
                              : 'month'}
                            :{' '}
                            {formatNumberLarge(stateOverview[0].total_sales, 2)}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.from')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .startOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.to')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .endOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="right"
                    >
                      <Typography variant="h5" sx={{ fontWeight: '600' }}>
                        {formatNumberLarge(stateOverview[1].total_sales, 2)}
                      </Typography>
                    </Tooltip>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#BABABA', fontSize: '12px' }}
                    >
                      {percentIncrease(
                        stateOverview[0].total_sales,
                        stateOverview[1].total_sales
                      )}
                      %
                    </Typography>
                  </Stack>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#BABABA', fontSize: '12px' }}
                  >
                    {t('dashboard.overView.compareFrom')}{' '}
                    {router?.query?.time
                      ? `last ${router?.query?.time}`
                      : 'last month'}
                  </Typography>
                </CardContent>
              </CardCustom>
              <CardCustom variant="outlined">
                <CardContent sx={{ paddingBottom: '10px !important' }}>
                  <Typography mb={1}>
                    {t('dashboard.overView.totalOrders')}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ minWidth: '20px' }}>
                      {stateOverview[1].total_orders ===
                      stateOverview[0].total_orders ? (
                        <Minus size={32} color="#ffb74d" />
                      ) : (
                        <Image
                          src={
                            '/' +
                            (stateOverview[1].total_orders >
                            stateOverview[0].total_orders
                              ? '/images/uptrend.svg'
                              : '/images/downtrend.svg')
                          }
                          alt="Twss"
                          width="20"
                          height="20"
                        />
                      )}
                    </Box>
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.last')}
                            {router?.query?.time
                              ? `${router?.query?.time}`
                              : 'month'}
                            : {formatNumberLarge(stateOverview[0].total_orders)}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.from')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .startOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.to')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .endOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="right"
                    >
                      <Typography variant="h5" sx={{ fontWeight: '600' }}>
                        {formatNumberLarge(stateOverview[1].total_orders)}
                      </Typography>
                    </Tooltip>

                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#BABABA', fontSize: '12px' }}
                    >
                      {percentIncrease(
                        stateOverview[0].total_orders,
                        stateOverview[1].total_orders
                      )}
                      %
                    </Typography>
                  </Stack>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#BABABA', fontSize: '12px' }}
                  >
                    {t('dashboard.overView.compareFrom')}{' '}
                    {router?.query?.time
                      ? `last ${router?.query?.time}`
                      : 'last month'}
                  </Typography>
                </CardContent>
              </CardCustom>
              <CardCustom variant="outlined">
                <CardContent sx={{ paddingBottom: '10px !important' }}>
                  <Typography mb={1}>
                    {t('dashboard.overView.soldQuantities')}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ minWidth: '20px' }}>
                      {stateOverview[1].sold_quantity ===
                      stateOverview[0].sold_quantity ? (
                        <Minus size={32} color="#ffb74d" />
                      ) : (
                        <Image
                          src={
                            '/' +
                            (stateOverview[1].sold_quantity >
                            stateOverview[0].sold_quantity
                              ? '/images/uptrend.svg'
                              : '/images/downtrend.svg')
                          }
                          alt="Twss"
                          width="20"
                          height="20"
                        />
                      )}
                    </Box>
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.last')}
                            {router?.query?.time
                              ? `${router?.query?.time}`
                              : 'month'}
                            :{' '}
                            {formatNumberLarge(stateOverview[0].sold_quantity)}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.from')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .startOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.to')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .endOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="right"
                    >
                      <Typography variant="h5" sx={{ fontWeight: '600' }}>
                        {formatNumberLarge(stateOverview[1].sold_quantity)}
                      </Typography>
                    </Tooltip>

                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#BABABA', fontSize: '12px' }}
                    >
                      {percentIncrease(
                        stateOverview[0].sold_quantity,
                        stateOverview[1].sold_quantity
                      )}
                      %
                    </Typography>
                  </Stack>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#BABABA', fontSize: '12px' }}
                  >
                    {t('dashboard.overView.compareFrom')}{' '}
                    {router?.query?.time
                      ? `last ${router?.query?.time}`
                      : 'last month'}
                  </Typography>
                </CardContent>
              </CardCustom>
            </>
          )}
          {router?.query?.tab === 'settlementReport' && (
            <>
              <CardCustom variant="outlined">
                <CardContent sx={{ paddingBottom: '10px !important' }}>
                  <Typography mb={1}>
                    {t('dashboard.overView.totalCustomers')}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ minWidth: '20px' }}>
                      {stateCustomersOverview[1].all_customer ===
                      stateCustomersOverview[0].all_customer ? (
                        <Minus size={32} color="#ffb74d" />
                      ) : (
                        <Image
                          src={
                            '/' +
                            (stateCustomersOverview[1].all_customer >
                            stateCustomersOverview[0].all_customer
                              ? '/images/uptrend.svg'
                              : '/images/downtrend.svg')
                          }
                          alt="Twss"
                          width="20"
                          height="20"
                        />
                      )}
                    </Box>

                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="subtitle2">
                            Last
                            {router?.query?.time
                              ? `${router?.query?.time}`
                              : 'month'}
                            :{' '}
                            {formatNumberLarge(
                              stateCustomersOverview[0].all_customer
                            )}
                          </Typography>
                          <Typography variant="subtitle2">
                            From:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .startOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                          <Typography variant="subtitle2">
                            To:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .endOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="right"
                    >
                      <Typography variant="h5" sx={{ fontWeight: '600' }}>
                        {formatNumberLarge(
                          stateCustomersOverview[1].all_customer
                        )}
                      </Typography>
                    </Tooltip>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#BABABA', fontSize: '12px' }}
                    >
                      {percentIncrease(
                        stateCustomersOverview[0].all_customer,
                        stateCustomersOverview[1].all_customer
                      )}
                      %
                    </Typography>
                  </Stack>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#BABABA', fontSize: '12px' }}
                  >
                    {t('dashboard.overView.compareFrom')}{' '}
                    {router?.query?.time
                      ? `last ${router?.query?.time}`
                      : 'last month'}
                  </Typography>
                </CardContent>
              </CardCustom>
              <CardCustom variant="outlined">
                <CardContent sx={{ paddingBottom: '10px !important' }}>
                  <Typography mb={1}>
                    {' '}
                    {t('dashboard.overView.newCustomers')}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ minWidth: '20px' }}>
                      {stateCustomersOverview[1].new_customer ===
                      stateCustomersOverview[0].new_customer ? (
                        <Minus size={32} color="#ffb74d" />
                      ) : (
                        <Image
                          src={
                            '/' +
                            (stateCustomersOverview[1].new_customer >
                            stateCustomersOverview[0].new_customer
                              ? '/images/uptrend.svg'
                              : '/images/downtrend.svg')
                          }
                          alt="Twss"
                          width="20"
                          height="20"
                        />
                      )}
                    </Box>
                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="subtitle2">
                            Last
                            {router?.query?.time
                              ? `${router?.query?.time}`
                              : 'month'}
                            :{' '}
                            {formatNumberLarge(
                              stateCustomersOverview[0].new_customer
                            )}
                          </Typography>
                          <Typography variant="subtitle2">
                            From:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .startOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                          <Typography variant="subtitle2">
                            To:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .endOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="right"
                    >
                      <Typography variant="h5" sx={{ fontWeight: '600' }}>
                        {formatNumberLarge(
                          stateCustomersOverview[1].new_customer
                        )}
                      </Typography>
                    </Tooltip>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#BABABA', fontSize: '12px' }}
                    >
                      {percentIncrease(
                        stateCustomersOverview[0].new_customer,
                        stateCustomersOverview[1].new_customer
                      )}
                      %
                    </Typography>
                  </Stack>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#BABABA', fontSize: '12px' }}
                  >
                    {t('dashboard.overView.compareFrom')}{' '}
                    {router?.query?.time
                      ? `last ${router?.query?.time}`
                      : 'last month'}
                  </Typography>
                </CardContent>
              </CardCustom>
            </>
          )}
          {router?.query?.tab === 'sellerReport' && (
            <>
              <CardCustom variant="outlined">
                <CardContent sx={{ paddingBottom: '10px !important' }}>
                  <Typography mb={1}>
                    {t('dashboard.overView.totalOrders')}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ minWidth: '20px' }}>
                      {stateSellersOverView[1].total_sales ===
                      stateSellersOverView[0].total_sales ? (
                        <Minus size={32} color="#ffb74d" />
                      ) : (
                        <Image
                          src={
                            '/' +
                            (stateSellersOverView[1].total_sales >
                            stateSellersOverView[0].total_sales
                              ? '/images/uptrend.svg'
                              : '/images/downtrend.svg')
                          }
                          alt="Twss"
                          width="20"
                          height="20"
                        />
                      )}
                    </Box>

                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.last')}
                            {router?.query?.time
                              ? `${router?.query?.time}`
                              : 'month'}
                            :{' '}
                            {formatNumberLarge(
                              stateSellersOverView[0].total_sales,
                              2
                            )}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.from')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .startOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                          <Typography variant="subtitle2">
                            To:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .endOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="right"
                    >
                      <Typography variant="h5" sx={{ fontWeight: '600' }}>
                        {formatNumberLarge(
                          stateSellersOverView[1].total_sales,
                          2
                        )}
                      </Typography>
                    </Tooltip>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#BABABA', fontSize: '12px' }}
                    >
                      {percentIncrease(
                        stateSellersOverView[0].total_sales,
                        stateSellersOverView[1].total_sales
                      )}
                      %
                    </Typography>
                  </Stack>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#BABABA', fontSize: '12px' }}
                  >
                    {t('dashboard.overView.compareFrom')}{' '}
                    {router?.query?.time
                      ? `${t('dashboard.overView.last')} ${router?.query?.time}`
                      : t('dashboard.overView.lastMonth')}
                  </Typography>
                </CardContent>
              </CardCustom>
              <CardCustom variant="outlined">
                <CardContent sx={{ paddingBottom: '10px !important' }}>
                  <Typography mb={1}>
                    {t('dashboard.overView.totalPurchaseOrders')}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ minWidth: '20px' }}>
                      {stateSellersOverView[1].total_purchase_order ===
                      stateSellersOverView[0].total_purchase_order ? (
                        <Minus size={32} color="#ffb74d" />
                      ) : (
                        <Image
                          src={
                            '/' +
                            (stateSellersOverView[1].total_purchase_order >
                            stateSellersOverView[0].total_purchase_order
                              ? '/images/uptrend.svg'
                              : '/images/downtrend.svg')
                          }
                          alt="Twss"
                          width="20"
                          height="20"
                        />
                      )}
                    </Box>

                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.last')}
                            {router?.query?.time
                              ? `${router?.query?.time}`
                              : 'month'}
                            :{' '}
                            {formatNumberLarge(
                              stateSellersOverView[0].total_purchase_order
                            )}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.from')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .startOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.to')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .endOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="right"
                    >
                      <Typography variant="h5" sx={{ fontWeight: '600' }}>
                        {formatNumberLarge(
                          stateSellersOverView[1].total_purchase_order
                        )}
                      </Typography>
                    </Tooltip>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#BABABA', fontSize: '12px' }}
                    >
                      {percentIncrease(
                        stateSellersOverView[0].total_purchase_order,
                        stateSellersOverView[1].total_purchase_order
                      )}
                      %
                    </Typography>
                  </Stack>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#BABABA', fontSize: '12px' }}
                  >
                    {t('dashboard.overView.compareFrom')}{' '}
                    {router?.query?.time
                      ? `${t('dashboard.overView.last')} ${router?.query?.time}`
                      : t('dashboard.overView.lastMonth')}
                  </Typography>
                </CardContent>
              </CardCustom>
              <CardCustom variant="outlined">
                <CardContent sx={{ paddingBottom: '10px !important' }}>
                  <Typography mb={1}>
                    {t('dashboard.overView.totalCompletedOrder')}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ minWidth: '20px' }}>
                      {stateSellersOverView[1].total_order ===
                      stateSellersOverView[0].total_order ? (
                        <Minus size={32} color="#ffb74d" />
                      ) : (
                        <Image
                          src={
                            '/' +
                            (stateSellersOverView[1].total_order >
                            stateSellersOverView[0].total_order
                              ? '/images/uptrend.svg'
                              : '/images/downtrend.svg')
                          }
                          alt="Twss"
                          width="20"
                          height="20"
                        />
                      )}
                    </Box>

                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.last')}
                            {router?.query?.time
                              ? `${router?.query?.time}`
                              : 'month'}
                            :{' '}
                            {formatNumberLarge(
                              stateSellersOverView[0].total_order
                            )}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.from')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .startOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.to')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .endOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="right"
                    >
                      <Typography variant="h5" sx={{ fontWeight: '600' }}>
                        {formatNumberLarge(stateSellersOverView[1].total_order)}
                      </Typography>
                    </Tooltip>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#BABABA', fontSize: '12px' }}
                    >
                      {percentIncrease(
                        stateSellersOverView[0].total_order,
                        stateSellersOverView[1].total_order
                      )}
                      %
                    </Typography>
                  </Stack>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#BABABA', fontSize: '12px' }}
                  >
                    {t('dashboard.overView.compareFrom')}{' '}
                    {router?.query?.time
                      ? `${t('dashboard.overView.last')} ${router?.query?.time}`
                      : t('dashboard.overView.lastMonth')}
                  </Typography>
                </CardContent>
              </CardCustom>
              <CardCustom variant="outlined">
                <CardContent sx={{ paddingBottom: '10px !important' }}>
                  <Typography mb={1}>
                    {t('dashboard.overView.totalCommission')}
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{ minWidth: '20px' }}>
                      {stateSellersOverView[1].total_commissions ===
                      stateSellersOverView[0].total_commissions ? (
                        <Minus size={32} color="#ffb74d" />
                      ) : (
                        <Image
                          src={
                            '/' +
                            (stateSellersOverView[1].total_commissions >
                            stateSellersOverView[0].total_commissions
                              ? '/images/uptrend.svg'
                              : '/images/downtrend.svg')
                          }
                          alt="Twss"
                          width="20"
                          height="20"
                        />
                      )}
                    </Box>

                    <Tooltip
                      title={
                        <Box>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.last')}
                            {router?.query?.time
                              ? `${router?.query?.time}`
                              : 'month'}
                            :{' '}
                            {formatNumberLarge(
                              stateSellersOverView[0].total_commissions,
                              2
                            )}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.from')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .startOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                          <Typography variant="subtitle2">
                            {t('dashboard.overView.to')}:{' '}
                            {dayjs(
                              dayjs(stateDateRangeOverView.fromDate).subtract(
                                1,
                                typeDayjs(`${router?.query?.time}`)
                              )
                            )
                              .endOf(typeDayjs(`${router?.query?.time}`))
                              .format('MM/DD/YYYY')}
                          </Typography>
                        </Box>
                      }
                      arrow
                      placement="right"
                    >
                      <Typography variant="h5" sx={{ fontWeight: '600' }}>
                        {formatNumberLarge(
                          stateSellersOverView[1].total_commissions,
                          2
                        )}
                      </Typography>
                    </Tooltip>
                    <Typography
                      variant="subtitle2"
                      sx={{ color: '#BABABA', fontSize: '12px' }}
                    >
                      {percentIncrease(
                        stateSellersOverView[0].total_commissions,
                        stateSellersOverView[1].total_commissions
                      )}
                      %
                    </Typography>
                  </Stack>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: '#BABABA', fontSize: '12px' }}
                  >
                    {t('dashboard.overView.compareFrom')}{' '}
                    {router?.query?.time
                      ? `${t('dashboard.overView.last')} ${router?.query?.time}`
                      : t('dashboard.overView.lastMonth')}
                  </Typography>
                </CardContent>
              </CardCustom>
            </>
          )}
        </Stack>
      </Box>
    </>
  )
}
export default OverView
