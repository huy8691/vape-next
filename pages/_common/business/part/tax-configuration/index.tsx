import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'

import { yupResolver } from '@hookform/resolvers/yup'
import { styled } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { ButtonCustom } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import {
  getBusinessProfile,
  getTaxRateBasedOnZipcode,
  updateTaxRate,
} from './apiTaxConfiguration'
import classes from './styles.module.scss'
import {
  TaxRateBasedOnZipcodeType,
  TaxRateSubmitType,
  TaxRateValidateType,
} from './taxModel'
import { schema } from './validation'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useTranslation } from 'next-i18next'

const DividerCustom = styled('div')(() => ({
  backgroundColor: '#49516F',
  height: '15px',
  width: '1px',
  marginRight: '10px',
}))
const TaxConfigurationComponent = () => {
  const { t } = useTranslation('business')
  const [stateRadioValue, setStateRadioValue] = useState('1')
  const [pushMessage] = useEnqueueSnackbar()
  const [stateTaxRate, setStateTaxRate] = useState<TaxRateBasedOnZipcodeType>()
  const [stateCustomTaxRate, setStateCustomTaxRate] = useState<number>()
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateRadioValue((event.target as HTMLInputElement).value)
  }

  const dispatch = useAppDispatch()
  const {
    setValue,
    trigger,
    formState: { errors },
    control,

    handleSubmit,
  } = useForm<TaxRateValidateType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })
  const onSubmitTaxConfiguration = (value: TaxRateValidateType) => {
    if (!stateTaxRate) return
    if (stateRadioValue === '1') {
      const submitData: TaxRateSubmitType = {
        custom_tax_rate: stateTaxRate.estimatedCombinedRate,
        is_customized: false,
      }
      updateTaxRate(submitData)
        .then(() => {
          pushMessage(t('message.configTaxSuccessfully'), 'success')
          handleGetTaxConfiguration()
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          const { status, data } = response
          dispatch(loadingActions.doLoadingFailure())

          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    if (stateRadioValue === '2') {
      const submitData: TaxRateSubmitType = {
        custom_tax_rate: Number(value.custom_tax_rate) / 100,
        is_customized: true,
      }
      updateTaxRate(submitData)
        .then(() => {
          pushMessage(t('message.configTaxSuccessfully'), 'success')
          handleGetTaxConfiguration()
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          const { status, data } = response
          dispatch(loadingActions.doLoadingFailure())

          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  const handleGetTaxConfiguration = () => {
    getBusinessProfile()
      .then((res) => {
        const { data } = res.data
        if (data.is_customized) {
          setValue('custom_tax_rate', Number(data.custom_tax_rate) * 100)
          setStateRadioValue('2')
          console.log('custom tax rate', data.custom_tax_rate)
          setStateCustomTaxRate(Number(data.custom_tax_rate) * 100)
        } else {
          setStateRadioValue('1')
        }
        if (!data.postal_zipcode) return
        getTaxRateBasedOnZipcode(data?.postal_zipcode)
          .then((res) => {
            const value = res.data.data
            if (!data.is_customized) {
              setValue(
                'custom_tax_rate',
                Number(value.estimatedCombinedRate) * 100
              )
            }
            setStateTaxRate(value)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    handleGetTaxConfiguration()
  }, [])
  return (
    <Box
      sx={{
        width: '100%',
        border: '1px solid #E1E6EF',
        padding: '25px',
        borderRadius: '10px',
      }}
    >
      <Typography>{t('taxConfiguration')}</Typography>
      <form onSubmit={handleSubmit(onSubmitTaxConfiguration)}>
        <Box sx={{ marginBottom: '15px' }}>
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={stateRadioValue}
              onChange={handleChange}
            >
              <FormControlLabel
                value="1"
                control={<Radio />}
                label={`${t('baseOnZipcode')} ${
                  stateTaxRate?.zipcode ? `(${stateTaxRate.zipcode})` : ''
                } `}
              />
              <NumericFormat
                value={Number(
                  (Number(stateTaxRate?.estimatedCombinedRate) * 100).toFixed(2)
                )}
                style={{ marginBottom: '10px' }}
                customInput={TextField}
                allowNegative={false}
                disabled
                defaultValue={`${
                  Number(stateTaxRate?.estimatedCombinedRate) * 100
                }`}
                placeholder={``}
                className={classes['input-number']}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <DividerCustom />{' '}
                      <span
                        style={{
                          fontSize: '1.6rem',
                          fontWeight: 500,
                          color: '#49516F',
                        }}
                      >
                        %
                      </span>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                value="2"
                control={<Radio />}
                label={t('manually')}
              />
              <Controller
                control={control}
                name="custom_tax_rate"
                render={() => (
                  <Box>
                    <NumericFormat
                      value={stateCustomTaxRate ? stateCustomTaxRate : ''}
                      customInput={TextField}
                      allowNegative={false}
                      className={classes['input-number']}
                      onValueChange={(value) => {
                        setValue('custom_tax_rate', Number(value.floatValue))
                        trigger('custom_tax_rate')
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
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <DividerCustom />{' '}
                            <span
                              style={{
                                fontSize: '1.6rem',
                                fontWeight: 500,
                                color: '#49516F',
                              }}
                            >
                              %
                            </span>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <FormHelperText error>
                      {errors.custom_tax_rate &&
                        `${errors.custom_tax_rate.message}`}
                    </FormHelperText>
                  </Box>
                )}
              />
            </RadioGroup>
          </FormControl>
        </Box>
        <ButtonCustom type="submit" variant="contained" size="large">
          {t('save')}
        </ButtonCustom>
      </form>
    </Box>
  )
}

export default TaxConfigurationComponent
