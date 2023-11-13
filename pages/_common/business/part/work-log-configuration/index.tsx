import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  TextField,
  styled,
} from '@mui/material'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { ButtonCustom, InputLabelCustom } from 'src/components'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  getOrganizationSettings,
  updateWorkLogConfig,
} from './workLogConfigAPI'
import classes from './styles.module.scss'
import { schema } from './validations'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useTranslation } from 'react-i18next'

const DividerCustom = styled('div')(() => ({
  backgroundColor: '#E1E6EF',
  height: '15px',
  width: '2px',
  margin: '0 10px',
}))

const WorkLogConfigurationComponent: React.FC = () => {
  const { t } = useTranslation('business')
  const dispatch = useAppDispatch()
  const [pushMessgage] = useEnqueueSnackbar()
  const {
    formState: { errors },
    control,
    handleSubmit,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema(t)),
    mode: 'all',
    defaultValues: {
      limit_hour: 8,
    },
  })

  const onSubmitUpdate = (values: any) => {
    dispatch(loadingActions.doLoading())
    updateWorkLogConfig(values.limit_hour)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessgage(
          t('message.updatedWorkLogConfigurationSuccessfully'),
          'success'
        )
      })
      .catch(() => {
        pushMessgage(t('message.updatedWorkLogConfigurationFailed'), 'error')
      })
      .finally(() => {
        dispatch(loadingActions.doLoadingSuccess())
      })
  }

  useEffect(() => {
    getOrganizationSettings().then((res) => {
      const { data } = res.data
      setValue('limit_hour', data.limit_hour)
    })
  }, [setValue])

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
            name="limit_hour"
            render={({ field }) => (
              <>
                <InputLabelCustom htmlFor="name" error={!!errors.limit_hour}>
                  <RequiredLabel />
                  {t('limitHour')}
                </InputLabelCustom>
                <FormControl>
                  <NumericFormat
                    value={field.value}
                    onValueChange={(value) => {
                      setValue('limit_hour', Number(value.floatValue), {
                        shouldValidate: true,
                      })
                      trigger(`limit_hour`)
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
                            hours
                          </span>
                        </InputAdornment>
                      ),
                    }}
                    style={{ marginBottom: '10px' }}
                    customInput={TextField}
                    allowNegative={false}
                    placeholder={``}
                    className={classes['input-number']}
                  />
                  <FormHelperText error={!!errors.limit_hour}>
                    {errors.limit_hour && `${errors.limit_hour.message}`}
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

export default WorkLogConfigurationComponent
