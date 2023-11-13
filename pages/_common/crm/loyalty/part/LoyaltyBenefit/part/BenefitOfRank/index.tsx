import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import * as Yup from 'yup'

import { PlusCircle, Trash } from '@phosphor-icons/react'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { TieredBenefitType } from '../../loyaltyBenefitModel'
import {
  SubmitUpdateTieredType,
  ValidateBenefitNameType,
  ValidateUpdateTieredType,
} from './benefitOfRankModel'
import classes from './styles.module.scss'
import { schema } from './validations'
import { ButtonCustom, TextFieldCustom } from 'src/components'
import { updateTieredBenefit } from './benefitOfRankAPI'
import { useAppDispatch } from 'src/store/hooks'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { useTranslation } from 'react-i18next'

interface PropsType {
  benefitData: TieredBenefitType
  handleGetListBenefitOfRank: () => void
}
const BenefitOfRankComponent = (props: PropsType) => {
  const { t } = useTranslation('loyalty')
  const [stateEnableDiscount, setStateEnableDiscount] = useState(false)
  const [stateEnablePointEarning, setStateEnablePointEarning] = useState(false)
  const [stateEnableFreeShip, setStateEnableFreeShip] = useState(false)
  const dispatch = useAppDispatch()
  const [pushMessgage] = useEnqueueSnackbar()

  const handleChangeEnableDiscount = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateEnableDiscount(event.target.checked)
  }
  const handleChangeEnablePointEarning = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateEnablePointEarning(event.target.checked)
  }
  const handleChangeEnableShipping = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateEnableFreeShip(event.target.checked)
  }

  const {
    setValue,
    handleSubmit,
    getValues,
    trigger,
    control,
    formState: { errors },
  } = useForm<ValidateUpdateTieredType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const {
    getValues: getValuesBenefit,
    control: controlBenefit,
    setValue: setValueBenefit,
    formState: { errors: errorsBenefit },
  } = useForm<{
    items: ValidateBenefitNameType[]
  }>({
    resolver: yupResolver(
      Yup.object().shape({
        items: Yup.array().of(
          Yup.object().shape({
            benefit_name: Yup.string()
              .required('Point to burn is required')
              .nullable()
              .min(5, 'Benefit name must be between 5 and 5000 characters')
              .max(5000, 'Benefit name must be between 5 and 5000 characters'),
          })
        ),
      })
    ),
    mode: 'all',
    defaultValues: {
      items: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: controlBenefit,
    name: 'items',
  })

  console.log('fields', fields)

  useEffect(() => {
    setValueBenefit(
      'items',
      props.benefitData.custom_benefit.map((item) => {
        return {
          benefit_name: item,
        }
      })
    )
  }, [props.benefitData.custom_benefit, setValueBenefit])

  useLayoutEffect(() => {
    setStateEnableDiscount(props.benefitData.enable_discount)
    setStateEnablePointEarning(props.benefitData.enable_points_earning_bonus)
    setStateEnableFreeShip(props.benefitData.enable_freeship)
    setValue('discount_value', props.benefitData.discount_value)
    setValue('points_earning_value', props.benefitData.points_earning_value)
  }, [props.benefitData, setValue])

  const onSubmitValue = (value: ValidateUpdateTieredType) => {
    const submitValue: SubmitUpdateTieredType = {
      enable_discount: stateEnableDiscount,
      discount_value: value.discount_value,
      enable_points_earning_bonus: stateEnablePointEarning,
      points_earning_value: value.points_earning_value,
      enable_freeship: stateEnableFreeShip,
      custom_benefit: getValuesBenefit('items')
        .filter((item) => item.benefit_name !== '')
        .map((_item) => _item.benefit_name),
    }

    updateTieredBenefit(props.benefitData.id, submitValue)
      .then(() => {
        pushMessgage(t('message.updateTieredBenefit'), 'success')
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessgage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <Box sx={{ padding: '15px' }}>
      <form onSubmit={handleSubmit(onSubmitValue)}>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '1.6rem',
            marginBottom: '15px',
            color: '#0A0D14',
          }}
        >
          {t('generalBenefit')}
        </Typography>
        <Stack spacing={2} sx={{ marginBottom: '15px', width: '520px' }}>
          <Stack direction="row" justifyContent={'space-between'}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={stateEnableDiscount}
                  onChange={handleChangeEnableDiscount}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Discount"
            />
            <Box>
              <Controller
                control={control}
                name="discount_value"
                render={() => (
                  <>
                    <NumericFormat
                      style={{ width: '100%' }}
                      placeholder={t('enterDiscountRate')}
                      customInput={TextField}
                      allowNegative={false}
                      value={getValues('discount_value')}
                      error={!!errors.discount_value}
                      onValueChange={(value) => {
                        setValue('discount_value', Number(value.floatValue))
                        trigger('discount_value')
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">%</InputAdornment>
                        ),
                      }}
                      isAllowed={(values) => {
                        const { floatValue, formattedValue } = values
                        if (floatValue === 0) {
                          return floatValue >= 0
                        }
                        if (!floatValue) {
                          return formattedValue === ''
                        }
                        return floatValue <= 100 && floatValue >= 0
                      }}
                      className={classes['input-number']}
                    />
                    <FormHelperText error>
                      {errors.discount_value &&
                        `${errors.discount_value.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
            {/* <Checkbox
              checked={stateEnableDiscount}
              onChange={handleChangeEnableDiscount}
              inputProps={{ 'aria-label': 'controlled' }}
            /> */}
          </Stack>
          <Stack direction="row" justifyContent={'space-between'}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={stateEnablePointEarning}
                  onChange={handleChangeEnablePointEarning}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label="Point earning bonus"
            />

            <Box>
              <Controller
                control={control}
                name="points_earning_value"
                render={() => (
                  <>
                    <NumericFormat
                      style={{ width: '100%' }}
                      placeholder={t('enterPointEarningBonus')}
                      customInput={TextField}
                      allowNegative={false}
                      value={getValues('points_earning_value')}
                      error={!!errors.points_earning_value}
                      onValueChange={(value) => {
                        setValue(
                          'points_earning_value',
                          Number(value.floatValue)
                        )
                        trigger('points_earning_value')
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="start">%</InputAdornment>
                        ),
                      }}
                      isAllowed={(values) => {
                        const { floatValue, formattedValue } = values
                        if (floatValue === 0) {
                          return floatValue >= 0
                        }
                        if (!floatValue) {
                          return formattedValue === ''
                        }
                        return floatValue <= 100 && floatValue >= 0
                      }}
                      className={classes['input-number']}
                    />
                    <FormHelperText error>
                      {errors.points_earning_value &&
                        `${errors.points_earning_value.message}`}
                    </FormHelperText>
                  </>
                )}
              />
            </Box>
            {/* <Checkbox
              checked={stateEnablePointEarning}
              onChange={handleChangeEnablePointEarning}
              inputProps={{ 'aria-label': 'controlled' }}
            /> */}
          </Stack>
          <Stack direction="row" alignItems="center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={stateEnableFreeShip}
                  onChange={handleChangeEnableShipping}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              }
              label={t('freeShipping')}
            />
            {/* <Checkbox
              checked={stateEnableFreeShip}
              onChange={handleChangeEnableShipping}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <Typography>Free Shipping</Typography> */}
          </Stack>
        </Stack>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '1.6rem',
            marginBottom: '15px',
            color: '#0A0D14',
          }}
        >
          {t('customBenefit')}
        </Typography>
        <Stack
          direction="column"
          gap={'10px'}
          sx={{
            marginBottom: '15px',
            borderRadius: '10px',
            border: '1px solid #E1E6EF',
            maxWidth: '500px',
            padding: '15px',
          }}
        >
          {fields.length === 0 ? (
            <></>
          ) : (
            <>
              {fields.map((_item, index) => {
                return (
                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    key={index}
                    gap={'5px'}
                    justifyContent={'space-between'}
                  >
                    <Controller
                      name={`items.${index}.benefit_name`}
                      control={controlBenefit}
                      render={({ field }) => (
                        <Stack
                          direction="column"
                          sx={{
                            width: '100%',
                          }}
                        >
                          <TextFieldCustom
                            fullWidth
                            sx={{ background: 'white' }}
                            error={!!errorsBenefit.items?.[index]?.benefit_name}
                            {...field}
                          />

                          <FormHelperText
                            error={!!errorsBenefit.items?.[index]?.benefit_name}
                          >
                            {errorsBenefit.items?.[index]?.benefit_name &&
                              `${errorsBenefit.items?.[index]?.benefit_name?.message}`}
                          </FormHelperText>
                        </Stack>
                      )}
                    />
                    <IconButton
                      sx={{
                        borderRadius: '10px',
                        border: '1px solid #E02D3C',
                        padding: '10px',
                      }}
                      onClick={() => remove(index)}
                    >
                      <Trash size={20} color="#E02D3C" />
                    </IconButton>
                  </Stack>
                )
              })}
            </>
          )}

          <Stack
            direction={'row'}
            alignItems={'center'}
            sx={{
              borderRadius: '10px',
              border: '1px solid #E1E6EF',
              maxWidth: '500px',
              color: '#49516F',
              fontWeight: 400,
            }}
            // onClick={() => handleAddCustomBenefit()}
            onClick={() => {
              append({
                benefit_name: '',
              })
            }}
          >
            <IconButton>
              <PlusCircle size={20} />
            </IconButton>
            Add Benefits
          </Stack>
        </Stack>

        {/* <Box sx={{ marginBottom: '15px' }}>
        </Box>
        <Typography
          sx={{ fontWeight: 700, fontSize: '1.6rem', marginBottom: '15px' }}
        >
          {t('benefit')}
        </Typography>
        <Box sx={{ marginBottom: '15px' }}>
          <Controller
            name="benefit_name"
            control={controlBenefit}
            render={({ field }) => (
              <>
                <TextFieldCustom
                  sx={{ background: 'white' }}
                  error={!!errorsBenefit.benefit_name}
                  {...field}
                />
                <FormHelperText error={!!errorsBenefit.benefit_name}>
                  {errorsBenefit.benefit_name &&
                    `${errorsBenefit.benefit_name.message}`}
                </FormHelperText>
              </>
            )}
          />
        </Box> */}
        {/* <ButtonCustom
          sx={{ marginBottom: '15px' }}
          onClick={() => handleAddCustomBenefit()}
          variant="contained"
          size="large"
        >
          Add
        </ButtonCustom> */}

        <Stack>
          <ButtonCustom type="submit" variant="contained" size="large">
            {t('save')}
          </ButtonCustom>
        </Stack>
      </form>
    </Box>
  )
}

export default BenefitOfRankComponent
