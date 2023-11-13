import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  LinearProgress,
  Radio,
  Stack,
  TextField,
  TextareaAutosize,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import {
  ArrowLeft,
  ArrowRight,
  CircleWavyCheck,
  NotePencil,
  PencilSimpleLine,
  Plus,
  PlusCircle,
  Trash,
} from '@phosphor-icons/react'
import Image from 'next/image'
import dataState from 'pages/_common/account/_address-book/states.json'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import InfiniteScroll from 'react-infinite-scroll-component'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InfiniteScrollSelect,
  InputLabelCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
  TypographyH2,
} from 'src/components'
import RequiredLabel from 'src/components/requiredLabel'

import { yupResolver } from '@hookform/resolvers/yup'
import { NumericFormat, PatternFormat } from 'react-number-format'

import {
  formatPhoneNumber,
  handlerGetErrMessage,
  platform,
} from 'src/utils/global.utils'

import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  createAddressBookAPI,
  createExternalOrder,
  createExternalSupplier,
  getListAddress,
  updateAddressBook,
} from './externalOrderCreateAPI'
import { AddressDataType, Item } from './externalOrderCreateModel'
import {
  schemaAddress,
  schemaExternalSupplier,
  schemaForm,
} from './validations'
import ProductsExisting from '../part/products'
import { VariantDataDetailType } from '../part/products/productModel'
import Link from 'next/link'
import classes from './styles.module.scss'
import { ExternalSupplierListResponseType } from '../../external-supplier/list/externalSupplierModel'
import { getListExternalSupplier } from '../list/externalOrderAPI'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { Moment } from 'moment'
import moment from 'moment'
import { formatMoney } from 'src/utils/money.utils'
import { useRouter } from 'next/router'
import CurrencyNumberFormat from 'src/components/CurrencyNumberFormat'
import { useTranslation } from 'react-i18next'

const DividerCustom = styled('div')(() => ({
  backgroundColor: '#E1E6EF',
  height: '15px',
  width: '1px',
  margin: '0 10px',
}))

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
}

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
}

const StyledTextarea = styled(TextareaAutosize)(
  ({ theme }) => `
    width: 100%;
    font-family: Poppins;
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === 'dark' ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === 'dark' ? blue[500] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
)

const CreateExternalOrderComponent: React.FC = () => {
  const { t } = useTranslation('external-order')
  const [stateDialogAddress, setStateDialogAddress] =
    useState<string>('default')
  const [stateModalAddExternalSupplier, setStateModalAddExternalSupplier] =
    useState(false)
  const [valueInput, setValueInput] = useState<{
    name: string
    abbreviation: string
  }>({
    name: '',
    abbreviation: '',
  })
  const router = useRouter()

  const [stateDrawerSelectProduct, setStateDrawerSelectProduct] =
    useState(false)
  const [stateProductSelect, setStateProductSelect] = useState<
    VariantDataDetailType[]
  >([])
  const [stateListExternalSupplier, setStateListExternalSupplier] =
    useState<ExternalSupplierListResponseType>({
      data: [],
    })
  const [pushMessage] = useEnqueueSnackbar()
  //Default Address
  const [stateDefaultAddress, setStateDefaultAddress] =
    useState<AddressDataType>()
  const [stateOpenDialogAddress, setStateOpenDialogAddress] = useState(false)
  const [stateListAddress, setStateListAddress] = useState<{
    data: {
      id: number
      name: string
      phone_number: string
      receiver_name: string
      address: string
      default_address: boolean
      city: string
      state: string
      postal_zipcode: string
    }[]
    errors?: any
    nextPage?: number | null
  }>({
    data: [],
  })
  const theme = useTheme()
  //Select Address
  const [stateSelectedValue, setStateSelectedValue] = useState<number>()
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [openExternalSupplier, setOpenExternalSupplier] = useState(false)

  console.log('stateProductSelect', stateProductSelect)
  const dispatch = useAppDispatch()

  const {
    control: controlExternalSupplier,
    setValue: setValueExternalSupplier,
    reset: resetExternalSupplier,
    handleSubmit: handleSubmitExternalSupplier,
    trigger: triggerExternalSupplier,
    clearErrors: clearErrorsExternalSupplier,
    formState: { errors: errorsExternalSupplier },
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
    resolver: yupResolver(schemaExternalSupplier(t)),
    mode: 'all',
  })

  const {
    handleSubmit: handleSubmitAddress,
    control: controlAddress,
    setValue: setValueAddress,
    reset,
    trigger: triggerAddress,
    getValues: getValuesAddress,
    formState: { errors: errorsAddress },
  } = useForm<{
    id?: number
    name: string
    receiver_name: string
    phone_number: string
    address: string
    city: string
    state: {
      name: string
      abbreviation: string
    }
    postal_zipcode: string
  }>({
    resolver: yupResolver(schemaAddress(t)),
    mode: 'all',
  })
  const {
    setValue,
    getValues,
    control,
    handleSubmit,
    trigger,
    clearErrors,
    register,
    watch,
    formState: { errors },
  } = useForm<{
    code: string
    address: string
    address_name: string
    phone_number: string
    external_supplier: string
    items: Item[]
    tax_amount: string | number
    discount_amount: string | number
    order_date: string
    notes: string
  }>({
    resolver: yupResolver(schemaForm(t)),
    mode: 'all',
    defaultValues: {
      items: [],
    },
  })

  console.log('errors', errors)

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'items',
  })

  const handleAppendForm = () => {
    setStateDrawerSelectProduct(true)
  }

  const handleDialogAddress = () => {
    reset({
      name: '',
      phone_number: '',
      address: '',
      receiver_name: '',
      city: '',
      state: {
        name: '',
        abbreviation: '',
      },
      postal_zipcode: '',
    })
    setValueInput({
      name: '',
      abbreviation: '',
    })
    setStateDialogAddress('default')
    setStateSelectedValue(stateDefaultAddress?.id)
    setStateOpenDialogAddress(true)
  }

  const handleOpenCreateAddress = () => {
    reset({
      name: '',
      phone_number: '',
      address: '',
      receiver_name: '',
      city: '',
      state: {
        name: '',
        abbreviation: '',
      },
      postal_zipcode: '',
    })
    setValueInput({
      name: '',
      abbreviation: '',
    })
    setStateDialogAddress('create')
    setStateOpenDialogAddress(!stateOpenDialogAddress)
  }

  const fetchMoreData = () => {
    if (!hasMore) return
    setPage((prev) => {
      getListAddress({ page: prev }).then((res) => {
        const { data } = res.data
        if (data?.length === 0 || !res.data.nextPage) {
          setHasMore(false)
        }
        setStateListAddress((prev) => {
          return {
            ...prev,
            data: [...prev.data, ...data],
          }
        })
      })
      return page + 1
    })
  }

  const handleCloseDialog = () => {
    reset({
      name: '',
      phone_number: '',
      address: '',
      receiver_name: '',
      city: '',
      state: {
        name: '',
        abbreviation: '',
      },
      postal_zipcode: '',
    })
    setValueInput({
      name: '',
      abbreviation: '',
    })
    setStateOpenDialogAddress(false)
  }

  //Choose Address
  const handleConfirmAddress = () => {
    for (const i in stateListAddress?.data) {
      if (stateListAddress?.data[Number(i)].id == stateSelectedValue) {
        setStateDefaultAddress(stateListAddress?.data[Number(i)])
      }
    }
    reset({
      name: '',
      phone_number: '',
      address: '',
      receiver_name: '',
      city: '',
      state: {
        name: '',
        abbreviation: '',
      },
      postal_zipcode: '',
    })
    setValueInput({
      name: '',
      abbreviation: '',
    })
    setStateOpenDialogAddress(false)
    pushMessage(t('message.changeAddressSuccessfully'), 'success')
  }

  const handleChangeRadio = (currentAddress: AddressDataType) => {
    setStateSelectedValue(Number(currentAddress.id))
  }

  const handleCheckKeyValueObjectValid = (value: any) => {
    const filteredValues: any = Object.fromEntries(
      Object.entries(value).filter(([, value]) => !!value)
    )

    return filteredValues
  }

  const updateAddress = (value: {
    id: number
    name: string
    receiver_name: string
    phone_number: string
    address: string
    city?: string
    state?: string
    postal_zipcode?: string
  }) => {
    setValueAddress('id', value.id)
    setValueAddress('name', value.name)
    setValueAddress('phone_number', formatPhoneNumber(value.phone_number))
    setValueAddress('receiver_name', value.receiver_name)
    setValueAddress('address', value.address)
    const filtered = dataState.find(
      (i: { abbreviation: string }) => i?.abbreviation === value?.state
    )
    setValueAddress('city', value.city ? value.city : '')
    setValueAddress('state', {
      name: filtered?.name ? filtered?.name : '',
      abbreviation: value.state ? value.state : '',
    })
    setValueInput({
      name: filtered?.name ? filtered?.name : '',
      abbreviation: value.state ? value.state : '',
    })
    setValueAddress(
      'postal_zipcode',
      value.postal_zipcode ? value.postal_zipcode : ''
    )
  }

  const getDataAddressBook = () => {
    dispatch(loadingActions.doLoading())
    getListAddress()
      .then((res) => {
        const { data } = res

        setStateListAddress(data)
        for (const i in data.data) {
          if (data?.data[parseInt(i)]?.default_address) {
            setStateDefaultAddress(data?.data[parseInt(i)])
            setStateSelectedValue(data?.data[parseInt(i)].id)
          }
        }
        if (res.data?.data?.length === 0 || !res.data.nextPage) {
          setHasMore(false)
        }
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const onSubmitAddress = (values: {
    id?: number
    name: string
    receiver_name: string
    phone_number: string
    address: string
    city: string
    state: {
      name: string
      abbreviation: string
    }
    postal_zipcode: string
  }) => {
    values.phone_number = values.phone_number.replace(/\D/g, '')
    dispatch(loadingActions.doLoading())
    if (stateDialogAddress === 'create') {
      createAddressBookAPI({
        ...values,
        state: values?.state?.abbreviation,
      })
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('message.createAddressSuccess'), 'success')
          getDataAddressBook()
          setStateDialogAddress('default')
          reset({
            name: '',
            phone_number: '',
            address: '',
            receiver_name: '',
            city: '',
            state: {
              name: '',
              abbreviation: '',
            },
            postal_zipcode: '',
          })
          setValueInput({
            name: '',
            abbreviation: '',
          })
          setHasMore(true)
          setPage(2)
        })
        .catch((response) => {
          const { status, data } = response.response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    if (stateDialogAddress === 'update') {
      updateAddressBook(Number(getValuesAddress('id')), {
        ...values,
        state: values?.state?.abbreviation,
      })
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('message.updateAddressSuccess'), 'success')
          getDataAddressBook()
          setStateDialogAddress('default')
          reset({
            name: '',
            phone_number: '',
            address: '',
            receiver_name: '',
            city: '',
            state: {
              name: '',
              abbreviation: '',
            },
            postal_zipcode: '',
          })
          setValueInput({
            name: '',
            abbreviation: '',
          })
          setHasMore(true)
          setPage(2)
        })
        .catch((response) => {
          const { status, data } = response.response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  const handleBackToDefaultDialog = () => {
    reset({
      name: '',
      phone_number: '',
      address: '',
      receiver_name: '',
      city: '',
      state: {
        name: '',
        abbreviation: '',
      },
      postal_zipcode: '',
    })
    setValueInput({
      name: '',
      abbreviation: '',
    })
    setStateDialogAddress('default')
    setStateSelectedValue(stateDefaultAddress?.id)
  }

  const onSubmitValue = (values: any) => {
    dispatch(loadingActions.doLoading())

    try {
      createExternalOrder(
        handleCheckKeyValueObjectValid({
          recipient_name: stateDefaultAddress?.receiver_name,
          code: values.code,
          address: stateDefaultAddress?.address,
          address_name: stateDefaultAddress?.name,
          phone_number: stateDefaultAddress?.phone_number,
          external_supplier: values.external_supplier.slice(
            0,
            values.external_supplier.indexOf('-')
          ),
          items: values.items.map(
            (
              item: {
                price: number
                quantity: number
              },
              index: number
            ) => ({
              ...item,
              product_variant: stateProductSelect[index].id,
            })
          ),
          tax_amount: values.tax_amount,
          discount_amount: values.discount_amount,
          order_date: values.order_date,
          notes: values.notes,
        })
      )
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('message.createExternalOrderSuccessfully'), 'success')
          router.push(
            `/${platform().toLowerCase()}/account-payable/external-order/list`
          )
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
        .finally(() => {
          dispatch(loadingActions.doLoadingSuccess())
        })
    } catch (error) {
      console.log('🚀 ~ onSubmitValue ~ error:', error)

      dispatch(loadingActions.doLoadingFailure())
    }
  }

  useEffect(() => {
    getDataAddressBook()
    handleGetExternalSupplier('')
  }, [dispatch])

  const deleteItem = (index: number) => {
    const updatedItems = [...stateProductSelect]

    updatedItems.splice(index, 1)

    setStateProductSelect(updatedItems)
  }

  const handleGetExternalSupplier = (value: string | null) => {
    getListExternalSupplier(1, { search: value })
      .then((response) => {
        const { data } = response
        setStateListExternalSupplier(data)
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const fetchMoreDataExternalSupplier = useCallback(
    (value: { page: number; name: string }) => {
      getListExternalSupplier(value.page, { search: value.name })
        .then((res) => {
          const { data } = res
          setStateListExternalSupplier((prev: any) => {
            return {
              ...data,
              data: [...prev.data, ...res.data.data],
            }
          })
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    },
    [setStateListExternalSupplier]
  )

  const totalPrice = watch('items').reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )

  const totalAmount = useMemo(() => {
    return (
      totalPrice +
      Number(watch('tax_amount') || 0) -
      Number(watch('discount_amount') || 0)
    )
  }, [totalPrice, watch('tax_amount'), watch('discount_amount')])

  const onSubmitCreateExternalSupplier = (values: any) => {
    dispatch(loadingActions.doLoading())
    try {
      createExternalSupplier(
        handleCheckKeyValueObjectValid({
          ...values,
          state: values?.state?.abbreviation,
        })
      )
        .then(() => {
          pushMessage(
            t('message.createExternalSupplierSuccessfully'),
            'success'
          )
          setStateModalAddExternalSupplier(false)
          handleGetExternalSupplier('')
          resetExternalSupplier()
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
    resetExternalSupplier()
    clearErrorsExternalSupplier()
    setStateModalAddExternalSupplier(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitValue)}>
        <Grid
          container
          rowSpacing={1}
          sx={{ width: '100%' }}
          mb={'35px'}
          gap={2}
        >
          <Grid item xs={4}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: '12px',
                color: '#000000',
              }}
            >
              {t('products')}
            </Typography>
            <Typography>
              {t('youOnlyCanSelectProductsFromExternalSuppliers')}
            </Typography>
            <ButtonCustom
              variant="contained"
              size="large"
              sx={{
                marginTop: '10px',
              }}
              onClick={handleAppendForm}
            >
              {t('selectProduct')}
            </ButtonCustom>
            <Stack direction={'column'} gap={1} mt={2}>
              {fields.length === 0 ? (
                <></>
              ) : (
                fields.map((_item, index) => {
                  return (
                    <>
                      <Box
                        sx={{
                          borderRadius: '10px',
                          border: '1px solid #E1E6EF',
                          background: '#FFF',
                          padding: '10px',
                        }}
                      >
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          justifyContent={'space-between'}
                          gap={1}
                        >
                          <Image
                            alt="image"
                            src={
                              stateProductSelect[index]?.thumbnail ||
                              '/' + '/images/vapeProduct.png'
                            }
                            // src={'/' + '/images/vapeProduct.png'}
                            width={50}
                            height={50}
                          />
                          <Typography
                            sx={{
                              color: '#1B1F27',
                              fontSize: '12px',
                              fontWeight: 700,
                            }}
                          >
                            {stateProductSelect[index]?.name || 'N/A'}
                          </Typography>
                          <Stack
                            direction={'row'}
                            alignItems={'flex-end'}
                            gap={1}
                            sx={{
                              marginLeft: 'auto',
                            }}
                          >
                            <Controller
                              control={control}
                              name={`items.${index}.price`}
                              render={() => (
                                <Box>
                                  <InputLabelCustom
                                    htmlFor="title"
                                    error={!!errors.items?.[index]?.price}
                                  >
                                    {t('unitPrice')}
                                  </InputLabelCustom>
                                  <FormControl sx={{ width: '100px' }}>
                                    <div className={classes['input-number']}>
                                      <CurrencyNumberFormat
                                        propValue={(value) => {
                                          setValue(
                                            `items.${index}.price`,
                                            value as number
                                          )
                                          trigger(`items.${index}.price`)
                                        }}
                                        error={!!errors.items?.[index]?.price}
                                      />
                                    </div>
                                  </FormControl>
                                </Box>
                              )}
                            />
                            <Controller
                              control={control}
                              name={`items.${index}.quantity`}
                              render={() => (
                                <Box>
                                  <InputLabelCustom
                                    htmlFor="title"
                                    error={!!errors.items?.[index]?.quantity}
                                  >
                                    {t('quantity')}
                                  </InputLabelCustom>
                                  <FormControl sx={{ width: '100px' }}>
                                    <NumericFormat
                                      allowNegative={false}
                                      customInput={TextField}
                                      style={{ width: '100%' }}
                                      thousandSeparator
                                      isAllowed={(values) => {
                                        const { floatValue, formattedValue } =
                                          values
                                        if (!floatValue) {
                                          return formattedValue === ''
                                        }
                                        return floatValue <= 10000000
                                      }}
                                      className={classes['input-number']}
                                      error={!!errors.items?.[index]?.quantity}
                                      placeholder="0"
                                      onValueChange={(value) => {
                                        setValue(
                                          `items.${index}.quantity`,
                                          value.floatValue || 0
                                        )
                                        trigger(`items.${index}.quantity`)
                                      }}
                                    />
                                  </FormControl>
                                </Box>
                              )}
                            />
                            <IconButton
                              onClick={() => {
                                deleteItem(index)
                                remove(index)
                              }}
                              sx={{
                                borderRadius: '10px',
                                border: '1px solid #E1E6EF',
                                background: '#FFF',
                              }}
                            >
                              <Trash size={24} color="#BA2532" />
                            </IconButton>
                          </Stack>
                        </Stack>
                        <FormHelperText error={!!errors.items?.[index]?.price}>
                          {errors.items?.[index]?.price &&
                            `${errors.items?.[index]?.price?.message}`}
                        </FormHelperText>
                        <FormHelperText
                          error={!!errors.items?.[index]?.quantity}
                        >
                          {errors.items?.[index]?.quantity &&
                            `${errors.items?.[index]?.quantity?.message}`}
                        </FormHelperText>
                      </Box>
                    </>
                  )
                })
              )}
              <FormHelperText error={!!errors.items?.message}>
                {errors.items?.message && `${errors.items?.message}`}
              </FormHelperText>
            </Stack>
          </Grid>
          <Grid item xs={4}>
            <Typography
              sx={{
                color: '#000000',
                fontWeight: 700,
                fontSize: '12px',
              }}
              mb={2}
            >
              {t('externalSupplier')}
            </Typography>
            <Controller
              control={control}
              name="external_supplier"
              defaultValue=""
              render={({ field }) => (
                <Box>
                  <InputLabelCustom
                    htmlFor="title"
                    error={!!errors.external_supplier}
                  >
                    <RequiredLabel />
                    {t('externalSupplier')}
                    <Chip
                      icon={<Plus size={16} />}
                      onClick={() => {
                        setStateModalAddExternalSupplier(true)
                      }}
                      label={t('addNew')}
                      size="small"
                      sx={{ marginLeft: '10px' }}
                      // variant="outlined"
                    />
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <SelectCustom
                      {...field}
                      id="external_supplier"
                      displayEmpty
                      error={!!errors.external_supplier}
                      IconComponent={() => <KeyboardArrowDownIcon />}
                      open={openExternalSupplier}
                      onClick={() => {
                        setOpenExternalSupplier(!openExternalSupplier)
                      }}
                      renderValue={(value: any) => {
                        if (!value) {
                          return (
                            <PlaceholderSelect>
                              <div>{t('selectExternalSupplier')}</div>
                            </PlaceholderSelect>
                          )
                        }
                        return value.slice(value.indexOf('-') + 1, value.length)
                      }}
                      {...register('external_supplier')}
                      onChange={(e) => console.log(e)}
                    >
                      <InfiniteScrollSelect
                        propData={stateListExternalSupplier}
                        handleSearch={(value) => {
                          setStateListExternalSupplier({ data: [] })
                          handleGetExternalSupplier(value)
                        }}
                        fetchMore={(value) => {
                          fetchMoreDataExternalSupplier(value)
                        }}
                        onClickSelectItem={(item: any) => {
                          setValue(
                            'external_supplier',
                            `${item.id}-${item.name}`
                          )
                          clearErrors('external_supplier')
                          setOpenExternalSupplier(false)
                        }}
                        propsGetValue={String(getValues('external_supplier'))}
                      />
                    </SelectCustom>
                    <FormHelperText error={!!errors.external_supplier}>
                      {errors.external_supplier &&
                        `${errors.external_supplier.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />

            <Typography
              sx={{
                color: '#000000',
                fontWeight: 700,
                fontSize: '12px',
              }}
              mt={2}
              mb={2}
            >
              {t('orderInfo')}
            </Typography>
            <Controller
              control={control}
              name="code"
              render={({ field }) => (
                <Box>
                  <InputLabelCustom htmlFor="title" error={!!errors.code}>
                    {t('orderNumber')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="title"
                      error={!!errors.code}
                      {...field}
                    />
                    <FormHelperText error={!!errors.code}>
                      {errors.code && `${errors.code.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
            <Controller
              control={control}
              name="order_date"
              render={({ field }) => (
                <Box>
                  <InputLabelCustom htmlFor="title" error={!!errors.order_date}>
                    {t('orderDate')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        value={field.value}
                        onChange={(newValue: Moment | null) => {
                          setValue('order_date', moment.utc(newValue).format())
                        }}
                        renderInput={(params: any) => {
                          return (
                            <TextFieldCustom
                              {...params}
                              error={!!errors.order_date}
                              fullWidth
                            />
                          )
                        }}
                      />
                    </LocalizationProvider>
                    <FormHelperText error={!!errors.order_date}>
                      {errors.order_date && `${errors.order_date.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
            <Typography
              sx={{
                color: '#000000',
                fontWeight: 700,
                fontSize: '12px',
              }}
              mt={2}
              mb={2}
            >
              {t('deliveryInformation')}
            </Typography>
            <Stack
              mb={2}
              sx={{
                borderRadius: '5px',
                border: '1px solid #E1E6EF',
                padding: '15px',
              }}
              gap={1}
            >
              <Stack
                direction={'row'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Stack direction={'row'} alignItems={'center'}>
                  <Typography>{stateDefaultAddress?.name || 'N/A'}</Typography>
                  <DividerCustom />
                  <Typography>
                    {formatPhoneNumber(stateDefaultAddress?.phone_number || '')}
                  </Typography>
                </Stack>
                <Typography
                  sx={{
                    color: '#2F6FED',
                    textDecoration: 'underline',
                    fontSize: '1.6rem',
                    '&:hover': {
                      cursor: 'pointer',
                      opacity: '0.8',
                    },
                    textAlign: 'right',
                    paddingRight: '15px',
                  }}
                  onClick={() => {
                    if (!stateDefaultAddress) {
                      handleOpenCreateAddress()
                    } else {
                      handleDialogAddress()
                    }
                  }}
                >
                  {stateDefaultAddress ? (
                    <>{t('change')}</>
                  ) : (
                    <>{t('createAddress')}</>
                  )}
                  <PencilSimpleLine
                    size={18}
                    style={{
                      marginLeft: '5px',
                      position: 'relative',
                      top: '5px',
                    }}
                  />
                </Typography>
              </Stack>
              <Typography>{stateDefaultAddress?.address || 'N/A'}</Typography>
              <Stack direction={'row'} alignItems={'center'}>
                <Stack direction={'row'} alignItems={'center'} gap={1}>
                  <Typography>{t('state')}: </Typography>
                  <Typography>{stateDefaultAddress?.state || 'N/A'}</Typography>
                </Stack>
                <DividerCustom />
                <Stack direction={'row'} alignItems={'center'} gap={1}>
                  <Typography>{t('postal')}: </Typography>
                  <Typography>
                    {stateDefaultAddress?.postal_zipcode || 'N/A'}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction={'row'} alignItems={'center'} gap={1}>
                <Typography>{t('city')}: </Typography>
                <Typography>{stateDefaultAddress?.city || 'N/A'}</Typography>
              </Stack>
            </Stack>

            <Typography
              sx={{
                color: '#000000',
                fontWeight: 700,
                fontSize: '12px',
              }}
              mt={2}
              mb={2}
            >
              {t('noteForSupplier')}
            </Typography>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <Box>
                  <InputLabelCustom htmlFor="title" error={!!errors.notes}>
                    {t('notes')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <StyledTextarea
                      minRows={6}
                      placeholder={t('enterYourNote')}
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.value)
                      }}
                    />
                    <FormHelperText error={!!errors.notes}>
                      {errors.notes && `${errors.notes.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
          </Grid>
          <Grid item xs={3}>
            <Typography
              sx={{
                color: '#000000',
                fontWeight: 700,
                fontSize: '12px',
              }}
              mb={2}
            >
              {t('billingInfo')}
            </Typography>
            <Box mb={2}>
              <InputLabelCustom htmlFor="title">
                {t('subtotal')}
              </InputLabelCustom>
              <Typography>{formatMoney(totalPrice)}</Typography>
            </Box>

            {/* <Typography
              sx={{
                color: '#000000',
                fontWeight: 700,
                fontSize: '12px',
              }}
              mb={2}
              mt={2}
            >
              Order Info
            </Typography> */}
            <Controller
              control={control}
              defaultValue={0}
              name="discount_amount"
              render={() => (
                <Box>
                  <InputLabelCustom
                    htmlFor="title"
                    error={!!errors.discount_amount}
                  >
                    {t('discountAmount')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <div className={classes['input-number']}>
                      <CurrencyNumberFormat
                        propValue={(value) => {
                          setValue(`discount_amount`, Number(value))
                          trigger(`discount_amount`)
                        }}
                        error={!!errors.discount_amount}
                      />
                    </div>
                    <FormHelperText error={!!errors.discount_amount}>
                      {errors.discount_amount &&
                        `${errors.discount_amount.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />
            <Controller
              control={control}
              name="tax_amount"
              render={() => (
                <Box>
                  <InputLabelCustom htmlFor="title" error={!!errors.tax_amount}>
                    {t('taxAmount')}
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <div className={classes['input-number']}>
                      <CurrencyNumberFormat
                        propValue={(value) => {
                          setValue(`tax_amount`, Number(value))
                          trigger(`tax_amount`)
                        }}
                        error={!!errors.tax_amount}
                      />
                    </div>
                    <FormHelperText error={!!errors.tax_amount}>
                      {errors.tax_amount && `${errors.tax_amount.message}`}
                    </FormHelperText>
                  </FormControl>
                </Box>
              )}
            />

            <Box mt={2}>
              <InputLabelCustom htmlFor="title">
                {t('totalAmount')}
              </InputLabelCustom>
              <Typography>{formatMoney(totalAmount || '0')}</Typography>
            </Box>
          </Grid>
        </Grid>
        <Stack
          direction="row"
          spacing={2}
          alignItems={'center'}
          justifyContent={'flex-end'}
        >
          <Link
            href={`/${platform().toLowerCase()}/account-payable/external-order/list`}
          >
            <a>
              <ButtonCancel variant="outlined" size="large">
                {t('cancel')}
              </ButtonCancel>
            </a>
          </Link>
          <ButtonCustom variant="contained" type="submit" size="large">
            {t('submit')}
          </ButtonCustom>
        </Stack>
      </form>

      <Drawer
        anchor="right"
        open={stateOpenDialogAddress}
        onClose={handleCloseDialog}
      >
        <DialogTitleTws
          sx={{
            justifyContent: 'space-between',
            padding: '25px 30px',
            fontSize: '2.4rem',
            fontWeight: 700,
            color: '#49516F',
          }}
        >
          <Stack direction="row">
            {stateDialogAddress !== 'default' ? (
              <IconButton onClick={handleBackToDefaultDialog}>
                <ArrowLeft size={24} />
              </IconButton>
            ) : (
              <IconButton onClick={handleCloseDialog}>
                <ArrowRight size={24} />
              </IconButton>
            )}
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {stateDialogAddress === 'default'
                ? t('addressBook')
                : stateDialogAddress === 'create'
                ? t('createAddress')
                : t('updateAddress')}
            </TypographyH2>
          </Stack>
        </DialogTitleTws>

        {stateDialogAddress === 'default' ? (
          <>
            <DialogContentTws
              sx={{
                padding: '0 20px',
                justifyItems: 'center',
                width: '100%',
                marginBottom: '20px',
              }}
            >
              <DialogContentTextTws />
              <InfiniteScroll
                dataLength={stateListAddress?.data.length}
                next={fetchMoreData}
                hasMore={hasMore}
                height="calc(100vh - 237px)"
                loader={
                  <LinearProgress
                    style={{
                      marginBottom: '20px',
                      width: '100%',
                    }}
                  />
                }
              >
                {stateListAddress?.data?.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      borderRadius: '10px',
                      padding: '15px',
                      backgroundColor: '#F8F9FC',
                    }}
                    mb={2}
                  >
                    <Stack
                      direction="row"
                      spacing={2}
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Radio
                          checked={stateSelectedValue === item.id}
                          onChange={() => handleChangeRadio(item)}
                          value={item.id}
                          name={item.name}
                          inputProps={{ 'aria-label': item.name }}
                          color="primary"
                          sx={{
                            color: theme.palette.primary.main,
                            padding: '0px',
                          }}
                        />
                        <Typography
                          textAlign="center"
                          sx={{
                            fontSize: '1.6rem',
                            color: '#3F444D',
                            alignItems: 'center',
                          }}
                        >
                          {' '}
                          {item.name}
                        </Typography>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        // sx={{ marginBottom: '15px' }}
                      >
                        {item.default_address ? (
                          <>
                            <CircleWavyCheck
                              color={theme.palette.primary.main}
                              size={24}
                              weight="duotone"
                            />
                            <ButtonCustom
                              variant="contained"
                              size="small"
                              sx={{
                                fontSize: '1.4rem',
                                gap: '8px',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                height: '25px',
                              }}
                            >
                              {t('default')}
                            </ButtonCustom>
                          </>
                        ) : (
                          <></>
                        )}
                        <IconButton
                          onClick={() => (
                            updateAddress(item), setStateDialogAddress('update')
                          )}
                        >
                          <NotePencil
                            size={24}
                            color="#49516F"
                            weight="duotone"
                          />
                        </IconButton>
                      </Stack>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ padding: '15px 0px' }}
                      alignItems="center"
                    >
                      <Typography sx={{ color: '#3F444D', fontWeight: '400' }}>
                        {item.receiver_name}
                      </Typography>
                      <Divider
                        orientation="vertical"
                        variant="middle"
                        flexItem
                        sx={{
                          // height: '1.4rem',
                          marginTop: '3px !important',
                          marginBottom: '3px !important',
                          borderColor: '#3F444D',
                          border: '1px line #3F444D',
                        }}
                      />
                      <Typography
                        sx={{
                          color: '#3F444D',
                          fontWeight: '400',
                          fontSize: '1.4rem',
                        }}
                      >
                        {formatPhoneNumber(item.phone_number)}
                      </Typography>
                    </Stack>
                    <Typography sx={{ color: '#3F444D', fontWeight: '400' }}>
                      {item.address}
                    </Typography>
                  </Box>
                ))}
              </InfiniteScroll>

              <Grid xs={12} spacing={2}>
                <Button
                  sx={{
                    border: `1px dashed ${theme.palette.primary.main}`,
                    borderRadius: '10px',
                    // marginBottom: '35px',
                    alignItems: 'center',
                    height: '50px',
                    width: '100%',
                    backgroundColor: '#F8F9FC',
                    justifyContent: 'space-between',
                  }}
                  onClick={() => setStateDialogAddress('create')}
                >
                  <Typography
                    sx={{
                      fontSize: '1.6rem',
                      fontWeight: 600,
                      color: theme.palette.primary.main,
                    }}
                  >
                    {t('addNewAddress')}
                  </Typography>
                  <PlusCircle size={25} color={theme.palette.primary.main} />
                </Button>
              </Grid>
            </DialogContentTws>
            <DialogActionsTws sx={{ padding: '0 30px 25px 30px' }}>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="flex-end"
                sx={{ width: '100%' }}
              >
                <ButtonCancel
                  onClick={handleCloseDialog}
                  variant="outlined"
                  size="large"
                >
                  {t('cancel')}
                </ButtonCancel>
                <ButtonCustom
                  variant="contained"
                  disabled={stateListAddress?.data?.length === 0}
                  onClick={() => handleConfirmAddress()}
                  size="large"
                >
                  {t('confirm')}
                </ButtonCustom>
              </Stack>
            </DialogActionsTws>
          </>
        ) : stateDialogAddress === 'create' ||
          stateDialogAddress === 'update' ? (
          <>
            <DialogContentTws
              sx={{
                padding: '0 30px',
                justifyItems: 'center',
                width: '100%',
                // marginBottom: '20px',
              }}
            >
              <form onSubmit={handleSubmitAddress(onSubmitAddress)}>
                <Stack
                  sx={{
                    width: '100%',
                    borderRadius: '10px',
                    marginBottom: '35px',
                  }}
                  spacing={2}
                >
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="name"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="name"
                            error={!!errorsAddress.name}
                          >
                            <RequiredLabel />
                            {t('addressName')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              placeholder={t('addressName')}
                              id="name"
                              error={!!errorsAddress.name}
                              {...field}
                            />
                            <FormHelperText error={!!errorsAddress.name}>
                              {errorsAddress.name &&
                                `${errorsAddress.name.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="receiver_name"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="receiver_name"
                            error={!!errorsAddress.receiver_name}
                          >
                            <RequiredLabel />
                            {t('receiverName')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              placeholder={t('receiverName')}
                              id="receiver_name"
                              error={!!errorsAddress.receiver_name}
                              {...field}
                            />
                            <FormHelperText
                              error={!!errorsAddress.receiver_name}
                            >
                              {errorsAddress.receiver_name &&
                                `${errorsAddress.receiver_name.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="phone_number"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="phone_number"
                            error={!!errorsAddress.phone_number}
                          >
                            <RequiredLabel />
                            {t('phoneNumber')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <div className="input-number">
                              <PatternFormat
                                placeholder="(xxx) xxx xxxx "
                                id="phone_number"
                                customInput={TextField}
                                {...field}
                                error={!!errorsAddress.phone_number}
                                format="(###) ### ####"
                              />
                            </div>
                            <FormHelperText
                              error={!!errorsAddress.phone_number}
                            >
                              {errorsAddress.phone_number &&
                                `${errorsAddress.phone_number.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="address"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="address"
                            error={!!errorsAddress.address}
                          >
                            <RequiredLabel />
                            {t('address')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              placeholder={t('address')}
                              id="address"
                              multiline
                              rows={6}
                              error={!!errorsAddress.address}
                              {...field}
                            />
                            <FormHelperText error={!!errorsAddress.address}>
                              {errorsAddress.address &&
                                `${errorsAddress.address.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="city"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="city"
                            error={!!errorsAddress.city}
                          >
                            <RequiredLabel />
                            {t('city')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="city"
                              error={!!errorsAddress.city}
                              {...field}
                            />
                            <FormHelperText error={!!errorsAddress.city}>
                              {errorsAddress.city &&
                                `${errorsAddress.city.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="state"
                      render={() => (
                        <>
                          <InputLabelCustom
                            htmlFor="state"
                            error={!!errorsAddress.state?.name}
                          >
                            <RequiredLabel />
                            {t('state')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <Autocomplete
                              getOptionLabel={(option) => option.name}
                              options={dataState}
                              value={valueInput}
                              renderInput={(params) => (
                                <TextFieldCustom
                                  error={!!errorsAddress.state?.name}
                                  {...(params as any)}
                                />
                              )}
                              onChange={(_, newValue) => {
                                if (newValue) {
                                  setValueAddress('state', newValue)
                                  setValueInput(newValue)
                                } else {
                                  setValueAddress('state', {
                                    name: '',
                                    abbreviation: '',
                                  })
                                  setValueInput({
                                    name: '',
                                    abbreviation: '',
                                  })
                                }
                                triggerAddress('state')
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root .MuiAutocomplete-input':
                                  {
                                    padding: '1px 5px',
                                  },
                              }}
                            />
                            <FormHelperText error={!!errorsAddress.state?.name}>
                              {errorsAddress.state?.name &&
                                `${errorsAddress.state?.name?.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  <Box>
                    <Controller
                      control={controlAddress}
                      name="postal_zipcode"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="postal_zipcode"
                            error={!!errorsAddress.postal_zipcode}
                          >
                            <RequiredLabel />
                            {t('postalZipcode')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="postal_zipcode"
                              error={!!errorsAddress.postal_zipcode}
                              {...field}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setValueAddress(
                                  'postal_zipcode',
                                  e.target.value
                                )
                                triggerAddress('postal_zipcode')
                              }}
                            />
                            <FormHelperText
                              error={!!errorsAddress.postal_zipcode}
                            >
                              {errorsAddress.postal_zipcode &&
                                `${errorsAddress.postal_zipcode.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                </Stack>
              </form>
            </DialogContentTws>
            <DialogActionsTws sx={{ padding: '0 30px 25px 30px' }}>
              <Stack
                spacing={2}
                direction="row"
                justifyContent="flex-end"
                sx={{ width: '100%' }}
              >
                <ButtonCancel
                  onClick={handleCloseDialog}
                  variant="outlined"
                  size="large"
                >
                  {t('cancel')}
                </ButtonCancel>
                <ButtonCustom
                  variant="contained"
                  onClick={handleSubmitAddress(onSubmitAddress)}
                  size="large"
                >
                  {t('confirm')}
                </ButtonCustom>
              </Stack>
            </DialogActionsTws>
          </>
        ) : (
          <></>
        )}
      </Drawer>
      <Drawer
        anchor="right"
        open={stateModalAddExternalSupplier}
        onClose={handleCancel}
      >
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
                {t('CreateExternalOrder')}
              </Typography>
            </Stack>
            <form
              onSubmit={handleSubmitExternalSupplier(
                onSubmitCreateExternalSupplier
              )}
            >
              <Box mb={2}>
                <Grid2 container spacing={2}>
                  <Grid2 xs>
                    <Controller
                      control={controlExternalSupplier}
                      defaultValue=""
                      name="name"
                      render={({ field }) => (
                        <Box>
                          <InputLabelCustom
                            htmlFor="name"
                            error={!!errorsExternalSupplier.name}
                          >
                            <RequiredLabel />
                            {t('businessName')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="name"
                              error={!!errorsExternalSupplier.name}
                              placeholder={t('businessName')}
                              {...field}
                            />
                            <FormHelperText
                              error={!!errorsExternalSupplier.name}
                            >
                              {errorsExternalSupplier.name &&
                                `${errorsExternalSupplier.name.message}`}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid2>
                </Grid2>
                <Grid2 container spacing={2}>
                  <Grid2 xs>
                    <Controller
                      control={controlExternalSupplier}
                      name="email"
                      render={({ field }) => (
                        <Box>
                          <InputLabelCustom
                            htmlFor="email"
                            error={!!errorsExternalSupplier.email}
                          >
                            {t('email')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="email"
                              error={!!errorsExternalSupplier.email}
                              placeholder={t('email')}
                              {...field}
                            />
                            <FormHelperText
                              error={!!errorsExternalSupplier.email}
                            >
                              {errorsExternalSupplier.email &&
                                `${errorsExternalSupplier.email.message}`}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid2>
                </Grid2>
                <Grid2 container spacing={2}>
                  <Grid2 xs>
                    <Controller
                      control={controlExternalSupplier}
                      defaultValue=""
                      name="phone_number"
                      render={({ field }) => (
                        <Box>
                          <InputLabelCustom
                            htmlFor="phone_number"
                            error={!!errorsExternalSupplier.phone_number}
                          >
                            {t('phoneNumber')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <PatternFormat
                              placeholder="(xxx) xxx xxxx "
                              id="phone_number"
                              customInput={TextFieldCustom}
                              {...field}
                              error={!!errorsExternalSupplier.phone_number}
                              format="(###) ### ####"
                            />
                            <FormHelperText
                              error={!!errorsExternalSupplier.phone_number}
                            >
                              {errorsExternalSupplier.phone_number &&
                                `${errorsExternalSupplier.phone_number.message}`}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid2>
                </Grid2>
                <Grid2 container spacing={2}>
                  <Grid2 xs>
                    <Controller
                      control={controlExternalSupplier}
                      defaultValue=""
                      name="address"
                      render={({ field }) => (
                        <Box>
                          <InputLabelCustom
                            htmlFor="address"
                            error={!!errorsExternalSupplier.address}
                          >
                            {t('streetAddress')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="address"
                              error={!!errorsExternalSupplier.address}
                              placeholder={t('streetAddress')}
                              {...field}
                            />
                            <FormHelperText
                              error={!!errorsExternalSupplier.address}
                            >
                              {errorsExternalSupplier.address &&
                                `${errorsExternalSupplier.address.message}`}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid2>
                </Grid2>
                <Grid2 container spacing={2}>
                  <Grid2 xs>
                    <Controller
                      control={controlExternalSupplier}
                      defaultValue=""
                      name="city"
                      render={({ field }) => (
                        <Box>
                          <InputLabelCustom
                            htmlFor="city"
                            error={!!errorsExternalSupplier.city}
                          >
                            {t('city')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="city"
                              error={!!errorsExternalSupplier.city}
                              placeholder={t('city')}
                              {...field}
                            />
                            <FormHelperText
                              error={!!errorsExternalSupplier.city}
                            >
                              {errorsExternalSupplier.city &&
                                `${errorsExternalSupplier.city.message}`}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid2>
                </Grid2>
                <Grid2 container spacing={2}>
                  <Grid2 xs>
                    <Controller
                      control={controlExternalSupplier}
                      name="state"
                      render={({ field: { value } }) => (
                        <Box>
                          <InputLabelCustom
                            htmlFor="state"
                            error={!!errorsExternalSupplier.state}
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
                                  error={!!errorsExternalSupplier.state?.name}
                                  {...(params as any)}
                                />
                              )}
                              onChange={(_, newValue) => {
                                console.log('event', newValue)
                                if (newValue) {
                                  setValueExternalSupplier('state', newValue)
                                } else {
                                  setValueExternalSupplier('state', {
                                    name: '',
                                    abbreviation: '',
                                  })
                                }
                                triggerExternalSupplier('state')
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root .MuiAutocomplete-input':
                                  {
                                    padding: '1px 5px',
                                  },
                              }}
                            />
                            <FormHelperText
                              error={!!errorsExternalSupplier.state?.name}
                            >
                              {errorsExternalSupplier.state?.name &&
                                `${errorsExternalSupplier.state?.name?.message}`}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid2>
                </Grid2>
                <Grid2 container spacing={2}>
                  <Grid2 xs>
                    <Controller
                      control={controlExternalSupplier}
                      defaultValue=""
                      name="postal_zipcode"
                      render={({ field }) => (
                        <Box>
                          <InputLabelCustom
                            htmlFor="postal_zipcode"
                            error={!!errorsExternalSupplier.postal_zipcode}
                          >
                            {t('postalZipcode')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="postal_zipcode"
                              placeholder={t('postalZipcode')}
                              error={!!errorsExternalSupplier.postal_zipcode}
                              {...field}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setValueExternalSupplier(
                                  'postal_zipcode',
                                  e.target.value
                                )
                                triggerExternalSupplier('postal_zipcode')
                              }}
                            />
                            <FormHelperText
                              error={!!errorsExternalSupplier.postal_zipcode}
                            >
                              {errorsExternalSupplier.postal_zipcode &&
                                `${errorsExternalSupplier.postal_zipcode.message}`}
                            </FormHelperText>
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid2>
                </Grid2>
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
      <ProductsExisting
        setStateProductSelect={setStateProductSelect}
        stateProductSelect={stateProductSelect}
        onClose={setStateDrawerSelectProduct}
        open={stateDrawerSelectProduct}
        setValue={setValue}
        getValues={getValues}
        append={append}
      />
    </>
  )
}

export default CreateExternalOrderComponent
