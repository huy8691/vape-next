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
import { handlerGetErrMessage } from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import { ProductOfVoucherDetail } from '../../../detail/modelVoucherDetail'
import {
  getDetailProductSetSpecific,
  getListProductSpecific,
} from '../../../update/apiVoucherUpdate'
import {
  Datum,
  ProductSpecific,
  ProductSpecificDataType,
} from './modalSpecificProduct'
import { useTranslation } from 'next-i18next'

const SpecificProduct: React.FC<{
  open: boolean
  onClose: (value: boolean) => void
  setStateProductSelect: React.Dispatch<
    React.SetStateAction<ProductOfVoucherDetail[]>
  >
  setValue: UseFormSetValue<any>
  getValues: UseFormGetValues<any>
  stateProductSelect: ProductOfVoucherDetail[]
}> = (props) => {
  const { t } = useTranslation('voucher')
  const [statePage, setStatePage] = useState(1)
  const [stateRowPerPage, setStateRowPerPage] = useState(10)
  const [stateSearch, setStateSearch] = useState('')
  const [stateIndexCollapse, setStateIndexCollapse] = useState(-1)
  const [idsSelectProduct, setIdsSelectProduct] = useState<{
    [key: number]: any
  }>()

  const [itemSelectProduct, setItemSelectProduct] = useState<any[]>([])

  const [pushMessage] = useEnqueueSnackbar()
  const [stateProductSpecific, setStateProductSpecific] =
    useState<ProductSpecificDataType>()

  const [
    stateCurrentDetailProductSpecific,
    setStateCurrentDetailProductSpecific,
  ] = useState<ProductSpecific[]>([])

  const router = useRouter()
  const dispatch = useAppDispatch()
  const { control, handleSubmit } = useForm({
    defaultValues: {
      key: '',
    },
    mode: 'all',
  })

  useEffect(() => {
    if (props.open && router.query.id) {
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

      setIdsSelectProduct(obj)
    }
  }, [props.open, props.stateProductSelect, router.query.id])

  const handleClickCollapseProductSpecific = (index?: number) => {
    dispatch(loadingActions.doLoading())
    if (index && router.query) {
      getDetailProductSetSpecific(index)
        .then((res) => {
          const { data } = res.data
          setStateCurrentDetailProductSpecific(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  const handleGetListProductSpecific = (query: object) => {
    dispatch(loadingActions.doLoading())
    getListProductSpecific({
      ...query,
      page: statePage,
      limit: stateRowPerPage,
      search: stateSearch,
    })
      .then((res) => {
        const { data } = res

        setStateProductSpecific(data)
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
      handleGetListProductSpecific(router.query)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.open, router.query, statePage, stateRowPerPage, stateSearch])

  const onSubmitSearch = (value: { key: string }) => {
    setStateSearch(value.key)
    setStateIndexCollapse(-1)
    setStatePage(1)
    setStateRowPerPage(10)
  }

  const handleChangeRowsPerPage = (event: SelectChangeEvent<any>) => {
    setStateIndexCollapse(-1)
    setStatePage(1)
    setStateRowPerPage(Number(event.target.value))
  }

  const handleChangePagination = (page: number) => {
    setStateIndexCollapse(-1)
    setStatePage(page)
  }

  const handleSelectCurrentProduct = (item: any, checked: boolean) => {
    if (item.variants_count) {
      dispatch(loadingActions.doLoading())
      getDetailProductSetSpecific(item.id as number)
        .then((res) => {
          const { data } = res.data
          const arr: number[] = []

          let objTemp: any = {}
          data.forEach((_item: Datum) => {
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
              clone.push(...data)
              return clone
            })
          } else {
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

    props.setStateProductSelect((prev) => {
      const arr_1: any = []
      if (!stateProductSpecific || !stateProductSpecific.data) return prev

      for (const item of stateProductSpecific.data) {
        if (arr.includes(item.id as number)) {
          arr_1.push(item)
        }
      }

      for (const item of stateCurrentDetailProductSpecific) {
        if (arr.includes(item.id as number)) {
          arr_1.push(item)
        }
      }

      return [...arr_1, ...itemSelectProduct]
    })
    props.setValue('products', arr)

    props.onClose(false)
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
                  placeholder={t('searchProduct')}
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
                <TableCellTws>{t('name')}</TableCellTws>
                <TableCellTws>{t('category')}</TableCellTws>
                <TableCellTws>{t('brand')}</TableCellTws>
                <TableCellTws>{t('manufacturer')}</TableCellTws>
                <TableCellTws>{t('haveVariant')}</TableCellTws>
                <TableCellTws>{t('action')}</TableCellTws>
              </TableRow>
            </TableHead>
            <TableBody>
              {stateProductSpecific?.data?.map((item, index) => {
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
                              setStateCurrentDetailProductSpecific([])
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
                        <Stack direction="row" alignItems="center" spacing={2}>
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
                      <TableCellTws>{item.category?.name}</TableCellTws>
                      <TableCellTws>{item.brand?.name}</TableCellTws>
                      <TableCellTws>{item.manufacturer?.name}</TableCellTws>
                      <TableCellTws>{item.variants_count}</TableCellTws>
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
                      stateCurrentDetailProductSpecific && (
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
                                  {t('variantGroupFor', {
                                    0: item.name,
                                  })}
                                </Typography>
                                <Table sx={{ marginBottom: '10px' }}>
                                  <TableHead>
                                    <TableRow>
                                      <TableCellTws>{t('code')}</TableCellTws>
                                      <TableCellTws>{t('name')}</TableCellTws>
                                      <TableCellTws>
                                        {t('quantity')}
                                      </TableCellTws>
                                      <TableCellTws>{t('price')}</TableCellTws>
                                      <TableCellTws>{t('action')}</TableCellTws>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {stateCurrentDetailProductSpecific.map(
                                      (_item, idx) => {
                                        return (
                                          <TableRow
                                            key={idx}
                                            sx={{ cursor: 'pointer' }}
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
                                                    _item.thumbnail
                                                      ? _item.thumbnail
                                                      : '/' +
                                                        '/images/vapeProduct.png'
                                                  }
                                                  width={50}
                                                  height={50}
                                                />
                                                <Typography>
                                                  #{_item.code}
                                                </Typography>
                                              </Stack>
                                            </TableCellTws>
                                            <TableCellTws>
                                              <Stack spacing={1}>
                                                {_item.name}
                                                <Stack
                                                  direction="row"
                                                  spacing={1}
                                                >
                                                  {_item.attribute_options?.map(
                                                    (obj, idx) => {
                                                      return (
                                                        <Stack
                                                          direction="row"
                                                          key={idx}
                                                          spacing={0.5}
                                                        >
                                                          <Typography
                                                            sx={{
                                                              fontWeight: 700,
                                                              fontSize:
                                                                '1.2rem',
                                                            }}
                                                          >
                                                            {obj.attribute}
                                                          </Typography>
                                                          <Typography
                                                            sx={{
                                                              fontSize:
                                                                '1.2rem',
                                                            }}
                                                          >
                                                            {obj.option}
                                                          </Typography>
                                                        </Stack>
                                                      )
                                                    }
                                                  )}
                                                </Stack>
                                              </Stack>
                                            </TableCellTws>
                                            <TableCellTws>
                                              <Stack
                                                direction="row"
                                                alignItems="center"
                                                spacing={2}
                                              >
                                                {_item.quantity
                                                  ? _item.quantity.toLocaleString(
                                                      'en-US'
                                                    )
                                                  : 'N/A'}
                                                {_item.quantity! <
                                                  _item.low_stock_level! && (
                                                  <Tooltip
                                                    title={t('theStockIsLow')}
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
                                              {_item.wholesale_price
                                                ? formatMoney(
                                                    _item.wholesale_price
                                                  )
                                                : 'N/A'}
                                            </TableCellTws>
                                            <TableCellTws>
                                              <Checkbox
                                                checked={Boolean(
                                                  idsSelectProduct?.[
                                                    item.id as number
                                                  ]?.[_item.id as number]
                                                )}
                                                value={_item.id}
                                                onChange={(event) => {
                                                  handleSelectCurrentProduct(
                                                    {
                                                      id: _item.id,
                                                      parent_id: item.id,
                                                      thumbnail:
                                                        _item.thumbnail,
                                                      name: _item.name,
                                                      product_id:
                                                        _item.product_id,
                                                    },
                                                    event.target.checked
                                                  )
                                                }}
                                              />
                                            </TableCellTws>
                                          </TableRow>
                                        )
                                      }
                                    )}
                                  </TableBody>
                                </Table>
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
            onChange={(_event, page: number) => handleChangePagination(page)}
            count={
              stateProductSpecific
                ? Math.ceil(
                    Number(stateProductSpecific.totalItems) / stateRowPerPage
                  )
                : 0
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

export default SpecificProduct
