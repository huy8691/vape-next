import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,
  Radio,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  styled,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { ButtonCustom } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import * as Yup from 'yup'
import { getListEarningOfOrg, updateEarningConfig } from './pointEarningAPI'
import {
  PointEarningType,
  ValidateOnlineOrderType,
  ValidateRetailOrderType,
} from './pointEarningModel'
import classes from './styles.module.scss'
import { useTranslation } from 'next-i18next'

const DividerCustom = styled('div')(() => ({
  backgroundColor: '#E1E6EF',
  height: '15px',
  width: '2px',
  margin: '0 10px',
}))

const TableCellTws = styled(TableCell)(() => ({
  border: '1px solid rgb(224, 224, 224)',
}))

const PointEarningComponent = () => {
  const { t } = useTranslation('loyalty')
  const dispatch = useAppDispatch()
  const [pushMessgage] = useEnqueueSnackbar()
  const [statePointEarning, setStatePointEarning] = useState<
    PointEarningType[]
  >([])
  const [stateSwitchPointEarning, setStateSwitchPointEarning] = useState(false)

  const {
    setValue,
    getValues,
    trigger,
    formState: { errors },
    control,
    watch,
    clearErrors,
  } = useForm<ValidateOnlineOrderType>({
    resolver: yupResolver(
      Yup.object().shape({
        value_points: Yup.number()
          .when('earning_rule', {
            is: (value: string) => {
              return value === 'FIXAMOUNT'
            },
            then: Yup.number()
              .required(t('validate.valuePoint.required'))
              .moreThan(0, 'Fixed points must be greater than 0')
              .nullable(true)
              .transform((_, val) => {
                return val ? Number(val) : null
              }),
          })
          .nullable(true)
          .transform((_, val) => {
            return val ? Number(val) : null
          }),
        value_percent: Yup.number()
          .when('earning_rule', {
            is: (value: string) => {
              return value === 'PERCENTAGE'
            },
            then: Yup.number()
              .nullable()
              .required(t('validate.valuePoints.required'))
              .moreThan(0, '% of billing must be greater than 0')
              .transform((_, val) => {
                return val ? Number(val) : null
              }),
          })
          .nullable(true)
          .transform((_, val) => {
            return val ? Number(val) : null
          }),
        max_value_points: Yup.number()
          .when('earning_rule', {
            is: (value: string) => {
              return value === 'PERCENTAGE'
            },
            then: Yup.number()
              .required('Earning limit is required')
              .min(0, 'Earning limit must be greater than or equal to 0')
              .nullable(true)
              .transform((_, val) => {
                return val ? Number(val) : null
              }),
          })
          .nullable(true)
          .transform((_, val) => {
            return val ? Number(val) : null
          }),
      })
    ),
    mode: 'all',
  })

  const {
    setValue: setValueRetail,
    getValues: getValuesRetail,
    trigger: triggerRetail,
    formState: { errors: errorsRetail },
    control: controlRetail,
    watch: watchRetail,
    clearErrors: clearErrorsRetail,
  } = useForm<ValidateRetailOrderType>({
    resolver: yupResolver(
      Yup.object().shape({
        value_points_retail: Yup.number()
          .when('earning_rule_retail', {
            is: (value: string) => {
              return value === 'FIXAMOUNT'
            },
            then: Yup.number()
              .required(t('validate.valuePoint.required'))
              .moreThan(0, 'Fixed points must be greater than 0')
              .nullable(true)
              .transform((_, val) => {
                return val ? Number(val) : null
              }),
          })
          .nullable(true)
          .transform((_, val) => {
            return val ? Number(val) : null
          }),
        value_percent_retail: Yup.number()
          .when('earning_rule_retail', {
            is: (value: string) => {
              return value === 'PERCENTAGE'
            },
            then: Yup.number()
              .nullable()
              .required('% of billing is required')
              .moreThan(0, '% of billing must be greater than 0')
              .transform((_, val) => {
                return val ? Number(val) : null
              }),
          })
          .nullable(true)
          .transform((_, val) => {
            return val ? Number(val) : null
          }),
        max_value_points_retail: Yup.number()
          .when('earning_rule_retail', {
            is: (value: string) => {
              return value === 'PERCENTAGE'
            },
            then: Yup.number()
              .required(t('validate.maxValuePoints.positive'))
              .min(0, t('validate.maxValuePoints.min'))
              .nullable(true)
              .transform((_, val) => {
                return val ? Number(val) : null
              }),
          })
          .nullable(true)
          .transform((_, val) => {
            return val ? Number(val) : null
          }),
      })
    ),
    mode: 'all',
  })

  const handleChangeCheckedPaidRetailOrder = () => {
    setStateSwitchPointEarning((prev) => !prev)
  }

  const handleGetListEarningOfOrg = () => {
    dispatch(loadingActions.doLoading())

    getListEarningOfOrg()
      .then((res) => {
        const { data } = res.data

        setStatePointEarning(data)

        setValue('max_value_points', data[0].max_value_points)
        setValue('earning_rule', data[0].earning_rule)
        setValue(
          'value_points',
          data[0].earning_rule === 'FIXAMOUNT' ? data[0].value_points : null
        )
        setValue(
          'value_percent',
          data[0].earning_rule === 'PERCENTAGE' ? data[0].value_points : null
        )

        // ===================================================

        setValueRetail('earning_rule_retail', data[1].earning_rule)
        setValueRetail('max_value_points_retail', data[1].max_value_points)
        setValueRetail(
          'value_points_retail',
          data[1].earning_rule === 'FIXAMOUNT' ? data[1].value_points : null
        )
        setValueRetail(
          'value_percent_retail',
          data[1].earning_rule === 'PERCENTAGE' ? data[1].value_points : null
        )

        clearErrors()
        clearErrorsRetail()
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessgage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    handleGetListEarningOfOrg()
  }, [])

  const handleSubmitUpdateEarningConfig = () => {
    if (statePointEarning.length === 0) return
    if (
      errors.max_value_points ||
      errors.value_points ||
      errorsRetail.max_value_points_retail ||
      errorsRetail.value_percent_retail
    )
      return

    // Submit data for paid an online order
    updateEarningConfig(statePointEarning[0].id, {
      enable: stateSwitchPointEarning,
      earning_rule: getValues('earning_rule'),
      value_points:
        getValues('earning_rule') === 'FIXAMOUNT'
          ? (getValues('value_points') as number)
          : (getValues('value_percent') as number),
      max_value_points:
        getValues('earning_rule') === 'PERCENTAGE'
          ? (getValues('max_value_points') as number)
          : undefined,
    })
      .then(() => {
        handleGetListEarningOfOrg()
        pushMessgage(
          t('message.updatePointEarningPaidAnRetailOrderSuccessfully'),
          'success'
        )
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessgage(handlerGetErrMessage(status, data), 'error')
      })

    // Submit data for paid an retail order
    updateEarningConfig(statePointEarning[1].id, {
      enable: stateSwitchPointEarning,
      earning_rule: getValuesRetail('earning_rule_retail'),
      value_points:
        getValuesRetail('earning_rule_retail') === 'FIXAMOUNT'
          ? (getValuesRetail('value_points_retail') as number)
          : (getValuesRetail('value_percent_retail') as number),
      max_value_points:
        getValuesRetail('earning_rule_retail') === 'PERCENTAGE'
          ? (getValuesRetail('max_value_points_retail') as number)
          : undefined,
    })
      .then(() => {
        handleGetListEarningOfOrg()
        pushMessgage(
          t('message.updatePointEarningPaidAnRetailOrderSuccessfully'),
          'success'
        )
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessgage(handlerGetErrMessage(status, data), 'error')
      })
  }

  return (
    <Box>
      <Stack direction={'row'} alignItems={'center'} gap={'25px'} mb={1}>
        <Typography>Enable points earning</Typography>
        <Switch
          checked={stateSwitchPointEarning}
          onChange={handleChangeCheckedPaidRetailOrder}
        />
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCellTws rowSpan={2}>{t('action')}</TableCellTws>
              <TableCellTws align="center" colSpan={2}>
                Point to earn
              </TableCellTws>
            </TableRow>
            <TableRow>
              <TableCellTws align="center">{t('fixedPoints')}</TableCellTws>
              <TableCellTws align="center">{t('ofBilling')}</TableCellTws>
            </TableRow>
          </TableHead>
          <TableBody sx={{ border: '1px solid rgb(224, 224, 224)' }}>
            <TableRow>
              <TableCell component="th" scope="row" width="30%">
                <Typography>
                  {t('paidAnOnlineOrder')}
                  {/* <Switch
                    checked={stateEnablePaidOnlineOrder}
                    onChange={handleChangeCheckedPaidOnlineOrder}
                  /> */}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={2}>
                  <Radio
                    checked={
                      watch('earning_rule') === 'FIXAMOUNT' ? true : false
                    }
                    onChange={() => {
                      setValue('earning_rule', 'FIXAMOUNT')
                      clearErrors([`value_percent`, `max_value_points`])
                    }}
                  />
                  <Controller
                    control={control}
                    name="value_points"
                    render={() => (
                      <>
                        <FormControl fullWidth>
                          <div className={classes['input-number']}>
                            <NumericFormat
                              style={{ width: '100%' }}
                              disabled={watch('earning_rule') === 'PERCENTAGE'}
                              customInput={TextField}
                              allowNegative={false}
                              error={!!errors.value_points}
                              className={classes['input-number']}
                              onValueChange={(value) => {
                                setValue(
                                  'value_points',
                                  Number(value.floatValue),
                                  {
                                    shouldValidate: true,
                                  }
                                )
                                trigger(`value_points`)
                              }}
                              value={
                                getValues(`value_points`)
                                  ? Number(getValues(`value_points`))
                                  : 0
                              }
                            />
                          </div>
                          <FormHelperText error>
                            {errors.value_points &&
                              `${errors.value_points.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Stack>
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={2}>
                  <Radio
                    checked={
                      watch('earning_rule') === 'PERCENTAGE' ? true : false
                    }
                    onChange={() => {
                      setValue(`earning_rule`, 'PERCENTAGE')
                      clearErrors([`value_points`])
                    }}
                  />

                  <Controller
                    control={control}
                    name="value_percent"
                    render={({ field }) => (
                      <FormControl sx={{ maxWidth: '200px' }}>
                        <div className={classes['input-number']}>
                          <NumericFormat
                            {...field}
                            style={{ width: '100%' }}
                            placeholder=""
                            disabled={watch('earning_rule') === 'FIXAMOUNT'}
                            customInput={TextField}
                            allowNegative={false}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  %
                                </InputAdornment>
                              ),
                            }}
                            error={!!errors.value_percent}
                            onValueChange={(value) => {
                              setValue(
                                'value_percent',
                                Number(value.floatValue)
                              )
                              trigger('value_percent')
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
                        </div>
                        <FormHelperText error>
                          {errors.value_percent &&
                            `${errors.value_percent.message}`}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />

                  <Controller
                    control={control}
                    name="max_value_points"
                    render={() => (
                      <>
                        <FormControl fullWidth>
                          <div className={classes['input-number']}>
                            <NumericFormat
                              style={{ width: '100%' }}
                              placeholder=""
                              disabled={watch(`earning_rule`) === 'FIXAMOUNT'}
                              customInput={TextField}
                              allowNegative={false}
                              error={!!errors.max_value_points}
                              value={
                                getValues(`max_value_points`)
                                  ? Number(getValues(`max_value_points`))
                                  : 0
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    Earning Limit
                                    <DividerCustom />{' '}
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiInputBase-input': {
                                  textAlign: 'right',
                                },
                              }}
                              onValueChange={({ floatValue }) => {
                                setValue(
                                  `max_value_points`,
                                  Number(floatValue),
                                  {
                                    shouldValidate: true,
                                  }
                                )
                                trigger(`max_value_points`)
                              }}
                              className={classes['input-number']}
                            />
                          </div>
                          <FormHelperText error>
                            {errors.max_value_points &&
                              `${errors.max_value_points.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Stack>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row" width="30%">
                <Typography>
                  {t('paidAnRetailOrder')}
                  {/* <Switch
                    checked={stateEnablePaidRetailOrder}
                    onChange={handleChangeCheckedPaidRetailOrder}
                  /> */}
                </Typography>
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={2}>
                  <Radio
                    checked={
                      watchRetail('earning_rule_retail') === 'FIXAMOUNT'
                        ? true
                        : false
                    }
                    onChange={() => {
                      setValueRetail(`earning_rule_retail`, 'FIXAMOUNT')
                      clearErrorsRetail([
                        `value_percent_retail`,
                        `max_value_points_retail`,
                      ])
                    }}
                  />

                  <Controller
                    control={controlRetail}
                    name="value_points_retail"
                    render={() => (
                      <>
                        <FormControl fullWidth>
                          <div className={classes['input-number']}>
                            <NumericFormat
                              style={{ width: '100%' }}
                              disabled={
                                watchRetail('earning_rule_retail') ===
                                'PERCENTAGE'
                              }
                              customInput={TextField}
                              allowNegative={false}
                              error={!!errors.value_points}
                              className={classes['input-number']}
                              onValueChange={(value) => {
                                setValueRetail(
                                  'value_points_retail',
                                  Number(value.floatValue),
                                  {
                                    shouldValidate: true,
                                  }
                                )
                                triggerRetail(`value_points_retail`)
                              }}
                              value={
                                getValuesRetail(`value_points_retail`)
                                  ? Number(
                                      getValuesRetail(`value_points_retail`)
                                    )
                                  : 0
                              }
                            />
                          </div>
                          <FormHelperText error>
                            {errorsRetail.value_points_retail &&
                              `${errorsRetail.value_points_retail.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Stack>
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={2}>
                  {/* <Radio
                    checked={stateRadioForPaidRetailOrder === 2}
                    onChange={handleChangeRadioForPaidRetailOrder}
                    value={2}
                    name="radio-buttons"
                    inputProps={{ 'aria-label': 'A' }}
                  /> */}

                  <Radio
                    checked={
                      watchRetail('earning_rule_retail') === 'PERCENTAGE'
                        ? true
                        : false
                    }
                    onChange={() => {
                      setValueRetail(`earning_rule_retail`, 'PERCENTAGE')
                      clearErrorsRetail([`value_points_retail`])
                    }}
                  />

                  <Controller
                    control={controlRetail}
                    name="value_percent_retail"
                    render={({ field }) => (
                      <FormControl sx={{ maxWidth: '200px' }}>
                        <div className={classes['input-number']}>
                          <NumericFormat
                            {...field}
                            style={{ width: '100%' }}
                            placeholder=""
                            disabled={
                              watchRetail('earning_rule_retail') === 'FIXAMOUNT'
                            }
                            customInput={TextField}
                            allowNegative={false}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  %
                                </InputAdornment>
                              ),
                            }}
                            error={!!errors.value_percent}
                            onValueChange={(value) => {
                              setValueRetail(
                                'value_percent_retail',
                                Number(value.floatValue)
                              )
                              triggerRetail('value_percent_retail')
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
                        </div>
                        <FormHelperText error>
                          {errorsRetail.value_percent_retail &&
                            `${errorsRetail.value_percent_retail.message}`}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />

                  <Controller
                    control={controlRetail}
                    name="max_value_points_retail"
                    render={() => (
                      <>
                        <FormControl fullWidth>
                          <div className={classes['input-number']}>
                            <NumericFormat
                              style={{ width: '100%' }}
                              placeholder=""
                              disabled={
                                watchRetail(`earning_rule_retail`) ===
                                'FIXAMOUNT'
                              }
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    Earning Limit
                                    <DividerCustom />{' '}
                                  </InputAdornment>
                                ),
                              }}
                              sx={{
                                '& .MuiInputBase-input': {
                                  textAlign: 'right',
                                },
                              }}
                              customInput={TextField}
                              allowNegative={false}
                              error={!!errorsRetail.max_value_points_retail}
                              value={
                                getValuesRetail(`max_value_points_retail`)
                                  ? Number(
                                      getValuesRetail(`max_value_points_retail`)
                                    )
                                  : 0
                              }
                              onValueChange={({ floatValue }) => {
                                setValueRetail(
                                  `max_value_points_retail`,
                                  Number(floatValue),
                                  {
                                    shouldValidate: true,
                                  }
                                )
                                triggerRetail(`max_value_points_retail`)
                              }}
                              className={classes['input-number']}
                            />
                          </div>
                          <FormHelperText error>
                            {errorsRetail.max_value_points_retail &&
                              `${errorsRetail.max_value_points_retail.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Stack>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Stack spacing={2} direction="row" justifyContent={'flex-end'} mt={2}>
        <ButtonCustom
          onClick={() => handleSubmitUpdateEarningConfig()}
          size="large"
          variant="contained"
        >
          {t('save')}
        </ButtonCustom>
      </Stack>
    </Box>
  )
}

export default PointEarningComponent
