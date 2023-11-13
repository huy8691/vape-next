import { Box, IconButton, Stack, Typography, styled } from '@mui/material'
import { Clock, Play, Stop } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import { checkInOutWorkLog, getWorkingStatus } from '../headerAPI'
import { useAppDispatch } from 'src/store/hooks'
import { workLogsActions } from 'src/store/workLogs/workLogsSlice'

const ClockCustom = styled(Clock)(({ theme }) => ({
  color: theme.palette.primary.main,
}))

const DividerCustom = styled('div')(() => ({
  backgroundColor: '#E1E6EF',
  height: '15px',
  width: '1px',
}))

const LoggingTime: React.FC = () => {
  const dispatch = useAppDispatch()
  const [workingStatus, setWorkingStatus] = useState('')
  const [currentDuration, setCurrentDuration] = useState(0)

  useEffect(() => {
    getWorkingStatus().then((res) => {
      const { data } = res.data
      setWorkingStatus(data.status)
      if (data.status === 'WORKING') {
        setCurrentDuration(data.duration)
      }
    })
  }, [])

  useEffect(() => {
    if (currentDuration === 0) return
    const interval = setInterval(() => {
      setCurrentDuration(() => Number(currentDuration) + 1)
    }, 1000)

    if (workingStatus === 'STOPWORKING') {
      clearInterval(interval)
      dispatch(workLogsActions.doRefresh())
    }

    return () => {
      clearInterval(interval)
    }
  }, [currentDuration])

  const convertMinutesToHHMM = (durationInSeconds: number) => {
    if (durationInSeconds === 0) return '00:00:00'
    const hours = Math.floor(durationInSeconds / 3600)
    const minutes = Math.floor((durationInSeconds % 3600) / 60)
    const seconds = Math.floor(durationInSeconds % 60)

    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }

  const handleCheckInOutWorkLog = () => {
    checkInOutWorkLog().then(() => {
      getWorkingStatus().then((res) => {
        const { data } = res.data
        setWorkingStatus(data.status)
        setCurrentDuration(data.duration)
      })
    })
  }

  console.log('currentDuration', currentDuration)

  return (
    <>
      <Box
        sx={{
          padding: '5px 10px',
          borderRadius: '5px',
          border: '1px solid #F8F9FC',
          background: '#F8F9FC',
          marginLeft: '16px',
        }}
      >
        {workingStatus && workingStatus === 'STOPWORKING' && (
          <Stack direction={'row'} gap={1} alignItems={'center'}>
            <ClockCustom size={20} weight="bold" color="#E02D3C" />
            <Typography
              sx={{
                color: '#E02D3C',
                fontWeight: 400,
                fontSize: '14px',
              }}
            >
              Stopped Working
            </Typography>

            <DividerCustom />

            <Stack>
              <IconButton
                size="small"
                color="inherit"
                onClick={handleCheckInOutWorkLog}
              >
                <Play size={20} color="#1DB46A" weight="fill" />
              </IconButton>
            </Stack>
          </Stack>
        )}

        {workingStatus && workingStatus !== 'STOPWORKING' && (
          <Stack direction={'row'} gap={1} alignItems={'center'}>
            <ClockCustom size={20} weight="bold" />
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '14px',
              }}
            >
              Working {convertMinutesToHHMM(currentDuration)}
            </Typography>

            <DividerCustom />

            <Stack>
              <IconButton
                size="small"
                color="inherit"
                onClick={handleCheckInOutWorkLog}
              >
                <Stop size={20} weight="fill" color="#E02D3C" />
              </IconButton>
            </Stack>
          </Stack>
        )}
      </Box>
    </>
  )
}

export default LoggingTime
