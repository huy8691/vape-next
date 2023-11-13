import {
  Box,
  Checkbox,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  Pagination,
  Stack,
  Switch,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import {
  ButtonCustom,
  InputLabelCustom,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldSearchCustom,
  TypographyH2,
} from 'src/components'
import { styled } from '@mui/system'
import { ArrowRight, MagnifyingGlass, Trash } from '@phosphor-icons/react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, schemaThreshold } from './validations'
import {
  ActionShippingFeeType,
  CustomerDetailType,
  ListCustomerResponseType,
  ListShippingFeeType,
  ListValueFromAPIType,
  RetailerDataResponseType,
  RetailerDataType,
} from './shippingPriceModel'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  getCustomerList,
  getListShippingFee,
  getRetailerList,
  updateActionFee,
} from './shippingPriceAPI'
import {
  formatPhoneNumber,
  handlerGetErrMessage,
  platform,
} from 'src/utils/global.utils'
import CurrencyNumberFormat from './part/CurrencyNumberFormat'
import classes from './styles.module.scss'
import { useDebouncedCallback } from 'use-debounce'
import { useTranslation } from 'next-i18next'

const CustomBoxDrawer = styled(Box)(() => ({
  width: '1000px',
  background: '#FFF',
  borderRadius: '10px',
  padding: '30px',
}))
const ShippingPriceComponent = () => {
  const { t } = useTranslation('shipping')
  const [pushMessage] = useEnqueueSnackbar()

  const [stateDrawerRetailer, setStateDrawerRetailer] = useState(false)
  const [stateDrawerCustomer, setStateDrawerCustomer] = useState(false)
  const [stateRouterQueryForRetailer, setStateRouterQueryForRetailer] =
    useState<{ page: number; limit: number; search: string }>({
      page: 1,
      limit: 10,
      search: '',
    })
  const [stateRouterQueryForCustomer, setStateRouterQueryForCustomer] =
    useState<{ page: number; limit: number; search: string }>({
      page: 1,
      limit: 10,
      search: '',
    })
  const [stateRetailerList, setStateRetailerList] =
    useState<RetailerDataResponseType>()
  const [stateCustomerList, setStateCustomerList] =
    useState<ListCustomerResponseType>()
  const [stateListConfigShippingFee, setStateListConfigShippingFee] = useState<
    ListShippingFeeType[]
  >([])
  const [stateTempSelected, setStateTempSelected] = useState<
    ListValueFromAPIType[]
  >([])

  const [stateCurrentStatus, setStateCurrentStatus] = useState<{
    type: string
    index: number
  }>({ type: '', index: 0 })
  const [stateCurrentIndexForAllRetailer, setStateCurrentIndexForAllRetailer] =
    useState(-1)
  const [stateCurrentIndexForAllCustomer, setStateCurrentIndexForAllCustomer] =
    useState(-1)
  const [
    stateCurrentIndexForSpecificRetailer,
    setStateCurrentIndexForSpecificRetailer,
  ] = useState(-1)
  const [
    stateCurrentIndexForSpecificCustomer,
    setStateCurrentIndexForSpecificCustomer,
  ] = useState(-1)
  const [
    stateCurrentIndexForBillingRetailer,
    setStateCurrentIndexForBillingRetailer,
  ] = useState(-1)
  const [
    stateCurrentIndexForBillingCustomer,
    setStateCurrentIndexForBillingCustomer,
  ] = useState(-1)

  const {
    handleSubmit: handleSubmitSearchRetailer,
    control: controlSearchRetailer,
  } = useForm<{ search: string }>({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const {
    control: controlSubmitThresholdRetailer,
    setValue: setValueThresholdRetailer,
    getValues: getValueThresholdRetailer,
    trigger: triggerThresholdRetailer,
    formState: { errors: errossThresholdRetailer },
  } = useForm<{ amount: string | number | null }>({
    resolver: yupResolver(schemaThreshold),
    mode: 'all',
  })
  const {
    control: controlSubmitThresholdCustomer,
    setValue: setValueThresholdCustomer,
    getValues: getValueThresholdCustomer,
    trigger: triggerThresholdCustomer,
    formState: { errors: errossThresholdCustomer },
  } = useForm<{ amount: string | number | null }>({
    resolver: yupResolver(schemaThreshold),
    mode: 'all',
  })
  const { handleSubmit, control } = useForm<{ search: string }>({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  useEffect(() => {
    if (platform() === 'SUPPLIER') {
      getRetailerList(stateRouterQueryForRetailer)
        .then((res) => {
          const { data } = res
          setStateRetailerList(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }, [stateRouterQueryForRetailer])

  useEffect(() => {
    getCustomerList(stateRouterQueryForCustomer)
      .then((res) => {
        const { data } = res
        setStateCustomerList(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [stateRouterQueryForCustomer])

  const handleGetListShippingFee = () => {
    getListShippingFee()
      .then((res) => {
        const { data } = res.data
        setStateListConfigShippingFee(data)
        const foundIndexForBillingRetailer = data.findIndex(
          (item) => item.type === 'BILLING_RETAILER'
        )
        const foundIndexForBillingCustomer = data.findIndex(
          (item) => item.type === 'BILLING_CUSTOMER'
        )
        const foundIndexForAllRetailer = data.findIndex(
          (item) => item.type === 'ALL_RETAILER'
        )
        const foundIndexForAllCustomer = data.findIndex(
          (item) => item.type === 'ALL_CUSTOMER'
        )
        const foundIndexForSpecificRetailer = data.findIndex(
          (item) => item.type === 'SPECIFIC_RETAILER'
        )
        const foundIndexForSpecificCustomer = data.findIndex(
          (item) => item.type === 'SPECIFIC_CUSTOMER'
        )

        if (
          foundIndexForBillingRetailer >= 0 &&
          data[foundIndexForBillingRetailer] &&
          data[foundIndexForBillingRetailer].amount
        ) {
          setValueThresholdRetailer(
            'amount',
            Number(data[foundIndexForBillingRetailer].amount)
          )
          setStateCurrentIndexForBillingRetailer(foundIndexForBillingRetailer)
        }
        if (
          foundIndexForBillingCustomer >= 0 &&
          data[foundIndexForBillingCustomer] &&
          data[foundIndexForBillingCustomer].amount
        ) {
          setValueThresholdCustomer(
            'amount',
            Number(data[foundIndexForBillingCustomer].amount)
          )
          setStateCurrentIndexForBillingCustomer(foundIndexForBillingCustomer)
        }
        if (foundIndexForAllRetailer >= 0) {
          setStateCurrentIndexForAllRetailer(foundIndexForAllRetailer)
        }
        if (foundIndexForAllCustomer >= 0) {
          setStateCurrentIndexForAllCustomer(foundIndexForAllCustomer)
        }
        if (foundIndexForSpecificRetailer >= 0) {
          setStateCurrentIndexForSpecificRetailer(foundIndexForSpecificRetailer)
        }
        if (foundIndexForSpecificCustomer >= 0) {
          setStateCurrentIndexForSpecificCustomer(foundIndexForSpecificCustomer)
        }
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    handleGetListShippingFee()
  }, [])

  const handleSubmitUpdateShippingFee = (value: ActionShippingFeeType) => {
    updateActionFee(value)
      .then(() => {
        pushMessage(t('messenger.configShippingPriceSuccessfully'), 'success')
        handleGetListShippingFee()
        setStateDrawerRetailer(false)
        setStateDrawerCustomer(false)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleChangeCheckedRetailer = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
    index: number
  ) => {
    handleSubmitACtionShippingFee(
      type,
      index !== -1 && stateListConfigShippingFee[index]
        ? stateListConfigShippingFee[index].ids
        : [],
      event.target.checked
    )
  }
  const handleCloseDrawerRetailerList = () => {
    setStateTempSelected([])
    setStateDrawerRetailer(false)
  }
  const handleCloseDrawerCustomerList = () => {
    setStateTempSelected([])
    setStateDrawerCustomer(false)
  }

  const handleSearchRetailer = (value: { search: string }) => {
    setStateRouterQueryForRetailer({
      ...stateRouterQueryForRetailer,
      search: value.search,
    })
  }
  const handleSearchCustomer = (value: { search: string }) => {
    setStateRouterQueryForCustomer({
      ...stateRouterQueryForRetailer,
      search: value.search,
    })
  }
  const handleCheckIsSelectedInRetailerList = (index: number) => {
    return stateTempSelected.some((item) => item.id === index)
  }
  const handleChangeSelectedInRetailerList = (item: RetailerDataType) => {
    const cloneCurrentListSelectedRetailerID: ListValueFromAPIType[] =
      JSON.parse(JSON.stringify(stateTempSelected))
    if (handleCheckIsSelectedInRetailerList(item.business_id)) {
      const result = cloneCurrentListSelectedRetailerID.findIndex(
        (obj) => obj.id === item.business_id
      )
      cloneCurrentListSelectedRetailerID.splice(result, 1)
      setStateTempSelected(cloneCurrentListSelectedRetailerID)
    } else {
      cloneCurrentListSelectedRetailerID.push({
        id: item.business_id,
        name: item.business_name,
      })
      setStateTempSelected(cloneCurrentListSelectedRetailerID)
    }
  }
  const handleChangeSelectedInCustomerList = (item: CustomerDetailType) => {
    const cloneCurrentListSelectedCustomer: ListValueFromAPIType[] = JSON.parse(
      JSON.stringify(stateTempSelected)
    )
    if (handleCheckIsSelectedInRetailerList(item.id)) {
      const result = cloneCurrentListSelectedCustomer.findIndex(
        (obj) => obj.id === item.id
      )
      cloneCurrentListSelectedCustomer.splice(result, 1)
      setStateTempSelected(cloneCurrentListSelectedCustomer)
    } else {
      cloneCurrentListSelectedCustomer.push({
        id: item.id,
        name: item.first_name,
      })
      setStateTempSelected(cloneCurrentListSelectedCustomer)
    }
  }

  const handleOpenDrawerSelectRetailer = (type: string, index: number) => {
    if (
      !(stateListConfigShippingFee.length === 0) &&
      stateListConfigShippingFee[index]
    ) {
      const cloneCurrentListSelectedRetailer: ListValueFromAPIType[] =
        JSON.parse(JSON.stringify(stateListConfigShippingFee[index].ids))
      setStateTempSelected(cloneCurrentListSelectedRetailer)
    }

    setStateCurrentStatus({ type: type, index: index })
    setStateDrawerRetailer(true)
  }
  const handleOpenDrawerSelectCustomer = (type: string, index: number) => {
    if (
      !(stateListConfigShippingFee.length === 0) &&
      stateListConfigShippingFee[index]
    ) {
      const cloneCurrentListSelectedRetailer: ListValueFromAPIType[] =
        JSON.parse(JSON.stringify(stateListConfigShippingFee[index].ids))
      setStateTempSelected(cloneCurrentListSelectedRetailer)
    }

    setStateCurrentStatus({ type: type, index: index })
    setStateDrawerCustomer(true)
  }
  const handleSubmitACtionShippingFee = (
    type: string,
    arrayId: ListValueFromAPIType[],
    enable: boolean
  ) => {
    const listId: number[] = arrayId.map((item) => item.id)
    const submitValueForRetailer: ActionShippingFeeType = {
      type: type,
      ids: listId,
      enable: enable,
    }
    handleSubmitUpdateShippingFee(submitValueForRetailer)
  }

  const handleDeleteRetailer = (
    index: number,
    type: string,
    itemID: number,
    enable: boolean
  ) => {
    const cloneCurrentListSelectedRetailer: ListValueFromAPIType[] = JSON.parse(
      JSON.stringify(stateListConfigShippingFee[index].ids)
    )
    const result = cloneCurrentListSelectedRetailer.findIndex(
      (item) => item.id === itemID
    )
    if (result < 0) return
    cloneCurrentListSelectedRetailer.splice(result, 1)
    handleSubmitACtionShippingFee(
      type,
      cloneCurrentListSelectedRetailer,
      enable
    )
  }

  const debounced = useDebouncedCallback(
    (amount: number | null, enable: boolean, type: string) => {
      if (Number(amount) < 0.01 || Number(amount) > 10000000) return
      setValueThresholdRetailer(`amount`, amount)
      updateActionFee({ type: type, ids: [], enable: enable, amount: amount })
        .then(() => {
          pushMessage(t('messenger.configShippingPriceSuccessfully'), 'success')
          handleGetListShippingFee()
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    },
    500
  )
  const debouncedForCustomer = useDebouncedCallback(
    (amount: number | null, enable: boolean, type: string) => {
      if (Number(amount) < 0.01 || Number(amount) > 10000000) return
      setValueThresholdCustomer(`amount`, amount)
      updateActionFee({ type: type, ids: [], enable: enable, amount: amount })
        .then(() => {
          pushMessage(t('messenger.configShippingPriceSuccessfully'), 'success')
          handleGetListShippingFee()
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    },
    500
  )
  const handleChangeCheckedThresholdRetailer = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateActionFee({
      type: 'BILLING_RETAILER',
      ids: [],
      enable: event.target.checked,
      amount: getValueThresholdRetailer('amount')
        ? Number(getValueThresholdRetailer('amount'))
        : null,
    })
      .then(() => {
        pushMessage(t('messenger.configShippingPriceSuccessfully'), 'success')
        handleGetListShippingFee()
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleChangeCheckedThresholdCustomer = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const submitValue: ActionShippingFeeType = {
      type: 'BILLING_CUSTOMER',
      ids: [],
      enable: event.target.checked,
      amount: getValueThresholdCustomer('amount')
        ? Number(getValueThresholdCustomer('amount'))
        : null,
    }
    if (!submitValue.amount) {
      delete submitValue.amount
    }
    updateActionFee(submitValue)
      .then(() => {
        pushMessage(t('messenger.configShippingPriceSuccessfully'), 'success')
        handleGetListShippingFee()
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  return (
    <Box>
      <Grid container spacing={5}>
        {platform() === 'SUPPLIER' && (
          <Grid xs={6}>
            {/* Section for retailer */}
            <Box sx={{ marginBottom: '15px' }}>
              <Typography
                sx={{
                  fontSize: '2.4rem',
                  fontWeight: 700,
                  marginBottom: '15px',
                }}
              >
                {t('retailer')}
              </Typography>
              <Stack
                sx={{
                  border: '1px solid #E1E6EF',
                  background: 'white',
                  marginBottom: '15px',
                }}
              >
                <Box sx={{ borderBottom: '1px solid #E1E6EF' }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      padding: '20px',
                    }}
                  >
                    <Typography sx={{ color: '#49516F', fontWeight: 600 }}>
                      {t('freeForAllRetailer')}
                    </Typography>
                    <Switch
                      disabled={
                        stateCurrentIndexForSpecificRetailer !== -1 &&
                        stateListConfigShippingFee[
                          stateCurrentIndexForSpecificRetailer
                        ]
                          ? stateListConfigShippingFee[
                              stateCurrentIndexForSpecificRetailer
                            ].enable
                          : false
                      }
                      checked={
                        stateCurrentIndexForAllRetailer !== -1 &&
                        stateListConfigShippingFee[
                          stateCurrentIndexForAllRetailer
                        ]
                          ? stateListConfigShippingFee[
                              stateCurrentIndexForAllRetailer
                            ].enable
                          : false
                      }
                      onChange={(e) =>
                        handleChangeCheckedRetailer(
                          e,
                          'ALL_RETAILER',
                          stateCurrentIndexForAllRetailer
                        )
                      }
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </Stack>
                </Box>
                <Box sx={{ padding: '20px' }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>{t('excludedId')}</Typography>
                    <ButtonCustom
                      variant="contained"
                      onClick={() =>
                        handleOpenDrawerSelectRetailer(
                          'ALL_RETAILER',
                          stateCurrentIndexForAllRetailer
                        )
                      }
                    >
                      {t('selectRetailers')}
                    </ButtonCustom>
                  </Stack>
                  {stateListConfigShippingFee &&
                    stateCurrentIndexForAllRetailer !== -1 &&
                    stateListConfigShippingFee[
                      stateCurrentIndexForAllRetailer
                    ] &&
                    stateListConfigShippingFee[stateCurrentIndexForAllRetailer]
                      .ids.length > 0 && (
                      <Box>
                        {stateListConfigShippingFee[
                          stateCurrentIndexForAllRetailer
                        ].ids.map((item, index) => {
                          return (
                            <Stack
                              key={index}
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography>{item.name}</Typography>
                              <IconButton
                                onClick={() =>
                                  handleDeleteRetailer(
                                    stateCurrentIndexForAllRetailer,
                                    'ALL_RETAILER',
                                    item.id,
                                    stateListConfigShippingFee[
                                      stateCurrentIndexForAllRetailer
                                    ].enable
                                  )
                                }
                              >
                                <Trash size={24} />
                              </IconButton>
                            </Stack>
                          )
                        })}
                      </Box>
                    )}
                </Box>
              </Stack>

              <Stack
                sx={{
                  border: '1px solid #E1E6EF',
                  background: 'white',
                  marginBottom: '15px',
                }}
              >
                <Box sx={{ borderBottom: '1px solid #E1E6EF' }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      padding: '20px',
                    }}
                  >
                    <Typography sx={{ color: '#49516F', fontWeight: 600 }}>
                      {t('freeForSpecificRetailer')}
                    </Typography>
                    <Switch
                      disabled={
                        stateCurrentIndexForAllRetailer !== -1 &&
                        stateListConfigShippingFee
                          ? stateListConfigShippingFee[
                              stateCurrentIndexForAllRetailer
                            ].enable
                          : false
                      }
                      checked={
                        stateListConfigShippingFee[
                          stateCurrentIndexForSpecificRetailer
                        ] && stateCurrentIndexForSpecificRetailer !== -1
                          ? stateListConfigShippingFee[
                              stateCurrentIndexForSpecificRetailer
                            ].enable
                          : false
                      }
                      onChange={(e) =>
                        handleChangeCheckedRetailer(
                          e,
                          'SPECIFIC_RETAILER',
                          stateCurrentIndexForSpecificRetailer
                        )
                      }
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </Stack>
                </Box>
                <Box sx={{ padding: '20px' }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography>{t('selectedId')}</Typography>
                    <ButtonCustom
                      variant="contained"
                      onClick={() =>
                        handleOpenDrawerSelectRetailer('SPECIFIC_RETAILER', 2)
                      }
                    >
                      {t('selectRetailers')}
                    </ButtonCustom>
                  </Stack>
                  {stateListConfigShippingFee &&
                    stateCurrentIndexForSpecificRetailer !== -1 &&
                    stateListConfigShippingFee[
                      stateCurrentIndexForSpecificRetailer
                    ] &&
                    stateListConfigShippingFee[
                      stateCurrentIndexForSpecificRetailer
                    ].ids.length > 0 && (
                      <Box>
                        {stateListConfigShippingFee[
                          stateCurrentIndexForSpecificRetailer
                        ].ids.map((item, index) => {
                          return (
                            <Stack
                              key={index}
                              direction="row"
                              alignItems="center"
                              spacing={2}
                            >
                              <Typography>{item.name}</Typography>
                              <IconButton
                                onClick={() =>
                                  handleDeleteRetailer(
                                    stateCurrentIndexForSpecificRetailer,
                                    'SPECIFIC_RETAILER',
                                    item.id,
                                    stateListConfigShippingFee[
                                      stateCurrentIndexForSpecificRetailer
                                    ].enable
                                  )
                                }
                              >
                                <Trash size={24} />
                              </IconButton>
                            </Stack>
                          )
                        })}
                      </Box>
                    )}
                </Box>
              </Stack>
              <Stack
                sx={{
                  border: '1px solid #E1E6EF',
                  background: 'white',
                  marginBottom: '15px',
                }}
              >
                <Box sx={{ borderBottom: '1px solid #E1E6EF' }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      padding: '20px',
                    }}
                  >
                    <Typography sx={{ color: '#49516F', fontWeight: 600 }}>
                      {t('freeBasedOnTotalBilling')}
                    </Typography>
                    <Switch
                      checked={
                        stateListConfigShippingFee &&
                        stateCurrentIndexForBillingRetailer !== -1
                          ? stateListConfigShippingFee[
                              stateCurrentIndexForBillingRetailer
                            ].enable
                          : false
                      }
                      onChange={(e) => handleChangeCheckedThresholdRetailer(e)}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                  </Stack>
                </Box>
                <Box sx={{ padding: '20px' }}>
                  <Box sx={{ marginBottom: '15px' }}>
                    <Controller
                      control={controlSubmitThresholdRetailer}
                      name="amount"
                      render={() => (
                        <>
                          <InputLabelCustom>
                            {t('billingAmountThreshold')}
                          </InputLabelCustom>
                          <div className={classes['input-number']}>
                            <CurrencyNumberFormat
                              defaultPrice={
                                stateCurrentIndexForBillingRetailer !== -1 &&
                                stateListConfigShippingFee[
                                  stateCurrentIndexForBillingRetailer
                                ]
                                  ? Number(
                                      stateListConfigShippingFee[
                                        stateCurrentIndexForBillingRetailer
                                      ].amount?.toFixed(2)
                                    )
                                  : 0
                              }
                              propValue={(value) => {
                                setValueThresholdRetailer(`amount`, value)
                                triggerThresholdRetailer(`amount`)
                                {
                                  debounced(
                                    value,
                                    stateCurrentIndexForBillingRetailer !==
                                      -1 &&
                                      stateListConfigShippingFee[
                                        stateCurrentIndexForBillingRetailer
                                      ]
                                      ? stateListConfigShippingFee[
                                          stateCurrentIndexForBillingRetailer
                                        ].enable
                                      : false,
                                    'BILLING_RETAILER'
                                  )
                                }
                              }}
                              error={!!errossThresholdRetailer.amount}
                            />
                          </div>
                          <FormHelperText error>
                            {errossThresholdRetailer.amount &&
                              `${errossThresholdRetailer.amount.message}`}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </Box>
                </Box>
              </Stack>
            </Box>
            {/* Section for  retailer */}
          </Grid>
        )}

        <Grid xs={6}>
          {/* Section for customer */}
          <Box sx={{ marginBottom: '15px' }}>
            <Typography
              sx={{ fontSize: '2.4rem', fontWeight: 700, marginBottom: '15px' }}
            >
              {t('customer')}
            </Typography>
            <Stack
              sx={{
                border: '1px solid #E1E6EF',
                background: 'white',
                marginBottom: '15px',
              }}
            >
              <Box sx={{ borderBottom: '1px solid #E1E6EF' }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    padding: '20px',
                  }}
                >
                  <Typography sx={{ color: '#49516F', fontWeight: 600 }}>
                    {t('freeForAllCustomer')}
                  </Typography>
                  <Switch
                    disabled={
                      stateListConfigShippingFee &&
                      stateCurrentIndexForSpecificCustomer !== -1 &&
                      stateListConfigShippingFee[
                        stateCurrentIndexForSpecificCustomer
                      ]
                        ? stateListConfigShippingFee[
                            stateCurrentIndexForSpecificCustomer
                          ].enable
                        : false
                    }
                    checked={
                      stateCurrentIndexForAllCustomer !== -1 &&
                      stateListConfigShippingFee[
                        stateCurrentIndexForAllCustomer
                      ]
                        ? stateListConfigShippingFee[
                            stateCurrentIndexForAllCustomer
                          ].enable
                        : false
                    }
                    onChange={(e) =>
                      handleChangeCheckedRetailer(
                        e,
                        'ALL_CUSTOMER',
                        stateCurrentIndexForAllCustomer
                      )
                    }
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
              </Box>
              <Box sx={{ padding: '20px' }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>{t('excludedId')}</Typography>
                  <ButtonCustom
                    variant="contained"
                    onClick={() =>
                      handleOpenDrawerSelectCustomer('ALL_CUSTOMER', 1)
                    }
                  >
                    {t('selectCustomer')}
                  </ButtonCustom>
                </Stack>
                {stateListConfigShippingFee &&
                  stateCurrentIndexForAllCustomer !== -1 &&
                  stateListConfigShippingFee[stateCurrentIndexForAllCustomer] &&
                  stateListConfigShippingFee[stateCurrentIndexForAllCustomer]
                    .ids.length > 0 && (
                    <Box>
                      {stateListConfigShippingFee[
                        stateCurrentIndexForAllCustomer
                      ].ids.map((item, index) => {
                        return (
                          <Stack
                            key={index}
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Typography>
                              {item.first_name
                                ? `${item.first_name} ${item.last_name}`
                                : item.name}
                            </Typography>
                            <IconButton
                              onClick={() =>
                                handleDeleteRetailer(
                                  1,
                                  'ALL_CUSTOMER',
                                  item.id,
                                  stateListConfigShippingFee[
                                    stateCurrentIndexForAllCustomer
                                  ].enable
                                )
                              }
                            >
                              <Trash size={24} />
                            </IconButton>
                          </Stack>
                        )
                      })}
                    </Box>
                  )}
              </Box>
            </Stack>

            <Stack
              sx={{
                border: '1px solid #E1E6EF',
                background: 'white',
                marginBottom: '15px',
              }}
            >
              <Box sx={{ borderBottom: '1px solid #E1E6EF' }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    padding: '20px',
                  }}
                >
                  <Typography sx={{ color: '#49516F', fontWeight: 600 }}>
                    {t('freeForSpecificRetailer')}
                  </Typography>
                  <Switch
                    disabled={
                      stateListConfigShippingFee &&
                      stateCurrentIndexForAllCustomer !== -1 &&
                      stateListConfigShippingFee[
                        stateCurrentIndexForAllCustomer
                      ] &&
                      stateListConfigShippingFee.length > 0
                        ? stateListConfigShippingFee[
                            stateCurrentIndexForAllCustomer
                          ].enable
                        : false
                    }
                    checked={
                      stateListConfigShippingFee[
                        stateCurrentIndexForSpecificCustomer
                      ]
                        ? stateListConfigShippingFee[
                            stateCurrentIndexForSpecificCustomer
                          ].enable
                        : false
                    }
                    onChange={(e) =>
                      handleChangeCheckedRetailer(
                        e,
                        'SPECIFIC_CUSTOMER',
                        stateCurrentIndexForSpecificCustomer
                      )
                    }
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
              </Box>
              <Box sx={{ padding: '20px' }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>Selected id</Typography>
                  <ButtonCustom
                    variant="contained"
                    onClick={() =>
                      handleOpenDrawerSelectCustomer(
                        'SPECIFIC_CUSTOMER',
                        stateCurrentIndexForSpecificCustomer
                      )
                    }
                  >
                    {t('selectCustomer')}
                  </ButtonCustom>
                </Stack>
                {stateListConfigShippingFee &&
                  stateCurrentIndexForSpecificCustomer !== -1 &&
                  stateListConfigShippingFee[
                    stateCurrentIndexForSpecificCustomer
                  ] &&
                  stateListConfigShippingFee[
                    stateCurrentIndexForSpecificCustomer
                  ].ids.length > 0 && (
                    <Box>
                      {stateListConfigShippingFee[
                        stateCurrentIndexForSpecificCustomer
                      ].ids.map((item, index) => {
                        return (
                          <Stack
                            key={index}
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            {item.first_name
                              ? `${item.first_name} ${item.last_name}`
                              : item.name}
                            <IconButton
                              onClick={() =>
                                handleDeleteRetailer(
                                  stateCurrentIndexForSpecificCustomer,
                                  'SPECIFIC_CUSTOMER',
                                  item.id,
                                  stateListConfigShippingFee[
                                    stateCurrentIndexForSpecificCustomer
                                  ].enable
                                )
                              }
                            >
                              <Trash size={24} />
                            </IconButton>
                          </Stack>
                        )
                      })}
                    </Box>
                  )}
              </Box>
            </Stack>
            <Stack
              sx={{
                border: '1px solid #E1E6EF',
                background: 'white',
                marginBottom: '15px',
              }}
            >
              <Box sx={{ borderBottom: '1px solid #E1E6EF' }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    padding: '20px',
                  }}
                >
                  <Typography sx={{ color: '#49516F', fontWeight: 600 }}>
                    {t('freeBasedOnTotalBilling')}
                  </Typography>
                  <Switch
                    checked={
                      stateCurrentIndexForBillingCustomer !== -1 &&
                      stateListConfigShippingFee[
                        stateCurrentIndexForBillingCustomer
                      ]
                        ? stateListConfigShippingFee[
                            stateCurrentIndexForBillingCustomer
                          ].enable
                        : false
                    }
                    onChange={(e) => handleChangeCheckedThresholdCustomer(e)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
              </Box>
              <Box sx={{ padding: '20px' }}>
                <Box sx={{ marginBottom: '15px' }}>
                  <Controller
                    control={controlSubmitThresholdCustomer}
                    name="amount"
                    render={() => (
                      <>
                        <InputLabelCustom>
                          {t('billingAmountThreshold')}
                        </InputLabelCustom>
                        <div className={classes['input-number']}>
                          <CurrencyNumberFormat
                            defaultPrice={
                              stateCurrentIndexForBillingCustomer !== -1 &&
                              stateListConfigShippingFee[
                                stateCurrentIndexForBillingCustomer
                              ]
                                ? stateListConfigShippingFee[
                                    stateCurrentIndexForBillingCustomer
                                  ].amount
                                : 0
                            }
                            propValue={(value) => {
                              setValueThresholdCustomer(`amount`, value)
                              triggerThresholdCustomer(`amount`)
                              {
                                debouncedForCustomer(
                                  value,
                                  stateCurrentIndexForBillingCustomer !== -1 &&
                                    stateListConfigShippingFee[
                                      stateCurrentIndexForBillingCustomer
                                    ]
                                    ? stateListConfigShippingFee[
                                        stateCurrentIndexForBillingCustomer
                                      ].enable
                                    : false,
                                  'BILLING_CUSTOMER'
                                )
                              }
                            }}
                            error={!!errossThresholdCustomer.amount}
                          />
                        </div>
                        <FormHelperText error>
                          {errossThresholdCustomer.amount &&
                            `${errossThresholdCustomer.amount.message}`}
                        </FormHelperText>
                      </>
                    )}
                  />
                </Box>
              </Box>
            </Stack>
          </Box>
          {/* Section for  retailer */}
        </Grid>
      </Grid>
      <Drawer
        anchor="right"
        open={stateDrawerCustomer}
        onClose={handleCloseDrawerCustomerList}
        disableEnforceFocus
      >
        <CustomBoxDrawer>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ marginBottom: '15px' }}
          >
            <IconButton onClick={handleCloseDrawerCustomerList}>
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2 textAlign="center">
              {t('selectCustomer')}
            </TypographyH2>
          </Stack>
          <Box sx={{ marginBottom: '15px' }}>
            <form
              onSubmit={handleSubmit(handleSearchCustomer)}
              className="form-search"
            >
              <Controller
                control={control}
                name="search"
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth>
                    <TextFieldSearchCustom
                      id="search"
                      placeholder={t('searchCustomerByName')}
                      {...field}
                    />
                  </FormControl>
                )}
              />
              <IconButton
                aria-label="Search"
                type="submit"
                className="form-search__button"
              >
                <MagnifyingGlass size={20} />
              </IconButton>
            </form>
          </Box>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws></TableCellTws>
                  <TableCellTws>
                    <Typography sx={{ color: '#49516F' }}>
                      {t('name')}
                    </Typography>
                  </TableCellTws>
                  <TableCellTws align="right">
                    <Typography sx={{ color: '#49516F' }}>
                      {t('address')}
                    </Typography>
                  </TableCellTws>
                  <TableCellTws>
                    <Typography sx={{ color: '#49516F' }}>
                      {t('email')}
                    </Typography>
                  </TableCellTws>
                  <TableCellTws align="center">
                    <Typography sx={{ color: '#49516F' }}>
                      {t('phoneNumber')}
                    </Typography>
                  </TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateCustomerList?.data.map((item, index) => {
                  return (
                    <TableRowTws key={index}>
                      <TableCellTws>
                        <Checkbox
                          checked={handleCheckIsSelectedInRetailerList(item.id)}
                          onChange={(e) => {
                            console.log(e)
                            handleChangeSelectedInCustomerList(item)
                          }}
                        />
                      </TableCellTws>

                      <TableCellTws>
                        <Typography
                          sx={{
                            fontWeight: 500,
                            fontSize: '1.6rem',
                            color: '#595959',
                          }}
                        >
                          {item.first_name}{' '}
                          {item.last_name ? item.last_name : ''}
                        </Typography>
                      </TableCellTws>
                      <TableCellTws align="right">
                        {item.phone_number}
                      </TableCellTws>

                      <TableCellTws>{item.email}</TableCellTws>
                      <TableCellTws align="center">
                        {formatPhoneNumber(item.phone_number)}
                      </TableCellTws>
                    </TableRowTws>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainerTws>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <Typography>{t('rowsPerPage')}</Typography>

            <FormControl sx={{ m: 1 }}>
              <SelectPaginationCustom
                value={stateRouterQueryForCustomer.limit}
                onChange={(e) => {
                  setStateRouterQueryForRetailer({
                    ...stateRouterQueryForCustomer,
                    limit: Number(e.target.value),
                  })
                }}
                displayEmpty
              >
                <MenuItemSelectCustom value={10}>10</MenuItemSelectCustom>
                <MenuItemSelectCustom value={20}>20</MenuItemSelectCustom>
                <MenuItemSelectCustom value={50}>50</MenuItemSelectCustom>
                <MenuItemSelectCustom value={100}>100</MenuItemSelectCustom>
              </SelectPaginationCustom>
            </FormControl>
            <Pagination
              color="primary"
              variant="outlined"
              shape="rounded"
              defaultPage={1}
              page={stateRouterQueryForCustomer.page}
              onChange={(event, page: number) => {
                console.log(event)
                setStateRouterQueryForRetailer({
                  ...stateRouterQueryForCustomer,
                  page: page,
                })
              }}
              count={
                stateCustomerList
                  ? Math.ceil(
                      Number(stateCustomerList.totalItems) /
                        stateRouterQueryForCustomer.limit
                    )
                  : 0
              }
            />
          </Stack>
          <Stack direction="row" spacing={2}>
            <ButtonCustom
              variant="outlined"
              size="large"
              onClick={() => {
                handleCloseDrawerCustomerList()
              }}
            >
              {t('cancel')}
            </ButtonCustom>
            <ButtonCustom
              variant="contained"
              size="large"
              onClick={() => {
                handleSubmitACtionShippingFee(
                  stateCurrentStatus?.type,
                  stateTempSelected,
                  stateListConfigShippingFee[Number(stateCurrentStatus?.index)]
                    .enable
                )
              }}
            >
              {t('select')}
            </ButtonCustom>
          </Stack>
        </CustomBoxDrawer>
      </Drawer>
      {platform() === 'SUPPLIER' && (
        <Drawer
          anchor="right"
          open={stateDrawerRetailer}
          onClose={handleCloseDrawerRetailerList}
          disableEnforceFocus
        >
          <CustomBoxDrawer>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ marginBottom: '15px' }}
            >
              <IconButton onClick={handleCloseDrawerRetailerList}>
                <ArrowRight size={24} />
              </IconButton>
              <TypographyH2 textAlign="center">
                {t('selectRetailers')}
              </TypographyH2>
            </Stack>
            <Box sx={{ marginBottom: '15px' }}>
              <form
                onSubmit={handleSubmitSearchRetailer(handleSearchRetailer)}
                className="form-search"
              >
                <Controller
                  control={controlSearchRetailer}
                  name="search"
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextFieldSearchCustom
                        id="search"
                        placeholder={t('searchRetailerByName')}
                        {...field}
                      />
                    </FormControl>
                  )}
                />
                <IconButton
                  aria-label="Search"
                  type="submit"
                  className="form-search__button"
                >
                  <MagnifyingGlass size={20} />
                </IconButton>
              </form>
            </Box>
            <TableContainerTws>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCellTws></TableCellTws>
                    <TableCellTws>
                      <Typography sx={{ color: '#49516F' }}>
                        {t('businessOwnerName')}
                      </Typography>
                    </TableCellTws>

                    <TableCellTws align="right">
                      <Typography sx={{ color: '#49516F' }}>
                        {t('federalTaxId')}
                      </Typography>
                    </TableCellTws>
                    <TableCellTws>
                      <Typography sx={{ color: '#49516F' }}>
                        {t('email')}
                      </Typography>
                    </TableCellTws>
                    <TableCellTws align="center">
                      <Typography sx={{ color: '#49516F' }}>
                        {t('phoneNumber')}
                      </Typography>
                    </TableCellTws>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {stateRetailerList?.data.map((item, index) => {
                    return (
                      <TableRowTws key={index}>
                        <TableCellTws>
                          <Checkbox
                            checked={handleCheckIsSelectedInRetailerList(
                              item.business_id
                            )}
                            onChange={(e) => {
                              console.log(e)
                              handleChangeSelectedInRetailerList(item)
                            }}
                          />
                        </TableCellTws>

                        <TableCellTws>
                          <Stack spacing={1}>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                fontSize: '1.6rem',
                                color: '#595959',
                              }}
                            >
                              {item.business_name}
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 500,
                                color: '#9098B1',
                              }}
                            >
                              {item.owner_name}
                            </Typography>
                          </Stack>
                        </TableCellTws>
                        <TableCellTws align="right">
                          {item.federal_tax_id}
                        </TableCellTws>

                        <TableCellTws>{item.email}</TableCellTws>
                        <TableCellTws align="center">
                          {formatPhoneNumber(item.phone_number)}
                        </TableCellTws>
                      </TableRowTws>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainerTws>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={2}
            >
              <Typography>{t('rowsPerPage')}</Typography>

              <FormControl sx={{ m: 1 }}>
                <SelectPaginationCustom
                  value={stateRouterQueryForRetailer.limit}
                  onChange={(e) => {
                    setStateRouterQueryForRetailer({
                      ...stateRouterQueryForRetailer,
                      limit: Number(e.target.value),
                    })
                  }}
                  displayEmpty
                >
                  <MenuItemSelectCustom value={10}>10</MenuItemSelectCustom>
                  <MenuItemSelectCustom value={20}>20</MenuItemSelectCustom>
                  <MenuItemSelectCustom value={50}>50</MenuItemSelectCustom>
                  <MenuItemSelectCustom value={100}>100</MenuItemSelectCustom>
                </SelectPaginationCustom>
              </FormControl>
              <Pagination
                color="primary"
                variant="outlined"
                shape="rounded"
                defaultPage={1}
                page={stateRouterQueryForRetailer.page}
                onChange={(event, page: number) => {
                  console.log(event)
                  setStateRouterQueryForRetailer({
                    ...stateRouterQueryForRetailer,
                    page: page,
                  })
                }}
                count={
                  stateRetailerList
                    ? Math.ceil(
                        Number(stateRetailerList.totalItems) /
                          stateRouterQueryForRetailer.limit
                      )
                    : 0
                }
              />
            </Stack>
            <Stack direction="row" spacing={2}>
              <ButtonCustom
                variant="outlined"
                size="large"
                onClick={() => {
                  handleCloseDrawerRetailerList()
                }}
              >
                {t('cancel')}
              </ButtonCustom>
              <ButtonCustom
                variant="contained"
                size="large"
                onClick={() => {
                  handleSubmitACtionShippingFee(
                    stateCurrentStatus?.type,
                    stateTempSelected,
                    stateListConfigShippingFee[
                      Number(stateCurrentStatus?.index)
                    ]
                      ? stateListConfigShippingFee[
                          Number(stateCurrentStatus?.index)
                        ].enable
                      : false
                  )
                }}
              >
                {t('select')}
              </ButtonCustom>
            </Stack>
          </CustomBoxDrawer>
        </Drawer>
      )}
    </Box>
  )
}

export default ShippingPriceComponent
