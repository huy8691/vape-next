/* eslint-disable react-hooks/exhaustive-deps */
//React/Next
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

//API
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  getDetailVariant,
  getProductBrand,
  getProductCategory,
  getProductInWarehouse,
  getProductManufacturer,
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
  // Dialog,
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
  useMediaQuery,
  useTheme,
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
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldSearchCustom,
} from 'src/components'
import {
  KEY_MODULE,
  PERMISSION_RULE,
  checkPermission,
  handlerGetErrMessage,
  isEmptyObject,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import {
  ListProductDataType,
  ProductBrandResponseType,
  ProductCategoryResponseType,
  ProductData,
  ProductManufacturerResponseType,
  VariantDetailType,
} from './modelProduct'

import moment from 'moment'
import Image from 'next/image'
import { useCallback } from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import classes from './styles.module.scss'
import { filterSchema, schema } from './validations'

import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { NumericFormat } from 'react-number-format'
// import { RetailPriceDataType } from '../detail/modelProductDetail'
// import { setRetailPriceAPI } from '../detail/apiProductDetail'

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

const ListProductComponent: React.FC = () => {
  const { t } = useTranslation('dc')

  const [pushMessage] = useEnqueueSnackbar()
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const [stateIndexCollapse, setStateIndexCollapse] = useState(-1)
  const [stateCurrentDetailVariant, setStateCurrentDetailVariant] =
    useState<VariantDetailType>()
  const [statePage, setStatePage] = useState(1)
  const [stateRowPerPage, setStateRowPerPage] = useState(10)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)
  const [filter, setFilter] = useState<number>()
  const [stateListCategory, setStateListCategory] =
    useState<ProductCategoryResponseType>({ data: [] })
  const [stateListBrand, setStateListBrand] =
    useState<ProductBrandResponseType>({
      data: [],
    })
  const [stateListManufacturer, setStateListManufacturer] =
    useState<ProductManufacturerResponseType>({
      data: [],
    })

  const router = useRouter()
  const dispatch = useAppDispatch()

  // state use for
  const [stateProductList, setStateProductList] =
    useState<ListProductDataType>()
  const [stateIdProduct, setStateIdProduct] = useState<ProductData>()
  const theme = useTheme()

  const isMdScr = useMediaQuery(theme.breakpoints.down('md'))
  const isSmScr = useMediaQuery(theme.breakpoints.down('sm'))

  const screen = isSmScr ? 'small' : isMdScr ? 'medium' : 'large'
  //Dialog
  // const [stateOpenDialog, setStateOpenDialog] = useState(false)

  const handleGetProductInWarehouse = (query: any) => {
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
  }

  const handleGetWareHouseBelongToUser = useCallback(() => {
    if (router.asPath.length !== router.pathname.length) {
      if (router.query.key) {
        setValueFilter('key', router.query.key)
      }
      if (!isEmptyObject(router.query)) {
        handleGetProductInWarehouse(router.query)
      }
    } else {
      handleGetProductInWarehouse({})
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
  }

  //handle Open modal
  const handleOpenFilterModal = useCallback(() => {
    handleGetCategory('')
    handleGetBrand('')
    handleGetManufacturer('')
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
  }
  useEffect(() => {
    const dataHolding = {
      category: '',
      brand: '',
      manufacturer: '',
      instock_gte: '',
      instock_lte: '',
      price_gte: '',
      price_lte: '',
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
      'price_gte',
      typeof router?.query?.price_gte === 'string'
        ? Number(router?.query?.price_gte)
        : ''
    )
    setValueFilter(
      'price_lte',
      typeof router?.query?.price_lte === 'string'
        ? Number(router?.query?.price_lte)
        : ''
    )
    setFilter(count)
  }, [router.query])

  //Menu Delete and edit
  const open = Boolean(anchorEl)
  const openFilter = Boolean(anchorFilter)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleOpenMenuFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorFilter(event.currentTarget)
    handleOpenFilterModal()
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleCloseMenuFilter = () => {
    setAnchorFilter(null)
  }

  // const handleDialogSetRetail = () => {
  //   for (const i in stateProductList?.data) {
  //     if (stateProductList?.data[Number(i)].id === stateIdProduct) {
  //       setValueRetail(
  //         'retail_price',
  //         Number(
  //           stateProductList?.data[Number(i)]?.new_information_product
  //             .retail_price
  //         )
  //       )
  //     }
  //   }
  //   setStateOpenDialog(!stateOpenDialog)
  // }

  //Dialog setRetail Price

  // const {
  //   handleSubmit: handleSubmitRetail,
  //   control: controlRetail,
  //   setValue: setValueRetail,
  //   formState: { errors: errorsRetail },
  // } = useForm<RetailPriceDataType>({
  //   resolver: yupResolver(retailSchema),
  //   mode: 'all',
  // })

  // const changeInputForm = (event: any) => {
  //   const {
  //     target: { value },
  //   } = event
  //   const {
  //     target: { name },
  //   } = event
  //   if (!value) {
  //     setValueRetail(name, 0, {
  //       shouldValidate: true,
  //     })
  //   } else {
  //     setValueRetail(name, parseFloat(value.replace(/,/g, '')), {
  //       shouldValidate: true,
  //     })
  //   }
  // }

  const changeInputFormFilter = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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

  // const onSubmitRetail = (values: RetailPriceDataType) => {
  //   setRetailPriceAPI(`${stateIdProduct}`, values)
  //     .then(() => {
  //       dispatch(loadingActions.doLoadingSuccess())
  //       // detailOrder()
  //       pushMessage(
  //         `The product retail price has been updated successfully`,
  //         'success'
  //       )
  //       handleGetProductInWarehouse({})
  //       handleDialogSetRetail()
  //     })
  //     .catch((response) => {
  //       dispatch(loadingActions.doLoadingFailure())
  //       const { status, data } = response.response
  //       pushMessage(handlerGetErrMessage(status, data), 'error')
  //     })
  // }

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
    resolver: yupResolver(filterSchema(t)),
    mode: 'all',
  })

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
      price_gte: 0,
      price_lte: 0,
    })

    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: 1,
        limit: router.query.limit,
        category: null,
        brand: null,
        manufacturer: null,
        instock_gte: 0,
        instock_lte: 0,
        price_gte: 0,
        price_lte: 0,
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
            ? parseInt(values.instock_gte?.replace(/,/g, ''))
            : values.instock_gte,
        instock_lte:
          typeof values.instock_lte === 'string'
            ? parseInt(values.instock_lte?.replace(/,/g, ''))
            : values.instock_lte,
        price_gte:
          typeof values.price_gte === 'string'
            ? parseInt(values.price_gte?.replace(/,/g, ''))
            : values.price_gte,
        price_lte:
          typeof values.price_lte === 'string'
            ? parseInt(values.price_lte?.replace(/,/g, ''))
            : values.price_lte,

        page: 1,
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
    getDetailVariant(index, Number(router.query.id))
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
  //
  return (
    <>
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
                    sx={{ height: { md: 'auto', lg: 'auto', sm: '40px' } }}
                    id="key"
                    error={!!errors.key}
                    placeholder="Search Product by name..."
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
            badgeContent={filter}
            color="primary"
            sx={{
              fontSize: '25px',
            }}
          >
            <ButtonCustom
              onClick={(e: React.MouseEvent<HTMLElement>) =>
                handleOpenMenuFilter(e)
              }
              variant="outlined"
              size="large"
              style={{ padding: '14px 0' }}
              sx={{
                border: '1px solid #E1E6EF',
                color: '#49516F',
                height: { md: 'auto', lg: 'auto', sm: '40px' },
                minWidth: { md: '50px', lg: '50px', sm: '40px' },
              }}
            >
              <FunnelSimple size={20} />
            </ButtonCustom>
          </Badge>
        </Grid>
        <Grid xs style={{ maxWidth: '288px' }}>
          <Link href={`/${platform().toLowerCase()}/inventory/product/create`}>
            <a>
              <ButtonCustom
                variant="contained"
                fullWidth
                sx={{
                  '&.MuiButton-sizeMedium': {
                    fontSize: '1.2rem',
                  },
                }}
                size={screen}
              >
                {t('addNewProduct')}
              </ButtonCustom>
            </a>
          </Link>
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
                  There are no products to show
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
                  <TableCellTws width={200}>{t('code')}</TableCellTws>
                  <TableCellTws
                  // sx={{
                  //   width: '200px',
                  //   whiteSpace: 'nowrap',
                  //   overflow: 'hidden',
                  //   textOverflow: 'ellipsis',
                  // }}
                  >
                    {t('productName')}
                  </TableCellTws>
                  <TableCellTws>{t('category')}</TableCellTws>
                  <TableCellTws>{t('quantity')}</TableCellTws>
                  <TableCellTws>{t('category')}</TableCellTws>
                  <TableCellTws>{t('manufacturer')}</TableCellTws>
                  {/* <TableCellTws align="right">Price</TableCellTws> */}
                  {/* {platform() == 'RETAILER' ? (
                    <>
                      <TableCellTws align="right">Retail</TableCellTws>
                    </>
                  ) : (
                    <></>
                  )} */}

                  <TableCellTws>{t('status')}</TableCellTws>
                  <TableCellTws>{t('haveVariant')}</TableCellTws>

                  <TableCellTws width={200}>{t('updatedDate')}</TableCellTws>
                  {handleCheckGear() && (
                    <TableCellTws align="center">{t('action')}</TableCellTws>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {stateProductList?.data?.map((item, index) => (
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
                        if (item.variants_count > 0) {
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
                        {item.variants_count > 0 && (
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
                                width="50"
                                height="50"
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

                      <TableCellTws

                      // sx={{
                      //   width: '100px !important',
                      //   whiteSpace: 'nowrap',
                      //   overflow: 'hidden',
                      //   textOverflow: 'ellipsis',
                      // }}
                      >
                        {checkPermission(
                          arrayPermission,
                          KEY_MODULE.Inventory,
                          PERMISSION_RULE.ViewDetails
                        ) ? (
                          <Link
                            href={
                              item.variants_count > 0
                                ? `/${platform().toLowerCase()}/inventory/product/product-template/${
                                    item.id
                                  }`
                                : `/${platform().toLowerCase()}/inventory/product/detail/${
                                    item.id
                                  }`
                            }
                          >
                            <a
                            // style={{
                            //   overflow: 'hidden',
                            //   textOverflow: 'ellipsis',
                            //   display: '-webkit-box',
                            //   WebkitLineClamp: 2,
                            //   WebkitBoxOrient: 'vertical',
                            // }}
                            >
                              {item.name ? item.name : 'N/A'}
                            </a>
                          </Link>
                        ) : (
                          <Typography
                          // sx={{
                          //   overflow: 'hidden',
                          //   textOverflow: 'ellipsis',
                          //   display: '-webkit-box',
                          //   WebkitLineClamp: 2,
                          //   WebkitBoxOrient: 'vertical',
                          // }}
                          >
                            {item.name ? item.name : 'N/A'}
                          </Typography>
                        )}
                      </TableCellTws>
                      <TableCellTws>
                        {item.category.name ? item.category.name : 'N/A'}
                      </TableCellTws>
                      <TableCellTws>
                        <Stack direction="row" alignItems="center">
                          {item.stockAll
                            ? item.stockAll.toLocaleString('en-US')
                            : 'N/A'}{' '}
                          {item.unit_type.toLowerCase()}
                          {item.warning_low_stock_alert && (
                            <Tooltip
                              title="The stock is low!"
                              placement="bottom-start"
                            >
                              <WarningCircle
                                style={{ marginLeft: '5px', color: '#E02D3C' }}
                                size={16}
                              />
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCellTws>
                      <TableCellTws>
                        {item.brand.name ? item.brand.name : 'N/A'}
                      </TableCellTws>
                      <TableCellTws>
                        {item.manufacturer.name
                          ? item.manufacturer.name
                          : 'N/A'}
                      </TableCellTws>
                      {/* <TableCellTws align="right">
                      {item.price ? formatMoney(item.price) : 'N/A'}
                    </TableCellTws> */}
                      {/* {platform() == 'RETAILER' && (
                      <>
                        {' '}
                        <TableCellTws align="right">
                          {item.new_information_product &&
                          item.new_information_product.retail_price
                            ? formatMoney(
                                item.new_information_product.retail_price
                              )
                            : 'N/A'}
                        </TableCellTws>
                      </>
                    )} */}
                      {item.is_active ? (
                        <TableCellTws style={{ color: '#1DB46A' }}>
                          {t('active')}
                        </TableCellTws>
                      ) : (
                        <TableCellTws style={{ color: '#E02D3C' }}>
                          {t('deactive')}
                        </TableCellTws>
                      )}
                      <TableCellTws>
                        {item.variants_count > 0 ? item.variants_count : 'N/A'}
                      </TableCellTws>
                      <TableCellTws>
                        {item.updated_at
                          ? moment(item.updated_at).format(
                              'MM/DD/YYYY - hh:mm A'
                            )
                          : 'N/A'}
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
                    {item.variants_count > 0 &&
                      stateCurrentDetailVariant?.variants && (
                        <TableRowTws>
                          <TableCellTws
                            sx={{ paddingTop: 0, paddingBottom: 0 }}
                            colSpan={11}
                          >
                            <Collapse
                              in={stateIndexCollapse === index}
                              timeout="auto"
                              unmountOnExit
                            >
                              <Box sx={{ padding: '15px' }}>
                                <Typography
                                  sx={{
                                    marginBottom: '15px',
                                    fontSize: '1.6rem',
                                    fontWeight: 500,
                                  }}
                                >
                                  {t('variantGroupFor')} {item.name}
                                </Typography>
                                <Table sx={{ marginBottom: '10px' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCellTws>
                                        {t('codeColumn')}
                                      </TableCellTws>
                                      <TableCellTws>{t('name')}</TableCellTws>
                                      <TableCellTws>
                                        {t('quantity')}
                                      </TableCellTws>
                                      {stateCurrentDetailVariant.attributes.map(
                                        (item, index) => {
                                          return (
                                            <TableCellTws key={index}>
                                              {item.name}
                                            </TableCellTws>
                                          )
                                        }
                                      )}
                                      <TableCellTws>{t('status')}</TableCellTws>
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
                                          console.log('variant', variant)
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
                                                {variant.quantity}
                                              </TableCellTws>
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
                                                    {t('active')}
                                                  </Typography>
                                                ) : (
                                                  <Typography
                                                    sx={{
                                                      fontWeight: 700,
                                                      color: '#E02D3C',
                                                    }}
                                                  >
                                                    {t('deactive')}
                                                  </Typography>
                                                )}
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
                                  <Typography>{t('rowsPerPage')}</Typography>

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
                ))}
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
                  stateIdProduct && stateIdProduct?.variants_count > 0
                    ? `/${platform().toLowerCase()}/inventory/product/product-template/${
                        stateIdProduct?.id
                      }`
                    : `/${platform().toLowerCase()}/inventory/product/detail/${
                        stateIdProduct?.id
                      }`
                }
              >
                <a className="menu-item-action" style={{ textAlign: 'left' }}>
                  {t('viewDetail')}
                </a>
              </Link>
            </MenuItem>
            {/* check again for sure *}
            {/* {(platform() === 'SUPPLIER' || stateValueTab === 'EXISTING') && (
              <MenuItem>
                <Link
                  href={
                    stateIdProduct && stateIdProduct?.variants_count > 0
                      ? `/${platform().toLowerCase()}/inventory/product/update/${
                          stateIdProduct?.id
                        }`
                      : `/${platform().toLowerCase()}/inventory/product/variant-update/${
                          stateIdProduct?.id
                        }`
                  }
                >
                  <a className="menu-item-action" style={{ textAlign: 'left' }}>
                    Update
                  </a>
                </Link>
              </MenuItem>
            )} */}

            {/* {platform() === 'RETAILER' &&
              stateIdProduct &&
              stateIdProduct?.variants_count === 0 && (
                <MenuItem
                  onClick={() => {
                    handleDrawerRetail()
                    handleCloseMenu()
                  }}
                >
                  Set Retail Price
                </MenuItem>
              )} */}

            {/* <MenuItem onClick={handleCloseMenu}>Delete</MenuItem> */}
          </MenuAction>
        </>
      )}
      <Drawer
        anchor={'right'}
        open={openFilter}
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
              {t('filter')}
            </Typography>
          </Stack>

          <form onSubmit={handleSubmitFilter(onSubmitFilter)}>
            <Typography
              sx={{
                color: '#49516F',

                fontWeight: 500,
                // fontSize: '1.2rem',
              }}
            >
              {'price'}
            </Typography>
            <Stack direction="row" mb={2} spacing={2}>
              {/* <InputLabelCustom htmlFor="price_gte">Price</InputLabelCustom> */}
              <Box sx={{ width: '100%' }}>
                {' '}
                <Controller
                  control={controlFilter}
                  defaultValue=""
                  name="price_gte"
                  render={({ field }) => (
                    <Box>
                      <FormControl fullWidth>
                        <NumericFormatCustom
                          id="price_gte"
                          placeholder="0"
                          {...field}
                          thousandSeparator=","
                          allowNegative={false}
                          onChange={changeInputFormFilter}
                          // onValueChange={(event: any) =>
                          //   field.onChange(() =>
                          //     changeInputFormFilter('price_gte', event)
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
                                {t('from')} $
                              </InputAdornment>
                            ),
                          }}
                          decimalScale={2}
                          error={!!errorsFilter.price_gte}
                          customInput={TextField}
                        />
                      </FormControl>
                      <FormHelperText error>
                        {errorsFilter.price_gte &&
                          `${errorsFilter.price_gte.message}`}
                      </FormHelperText>
                    </Box>
                  )}
                />
              </Box>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={controlFilter}
                  defaultValue=""
                  name="price_lte"
                  render={({ field }) => (
                    <Box>
                      <FormControl fullWidth>
                        <NumericFormatCustom
                          thousandSeparator=","
                          sx={{ borderColor: '#E1E6EF' }}
                          id="price_lte"
                          placeholder="0"
                          {...field}
                          allowNegative={false}
                          onChange={changeInputFormFilter}
                          // onValueChange={(event: any) =>
                          //   field.onChange(() =>
                          //     changeInputFormFilter('price_lte', event)
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
                                {t('to')} $
                              </InputAdornment>
                            ),
                          }}
                          decimalScale={2}
                          error={!!errorsFilter.price_lte}
                          customInput={TextField}
                        ></NumericFormatCustom>
                      </FormControl>
                      <FormHelperText error>
                        {errorsFilter.price_lte &&
                          `${errorsFilter.price_lte.message}`}
                      </FormHelperText>
                    </Box>
                  )}
                />
              </Box>
            </Stack>
            <Typography
              sx={{
                color: '#49516F',

                fontWeight: 500,
              }}
            >
              {t('quantity')}
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
                                  {t('from')}
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
                                  {t('to')}
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
                  {t('category')}
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
                                <div>{t('selectCategory')}</div>
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
                  {t('manufacturer')}
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
                                <div>{t('selectManufacturer')}</div>
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
                  {t('brand')}
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
                                <div>{t('selectBrand')}</div>
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
                fullWidth
                sx={{ color: '#49516F' }}
              >
                {t('reset')}
              </ButtonCancel>
              <ButtonCustom variant="contained" fullWidth type="submit">
                {t('filter')}
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Drawer>

      {/* {platform() == 'RETAILER' ? (
        <Dialog
          open={stateOpenDialog}
          onClose={handleDialogSetRetail}
          sx={{ padding: '50px' }}
        >
          <DialogTitleTws>
            <IconButton onClick={handleDialogSetRetail}>
              <X size={20} />
            </IconButton>
          </DialogTitleTws>

          <TypographyH2
            sx={{ fontSize: '2.4rem', marginBottom: '0px' }}
            alignSelf="center"
          >
            Set Product Retail Price
          </TypographyH2>

          <DialogContentTws>
            <DialogContentTextTws
              sx={{ textAlign: 'left', marginBottom: '10px' }}
            >
              Please enter the retail price for the product
            </DialogContentTextTws>
            <form
              onSubmit={handleSubmitRetail(onSubmitRetail)}
              // className={classes['cancel-dialog']}
            >
              <Grid container xs mb={2}>
                <Controller
                  control={controlRetail}
                  name="retail_price"
                  defaultValue={0}
                  render={({ field }) => {
                    return (
                      <>
                        <FormControl fullWidth>
                          <div className={classes['input-number-retail']}>
                            <NumericFormat
                              // sx={{ width: '100%' }}
                              id="retail_price"
                              placeholder="0"
                              {...field}
                              thousandSeparator=","
                              onChange={(event: any) => changeInputForm(event)}
                              allowNegative={false}
                              onKeyPress={(event: any) => {
                                if (hasSpecialCharacterPrice(event.key)) {
                                  event.preventDefault()
                                }
                              }}
                              decimalScale={2}
                              error={!!errorsRetail.retail_price}
                              customInput={TextField}
                              // customInput={(field) => <TextFieldCustom variant='outlined' {...field} />}
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
          </DialogContentTws>
          <DialogActionsTws>
            <Stack spacing={2} direction="row" justifyContent="space-between">
              <ButtonCancel
                variant="outlined"
                size="large"
                onClick={handleDialogSetRetail}
              >
                Cancel
              </ButtonCancel>
              <ButtonCustom
                variant="contained"
                size="large"
                type="submit"
                onClick={handleSubmitRetail(onSubmitRetail)}
              >
                Submit
              </ButtonCustom>
            </Stack>
          </DialogActionsTws>
        </Dialog>
      ) : (
        <></>
      )} */}
    </>
  )
}

export default ListProductComponent
