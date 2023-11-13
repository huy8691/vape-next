//Api

import {
  Autocomplete,
  Box,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { ArrowRight } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
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
import {
  getDetailExternalSupplier,
  updateExternalSupplier,
} from './updateExternalSupplierAPI'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { formatPhoneNumber, handlerGetErrMessage } from 'src/utils/global.utils'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'

const UpdateExternalSupplierComponent: React.FC<{
  open: boolean
  onClose: (value: boolean) => void
  handleGetListExternalSupplier: (query: any) => void
  idExternalSupplier: number | undefined
}> = (props) => {
  const { t } = useTranslation('external-supplier')
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  const [valueInput, setValueInput] = useState<{
    name: string
    abbreviation: string
  }>({
    name: '',
    abbreviation: '',
  })

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

  useEffect(() => {
    if (props.open && props.idExternalSupplier) {
      getDetailExternalSupplier(props.idExternalSupplier).then((res) => {
        const { data } = res.data
        const filtered = dataState.find(
          (i: { abbreviation: string }) => i?.abbreviation === data?.state
        )
        setValue('name', data.name || '')
        setValue(
          'phone_number',
          formatPhoneNumber(data.phone_number as string) || ''
        )
        setValue('email', data.email || '')
        setValue('address', data.address || '')
        setValue('city', data.city || '')
        setValue('state', {
          name: filtered?.name ? filtered?.name : '',
          abbreviation: data.state || '',
        })
        setValueInput({
          name: filtered?.name ? filtered?.name : '',
          abbreviation: data.state || '',
        })
        setValue('postal_zipcode', data.postal_zipcode || '')
      })
    }
  }, [props.idExternalSupplier, props.open, setValue])

  const onSubmit = (values: any) => {
    dispatch(loadingActions.doLoading())
    try {
      updateExternalSupplier(
        {
          ...values,
          email: values.email || null,
          city: values.city || null,
          address: values.address || null,
          postal_zipcode: values.postal_zipcode || null,
          phone_number: (values.phone_number = values.phone_number.replace(
            /\D/g,
            ''
          )),
          state: values?.state?.abbreviation || null,
        },
        props.idExternalSupplier
      )
        .then(() => {
          props.handleGetListExternalSupplier(router.query)
          pushMessage(
            t('message.updateExternalSupplierSuccessfully'),
            'success'
          )
          props.onClose(false)
          reset()
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          dispatch(loadingActions.doLoadingFailure())
          setValue('phone_number', formatPhoneNumber(data.phone_number))
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
              {t('updateExternalSuppler')}
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
                          <PatternFormat
                            placeholder="(xxx) xxx xxxx "
                            id="phone_number"
                            customInput={TextFieldCustom}
                            {...field}
                            error={!!errors.phone_number}
                            format="(###) ### ####"
                          />
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
                    render={() => (
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
                            value={valueInput}
                            renderInput={(params) => (
                              <TextFieldCustom
                                error={!!errors.state?.name}
                                {...(params as any)}
                              />
                            )}
                            onChange={(_, newValue: any) => {
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

export default UpdateExternalSupplierComponent
