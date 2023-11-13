import {
  Autocomplete,
  Box,
  Breadcrumbs,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableHead,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/system'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  addNewVariantToProduct,
  getAttribute,
  getDistribution,
  getProductDetail,
  getWareHouse,
  getWarehouseforFilter,
  setRetailPriceAPI,
  updateAttribute,
} from './apiProductDetail'
import {
  AddNewOptionType,
  AttributeDetailType,
  AttributeWithOptionType,
  CreateVariantType,
  DistributionType,
  OptionNameType,
  ProductDetailType,
  RetailPriceDataType,
  SubmitAddNewProductVariantType,
  SubmitUpdateAttributeType,
  WarehouseAdjustInstockTypeResponseType,
  WarehouseListDataResponseType,
} from './modelProductDetail'

import Link from 'next/link'
import {
  ButtonCancel,
  ButtonCustom,
  InfiniteScrollSelectMultiple,
  InputLabelCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldCustom,
} from 'src/components'

// form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import {
  retailSchema,
  schemaAddNewVariant,
  schemaFilter,
  schemaUpdateAttribute,
} from './validations'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  ArrowRight,
  NotePencil,
  PencilSimple,
  Plus,
  PlusCircle,
  Trash,
  WarningCircle,
} from '@phosphor-icons/react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  checkPermission,
  handlerGetErrMessage,
  hasSpecialCharacterPrice,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
  platform,
} from 'src/utils/global.utils'
import classes from './styles.module.scss'

import dayjs from 'dayjs'
import { NumericFormat } from 'react-number-format'
import CurrencyNumberFormat from 'src/components/CurrencyNumberFormat'
import RequiredLabel from 'src/components/requiredLabel'
import UploadImage from 'src/components/uploadImage'
import UploadList from 'src/components/uploadList'
import { formatMoney } from 'src/utils/money.utils'
import { useTranslation } from 'react-i18next'
const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2.4rem',
  fontWeight: '700',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
  marginBottom: '30px',
}))
const TypographyHeading = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
  paddingBottom: '10px',
  borderBottom: '1px solid #E1E6EF',
}))
const TypographyCustom = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))

const TypographyInformation = styled(Typography)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: '500',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#1B1F27',
}))

const CustomBox = styled(Box)(({ theme }) => ({
  // background: '#F8F9FC',
  padding: '15px',
  borderRadius: '5px',
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
}))

const CustomStack = styled(Stack)(() => ({
  background: '#F8F9FC',
  marginTop: '0px !important',
  padding: '15px',
  borderRadius: '5px',
}))

const InputLabelCustomModal = styled(InputLabelCustom)(() => ({
  fontSize: '1.4rem !important',
}))
const CustomBoxForDrawer = styled(Box)(({ theme }) => ({
  padding: '15px',
  background: '#FFFF',
  borderRadius: '10px',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.12)' : '#fff',
}))

const ProductDetailComponent = () => {
  const { t } = useTranslation('product')
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const [stateProductDetail, setStateProductDetail] =
    useState<ProductDetailType>()

  const [stateOpenDialog, setStateOpenDialog] = useState(false)

  // state used for enhance adjust in stock

  const [stateWarehouseAdjust, setStateWarehouseAdjust] =
    useState<WarehouseAdjustInstockTypeResponseType>()
  const [stateRowPerPage, setStateRowPerPage] = useState(10)
  const [statePage, setStatePage] = useState(1)
  const [stateListDistribution, setStateListDistribution] = useState<
    DistributionType[]
  >([])
  //state used for view stock transaction
  // const [stateTransaction, setStateTransaction] =
  //   useState<StockTransactionResponseType>()
  // state used for get quantity of product in specific warehouse

  const [stateDrawerAddNewVariant, setStateDrawerAddNewVariant] =
    useState(false)
  const [
    stateDrawerUpdateAttributeOption,
    setStateDrawerUpdateAttributeOption,
  ] = useState(false)
  //state filter
  const [stateCurrentAttribute, setStateCurrentAttribute] =
    useState<AttributeDetailType>()
  const reasonFilter = useMemo(
    () => [
      {
        id: 1,
        name: t('details.sold'),
      },
      {
        id: 2,
        name: t('details.restocked'),
      },
      {
        id: 3,
        name: t('details.returned'),
      },
      {
        id: 4,
        name: t('details.bought'),
      },
      {
        id: 5,
        name: t('details.other'),
      },
    ],
    [t]
  )

  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)
  const [stateListWarehouse, setStateListWarehouse] =
    useState<WarehouseListDataResponseType>({
      data: [],
    })
  // const [stateFilter, setStateFilter] = useState<number>(0)

  const openFilter = Boolean(anchorFilter)

  // const handleOpenMenuFilter = (event: React.MouseEvent<HTMLElement>) => {
  //   handleGetListWarehouse('')
  //   setAnchorFilter(event.currentTarget)
  // }

  const handleCloseMenuFilter = () => {
    setAnchorFilter(null)
  }

  const handleGetListWarehouse = (value: string | null) => {
    getWarehouseforFilter(1, { name: value ? value : null })
      .then((res) => {
        const data = res.data
        console.log('hahah', data)
        setStateListWarehouse(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    handleGetListWarehouse(null)
  }, [])
  const fetchMoreDataWarehouse = useCallback(
    (value: { page: number; name: string }) => {
      getWarehouseforFilter(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListWarehouse((prev: any) => {
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

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setStateListWarehouse]
  )

  const onSubmitFilter = (values: any) => {
    console.log('type', values.brand)

    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          warehouse: values.warehouse.toString(),
          reason: values.reason.toString(),
          from_date: values.from_date,
          to_date: values.to_date,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  const handleReset = () => {
    resetFilter({
      warehouse: [],
      reason: [],
      from_date: null,
      to_date: null,
    })
    // setStateFilter(0)

    router.replace(
      {
        search: `${objToStringParam({
          id: router.query.id,
          warehouse: '',
          from_date: '',
          to_date: '',
          reason: '',
          page: 1,
          limit: router.query.limit,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  // const handleChangeRowsPerPage = (event: any) => {
  //   router.replace(
  //     {
  //       search: `${objToStringParam({
  //         ...router.query,
  //         limit: Number(event.target.value),
  //         page: 1,
  //       })}`,
  //     },
  //     undefined,
  //     { scroll: false }
  //   )
  // }
  // const handleChangePagination = (event: any, page: number) => {
  //   console.log(event)
  //   router.replace(
  //     {
  //       search: `${objToStringParam({
  //         ...router.query,
  //         page: page,
  //       })}`,
  //     },
  //     undefined,
  //     { scroll: false }
  //   )
  // }

  const {
    handleSubmit: handleSubmitAddNewVariant,
    control: controlAddNewVariant,
    setValue: setValueAddNewVariant,
    register: registerVariant,
    watch: watchVariant,
    trigger: triggerVariant,
    reset: resetVariant,
    // getValues: getValuesAddNewVariant,
    // reset: resetAddNewVariant,
    formState: { errors: errorsAddNewVariant },
  } = useForm<AddNewOptionType>({
    resolver: yupResolver(schemaAddNewVariant(t)),
    mode: 'all',
    reValidateMode: 'onSubmit',
    defaultValues: {
      images: [],
      distribution_channel: [{ id: 0, price: 0 }],
    },
  })
  const {
    handleSubmit: handleSubmitUpdateAttribute,
    control: controlSubmitUpdateAttribute,
    register: registerUpdateAttribute,
    setValue: setValueUpdateAttribute,
    formState: { errors: errorsUpdateAttribute },
  } = useForm<SubmitUpdateAttributeType>({
    resolver: yupResolver(schemaUpdateAttribute(t)),
    mode: 'all',
  })

  const onSubmitAddNewVariant = (value: AddNewOptionType) => {
    if (value.images.length > 10) {
      pushMessage(
        t('productTemplate.message.maximumNumberOfImagesAllow_10'),
        'error'
      )
      return
    }
    if (value.images.length > 0 && value.images.some((item) => !item)) {
      pushMessage(
        t('productTemplate.message.pleaseRemoveImagesInvalid'),
        'error'
      )
      return
    }
    const submitAttributeWithOption: AttributeWithOptionType[] =
      value.option_array.map(({ name, option }) => ({
        name,
        option,
      }))
    let arrWarehouse: any = []
    arrWarehouse = value.warehouses.map((item, index) => {
      return {
        warehouse: stateListWarehouse.data[index].id,
        quantity: item.quantity ? Number(item.quantity) : 0,
      }
    })
    // value.warehouses = value.warehouses.filter((item) => item.quantity !== null)
    const submitOption: CreateVariantType = {
      options: submitAttributeWithOption,

      thumbnail: value.thumbnail,
      images: value.images,
      distribution_channel: value.distribution_channel,
      warehouses: arrWarehouse,
    }
    const submitVariant: SubmitAddNewProductVariantType = {
      product: Number(router.query.id),
      variant: submitOption,
    }
    addNewVariantToProduct(submitVariant)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t('productTemplate.message.createProductVariantSuccessfully'),
          'success'
        )
        resetVariant()
        setStateDrawerAddNewVariant(false)
        handleGetAttributeOption()

        handleGetProductDetail()
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.data

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const { fields } = useFieldArray({
    control: controlAddNewVariant,
    name: 'option_array',
  })
  const {
    fields: fieldsDistributtion,
    append,
    remove,
  } = useFieldArray({
    control: controlAddNewVariant,
    name: 'distribution_channel',
  })
  //Dialog setRetail Price

  const {
    handleSubmit: handleSubmitRetail,
    control: controlRetail,
    setValue: setValueRetail,
    formState: { errors: errorsRetail },
    clearErrors: clearErrorsRetail,
  } = useForm<RetailPriceDataType>({
    resolver: yupResolver(retailSchema(t)),
    mode: 'all',
  })

  const onSubmitRetail = (values: RetailPriceDataType) => {
    setRetailPriceAPI(router?.query?.id, values)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        // detailOrder()
        pushMessage(
          t(
            'productTemplate.message.theProductRetailPriceHasBeenUpdatedSuccessfully'
          ),
          'success'
        )
        handleGetProductDetail()
        handleDialogSetRetail()
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  //search

  // const handleIdQuery = (value: string | null) => {
  //   if (!value) return
  //   const newArr = value
  //     .split(',')
  //     .map(function (item: string) {
  //       return item.slice(0, item.indexOf('-'))
  //     })
  //     .toString()
  //   return newArr
  // }

  // const handleGetTransaction = (id: any, query?: any) => {
  //   dispatch(loadingActions.doLoading())
  //   if (query) {
  //     query.warehouse = handleIdQuery(query.warehouse)
  //     getTransaction(id, query)
  //       .then((res) => {
  //         const { data } = res
  //         setStateTransaction(data)
  //         dispatch(loadingActions.doLoadingSuccess())
  //       })
  //       .catch(({ response }) => {
  //         const { status, data } = response
  //         dispatch(loadingActions.doLoadingFailure())
  //         pushMessage(handlerGetErrMessage(status, data), 'error')
  //       })
  //   } else {
  //     getTransaction(id)
  //       .then((res) => {
  //         const { data } = res
  //         setStateTransaction(data)
  //         dispatch(loadingActions.doLoadingSuccess())
  //       })
  //       .catch(({ response }) => {
  //         const { status, data } = response
  //         dispatch(loadingActions.doLoadingFailure())
  //         pushMessage(handlerGetErrMessage(status, data), 'error')
  //       })
  //   }
  // }

  const handleGetProductDetail = useCallback(() => {
    dispatch(loadingActions.doLoading())
    getProductDetail(router?.query?.id)
      .then((res) => {
        const { data } = res.data

        setStateProductDetail(data)
        // setIsAddWishList(data?.is_favorite ? data?.is_favorite : false)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        if (status === 404) {
          router.push('/404')
        }
      })
  }, [router.query])

  const handleDialogSetRetail = () => {
    setValueRetail(
      'retail_price',
      Number(stateProductDetail?.new_information_product.retail_price)
    )
    setStateOpenDialog(!stateOpenDialog)
    clearErrorsRetail('retail_price')
  }

  //Filter
  const handleOpenDrawerAttribute = (value: AttributeDetailType) => {
    setValueUpdateAttribute('name', value.name)
    setStateCurrentAttribute(value)
    setStateDrawerUpdateAttributeOption(true)
  }
  const {
    handleSubmit: handleSubmitFilter,
    control: controlFilter,
    setValue: setValueFilter,
    getValues: getValuesFilter,
    reset: resetFilter,
    clearErrors: clearErrorsFilter,
    formState: { errors: errorsFilter },
  } = useForm({
    resolver: yupResolver(schemaFilter(t)),
    mode: 'all',
  })
  const handleGetAttributeOption = () => {
    getAttribute(Number(router.query.id))
      .then((res) => {
        const { data } = res
        console.log('attribute', data.data)
        const generateAtribute: OptionNameType[] = []
        data.data.forEach((item) => {
          const newAttribute: OptionNameType = {
            option: '',
            name: item.name,
            options: item.options,
          }
          generateAtribute.push(newAttribute)
          setValueAddNewVariant('option_array', generateAtribute)
        })
        console.log(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    if (router.query.id) {
      handleGetProductDetail()

      // const dataHolding = {
      //   from_date: '',
      //   to_date: '',
      //   warehouse: '',
      //   reason: '',
      // }
      // let count = 0
      // for (const i in router.query) {
      //   // eslint-disable-next-line no-prototype-builtins
      //   if (dataHolding.hasOwnProperty(i)) {
      //     // ;(DataHolding as any)[i] = router.query[i]
      //     count++
      //   }
      // }
      // setValueFilter('from_date', router?.query?.from_date)
      // setValueFilter('to_date', router?.query?.to_date)
      // if (
      //   router?.query?.warehouse &&
      //   typeof router?.query?.warehouse === 'string'
      // ) {
      //   setValueFilter('warehouse', router?.query?.warehouse.split(','))
      // }

      // if (router?.query?.reason && typeof router?.query?.reason === 'string') {
      //   setValueFilter('reason', router?.query?.reason.split(','))
      // }
      // setStateFilter(count)

      getWareHouse()
        .then((res) => {
          const { data } = res

          setStateWarehouseAdjust(data)
          console.log(data)
        })
        .catch(({ response }) => {
          const { status, data } = response
          setStateListDistribution(data)

          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      getDistribution()
        .then((res) => {
          const { data } = res.data
          setStateListDistribution(data)
          setValueAddNewVariant('distribution_channel.0.id', data[0].id)
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      // waiting for remaster api
      // if (router.asPath.length !== router.pathname.length) {
      //   if (!isEmptyObject(router.query)) {
      //     handleGetTransaction(router.query.id, router.query)
      //   }
      // } else {
      //   handleGetTransaction(router.query.id)
      // }
      handleGetAttributeOption()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, dispatch])

  const onError = (err: any) => {
    console.log('err', err)
  }
  const onSubmitAttribute = (value: SubmitUpdateAttributeType) => {
    console.log('value', value)
    if (!stateCurrentAttribute) return
    dispatch(loadingActions.doLoading())
    updateAttribute(Number(stateCurrentAttribute.id), value)
      .then(() => {
        handleGetProductDetail()
        setStateDrawerUpdateAttributeOption(false)
        pushMessage(
          t('productTemplate.message.updateAttributeSuccessfully'),
          'success'
        )
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  const onErrAttribute = (err: any) => {
    console.log('err', err)
  }
  const handleChangeRowsPerPage = (event: any) => {
    setStateRowPerPage(Number(event.target.value))
  }
  const handleChangePagination = (e: any, page: number) => {
    console.log(e)
    setStatePage(page)
  }
  const handleOnCloseDrawerAddNewVariant = () => {
    setStateDrawerAddNewVariant(false)
    resetVariant()
  }

  return (
    <>
      {stateProductDetail ? (
        <Breadcrumbs
          separator=">"
          aria-label="breadcrumb"
          sx={{ marginBottom: '15px' }}
        >
          <Link href={`/${platform().toLowerCase()}/inventory/product/list`}>
            <a>{t('productTemplate.productManagement')}</a>
          </Link>
          <Typography>{stateProductDetail.name}</Typography>
        </Breadcrumbs>
      ) : (
        <Skeleton
          sx={{ marginBottom: '15px' }}
          variant="rectangular"
          width="500px"
          height={16}
        />
      )}
      <Stack direction="row" justifyContent="flex-end" spacing={2} mb={2}>
        {stateProductDetail?.is_owner && (
          <>
            {checkPermission(
              arrayPermission,
              KEY_MODULE.Inventory,
              platform() === 'RETAILER'
                ? PERMISSION_RULE.MerchantUpdate
                : PERMISSION_RULE.SupplierCreate
            )}
            <Link
              href={`/${platform().toLowerCase()}/inventory/product/update/${
                router.query.id
              }`}
            >
              <ButtonCustom
                variant="outlined"
                size="small"
                startIcon={<PencilSimple size={20} />}
              >
                {t('productTemplate.updateDetails')}
              </ButtonCustom>
            </Link>
          </>
        )}
        {/* <ButtonCustom
          variant="outlined"
          size="small"
          startIcon={<PlusCircle size={20} />}
          onClick={() => {
            setStateDrawerAddOption(true)
          }}
        >
          Add new variant
        </ButtonCustom> */}
      </Stack>
      {stateProductDetail ? (
        <CustomBox mb={2}>
          <TypographyHeading sx={{ marginBottom: '16px' }}>
            {t('productTemplate.thumbnail')}
          </TypographyHeading>
          <Box sx={{ cursor: 'pointer' }}>
            <PhotoProvider maskOpacity={0.5}>
              <PhotoView
                src={
                  stateProductDetail.thumbnail
                    ? stateProductDetail.thumbnail
                    : '/' + '/images/vapeProduct.png'
                }
              >
                <Image
                  alt="image"
                  src={
                    stateProductDetail.thumbnail
                      ? stateProductDetail.thumbnail
                      : '/' + '/images/vapeProduct.png'
                  }
                  width={100}
                  height={100}
                />
              </PhotoView>
            </PhotoProvider>
          </Box>
        </CustomBox>
      ) : (
        <Skeleton
          sx={{ marginBottom: '15px' }}
          variant="rectangular"
          width="100%"
          height="155px"
        />
      )}

      {stateProductDetail ? (
        <CustomBox mb={2}>
          <TypographyHeading sx={{ marginBottom: '16px' }}>
            {t('productTemplate.images')}
          </TypographyHeading>
          <PhotoProvider maskOpacity={0.5}>
            <Stack direction="row" spacing={2}>
              {stateProductDetail.images.length === 0 ? (
                <Box sx={{ cursor: 'pointer' }}>
                  <PhotoView src={'/images/default-brand.png'}>
                    <Image
                      alt="image"
                      src={'/' + '/images/default-brand.png'}
                      width={100}
                      height={100}
                    />
                  </PhotoView>
                </Box>
              ) : (
                stateProductDetail.images.map((item, index) => {
                  return (
                    // <Box key={index + Math.random()}>
                    //   <Image alt="image" src={item} width={100} height={100} />
                    // </Box>
                    <Box key={index + Math.random()} sx={{ cursor: 'pointer' }}>
                      <PhotoView src={item}>
                        <Image
                          alt="image"
                          src={item}
                          width={100}
                          height={100}
                        />
                      </PhotoView>
                    </Box>
                  )
                })
              )}
            </Stack>
          </PhotoProvider>
        </CustomBox>
      ) : (
        <Skeleton
          sx={{ marginBottom: '15px' }}
          variant="rectangular"
          width="100%"
          height="155px"
        />
      )}

      <Grid container spacing={2} mb={2}>
        <Grid xs={7}>
          {stateProductDetail ? (
            <CustomStack spacing={2}>
              <TypographyHeading>
                {t('productTemplate.specification')}
              </TypographyHeading>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>
                  {t('productTemplate.productCode')}
                </TypographyCustom>
                <TypographyInformation>
                  #{stateProductDetail.code}
                </TypographyInformation>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>
                  {t('productTemplate.productName')}
                </TypographyCustom>
                <TypographyInformation>
                  {stateProductDetail.name}
                </TypographyInformation>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>
                  {t('productTemplate.productCategoryOnMarketplace')}
                </TypographyCustom>
                <TypographyInformation>
                  {stateProductDetail?.category_marketplace?.name}
                </TypographyInformation>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>
                  {t('productTemplate.productCategory')}
                </TypographyCustom>
                {Object.keys(stateProductDetail.category?.parent_category)
                  .length === 0 ? (
                  <>
                    <TypographyInformation>
                      {stateProductDetail.category?.name}
                    </TypographyInformation>
                  </>
                ) : (
                  <TypographyInformation>
                    {stateProductDetail.category?.parent_category.name} {' > '}
                    {stateProductDetail.category?.name}
                  </TypographyInformation>
                )}
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>
                  {t('productTemplate.brand')}
                </TypographyCustom>
                <TypographyInformation>
                  {stateProductDetail.brand
                    ? stateProductDetail.brand.name
                    : 'N/A'}
                </TypographyInformation>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>
                  {t('productTemplate.manufacturer')}
                </TypographyCustom>
                <TypographyInformation>
                  {stateProductDetail.manufacturer
                    ? stateProductDetail.manufacturer.name
                    : 'N/A'}
                </TypographyInformation>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>
                  {t('productTemplate.unitType')}
                </TypographyCustom>
                <TypographyInformation sx={{ textTransform: 'capitalize' }}>
                  {stateProductDetail.unit_type?.toLowerCase()}
                </TypographyInformation>
              </Stack>

              {/* <Stack direction="row" justifyContent="space-between">
                <TypographyCustom>Distribution channel</TypographyCustom>
                <TypographyInformation>
                  {stateProductDetail.distribution_channels_sales &&
                    stateProductDetail.distribution_channels_sales.length > 0 &&
                    stateProductDetail.distribution_channels_sales[0].name}
                  {stateProductDetail.distribution_channels_bought &&
                    stateProductDetail.distribution_channels_bought.length >
                      0 &&
                    stateProductDetail.distribution_channels_bought[0].name}
                </TypographyInformation>
              </Stack> */}
            </CustomStack>
          ) : (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={350}
            ></Skeleton>
          )}
        </Grid>
        <Grid xs={5}>
          {stateProductDetail ? (
            <Stack spacing={2}>
              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  background: '#1DB46A',
                  padding: '10px 15px',
                  borderRadius: '5px',
                }}
              >
                <TypographyCustom sx={{ color: 'white' }}>
                  {t('productTemplate.productStatus')}
                </TypographyCustom>
                <TypographyCustom sx={{ color: 'white', fontWeight: 700 }}>
                  {stateProductDetail.is_active
                    ? t('productTemplate.active')
                    : t('productTemplate.deactivated')}
                </TypographyCustom>
              </Stack>
              {/* <CustomStack spacing={2}>
                <TypographyHeading sx={{ display: 'flex' }}>
                  Stock{' '}
                  {stateProductDetail.available_stock <
                    stateProductDetail.low_stock_alert_level && (
                    <span
                      style={{
                        color: '#E02D3C',
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: '20px',
                        fontSize: '14px',
                      }}
                    >
                      <WarningCircle
                        style={{
                          color: '#E02D3C',
                          marginRight: '5px',
                        }}
                        size={14}
                      />{' '}
                      The stock is low
                    </span>
                  )}
                </TypographyHeading>

                <Stack direction="row" justifyContent="space-between">
                  <TypographyCustom sx={{ fontWeight: 700 }}>
                    Warehouse
                  </TypographyCustom>
                  <TypographyCustom sx={{ fontWeight: 700 }}>
                    Stock
                  </TypographyCustom>
                </Stack>
                <Stack spacing={1}>
                  {stateProductDetail.warehouses.map((item: WarehouseType) => {
                    return (
                      <Stack
                        key={item.id + Math.random()}
                        direction="row"
                        justifyContent="space-between"
                      >
                        <Typography>{item.name}</Typography>
                        <Typography>
                          {item.quantity.toLocaleString('en-US')}{' '}
                          {stateProductDetail.unit_type?.toLowerCase()}
                        </Typography>
                      </Stack>
                    )
                  })}
                </Stack>
              </CustomStack> */}
              {/* <Stack
                direction="row"
                justifyContent="space-between"
                sx={{
                  background: '#FEF1F2',
                  padding: '10px 15px',
                  borderRadius: '5px',
                }}
              >
                <TypographyCustom sx={{ color: '#E02D3C' }}>
                  Low stock alert level
                </TypographyCustom>
                <TypographyCustom sx={{ color: '#E02D3C', fontWeight: 700 }}>
                  {stateProductDetail.low_stock_alert_level.toLocaleString(
                    'en-US'
                  )}
                </TypographyCustom>
              </Stack> */}
            </Stack>
          ) : (
            <Skeleton variant="rectangular" width="100%" height={128} />
          )}
          <CustomBox>
            <TypographyHeading mb={2}>
              {t('productTemplate.attributeOptions')}
            </TypographyHeading>
            <Box>
              {stateProductDetail?.attributes.map((item, index) => {
                return (
                  <Box key={index} sx={{ marginBottom: '10px' }}>
                    <Stack direction="row" alignItems="baseline" spacing={2}>
                      <Stack direction="row" alignItems="center">
                        <Typography sx={{ fontWeight: 500 }}>
                          {item.name}
                        </Typography>
                        <IconButton
                          onClick={() => handleOpenDrawerAttribute(item)}
                        >
                          <NotePencil weight="bold" size={18} />
                        </IconButton>
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                        // alignItems="flex-start"
                      >
                        {item.options.map((option, idx) => {
                          return (
                            <Box
                              key={idx}
                              sx={{
                                padding: '0 15px',
                                border: '1px solid #BABABA',
                                borderRadius: '5px',
                                marginBottom: '10px !important',
                              }}
                            >
                              <Typography>{option.name}</Typography>
                            </Box>
                          )
                        })}
                      </Stack>
                    </Stack>
                    {/* <Autocomplete
                      readOnly
                      multiple
                      id="combo-box-demo"
                      options={item.options.map((element) => element.name)}
                      defaultValue={item.options.map((element) => element.name)}
                      renderInput={(params) => <TextFieldCustom {...params} />}
                    /> */}
                  </Box>
                )
              })}
            </Box>
          </CustomBox>
        </Grid>
      </Grid>
      {stateProductDetail ? (
        <CustomBox mb={2}>
          <TypographyHeading mb={2}>
            {t('productTemplate.shortDescription')}
          </TypographyHeading>
          <Typography variant="body2">
            {stateProductDetail.description
              ? stateProductDetail.description
              : 'N/A'}
          </Typography>
        </CustomBox>
      ) : (
        <Skeleton
          sx={{ marginBottom: '15px' }}
          variant="rectangular"
          width="100%"
          height={137}
        />
      )}
      {stateProductDetail ? (
        <CustomBox mb={2}>
          <TypographyHeading mb={2}>
            {t('productTemplate.fullDescription')}
          </TypographyHeading>
          <Typography
            variant="body2"
            dangerouslySetInnerHTML={{
              __html: stateProductDetail?.longDescription
                ? `${stateProductDetail?.longDescription}`
                : `<p>N/A</p>`,
            }}
          ></Typography>
        </CustomBox>
      ) : (
        <Skeleton
          sx={{ marginBottom: '15px' }}
          variant="rectangular"
          width="100%"
          height={284}
        />
      )}

      {checkPermission(
        arrayPermission,
        KEY_MODULE.Inventory,
        PERMISSION_RULE.ViewListVariant
      ) && (
        <Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            mb={1}
            alignItems="center"
          >
            <Typography
              sx={{
                fontSize: '1.6rem',
                fontWeight: '600',
              }}
            >
              {t('productTemplate.productVariant')}
            </Typography>
            {stateProductDetail?.is_owner &&
              checkPermission(
                arrayPermission,
                KEY_MODULE.Inventory,
                PERMISSION_RULE.CreateVariant
              ) && (
                <ButtonCustom
                  variant="contained"
                  size="small"
                  startIcon={<Plus color="#fff" size={20} />}
                  onClick={() => setStateDrawerAddNewVariant(true)}
                >
                  {t('productTemplate.addNewVariant')}
                </ButtonCustom>
              )}
          </Stack>
          <>
            <TableContainerTws sx={{ marginTop: 0 }}>
              <Table>
                <TableHead>
                  <TableRowTws>
                    <TableCellTws>{t('productTemplate.code')}</TableCellTws>
                    <TableCellTws>{t('productTemplate.name')}</TableCellTws>
                    {stateProductDetail?.attributes.map((item, index) => {
                      return (
                        <TableCellTws key={index}>{item.name}</TableCellTws>
                      )
                    })}
                    {platform() === 'RETAILER' && (
                      <TableCellTws>
                        {t('productTemplate.retailPrice')}
                      </TableCellTws>
                    )}
                    {/* <TableCellTws>Variant</TableCellTws> */}
                    <TableCellTws>{t('productTemplate.quantity')}</TableCellTws>
                    <TableCellTws>{t('productTemplate.status')}</TableCellTws>

                    {/* <TableCellTws>Description</TableCellTws> */}
                  </TableRowTws>
                </TableHead>
                <TableBody>
                  {stateProductDetail?.variants
                    .slice(
                      (statePage - 1) * stateRowPerPage,
                      (statePage - 1) * stateRowPerPage + stateRowPerPage
                    )
                    .map((item, index: number) => {
                      // const variantName = item.attribute_options
                      //   .map((item) => item.option)
                      //   .join(' - ')
                      return (
                        <React.Fragment key={`item-${index}`}>
                          <TableRowTws
                            sx={{
                              cursor: checkPermission(
                                arrayPermission,
                                KEY_MODULE.Inventory,
                                PERMISSION_RULE.ViewDetailsVariant
                              )
                                ? 'pointer'
                                : '',
                            }}
                            hover={checkPermission(
                              arrayPermission,
                              KEY_MODULE.Inventory,
                              PERMISSION_RULE.ViewDetailsVariant
                            )}
                            onClick={() => {
                              if (
                                checkPermission(
                                  arrayPermission,
                                  KEY_MODULE.Inventory,
                                  PERMISSION_RULE.ViewDetailsVariant
                                )
                              ) {
                                router.push(
                                  `/${platform().toLowerCase()}/inventory/product/detail/${
                                    item.id
                                  }`
                                )
                              }
                            }}
                          >
                            <TableCellTws>
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Image
                                  alt="image"
                                  src={
                                    item.thumbnail
                                      ? item.thumbnail
                                      : '/' + '/images/vapeProduct.png'
                                  }
                                  width={50}
                                  height={50}
                                />
                                <Typography>#{item.code}</Typography>
                              </Stack>
                            </TableCellTws>
                            <TableCellTws>{item.name}</TableCellTws>
                            {/* <TableCellTws>
                          {item.attribute_options.length > 0
                            ? variantName
                            : 'N/A'}
                        </TableCellTws> */}
                            {item.attribute_options.map((element, idx) => {
                              return (
                                <TableCellTws key={idx}>
                                  {element.option}
                                </TableCellTws>
                              )
                            })}

                            {platform() === 'RETAILER' && (
                              <TableCellTws>
                                {item.retail_price
                                  ? formatMoney(item.retail_price)
                                  : 'N/A'}
                              </TableCellTws>
                            )}

                            <TableCellTws>
                              <Stack direction="row" spacing={1}>
                                <Typography>
                                  {item.quantity.toLocaleString('en-US')}{' '}
                                  {stateProductDetail.unit_type?.toLowerCase()}
                                </Typography>

                                {item.quantity < item.low_stock_level && (
                                  <Tooltip
                                    title="The stock is low"
                                    arrow
                                    placement="top"
                                  >
                                    <WarningCircle
                                      weight="fill"
                                      color="#E02D3C"
                                      size={18}
                                    />
                                  </Tooltip>
                                )}
                              </Stack>
                            </TableCellTws>
                            <TableCellTws>
                              {item.is_active ? (
                                <Typography
                                  sx={{ fontWeight: 700, color: '#34DC75' }}
                                >
                                  {t('productTemplate.active')}
                                </Typography>
                              ) : (
                                <Typography
                                  sx={{ fontWeight: 700, color: '#E02D3C' }}
                                >
                                  {t('productTemplate.deactivated')}
                                </Typography>
                              )}
                            </TableCellTws>
                            {/* <TableCellTws>
                              {item.description ? item.description : 'N/A'}
                            </TableCellTws> */}
                          </TableRowTws>
                        </React.Fragment>
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
              <Typography>{t('productTemplate.rowsPerPage')}</Typography>

              <FormControl sx={{ m: 1 }}>
                <SelectPaginationCustom
                  value={stateRowPerPage}
                  onChange={handleChangeRowsPerPage}
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
                page={statePage}
                onChange={(event, page: number) =>
                  handleChangePagination(event, page)
                }
                count={
                  stateProductDetail
                    ? Math.ceil(
                        Number(stateProductDetail.variants_count) /
                          stateRowPerPage
                      )
                    : 0
                }
              />
            </Stack>
          </>
        </Box>
      )}

      <Drawer
        anchor="right"
        open={stateOpenDialog}
        onClose={handleDialogSetRetail}
      >
        <Box sx={{ width: '550px', padding: '30px' }}>
          <Stack direction="row" spacing={2} sx={{ marginBottom: '15px' }}>
            <IconButton onClick={handleDialogSetRetail}>
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2
              sx={{ fontSize: '2.4rem', marginBottom: '0px' }}
              alignSelf="center"
            >
              {t('productTemplate.setRetailPrice')}
            </TypographyH2>
          </Stack>
          <form
            onSubmit={handleSubmitRetail(onSubmitRetail)}
            // className={classes['cancel-dialog']}
          >
            <Grid container xs mb={2}>
              <Controller
                control={controlRetail}
                name="retail_price"
                render={() => {
                  return (
                    <>
                      <InputLabelCustomModal
                        htmlFor="retail_price"
                        error={!!errorsRetail.retail_price}
                      >
                        <RequiredLabel />
                        {t(
                          'productTemplate.pleaseEnterTheRetailPriceForTheProduct'
                        )}
                      </InputLabelCustomModal>
                      <FormControl fullWidth>
                        <div className={classes['input-number-retail']}>
                          <NumericFormat
                            // sx={{ width: '100%' }}

                            defaultValue={
                              stateProductDetail?.new_information_product
                                .retail_price
                                ? stateProductDetail.new_information_product
                                    .retail_price
                                : 0
                            }
                            id="retail_price"
                            placeholder="0"
                            thousandSeparator=","
                            onValueChange={(value) => {
                              setValueRetail(
                                'retail_price',
                                Number(value.floatValue)
                              )
                              // field.onChange(value.floatValue)
                            }}
                            allowNegative={false}
                            onKeyPress={(event: any) => {
                              if (hasSpecialCharacterPrice(event.key)) {
                                event.preventDefault()
                              }
                            }}
                            decimalScale={2}
                            error={!!errorsRetail.retail_price}
                            customInput={TextField}
                          ></NumericFormat>
                        </div>
                        <FormHelperText error={!!errorsRetail.retail_price}>
                          {errorsRetail.retail_price &&
                            `${errorsRetail.retail_price.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )
                }}
              />
            </Grid>
          </form>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              variant="outlined"
              size="large"
              onClick={handleDialogSetRetail}
            >
              {t('productTemplate.cancel')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              size="large"
              type="submit"
              onClick={handleSubmitRetail(onSubmitRetail)}
            >
              {t('productTemplate.submit')}
            </ButtonCustom>
          </Stack>
        </Box>
      </Drawer>

      <Drawer anchor="right" open={openFilter} onClose={handleCloseMenuFilter}>
        <Box sx={{ width: '550px', padding: '30px' }}>
          <Stack direction="row" spacing={2} sx={{ marginBottom: '15px' }}>
            <IconButton onClick={handleCloseMenuFilter}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{ fontSize: '2.4rem', fontWeight: '700', color: '#49516F' }}
            >
              {t('productTemplate.filterStockTransaction')}
            </Typography>
          </Stack>

          <form onSubmit={handleSubmitFilter(onSubmitFilter)}>
            <Box mb={2}>
              <InputLabelCustomModal
                htmlFor="date"
                sx={{
                  color: '#49516F',
                }}
              >
                {t('productTemplate.date')}
              </InputLabelCustomModal>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={controlFilter}
                    defaultValue=""
                    name="from_date"
                    render={({ field }) => (
                      <Box>
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              inputFormat="MM/DD/YYYY"
                              {...field}
                              onChange={(value: dayjs.Dayjs | null) => {
                                if (!value) {
                                  console.log('?', value, field)
                                  setValueFilter('from_date', '', {
                                    shouldValidate: true,
                                  })
                                } else {
                                  setValueFilter(
                                    'from_date',
                                    dayjs(value).format('MM/DD/YYYY'),
                                    { shouldValidate: true }
                                  )
                                }
                              }}
                              // shouldDisableDate={(day: any) => {
                              //   const date = new Date()
                              //   console.log()
                              //   if (
                              //     dayjs(day).format('YYYY-MM-DD') >
                              //     dayjs(date).format('YYYY-MM-DD')
                              //   ) {
                              //     return true
                              //   }
                              //   return falses
                              // }}
                              renderInput={(params: any) => {
                                // params?.inputProps?.value = field.value
                                // const value = params
                                return (
                                  <TextFieldCustom
                                    {...params}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          {t('productTemplate.from')}
                                        </InputAdornment>
                                      ),
                                    }}
                                    error={!!errorsFilter.from_date}
                                  />
                                )
                              }}
                            />
                          </LocalizationProvider>
                          <FormHelperText error={!!errorsFilter.from_date}>
                            {errorsFilter.from_date &&
                              `${errorsFilter.from_date.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                </Grid>
                <Grid xs>
                  <Controller
                    control={controlFilter}
                    defaultValue=""
                    name="to_date"
                    render={({ field }) => (
                      <Box>
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              inputFormat="MM/DD/YYYY"
                              {...field}
                              onChange={(value: dayjs.Dayjs | null) => {
                                if (!value) {
                                  console.log('?', value)
                                  setValueFilter('to_date', '', {
                                    shouldValidate: true,
                                  })
                                } else {
                                  setValueFilter(
                                    'to_date',
                                    dayjs(value).format('MM/DD/YYYY'),
                                    { shouldValidate: true }
                                  )
                                }
                              }}
                              // shouldDisableDate={(day: any) => {
                              //   const date = new Date()

                              //   if (
                              //     dayjs(day).format('YYYY-MM-DD') >
                              //     dayjs(date).format('YYYY-MM-DD')
                              //   ) {
                              //     return true
                              //   }
                              //   return false
                              // }}
                              renderInput={(params) => (
                                <TextFieldCustom
                                  {...params}
                                  InputProps={{
                                    startAdornment: (
                                      <InputAdornment position="start">
                                        {t('productTemplate.to')}
                                      </InputAdornment>
                                    ),
                                  }}
                                  error={!!errorsFilter.to_date}
                                />
                              )}
                            />
                          </LocalizationProvider>
                          <FormHelperText error={!!errorsFilter.to_date}>
                            {errorsFilter.to_date &&
                              `${errorsFilter.to_date.message}`}
                          </FormHelperText>
                        </FormControl>
                      </Box>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <InputLabelCustomModal
                htmlFor="warehouse"
                style={{ fontSize: '1.4rem !important' }}
                sx={{
                  color: '#49516F',
                }}
              >
                {t('productTemplate.warehouse')}
              </InputLabelCustomModal>
              <Controller
                control={controlFilter}
                defaultValue={[]}
                name="warehouse"
                render={({ field }) => (
                  <Box>
                    <FormControl fullWidth>
                      <SelectCustom
                        fullWidth
                        id="warehouse"
                        displayEmpty
                        // multiple
                        IconComponent={() => <KeyboardArrowDownIcon />}
                        renderValue={(value: any) => {
                          if (!value) {
                            return (
                              <PlaceholderSelect>
                                <div>
                                  {t('productTemplate.selectWarehouse')}
                                </div>
                              </PlaceholderSelect>
                            )
                          }
                          return value.map(function (
                            item: string,
                            idx: number
                          ) {
                            return (
                              <span key={idx}>
                                {idx > 0 ? ', ' : ''}
                                {item.slice(item.indexOf('-') + 1, item.length)}
                              </span>
                            )
                          })
                        }}
                        {...field}
                      >
                        <InfiniteScrollSelectMultiple
                          propData={stateListWarehouse}
                          handleSearch={(value) => {
                            setStateListWarehouse({ data: [] })
                            handleGetListWarehouse(value)
                          }}
                          fetchMore={(value) => {
                            fetchMoreDataWarehouse(value)
                          }}
                          onClickSelectItem={(item: any) => {
                            setValueFilter('warehouse', item)
                            clearErrorsFilter('warehouse')

                            // setState({
                            //   ...state,
                            //   openCategory: false,
                            // })
                          }}
                          propsGetValue={getValuesFilter('warehouse')}
                          propName="name"
                        />
                      </SelectCustom>
                    </FormControl>
                  </Box>
                )}
              />
            </Box>
            <Box mb={2}>
              <InputLabelCustomModal
                htmlFor="reason"
                sx={{
                  color: '#49516F',
                  fontSize: '1.2rem',
                }}
              >
                {t('productTemplate.reason')}
              </InputLabelCustomModal>
              <Controller
                control={controlFilter}
                name="reason"
                defaultValue={[]}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <SelectCustom
                      IconComponent={() => (
                        <KeyboardArrowDownIcon
                          sx={{ border: '1.5px #49516F' }}
                        />
                      )}
                      id="reason"
                      multiple
                      {...field}
                      value={field.value}
                      onChange={(event: any) => {
                        const {
                          target: { value },
                        } = event
                        setValueFilter(
                          'reason',
                          typeof value === 'string' ? value.split(',') : value
                        )
                      }}
                    >
                      {reasonFilter.map((item, index) => (
                        <MenuItemSelectCustom key={index + 1} value={item.name}>
                          {item.name}
                        </MenuItemSelectCustom>
                      ))}
                    </SelectCustom>
                  </FormControl>
                )}
              />
            </Box>
            <Stack direction="row" spacing={2}>
              <ButtonCancel
                // type="reset"
                onClick={handleReset}
                sx={{ color: '#49516F' }}
                size="large"
              >
                {t('productTemplate.reset')}
              </ButtonCancel>
              <ButtonCustom variant="contained" size="large" type="submit">
                {t('productTemplate.filter')}
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={stateDrawerAddNewVariant}
        onClose={() => handleOnCloseDrawerAddNewVariant()}
      >
        <Box sx={{ width: '1200px', padding: '20px' }}>
          <Stack direction="row" sx={{ marginBottom: '15px' }}>
            <IconButton onClick={() => handleOnCloseDrawerAddNewVariant()}>
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2
              textAlign="center"
              sx={{ marginBottom: '0px !important' }}
            >
              {t('productTemplate.addNewVariant')}{' '}
            </TypographyH2>
          </Stack>
          <Box
            sx={{
              background: '#F8F9FC',
              padding: '15px',
              borderRadius: '10px',
            }}
          >
            <form
              onSubmit={handleSubmitAddNewVariant(
                onSubmitAddNewVariant,
                onError
              )}
            >
              <Stack spacing={2} sx={{ marginBottom: '15px' }}>
                <Stack direction="row" spacing={2} mb={2}>
                  <Box>
                    <Typography sx={{ marginBottom: '15px', fontWeight: 500 }}>
                      <RequiredLabel />
                      {t('productTemplate.productThumbnail')}
                    </Typography>
                    <Box
                      p={'15px'}
                      mb={'25px'}
                      maxWidth={'193px'}
                      borderRadius={'10px'}
                      sx={{
                        backgroundColor: 'white',
                      }}
                    >
                      <UploadImage
                        file={watchVariant(`thumbnail`) as string}
                        onFileSelectSuccess={(file: string) => {
                          setValueAddNewVariant(`thumbnail`, file)
                          triggerVariant(`thumbnail`)
                        }}
                        onFileSelectError={() => {
                          return
                        }}
                        onFileSelectDelete={() => {
                          setValueAddNewVariant(`thumbnail`, '')
                          triggerVariant(`thumbnail`)
                        }}
                      />
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      whiteSpace: 'nowrap',
                      overflowX: 'auto',
                    }}
                  >
                    <Typography sx={{ marginBottom: '15px', fontWeight: 500 }}>
                      <RequiredLabel />
                      {t('productTemplate.productImages')}
                    </Typography>
                    <UploadList
                      files={watchVariant(`images`) as string[]}
                      onFileSelectSuccess={(file: string[]) => {
                        setValueAddNewVariant(`images`, file)
                        triggerVariant(`images`)
                      }}
                      onFileSelectError={() => {
                        return
                      }}
                      onFileSelectDelete={(file) => {
                        setValueAddNewVariant(`images`, file)
                        triggerVariant(`images`)
                      }}
                    />
                  </Box>
                </Stack>
                <Typography
                  sx={{
                    marginTop: '0 !important',
                    marginBottom: '15px !important',
                    fontWeight: 500,
                  }}
                >
                  {t('productTemplate.variantInformation')}
                </Typography>
                <CustomBoxForDrawer
                  sx={{
                    width: '100%',
                    marginBottom: '15px !important',
                    marginTop: '0px !important',
                  }}
                >
                  {fields.map((field, index) => {
                    setValueAddNewVariant(
                      `option_array.${index}.name`,
                      field.name
                    )
                    return (
                      <Box
                        key={field.id}
                        sx={{ width: '100%', marginBottom: '15px' }}
                      >
                        <Controller
                          control={controlAddNewVariant}
                          name={`option_array.${index}.option`}
                          render={() => (
                            <>
                              <InputLabelCustom
                                htmlFor={`option_array.${index}.option`}
                                sx={{ marginBottom: '10px' }}
                                error={
                                  !!errorsAddNewVariant?.option_array?.[index]
                                    ?.option
                                }
                                // error={
                                //   !!errorsAttributeOption.attribute_option_array[
                                //     index
                                //   ].option_name_array
                                // }
                              >
                                <RequiredLabel />
                                {field.name}
                              </InputLabelCustom>
                              <FormControl fullWidth>
                                <Autocomplete
                                  disablePortal
                                  freeSolo
                                  id="combo-box-demo"
                                  options={field.options ? field.options : []}
                                  getOptionLabel={(option) => {
                                    if (typeof option === 'string') {
                                      return option
                                    }
                                    return option.name
                                  }}
                                  {...registerVariant(
                                    `option_array.${index}.option`
                                  )}
                                  renderInput={(params) => (
                                    <TextFieldCustom
                                      error={
                                        !!errorsAddNewVariant?.option_array?.[
                                          index
                                        ]?.option
                                      }
                                      {...(params as any)}
                                    />
                                  )}
                                  onInputChange={(e, value) => {
                                    console.log('e', e)
                                    setValueAddNewVariant(
                                      `option_array.${index}.option`,
                                      value
                                    )
                                    triggerVariant(
                                      `option_array.${index}.option`
                                    )
                                  }}
                                  onChange={(e, value) => {
                                    console.log('e', e)
                                    if (typeof value === 'string') {
                                      setValueAddNewVariant(
                                        `option_array.${index}.option`,
                                        String(value)
                                      )
                                      triggerVariant(
                                        `option_array.${index}.option`
                                      )
                                      return
                                    }
                                    if (value !== null) {
                                      setValueAddNewVariant(
                                        `option_array.${index}.option`,
                                        String(value.name)
                                      )
                                      triggerVariant(
                                        `option_array.${index}.option`
                                      )
                                      return
                                    }
                                  }}
                                />
                                <FormHelperText
                                  error={
                                    !!errorsAddNewVariant?.option_array?.[index]
                                      ?.option
                                  }
                                >
                                  {errorsAddNewVariant?.option_array?.[index]
                                    ?.option &&
                                    errorsAddNewVariant?.option_array?.[index]
                                      ?.option?.message}
                                </FormHelperText>
                              </FormControl>
                            </>
                          )}
                        />
                      </Box>
                    )
                  })}
                </CustomBoxForDrawer>
                <CustomStack
                  sx={{ marginTop: '0 !important', padding: 0 }}
                  spacing={2}
                  direction="row"
                >
                  <Stack sx={{ width: '100%' }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{ marginBottom: '15px' }}
                    >
                      <Typography sx={{ fontWeight: 500 }}>
                        {t('productTemplate.warehouse')}
                      </Typography>
                      <FormHelperText error>
                        {errorsAddNewVariant.warehouses &&
                          errorsAddNewVariant?.warehouses?.message}
                      </FormHelperText>
                    </Stack>

                    <CustomBoxForDrawer>
                      <Controller
                        control={controlAddNewVariant}
                        name={`warehouses`}
                        render={() => {
                          return (
                            <Box>
                              {stateWarehouseAdjust?.data.map((item, idx) => {
                                const fieldName = `warehouses.${idx}`
                                setValueAddNewVariant(
                                  `warehouses.${idx}.warehouse`,
                                  item.id
                                )
                                return (
                                  <Stack spacing={2} key={fieldName} mb={1}>
                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                      spacing={2}
                                    >
                                      <Box sx={{ width: '100%' }}>
                                        <Stack
                                          direction="row"
                                          alignItems="center"
                                        >
                                          <InputLabelCustom
                                            htmlFor={`${fieldName}.warehouse`}
                                          >
                                            {t('productTemplate.warehouse')}
                                          </InputLabelCustom>
                                        </Stack>
                                        <FormControl fullWidth disabled>
                                          <TextFieldCustom
                                            disabled
                                            placeholder={item.name}
                                          />
                                        </FormControl>
                                      </Box>
                                      <Controller
                                        control={controlAddNewVariant}
                                        name={`warehouses.${idx}.quantity`}
                                        render={() => (
                                          <Box sx={{ width: '100%' }}>
                                            <InputLabelCustom
                                              htmlFor={`${fieldName}.quantity`}
                                              error={
                                                errorsAddNewVariant.warehouses &&
                                                Boolean(
                                                  errorsAddNewVariant
                                                    .warehouses[idx]?.quantity
                                                )
                                              }
                                              // error={!!errors.quantity}
                                            >
                                              {t('productTemplate.quantity')}
                                            </InputLabelCustom>
                                            <FormControl fullWidth>
                                              <NumericFormat
                                                customInput={TextField}
                                                style={{ width: '100%' }}
                                                thousandSeparator
                                                className={
                                                  classes['input-number']
                                                }
                                                InputProps={{
                                                  endAdornment: (
                                                    <InputAdornment position="end">
                                                      {stateProductDetail
                                                        ? stateProductDetail?.unit_type?.toLowerCase()
                                                        : 'N/A'}
                                                    </InputAdornment>
                                                  ),
                                                }}
                                                isAllowed={(values) => {
                                                  const {
                                                    floatValue,
                                                    formattedValue,
                                                  } = values
                                                  if (!floatValue) {
                                                    return formattedValue === ''
                                                  }
                                                  return floatValue <= 10000000
                                                }}
                                                error={
                                                  errorsAddNewVariant.warehouses &&
                                                  Boolean(
                                                    errorsAddNewVariant
                                                      .warehouses[idx]?.quantity
                                                  )
                                                }
                                                placeholder="0"
                                                onValueChange={(value) => {
                                                  setValueAddNewVariant(
                                                    `warehouses.${idx}.quantity`,
                                                    value.floatValue
                                                  )
                                                  triggerVariant(
                                                    `warehouses.${idx}.quantity`
                                                  )
                                                  triggerVariant('warehouses')
                                                }}
                                              />
                                            </FormControl>

                                            <FormHelperText error>
                                              {errorsAddNewVariant?.warehouses &&
                                                Boolean(
                                                  errorsAddNewVariant
                                                    ?.warehouses[idx]?.quantity
                                                ) &&
                                                `${errorsAddNewVariant.warehouses[idx]?.quantity?.message}`}
                                            </FormHelperText>
                                          </Box>
                                        )}
                                      />
                                    </Stack>
                                  </Stack>
                                )
                              })}
                            </Box>
                          )
                        }}
                      />
                    </CustomBoxForDrawer>
                  </Stack>
                  <Stack sx={{ width: '100%' }}>
                    <Typography sx={{ fontWeight: 500, marginBottom: '15px' }}>
                      {t('productTemplate.distributionChannelPricing')}
                    </Typography>
                    <CustomBoxForDrawer>
                      <Stack spacing={2} sx={{ marginBottom: '15px' }}>
                        {fieldsDistributtion.map((item, idx) => {
                          return (
                            <Stack direction="row" key={item.id} spacing={2}>
                              <Controller
                                control={controlAddNewVariant}
                                name="distribution_channel"
                                render={() => {
                                  return (
                                    <>
                                      <Box sx={{ width: '100%' }}>
                                        <Controller
                                          control={controlAddNewVariant}
                                          name={`distribution_channel.${idx}.id`}
                                          render={({ field }) => (
                                            <>
                                              <InputLabelCustom
                                                htmlFor={`distribution_channel.${idx}.id`}
                                                error={
                                                  !!errorsAddNewVariant
                                                    .distribution_channel?.[idx]
                                                    ?.id
                                                }
                                              >
                                                <RequiredLabel />{' '}
                                                {t(
                                                  'productTemplate.distributionChannel'
                                                )}
                                              </InputLabelCustom>
                                              <FormControl
                                                fullWidth
                                                disabled={idx === 0}
                                              >
                                                <SelectCustom
                                                  {...field}
                                                  sx={{
                                                    background:
                                                      idx === 0
                                                        ? '#F6F6F6'
                                                        : '',
                                                  }}
                                                  IconComponent={() => (
                                                    <KeyboardArrowDownIcon
                                                      sx={{
                                                        color: 'transparent',
                                                      }}
                                                    />
                                                  )}
                                                  onChange={(event: any) => {
                                                    console.log(
                                                      'event',
                                                      event.target.value
                                                    )
                                                    setValueAddNewVariant(
                                                      `distribution_channel.${idx}.id`,
                                                      event.target.value
                                                    )
                                                  }}
                                                >
                                                  {stateListDistribution.map(
                                                    (obj, index) => {
                                                      return (
                                                        <MenuItem
                                                          key={index}
                                                          value={obj.id}
                                                        >
                                                          {obj.name}
                                                        </MenuItem>
                                                      )
                                                    }
                                                  )}
                                                </SelectCustom>
                                                {/* <FormHelperText
                                      error={!!errors.distribution_channel}
                                    >
                                      {errors.distribution_channel &&
                                        `${errors.distribution_channel.message}`}
                                    </FormHelperText> */}
                                              </FormControl>
                                            </>
                                          )}
                                        />
                                      </Box>

                                      <Box sx={{ width: '100%' }}>
                                        <Controller
                                          control={controlAddNewVariant}
                                          name={`distribution_channel.${idx}.price`}
                                          render={() => (
                                            <>
                                              <InputLabelCustom
                                                htmlFor={`distribution_channel.${idx}.price`}
                                                error={
                                                  !!errorsAddNewVariant
                                                    ?.distribution_channel?.[
                                                    idx
                                                  ]?.price
                                                }
                                                // error={!!errors.description}
                                              >
                                                <RequiredLabel />
                                                {t('productTemplate.price')}
                                              </InputLabelCustom>
                                              <FormControl fullWidth>
                                                <div
                                                  className={
                                                    classes['input-number']
                                                  }
                                                >
                                                  <CurrencyNumberFormat
                                                    propValue={(value) => {
                                                      console.log(
                                                        'Setting',
                                                        value
                                                      )
                                                      setValueAddNewVariant(
                                                        `distribution_channel.${idx}.price`,
                                                        Number(value)
                                                      )
                                                      triggerVariant(
                                                        `distribution_channel.${idx}.price`
                                                      )
                                                    }}
                                                    error={
                                                      !!errorsAddNewVariant
                                                        .distribution_channel?.[
                                                        idx
                                                      ]?.price
                                                    }
                                                  />
                                                </div>
                                                <FormHelperText error>
                                                  {errorsAddNewVariant
                                                    .distribution_channel?.[idx]
                                                    ?.price &&
                                                    errorsAddNewVariant
                                                      .distribution_channel?.[
                                                      idx
                                                    ]?.price?.message}
                                                </FormHelperText>
                                              </FormControl>
                                            </>
                                          )}
                                        />
                                      </Box>
                                    </>
                                  )
                                }}
                              />
                              {fieldsDistributtion.length > 1 && idx > 0 && (
                                <IconButton onClick={() => remove(idx)}>
                                  <Trash color="#F5222D" size={20} />
                                </IconButton>
                              )}
                            </Stack>
                          )
                        })}
                      </Stack>
                      <ButtonCustom
                        variant="outlined"
                        startIcon={<PlusCircle size={24} />}
                        onClick={() => {
                          append({
                            id: 0,
                            price: 0,
                          })
                        }}
                      >
                        {t('productTemplate.addDistributionChannel')}
                      </ButtonCustom>
                    </CustomBoxForDrawer>
                  </Stack>
                </CustomStack>
              </Stack>
              <Stack direction="row" justifyContent="flex-end">
                <ButtonCustom type="submit" variant="contained">
                  {t('productTemplate.submit')}
                </ButtonCustom>
              </Stack>
            </form>
          </Box>
        </Box>
      </Drawer>

      <Drawer
        anchor="right"
        open={stateDrawerUpdateAttributeOption}
        onClose={() => {
          resetVariant()
          setStateDrawerUpdateAttributeOption(false)
        }}
      >
        <CustomBoxForDrawer sx={{ width: '400px' }}>
          <Stack direction="row" spacing={1} sx={{ marginBottom: '15px' }}>
            <IconButton
              onClick={() => {
                resetVariant()
                setStateDrawerUpdateAttributeOption(false)
              }}
            >
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2 textAlign="center">
              {t('productTemplate.updateAttribute')}{' '}
            </TypographyH2>
          </Stack>
          <form
            onSubmit={handleSubmitUpdateAttribute(
              onSubmitAttribute,
              onErrAttribute
            )}
          >
            <Box sx={{ marginBottom: '10px' }}>
              <Controller
                control={controlSubmitUpdateAttribute}
                name="name"
                render={() => {
                  return (
                    <>
                      <InputLabelCustomModal
                        htmlFor="name"
                        error={!!errorsUpdateAttribute.name}
                      >
                        <RequiredLabel />
                        {t('productTemplate.name')}
                      </InputLabelCustomModal>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="name"
                          {...registerUpdateAttribute('name')}
                        />

                        <FormHelperText error={!!errorsUpdateAttribute.name}>
                          {errorsUpdateAttribute.name &&
                            `${errorsUpdateAttribute.name.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )
                }}
              />
            </Box>

            <ButtonCustom variant="contained" size="large" type="submit">
              {t('productTemplate.submit')}
            </ButtonCustom>
          </form>
        </CustomBoxForDrawer>
      </Drawer>
    </>
  )
}

export default ProductDetailComponent
