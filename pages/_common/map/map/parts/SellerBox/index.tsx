import { Avatar, Badge, Box, Stack, Typography } from '@mui/material'
import { styled } from '@mui/system'
import dayjs from 'dayjs'
import moment from 'moment'
import React, { useEffect, useState } from 'react'

import { formatPhoneNumber } from 'src/utils/global.utils'
import { ListSellerType, PositionType } from '../../modelMap'
import classes from './styles.module.scss'
import { useTranslation } from 'react-i18next'

interface Props {
  SellerDetail: ListSellerType
  stateMarker: number | null
  handleSetActiveMarker: (marker: number, position: PositionType) => void
  handleCreateKey: (location: PositionType, id: number) => number
}
const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#1DB46A',
    color: '#1DB46A',
    boxShadow: '0 0 0 2px #F8F9FC',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))
const TypographyInformation = styled(Typography)(() => ({
  fontWeight: '500',
}))

const SellerBox: React.FC<Props> = (props) => {
  const { t } = useTranslation('map')
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

  return (
    <Box
      className={classes['custom-box']}
      //   key={props.SellerDetail.id + 'id'}
      onClick={() => {
        {
          props.SellerDetail.latitude &&
            props.SellerDetail.longitude &&
            props.handleSetActiveMarker(
              props.handleCreateKey(
                {
                  lat: props.SellerDetail.latitude,
                  lng: props.SellerDetail.longitude,
                },
                props.SellerDetail.id
              ),
              {
                lat: props.SellerDetail.latitude,
                lng: props.SellerDetail.longitude,
              }
            )
        }
      }}
      sx={{
        background: '#F8F9FC',
        color: '#49516F',
        padding: '15px',
        cursor: 'pointer',
        border:
          props.stateMarker ===
          props.handleCreateKey(
            {
              lat: props.SellerDetail.latitude,
              lng: props.SellerDetail.longitude,
            },
            props.SellerDetail.id
          )
            ? '1px solid #34DC75'
            : '',

        marginBottom: '15px',
        borderRadius: '15px',
      }}
    >
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          borderBottom: '1px solid rgba(186, 186, 186, 0.25)',
          marginBottom: '10px',
          paddingBottom: '5px',
        }}
      >
        <Box>
          {props.SellerDetail.active ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              variant="dot"
            >
              <Avatar
                alt={props.SellerDetail.full_name}
                src={props.SellerDetail.avatar}
              />
            </StyledBadge>
          ) : (
            <Avatar src={props.SellerDetail.avatar} />
          )}
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
      {props.SellerDetail.address ? (
        <TypographyInformation sx={{ color: '#BABABA' }}>
          {t('stayAt')}{' '}
          <span style={{ color: '#49516F' }}>{props.SellerDetail.address}</span>{' '}
          {props.SellerDetail.time_at_location || props.SellerDetail.active ? (
            <>
              <span>{t('for')}</span>
              <span style={{ color: '#49516F' }}>
                {' '}
                {moment
                  .utc(stateInterval)
                  .format(
                    `[ ] HH[ ${
                      moment.utc(stateInterval).format(`HH`) === `01`
                        ? 'hr'
                        : 'hrs'
                    } ]mm[ mins ]ss[ seconds ]`
                  )}
              </span>
            </>
          ) : (
            ''
          )}
        </TypographyInformation>
      ) : (
        <TypographyInformation sx={{ color: '#BABABA' }}>
          {t('noLocationFound')}
        </TypographyInformation>
      )}
    </Box>
  )
}

export default SellerBox
