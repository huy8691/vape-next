import { Avatar, Box, Typography } from '@mui/material'
import { Stack, styled } from '@mui/system'
import dayjs from 'dayjs'
import moment from 'moment'
import { Crosshair } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import { formatPhoneNumber } from 'src/utils/global.utils'
import { ListSellerType } from '../../modelMap'

import { useTranslation } from 'react-i18next'

const CustomInfoWindow = styled(Stack)(() => ({
  maxWidth: '360px',

  minHeight: '200px',
  padding: '6px 0px 6px 6px',
  // // marginRight: '-6px',
  borderRadius: '8px',
  backgroundColor: '#fff',
  zIndex: '100',
}))
const TypographyInformation = styled(Typography)(() => ({
  fontWeight: '500',
}))
const TypographyBold = styled(Typography)(() => ({
  fontWeight: '700',
  fontSize: '20px',
  color: '#49516F',
}))

interface Props {
  SellerDetail: ListSellerType
}

const GoogleMapInforWindow: React.FC<Props> = (props) => {
  const { t } = useTranslation('map')

  // const [stateDateTime, setStateDateTime] = useState<number>(0)
  const [stateInterval, setStateInterval] = useState<number>(0)

  useEffect(() => {
    let countDown: any = null
    if (typeof props.SellerDetail.time_at_location === 'string') {
      const currentDateTime = new Date(dayjs().format()).getTime()
      const sellerStayTime = new Date(
        props.SellerDetail?.time_at_location
      ).getTime()
      setStateInterval(currentDateTime - sellerStayTime)
      countDown = setInterval(() => {
        setStateInterval((prevCount) => {
          prevCount = prevCount + 1000
          return prevCount
        })
      }, 1000)
    }
    if (
      props.SellerDetail.time_at_location === null &&
      props.SellerDetail.active === true
    ) {
      const currentDateTime = new Date(dayjs().format()).getTime()
      const sellerStayTime = new Date(dayjs().format()).getTime()
      setStateInterval(currentDateTime - sellerStayTime)
      countDown = setInterval(() => {
        setStateInterval((prevCount) => {
          prevCount = prevCount + 1000
          return prevCount
        })
      }, 1000)
    }
    return () => {
      clearInterval(countDown)
    }
  }, [props.SellerDetail.active, props.SellerDetail.time_at_location])

  // useEffect(() => {
  //   // if (!props.SellerDetail.active) {
  //   //   setStateDateTime(0)
  //   //   return
  //   // }
  //   // const newInterval = setInterval(() => {
  //   //   console.log('hehe')
  //   //   setStateDateTime((x) => x + 1)
  //   // }, 1000)
  //   // return () => {
  //   //   clearInterval(countDown)
  //   // }
  // }, [props.SellerDetail.active])

  return (
    <CustomInfoWindow justifyContent="center">
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ marginBottom: '15px' }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {props.SellerDetail.active ? (
            <>
              <Box
                sx={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#34DC75',
                }}
              />
              <Typography>{t('online')}</Typography>
            </>
          ) : (
            <Typography>{t('offline')}</Typography>
          )}
        </Stack>

        {/* <BatteryHigh size={24} /> */}
      </Stack>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          marginBottom: '10px',
          borderTop: '1px solid #E1E6EF',
          paddingTop: '15px',
        }}
      >
        <Box>
          <Avatar
            sx={{ width: '70px', height: '70px' }}
            src={props.SellerDetail.avatar}
          />
        </Box>
        <Stack>
          <Typography
            sx={{
              fontWeight: '600',

              color: props.SellerDetail.active ? '#1DB46A' : '#49516F',
              marginBottom: '5px',
            }}
          >
            {props.SellerDetail.full_name}
          </Typography>
          <TypographyInformation
            sx={{
              width: '250px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '5px',
            }}
          >
            <span className="icon-symbol" style={{ marginRight: '5px' }} />
            {props.SellerDetail.email}
          </TypographyInformation>
          <TypographyInformation
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span className="icon-phone" style={{ marginRight: '5px' }} />
            {formatPhoneNumber(props.SellerDetail.phone_number)}
          </TypographyInformation>
        </Stack>
      </Stack>
      <Box
        sx={{
          backgroundColor: '#F8F9FC',
          padding: '15px',
          borderRadius: '10px',
          // marginBottom: '20px',
        }}
      >
        <Stack direction="row" alignItems="center" sx={{ color: '#1DB46A' }}>
          <Crosshair size={16} weight={'bold'} />
          <Typography
            sx={{
              fontWeight: 500,
              marginLeft: '5px',
            }}
          >
            {t('currentLocation')}
          </Typography>
        </Stack>
        <Typography>{props.SellerDetail.address}</Typography>
        {props.SellerDetail.time_at_location === null &&
        props.SellerDetail.active === false ? (
          ''
        ) : (
          <Stack direction="row" spacing={2} justifyContent="center">
            <Stack justifyContent="center">
              <TypographyBold>
                {' '}
                {moment.utc(stateInterval).format(`HH`)}
              </TypographyBold>
              {moment.utc(stateInterval).format(`HH`) === `01` || `00` ? (
                <Typography>{t('hr')}</Typography>
              ) : (
                <Typography>{t('hrs')}</Typography>
              )}
            </Stack>
            <Stack>
              <TypographyBold>
                {' '}
                {moment.utc(stateInterval).format(`mm`)}
              </TypographyBold>
              <Typography>{t('min')}</Typography>
            </Stack>
            <Stack>
              <TypographyBold>
                {' '}
                {moment.utc(stateInterval).format(`ss`)}
              </TypographyBold>
              <Typography>{t('sec')}</Typography>
            </Stack>
          </Stack>
        )}
      </Box>
      {/* <ButtonCustom
        variant="text"
        sx={{ color: '#2F6FED' }}
      >
        {' '}
        <Eye
          size={24}
          style={{ marginRight: '5px' }}
        />{' '}
        View location history{' '}
      </ButtonCustom> */}
    </CustomInfoWindow>
  )
}

export default GoogleMapInforWindow
