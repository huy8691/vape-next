import { yupResolver } from '@hookform/resolvers/yup'
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  Stack,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ButtonCustom, InputLabelCustom, TextFieldCustom } from 'src/components'
import RequiredLabel from 'src/components/requiredLabel'
import { UpdateBusinessType } from './businessModel'
import { schema } from './validations'
import { State } from 'country-state-city'
import zipState from 'zip-state'
import { getBusinessProfile, updateBusiness } from './apiBusiness'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useTranslation } from 'next-i18next'
const UpdateBusinessComponent: React.FC = () => {
  const { t } = useTranslation('business')
  const [stateValidateZipcode, setStateValidateZipcode] = useState(false)
  const [stateFoundIndex, setStateFoundIndex] = useState<number>(-1)
  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()

  const {
    formState: { errors },
    control,
    getValues,
    watch,
    trigger,
    handleSubmit,
    setValue,
  } = useForm<UpdateBusinessType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })
  const handleGetBusinessProfile = () => {
    getBusinessProfile()
      .then((res) => {
        const { data } = res.data

        setValue('business_name', data.business_name)
        setValue('address', data.address)
        setValue('city', data.city)
        setValue('website_link_url', data.website_link_url)
        setValue('postal_zipcode', data.postal_zipcode)
        const foundIndex = State.getStatesOfCountry('US').findIndex(
          (item) => item.isoCode === data.state
        )
        console.log('foundIndex', foundIndex)
        if (foundIndex < 0) return
        setStateFoundIndex(foundIndex)

        setValue('state', data.state)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    handleGetBusinessProfile()
  }, [])

  const onSubmitUpdate = (value: UpdateBusinessType) => {
    dispatch(loadingActions.doLoading())
    updateBusiness(value)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        handleGetBusinessProfile()
        pushMessage(t('message.updateBusinessProfileSuccessfully'), 'success')
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <Box
      sx={{
        width: '100%',
        border: '1px solid #E1E6EF',
        padding: '25px',
        borderRadius: '10px',
      }}
    >
      <form onSubmit={handleSubmit(onSubmitUpdate)}>
        <Box sx={{ marginBottom: '15px' }}>
          <Controller
            control={control}
            name="business_name"
            defaultValue=""
            render={({ field }) => (
              <>
                <InputLabelCustom htmlFor="name" error={!!errors.business_name}>
                  <RequiredLabel />
                  {t('businessName')}
                </InputLabelCustom>
                <FormControl fullWidth>
                  <TextFieldCustom
                    id="name"
                    placeholder={t('enterBusinessName')}
                    error={!!errors.business_name}
                    {...field}
                  />
                  <FormHelperText error={!!errors.business_name}>
                    {errors.business_name && `${errors.business_name.message}`}
                  </FormHelperText>
                </FormControl>
              </>
            )}
          />
        </Box>

        <Stack direction="row" spacing={2} sx={{ marginBottom: '15px' }}>
          <Box sx={{ width: '100%' }}>
            <Controller
              control={control}
              name="website_link_url"
              defaultValue=""
              render={({ field }) => (
                <>
                  <InputLabelCustom
                    htmlFor="name"
                    error={!!errors.website_link_url}
                  >
                    <RequiredLabel />
                    {t('websiteUrl')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="website_link_url"
                      placeholder={t('enterWebsiteLinkUrl')}
                      error={!!errors.website_link_url}
                      {...field}
                    />
                    <FormHelperText error={!!errors.website_link_url}>
                      {errors.website_link_url &&
                        `${errors.website_link_url.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
          </Box>
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
                      placeholder={t('enterCity')}
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
        </Stack>
        <Stack direction="row" spacing={2} sx={{ marginBottom: '15px' }}>
          <Box sx={{ width: '100%' }}>
            <Controller
              control={control}
              name="state"
              render={() => (
                <>
                  <InputLabelCustom htmlFor="state" error={!!errors.state}>
                    <RequiredLabel />
                    {t('state')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <Autocomplete
                      value={
                        stateFoundIndex >= 0
                          ? State.getStatesOfCountry('US')[stateFoundIndex]
                          : null
                      }
                      options={State.getStatesOfCountry('US')}
                      getOptionLabel={(item) => {
                        return item.name
                      }}
                      onChange={(event, value) => {
                        console.log(event)
                        setValue('state', String(value?.isoCode))

                        trigger('state')
                        setStateValidateZipcode(
                          zipState(getValues('postal_zipcode')) !==
                            String(value?.isoCode)
                        )
                        const foundIndex = State.getStatesOfCountry(
                          'US'
                        ).findIndex((item) => item.isoCode === value?.isoCode)
                        console.log('foundIndex', foundIndex)
                        if (foundIndex < 0) return
                        setStateFoundIndex(foundIndex)
                        console.log(
                          'getValue postal zip code',
                          zipState(getValues('postal_zipcode'))
                        )
                        console.log('iso code', String(value?.isoCode))
                      }}
                      renderInput={(params) => (
                        <TextFieldCustom {...(params as any)} />
                      )}
                    />
                    <FormHelperText error={!!errors.state}>
                      {errors.state && `${errors.state.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <Controller
              control={control}
              name="postal_zipcode"
              defaultValue=""
              render={({ field }) => (
                <>
                  <InputLabelCustom
                    htmlFor="name"
                    error={!!errors.postal_zipcode}
                  >
                    <RequiredLabel />
                    {t('zipcode')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="postal_zipcode"
                      placeholder={t('enterPostalZipcode')}
                      error={!!errors.postal_zipcode || stateValidateZipcode}
                      {...field}
                      onChange={(event) => {
                        setValue('postal_zipcode', event.target.value)
                        setStateValidateZipcode(
                          zipState(event.target.value) !== watch('state')
                        )
                        console.log(
                          ' zipState(event.target.value)',
                          zipState(event.target.value)
                        )
                        console.log('watch state', watch('state'))
                      }}
                    />
                    {!errors.postal_zipcode && stateValidateZipcode && (
                      <FormHelperText error>
                        {t('postalZipcodeIsNotMatchWithCurrentState')}
                      </FormHelperText>
                    )}
                    <FormHelperText error>
                      {errors.postal_zipcode &&
                        `${errors.postal_zipcode.message}`}
                    </FormHelperText>
                  </FormControl>
                </>
              )}
            />
          </Box>
        </Stack>
        <Box sx={{ width: '100%', marginBottom: '15px' }}>
          <Controller
            control={control}
            name="address"
            defaultValue=""
            render={({ field }) => (
              <>
                <InputLabelCustom htmlFor="name" error={!!errors.address}>
                  <RequiredLabel />
                  {t('address')}
                </InputLabelCustom>
                <FormControl fullWidth>
                  <TextFieldCustom
                    id="address"
                    placeholder={t('enterAddress')}
                    error={!!errors.address}
                    {...field}
                  />
                  <FormHelperText error={!!errors.address}>
                    {errors.address && `${errors.address.message}`}
                  </FormHelperText>
                </FormControl>
              </>
            )}
          />
        </Box>
        <ButtonCustom type="submit" variant="contained" size="large">
          {t('save')}
        </ButtonCustom>
      </form>
    </Box>
  )
}

export default UpdateBusinessComponent
