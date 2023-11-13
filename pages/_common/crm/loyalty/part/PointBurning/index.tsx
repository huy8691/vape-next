import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  CircularProgress,
  Dialog,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  Radio,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import { FloppyDisk, MinusCircle, Plus, X } from '@phosphor-icons/react'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import {
  ButtonCancel,
  ButtonCustom,
  CurrencyNumberFormat,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  TextFieldCustom,
  TypographyH2,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage } from 'src/utils/global.utils'
import * as Yup from 'yup'
import {
  createPointBurning,
  deletePointBurning,
  getListBurningOfOrg,
  updatePointBurning,
} from './pointBurningAPI'
import { BurningDetailResponseType } from './pointBurningModel'
// import CurrencyNumberFormat from './part/CurrencyNumberFormat'
import { useTheme } from '@mui/material/styles'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useTranslation } from 'next-i18next'
const TableCellTws = styled(TableCell)(() => ({
  border: '1px solid rgb(224, 224, 224)',
}))

const DividerCustom = styled('div')(() => ({
  height: '15px',
  backgroundColor: '#E1E6EF',
  width: '2px',
  margin: '0 10px',
}))

const PointBurningComponent = () => {
  const { t } = useTranslation('loyalty')
  const dispatch = useAppDispatch()
  const [stateOpenDialog, setStateOpenDialog] = useState(false)
  const theme = useTheme()
  const [stateIdPointBurning, setStateIdPointBurning] = useState<{
    index: number
    idPointBurning?: number
  }>()

  const [statePage, setStatePage] = useState(2)

  const [stateListBurning, setStateListBurning] =
    useState<BurningDetailResponseType>()

  const [pushMessage] = useEnqueueSnackbar()
  const handleGetBurningOfOrg = (page?: string | number) => {
    dispatch(loadingActions.doLoading())
    getListBurningOfOrg(page)
      .then((res) => {
        const { data } = res
        console.log('data', data)
        setStateListBurning(data)
        setValue(
          'items',
          data?.data?.map((item) => {
            return {
              idPointBurning: item.id,
              points: item.points,
              burning_rule: item.burning_rule,
              value_amount:
                item.burning_rule === 'FIXAMOUNT' ? item.value : null,
              value_percent:
                item.burning_rule === 'PERCENTAGE' ? item.value : null,
              max_value: item.max_value,
            }
          })
        )
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingSuccess())
      })
  }
  const handleDeletePointBurning = (id: number) => {
    deletePointBurning(id)
      .then(() => {
        console.log('stateIdPointBurning?.index', stateIdPointBurning?.index)
        remove(stateIdPointBurning?.index)
        // handleGetBurningOfOrg()
        setStateListBurning((oldValues: any) => {
          console.log('oldValues', oldValues)
          return {
            ...oldValues,
            data: oldValues?.data?.filter(
              (i: any) => i !== stateIdPointBurning?.index
            ),
          }
        })
        pushMessage(t('message.deletePointBurningSuccessfully'), 'success')
        setStateOpenDialog(false)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    handleGetBurningOfOrg(1)
  }, [])

  const onNext = () => {
    setStatePage((prev) => {
      console.log(statePage)
      dispatch(loadingActions.doLoading())
      getListBurningOfOrg(String(prev))
        .then((res) => {
          const { data } = res
          setStateListBurning((_prev: any) => ({
            ..._prev,
            ...data,
            data: [..._prev.data, ...data.data],
          }))
          const arr: any[] = data?.data?.map((item) => {
            return {
              idPointBurning: item.id,
              points: item.points,
              burning_rule: item.burning_rule,
              value_amount:
                item.burning_rule === 'FIXAMOUNT' ? item.value : null,
              value_percent:
                item.burning_rule === 'PERCENTAGE' ? item.value : null,
              max_value: item.max_value,
            }
          })
          setValue('items', [...getValues('items'), ...arr])
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          dispatch(loadingActions.doLoadingSuccess())
        })

      return prev + 1
    })
  }

  const {
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors },
    control,
    // reset,
    clearErrors,
    watch,
  } = useForm<{
    items: {
      idPointBurning?: number
      points: number | null
      burning_rule: 'FIXAMOUNT' | 'PERCENTAGE'
      value_amount: number | null
      value_percent: number | null
      max_value?: number
    }[]
  }>({
    resolver: yupResolver(
      Yup.object().shape({
        items: Yup.array().of(
          Yup.object().shape(
            {
              points: Yup.number()
                .nullable()
                .required(t('validate.points.required'))
                .min(1, t('validate.points.min'))
                .transform((_, val) => {
                  return !val
                    ? null
                    : Number(val?.toLocaleString().replace(/,/g, ''))
                }),

              value_amount: Yup.number()
                .when('burning_rule', {
                  is: (value: string) => {
                    return value === 'FIXAMOUNT'
                  },
                  then: Yup.number()
                    .required(t('validate.valueAmount.required'))
                    .moreThan(0, t('validate.valueAmount.moreThan'))
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
                .when('burning_rule', {
                  is: (value: string) => {
                    return value === 'PERCENTAGE'
                  },
                  then: Yup.number()
                    .nullable()
                    .required(t('validate.valuePercent.required'))
                    .moreThan(0, t('validate.valuePercent.moreThan'))
                    .transform((_, val) => {
                      return val ? Number(val) : null
                    }),
                })
                .nullable(true)
                .transform((_, val) => {
                  return val ? Number(val) : null
                }),
              max_value: Yup.number()
                .when('burning_rule', {
                  is: (value: string) => {
                    return value === 'PERCENTAGE'
                  },
                  then: Yup.number()
                    .required(t('validate.maxValue.required'))
                    .min(0, t('validate.maxValue.min'))
                    .nullable(true)
                    .transform((_, val) => {
                      return val ? Number(val) : null
                    }),
                })
                .nullable(true)
                .transform((_, val) => {
                  return val ? Number(val) : null
                }),
            }
            // [['points', 'points']]
          )
        ),
      })
    ),
    mode: 'all',
    defaultValues: {
      items: [],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const onSubmit = async (value: { items: any[] }) => {
    console.log(errors)
    const arrUpdate: {
      id: number
      loyalty_action: number
      points: number
      burning_rule: 'FIXAMOUNT' | 'PERCENTAGE'
      value: number
      max_value?: number
    }[] = []
    const arrCreate: {
      points: number
      loyalty_action: number
      burning_rule: 'FIXAMOUNT' | 'PERCENTAGE'
      value: number
      max_value?: number
    }[] = []

    console.log(value?.items)
    console.log(stateListBurning?.data)
    await value?.items?.forEach((item, index) => {
      if (item.idPointBurning) {
        const newItem = {
          id: item.idPointBurning,
          burning_rule: item.burning_rule,
          points: item.points,
          value:
            item.burning_rule === 'FIXAMOUNT'
              ? item.value_amount
              : item.value_percent,
          max_value: item.max_value,
        }

        console.log(!_.isEqual(newItem, stateListBurning?.data?.[index]))
        if (!_.isEqual(newItem, stateListBurning?.data?.[index])) {
          arrUpdate.push({
            id: item.idPointBurning,
            loyalty_action: 3,
            burning_rule: item.burning_rule,
            points: item.points,
            value:
              item.burning_rule === 'FIXAMOUNT'
                ? item.value_amount
                : item.value_percent,
            ...(item.burning_rule === 'PERCENTAGE' && {
              max_value: item.max_value,
            }),
          })
        }
      } else {
        arrCreate.push({
          loyalty_action: 3,
          burning_rule: item.burning_rule,
          points: item.points,
          value:
            item.burning_rule === 'FIXAMOUNT'
              ? item.value_amount
              : item.value_percent,
          ...(item.burning_rule === 'PERCENTAGE' && {
            max_value: item.max_value,
          }),
        })
      }
    })
    if (arrCreate.length > 0) {
      await createPointBurning(arrCreate)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('message.updateSuccessfully'), 'success')
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }

    if (arrUpdate.length > 0) {
      await updatePointBurning(arrUpdate)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('message.createSuccessfully'), 'success')
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }
  const onError = (err: any) => {
    console.log('errorChild', err)
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit, onError)}>
        <InfiniteScroll
          dataLength={Number(fields.length)} //This is important field to render the next data
          height={700}
          next={onNext}
          hasMore={Boolean(stateListBurning?.nextPage)}
          loader={
            <Box
              style={{
                textAlign: 'center',
              }}
            >
              <CircularProgress size="2rem" />
            </Box>
          }
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws rowSpan={2}>{t('pointsToBurn')}</TableCellTws>
                  <TableCellTws align="center" colSpan={2}>
                    {t('discountAmount')}
                  </TableCellTws>
                </TableRow>
                <TableRow>
                  <TableCellTws align="center">{t('fixedAmount')}</TableCellTws>
                  <TableCellTws align="center">{t('ofBilling')}</TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody sx={{ border: '1px solid rgb(224, 224, 224)' }}>
                {fields?.map((item, index) => {
                  return (
                    <TableRow key={item.id}>
                      <TableCell component="th" scope="row" width="30%">
                        <Stack direction="row" spacing={2}>
                          <IconButton
                            aria-label="delete"
                            onClick={() => {
                              setStateOpenDialog(true)
                              console.log('item', fields)
                              setStateIdPointBurning({
                                index: index,
                                ...(item?.idPointBurning && {
                                  idPointBurning: item?.idPointBurning,
                                }),
                              })
                            }}
                          >
                            <MinusCircle color={theme.palette.error.main} />
                          </IconButton>
                          <Controller
                            control={control}
                            name={`items.${index}.points`}
                            render={({ field }) => (
                              <>
                                <FormControl fullWidth>
                                  <NumericFormat
                                    {...field}
                                    customInput={TextFieldCustom}
                                    allowNegative={false}
                                    error={!!errors.items?.[index]?.points}
                                    decimalScale={0}
                                    thousandSeparator
                                  />
                                  <FormHelperText
                                    error={!!errors.items?.[index]?.points}
                                  >
                                    {errors.items?.[index]?.points &&
                                      `${errors.items?.[index]?.points?.message}`}
                                  </FormHelperText>
                                </FormControl>
                              </>
                            )}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row">
                          <Radio
                            checked={
                              watch(`items.${index}.burning_rule`) ===
                              'FIXAMOUNT'
                                ? true
                                : false
                            }
                            onChange={() => {
                              setValue(
                                `items.${index}.burning_rule`,
                                'FIXAMOUNT'
                              )
                              clearErrors([
                                `items.${index}.value_percent`,
                                `items.${index}.max_value`,
                              ])
                            }}
                          />
                          <Controller
                            control={control}
                            name={`items.${index}.value_amount`}
                            render={() => (
                              <>
                                <FormControl fullWidth>
                                  <div className="input-number">
                                    <CurrencyNumberFormat
                                      // {...field}
                                      error={
                                        !!errors.items?.[index]?.value_amount
                                      }
                                      disabled={
                                        watch(`items.${index}.burning_rule`) ===
                                        'PERCENTAGE'
                                      }
                                      defaultPrice={
                                        getValues(`items.${index}.value_amount`)
                                          ? Number(
                                              getValues(
                                                `items.${index}.value_amount`
                                              )
                                            ).toFixed(2)
                                          : 0
                                      }
                                      propValue={(value) => {
                                        setValue(
                                          `items.${index}.value_amount`,
                                          Number(value),
                                          {
                                            shouldValidate: true,
                                          }
                                        )
                                        trigger(`items.${index}.value_amount`)
                                      }}
                                    />
                                  </div>
                                  <FormHelperText
                                    error={
                                      !!errors.items?.[index]?.value_amount
                                    }
                                  >
                                    {errors.items?.[index]?.value_amount &&
                                      `${errors.items?.[index]?.value_amount?.message}`}
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
                              watch(`items.${index}.burning_rule`) ===
                              'PERCENTAGE'
                                ? true
                                : false
                            }
                            onChange={() => {
                              setValue(
                                `items.${index}.burning_rule`,
                                'PERCENTAGE'
                              )
                              clearErrors([`items.${index}.value_amount`])
                            }}
                          />
                          <Controller
                            control={control}
                            name={`items.${index}.value_percent`}
                            render={({ field }) => (
                              <>
                                <FormControl sx={{ maxWidth: '200px' }}>
                                  <NumericFormat
                                    {...field}
                                    customInput={TextFieldCustom}
                                    allowNegative={false}
                                    decimalScale={2}
                                    disabled={
                                      watch(`items.${index}.burning_rule`) ===
                                      'FIXAMOUNT'
                                    }
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment position="start">
                                          %
                                        </InputAdornment>
                                      ),
                                    }}
                                    isAllowed={(values) => {
                                      const { floatValue, formattedValue } =
                                        values
                                      if (floatValue === 0) {
                                        return floatValue >= 0
                                      }
                                      if (!floatValue) {
                                        return formattedValue === ''
                                      }
                                      return (
                                        floatValue <= 100 && floatValue >= 0
                                      )
                                    }}
                                    error={
                                      !!errors.items?.[index]?.value_percent
                                    }
                                  />
                                  <FormHelperText
                                    error={
                                      !!errors.items?.[index]?.value_percent
                                    }
                                  >
                                    {errors.items?.[index]?.value_percent &&
                                      `${errors.items?.[index]?.value_percent?.message}`}
                                  </FormHelperText>
                                </FormControl>
                              </>
                            )}
                          />
                          <Controller
                            control={control}
                            name={`items.${index}.max_value`}
                            render={() => (
                              <>
                                <FormControl fullWidth>
                                  <div className="input-number">
                                    <NumericFormat
                                      style={{
                                        width: '100%',
                                        textAlign: 'center',
                                      }}
                                      sx={{
                                        '& .MuiInputBase-input': {
                                          textAlign: 'right',
                                        },
                                      }}
                                      placeholder=""
                                      disabled={
                                        watch(`items.${index}.burning_rule`) ===
                                        'FIXAMOUNT'
                                      }
                                      customInput={TextField}
                                      allowNegative={false}
                                      error={!!errors.items?.[index]?.max_value}
                                      value={
                                        getValues(`items.${index}.max_value`)
                                          ? Number(
                                              getValues(
                                                `items.${index}.max_value`
                                              )
                                            )
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
                                      onValueChange={({ floatValue }) => {
                                        setValue(
                                          `items.${index}.max_value`,
                                          Number(floatValue),
                                          {
                                            shouldValidate: true,
                                          }
                                        )
                                        trigger(`items.${index}.max_value`)
                                      }}
                                      // className={classes['input-number']}
                                    />
                                    {/* <CurrencyNumberFormat
                                      error={!!errors.items?.[index]?.max_value}
                                      disabled={
                                        watch(`items.${index}.burning_rule`) ===
                                        'FIXAMOUNT'
                                      }
                                      defaultPrice={
                                        getValues(`items.${index}.max_value`)
                                          ? Number(
                                              getValues(
                                                `items.${index}.max_value`
                                              )
                                            ).toFixed(2)
                                          : 0
                                      }
                                      propValue={(value) => {
                                        setValue(
                                          `items.${index}.max_value`,
                                          Number(value),
                                          {
                                            shouldValidate: true,
                                          }
                                        )
                                        trigger(`items.${index}.max_value`)
                                      }}
                                    /> */}
                                  </div>
                                  <FormHelperText
                                    error={!!errors.items?.[index]?.max_value}
                                  >
                                    {errors.items?.[index]?.max_value &&
                                      `${errors.items?.[index]?.max_value?.message}`}
                                  </FormHelperText>
                                </FormControl>
                              </>
                            )}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>

              {/*  */}
            </Table>
          </TableContainer>
        </InfiniteScroll>
        <Stack direction="row" justifyContent="flex-end" spacing={2} mt={2}>
          <ButtonCustom
            type="submit"
            variant="outlined"
            size="large"
            onClick={() => {
              append({
                points: null,
                burning_rule: 'FIXAMOUNT',
                value_amount: null,
                value_percent: null,
              })
            }}
            startIcon={<Plus />}
          >
            {t('addRule')}
          </ButtonCustom>
          <ButtonCustom
            type="submit"
            variant="contained"
            size="large"
            startIcon={<FloppyDisk />}
          >
            {t('save')}
          </ButtonCustom>
        </Stack>
      </form>
      <Dialog open={stateOpenDialog} onClose={() => setStateOpenDialog(false)}>
        <DialogTitleTws>
          <IconButton onClick={() => setStateOpenDialog(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('deletePointBurning')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>{t('areYouSureToDelete')}</DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => setStateOpenDialog(false)}
              variant="outlined"
              size="large"
            >
              {t('no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={() => {
                if (stateIdPointBurning?.idPointBurning) {
                  handleDeletePointBurning(stateIdPointBurning?.idPointBurning)
                } else {
                  console.log(
                    'stateIdPointBurning?.index',
                    stateIdPointBurning?.index
                  )
                  remove(stateIdPointBurning?.index)
                  setStateOpenDialog(false)
                }
              }}
              size="large"
            >
              {t('yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
    </Box>
  )
}

export default PointBurningComponent
