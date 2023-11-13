import { Grid, Stack, Switch, TextField, Typography } from '@mui/material'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker'
import moment, { Moment } from 'moment'
import React, { useState } from 'react'
import { ButtonCustom } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { updateAllWorkShift } from './apiSeller'
import { useTranslation } from 'next-i18next'

const WorkShift: React.FC<{
  workShift:
    | {
        id?: number | undefined
        day_of_week?: string | undefined
        from_time?: string | undefined
        to_time?: string | undefined
        enable?: boolean | undefined
      }[]
    | undefined
  stateSellerId: number | undefined
  setFlagUpdateDetail: React.Dispatch<React.SetStateAction<string>>
}> = (props) => {
  const { t } = useTranslation('user-management')
  const [shiftHoursData, setShiftHoursData] = useState<
    | {
        id?: number | undefined
        day_of_week?: string | undefined
        from_time?: string | undefined
        to_time?: string | undefined
        enable?: boolean | undefined
      }[]
  >(props.workShift || [])
  const [pushMessage] = useEnqueueSnackbar()

  const onChangeChk = (id?: number) => {
    if (shiftHoursData?.length === 0) return
    const arrTemp: any[] = []

    shiftHoursData?.map((item) => {
      if (item.id === id) {
        arrTemp.push({
          ...item,
          enable: !item.enable,
        })
      } else {
        arrTemp.push(item)
      }
    })
    setShiftHoursData(arrTemp)
  }

  const onChangeTimeStart = (value: Moment | null, id: number) => {
    if (value && shiftHoursData) {
      const arrTemp: any[] = []
      shiftHoursData.map((item) => {
        if (item.id === id) {
          arrTemp.push({
            ...item,
            from_time: value.format('HH:mm:ss'),
          })
        } else {
          arrTemp.push(item)
        }
      })
      setShiftHoursData(arrTemp)
    }
  }

  const onChangeTimeEnd = (value: Moment | null, id: number) => {
    if (value && shiftHoursData) {
      const arrTemp: any[] = []
      shiftHoursData.map((item) => {
        if (item.id === id) {
          arrTemp.push({
            ...item,
            to_time: value.format('HH:mm:ss'),
          })
        } else {
          arrTemp.push(item)
        }
      })
      setShiftHoursData(arrTemp)
    }
  }

  const onSave = () => {
    let isError = false

    for (const [, item] of shiftHoursData.entries() as any) {
      const start = moment(
        moment.utc(item.from_time || '', 'HH:mm:ss').format('HH:mm:ss'),
        'HH:mm:ss'
      )

      const end = moment(
        moment.utc(item.to_time || '', 'HH:mm:ss').format('HH:mm:ss'),
        'HH:mm:ss'
      )

      if (start.isAfter(end)) {
        isError = true
        pushMessage(
          `${item.day_of_week}'s end time must greater than its start time`,
          'error'
        )
      }
    }
    if (!isError) {
      updateAllWorkShift(props.stateSellerId!, shiftHoursData)
        .then(() => {
          pushMessage(t('message.updateAllWorkShiftSuccessfully'), 'success')
          props.setFlagUpdateDetail('' + new Date().getTime())
        })
        .catch(() => {
          pushMessage(t('message.updateAllWorkShiftFailed'), 'error')
        })
    }
  }

  return (
    <>
      {shiftHoursData?.map((item) => {
        return (
          <Stack
            key={item.id}
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent={'space-between'}
            sx={{ marginBottom: '10px' }}
          >
            <Grid container spacing={2}>
              <Grid
                xs={2}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ color: '#49516F', fontSize: '16px' }}>
                  {t(`${item.day_of_week}` as any)}
                </Typography>
              </Grid>
              <Grid
                xs={8}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Stack
                  key={item.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ marginBottom: '10px' }}
                >
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <MobileTimePicker
                      value={moment(item.from_time, 'HH:mm:ss')}
                      onChange={(time) => {
                        onChangeTimeStart(time, item.id!)
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <MobileTimePicker
                      value={moment(item.to_time, 'HH:mm:ss')}
                      renderInput={(params) => <TextField {...params} />}
                      onChange={(time) => {
                        onChangeTimeEnd(time, item.id!)
                      }}
                    />
                  </LocalizationProvider>
                </Stack>
              </Grid>
              <Grid
                xs={2}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Switch
                  sx={{
                    margin: 'auto',
                  }}
                  checked={item.enable}
                  onChange={() => onChangeChk(item.id)}
                />
              </Grid>
            </Grid>
          </Stack>
        )
      })}
      <ButtonCustom variant="contained" size="large" onClick={onSave}>
        {t('save')}
      </ButtonCustom>
    </>
  )
}

export default WorkShift
