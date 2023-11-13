import { yupResolver } from '@hookform/resolvers/yup'
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  Stack,
} from '@mui/material'
import dataState from './states.json'

import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  TextFieldCustom,
} from 'src/components'

import { schema } from './validations'

import Grid from '@mui/material/Unstable_Grid2'
import Link from 'next/link'
import { WarehouseDetailType, WarehouseSubmitType } from './warehouseModel'

import RequiredLabel from 'src/components/requiredLabel'
import { platform } from 'src/utils/global.utils'
import { useTranslation } from 'next-i18next'
interface Props {
  warehouseDetail?: any
  handleSubmit: (value: any) => void
  update?: boolean
}
const CreateUpdateWarehouse: React.FC<Props> = (props) => {
  const { t } = useTranslation('warehouse')
  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<WarehouseDetailType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })
  const [stateValueState, setStateValueState] = useState({
    name: '',
    abbreviation: '',
  })
  useEffect(() => {
    if (props.warehouseDetail) {
      const filtered = dataState.find(
        (i: { abbreviation: string }) =>
          i?.abbreviation === props?.warehouseDetail.state
      )
      setValue('state', {
        name: filtered?.name ? filtered?.name : '',
        abbreviation: props?.warehouseDetail.state,
      })
      setStateValueState({
        name: filtered?.name ? filtered?.name : '',
        abbreviation: props?.warehouseDetail.state,
      })
      setValue('name', props.warehouseDetail.name)
      setValue('address', props.warehouseDetail.address)
      setValue('description', props.warehouseDetail.description)
      setValue(
        'city',
        props.warehouseDetail.city ? props.warehouseDetail.city : ''
      )
      setValue(
        'postal_zipcode',
        props.warehouseDetail.postal_zipcode
          ? props.warehouseDetail.postal_zipcode
          : ''
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.warehouseDetail, setValue])

  const onSubmit = (data: WarehouseDetailType) => {
    const warehouseCreated: WarehouseSubmitType = {
      name: data.name,
      address: data.address ? data.address : null,
      description: data.description ? data.description : null,
      state: data.state.abbreviation,
      city: data.city,
      postal_zipcode: data.postal_zipcode,
    }

    props.handleSubmit(warehouseCreated)
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container columnSpacing={3} mb={2} rowSpacing={2}>
          <Grid xs={6}>
            {' '}
            <Box>
              <Controller
                control={control}
                name="name"
                defaultValue=""
                render={({ field }) => (
                  <>
                    <InputLabelCustom htmlFor="name" error={!!errors.name}>
                      <RequiredLabel />
                      {t('createUpdate.warehouseName')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="name"
                        error={!!errors.name}
                        {...field}
                        placeholder={t('createUpdate.enterWarehouseName')}
                      />
                      <FormHelperText error={!!errors.name}>
                        {errors.name && `${errors.name.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid xs={6}>
            {' '}
            <Box>
              <Controller
                control={control}
                name="address"
                defaultValue=""
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="address"
                      error={!!errors.address}
                    >
                      {t('createUpdate.address')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="address"
                        error={!!errors.address}
                        {...field}
                        placeholder={t('createUpdate.enterAddress')}
                      />
                      <FormHelperText error={!!errors.address}>
                        {errors.address && `${errors.address.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
          <Grid xs={6}>
            <Stack direction="row" spacing={2}>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={control}
                  name="city"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom htmlFor="city" error={!!errors.city}>
                        <RequiredLabel />
                        {t('createUpdate.city')}
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
                        {t('createUpdate.state')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <Autocomplete
                          getOptionLabel={(option) => option.name}
                          options={dataState}
                          value={stateValueState}
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
                              setStateValueState(newValue)
                            } else {
                              setValue('state', {
                                name: '',
                                abbreviation: '',
                              })
                              setStateValueState({
                                name: '',
                                abbreviation: '',
                              })
                            }
                            trigger('state')
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root .MuiAutocomplete-input': {
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
          </Grid>
          <Grid xs={6}>
            <Box sx={{ width: '100%' }}>
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
                      {t('createUpdate.postalZipCode')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="postal_zipcode"
                        error={!!errors.postal_zipcode}
                        {...field}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
          </Grid>
          <Grid xs={6}>
            {' '}
            <Box>
              <Controller
                control={control}
                name="description"
                defaultValue=""
                render={({ field }) => (
                  <>
                    <InputLabelCustom
                      htmlFor="description"
                      error={!!errors.description}
                    >
                      {t('createUpdate.description')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="description"
                        error={!!errors.description}
                        multiline
                        rows={5}
                        {...field}
                        placeholder={t('createUpdate.enterDescription')}
                      />
                      <FormHelperText error={!!errors.description}>
                        {errors.description && `${errors.description.message}`}
                      </FormHelperText>
                    </FormControl>
                  </>
                )}
              />
            </Box>
          </Grid>
        </Grid>
        <Stack direction="row" justifyContent="start" spacing={2}>
          <Link
            href={
              platform() === 'SUPPLIER'
                ? '/supplier/inventory/warehouse/list'
                : '/retailer/inventory/warehouse/list'
            }
          >
            <a>
              <ButtonCancel variant="outlined" size="large">
                {t('cancel')}
              </ButtonCancel>
            </a>
          </Link>
          <ButtonCustom type="submit" variant="contained" size="large">
            {t('submit')}
          </ButtonCustom>
        </Stack>
      </form>
    </>
  )
}

export default CreateUpdateWarehouse
