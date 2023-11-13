import { yupResolver } from '@hookform/resolvers/yup'
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { ButtonCustom, InputLabelCustom, TextFieldCustom } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { formatPhoneNumber, handlerGetErrMessage } from 'src/utils/global.utils'
import GoogleAutoComplete from './part/GoogleAutoCompleteMui'
import { addShippingAddress, getListShipping } from './shippingAddressAPI'
import {
  ShippingAddressSubmitType,
  SubmitShippingAddressType,
} from './shippingAddressModel'
import dataState from './states.json'
import classes from './styles.module.scss'
import { schema } from './validation'
import { useTranslation } from 'next-i18next'

const ShippingAddressComponent = () => {
  const { t } = useTranslation('shipping')
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [valueInput, setValueInput] = useState<{
    name: string
    abbreviation: string
  }>({
    name: '',
    abbreviation: '',
  })
  const [valueInputForReturn, setValueInputReturn] = useState<{
    name: string
    abbreviation: string
  }>({
    name: '',
    abbreviation: '',
  })

  const {
    formState: { errors },
    control,
    getValues,

    trigger,
    handleSubmit,
    setValue,
  } = useForm<ShippingAddressSubmitType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })
  const handleSubmirtShippingAddressConfiguration = (
    value: ShippingAddressSubmitType
  ) => {
    dispatch(loadingActions.doLoading())
    const submitValueForPickup: SubmitShippingAddressType = {
      location: value.location.address,
      phone_number: value.phone_number
        .replaceAll(' ', '')
        .replace(')', '')
        .replace('(', ''),
      receiver_name: value.receiver_name,
      type: 'PICKUP',
      city: value.city,
      state: value.state.abbreviation,
      postal_zipcode: value.postal_zipcode,
    }
    const submitValueForReturn: SubmitShippingAddressType = {
      location: value.location_return.address,
      phone_number: value.phone_number_return
        .replaceAll(' ', '')
        .replace(')', '')
        .replace('(', ''),
      receiver_name: value.receiver_name_return,
      type: 'RETURN',
      city: value.city_return,
      state: value.state_return.abbreviation,
      postal_zipcode: value.postal_zipcode_return,
    }
    addShippingAddress(submitValueForPickup)
      .then(() => {
        addShippingAddress(submitValueForReturn)
          .then(() => {
            pushMessage(
              t('messenger.configShippingAddressSuccessfully'),
              'success'
            )
            dispatch(loadingActions.doLoadingSuccess())
          })
          .catch(({ response }) => {
            const { status, data } = response
            dispatch(loadingActions.doLoadingFailure())

            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    getListShipping()
      .then((res) => {
        const { data } = res.data
        console.log('data list shipping', data)

        const foundIndexForPickUp = data.findIndex(
          (item) => item.type == 'PICKUP'
        )
        console.log('foundIndexForPickUp', foundIndexForPickUp)
        const foundIndexForReturn = data.findIndex(
          (item) => item.type == 'RETURN'
        )
        console.log('foundIndexForReturn', foundIndexForReturn)

        if (foundIndexForPickUp >= 0) {
          console.log('hehe')
          const filtered = dataState.find(
            (i: { abbreviation: string }) =>
              i?.abbreviation === data[foundIndexForPickUp]?.state
          )
          setValue('location.address', data[foundIndexForPickUp].location)
          setValue(
            'phone_number',
            formatPhoneNumber(data[foundIndexForPickUp].contact_phone_number)
          )
          setValue('city', data[foundIndexForPickUp].city)
          console.log('filtered?.name', filtered?.name)
          console.log(
            'data[foundIndexForPickUp].state',
            data[foundIndexForPickUp].state
          )
          setValue('state', {
            name: filtered?.name ? filtered?.name : '',
            abbreviation: data[foundIndexForPickUp].state,
          })
          setValue('receiver_name', data[foundIndexForPickUp].contact_name)

          setValue('postal_zipcode', data[foundIndexForPickUp].postal_zipcode)

          setValueInput({
            name: filtered?.name ? filtered?.name : '',
            abbreviation: data[foundIndexForPickUp].state,
          })
        }
        if (foundIndexForReturn >= 0) {
          console.log('hihi')

          const filtered = dataState.find(
            (i: { abbreviation: string }) =>
              i?.abbreviation === data[foundIndexForReturn]?.state
          )
          setValue(
            'location_return.address',
            data[foundIndexForReturn].location
          )
          setValue(
            'phone_number_return',
            formatPhoneNumber(data[foundIndexForReturn].contact_phone_number)
          )
          setValue(
            'receiver_name_return',
            data[foundIndexForReturn].contact_name
          )
          setValue('city_return', data[foundIndexForReturn].city)
          setValueInputReturn({
            name: filtered?.name ? filtered?.name : '',
            abbreviation: data[foundIndexForReturn].state,
          })
          setValue('state_return', {
            name: filtered?.name ? filtered?.name : '',
            abbreviation: data[foundIndexForReturn].state,
          })
          setValue(
            'postal_zipcode_return',
            data[foundIndexForReturn].postal_zipcode
          )
        }
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [])
  return (
    <Box>
      <form onSubmit={handleSubmit(handleSubmirtShippingAddressConfiguration)}>
        <Grid sx={{ marginBottom: '15px' }} container spacing={5}>
          <Grid xs={6}>
            <Box>
              <Typography sx={{ fontSize: '2.4rem', marginBottom: '15px' }}>
                {t('pickUpLocation')}
              </Typography>
              <Typography sx={{ marginBottom: '15px' }}>
                {t(
                  'thisAddressWillBeSetAsDefaultPickupLocationYouCanChangeItWhenProcessingYourOrder'
                )}
              </Typography>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  name="location"
                  control={control}
                  render={() => (
                    <>
                      <InputLabelCustom error={!!errors.location?.address}>
                        {t('pickUpLocation')}
                        <RequiredLabel />
                      </InputLabelCustom>

                      <FormControl fullWidth>
                        <GoogleAutoComplete
                          onChangeValue={(value) => {
                            setValue('location', value)
                            trigger('location')
                            console.log('34543534545435', value)
                          }}
                          value={getValues('location')}
                          error={!!errors.location?.address}
                        />
                        <FormHelperText error={!!errors.location?.address}>
                          {errors.location?.address &&
                            `${errors.location?.address.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>

              <Stack
                direction="row"
                spacing={2}
                sx={{ width: '100%', marginBottom: '15px' }}
              >
                <Box sx={{ width: '100%' }}>
                  <Controller
                    control={control}
                    name="city"
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <InputLabelCustom htmlFor="city" error={!!errors.city}>
                          <RequiredLabel />
                          {t('city')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="city"
                            error={!!errors.city}
                            {...field}
                          />
                          <FormHelperText error={!!errors.city}>
                            {errors.city && `${errors.city.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    control={control}
                    name="state"
                    render={() => (
                      <>
                        <InputLabelCustom
                          htmlFor="state"
                          error={!!errors.state?.name}
                        >
                          <RequiredLabel />
                          {t('state')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <Autocomplete
                            getOptionLabel={(option) => option.name}
                            options={dataState}
                            value={valueInput}
                            renderInput={(params) => (
                              <TextFieldCustom
                                error={!!errors.state?.name}
                                {...(params as any)}
                              />
                            )}
                            onChange={(_, newValue) => {
                              console.log('event', newValue)
                              if (newValue) {
                                setValue('state', newValue)
                                setValueInput(newValue)
                              } else {
                                setValue('state', {
                                  name: '',
                                  abbreviation: '',
                                })
                                setValueInput({
                                  name: '',
                                  abbreviation: '',
                                })
                              }
                              trigger('state')
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root .MuiAutocomplete-input':
                                {
                                  padding: '1px 5px',
                                },
                            }}
                          />
                          <FormHelperText error={!!errors.state?.name}>
                            {errors.state?.name &&
                              `${errors.state?.name?.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
              </Stack>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={control}
                  name="postal_zipcode"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="postal_zipcode"
                        error={!!errors.postal_zipcode}
                      >
                        <RequiredLabel />
                        {t('postalZipcode')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="postal_zipcode"
                          error={!!errors.postal_zipcode}
                          {...field}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            console.log('e', e, getValues('state'))
                            setValue('postal_zipcode', e.target.value)
                            trigger('postal_zipcode')
                          }}
                        />
                        <FormHelperText error={!!errors.postal_zipcode}>
                          {errors.postal_zipcode &&
                            `${errors.postal_zipcode.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  name="receiver_name"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="receiver_name"
                        error={!!errors.receiver_name}
                      >
                        <RequiredLabel />
                        {t('contactName')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          {...field}
                          error={!!errors.receiver_name}
                        />
                        <FormHelperText error={!!errors.receiver_name}>
                          {errors.receiver_name &&
                            `${errors.receiver_name.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Box>
                <Controller
                  control={control}
                  name="phone_number"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="phone_number"
                        sx={{ marginBottom: '10px' }}
                        error={!!errors.phone_number}
                      >
                        <RequiredLabel />
                        {t('phoneNumber')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <div className={classes['input-number']}>
                          <PatternFormat
                            id="phone_number"
                            customInput={TextField}
                            {...field}
                            error={!!errors.phone_number}
                            placeholder={t('searchCustomerByName')}
                            format="(###) ### ####"
                          />
                        </div>

                        <FormHelperText error={!!errors.phone_number}>
                          {errors.phone_number &&
                            `${errors.phone_number.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
            </Box>
          </Grid>
          <Grid xs={6}>
            <Box>
              <Typography sx={{ fontSize: '2.4rem', marginBottom: '15px' }}>
                {t('returnLocation')}
              </Typography>
              <Typography sx={{ marginBottom: '15px' }}>
                {t('defineAReturnAddressForHandlingCanceledOrders')}
              </Typography>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  name="location_return"
                  control={control}
                  render={() => (
                    <>
                      <InputLabelCustom
                        error={!!errors.location_return?.address}
                      >
                        {t('returnLocation')}
                        <RequiredLabel />
                      </InputLabelCustom>

                      <FormControl fullWidth>
                        <GoogleAutoComplete
                          onChangeValue={(value) => {
                            setValue('location_return', value)
                            trigger('location_return')
                            console.log('34543534545435', value)
                          }}
                          value={getValues('location_return')}
                          error={!!errors.location_return?.address}
                        />
                        <FormHelperText
                          error={!!errors.location_return?.address}
                        >
                          {errors.location_return?.address &&
                            `${errors.location_return?.address.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>

              <Stack
                direction="row"
                spacing={2}
                sx={{ width: '100%', marginBottom: '15px' }}
              >
                <Box sx={{ width: '100%' }}>
                  <Controller
                    control={control}
                    name="city_return"
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="city_return"
                          error={!!errors.city_return}
                        >
                          <RequiredLabel />
                          {t('city')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="city_return"
                            error={!!errors.city_return}
                            {...field}
                          />
                          <FormHelperText error={!!errors.city_return}>
                            {errors.city_return &&
                              `${errors.city_return.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    control={control}
                    name="state_return"
                    render={() => (
                      <>
                        <InputLabelCustom
                          htmlFor="state_return"
                          error={!!errors.state_return?.name}
                        >
                          <RequiredLabel />
                          {t('state')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <Autocomplete
                            getOptionLabel={(option) => option.name}
                            options={dataState}
                            value={valueInputForReturn}
                            renderInput={(params) => (
                              <TextFieldCustom
                                error={!!errors.state_return?.name}
                                {...(params as any)}
                              />
                            )}
                            onChange={(_, newValue) => {
                              console.log('event', newValue)
                              if (newValue) {
                                setValue('state_return', newValue)
                                setValueInputReturn(newValue)
                              } else {
                                setValue('state_return', {
                                  name: '',
                                  abbreviation: '',
                                })
                                setValueInputReturn({
                                  name: '',
                                  abbreviation: '',
                                })
                              }
                              trigger('state_return')
                            }}
                            sx={{
                              '& .MuiOutlinedInput-root .MuiAutocomplete-input':
                                {
                                  padding: '1px 5px',
                                },
                            }}
                          />
                          <FormHelperText error={!!errors.state_return?.name}>
                            {errors.state_return?.name &&
                              `${errors.state_return?.name?.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
              </Stack>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={control}
                  name="postal_zipcode_return"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="postal_zipcode_return"
                        error={!!errors.postal_zipcode_return}
                      >
                        <RequiredLabel />
                        {t('postalZipcode')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="postal_zipcode_return"
                          error={!!errors.postal_zipcode_return}
                          {...field}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            console.log('e', e, getValues('state'))
                            setValue('postal_zipcode_return', e.target.value)
                            trigger('postal_zipcode_return')
                          }}
                        />
                        <FormHelperText error={!!errors.postal_zipcode_return}>
                          {errors.postal_zipcode_return &&
                            `${errors.postal_zipcode_return.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  name="receiver_name_return"
                  control={control}
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="receiver_name_return"
                        error={!!errors.receiver_name_return}
                      >
                        <RequiredLabel />
                        {t('contactName')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          {...field}
                          error={!!errors.receiver_name_return}
                        />
                        <FormHelperText error={!!errors.receiver_name_return}>
                          {errors.receiver_name_return &&
                            `${errors.receiver_name_return.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
              <Box>
                <Controller
                  control={control}
                  name="phone_number_return"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="phone_number_return"
                        sx={{ marginBottom: '10px' }}
                        error={!!errors.phone_number_return}
                      >
                        <RequiredLabel />
                        {t('phoneNumber')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <div className={classes['input-number']}>
                          <PatternFormat
                            id="phone_number_return"
                            customInput={TextField}
                            {...field}
                            error={!!errors.phone_number_return}
                            placeholder={t('searchCustomerByName')}
                            format="(###) ### ####"
                          />
                        </div>

                        <FormHelperText error={!!errors.phone_number_return}>
                          {errors.phone_number_return &&
                            `${errors.phone_number_return.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
        <ButtonCustom variant="contained" size="large" type="submit">
          {t('submit')}
        </ButtonCustom>
      </form>
    </Box>
  )
}

export default ShippingAddressComponent
