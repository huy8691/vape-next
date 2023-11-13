import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import {
  Box,
  Checkbox,
  Collapse,
  Drawer,
  FormControl,
  IconButton,
  Pagination,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { MagnifyingGlass, WarningCircle } from '@phosphor-icons/react'
import React, { useEffect, useState } from 'react'
import {
  Controller,
  UseFieldArrayAppend,
  UseFormGetValues,
  UseFormSetValue,
  useForm,
} from 'react-hook-form'
import {
  // ButtonCancel,
  ButtonCustom,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldSearchCustom,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, objToStringParam } from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import classes from './styles.module.scss'
// import { ProductOfVoucherDetail } from '../../../detail/modelVoucherDetail'
// import {
//   getDetailProductSetSpecific,
//   getListProductSpecific,
// } from '../../../update/apiVoucherUpdate'

import {
  getDetailVariant,
  getProductTheyCreated,
} from '../../list/externalOrderAPI'
import { ListProductDataType, VariantDetailType } from './productModel'
import { useTranslation } from 'react-i18next'

const ProductsExisting: React.FC<{
  open: boolean
  onClose: (value: boolean) => void
  setStateProductSelect: React.Dispatch<React.SetStateAction<any[]>>
  setValue: UseFormSetValue<any>
  getValues: UseFormGetValues<any>
  stateProductSelect: any[]
  append: UseFieldArrayAppend<any, 'items'>
}> = (props) => {
  const { t } = useTranslation('external-order')
  const [statePage, setStatePage] = useState(1)
  const [stateRowPerPage, setStateRowPerPage] = useState(10)
  const [stateIndexCollapse, setStateIndexCollapse] = useState(-1)
  const [idsSelectProduct, setIdsSelectProduct] = useState<{
    [key: number]: any
  }>()

  const [itemSelectProduct, setItemSelectProduct] = useState<any[]>([])
  const [tempSelectItem, setTempSelectItem] = useState<any[]>([])

  const [pushMessage] = useEnqueueSnackbar()
  const [stateProductsExisting, setStateProductsExisting] =
    useState<ListProductDataType>()

  const [
    stateCurrentDetailProductsExisting,
    setStateCurrentDetailProductsExisting,
  ] = useState<VariantDetailType>()

  const router = useRouter()
  const dispatch = useAppDispatch()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      key: '',
    },
    mode: 'all',
  })

  useEffect(() => {
    if (props.open || router.query.id) {
      const data = [...props.stateProductSelect]

      let obj: any = {}

      for (const item of data) {
        const { have_variant, product_id } = item
        if (!have_variant) {
          obj = {
            ...obj,
            [item.id]: {
              enabled: true,
            },
          }
        } else {
          obj = {
            ...obj,
            [product_id]: {
              enabled: true,
              hasChild: true,
              ...obj[product_id],
              [item.id]: true,
            },
          }
        }
      }
      setItemSelectProduct(props.stateProductSelect)
      setIdsSelectProduct(obj)
    }
    setTempSelectItem([])
  }, [props.open, props.stateProductSelect, router.query.id])

  const handleClickCollapseProductSpecific = (index?: number) => {
    dispatch(loadingActions.doLoading())
    if (index && router.query) {
      getDetailVariant(index)
        .then((res) => {
          const { data } = res.data

          setStateCurrentDetailProductsExisting(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  const handleGetListProductExisting = (query: object) => {
    dispatch(loadingActions.doLoading())
    getProductTheyCreated({
      ...query,
      // page: statePage,
      // limit: stateRowPerPage,
    })
      .then((res) => {
        const { data } = res

        setStateProductsExisting(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }

  useEffect(() => {
    if (props.open) {
      handleGetListProductExisting(router.query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, router.query, statePage, stateRowPerPage])

  const onSubmitSearch = (value: { key: string }) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        key: value.key,
        page: 1,
      })}`,
    })
    // setStateSearch(value.key)
    // setStateIndexCollapse(-1)
    // setStatePage(1)
    // setStateRowPerPage(10)
  }

  const handleChangeRowsPerPage = (event: SelectChangeEvent<any>) => {
    // setStateIndexCollapse(-1)
    // setStatePage(1)
    // setStateRowPerPage(Number(event.target.value))

    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
    setStateIndexCollapse(-1)
    setStateCurrentDetailProductsExisting(undefined)
  }

  const handleChangePagination = (e: any, page: number) => {
    console.log(e)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
    setStateIndexCollapse(-1)
    setStateCurrentDetailProductsExisting(undefined)
  }

  const handleSelectCurrentProduct = (item: any, checked: boolean) => {
    if (item.variants_count) {
      dispatch(loadingActions.doLoading())
      getDetailVariant(item.id as number)
        .then((res) => {
          const { data } = res.data
          const arr: number[] = []

          let objTemp: any = {}
          data.variants.forEach((_item: any) => {
            arr.push(_item.id as number)

            objTemp = {
              ...objTemp,
              [item.id]: {
                ...objTemp[item.id],
                enabled: checked,
                hasChild: checked,
                [_item.id as number]: checked,
              },
            }
          })

          if (checked) {
            setItemSelectProduct((prev) => {
              const clone = [...prev]
              clone.push(...data.variants)
              return clone
            })
            setTempSelectItem((prev) => {
              const clone = [...prev]
              clone.push(
                ...data.variants.map(() => ({
                  price: 0,
                  quantity: 0,
                }))
              )
              return clone
            })
          } else {
            setTempSelectItem((prev) => {
              const clone = [...prev]
              clone.splice(0, data.variants.length)
              return clone
            })
            setItemSelectProduct((prev) => {
              const clone = [...prev]
              const filtered = clone.filter((item) => {
                return !arr.includes(item.id)
              })

              return filtered
            })
          }

          setIdsSelectProduct((prev: any) => {
            return {
              ...prev,
              ...objTemp,
            }
          })
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
        .finally(() => {
          dispatch(loadingActions.doLoadingSuccess())
        })
    } else {
      // is select child product

      if (checked) {
        setItemSelectProduct((prev) => {
          const clone = [...prev]
          clone.push(item)
          return clone
        })
        setTempSelectItem((prev) => {
          const clone = [...prev]
          clone.push({
            price: 0,
            quantity: 0,
          })
          return clone
        })
      } else {
        setTempSelectItem((prev) => {
          const clone = [...prev]
          clone.pop()
          return clone
        })
        setItemSelectProduct((prev) => {
          const clone = [...prev]
          const filtered = clone.filter((_item) => {
            return item.id !== _item.id
          })

          return filtered
        })
      }

      if (item.parent_id && item.parent_id === item.product_id) {
        setIdsSelectProduct((prev: any) => {
          const clone = { ...prev }

          if (clone[item.parent_id]?.enabled) {
            let objTemp: any = {}
            objTemp = {
              ...clone,
              [item.parent_id]: {
                ...clone[item.parent_id],
                [item.id as number]: checked,
              },
            }
            const { enabled, hasChild, ...rest } = objTemp[item.parent_id]
            console.log('hasChild:', hasChild)
            console.log('enabled:', enabled)

            return {
              ...objTemp,
              [item.parent_id]: {
                ...objTemp[item.parent_id],
                [item.id as number]: checked,
                enabled: Object.keys(rest).every((k) => !rest[k])
                  ? false
                  : true,
                hasChild: Object.keys(rest).every((k) => !rest[k])
                  ? false
                  : true,
              },
            }
          } else {
            return {
              ...clone,
              [item.parent_id]: {
                ...clone[item.parent_id],
                enabled: checked,
                [item.id as number]: checked,
              },
            }
          }
        })
      } else {
        setIdsSelectProduct((prev: any) => {
          return {
            ...prev,
            [item.id]: {
              enabled: checked,
            },
          }
        })
      }
    }
  }

  const handleSaveSelectProductOfVoucher = () => {
    // props.setStateProductSelect([])
    const clone = JSON.parse(JSON.stringify(idsSelectProduct))

    const arr: number[] = []

    Object.keys(clone).forEach((key) => {
      const { hasChild, enabled, ...rest } = clone[key]

      console.log('🚀 enabled:', enabled)

      if (hasChild) {
        const mergeObj = Object.keys(rest)
          .filter((k) => rest[k])
          .map((m) => Number(m))
        arr.push(...mergeObj)
      } else {
        if (clone[key].enabled) {
          arr.push(Number(key))
        }
      }
    })
    props.setStateProductSelect(() => {
      return [...itemSelectProduct]
    })

    tempSelectItem.forEach(() => {
      props.append({
        price: 0,
        quantity: 0,
      })
    })

    props.setValue('products', arr)

    props.onClose(false)
  }

  const handleChangePaginationForVariant = (e: any, page: number) => {
    console.log(e)
    setStatePage(page)
  }

  const handleChangeRowsPerPageForVariant = (event: any) => {
    setStateRowPerPage(Number(event.target.value))
  }

  return (
    <Drawer
      anchor="right"
      open={props.open}
      onClose={() => props.onClose(false)}
    >
      <Box sx={{ padding: '20px', background: 'white', width: '1500px' }}>
        <Typography
          sx={{
            fontSize: '2.4rem',
            fontWeight: 700,
            color: '#49516F',
          }}
        >
          {t('selectProduct')}
        </Typography>
        <form onSubmit={handleSubmit(onSubmitSearch)} className="form-search">
          <Controller
            control={control}
            name="key"
            defaultValue=""
            render={({ field }) => (
              <FormControl fullWidth>
                <TextFieldSearchCustom
                  id="key"
                  placeholder={t('search')}
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
        <TableContainerTws>
          <Table>
            <TableHead>
              <TableRow>
                <TableCellTws></TableCellTws>
                <TableCellTws>{t('code')}</TableCellTws>
                <TableCellTws>
                  <TableCellTws
                    sx={{
                      width: '200px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {t('productName')}
                  </TableCellTws>
                </TableCellTws>
                <TableCellTws width={140}>{t('category')}</TableCellTws>
                <TableCellTws sx={{ minWidth: '150px' }}>
                  {t('quantity')}
                </TableCellTws>
                <TableCellTws>{t('retailPrice')}</TableCellTws>
                <TableCellTws sx={{ minWidth: '100px' }}>
                  {t('brand')}
                </TableCellTws>
                <TableCellTws sx={{ minWidth: '100px' }}>
                  {t('manufacturer')}
                </TableCellTws>
                <TableCellTws>{t('status')}</TableCellTws>
                <TableCellTws>{t('haveVariant')}</TableCellTws>
                <TableCellTws>{t('action')}</TableCellTws>
              </TableRow>
            </TableHead>
            <TableBody>
              {stateProductsExisting?.data?.map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <TableRowTws>
                      <TableCellTws>
                        {Number(item.variants_count) > 0 && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setStateCurrentDetailProductsExisting(undefined)
                              if (stateIndexCollapse === index) {
                                setStateIndexCollapse(-1)
                                return
                              }
                              handleClickCollapseProductSpecific(item.id)
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
                      </TableCellTws>
                      <TableCellTws>
                        {item.category?.name ? item.category.name : 'N/A'}
                      </TableCellTws>
                      <TableCellTws>
                        <Stack direction="row" alignItems="center">
                          {item.instock
                            ? item.instock.toLocaleString('en-US')
                            : 'N/A'}{' '}
                          {item.unit_type}
                          {Number(item.low_stock_alert_level) >=
                            Number(item.instock) && (
                            <Tooltip title={'The Stock Is Low'} placement="top">
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
                      <TableCellTws>
                        {item.retail_price
                          ? formatMoney(item.retail_price)
                          : 'N/A'}
                      </TableCellTws>
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
                            {t('active')}
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
                            {t('deactivated')}
                          </Typography>
                        </TableCellTws>
                      )}
                      <TableCellTws>
                        {Number(item.variants_count) > 0
                          ? item.variants_count
                          : 'N/A'}
                      </TableCellTws>
                      <TableCellTws>
                        <Checkbox
                          // value={item.id}
                          checked={Boolean(
                            idsSelectProduct?.[item.id as number]?.enabled
                          )}
                          value={item.id}
                          onChange={(event) => {
                            handleSelectCurrentProduct(
                              {
                                id: item.id,
                                thumbnail: item.thumbnail,
                                name: item.name,
                                variants_count: item.variants_count,
                              },
                              event.target.checked
                            )
                          }}
                        />
                      </TableCellTws>
                    </TableRowTws>
                    {Number(item.variants_count) > 0 &&
                      stateCurrentDetailProductsExisting?.variants && (
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
                                  {/* {t('variantGroupFor', {
                                    0: item.name,
                                  })} */}
                                </Typography>
                                <Table sx={{ marginBottom: '10px' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCellTws>{t('code')}</TableCellTws>
                                      <TableCellTws>{t('name')}</TableCellTws>
                                      <TableCellTws>
                                        {t('quantity')}
                                      </TableCellTws>
                                      <TableCellTws>
                                        {t('retailPrice')}
                                      </TableCellTws>
                                      {stateCurrentDetailProductsExisting.attributes.map(
                                        (item, index) => {
                                          return (
                                            <TableCellTws key={index}>
                                              {item.name}
                                            </TableCellTws>
                                          )
                                        }
                                      )}
                                      <TableCellTws>{t('status')}</TableCellTws>
                                      <TableCellTws>{t('action')}</TableCellTws>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {stateCurrentDetailProductsExisting.variants &&
                                      stateCurrentDetailProductsExisting.variants
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
                                              <TableCellTws>
                                                {variant.retail_price
                                                  ? formatMoney(
                                                      variant.retail_price
                                                    )
                                                  : 'N/A'}
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
                                                    {t('deactivated')}
                                                  </Typography>
                                                )}
                                              </TableCellTws>
                                              <TableCellTws>
                                                <Checkbox
                                                  checked={Boolean(
                                                    idsSelectProduct?.[
                                                      item.id as number
                                                    ]?.[variant.id as number]
                                                  )}
                                                  value={variant.id}
                                                  onChange={(event) => {
                                                    handleSelectCurrentProduct(
                                                      {
                                                        id: variant.id,
                                                        parent_id: item.id,
                                                        thumbnail:
                                                          variant.thumbnail,
                                                        name: variant.name,
                                                        product_id:
                                                          variant.product_id,
                                                        have_variant:
                                                          variant.have_variant,
                                                      },
                                                      event.target.checked
                                                    )
                                                  }}
                                                />
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
                                      stateCurrentDetailProductsExisting
                                        ? Math.ceil(
                                            Number(
                                              stateCurrentDetailProductsExisting.variants_count
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
            count={
              stateProductsExisting ? stateProductsExisting?.totalPages : 0
            }
          />
        </Stack>
        <Stack direction="row" spacing={2} justifyContent={'flex-end'} mt={2}>
          <ButtonCustom
            variant="contained"
            size="large"
            onClick={handleSaveSelectProductOfVoucher}
          >
            {t('submit')}
          </ButtonCustom>
        </Stack>
      </Box>
    </Drawer>
  )
}

export default ProductsExisting
