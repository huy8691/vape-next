import { yupResolver } from '@hookform/resolvers/yup'
import {
  Badge,
  Box,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Stack,
  styled,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import TextField from '@mui/material/TextField'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Grid from '@mui/material/Unstable_Grid2'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  ArrowRight,
  FunnelSimple,
  Gear,
  MagnifyingGlass,
} from '@phosphor-icons/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import {
  ButtonCancel,
  ButtonCustom,
  InfiniteScrollSelectMultiple,
  InputLabelCustom,
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
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  checkPermission,
  handlerGetErrMessage,
  hasSpecialCharacterPrice,
  isEmptyObject,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import {
  getProductBrand,
  getProductCategory,
  getProductInWarehouse,
  getProductManufacturer,
  getWarehouseDetailApi,
} from './apiWarehouse'
import classes from './styles.module.scss'
import { filterSchema, schema } from './validations'
import {
  ListProductDataType,
  ProductBrandResponseType,
  ProductCategoryResponseType,
  ProductData,
  ProductManufacturerResponseType,
  WarehouseDetailType,
} from './warehouseModel'

import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import WithPermission from 'src/utils/permission.utils'
import { useTranslation } from 'next-i18next'

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

const WarehouseDetailComponent = () => {
  const { t } = useTranslation('warehouse')
  const arrayPermission = useAppSelector((state) => state.permission.data)

  const [pushMessage] = useEnqueueSnackbar()
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
  const [stateWarehouseDetail, setStateWarehouseDetail] =
    useState<WarehouseDetailType>()
  //Dialog
  // const [stateOpenDialog, setStateOpenDialog] = useState(false)

  //Menu Delete and edit
  const open = Boolean(anchorEl)
  const openFilter = Boolean(anchorFilter)
  const handleOpenFilterModal = useCallback(() => {
    handleGetCategory('')
    handleGetBrand('')
    handleGetManufacturer('')
  }, [])
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
  //search
  const {
    handleSubmit: handleSubmitSearch,
    control: controlSearch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })

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
        ? parseInt(router?.query?.price_gte)
        : ''
    )
    setValueFilter(
      'price_lte',
      typeof router?.query?.price_lte === 'string'
        ? parseInt(router?.query?.price_lte)
        : ''
    )
    setFilter(count)
  }, [router.query])

  const handleGetProductInWarehouse = (query: any) => {
    dispatch(loadingActions.doLoading())
    if (router.query.id) {
      getProductInWarehouse(Number(router.query.id), {
        ...query,
        id: null,
        category: handleIdQuery(query?.category),
        manufacturer: handleIdQuery(query?.manufacturer),
        brand: handleIdQuery(query?.brand),
      })
        .then((res) => {
          const data = res.data
          setStateProductList(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

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

  useEffect(() => {
    if (router.query.id) {
      getWarehouseDetailApi(Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          setStateWarehouseDetail(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }, [router.query.id])
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
  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        key: values.key,
        page: 1,
      })}`,
    })
  }

  const handleChangeRowsPerPage = (event: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
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
        price_gte:
          typeof values.price_gte === 'string'
            ? parseInt(getValuesFilter('price_gte'))
            : getValuesFilter('price_gte'),
        price_lte:
          typeof values.price_lte === 'string'
            ? parseInt(getValuesFilter('price_lte'))
            : getValuesFilter('price_lte'),

        page: 1,
      })}`,
    })

    handleCloseMenuFilter()
  }

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
  const handleReset = () => {
    resetFilter({
      category: [],
      brand: [],
      manufacturer: [],
      instock_gte: null,
      instock_lte: null,
      price_gte: null,
      price_lte: null,
    })

    router.replace({
      search: `${objToStringParam({
        id: router?.query?.id,
        page: 1,
        limit: router.query.limit,
      })}`,
    })
  }

  return (
    <div>
      <Typography sx={{ marginBottom: '5px', color: '#49516F' }}>
        {t('details.warehouseInformation')}
      </Typography>
      <Stack
        sx={{
          backgroundColor: '#F8F9FC',
          padding: '15px',
          borderRadius: '10px',
          maxWidth: '500px',
          marginBottom: '15px',
        }}
        spacing={1}
      >
        <Stack direction="row" justifyContent="space-between">
          <Typography>{t('details.warehouseName')}</Typography>
          <Typography>
            {stateWarehouseDetail?.name ? stateWarehouseDetail?.name : 'N/A'}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography>{t('details.address')}</Typography>
          <Typography>
            {stateWarehouseDetail?.address
              ? stateWarehouseDetail?.address
              : 'N/A'}
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography>{t('details.defaultStatus')}</Typography>
          <Typography
            sx={{ color: stateWarehouseDetail?.is_default ? '#1DB46A' : '' }}
          >
            {stateWarehouseDetail?.is_default ? 'Active' : 'Empty'}
          </Typography>
        </Stack>
      </Stack>
      <Typography sx={{ color: '#49516F', marginBottom: '5px' }}>
        {t('details.listProductInWarehouse')}
      </Typography>

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
                    placeholder={t('details.searchProductByName')}
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
          <Badge badgeContent={filter} color="primary">
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
                minWidth: '50px',
              }}
            >
              <FunnelSimple size={20} />
            </ButtonCustom>
          </Badge>
        </Grid>
        {WithPermission(
          <Grid xs style={{ maxWidth: '288px' }}>
            <Link
              href={`/${platform().toLowerCase()}/inventory/product/create`}
            >
              <a>
                <ButtonCustom variant="contained" fullWidth size="large">
                  {t('details.addNewProduct')}
                </ButtonCustom>
              </a>
            </Link>
          </Grid>,
          KEY_MODULE.Inventory,
          platform() === 'SUPPLIER'
            ? PERMISSION_RULE.SupplierCreate
            : PERMISSION_RULE.MerchantCreate
        )}
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
                  {t('details.thereAreNoProductsToShow')}
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
                  <TableCellTws width={250}> {t('details.code')}</TableCellTws>
                  <TableCellTws width={200}>
                    {' '}
                    {t('details.productName')}
                  </TableCellTws>
                  <TableCellTws> {t('details.category')}</TableCellTws>
                  <TableCellTws width={140}>
                    {' '}
                    {t('details.quantity')}
                  </TableCellTws>
                  <TableCellTws width={120}> {t('details.brand')}</TableCellTws>
                  <TableCellTws> {t('details.manufacturer')}</TableCellTws>
                  <TableCellTws> {t('details.haveVariant')}</TableCellTws>
                  {/* {platform() == 'RETAILER' ? (
                    <>
                      <TableCellTws align="right">Retail</TableCellTws>
                    </>
                  ) : (
                    <></>
                  )} */}
                  <TableCellTws> {t('details.status')}</TableCellTws>
                  <TableCellTws width={200}>
                    {' '}
                    {t('details.updateDate')}
                  </TableCellTws>
                  <TableCellTws align="center">
                    {' '}
                    {t('details.action')}
                  </TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateProductList?.data?.map((item, index) => (
                  <TableRowTws
                    key={`item-${index}`}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: '#f30',
                      },
                    }}
                    onClick={() => {
                      router.push(
                        item.variants_count > 0
                          ? `/${platform().toLowerCase()}/inventory/product/product-template/${
                              item.id
                            }`
                          : `/${platform().toLowerCase()}/inventory/product/detail/${
                              item.id
                            }`
                      )
                    }}
                  >
                    <TableCellTws
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {item.thumbnail ? (
                        <div className={classes['image-wrapper']}>
                          <Image
                            src={item.thumbnail}
                            alt="thumbnail"
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
                    </TableCellTws>

                    <TableCellTws>
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
                    </TableCellTws>
                    <TableCellTws>
                      {item.category?.name ? item.category?.name : 'N/A'}
                    </TableCellTws>
                    <TableCellTws>
                      {item.stockAll ? item.stockAll : 'N/A'}{' '}
                      {item.unit_type ? item.unit_type.toLowerCase() : 'unit'}
                    </TableCellTws>
                    <TableCellTws>
                      {item.brand?.name ? item.brand?.name : 'N/A'}
                    </TableCellTws>
                    <TableCellTws>
                      {item.manufacturer?.name
                        ? item.manufacturer?.name
                        : 'N/A'}
                    </TableCellTws>
                    <TableCellTws>
                      {item.variants_count ? item.variants_count : 'N/A'}
                    </TableCellTws>

                    {item.is_active ? (
                      <TableCellTws style={{ color: '#1DB46A' }}>
                        {t('details.active')}
                      </TableCellTws>
                    ) : (
                      <TableCellTws style={{ color: '#E02D3C' }}>
                        {t('details.deactivated')}
                      </TableCellTws>
                    )}
                    <TableCellTws>
                      {item.updated_at
                        ? moment(item.updated_at).format('MM/DD/YYYY - hh:mm A')
                        : 'N/A'}
                    </TableCellTws>
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
                  </TableRowTws>
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
            <Typography> {t('details.rowsPerPage')}</Typography>

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
            {checkPermission(
              arrayPermission,
              KEY_MODULE.Inventory,
              platform() === 'SUPPLIER'
                ? PERMISSION_RULE.ViewDetails
                : PERMISSION_RULE.ViewDetails
            ) && (
              <MenuItem>
                <Link
                  href={
                    Number(stateIdProduct?.variants_count) > 0
                      ? `/${platform().toLowerCase()}/inventory/product/product-template/${Number(
                          stateIdProduct?.id
                        )}`
                      : `/${platform().toLowerCase()}/inventory/product/detail/${Number(
                          stateIdProduct?.id
                        )}`
                  }
                >
                  <a className="menu-item-action" style={{ textAlign: 'left' }}>
                    {t('details.viewDetails')}
                  </a>
                </Link>
              </MenuItem>
            )}

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
              {t('details.filter')}
            </Typography>
          </Stack>
          <Box sx={{ padding: '15px 20px', maxWidth: '550px' }}>
            <form onSubmit={handleSubmitFilter(onSubmitFilter)}>
              <Box mb={2}>
                <InputLabelCustom
                  htmlFor="price_gte"
                  sx={{
                    color: '#49516F',
                    fontSize: '1.2rem',
                  }}
                >
                  {t('details.price')}
                </InputLabelCustom>
                <Grid container spacing={2}>
                  <Grid xs>
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
                                    {t('details.from')} $
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
                  </Grid>
                  <Grid xs>
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
                                    {t('details.to')} $
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
                  </Grid>
                </Grid>
              </Box>
              <Box mb={2}>
                <InputLabelCustom
                  sx={{
                    color: '#49516F',
                    fontSize: '1.2rem',
                  }}
                >
                  {t('details.quantity')}
                </InputLabelCustom>
                <Grid container spacing={2}>
                  <Grid xs>
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
                              allowNegative={false}
                              onKeyPress={(event: any) => {
                                if (hasSpecialCharacterPrice(event.key)) {
                                  event.preventDefault()
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {t('details.from')}
                                  </InputAdornment>
                                ),
                              }}
                              decimalScale={2}
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
                  </Grid>
                  <Grid xs>
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
                              allowNegative={false}
                              onKeyPress={(event: any) => {
                                if (hasSpecialCharacterPrice(event.key)) {
                                  event.preventDefault()
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    {t('details.to')}
                                  </InputAdornment>
                                ),
                              }}
                              decimalScale={2}
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
                  </Grid>
                </Grid>
              </Box>
              <Box mb={2}>
                <Grid container spacing={2}>
                  <Grid xs={6}>
                    <InputLabelCustom
                      htmlFor="Category"
                      sx={{
                        color: '#49516F',
                        fontSize: '1.2rem',
                      }}
                    >
                      {t('details.category')}
                    </InputLabelCustom>
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
                                    <div> {t('details.selectCategory')}</div>
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
                                    {item.slice(
                                      item.indexOf('-') + 1,
                                      item.length
                                    )}
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
                  </Grid>
                  <Grid xs={6}>
                    <InputLabelCustom
                      htmlFor="Manufacture"
                      sx={{
                        color: '#49516F',
                        fontSize: '1.2rem',
                      }}
                    >
                      {t('details.manufacturer')}
                    </InputLabelCustom>
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
                                    <div>
                                      {' '}
                                      {t('details.selectManufacturer')}
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
                                    {item.slice(
                                      item.indexOf('-') + 1,
                                      item.length
                                    )}
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
                  </Grid>
                </Grid>
              </Box>

              <Box mb={2}>
                <>
                  <InputLabelCustom
                    htmlFor="Brand"
                    sx={{
                      color: '#49516F',
                      fontSize: '1.2rem',
                    }}
                  >
                    {t('details.brand')}
                  </InputLabelCustom>
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
                                  <div> {t('details.selectBrand')}</div>
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
                                  {item.slice(
                                    item.indexOf('-') + 1,
                                    item.length
                                  )}
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
                </>
              </Box>

              <Grid container spacing={2} direction="row">
                <Grid xs={4}>
                  <ButtonCustom
                    fullWidth
                    sx={{
                      border: '#E1E6EF 0.1px solid',
                      color: '#49516F',
                    }}
                    variant="outlined"
                    onClick={handleCloseMenuFilter}
                  >
                    {t('cancel')}
                  </ButtonCustom>
                </Grid>
                <Grid xs={4}>
                  <ButtonCancel
                    type="reset"
                    onClick={handleReset}
                    fullWidth
                    sx={{ color: '#49516F' }}
                  >
                    {t('reset')}
                  </ButtonCancel>
                </Grid>
                <Grid xs={4}>
                  <ButtonCustom variant="contained" fullWidth type="submit">
                    {t('details.filter')}
                  </ButtonCustom>
                </Grid>
              </Grid>
            </form>
          </Box>
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
    </div>
  )
}

export default WarehouseDetailComponent
