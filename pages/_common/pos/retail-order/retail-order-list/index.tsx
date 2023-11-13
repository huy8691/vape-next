import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  downloadExportInvoice,
  getListRetailOrderAPI,
} from './listRetailOrderApi'
import { RetailOrderDataResponseType } from './listRetailOrderModels'

import { yupResolver } from '@hookform/resolvers/yup'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Badge,
  Box,
  Breadcrumbs,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Grid from '@mui/material/Unstable_Grid2'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import moment from 'moment'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  FunnelSimple,
  Gear,
  MagnifyingGlass,
} from '@phosphor-icons/react'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  MenuAction,
  MenuItemSelectCustom,
  SelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldCustom,
  TextFieldSearchCustom,
  TypographyTitlePage,
} from 'src/components'
import {
  checkPermission,
  handlerGetErrMessage,
  hasSpecialCharacterPrice,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
  platform,
} from 'src/utils/global.utils'
import { formatMoney } from 'src/utils/money.utils'
import WithPermission from 'src/utils/permission.utils'
import { filterSchema, schema } from './validations'
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

const RetailOrder = () => {
  const { t } = useTranslation('retail-order-list')

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const permission = useAppSelector((state) => state.permission.data)
  const [pushMessage] = useEnqueueSnackbar()
  const [stateIdOrder, setStateIdOrder] = useState<number>(0)
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [stateListRetailOrder, setStateListRetailOrder] =
    useState<RetailOrderDataResponseType>()
  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)

  const paymentFilter = useMemo(
    () => [
      {
        id: 1,
        name: t('filter.codCashOnDelivery'),
      },
    ],
    [t]
  )

  const openFilter = Boolean(anchorFilter)

  //==================================================================================\\

  //Menu FIlter
  const handleOpenMenuFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorFilter(event.currentTarget)
  }

  const handleCloseMenuFilter = () => {
    setAnchorFilter(null)
  }

  const handleReset = () => {
    resetFilter({
      payment: [],
      from_date: null,
      to_date: null,
      price_gte: null,
      price_lte: null,
    })

    router.replace(
      {
        search: `${objToStringParam({
          page: 1,
          limit: router.query.limit,
        })}`,
      },
      undefined,
      { scroll: false }
    )
    handleCloseMenuFilter()
  }
  const {
    handleSubmit: handleSubmitFilter,
    setValue: setValueFilter,
    control: controlFilter,
    reset: resetFilter,
    // getValues: getValuesFilter,
    // clearErrors,
    formState: { errors: errorsFilter },
  } = useForm({
    resolver: yupResolver(filterSchema),
    mode: 'all',
  })

  const onSubmitFilter = (values: any) => {
    console.log('filter data', values)
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          from_date: values.from_date,
          to_date: values.to_date,
          total_from: values.price_gte,
          total_to: values.price_lte,
          payment: values.payment.length == 0 ? null : values.payment,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
    handleCloseMenuFilter()
  }

  const changeInputFormFilter = (event: any) => {
    const {
      target: { value },
    } = event
    const {
      target: { name },
    } = event

    if (!value) {
      setValueFilter(name, null, {
        shouldValidate: true,
      })
    } else {
      setValueFilter(name, parseFloat(value.replace(/,/g, '')), {
        shouldValidate: true,
      })
    }
  }

  //form search
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue: setValueSearch,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const onSubmitSearch = (values: any) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          code: values.search,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  //Pagination

  const handleChangeRowsPerPage = (event: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }

  const handleChangePagination = (event: any, page: number) => {
    console.log(event)
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          page: page,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  useEffect(() => {
    dispatch(loadingActions.doLoading())
    getListRetailOrderAPI(router.query)
      .then((res) => {
        const { data } = res
        dispatch(loadingActions.doLoadingSuccess())
        setStateListRetailOrder(data)

        console.log('????', data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })

    setValueSearch('search', router.query.code)
  }, [router.query])

  const open = Boolean(anchorEl)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const downloadLink = (id: number) => {
    dispatch(loadingActions.doLoading())
    downloadExportInvoice(id)
      .then((res) => {
        const { data } = res.data
        const link = document.createElement('a')
        link.href = data.url
        link.target = '_blank'
        link.setAttribute('download', `TWS_Receipt-${id}.pdf`)
        document.body.appendChild(link)
        link.click()
      })
      .catch(() => {
        pushMessage('Download failed', 'error')
      })
      .finally(() => dispatch(loadingActions.doLoadingSuccess()))
  }

  return (
    <>
      <Head>
        <title>{t('title')} | TWSS</title>
      </Head>
      <TypographyTitlePage variant="h1" mb={2}>
        {t('title')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Typography>{t('title')}</Typography>
      </Breadcrumbs>
      <Grid container columnSpacing={'28px'}>
        <Grid xs>
          <form onSubmit={handleSubmit(onSubmitSearch)} className="form-search">
            <Controller
              control={control}
              name="search"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="search"
                    error={!!errors.search}
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
        </Grid>
        <Grid xs style={{ maxWidth: '78px' }}>
          <ButtonCustom
            onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>
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
            <Badge color="default">
              <FunnelSimple size={20} />
            </Badge>
          </ButtonCustom>
        </Grid>
        {WithPermission(
          <Grid xs style={{ maxWidth: '288px' }}>
            <Link href={`/${platform().toLowerCase()}/pos/retail-order/create`}>
              <ButtonCustom variant="contained" fullWidth size="large">
                {t('createRetailOrder')}
              </ButtonCustom>
            </Link>
          </Grid>,
          KEY_MODULE.Order,
          PERMISSION_RULE.CreateRetailOrder
        )}
      </Grid>
      {stateListRetailOrder?.data.length == 0 ? (
        <>
          <Stack p={5} spacing={2} alignItems="center" justifyContent="center">
            <Image
              src={'/' + '/images/not-found.svg'}
              alt="Logo"
              width="200"
              height="200"
            />
            <Typography variant="h6" sx={{ marginTop: '0' }}>
              {t('thereAreNoOrdersAtThisTime')}
            </Typography>
          </Stack>
        </>
      ) : (
        <>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws>{t('orderNumber')}</TableCellTws>
                  <TableCellTws>{t('orderDate')}</TableCellTws>
                  <TableCellTws>{t('totalBilling')}</TableCellTws>
                  <TableCellTws>{t('paymentStatus')}</TableCellTws>
                  <TableCellTws>{t('action')}</TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateListRetailOrder?.data?.map((item, index) => (
                  <TableRowTws
                    key={`item-${index}`}
                    hover={checkPermission(
                      permission,
                      KEY_MODULE.Order,
                      PERMISSION_RULE.ViewDetailsRetailOrder
                    )}
                    sx={{
                      cursor: checkPermission(
                        permission,
                        KEY_MODULE.Order,
                        PERMISSION_RULE.ViewDetailsRetailOrder
                      )
                        ? 'pointer'
                        : '',
                    }}
                    onClick={() => {
                      if (
                        checkPermission(
                          permission,
                          KEY_MODULE.Order,
                          PERMISSION_RULE.ViewDetailsRetailOrder
                        )
                      ) {
                        router.push(
                          `/${platform().toLocaleLowerCase()}/pos/retail-order/detail/${
                            item.id
                          }`
                        )
                      }
                    }}
                  >
                    <TableCellTws>#{item.code}</TableCellTws>

                    <TableCellTws>
                      {item.orderDate
                        ? moment(item.orderDate).format('MM/DD/YYYY - hh:mm A')
                        : 'N/A'}
                    </TableCellTws>
                    <TableCellTws>
                      {formatMoney(item.total_billing)}
                    </TableCellTws>
                    <TableCellTws>
                      <Typography sx={{ textTransform: 'capitalize' }}>
                        {t(`${item.payment_status}` as any)
                          .toString()
                          .replaceAll('_', ' ')
                          .toLowerCase()}
                      </Typography>
                    </TableCellTws>
                    <TableCellTws>
                      <IconButton
                        onClick={(e) => {
                          setStateIdOrder(item.id)
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
              count={stateListRetailOrder ? stateListRetailOrder.totalPages : 0}
            />
          </Stack>
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
              {t('filter.title')}
            </Typography>
          </Stack>
          <form onSubmit={handleSubmitFilter(onSubmitFilter)}>
            <Box mb={2}>
              <InputLabelCustom
                htmlFor="date"
                sx={{
                  color: '#49516F',
                  fontSize: '1.2rem',
                }}
              >
                {t('filter.date')}
              </InputLabelCustom>
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
                              shouldDisableDate={(day: any) => {
                                const date = new Date()
                                if (
                                  dayjs(day).format('YYYY-MM-DD') >
                                  dayjs(date).format('YYYY-MM-DD')
                                ) {
                                  return true
                                }
                                return false
                              }}
                              renderInput={(params: any) => {
                                return (
                                  <TextFieldCustom
                                    {...params}
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
                              shouldDisableDate={(day: any) => {
                                const date = new Date()
                                if (
                                  dayjs(day).format('YYYY-MM-DD') >
                                  dayjs(date).format('YYYY-MM-DD')
                                ) {
                                  return true
                                }
                                return false
                              }}
                              renderInput={(params) => (
                                <TextFieldCustom
                                  {...params}
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
              <InputLabelCustom
                htmlFor="payment"
                sx={{
                  color: '#49516F',
                  fontSize: '1.2rem',
                }}
              >
                {t('filter.paymentMethod')}
              </InputLabelCustom>
              <Controller
                control={controlFilter}
                name="payment"
                defaultValue={[]}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <SelectCustom
                      IconComponent={() => (
                        <KeyboardArrowDownIcon
                          sx={{ border: '1.5px #49516F' }}
                        />
                      )}
                      id="payment"
                      multiple
                      {...field}
                      value={field.value}
                      onChange={(event: any) => {
                        const {
                          target: { value },
                        } = event
                        setValueFilter(
                          'payment',
                          typeof value === 'string' ? value.split(',') : value
                        )
                      }}
                    >
                      {paymentFilter.map((item, index) => (
                        <MenuItemSelectCustom key={index + 1} value={item.id}>
                          {item.name}
                        </MenuItemSelectCustom>
                      ))}
                    </SelectCustom>
                  </FormControl>
                )}
              />
            </Box>
            <Box mb={2}>
              <InputLabelCustom
                htmlFor="price_gte"
                sx={{
                  color: '#49516F',
                  fontSize: '1.2rem',
                }}
              >
                {t('filter.price')}
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
                            allowNegative={false}
                            {...field}
                            thousandSeparator=","
                            onChange={(event: any) =>
                              changeInputFormFilter(event)
                            }
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
                                  $
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
                            allowNegative={false}
                            {...field}
                            onChange={(event: any) =>
                              changeInputFormFilter(event)
                            }
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
                                  $
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
            <Stack direction="row" spacing={2}>
              <ButtonCancel
                type="reset"
                onClick={handleReset}
                fullWidth
                sx={{ color: '#49516F' }}
              >
                {t('filter.reset')}
              </ButtonCancel>
              <ButtonCustom variant="contained" fullWidth type="submit">
                {t('filter.title')}
              </ButtonCustom>
            </Stack>
          </form>
        </Box>
      </Drawer>

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
        <MenuItem onClick={() => downloadLink(stateIdOrder)}>
          {t('filter.downloadPdf')}
        </MenuItem>
      </MenuAction>
    </>
  )
}

export default RetailOrder
