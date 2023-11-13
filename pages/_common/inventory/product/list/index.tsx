/* eslint-disable react-hooks/exhaustive-deps */
//React/Next
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

//API
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  createUpdateProductByOCR,
  getDetailVariant,
  getProductBrand,
  getProductByScanInvoice,
  getProductCategory,
  getProductInWarehouse,
  getProductManufacturer,
  getProductTheyCreated,
  getWareHouse,
  setRetailPrice,
} from './apiProduct'

//material
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import {
  Badge,
  Box,
  Collapse,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'

// import { SelectChangeEvent } from '@mui/material/Select'

import { yupResolver } from '@hookform/resolvers/yup'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Unstable_Grid2'
import {
  ArrowRight,
  FunnelSimple,
  Gear,
  MagnifyingGlass,
  WarningCircle,
} from '@phosphor-icons/react'
import Link from 'next/link'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  InfiniteScrollSelectMultiple,
  MenuAction,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  SelectPaginationCustom,
  TabCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TabsTws,
  TextFieldSearchCustom,
} from 'src/components'
import {
  checkPermission,
  handlerGetErrMessage,
  isEmptyObject,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
  platform,
} from 'src/utils/global.utils'
import {
  CreateProductDetailType,
  ListProductByInvoiceResponseType,
  ListProductDataType,
  ProductBrandResponseType,
  ProductCategoryResponseType,
  ProductData,
  ProductManufacturerResponseType,
  SubmitCreateUpdateOCR,
  SubmitWarehouse,
  UpdateProductDetailType,
  ValidateCreateUpdateProductOCRType,
  VariantDetailType,
  WarehouseType,
} from './modelProduct'

import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Image from 'next/image'
import { useCallback } from 'react'
import { NumericFormat } from 'react-number-format'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'

import { useTranslation } from 'react-i18next'
import CurrencyNumberFormat from 'src/components/CurrencyNumberFormat'
import { formatMoney } from 'src/utils/money.utils'
import { RetailPriceDataType } from '../product-template/modelProductDetail'
import ProductInInvoiceComponent from './part/ProductInInvoice'
import classes from './styles.module.scss'
import {
  createUpdateProductOCRSchema,
  filterSchema,
  retailSchema,
  schema,
} from './validations'

// other

// const renderColorStatus = (status: boolean) => {
//   const result = [
//     { status: true, color: '#1DB46A', text: 'Active' },
//     { status: false, color: '#E02D3C', text: 'DeActive' },
//   ].find((item) => {
//     return item.status === status
//   })
//   return result
// }

const NumericFormatCustom = styled(NumericFormat)<any>(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontSize: '1.4rem',
    overflow: 'hidden',
    borderColor: '#E1E6EF',
    height: '40px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderWidth: '1px !important',
    borderColor: '#E1E6EF',
  },
  '& .MuiInputBase-multiline': {
    padding: '0px',
  },
  '& .MuiInputBase-input': {
    padding: '10px 15px',
  },
}))

export const hasSpecialCharacterPrice = (input: string) => {
  // eslint-disable-next-line no-useless-escape
  return /[\!\@\#\$\%\^\&\*\)\(\+\=\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\/\\?]+$/g.test(
    input
  )
}

const handleIdQuery = (value: string | null) => {
  if (!value) return
  const newArr = value
    .split(',')
    .map(function (item: string) {
      return item.slice(0, item.indexOf('-'))
    })
    .toString()
  return newArr
}
// const dumbData = {
//   table: [
//     {
//       Description: 'Sugar Bar SB 8000 Puff Disposable',
//       Quantity: '12',
//       Price: '4.00',
//       Line_Amount: '48.00',
//       products: [
//         {
//           id: 2541,
//           name: 'Sugar Bar SB 8000 Puff Disposable',
//           warehouses: [
//             {
//               id: 45,
//               name: 'Test ABC',
//               quantity: 10,
//             },
//             {
//               id: 7,
//               name: 'Mobile Business',
//               quantity: 0,
//             },
//             {
//               id: 72,
//               name: 'Alden Warehouse',
//               quantity: 0,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       Description: 'Royal Ape Mogul 5000 puffs Disposable 10 Pack',
//       Quantity: '12',
//       Price: '4.00',
//       Line_Amount: '48.00',
//       products: [
//         {
//           id: 2543,
//           name: 'Royal Ape Mogul 5000 puffs Disposable 10 Pack',
//           warehouses: [
//             {
//               id: 45,
//               name: 'Test ABC',
//               quantity: 10,
//             },
//             {
//               id: 7,
//               name: 'Mobile Business',
//               quantity: 0,
//             },
//             {
//               id: 72,
//               name: 'Alden Warehouse',
//               quantity: 0,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       Description: 'Pod King Supreme Single Disposable',
//       Quantity: '12',
//       Price: '4.00',
//       Line_Amount: '48.00',
//       products: [],
//     },
//     {
//       Description: '',
//       Quantity: '',
//       Price: 'Tax ( 10 % )',
//       Line_Amount: '$ 20.00',
//       products: [],
//     },
//   ],
// }
const ListProductComponent = () => {
  const { t } = useTranslation('product')
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const [pushMessage] = useEnqueueSnackbar()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [stateDrawerFilter, setStateDrawerFilter] = useState<boolean>(false)
  const [stateDrawerRetail, setStateDrawerRetail] = useState<boolean>(false)
  const [stateFilter, setStateFilter] = useState<number>()
  const [stateListCategory, setStateListCategory] =
    useState<ProductCategoryResponseType>({ data: [] })
  const [stateListCategoryForInvoice, setStateListCategoryForInvoice] =
    useState<ProductCategoryResponseType>({ data: [] })
  const [stateListBrand, setStateListBrand] =
    useState<ProductBrandResponseType>({
      data: [],
    })
  const [stateListBrandForInvoice, setStateListBrandForInvoice] =
    useState<ProductBrandResponseType>({
      data: [],
    })
  const [stateListManufacturer, setStateListManufacturer] =
    useState<ProductManufacturerResponseType>({
      data: [],
    })
  const [stateValueTab, setStateValueTab] = useState<string>('EXISTING')
  const [stateDrawerOCR, setStateDrawerOCR] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

  // state use for
  const [stateProductList, setStateProductList] =
    useState<ListProductDataType>()
  const [stateIdProduct, setStateIdProduct] = useState<ProductData>()

  const [stateIndexCollapse, setStateIndexCollapse] = useState(-1)
  const [stateCurrentDetailVariant, setStateCurrentDetailVariant] =
    useState<VariantDetailType>()
  const [statePage, setStatePage] = useState(1)
  const [stateRowPerPage, setStateRowPerPage] = useState(10)
  const [stateListProductInvoice, setStateListProductInvoice] =
    useState<ListProductByInvoiceResponseType>()
  const [stateListWarehouse, setStateListWarehouse] = useState<WarehouseType[]>(
    []
  )
  const handleGetProductInWarehouse = (query: any) => {
    if (
      platform() === 'SUPPLIER' ||
      (platform() === 'RETAILER' &&
        router.query.status === 'BOUGHT' &&
        checkPermission(
          arrayPermission,
          KEY_MODULE.Inventory,
          PERMISSION_RULE.ViewBoughtList
        ))
    ) {
      dispatch(loadingActions.doLoading())
      getProductInWarehouse({
        ...query,
        category: handleIdQuery(query?.category),
        manufacturer: handleIdQuery(query?.manufacturer),
        brand: handleIdQuery(query?.brand),
      })
        .then((res) => {
          const data = res.data
          setStateProductList(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      return
    }
    dispatch(loadingActions.doLoading())
    getProductTheyCreated({
      ...query,
      category: handleIdQuery(query?.category),
      manufacturer: handleIdQuery(query?.manufacturer),
      brand: handleIdQuery(query?.brand),
    })
      .then((res) => {
        const data = res.data
        setStateProductList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    return
    // if (platform() === 'RETAILER') {
    //   if (router.query.status === 'BOUGHT') {
    //     dispatch(loadingActions.doLoading())
    //     getProductInWarehouse({
    //       ...query,
    //       category: handleIdQuery(query?.category),
    //       manufacturer: handleIdQuery(query?.manufacturer),
    //       brand: handleIdQuery(query?.brand),
    //     })
    //       .then((res) => {
    //         const data = res.data
    //         setStateProductList(data)
    //         dispatch(loadingActions.doLoadingSuccess())
    //       })
    //       .catch((response) => {
    //         dispatch(loadingActions.doLoadingFailure())
    //         const { status, data } = response
    //         pushMessage(handlerGetErrMessage(status, data), 'error')
    //       })
    //     return
    //   }
    //   if (
    //     router.query.status === 'EXISTING' ||
    //     stateValueTab === 'EXISTING' ||
    //     !router.query.status
    //   ) {
    //     dispatch(loadingActions.doLoading())
    //     getProductTheyCreated({
    //       ...query,
    //       category: handleIdQuery(query?.category),
    //       manufacturer: handleIdQuery(query?.manufacturer),
    //       brand: handleIdQuery(query?.brand),
    //     })
    //       .then((res) => {
    //         const data = res.data
    //         setStateProductList(data)
    //         dispatch(loadingActions.doLoadingSuccess())
    //       })
    //       .catch((response) => {
    //         dispatch(loadingActions.doLoadingFailure())
    //         const { status, data } = response
    //         pushMessage(handlerGetErrMessage(status, data), 'error')
    //       })
    //     return
    //   }
    //   if (router.query.status === 'EXISTING' || stateValueTab === 'EXISTING') {
    //     getProductTheyCreated({
    //       ...query,
    //       category: handleIdQuery(query?.category),
    //       manufacturer: handleIdQuery(query?.manufacturer),
    //       brand: handleIdQuery(query?.brand),
    //     })
    //       .then((res) => {
    //         const data = res.data
    //         setStateProductList(data)
    //         dispatch(loadingActions.doLoadingSuccess())
    //       })
    //       .catch((response) => {
    //         dispatch(loadingActions.doLoadingFailure())
    //         const { status, data } = response
    //         pushMessage(handlerGetErrMessage(status, data), 'error')
    //       })
    //   }
    // }
  }

  const handleGetWareHouseBelongToUser = useCallback(() => {
    if (router.asPath.length !== router.pathname.length) {
      if (platform() === 'RETAILER') {
        setStateValueTab(
          router.query.status ? `${router.query.status}` : 'EXISTING'
        )
      }
      if (router.query.key) {
        setValueFilter('key', router.query.key)
      }
      if (!isEmptyObject(router.query)) {
        handleGetProductInWarehouse(router.query)
        console.log('have query')
      }
    } else {
      setStateValueTab('EXISTING')
      handleGetProductInWarehouse({})
      console.log('no query')
    }
  }, [router.query, router.asPath, router.pathname])

  useEffect(() => {
    handleGetWareHouseBelongToUser()
  }, [handleGetWareHouseBelongToUser])

  // handleChangePagination
  const handleChangePagination = (e: any, page: number) => {
    console.log(e)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
    setStateIndexCollapse(-1)
    setStateCurrentDetailVariant(undefined)
  }
  //handle Open modal
  const handleOpenFilterDrawer = () => {
    setStateDrawerFilter(true)
    handleGetCategory('')
    handleGetBrand('')
    handleGetManufacturer('')
  }
  useEffect(() => {
    handleGetBrandForInvoice('')
    handleGetCategoryForInvoice('')
    getWareHouse()
      .then((res) => {
        const { data } = res.data
        setStateListWarehouse(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [])
  // new filter
  const handleGetManufacturer = (value: string | null) => {
    getProductManufacturer(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListManufacturer(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetBrand = (value: string | null) => {
    getProductBrand(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListBrand(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetBrandForInvoice = (value: string | null) => {
    getProductBrand(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListBrandForInvoice(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetCategory = (value: string | null) => {
    getProductCategory(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListCategory(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetCategoryForInvoice = (value: string | null) => {
    getProductCategory(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListCategoryForInvoice(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const fetchMoreDataBrand = useCallback(
    (value: { page: number; name: string }) => {
      getProductBrand(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListBrand((prev: any) => {
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
    [setStateListBrand, pushMessage]
  )
  const fetchMoreDataBrandForInvoice = useCallback(
    (value: { page: number; name: string }) => {
      getProductBrand(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListBrandForInvoice((prev: any) => {
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
    [setStateListBrandForInvoice, pushMessage]
  )

  const fetchMoreDataCategory = useCallback(
    (value: { page: number; name: string }) => {
      getProductCategory(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListCategory((prev: any) => {
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
    [setStateListCategory, pushMessage]
  )
  const fetchMoreDataCategoryForInvoice = useCallback(
    (value: { page: number; name: string }) => {
      getProductCategory(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListCategoryForInvoice((prev: any) => {
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
    [setStateListCategoryForInvoice, pushMessage]
  )

  const fetchMoreDataManufacturer = useCallback(
    (value: { page: number; name: string }) => {
      getProductManufacturer(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListManufacturer((prev: any) => {
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
    [setStateListManufacturer, pushMessage]
  )

  // trigger when change row per page option ( page size )
  const handleChangeRowsPerPage = (event: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
    setStateIndexCollapse(-1)
    setStateCurrentDetailVariant(undefined)
  }
  useEffect(() => {
    const dataHolding = {
      category: '',
      brand: '',
      manufacturer: '',
      instock_gte: '',
      instock_lte: '',
      retail_price_gte: '',
      retail_price_lte: '',
    }
    let count = 0

    // Check if field in query parameter exists in Dataholding and Count
    for (const i in router.query) {
      // eslint-disable-next-line no-prototype-builtins
      if (dataHolding.hasOwnProperty(i)) {
        // ;(DataHolding as any)[i] = router.query[i]
        count++
      }
    }
    // setValue('brand', DataHolding?.brand.split(/[\s,]+/))
    // setValue('manufacturer', DataHolding.manufacturer.split(/[\s,]+/))
    if (
      router?.query?.category &&
      typeof router?.query?.category === 'string'
    ) {
      setValueFilter('category', router?.query?.category.split(','))
    }

    if (router?.query?.brand && typeof router?.query?.brand === 'string') {
      setValueFilter('brand', router?.query?.brand.split(','))
    }

    if (
      router?.query?.manufacturer &&
      typeof router?.query?.manufacturer === 'string'
    ) {
      setValueFilter('manufacturer', router?.query?.manufacturer.split(','))
    }

    setValueFilter(
      'instock_gte',
      typeof router?.query?.instock_gte === 'string'
        ? parseInt(router?.query?.instock_gte)
        : ''
    )
    setValueFilter(
      'instock_lte',
      typeof router?.query?.instock_lte === 'string'
        ? parseInt(router?.query?.instock_lte)
        : ''
    )

    setValueFilter(
      'retail_price_gte',
      typeof router?.query?.retail_price_gte === 'string'
        ? Number(router?.query?.retail_price_gte)
        : ''
    )
    setValueFilter(
      'retail_price_lte',
      typeof router?.query?.retail_price_lte === 'string'
        ? Number(router?.query?.retail_price_lte)
        : ''
    )
    setStateFilter(count)
  }, [router.query])

  //Menu Delete and edit
  const open = Boolean(anchorEl)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleCloseMenuFilter = () => {
    setStateDrawerFilter(false)
  }

  const handleDrawerRetail = () => {
    if (!stateIdProduct) return
    setStateDrawerRetail((prev) => !prev)

    if (stateDrawerRetail) {
      clearErrorsRetail('retail_price')
      return
    }
    // setStateDrawerRetail((prev) => !prev)
    if (stateIdProduct && stateIdProduct?.retail_price) {
      setValueRetail('retail_price', Number(stateIdProduct?.retail_price))
    } else {
      setValueRetail('retail_price', 0)
    }

    // setStateDrawerRetail((prev) => {
    //   return !prev
    // })
  }

  //Dialog setRetail Price

  const {
    handleSubmit: handleSubmitRetail,
    control: controlRetail,
    setValue: setValueRetail,
    clearErrors: clearErrorsRetail,
    trigger: triggerRetail,
    formState: { errors: errorsRetail },
  } = useForm<RetailPriceDataType>({
    resolver: yupResolver(retailSchema),
    mode: 'all',
  })

  // const changeInputForm = (event: any) => {
  //   const {
  //     target: { value },
  //   } = event
  //   const {
  //     target: { name },
  //   } = event
  //   if (!value) {
  //     setValueRetail(name, 0)
  //   } else {
  //     setValueRetail(name, parseFloat(value.replace(/,/g, '')))
  //   }
  // }

  const changeInputFormFilter = (event: any) => {
    // console.log('form', value.value, name)
    // setValueFilter(name, Number(value.value))

    const {
      target: { value },
    } = event
    const {
      target: { name },
    } = event
    if (!value) {
      setValueFilter(name, 0, {
        shouldValidate: true,
      })
    } else {
      setValueFilter(name, parseFloat(value.replace(/,/g, '')), {
        shouldValidate: true,
      })
    }
  }

  const onSubmitRetail = (values: RetailPriceDataType) => {
    setRetailPrice(Number(stateIdProduct?.id), values)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        // detailOrder()
        pushMessage(
          t('list.theProductRetailPriceHasBeenUpdatedSuccessfully'),
          'success'
        )
        handleGetProductInWarehouse({})
        if (stateIndexCollapse !== -1) {
          handleClickCollapseProductVariant(
            Number(stateCurrentDetailVariant?.id)
          )
        }
        setStateDrawerRetail(false)
        // handleDialogSetRetail()
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  //search
  const {
    handleSubmit: handleSubmitSearch,
    control: controlSearch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const {
    handleSubmit: handleSubmitFilter,
    setValue: setValueFilter,
    control: controlFilter,
    getValues: getValuesFilter,
    reset: resetFilter,

    formState: { errors: errorsFilter },
  } = useForm({
    resolver: yupResolver(filterSchema),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitOCR,
    setValue: setValueOCR,
    control: controlOCR,
    getValues: getValuesOCR,
    reset: resetOCR,
    clearErrors: clearErrorsOCR,
    register: registerOCR,
    trigger: triggerOCR,
    watch: watchOCR,
    formState: { errors: errorsOCR },
  } = useForm<ValidateCreateUpdateProductOCRType>({
    resolver: yupResolver(createUpdateProductOCRSchema),
    mode: 'all',
    reValidateMode: 'onSubmit',
  })
  const handleSubmitCreateUpdateProductOCR = (
    value: ValidateCreateUpdateProductOCRType
  ) => {
    dispatch(loadingActions.doLoading())

    const filterCheckItem = value.list_product.filter((item) => item.checked)
    if (filterCheckItem.length === 0) {
      pushMessage('Please fill data of the form', 'error')
      dispatch(loadingActions.doLoadingSuccess())
      return
    }
    const createProductList: CreateProductDetailType[] = []
    const updateProductList: UpdateProductDetailType[] = []
    filterCheckItem.forEach((item) => {
      console.log('forEach', item)
      const submitWarehouse: SubmitWarehouse[] = item.warehouses.map(
        (item) => ({
          warehouse: item.warehouse,
          quantity: item.quantity ? item.quantity : 0,
        })
      )
      if (item.isCreate) {
        const createProduct: CreateProductDetailType = {
          name: item.name!,
          unit_type: item!.unit_type!.toUpperCase(),
          category: Number(
            item!.category!.slice(0, item!.category!.indexOf('-'))
          ),
          brand: Number(item!.brand!.slice(0, item!.brand!.indexOf('-'))),
          price: Number(item.price),
          warehouses: submitWarehouse,
        }
        createProductList.push(createProduct)
      } else {
        const filteredWarehouse = item.warehouses.filter((obj) => ({
          warehouse: obj.warehouse,
          quantity: obj.quantity ? obj.quantity : 0,
        }))
        filteredWarehouse.forEach((obj) => {
          const updateProduct: UpdateProductDetailType = {
            product: Number(item.product),
            warehouse: obj.warehouse,
            quantity: obj.quantity,
          }
          updateProductList.push(updateProduct)
        })
      }
    })
    if (createProductList.length === 0 && updateProductList.length === 0) {
      pushMessage('Please fill data of the form', 'error')

      dispatch(loadingActions.doLoadingSuccess())
      return
    }

    const submitValue: SubmitCreateUpdateOCR = {
      ...(createProductList.length > 0 && {
        create_products: createProductList,
      }),
      ...(updateProductList.length > 0 && {
        update_products: updateProductList,
      }),
    }
    console.log('submitValue', submitValue)
    createUpdateProductByOCR(submitValue)
      .then(() => {
        setStateDrawerOCR(false)
        resetOCR()
        pushMessage('Create Update by OCR successfully', 'success')
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        key: values.key,
        page: 1,
      })}`,
    })
  }

  const handleReset = () => {
    resetFilter({
      category: [],
      brand: [],
      manufacturer: [],
      instock_gte: 0,
      instock_lte: 0,
      retail_price_gte: 0,
      retail_price_lte: 0,
    })
    router.replace({
      search: `${objToStringParam({
        page: 1,
        limit: router.query.limit,
      })}`,
    })
  }

  const onSubmitFilter = (values: any) => {
    console.log('value', values)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        category: values.category.toString(),
        brand: values.brand.toString(),
        manufacturer: values.manufacturer.toString(),
        instock_gte:
          typeof values.instock_gte === 'string'
            ? parseInt(getValuesFilter('instock_gte'))
            : values.instock_gte,
        instock_lte:
          typeof values.instock_lte === 'string'
            ? parseInt(values.instock_lte?.replace(/,/g, ''))
            : values.instock_lte,
        retail_price_gte:
          typeof values.retail_price_gte === 'string'
            ? parseInt(getValuesFilter('retail_price_gte'))
            : getValuesFilter('retail_price_gte'),
        retail_price_lte:
          typeof values.retail_price_lte === 'string'
            ? parseInt(getValuesFilter('retail_price_lte'))
            : getValuesFilter('retail_price_lte'),

        page: 1,
      })}`,
    })
  }
  // change tab
  const handleChangeTab = (event: React.SyntheticEvent, value: string) => {
    console.log(event)
    setStateValueTab(value)
    // handleGetProductInWarehouse({})
    router.replace({
      search: `${objToStringParam({
        page: 1,
        limit: 10,
        status: value,
      })}`,
    })
  }
  const handleCheckGear = () => {
    if (
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Inventory,
        PERMISSION_RULE.ViewDetails
      ) &&
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Inventory,
        platform() === 'SUPPLIER'
          ? PERMISSION_RULE.SupplierUpdate
          : PERMISSION_RULE.MerchantUpdate
      ) &&
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Inventory,
        PERMISSION_RULE.SetRetailPrice
      )
    ) {
      return false
    }

    return true
  }
  const handleClickCollapseProductVariant = (index: number) => {
    dispatch(loadingActions.doLoading())
    getDetailVariant(index)
      .then((res) => {
        const { data } = res.data
        setStateCurrentDetailVariant(data)
        dispatch(loadingActions.doLoadingSuccess())
        // handleDialogSetRetail()
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleChangePaginationForVariant = (e: any, page: number) => {
    console.log(e)
    setStatePage(page)
  }
  const handleChangeRowsPerPageForVariant = (event: any) => {
    setStateRowPerPage(Number(event.target.value))
  }

  const handleFileInput = (e: any) => {
    // setStateListProductInvoice({ data: dumbData })
    // setStateDrawerOCR(true)
    dispatch(loadingActions.doLoading())
    const fileInput = e.target.files[0]
    const formData = new FormData()
    formData.append('file', fileInput)

    getProductByScanInvoice(formData)
      .then((res) => {
        const { data } = res
        setStateDrawerOCR(true)
        setStateListProductInvoice(data)
        console.log('🚀 ~ .then ~ data:', data)
        dispatch(loadingActions.doLoadingSuccess())
        // Coding here
      })
      .catch(({ response }) => {
        const { data, status } = response
        dispatch(loadingActions.doLoadingFailure())
        if (typeof data.data === 'string') {
          return
        }
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleCloseDrawerImportProductByOCR = () => {
    setStateDrawerOCR(false)
    clearErrorsOCR()
    resetOCR()
  }
  const onError = (err: any) => {
    console.log('err', err)
  }
  return (
    <>
      {platform() === 'RETAILER' && (
        <TabsTws
          value={stateValueTab ? stateValueTab : 'EXISTING'}
          onChange={handleChangeTab}
          aria-label="basic tabs example"
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
        >
          <TabCustom label={t('list.existingProduct')} value="EXISTING" />

          {checkPermission(
            arrayPermission,
            KEY_MODULE.Inventory,
            PERMISSION_RULE.ViewBoughtList
          ) && <TabCustom label={t('list.purchaseProducts')} value="BOUGHT" />}
        </TabsTws>
      )}

      <Grid container columnSpacing={'28px'}>
        <Grid xs>
          <form
            onSubmit={handleSubmitSearch(handleSearch)}
            className="form-search"
          >
            <Controller
              control={controlSearch}
              name="key"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="key"
                    error={!!errors.key}
                    placeholder={t('list.searchProductByName')}
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
        </Grid>
        <Grid xs style={{ maxWidth: '78px' }}>
          <Badge
            badgeContent={stateFilter}
            color="primary"
            sx={{ fontSize: '25px' }}
          >
            <ButtonCustom
              onClick={handleOpenFilterDrawer}
              variant="outlined"
              size="large"
              style={{ padding: '14px 0' }}
              sx={{
                border: '1px solid #E1E6EF',
                color: '#49516F',
                minWidth: '50px',
              }}
            >
              <FunnelSimple size={20} />
            </ButtonCustom>
          </Badge>
        </Grid>
        <Grid xs style={{ maxWidth: '288px' }}>
          <Link href={`/${platform().toLowerCase()}/inventory/product/create`}>
            <a>
              <ButtonCustom variant="contained" fullWidth size="large">
                {t('list.addNewProduct')}
              </ButtonCustom>
            </a>
          </Link>
        </Grid>
        <Grid xs style={{ maxWidth: '288px' }}>
          <ButtonCustom
            variant="contained"
            component="label"
            fullWidth
            size="large"
          >
            {t('createWithOcr')}
            <input
              hidden
              accept=".pdf,.png,.jpeg"
              type="file"
              onChange={handleFileInput}
            />
          </ButtonCustom>
        </Grid>
      </Grid>
      {stateProductList?.data?.length === 0 ? (
        <>
          <Grid container spacing={2} justifyContent="center">
            <Grid>
              <Stack
                p={5}
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src={'/' + '/images/not-found.svg'}
                  alt="Logo"
                  width="200"
                  height="200"
                />
                <Typography variant="h6" sx={{ marginTop: '0' }}>
                  {t('list.thereAreNoProductsToShow')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws></TableCellTws>
                  <TableCellTws>Code</TableCellTws>
                  <TableCellTws
                    sx={{
                      width: '200px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {t('list.productName')}
                  </TableCellTws>
                  <TableCellTws width={140}>{t('list.category')}</TableCellTws>
                  <TableCellTws sx={{ minWidth: '150px' }}>
                    {t('list.quantity')}
                  </TableCellTws>
                  {platform() === 'RETAILER' && (
                    <TableCellTws>{t('list.retailPrice')}</TableCellTws>
                  )}

                  <TableCellTws sx={{ minWidth: '100px' }}>
                    {t('list.brand')}
                  </TableCellTws>
                  <TableCellTws sx={{ minWidth: '100px' }}>
                    {t('list.manufacturer')}
                  </TableCellTws>
                  {/* <TableCellTws align="right">Price</TableCellTws> */}
                  {/* {platform() == 'RETAILER' ? (
                    <>
                      <TableCellTws align="right">Retail</TableCellTws>
                    </>
                  ) : (
                    <></>
                  )} */}

                  <TableCellTws>{t('list.status')}</TableCellTws>
                  <TableCellTws>{t('list.haveVariant')}</TableCellTws>

                  <TableCellTws width={200}>{t('list.warehouse')}</TableCellTws>
                  {handleCheckGear() && (
                    <TableCellTws align="center">
                      {t('list.action')}
                    </TableCellTws>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {stateProductList?.data?.map((item, index) => {
                  const fieldWarehouse = item.warehouses
                    .map((warehouse) => warehouse.name)
                    .toString()
                  return (
                    <React.Fragment key={`item-${index}`}>
                      <TableRowTws
                        key={`item-${index}`}
                        hover={checkPermission(
                          arrayPermission,
                          KEY_MODULE.Inventory,
                          PERMISSION_RULE.ViewDetails
                        )}
                        sx={{
                          cursor: checkPermission(
                            arrayPermission,
                            KEY_MODULE.Inventory,
                            PERMISSION_RULE.ViewDetails
                          )
                            ? 'pointer'
                            : '',
                        }}
                        onClick={() => {
                          if (Number(item.variants_count) > 0) {
                            router.push(
                              `/${platform().toLowerCase()}/inventory/product/product-template/${
                                item.id
                              }`
                            )
                          } else {
                            router.push(
                              `/${platform().toLowerCase()}/inventory/product/detail/${
                                item.id
                              }`
                            )
                          }
                        }}
                      >
                        <TableCellTws>
                          {Number(item.variants_count) > 0 && (
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setStateCurrentDetailVariant(undefined)
                                if (stateIndexCollapse === index) {
                                  setStateIndexCollapse(-1)
                                  return
                                }
                                handleClickCollapseProductVariant(item.id)
                                setStateIndexCollapse(index)
                              }}
                            >
                              {stateIndexCollapse === index ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                          )}
                        </TableCellTws>
                        <TableCellTws>
                          <Stack direction="row" alignItems="center">
                            {item.thumbnail ? (
                              <div className={classes['image-container']}>
                                <Image
                                  src={item.thumbnail}
                                  alt="thumbnail"
                                  className={classes['image']}
                                  layout="fill"
                                />
                              </div>
                            ) : (
                              <Image
                                src={'/' + '/images/default-brand.png'}
                                alt="thumbnail"
                                width="50"
                                height="50"
                              />
                            )}

                            {item.code ? '#' + item.code : 'N/A'}
                          </Stack>
                        </TableCellTws>

                        <TableCellTws>
                          {checkPermission(
                            arrayPermission,
                            KEY_MODULE.Inventory,
                            PERMISSION_RULE.ViewDetails
                          ) ? (
                            <Link
                              href={
                                Number(item.variants_count) > 0
                                  ? `/${platform().toLowerCase()}/inventory/product/product-template/${
                                      item.id
                                    }`
                                  : `/${platform().toLowerCase()}/inventory/product/detail/${
                                      item.id
                                    }`
                              }
                            >
                              <a
                                style={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {item.name ? item.name : 'N/A'}
                              </a>
                            </Link>
                          ) : (
                            <Typography
                              sx={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                              }}
                            >
                              {item.name ? item.name : 'N/A'}
                            </Typography>
                          )}
                        </TableCellTws>
                        <TableCellTws>
                          {item.category?.name ? item.category.name : 'N/A'}
                        </TableCellTws>
                        <TableCellTws>
                          <Stack direction="row" alignItems="center">
                            {item.instock
                              ? item.instock.toLocaleString('en-US')
                              : 'N/A'}{' '}
                            {t(`${item.unit_type.toLowerCase()}` as any)}
                            {Number(item.low_stock_alert_level) >=
                              Number(item.instock) && (
                              <Tooltip
                                title={t('list.theStockIsLow')}
                                placement="top"
                              >
                                <WarningCircle
                                  style={{
                                    marginLeft: '5px',
                                    color: '#E02D3C',
                                  }}
                                  size={16}
                                />
                              </Tooltip>
                            )}
                          </Stack>
                        </TableCellTws>
                        {platform() === 'RETAILER' && (
                          <TableCellTws>
                            {item.retail_price
                              ? formatMoney(item.retail_price)
                              : 'N/A'}
                          </TableCellTws>
                        )}

                        <TableCellTws>
                          {item.brand?.name ? item.brand?.name : 'N/A'}
                        </TableCellTws>
                        <TableCellTws>
                          {item.manufacturer?.name
                            ? item.manufacturer?.name
                            : 'N/A'}
                        </TableCellTws>

                        {item.is_active ? (
                          <TableCellTws>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: '#34DC75',
                              }}
                            >
                              {t('list.active')}
                            </Typography>
                          </TableCellTws>
                        ) : (
                          <TableCellTws>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                color: '#E02D3C',
                              }}
                            >
                              {t('list.deactivated')}
                            </Typography>
                          </TableCellTws>
                        )}
                        <TableCellTws>
                          {Number(item.variants_count) > 0
                            ? item.variants_count
                            : 'N/A'}
                        </TableCellTws>
                        <TableCellTws>
                          <Tooltip title={fieldWarehouse} placement="top">
                            <Typography
                              sx={{
                                width: '200px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {item.warehouses.length > 0
                                ? fieldWarehouse
                                : 'N/A'}
                            </Typography>
                          </Tooltip>
                        </TableCellTws>
                        {handleCheckGear() && (
                          <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                            <IconButton
                              onClick={(e) => {
                                setStateIdProduct(item)
                                handleOpenMenu(e)
                                e.stopPropagation()
                              }}
                            >
                              <Gear size={28} />
                            </IconButton>
                          </TableCellTws>
                        )}
                      </TableRowTws>
                      {Number(item.variants_count) > 0 &&
                        stateCurrentDetailVariant?.variants && (
                          <TableRowTws>
                            <TableCellTws
                              sx={{ paddingTop: 0, paddingBottom: 0 }}
                              colSpan={12}
                            >
                              <Collapse
                                in={stateIndexCollapse === index}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box sx={{ padding: '10px 0px' }}>
                                  <Typography
                                    sx={{
                                      marginBottom: '15px',
                                      fontSize: '1.6rem',
                                      fontWeight: 500,
                                    }}
                                  >
                                    {t('list.variantGroupFor')} {item.name}
                                  </Typography>
                                  <Table sx={{ marginBottom: '10px' }}>
                                    <TableHead>
                                      <TableRow>
                                        <TableCellTws>
                                          {t('list.code')}
                                        </TableCellTws>
                                        <TableCellTws>
                                          {t('list.name')}
                                        </TableCellTws>
                                        <TableCellTws>
                                          {t('list.quantity')}
                                        </TableCellTws>
                                        {platform() === 'RETAILER' && (
                                          <TableCellTws>
                                            {t('list.retailPrice')}
                                          </TableCellTws>
                                        )}

                                        {stateCurrentDetailVariant.attributes.map(
                                          (item, index) => {
                                            return (
                                              <TableCellTws key={index}>
                                                {item.name}
                                              </TableCellTws>
                                            )
                                          }
                                        )}

                                        <TableCellTws>
                                          {t('list.status')}
                                        </TableCellTws>
                                        <TableCellTws>
                                          {t('list.action')}
                                        </TableCellTws>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                      {stateCurrentDetailVariant.variants &&
                                        stateCurrentDetailVariant.variants
                                          .slice(
                                            (statePage - 1) * stateRowPerPage,
                                            (statePage - 1) * stateRowPerPage +
                                              stateRowPerPage
                                          )
                                          .map((variant, idx) => {
                                            return (
                                              <TableRow
                                                key={idx}
                                                sx={{ cursor: 'pointer' }}
                                                hover
                                                onClick={() =>
                                                  router.push(
                                                    `/${platform().toLowerCase()}/inventory/product/detail/${
                                                      variant.id
                                                    }`
                                                  )
                                                }
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
                                                        variant.thumbnail
                                                          ? variant.thumbnail
                                                          : '/' +
                                                            '/images/vapeProduct.png'
                                                      }
                                                      width={50}
                                                      height={50}
                                                    />
                                                    <Typography>
                                                      #{variant.code}
                                                    </Typography>
                                                  </Stack>
                                                </TableCellTws>
                                                <TableCellTws>
                                                  {variant.name}
                                                </TableCellTws>
                                                <TableCellTws>
                                                  <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    spacing={2}
                                                  >
                                                    {variant.quantity
                                                      ? variant.quantity.toLocaleString(
                                                          'en-US'
                                                        )
                                                      : 'N/A'}
                                                    {variant.quantity <=
                                                      variant.low_stock_level && (
                                                      <Tooltip
                                                        title="The stock is low"
                                                        arrow
                                                        placement="top"
                                                      >
                                                        <WarningCircle
                                                          style={{
                                                            marginLeft: '5px',
                                                          }}
                                                          weight="fill"
                                                          color="#E02D3C"
                                                          size={18}
                                                        />
                                                      </Tooltip>
                                                    )}
                                                  </Stack>
                                                </TableCellTws>
                                                {platform() === 'RETAILER' && (
                                                  <TableCellTws>
                                                    {variant.retail_price
                                                      ? formatMoney(
                                                          variant.retail_price
                                                        )
                                                      : 'N/A'}
                                                  </TableCellTws>
                                                )}

                                                {variant.attribute_options.map(
                                                  (element, index) => {
                                                    return (
                                                      <TableCellTws key={index}>
                                                        {element.option}
                                                      </TableCellTws>
                                                    )
                                                  }
                                                )}
                                                <TableCellTws>
                                                  {variant.is_active ? (
                                                    <Typography
                                                      sx={{
                                                        fontWeight: 700,
                                                        color: '#34DC75',
                                                      }}
                                                    >
                                                      {t('list.active')}
                                                    </Typography>
                                                  ) : (
                                                    <Typography
                                                      sx={{
                                                        fontWeight: 700,
                                                        color: '#E02D3C',
                                                      }}
                                                    >
                                                      {t('list.deactivated')}
                                                    </Typography>
                                                  )}
                                                </TableCellTws>
                                                <TableCellTws
                                                  width={80}
                                                  sx={{ textAlign: 'center' }}
                                                >
                                                  <IconButton
                                                    onClick={(e) => {
                                                      setStateIdProduct(variant)
                                                      handleOpenMenu(e)
                                                      e.stopPropagation()
                                                    }}
                                                  >
                                                    <Gear size={28} />
                                                  </IconButton>
                                                </TableCellTws>
                                              </TableRow>
                                            )
                                          })}
                                    </TableBody>
                                  </Table>
                                  <Stack
                                    direction="row"
                                    alignItems="center"
                                    justifyContent="flex-end"
                                    spacing={2}
                                  >
                                    <Typography>
                                      {t('list.rowsPerPage')}
                                    </Typography>

                                    <FormControl sx={{ m: 1 }}>
                                      <SelectPaginationCustom
                                        value={stateRowPerPage}
                                        onChange={
                                          handleChangeRowsPerPageForVariant
                                        }
                                        displayEmpty
                                      >
                                        <MenuItemSelectCustom value={10}>
                                          10
                                        </MenuItemSelectCustom>
                                        <MenuItemSelectCustom value={20}>
                                          20
                                        </MenuItemSelectCustom>
                                        <MenuItemSelectCustom value={50}>
                                          50
                                        </MenuItemSelectCustom>
                                        <MenuItemSelectCustom value={100}>
                                          100
                                        </MenuItemSelectCustom>
                                      </SelectPaginationCustom>
                                    </FormControl>
                                    <Pagination
                                      color="primary"
                                      variant="outlined"
                                      shape="rounded"
                                      defaultPage={1}
                                      page={statePage}
                                      onChange={(event, page: number) =>
                                        handleChangePaginationForVariant(
                                          event,
                                          page
                                        )
                                      }
                                      count={
                                        stateCurrentDetailVariant
                                          ? Math.ceil(
                                              Number(
                                                stateCurrentDetailVariant.variants_count
                                              ) / stateRowPerPage
                                            )
                                          : 0
                                      }
                                    />
                                  </Stack>
                                </Box>
                              </Collapse>
                            </TableCellTws>
                          </TableRowTws>
                        )}
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
            <Typography>{t('list.rowsPerPage')}</Typography>

            <FormControl sx={{ m: 1 }}>
              <SelectPaginationCustom
                value={
                  Number(router.query.limit) ? Number(router.query.limit) : 10
                }
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
              page={Number(router.query.page) ? Number(router.query.page) : 1}
              onChange={(event, page: number) =>
                handleChangePagination(event, page)
              }
              count={stateProductList ? stateProductList?.totalPages : 0}
            />
          </Stack>

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
            <MenuItem>
              <Link
                href={
                  stateIdProduct && Number(stateIdProduct?.variants_count) > 0
                    ? `/${platform().toLowerCase()}/inventory/product/product-template/${
                        stateIdProduct?.id
                      }`
                    : `/${platform().toLowerCase()}/inventory/product/detail/${
                        stateIdProduct?.id
                      }`
                }
              >
                <a className="menu-item-action" style={{ textAlign: 'left' }}>
                  {t('list.viewDetails')}
                </a>
              </Link>
            </MenuItem>

            {(platform() === 'SUPPLIER' || stateValueTab === 'EXISTING') && (
              <MenuItem>
                <Link
                  href={
                    stateIdProduct && Number(stateIdProduct?.variants_count) > 0
                      ? `/${platform().toLowerCase()}/inventory/product/update/${
                          stateIdProduct?.id
                        }`
                      : `/${platform().toLowerCase()}/inventory/product/variant-update/${
                          stateIdProduct?.id
                        }`
                  }
                >
                  <a className="menu-item-action" style={{ textAlign: 'left' }}>
                    {t('list.update')}
                  </a>
                </Link>
              </MenuItem>
            )}

            {platform() === 'RETAILER' &&
              stateIdProduct &&
              !stateIdProduct?.variants_count && (
                <MenuItem
                  onClick={() => {
                    handleDrawerRetail()
                    handleCloseMenu()
                  }}
                >
                  {t('list.setProductRetailPrice')}
                </MenuItem>
              )}

            {/* <MenuItem onClick={handleCloseMenu}>Delete</MenuItem> */}
          </MenuAction>
        </>
      )}

      <Drawer
        anchor={'right'}
        open={stateDrawerFilter}
        onClose={handleCloseMenuFilter}
      >
        <Box sx={{ padding: '30px', width: '550px' }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              marginBottom: '10px',
            }}
          >
            <IconButton onClick={handleCloseMenuFilter}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              {t('list.filter')}
            </Typography>
          </Stack>

          <form onSubmit={handleSubmitFilter(onSubmitFilter)}>
            {platform() === 'RETAILER' && (
              <>
                <Typography
                  sx={{
                    color: '#49516F',

                    fontWeight: 500,
                    // fontSize: '1.2rem',
                  }}
                >
                  {t('list.price')}
                </Typography>
                <Stack direction="row" mb={2} spacing={2}>
                  {/* <InputLabelCustom htmlFor="retail_price_gte">Price</InputLabelCustom> */}
                  <Box sx={{ width: '100%' }}>
                    <Controller
                      control={controlFilter}
                      defaultValue=""
                      name="retail_price_gte"
                      render={({ field }) => (
                        <Box>
                          <FormControl fullWidth>
                            <NumericFormatCustom
                              id="retail_price_gte"
                              placeholder="0"
                              {...field}
                              thousandSeparator=","
                              allowNegative={false}
                              onChange={changeInputFormFilter}
                              // onValueChange={(event: any) =>
                              //   field.onChange(() =>
                              //     changeInputFormFilter('retail_price_gte', event)
                              //   )
                              // }

                              onKeyPress={(event: any) => {
                                if (hasSpecialCharacterPrice(event.key)) {
                                  event.preventDefault()
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {t('list.from')} $
                                  </InputAdornment>
                                ),
                              }}
                              decimalScale={2}
                              error={!!errorsFilter.retail_price_gte}
                              customInput={TextField}
                            />
                          </FormControl>
                          <FormHelperText error>
                            {errorsFilter.retail_price_gte &&
                              `${errorsFilter.retail_price_gte.message}`}
                          </FormHelperText>
                        </Box>
                      )}
                    />
                  </Box>
                  <Box sx={{ width: '100%' }}>
                    <Controller
                      control={controlFilter}
                      defaultValue=""
                      name="retail_price_lte"
                      render={({ field }) => (
                        <Box>
                          <FormControl fullWidth>
                            <NumericFormatCustom
                              thousandSeparator=","
                              sx={{ borderColor: '#E1E6EF' }}
                              id="retail_price_lte"
                              placeholder="0"
                              {...field}
                              allowNegative={false}
                              onChange={changeInputFormFilter}
                              // onValueChange={(event: any) =>
                              //   field.onChange(() =>
                              //     changeInputFormFilter('retail_price_lte', event)
                              //   )
                              // }
                              onKeyPress={(event: any) => {
                                if (hasSpecialCharacterPrice(event.key)) {
                                  event.preventDefault()
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {t('list.to')} $
                                  </InputAdornment>
                                ),
                              }}
                              decimalScale={2}
                              error={!!errorsFilter.retail_price_lte}
                              customInput={TextField}
                            ></NumericFormatCustom>
                          </FormControl>
                          <FormHelperText error>
                            {errorsFilter.retail_price_lte &&
                              `${errorsFilter.retail_price_lte.message}`}
                          </FormHelperText>
                        </Box>
                      )}
                    />
                  </Box>
                </Stack>
              </>
            )}

            <Typography
              sx={{
                color: '#49516F',

                fontWeight: 500,
              }}
            >
              {t('list.quantity')}
            </Typography>
            <Stack mb={2} spacing={1}>
              <Stack direction="row" spacing={2}>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    control={controlFilter}
                    defaultValue=""
                    name="instock_gte"
                    render={({ field }) => (
                      <Box>
                        <FormControl fullWidth>
                          <NumericFormatCustom
                            id="instock_gte"
                            placeholder="0"
                            {...field}
                            thousandSeparator=","
                            onChange={changeInputFormFilter}
                            // onValueChange={(event: any) =>
                            //   field.onChange(() =>
                            //     changeInputFormFilter('instock_gte', event)
                            //   )
                            // }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {t('list.from')}
                                </InputAdornment>
                              ),
                            }}
                            allowNegative={false}
                            onKeyPress={(event: any) => {
                              if (hasSpecialCharacterPrice(event.key)) {
                                event.preventDefault()
                              }
                            }}
                            decimalScale={0}
                            error={!!errorsFilter.instock_gte}
                            customInput={TextField}
                          />
                        </FormControl>
                        <FormHelperText error>
                          {errorsFilter.instock_gte &&
                            `${errorsFilter.instock_gte.message}`}
                        </FormHelperText>
                      </Box>
                    )}
                  />
                </Box>
                <Box sx={{ width: '100%' }}>
                  <Controller
                    control={controlFilter}
                    defaultValue=""
                    name="instock_lte"
                    render={({ field }) => (
                      <Box>
                        <FormControl fullWidth>
                          <NumericFormatCustom
                            id="instock_lte"
                            placeholder="0"
                            {...field}
                            thousandSeparator=","
                            onChange={changeInputFormFilter}
                            // onValueChange={(event: any) =>
                            //   field.onChange(() =>
                            //     changeInputFormFilter('instock_lte', event)
                            //   )
                            // }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  {t('list.to')}
                                </InputAdornment>
                              ),
                            }}
                            allowNegative={false}
                            onKeyPress={(event: any) => {
                              if (hasSpecialCharacterPrice(event.key)) {
                                event.preventDefault()
                              }
                            }}
                            decimalScale={0}
                            error={!!errorsFilter.instock_lte}
                            customInput={TextField}
                          />
                        </FormControl>
                        <FormHelperText error>
                          {errorsFilter.instock_lte &&
                            `${errorsFilter.instock_lte.message}`}
                        </FormHelperText>
                      </Box>
                    )}
                  />
                </Box>
              </Stack>
            </Stack>
            <Stack spacing={2} sx={{ marginBottom: '20px' }}>
              <Box sx={{ width: '100%' }}>
                <Typography
                  sx={{
                    color: '#49516F',

                    fontWeight: 500,
                    // fontSize: '1.2rem',
                  }}
                >
                  {t('list.category')}
                </Typography>
                <Controller
                  control={controlFilter}
                  name="category"
                  defaultValue={[]}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <SelectCustom
                        id="category"
                        displayEmpty
                        IconComponent={() => <KeyboardArrowDownIcon />}
                        renderValue={(value: any) => {
                          if (!value) {
                            return (
                              <PlaceholderSelect>
                                <div>{t('list.selectCategory')}</div>
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
                          propData={stateListCategory}
                          handleSearch={(value) => {
                            setStateListCategory({ data: [] })
                            handleGetCategory(value)
                          }}
                          fetchMore={(value) => {
                            fetchMoreDataCategory(value)
                          }}
                          onClickSelectItem={(item: string[]) => {
                            setValueFilter('category', item)
                          }}
                          propsGetValue={getValuesFilter('category')}
                          propName="name"
                        />
                      </SelectCustom>
                    </FormControl>
                  )}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography
                  sx={{
                    color: '#49516F',

                    fontWeight: 500,
                    // fontSize: '1.2rem',
                  }}
                >
                  {t('list.manufacturer')}
                </Typography>
                <Controller
                  control={controlFilter}
                  name="manufacturer"
                  defaultValue={[]}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <SelectCustom
                        id="manufacturer"
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => <KeyboardArrowDownIcon />}
                        renderValue={(value: any) => {
                          if (!value) {
                            return (
                              <PlaceholderSelect>
                                <div>{t('list.selectManufacturer')}</div>
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
                          propData={stateListManufacturer}
                          handleSearch={(value) => {
                            setStateListManufacturer({ data: [] })
                            handleGetManufacturer(value)
                          }}
                          fetchMore={(value) => {
                            fetchMoreDataManufacturer(value)
                          }}
                          onClickSelectItem={(item: string[]) => {
                            setValueFilter('manufacturer', item)
                          }}
                          propsGetValue={getValuesFilter('manufacturer')}
                          propName="name"
                        />
                      </SelectCustom>
                    </FormControl>
                  )}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                {' '}
                <Typography
                  sx={{
                    color: '#49516F',

                    fontWeight: 500,
                    // fontSize: '1.2rem',
                  }}
                >
                  {t('list.brand')}
                </Typography>
                <Controller
                  control={controlFilter}
                  name="brand"
                  defaultValue={[]}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <SelectCustom
                        id="brand"
                        displayEmpty
                        defaultValue=""
                        IconComponent={() => <KeyboardArrowDownIcon />}
                        renderValue={(value: any) => {
                          if (!value) {
                            return (
                              <PlaceholderSelect>
                                <div>{t('list.selectBrand')}</div>
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
                          propData={stateListBrand}
                          handleSearch={(value) => {
                            setStateListBrand({ data: [] })
                            handleGetBrand(value)
                          }}
                          fetchMore={(value) => {
                            fetchMoreDataBrand(value)
                          }}
                          onClickSelectItem={(item: string[]) => {
                            setValueFilter('brand', item)
                          }}
                          propsGetValue={getValuesFilter('brand')}
                          propName="name"
                        />
                      </SelectCustom>
                    </FormControl>
                  )}
                />
              </Box>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <ButtonCancel
                type="reset"
                onClick={handleReset}
                size="large"
                sx={{ color: '#49516F' }}
              >
                {t('list.reset')}
              </ButtonCancel>
              <ButtonCustom variant="contained" size="large" type="submit">
                {t('list.filter')}
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Drawer>
      {platform() == 'RETAILER' && (
        <Drawer
          anchor="right"
          open={stateDrawerRetail}
          onClose={handleDrawerRetail}
        >
          <Box sx={{ padding: '30px', width: '550px' }}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{
                marginBottom: '10px',
              }}
            >
              <IconButton onClick={handleDrawerRetail}>
                <ArrowRight size={24} />
              </IconButton>
              <Typography
                sx={{
                  fontSize: '2.4rem',
                  fontWeight: 700,
                  color: '#49516F',
                }}
              >
                {t('list.setProductRetailPrice')}
              </Typography>
            </Stack>

            <Typography sx={{ textAlign: 'left', marginBottom: '10px' }}>
              {t('list.pleaseEnterTheRetailPriceForTheProduct')}
            </Typography>
            <form
              onSubmit={handleSubmitRetail(onSubmitRetail)}
              // className={classes['cancel-dialog']}
            >
              <Controller
                control={controlRetail}
                name="retail_price"
                render={() => {
                  return (
                    <Box sx={{ marginBottom: '20px' }}>
                      <FormControl fullWidth>
                        <div className={classes['input-number-retail']}>
                          <CurrencyNumberFormat
                            propValue={(value) => {
                              console.log('Setting', value)
                              setValueRetail('retail_price', Number(value))
                              triggerRetail('retail_price')
                            }}
                            defaultPrice={
                              stateIdProduct?.retail_price
                                ? stateIdProduct?.retail_price.toFixed(2)
                                : 0
                            }
                            error={!!errorsRetail.retail_price}
                          />
                        </div>
                        <FormHelperText error={!!errorsRetail.retail_price}>
                          {errorsRetail.retail_price &&
                            `${errorsRetail.retail_price.message}`}
                        </FormHelperText>
                      </FormControl>
                    </Box>
                  )
                }}
              />
              <Stack spacing={2} direction="row">
                <ButtonCancel
                  variant="outlined"
                  size="large"
                  onClick={handleDrawerRetail}
                >
                  {t('list.cancel')}
                </ButtonCancel>
                <ButtonCustom
                  variant="contained"
                  size="large"
                  type="submit"
                  onClick={handleSubmitRetail(onSubmitRetail)}
                >
                  {t('list.submit')}
                </ButtonCustom>
              </Stack>
            </form>
          </Box>
        </Drawer>
      )}
      <Drawer
        anchor="right"
        open={stateDrawerOCR}
        onClose={handleCloseDrawerImportProductByOCR}
      >
        <Box sx={{ padding: '25px', width: '1000px' }}>
          <form
            onSubmit={handleSubmitOCR(
              handleSubmitCreateUpdateProductOCR,
              onError
            )}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ marginBottom: '15px' }}
            >
              <IconButton onClick={handleCloseDrawerImportProductByOCR}>
                <ArrowRight size={24} />
              </IconButton>
              <Typography
                sx={{
                  fontSize: '2.4rem',
                  fontWeight: 700,
                  color: '#49516F',
                }}
              >
                {t('importProductByOcr')}
              </Typography>
            </Stack>
            <Box sx={{ marginBottom: '15px' }}>
              {stateListProductInvoice?.data.table.map((item, index) => {
                return (
                  <ProductInInvoiceComponent
                    control={controlOCR}
                    invoiceProduct={item}
                    index={index}
                    key={index}
                    isLastIndex={
                      index === stateListProductInvoice?.data.table.length - 1
                    }
                    setValue={setValueOCR}
                    trigger={triggerOCR}
                    watch={watchOCR}
                    propsDataForCategory={stateListCategoryForInvoice}
                    propsDataForBrand={stateListBrandForInvoice}
                    setStateListCategory={() =>
                      setStateListCategoryForInvoice({ data: [] })
                    }
                    handleGetCategoryWithValue={(value: string | null) =>
                      handleGetCategoryForInvoice(value)
                    }
                    fetchMoreCategory={(value: {
                      page: number
                      name: string
                    }) => fetchMoreDataCategoryForInvoice(value)}
                    clearError={clearErrorsOCR}
                    getValues={getValuesOCR}
                    setStateListBrand={() =>
                      setStateListBrandForInvoice({ data: [] })
                    }
                    handleGetBrandWithValue={(value: string | null) =>
                      handleGetBrandForInvoice(value)
                    }
                    fetchMoreBrand={(value: { page: number; name: string }) =>
                      fetchMoreDataBrandForInvoice(value)
                    }
                    register={registerOCR}
                    listWarehouse={stateListWarehouse}
                    errors={errorsOCR}
                  />
                )
              })}
            </Box>
            <Stack direction="row" spacing={2}>
              <ButtonCancel
                size="large"
                onClick={handleCloseDrawerImportProductByOCR}
              >
                {t('cancel')}
              </ButtonCancel>
              <ButtonCustom type="submit" size="large" variant="contained">
                {t('submit')}
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Drawer>
    </>
  )
}

export default ListProductComponent
