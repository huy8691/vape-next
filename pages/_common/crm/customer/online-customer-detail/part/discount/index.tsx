import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Dialog,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { ArrowRight, Gear, Plus, X } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  MenuAction,
  SelectCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TypographyH2,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, isEmpty } from 'src/utils/global.utils'
import {
  createDiscountForMerchant,
  deleteDiscount,
  getDetailDiscount,
  getListDCForApplytoDiscount,
  getListDiscountOfDC,
  updateDiscountForMerchant,
} from './discountAPI'
import {
  DiscountDetailType,
  DiscountOfDCResponseType,
  DistributionListType,
  SubmitAddRuleType,
} from './discountModel'
import CurrencyNumberFormat from './part/CurrencyNumberFormat'
import classes from './styles.module.scss'
import { schema, schemaUpdate } from './validations'
import { useTranslation } from 'next-i18next'

const DiscountComponent = () => {
  const { t } = useTranslation('customer')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }
  const [stateDiscountOfDC, setStateDiscountOfDC] =
    useState<DiscountOfDCResponseType>()
  const router = useRouter()
  const [stateDrawerAdd, setStateDrawerAdd] = useState(false)
  const [stateDrawerUpdate, setStateDrawerUpdate] = useState(false)
  const [pushMessage] = useEnqueueSnackbar()
  const [stateListDC, setStateListDC] = useState<DistributionListType[]>([])
  const [stateRadio, setStateRadio] = useState(1)
  const [stateIdDiscount, setStateDiscountId] = useState<number>()
  const dispatch = useAppDispatch()
  const [stateDetailDiscount, setStateDetailDiscount] =
    useState<DiscountDetailType>()
  const [stateDialogDelete, setStateDialogDelete] = useState(false)
  useEffect(() => {
    if (router.query.id) {
      getListDiscountOfDC(Number(router.query.id))
        .then((res) => {
          const { data } = res
          setStateDiscountOfDC(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      getListDCForApplytoDiscount(Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          console.log('list dc', data)
          setStateListDC(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }, [router.query.id])
  // useEffect(() => {
  //   getDelayPayment(Number(router.query.id))
  //     .then((res) => {
  //       const { data } = res.data
  //       setValueDelay('duration', data.duration)
  //     })
  //     .catch(({ response }) => {
  //       const { status, data } = response
  //       pushMessage(handlerGetErrMessage(status, data), 'error')
  //     })
  // }, [router.query.id])
  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<SubmitAddRuleType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
    defaultValues: {
      distribution_channels: [],
    },
  })

  const {
    handleSubmit: handleSubmitUpdate,
    control: controlSubmitUpdate,
    setValue: setValueUpdate,
    trigger: triggerUpdate,
    getValues: getValuesUpdate,
    formState: { errors: errorsUpdate },
  } = useForm<SubmitAddRuleType>({
    resolver: yupResolver(schemaUpdate(t)),
    mode: 'all',
  })
  // const {
  //   handleSubmit: handleSubmitDelay,
  //   setValue: setValueDelay,
  //   control: controlSubmitDelay,
  //   formState: { errors: errorsDelay },
  // } = useForm<SetDelayPaymentType>({
  //   resolver: yupResolver(schemaDelay),
  //   mode: 'all',
  // })

  const onSubmitAddNewRule = (value: SubmitAddRuleType) => {
    const allChannelArray: number[] = stateListDC.map((item) => item.id)
    console.log('valu', value)
    const submitValue: SubmitAddRuleType = {
      type: 'PERCENTAGE',
      discount_amount: value.discount_amount,
      max_discount_amount: value.max_discount_amount,
      distribution_channels:
        stateRadio === 1 ? allChannelArray : value.distribution_channels,
      organization: Number(router.query.id),
      is_apply_all_channel: stateRadio === 1 ? true : false,
    }
    if (isEmpty(submitValue.max_discount_amount)) {
      delete submitValue.max_discount_amount
    }
    createDiscountForMerchant(submitValue)
      .then(() => {
        pushMessage(t('message.createDiscountSuccessfully'), 'success')
        getListDiscountOfDC(Number(router.query.id))
          .then((res) => {
            const { data } = res
            setStateDiscountOfDC(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        getListDCForApplytoDiscount(Number(router.query.id))
          .then((res) => {
            const { data } = res.data
            console.log('list dc', data)
            setStateListDC(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })

        setStateDrawerAdd(false)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleChangeRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStateRadio(Number((event.target as HTMLInputElement).value))
  }
  const handleDelete = () => {
    if (!stateIdDiscount) return
    deleteDiscount(stateIdDiscount)
      .then(() => {
        pushMessage(t('message.deleteDiscountSuccessfully'), 'success')
        getListDiscountOfDC(Number(router.query.id))
          .then((res) => {
            const { data } = res
            setStateDiscountOfDC(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        getListDCForApplytoDiscount(Number(router.query.id))
          .then((res) => {
            const { data } = res.data
            console.log('list dc', data)
            setStateListDC(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        handleCloseMenu()
        setStateDialogDelete(false)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleOpenUpdate = () => {
    handleCloseMenu()
    dispatch(loadingActions.doLoading())
    getDetailDiscount(Number(stateIdDiscount), Number(router.query.id))
      .then((res) => {
        const { data } = res.data
        setStateDetailDiscount(data)
        const arrayValue: number[] = data.distribution_channels.map(
          (item) => item.id
        )
        setValueUpdate('discount_amount', data.discount_amount)
        if (data.max_discount_amount) {
          setValueUpdate('max_discount_amount', data.max_discount_amount)
        }
        setValueUpdate('distribution_channels', arrayValue)

        setStateRadio(data.is_apply_all_channel ? 1 : 2)
        setStateDrawerUpdate(true)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  // const onSubmitDelay = (value: SetDelayPaymentType) => {
  //   const submitValue: SetDelayPaymentType = {
  //     duration: value.duration,
  //     is_allowed: value.duration === 0 ? false : true,
  //   }
  //   setDelayPayment(Number(router.query.id), submitValue)
  //     .then(() => {
  //       getDelayPayment(Number(router.query.id))
  //         .then((res) => {
  //           const { data } = res.data
  //           setValueDelay('duration', data.duration)
  //           pushMessage('Set delay payment successfully', 'success')
  //         })
  //         .catch(({ response }) => {
  //           const { status, data } = response
  //           pushMessage(handlerGetErrMessage(status, data), 'error')
  //         })
  //     })
  //     .catch(({ response }) => {
  //       const { status, data } = response
  //       pushMessage(handlerGetErrMessage(status, data), 'error')
  //     })
  // }

  const onSubmitUpdateRule = (value: SubmitAddRuleType) => {
    console.log('value', value)
    if (!stateDetailDiscount) return
    if (stateRadio === 1 && !stateDetailDiscount?.is_apply_all_channel) {
      pushMessage(
        t('message.thisIsAlreadyRuleThatAppliesToAllChannels'),
        'error'
      )
      return
    }
    if (stateRadio === 2 && stateDetailDiscount?.is_apply_all_channel) {
      pushMessage(
        t('message.thisIsAlreadyRuleThatAppliesToAllChannels'),
        'error'
      )
      return
    }
    const arrayValue: number[] = stateDetailDiscount.distribution_channels.map(
      (item) => item.id
    )
    const submitValue: SubmitAddRuleType = {
      type: 'PERCENTAGE',
      discount_amount: value.discount_amount,
      max_discount_amount: value.max_discount_amount,
      distribution_channels: arrayValue,
      organization: Number(router.query.id),
      is_apply_all_channel: stateRadio === 1 ? true : false,
    }
    if (isEmpty(submitValue.max_discount_amount)) {
      delete submitValue.max_discount_amount
    }
    updateDiscountForMerchant(
      Number(stateDetailDiscount.id),
      Number(router.query.id),
      submitValue
    )
      .then(() => {
        pushMessage(t('message.createDiscountSuccessfully'), 'success')
        getListDiscountOfDC(Number(router.query.id))
          .then((res) => {
            const { data } = res
            setStateDiscountOfDC(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        getListDCForApplytoDiscount(Number(router.query.id))
          .then((res) => {
            const { data } = res.data
            console.log('list dc', data)
            setStateListDC(data)
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })

        setStateDrawerUpdate(false)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <>
      <Box>
        <Typography
          sx={{ fontSize: '1.6rem', fontWeight: 500, marginBottom: '10px' }}
        >
          {t('details.discountRules')}
        </Typography>
        {stateDiscountOfDC?.data && stateDiscountOfDC?.data?.length > 0 && (
          <TableContainerTws sx={{ marginBottom: '15px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws>{t('details.discountType')}</TableCellTws>
                  <TableCellTws width={100}>{t('details.amount')}</TableCellTws>
                  <TableCellTws>
                    {t('details.appliedDistributionChannel')}
                  </TableCellTws>
                  <TableCellTws>
                    {t('details.maximumDiscountAmount')}
                  </TableCellTws>
                  <TableCellTws width={80}>{t('details.action')}</TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateDiscountOfDC?.data.map((item, index) => {
                  return (
                    <TableRowTws key={index}>
                      <TableCellTws>{item.type}</TableCellTws>
                      <TableCellTws width={100}>
                        {item.discount_amount}%
                      </TableCellTws>
                      <TableCellTws>
                        {item.is_apply_all_channel ? (
                          t('details.allChannels')
                        ) : (
                          <>
                            {item.distribution_channels.map((obj, idx) => {
                              return (
                                <Typography key={idx}>{obj.name}</Typography>
                              )
                            })}
                          </>
                        )}
                      </TableCellTws>
                      <TableCellTws>{item.max_discount_amount}</TableCellTws>
                      <TableCellTws width={80}>
                        <IconButton
                          onClick={(e) => {
                            handleOpenMenu(e)
                            setStateDiscountId(item.id)
                          }}
                        >
                          <Gear size={28} />
                        </IconButton>
                      </TableCellTws>
                    </TableRowTws>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainerTws>
        )}

        <MenuAction
          elevation={0}
          anchorEl={anchorEl}
          open={open}
          onClose={handleCloseMenu}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem
            sx={{ justifyContent: 'end' }}
            onClick={() => handleOpenUpdate()}
          >
            {t('details.update')}
          </MenuItem>
          <MenuItem
            sx={{ justifyContent: 'end' }}
            onClick={() => setStateDialogDelete(true)}
          >
            {t('details.delete')}
          </MenuItem>
        </MenuAction>
        <ButtonCustom
          variant="contained"
          size="large"
          sx={{ marginBottom: '15px' }}
          onClick={() => {
            setStateDrawerAdd(true)
          }}
          startIcon={<Plus size={28} />}
        >
          {t('details.addNewRule')}
        </ButtonCustom>
      </Box>
      <Drawer
        anchor="right"
        open={stateDrawerAdd}
        onClose={() => setStateDrawerAdd(false)}
      >
        <Box
          sx={{
            background: 'white',
            width: `500px`,

            padding: '20px',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton>
              <ArrowRight size={24} />
            </IconButton>
            <Typography sx={{ fontSize: '2.4rem' }}>
              {' '}
              {t('details.ADDNEWRULE')}
            </Typography>
          </Stack>

          <Box>
            <form onSubmit={handleSubmit(onSubmitAddNewRule)}>
              <Stack spacing={2}>
                <Box>
                  <Controller
                    control={control}
                    name="discount_amount"
                    render={() => (
                      <>
                        <InputLabelCustom error={!!errors.discount_amount}>
                          {t('details.discountPercentage')}
                          <RequiredLabel />
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <NumericFormat
                            error={!!errors.discount_amount}
                            customInput={TextField}
                            allowNegative={false}
                            className={classes['input-number']}
                            onValueChange={(value) => {
                              setValue(
                                'discount_amount',
                                Number(value.floatValue)
                              )
                              trigger('discount_amount')
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
                          />
                          <FormHelperText error={!!errors.discount_amount}>
                            {errors.discount_amount &&
                              `${errors.discount_amount.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    control={control}
                    name="max_discount_amount"
                    render={() => (
                      <>
                        <InputLabelCustom error={!!errors.max_discount_amount}>
                          {t('details.maximumDiscountAmount')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <div className={classes['input-number']}>
                            <CurrencyNumberFormat
                              propValue={(value) => {
                                setValue('max_discount_amount', value)
                                trigger('max_discount_amount')
                              }}
                            />
                          </div>

                          <FormHelperText error={!!errors.max_discount_amount}>
                            {errors.max_discount_amount &&
                              `${errors.max_discount_amount.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
                <Box>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={stateRadio}
                      onChange={handleChangeRadio}
                    >
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label={t('details.allChannel')}
                      />
                      <FormControlLabel
                        value={2}
                        control={<Radio />}
                        label={t('details.specificChannels')}
                      />
                    </RadioGroup>
                  </FormControl>
                  <Controller
                    control={control}
                    name="distribution_channels"
                    defaultValue={[]}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <SelectCustom
                          {...field}
                          disabled={stateRadio === 1}
                          value={getValues('distribution_channels')}
                          multiple
                          onChange={(event: any) => {
                            const {
                              target: { value },
                            } = event
                            setValue(
                              'distribution_channels',
                              typeof value === 'string'
                                ? value.split(',')
                                : value
                            )
                          }}
                          sx={{ width: '100%' }}
                        >
                          {stateListDC.map((item, index) => {
                            return (
                              <MenuItem value={item.id} key={index}>
                                {item.name}
                              </MenuItem>
                            )
                          })}
                        </SelectCustom>
                      </FormControl>
                    )}
                  />
                </Box>
                <Stack direction="row" spacing={2}>
                  <ButtonCustom
                    variant="outlined"
                    size="large"
                    onClick={() => setStateDrawerAdd(false)}
                  >
                    {t('details.cancel')}
                  </ButtonCustom>
                  <ButtonCustom variant="contained" type="submit" size="large">
                    {t('details.save')}
                  </ButtonCustom>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Box>
      </Drawer>
      {/* update */}
      <Drawer
        anchor="right"
        open={stateDrawerUpdate}
        onClose={() => setStateDrawerUpdate(false)}
      >
        <Box
          sx={{
            background: 'white',
            width: `500px`,

            padding: '20px',
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton>
              <ArrowRight size={24} />
            </IconButton>
            <Typography sx={{ fontSize: '2.4rem' }}>
              {' '}
              {t('details.updateRule')}
            </Typography>
          </Stack>

          <Box>
            <form onSubmit={handleSubmitUpdate(onSubmitUpdateRule)}>
              <Stack spacing={2}>
                <Box>
                  <Controller
                    control={controlSubmitUpdate}
                    name="discount_amount"
                    render={() => (
                      <>
                        <InputLabelCustom
                          error={!!errorsUpdate.discount_amount}
                        >
                          {t('details.discountPercentage')}
                          <RequiredLabel />
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <NumericFormat
                            value={getValuesUpdate('discount_amount')}
                            error={!!errorsUpdate.discount_amount}
                            customInput={TextField}
                            allowNegative={false}
                            className={classes['input-number']}
                            onValueChange={(value) => {
                              setValueUpdate(
                                'discount_amount',
                                Number(value.floatValue)
                              )
                              triggerUpdate('discount_amount')
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
                          />
                          <FormHelperText
                            error={!!errorsUpdate.discount_amount}
                          >
                            {errorsUpdate.discount_amount &&
                              `${errorsUpdate.discount_amount.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    control={control}
                    name="max_discount_amount"
                    render={() => (
                      <>
                        <InputLabelCustom
                          error={!!errorsUpdate.max_discount_amount}
                        >
                          {t('details.maximumDiscountAmount')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <div className={classes['input-number']}>
                            <CurrencyNumberFormat
                              defaultPrice={getValuesUpdate(
                                'max_discount_amount'
                              )}
                              propValue={(value) => {
                                setValueUpdate('max_discount_amount', value)
                                triggerUpdate('max_discount_amount')
                              }}
                            />
                          </div>

                          <FormHelperText
                            error={!!errorsUpdate.max_discount_amount}
                          >
                            {errorsUpdate.max_discount_amount &&
                              `${errorsUpdate.max_discount_amount.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
                <Box>
                  <FormControl>
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={stateRadio}
                      onChange={handleChangeRadio}
                    >
                      <FormControlLabel
                        value={1}
                        control={<Radio />}
                        label={t('details.allChannel')}
                      />
                      <FormControlLabel
                        value={2}
                        control={<Radio />}
                        label={t('details.specificChannels')}
                      />
                    </RadioGroup>
                  </FormControl>
                  <Controller
                    control={controlSubmitUpdate}
                    name="distribution_channels"
                    defaultValue={[]}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <SelectCustom
                          {...field}
                          disabled={stateRadio === 1}
                          value={getValuesUpdate('distribution_channels')}
                          multiple
                          onChange={(event: any) => {
                            const {
                              target: { value },
                            } = event
                            setValueUpdate(
                              'distribution_channels',
                              typeof value === 'string'
                                ? value.split(',')
                                : value
                            )
                          }}
                          sx={{ width: '100%' }}
                        >
                          {stateDetailDiscount?.distribution_channels.map(
                            (item, index) => {
                              return (
                                <MenuItem value={item.id} key={index}>
                                  {item.name}
                                </MenuItem>
                              )
                            }
                          )}
                        </SelectCustom>
                      </FormControl>
                    )}
                  />
                </Box>
                <Stack direction="row" spacing={2}>
                  <ButtonCustom
                    variant="outlined"
                    size="large"
                    onClick={() => setStateDrawerAdd(false)}
                  >
                    {t('details.cancel')}
                  </ButtonCustom>
                  <ButtonCustom variant="contained" type="submit" size="large">
                    {t('details.save')}
                  </ButtonCustom>
                </Stack>
              </Stack>
            </form>
          </Box>
        </Box>
      </Drawer>

      <Dialog
        open={stateDialogDelete}
        onClose={() => setStateDialogDelete(false)}
      >
        <DialogTitleTws>
          <IconButton onClick={() => setStateDialogDelete(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('details.deleteDiscount')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {' '}
            {t('details.areYouSureToDelete')}
          </DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => setStateDialogDelete(false)}
              variant="outlined"
              size="large"
            >
              {t('details.no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleDelete}
              size="large"
            >
              {t('details.yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
    </>
  )
}

export default DiscountComponent
