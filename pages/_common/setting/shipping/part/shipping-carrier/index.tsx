import { Avatar, Box, Stack, Switch, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import {
  getListCarrierConfiguration,
  updateCarrierConfiguration,
} from './shippingCarrierAPI'
import { ListCarrierType } from './shippingCarrierModel'
import { useTranslation } from 'next-i18next'

const CarrierShippingComponent = () => {
  const { t } = useTranslation('shipping')
  const [stateListCarrier, setStateListCarrier] = useState<ListCarrierType[]>(
    []
  )
  const dispatch = useAppDispatch()

  const [pushMessage] = useEnqueueSnackbar()

  const handleGetListCarrier = () => {
    getListCarrierConfiguration()
      .then((res) => {
        const { data } = res.data
        setStateListCarrier(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    handleGetListCarrier()
  }, [])

  const handleUpdateCarrierStatus = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    dispatch(loadingActions.doLoading())
    updateCarrierConfiguration({
      carrier: index,
      status: e.target.checked,
    })
      .then(() => {
        pushMessage(t('messenger.updateStatusSuccessfully'), 'success')
        handleGetListCarrier()
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  return (
    <Box sx={{ background: '#F8F9FC', minHeight: '500px' }}>
      <Stack
        direction="row"
        spacing={3}
        sx={{ flexWrap: 'wrap', padding: '15px' }}
      >
        {stateListCarrier.map((item, index) => {
          return (
            <Stack
              key={index}
              direction="row"
              justifyContent="space-between"
              sx={{
                padding: '15px',
                background: 'white',
                minWidth: '300px',
                borderRadius: '10px',
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar
                  alt="name"
                  src={item.logo ? item.logo : '/' + '/images/vapeProduct.png'}
                />
                <Typography>{item.name}</Typography>
              </Stack>
              {/* <Stack direction="row" spacing={1} alignItems="center">
                <Typography>{item.status ? 'ENABLE' : 'DISABLE'}</Typography>
           

              
                <IconButton
                  onClick={(e) => {
                    setStateCurrentCarrier(item)
                    handleOpenMenu(e)
                  }}
                >
                  <Gear size={28} />
                </IconButton>
              </Stack> */}
              <Switch
                checked={item.status}
                onChange={(e) => handleUpdateCarrierStatus(e, item.id)}
              />
            </Stack>
          )
        })}
      </Stack>
    </Box>
  )
}

export default CarrierShippingComponent
