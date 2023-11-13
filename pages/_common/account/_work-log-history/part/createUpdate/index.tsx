import {
  Box,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import * as Yup from 'yup'
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import Grid from '@mui/material/Unstable_Grid2'
import { ArrowRight } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
} from 'src/components'
import { Moment } from 'moment'
import moment from 'moment'
import {
  createUpdateWorkLogHistory,
  getDetailWorkLogHistory,
  getOrganizationSettings,
} from '../../workLogHistoryAPI'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
// import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { WorkLogHistoryDataType } from '../../workLogHistoryModels'
import { useTranslation } from 'next-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { workLogsActions } from 'src/store/workLogs/workLogsSlice'

const CreateUpdateWorkLogComponent: React.FC<{
  open: boolean
  onClose: () => void
  stateWorkLog?: WorkLogHistoryDataType | undefined
}> = (props) => {
  const { t } = useTranslation('account')
  // const router = useRouter()
  const [stateTimeSpent, setStateTimeSpent] = useState('')
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [limitHours, setLimitHours] = useState(0)
  const {
    reset,
    clearErrors,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      Yup.object({
        time_spent: Yup.number()
          .required('The field is required')
          .min(1, 'Time spend must be greater than 0 minutes')
          .test(
            'time_spent',
            `The total time spent must not exceed ${limitHours} hour.`,
            function (value) {
              return Boolean((value as number) <= limitHours * 60)
            }
          ),
        time: Yup.string().required('The field is required'),
        date: Yup.date()
          .required('The field is required')
          .typeError('The field invalid'),
      })
    ),
    mode: 'all',
    defaultValues: {
      description: null,
      date: '',
      time: '',
      time_spent: 0,
    },
  })

  useEffect(() => {
    if (props.open) {
      getOrganizationSettings().then((res) => {
        const { data } = res.data
        setLimitHours(data.limit_hour)
      })
      reset()
      setStateTimeSpent('')
      clearErrors()
    }
  }, [props.open])

  useEffect(() => {
    if (props.stateWorkLog && props.stateWorkLog.id && props.open) {
      getDetailWorkLogHistory(props.stateWorkLog.id).then((res) => {
        const { data } = res.data

        console.log('🚀 ~ getDetailWorkLogHistory ~ data:', data)

        setStateTimeSpent(
          convertMinutesToWeeksDaysHoursMinutes(data.time_spent)
        )
        setValue('time_spent', data.time_spent)
        setValue(
          'time',
          moment(data.time, 'HH:mm:ss').format('MMM D YYYY HH:mm:ss [GMT]ZZ')
        )
        setValue('date', data.date)
        setValue('description', data.description)
      })
    }
  }, [props.stateWorkLog, props.open])

  const onSubmit = (values: any) => {
    const time = values.time

    const filteredValues: any = Object.fromEntries(
      Object.entries({
        ...values,
        date: moment(values.date).format('YYYY-MM-DD'),
        time: moment(time).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'),
        time_str: moment(values.time).format('hh:mm A'),
        id: props.stateWorkLog?.id || false,
      }).filter(([, value]) => !!value)
    )

    dispatch(loadingActions.doLoading())

    createUpdateWorkLogHistory(filteredValues)
      .then(() => {
        pushMessage('Created work log history successfully', 'success')
        handleReset()
        props.onClose()
        // props.handleGetWorkLogHistoryList(router.query)
        dispatch(workLogsActions.doRefresh())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
      .finally(() => dispatch(loadingActions.doLoadingSuccess()))
  }

  const handleReset = () => {
    reset()
    setStateTimeSpent('')
    props.onClose()
  }

  const convertTimeToMinutes = (timeSpent: string) => {
    const weeksRegex = /(\d+)w/g
    const daysRegex = /(\d+)d/g
    const hoursRegex = /(\d+)h/g
    const minutesRegex = /(\d+)m/g

    let totalMinutes = 0

    const weeksMatch = timeSpent.match(weeksRegex)
    const daysMatch = timeSpent.match(daysRegex)
    const hoursMatch = timeSpent.match(hoursRegex)
    const minutesMatch = timeSpent.match(minutesRegex)

    if (weeksMatch) {
      totalMinutes += parseInt(weeksMatch[0]) * 7 * 24 * 60 // Week into minutes
    }
    if (daysMatch) {
      totalMinutes += parseInt(daysMatch[0]) * 24 * 60 // Day into minutes
    }
    if (hoursMatch) {
      totalMinutes += parseInt(hoursMatch[0]) * 60 // Hour into minutes
    }
    if (minutesMatch) {
      totalMinutes += parseInt(minutesMatch[0])
    }

    return totalMinutes
  }

  const convertMinutesToWeeksDaysHoursMinutes = (minutes: number) => {
    const minutesInWeek = 60 * 24 * 7
    const minutesInDay = 60 * 24
    const minutesInHour = 60

    const weeks = Math.floor(minutes / minutesInWeek)
    const days = Math.floor((minutes % minutesInWeek) / minutesInDay)
    const hours = Math.floor((minutes % minutesInDay) / minutesInHour)
    const remainingMinutes = minutes % minutesInHour

    return `${weeks}w ${days}d ${hours}h ${remainingMinutes}m`
  }
  return (
    <Drawer anchor={'right'} open={props.open} onClose={props.onClose}>
      <Box sx={{ padding: '20px', width: '550px' }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ marginBottom: '10px' }}
        >
          <IconButton onClick={props.onClose}>
            <ArrowRight size={24} />
          </IconButton>
          <Typography
            sx={{
              fontSize: '2.4rem',
              fontWeight: 700,
              color: '#49516F',
            }}
          >
            {props.stateWorkLog?.id ? t('editWorkLog') : t('createWorkLog')}
          </Typography>
        </Stack>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box mb={2}>
            <InputLabelCustom
              htmlFor="assignee"
              sx={{
                color: '#49516F',
                fontSize: '1.2rem',
              }}
            >
              {t('timeSpent')}
            </InputLabelCustom>
            <Grid container spacing={2}>
              <Grid xs>
                <Controller
                  control={control}
                  name="time_spent"
                  render={({ field }) => (
                    <Box>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          {...field}
                          id="time_spent"
                          placeholder="2w 4d 6h 45m"
                          error={!!errors.time_spent}
                          value={stateTimeSpent}
                          onChange={(e) => {
                            setStateTimeSpent(e.target.value)
                            field.onChange(convertTimeToMinutes(e.target.value))
                          }}
                        />
                        <FormHelperText error={!!errors.time_spent}>
                          {errors.time_spent && `${errors.time_spent.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mb={2}>
            <InputLabelCustom
              htmlFor="assignee"
              sx={{
                color: '#49516F',
                fontSize: '1.2rem',
              }}
            >
              {t('date')}
            </InputLabelCustom>
            <Grid container spacing={2}>
              <Grid xs>
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <Box>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <DatePicker
                            inputFormat="MM/DD/YYYY"
                            {...field}
                            onChange={(value: Moment | null) => {
                              if (!value) {
                                field.onChange(null)
                              } else {
                                field.onChange(value)
                              }
                            }}
                            shouldDisableDate={(day: any) => {
                              const date = new Date()
                              if (
                                moment(day).format('YYYY-MM-DD') >
                                moment(date).format('YYYY-MM-DD')
                              ) {
                                return true
                              }
                              return false
                            }}
                            renderInput={(params: any) => {
                              return (
                                <TextFieldCustom
                                  {...params}
                                  error={!!errors.date}
                                />
                              )
                            }}
                          />
                        </LocalizationProvider>
                        <FormHelperText error={!!errors.date}>
                          {errors.date && `${errors.date.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mb={2}>
            <InputLabelCustom
              htmlFor="assignee"
              sx={{
                color: '#49516F',
                fontSize: '1.2rem',
              }}
            >
              {t('time')}
            </InputLabelCustom>
            <Grid container spacing={2}>
              <Grid xs>
                <Controller
                  control={control}
                  name="time"
                  render={({ field }) => (
                    <Box>
                      <FormControl fullWidth>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                          <TimePicker
                            value={moment(field.value)}
                            onChange={(value: Moment | null) => {
                              if (!value) {
                                field.onChange('')
                              } else {
                                field.onChange(value)
                              }
                            }}
                            renderInput={(params) => (
                              <TextFieldCustom
                                {...params}
                                error={!!errors.time}
                              />
                            )}
                          />
                        </LocalizationProvider>
                        <FormHelperText error={!!errors.time}>
                          {errors.time && `${errors.time.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Box mb={2}>
            <InputLabelCustom
              htmlFor="assignee"
              sx={{
                color: '#49516F',
                fontSize: '1.2rem',
              }}
            >
              {t('description')}
            </InputLabelCustom>
            <Grid container spacing={2}>
              <Grid xs>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Box>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="description"
                          placeholder={t('description')}
                          error={!!errors.description}
                          {...field}
                        />
                        <FormHelperText error={!!errors.description}>
                          {errors.description &&
                            `${errors.description.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )}
                />
              </Grid>
            </Grid>
          </Box>
          <Stack direction="row" spacing={2}>
            <ButtonCancel
              type="reset"
              onClick={handleReset}
              size="large"
              sx={{ color: '#49516F' }}
            >
              {t('cancel')}
            </ButtonCancel>
            <ButtonCustom variant="contained" size="large" type="submit">
              {t('submit')}
            </ButtonCustom>
          </Stack>
        </form>
      </Box>
    </Drawer>
  )
}

export default CreateUpdateWorkLogComponent
