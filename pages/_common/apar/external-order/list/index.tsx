import { yupResolver } from '@hookform/resolvers/yup'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Badge,
  Box,
  Chip,
  Drawer,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { FunnelSimple, MagnifyingGlass } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
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
  TextFieldSearchCustom,
  TypographyH2,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  handlerGetErrMessage,
  isEmptyObject,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import * as Yup from 'yup'
import { ExternalSupplierListResponseType } from '../../external-supplier/list/externalSupplierModel'
import ExternalOrderDetailComponent from '../detail'
import {
  getListExternalOrder,
  getListExternalSupplier,
  getProductByOCR,
} from './externalOrderAPI'
import {
  ExternalOrderListResponseType,
  ExternalOrderTypeData,
  FormSearch,
} from './externalOrderModel'

const ListExternalOrderComponent: React.FC = () => {
  const { t } = useTranslation('external-order')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateDrawerFilter, setStateDrawerFilter] = useState(false)
  const [openDetailExternal, setOpenDetailExternal] = useState(false)
  const [stateExternalOrderList, setStateExternalOrderList] =
    useState<ExternalOrderListResponseType>()
  const [pushMessage] = useEnqueueSnackbar()
  const [itemExternalOrder, setItemExternalOrder] =
    useState<ExternalOrderTypeData>()
  const [stateListExternalSupplier, setStateListExternalSupplier] =
    useState<ExternalSupplierListResponseType>({
      data: [],
    })
  const enumOrderStatus = useMemo(
    () => [
      {
        value: 'WAITING_FOR_APPROVED',
        name: t('waitingForApproved'),
      },
      {
        value: 'APPROVED',
        name: t('approved'),
      },
      {
        value: 'READY_FOR_SHIPPING',
        name: t('readyForShipping'),
      },
      {
        value: 'DELIVERING',
        name: t('delivering'),
      },
      {
        value: 'DELIVERED',
        name: t('delivered'),
      },
      {
        value: 'CANCELLED',
        name: t('cancelled'),
      },
      {
        value: 'COMPLETED',
        name: t('completed'),
      },
    ],
    [t]
  )

  const enumPaymentStatus = useMemo(
    () => [
      {
        value: 'WAITING_FOR_PAYMENT',
        name: t('waitingForPayment'),
      },
      {
        value: 'PAID',
        name: t('paid'),
      },
      {
        value: 'DELAY_PAYMMENT',
        name: t('delayPayment'),
      },
      {
        value: 'REFUNDED',
        name: t('refunded'),
      },
      {
        value: 'PARTIALLY_PAID',
        name: t('partiallyPaid'),
      },
    ],
    [t]
  )
  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormSearch>({
    defaultValues: {
      search: '',
    },
    resolver: yupResolver(
      Yup.object().shape({
        search: Yup.string().max(255),
      })
    ),
  })

  //filter
  const {
    handleSubmit: handleSubmitFilter,
    control: controlFilter,
    setValue: setValueFilter,
    getValues: getValuesFilter,
    register,
    reset: resetFilter,
    formState: { errors: errorsFilter },
  } = useForm({
    mode: 'all',
  })

  const handleGetListExternalOrder = (query: any) => {
    dispatch(loadingActions.doLoading())
    getListExternalOrder(query)
      .then((res) => {
        const data = res.data
        dispatch(loadingActions.doLoadingSuccess())
        setStateExternalOrderList(data)
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        search: values.search,
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

  const handleChangePagination = (page: number) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }

  const handleOpenFilterDrawer = () => {
    setStateDrawerFilter(true)
  }

  const onSubmitFilter = (values: any) => {
    const assignSellerArr: Array<number> = []
    getValuesFilter('external_supplier').forEach((item: string) => {
      assignSellerArr.push(Number(item.slice(0, item.indexOf('-'))))
    })
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          ...values,
          external_supplier: assignSellerArr,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
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

  const handleReset = () => {
    resetFilter({
      order_date_gte: null,
      order_date_lte: null,
      external_supplier: [],
      payment_status: '',
      status: '',
    })

    router.replace(
      {
        search: `${objToStringParam({
          id: router.query.id,
          page: 1,
          limit: router.query.limit,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  useEffect(() => {
    handleGetExternalSupplier(null)
  }, [])

  useEffect(() => {
    if (router.asPath.length !== router.pathname.length) {
      if (router.query.search) {
        setValue('search', router.query.search)
      }
      if (!isEmptyObject(router.query)) {
        handleGetListExternalOrder(router.query)
      }
    } else {
      handleGetListExternalOrder({})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])

  const handleFileInput = (e: any) => {
    const fileInput = e.target.files[0]
    const formData = new FormData()
    formData.append('file', fileInput)
    dispatch(loadingActions.doLoading())

    getProductByOCR(formData)
      .then((res) => {
        const { data } = res.data

        router.push(
          {
            pathname: `/${platform().toLowerCase()}/account-payable/external-order/create-ocr`,
            query: JSON.parse(
              JSON.stringify({
                ...data,
                table: JSON.stringify(data.table),
              })
            ),
          },
          `/${platform().toLowerCase()}/account-payable/external-order/create-ocr`
        )

        // Coding here
      })
      .catch(() => {
        // const { data, status } = response
        // if (typeof data.data === 'string') {
        //   return
        // }
        router.push(
          `/${platform().toLowerCase()}/account-payable/external-order/create-ocr`
        )
        // pushMessage(handlerGetErrMessage(status, data), 'error')
      })
      .finally(() => {
        dispatch(loadingActions.doLoadingSuccess())
      })
  }
  return (
    <>
      <Grid container columnSpacing={'14px'}>
        <Grid xs>
          <form onSubmit={handleSubmit(handleSearch)} className="form-search">
            <Controller
              control={control}
              name="search"
              render={({ field }) => (
                <>
                  <FormControl fullWidth>
                    <TextFieldSearchCustom
                      error={!!errors.search}
                      placeholder={t('search')}
                      {...field}
                    />
                  </FormControl>
                </>
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
          <Badge color="primary" sx={{ fontSize: '25px' }}>
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
        <Grid xs style={{ maxWidth: '300px' }}>
          <Link
            href={`/${platform().toLowerCase()}/account-payable/external-order/create`}
          >
            <a>
              <ButtonCustom variant="contained" fullWidth size="large">
                {t('createExternalOrder')}
              </ButtonCustom>
            </a>
          </Link>
        </Grid>
        <Grid xs style={{ maxWidth: '245px' }}>
          <ButtonCustom
            variant="contained"
            component="label"
            fullWidth
            size="large"
          >
            Create By OCR
            <input
              hidden
              accept=".pdf,.png,.jpeg"
              type="file"
              onChange={handleFileInput}
              onClick={(e: any) => {
                e.target.value = null
              }}
            />
          </ButtonCustom>
        </Grid>
      </Grid>

      {stateExternalOrderList?.data.length === 0 ? (
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
                {t('thereAreNoExternalOrderToShow')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws>{t('orderNumber')}</TableCellTws>
                  <TableCellTws>{t('orderDate')}</TableCellTws>
                  <TableCellTws>{t('orderStatus')}</TableCellTws>
                  <TableCellTws>{t('paymentStatus')}</TableCellTws>
                  <TableCellTws>{t('orderBilling')}</TableCellTws>
                  <TableCellTws>{t('externalSupplier')}</TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateExternalOrderList?.data?.map((item, index) => {
                  return (
                    <React.Fragment key={`item-${index}`}>
                      <TableRowTws
                        key={`item-${index}`}
                        onClick={() => {
                          setItemExternalOrder(item)
                          setOpenDetailExternal(true)
                        }}
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        <TableCellTws>{item.code || 'N/A'}</TableCellTws>
                        <TableCellTws>
                          {moment(item.orderDate).format('MM/DD/YYYY') || 'N/A'}
                        </TableCellTws>
                        <TableCellTws>
                          {enumOrderStatus.filter(
                            (_item) => _item.value === item.status
                          )[0].name || 'N/A'}
                        </TableCellTws>
                        <TableCellTws>
                          {enumPaymentStatus.filter(
                            (_item) => _item.value === item.payment_status
                          )[0].name || 'N/A'}
                        </TableCellTws>
                        <TableCellTws>
                          {formatMoney(item.total_value || 0)}
                        </TableCellTws>
                        <TableCellTws>
                          {item.external_supplier || 'N/A'}
                        </TableCellTws>
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
              onChange={(_event, page: number) => handleChangePagination(page)}
              count={
                stateExternalOrderList ? stateExternalOrderList.totalPages : 0
              }
            />
          </Stack>
        </>
      )}

      <Drawer
        anchor="right"
        open={stateDrawerFilter}
        onClose={() => setStateDrawerFilter(false)}
      >
        <Box sx={{ padding: '25px', maxWidth: '550px' }}>
          <TypographyH2 sx={{ marginBottom: '10px' }}>Filter</TypographyH2>
          <form onSubmit={handleSubmitFilter(onSubmitFilter)}>
            <Box mb={2}>
              <InputLabelCustom
                htmlFor="date"
                sx={{
                  color: '#49516F',
                  fontSize: '1.2rem',
                }}
              >
                {t('externalSupplier')}
              </InputLabelCustom>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={controlFilter}
                    defaultValue={[]}
                    name="external_supplier"
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <SelectCustom
                          id="external_supplier"
                          displayEmpty
                          multiple
                          placeholder={t('selectExternalSupplier')}
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          {...field}
                          renderValue={(value: any) => {
                            if (!value) {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('selectExternalSupplier')}</div>
                                </PlaceholderSelect>
                              )
                            }
                            return (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {value.map(function (item: any, idx: number) {
                                  return (
                                    <Chip
                                      key={idx}
                                      sx={{
                                        maxWidth: '150px',
                                      }}
                                      onMouseDown={(event) =>
                                        event.stopPropagation()
                                      }
                                      onDelete={() => {
                                        const temporaryRolesArr =
                                          getValuesFilter(
                                            'external_supplier'
                                          ).filter((x: any) => {
                                            return x != item
                                          })
                                        setValueFilter(
                                          'external_supplier',
                                          temporaryRolesArr
                                        )
                                      }}
                                      label={
                                        <Typography
                                          sx={{
                                            maxWidth: '100px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                          }}
                                        >
                                          {item.slice(
                                            item.indexOf('-') + 1,
                                            item.length
                                          )}
                                          {item.name}
                                        </Typography>
                                      }
                                    />
                                  )
                                })}
                              </Box>
                            )
                          }}
                          onChange={(event: any) => {
                            console.log('change', event.target.value)
                          }}
                        >
                          <InfiniteScrollSelectMultiple
                            propData={stateListExternalSupplier}
                            handleSearch={(value) => {
                              setStateListExternalSupplier({ data: [] })
                              handleGetExternalSupplier(value)
                            }}
                            fetchMore={(value) => {
                              fetchMoreDataExternalSupplier(value)
                            }}
                            onClickSelectItem={(item: any) => {
                              setValueFilter('external_supplier', item)
                            }}
                            propsGetValue={getValuesFilter('external_supplier')}
                            propName={'name'}
                          />
                        </SelectCustom>
                      </FormControl>
                    )}
                  />
                </Grid>
              </Grid>
            </Box>
            <Box mb={2}>
              <InputLabelCustom
                htmlFor="date"
                sx={{
                  color: '#49516F',
                  fontSize: '1.2rem',
                }}
              >
                {t('orderDate')}
              </InputLabelCustom>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={controlFilter}
                    defaultValue=""
                    name="order_date_gte"
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
                                  setValueFilter('order_date_gte', '', {
                                    shouldValidate: true,
                                  })
                                } else {
                                  setValueFilter(
                                    'order_date_gte',
                                    dayjs(value).format('MM/DD/YYYY'),
                                    { shouldValidate: true }
                                  )
                                }
                              }}
                              renderInput={(params: any) => {
                                return (
                                  <TextFieldCustom
                                    {...params}
                                    error={!!errorsFilter.order_date_gte}
                                  />
                                )
                              }}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Box>
                    )}
                  />
                </Grid>
                <Grid xs>
                  <Controller
                    control={controlFilter}
                    defaultValue=""
                    name="order_date_lte"
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
                                  setValueFilter('order_date_lte', '', {
                                    shouldValidate: true,
                                  })
                                } else {
                                  setValueFilter(
                                    'order_date_lte',
                                    dayjs(value).format('MM/DD/YYYY'),
                                    { shouldValidate: true }
                                  )
                                }
                              }}
                              renderInput={(params: any) => {
                                return (
                                  <TextFieldCustom
                                    {...params}
                                    error={!!errorsFilter.order_date_lte}
                                  />
                                )
                              }}
                            />
                          </LocalizationProvider>
                        </FormControl>
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
                {t('orderStatus')}
              </InputLabelCustom>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={controlFilter}
                    defaultValue=""
                    name="status"
                    render={({ field }) => (
                      <Box>
                        <FormControl fullWidth>
                          <SelectCustom
                            displayEmpty
                            IconComponent={() => <KeyboardArrowDownIcon />}
                            renderValue={(value: any) => {
                              if (!value) {
                                return (
                                  <PlaceholderSelect>
                                    {t('selectStatus')}
                                  </PlaceholderSelect>
                                )
                              }
                              return enumOrderStatus.filter(
                                (item) => item.value === value
                              )[0].name
                            }}
                            {...field}
                            {...register('status')}
                            onChange={(event: any) => {
                              setValueFilter('status', event.target.value)
                            }}
                          >
                            {enumOrderStatus.map((item, index) => (
                              <MenuItem value={item.value} key={index}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </SelectCustom>
                        </FormControl>
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
                {t('paymentStatus')}
              </InputLabelCustom>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={controlFilter}
                    defaultValue=""
                    name="payment_status"
                    render={({ field }) => (
                      <Box>
                        <FormControl fullWidth>
                          <SelectCustom
                            displayEmpty
                            IconComponent={() => <KeyboardArrowDownIcon />}
                            renderValue={(value: any) => {
                              if (!value) {
                                return (
                                  <PlaceholderSelect>
                                    {t('selectPaymentStatus')}
                                  </PlaceholderSelect>
                                )
                              }
                              return enumPaymentStatus.filter(
                                (item) => item.value === value
                              )[0].name
                            }}
                            {...field}
                            {...register('payment_status')}
                            onChange={(event: any) => {
                              setValueFilter(
                                'payment_status',
                                event.target.value
                              )
                            }}
                          >
                            {enumPaymentStatus.map((item, index) => (
                              <MenuItem value={item.value} key={index}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </SelectCustom>
                        </FormControl>
                      </Box>
                    )}
                  />
                </Grid>
              </Grid>
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
                  onClick={() => {
                    setStateDrawerFilter(false)
                    handleReset()
                  }}
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
                  {t('filter')}
                </ButtonCustom>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Drawer>

      <ExternalOrderDetailComponent
        open={openDetailExternal}
        onClose={setOpenDetailExternal}
        idExternalOrder={itemExternalOrder?.id}
        handleGetListExternalOrder={handleGetListExternalOrder}
      />
    </>
  )
}

export default ListExternalOrderComponent
