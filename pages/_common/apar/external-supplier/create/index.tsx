//Api

import {
  Autocomplete,
  Box,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ArrowRight } from '@phosphor-icons/react'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import Grid from '@mui/material/Unstable_Grid2'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
} from 'src/components'
import RequiredLabel from 'src/components/requiredLabel'
import { PatternFormat } from 'react-number-format'
import dataState from './states.json'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validation'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { createExternalSupplier } from './createExternalSupplierAPI'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

const CreateExternalSupplierComponent: React.FC<{
  open: boolean
  onClose: (value: boolean) => void
  handleGetListExternalSupplier: (query: any) => void
}> = (props) => {
  const { t } = useTranslation('external-supplier')
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  const {
    control,
    setValue,
    reset,
    handleSubmit,
    trigger,
    clearErrors,
    formState: { errors },
  } = useForm<{
    name: string
    phone_number: string
    email: string
    address: string
    city: string
    state: {
      name: string
      abbreviation: string
    }
    postal_zipcode: string
  }>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

  const handleCheckKeyValueObjectValid = (value: any) => {
    const filteredValues: any = Object.fromEntries(
      Object.entries(value).filter(([, value]) => !!value)
    )

    return filteredValues
  }

  const onSubmit = (values: any) => {
    dispatch(loadingActions.doLoading())
    try {
      createExternalSupplier(
        handleCheckKeyValueObjectValid({
          ...values,
          phone_number: (values.phone_number = values.phone_number.replace(
            /\D/g,
            ''
          )),
          state: values?.state?.abbreviation,
        })
      )
        .then(() => {
          props.handleGetListExternalSupplier(router.query)
          pushMessage(
            t('message.createExternalSupplierSuccessfully'),
            'success'
          )
          props.onClose(false)
          reset()
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          dispatch(loadingActions.doLoadingFailure())
        })
        .finally(() => {
          dispatch(loadingActions.doLoadingSuccess())
        })
    } catch (error) {
      pushMessage(t('message.somethingsWentWrong'), 'error')
      dispatch(loadingActions.doLoadingFailure())
    }
  }

  const handleCancel = () => {
    reset()
    clearErrors()
    props.onClose(false)
  }
  return (
    <Drawer anchor="right" open={props.open} onClose={handleCancel}>
      <Stack direction="row">
        <Box sx={{ width: '425px', padding: '20px' }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              marginBottom: '10px',
            }}
          >
            <IconButton onClick={handleCancel}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              {t('createExternalSuppler')}
            </Typography>
          </Stack>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2}>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={control}
                    defaultValue=""
                    name="name"
                    render={({ field }) => (
                      <Box>
                        <InputLabelCustom htmlFor="name" error={!!errors.name}>
                          <RequiredLabel />
                          {t('businessName')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="name"
                            error={!!errors.name}
                            placeholder={t('businessName')}
                            {...field}
                          />
                          <FormHelperText error={!!errors.name}>
                            {errors.name && `${errors.name.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <Box>
                        <InputLabelCustom
                          htmlFor="email"
                          error={!!errors.email}
                        >
                          {t('email')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="email"
                            error={!!errors.email}
                            placeholder={t('email')}
                            {...field}
                          />
                          <FormHelperText error={!!errors.email}>
                            {errors.email && `${errors.email.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={control}
                    defaultValue=""
                    name="phone_number"
                    render={({ field }) => (
                      <Box>
                        <InputLabelCustom
                          htmlFor="phone_number"
                          error={!!errors.phone_number}
                        >
                          {t('phoneNumber')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <div className="input-number">
                            <PatternFormat
                              placeholder="(xxx) xxx xxxx "
                              id="phone_number"
                              customInput={TextField}
                              {...field}
                              error={!!errors.phone_number}
                              format="(###) ### ####"
                            />
                          </div>
                          <FormHelperText error={!!errors.phone_number}>
                            {errors.phone_number &&
                              `${errors.phone_number.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={control}
                    defaultValue=""
                    name="address"
                    render={({ field }) => (
                      <Box>
                        <InputLabelCustom
                          htmlFor="address"
                          error={!!errors.address}
                        >
                          {t('streetAddress')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="address"
                            error={!!errors.address}
                            placeholder={t('streetAddress')}
                            {...field}
                          />
                          <FormHelperText error={!!errors.address}>
                            {errors.address && `${errors.address.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={control}
                    defaultValue=""
                    name="city"
                    render={({ field }) => (
                      <Box>
                        <InputLabelCustom htmlFor="city" error={!!errors.city}>
                          {t('city')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="city"
                            error={!!errors.city}
                            placeholder={t('city')}
                            {...field}
                          />
                          <FormHelperText error={!!errors.city}>
                            {errors.city && `${errors.city.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={control}
                    name="state"
                    render={({ field: { value } }) => (
                      <Box>
                        <InputLabelCustom
                          htmlFor="state"
                          error={!!errors.state}
                        >
                          {t('state')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <Autocomplete
                            getOptionLabel={(option) => option.name}
                            options={dataState}
                            value={value}
                            placeholder={t('state')}
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
                              } else {
                                setValue('state', {
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
                      </Box>
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={control}
                    defaultValue=""
                    name="postal_zipcode"
                    render={({ field }) => (
                      <Box>
                        <InputLabelCustom
                          htmlFor="postal_zipcode"
                          error={!!errors.postal_zipcode}
                        >
                          {t('postalCode')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="postal_zipcode"
                            placeholder={t('postalCode')}
                            error={!!errors.postal_zipcode}
                            {...field}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setValue('postal_zipcode', e.target.value)
                              trigger('postal_zipcode')
                            }}
                          />
                          <FormHelperText error={!!errors.postal_zipcode}>
                            {errors.postal_zipcode &&
                              `${errors.postal_zipcode.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            <Stack direction="column" spacing={2}>
              <ButtonCancel
                type="reset"
                onClick={handleCancel}
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
      </Stack>
    </Drawer>
  )
}

export default CreateExternalSupplierComponent
