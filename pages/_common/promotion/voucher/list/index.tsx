import { yupResolver } from '@hookform/resolvers/yup'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Badge,
  Box,
  Drawer,
  FormControl,
  FormHelperText,
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
import dayjs from 'dayjs'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FunnelSimple, Gear, MagnifyingGlass } from '@phosphor-icons/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
import VoucherDetailComponent from '../detail'
import { getListVoucher } from './apiVoucher'
import { ListVoucherDataType, VoucherData } from './modelVoucher'
import { schema } from './validation'
import { useTranslation } from 'next-i18next'

const enumAvailability: {
  [key: string]: string
} = {
  MARKETPLACE: 'Marketplace',
  AT_STORE: 'At Store',
}

const statusFilter = [
  {
    value: 'ACTIVATED',
    name: 'Activated',
  },
  {
    value: 'DEACTIVATED',
    name: 'Deactivated',
  },
  {
    value: 'EXPIRED',
    name: 'Expired',
  },
]

const availabilityFilter = [
  {
    value: '',
    name: 'All',
  },
  {
    value: 'MARKETPLACE',
    name: 'Marketplace',
  },
  {
    value: 'AT_STORE',
    name: 'At Store',
  },
]

const ListVoucherComponent: React.FC = () => {
  const { t } = useTranslation('voucher')
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateDrawerFilter, setStateDrawerFilter] = useState(false)
  const [stateDrawerDetail, setStateDrawerDetail] = useState(false)
  const [stateVoucherList, setStateVoucherList] =
    useState<ListVoucherDataType>()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [stateIdProduct, setStateIdProduct] = useState<VoucherData>()

  const router = useRouter()
  //search
  const {
    setValue,
    handleSubmit: handleSubmitSearch,
    control: controlSearch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  //filter
  const {
    handleSubmit: handleSubmitFilter,
    control: controlFilter,
    setValue: setValueFilter,
    reset: resetFilter,
    formState: { errors: errorsFilter },
  } = useForm({
    mode: 'all',
  })

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
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

  const onSubmitFilter = (values: any) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          status: values.status,
          availability: values.availability,
          expiry_date_gte: values.expiry_date_gte,
          expiry_date_lte: values.expiry_date_lte,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  const handleOpenFilterDrawer = () => {
    setStateDrawerFilter(true)
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

  // handleChangePagination
  const handleChangePagination = (page: number) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }

  const handleReset = () => {
    resetFilter({
      availability: null,
      status: null,
      expiry_date_gte: null,
      expiry_date_lte: null,
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

  const handleGetVoucherList = (query: any) => {
    if (platform() === 'SUPPLIER' || platform() === 'RETAILER') {
      dispatch(loadingActions.doLoading())
      getListVoucher(query)
        .then((res) => {
          const data = res.data
          setStateVoucherList(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((response) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
        .finally(() => {
          dispatch(loadingActions.doLoadingSuccess())
        })
    }
  }

  const handleGetVoucherListBelongToUser = useCallback(() => {
    if (router.asPath.length !== router.pathname.length) {
      if (router.query.key) {
        setValue('search', router.query.key)
      }
      if (!isEmptyObject(router.query)) {
        handleGetVoucherList(router.query)
      }
    } else {
      handleGetVoucherList({})
    }
  }, [router.asPath.length, router.pathname.length, router.query])

  useEffect(() => {
    handleGetVoucherListBelongToUser()
  }, [handleGetVoucherListBelongToUser])

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
              name="search"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="search"
                    error={!!errors.search}
                    placeholder={t('searchCodeOrTitle')}
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
        <Grid xs style={{ maxWidth: '288px' }}>
          <Link href={`/${platform().toLowerCase()}/promotion/voucher/create`}>
            <a>
              <ButtonCustom variant="contained" fullWidth size="large">
                {t('addNewVoucher')}
              </ButtonCustom>
            </a>
          </Link>
        </Grid>
      </Grid>
      {stateVoucherList?.data?.length === 0 ? (
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
                  {t('thereAreNoVoucherToShow')}
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
                  <TableCellTws>{t('title')}</TableCellTws>
                  <TableCellTws
                    sx={{
                      width: '150',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {t('code')}
                  </TableCellTws>
                  <TableCellTws width={200}>{t('discountAmount')}</TableCellTws>
                  <TableCellTws>{t('usage')}</TableCellTws>
                  <TableCellTws>{t('limit')}</TableCellTws>
                  <TableCellTws>{t('expiry')}</TableCellTws>
                  <TableCellTws>{t('availability')}</TableCellTws>
                  <TableCellTws>{t('status')}</TableCellTws>
                  <TableCellTws></TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateVoucherList?.data?.map((item, index) => {
                  return (
                    <React.Fragment key={`item-${index}`}>
                      <TableRowTws
                        key={`item-${index}`}
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        <TableCellTws></TableCellTws>
                        <TableCellTws>{item.title}</TableCellTws>
                        <TableCellTws>{item.code}</TableCellTws>
                        <TableCellTws>
                          {item.discount_amount
                            ? item.type === 'FIXEDAMOUNT'
                              ? formatMoney(item.discount_amount)
                              : item.discount_amount + '%'
                            : // formatMoney(item.discount_amount)
                              'N/A'}
                        </TableCellTws>
                        <TableCellTws>{item.usage}</TableCellTws>
                        <TableCellTws>
                          {item.limit?.toLocaleString('en-US')}
                        </TableCellTws>
                        <TableCellTws>
                          {item.expiry
                            ? moment(item.expiry).format('MM/DD/YYYY')
                            : 'N/A'}
                        </TableCellTws>
                        <TableCellTws>
                          {platform() === 'RETAILER' &&
                            item.availability
                              ?.map((item) => enumAvailability[item])
                              .join(', ')}
                        </TableCellTws>
                        <TableCellTws>
                          {t(`${item.status}` as any)}
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
              count={stateVoucherList ? stateVoucherList.totalPages : 0}
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
          <TypographyH2 sx={{ marginBottom: '10px' }}>
            {t('filterVoucher')}
          </TypographyH2>
          <form onSubmit={handleSubmitFilter(onSubmitFilter)}>
            <Box mb={2}>
              <InputLabelCustom
                htmlFor="date"
                sx={{
                  color: '#49516F',
                  fontSize: '1.2rem',
                }}
              >
                {t('date')}
              </InputLabelCustom>
              <Grid container spacing={2}>
                <Grid xs>
                  <Controller
                    control={controlFilter}
                    defaultValue=""
                    name="expiry_date_gte"
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
                                  setValueFilter('expiry_date_gte', '', {
                                    shouldValidate: true,
                                  })
                                } else {
                                  setValueFilter(
                                    'expiry_date_gte',
                                    dayjs(value).format('MM/DD/YYYY'),
                                    { shouldValidate: true }
                                  )
                                }
                              }}
                              renderInput={(params: any) => {
                                return (
                                  <TextFieldCustom
                                    {...params}
                                    error={!!errorsFilter.expiry_date_gte}
                                  />
                                )
                              }}
                            />
                          </LocalizationProvider>
                          <FormHelperText
                            error={!!errorsFilter.expiry_date_gte}
                          >
                            {errorsFilter.expiry_date_gte &&
                              `${errorsFilter.expiry_date_gte.message}`}
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
                    name="expiry_date_lte"
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
                                  setValueFilter('expiry_date_lte', '', {
                                    shouldValidate: true,
                                  })
                                } else {
                                  setValueFilter(
                                    'expiry_date_lte',
                                    dayjs(value).format('MM/DD/YYYY'),
                                    { shouldValidate: true }
                                  )
                                }
                              }}
                              renderInput={(params) => (
                                <TextFieldCustom
                                  {...params}
                                  error={!!errorsFilter.expiry_date_lte}
                                />
                              )}
                            />
                          </LocalizationProvider>
                          <FormHelperText
                            error={!!errorsFilter.expiry_date_lte}
                          >
                            {errorsFilter.expiry_date_lte &&
                              `${errorsFilter.expiry_date_lte.message}`}
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
                htmlFor="reason"
                sx={{
                  color: '#49516F',
                  fontSize: '1.2rem',
                }}
              >
                {t('status')}
              </InputLabelCustom>
              <Controller
                control={controlFilter}
                name="status"
                defaultValue={[]}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <SelectCustom
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '4px',
                          fontSize: '1.4rem',
                          borderWidth: '1px !important',
                          borderColor: '#E1E6EF',
                        },
                      }}
                      IconComponent={() => (
                        <KeyboardArrowDownIcon
                          sx={{ border: '1.5px #49516F' }}
                        />
                      )}
                      id="status"
                      {...field}
                      value={field.value}
                      onChange={(event: any) => {
                        const {
                          target: { value },
                        } = event
                        setValueFilter(
                          'status',
                          typeof value === 'string' ? value.split(',') : value
                        )
                      }}
                    >
                      {statusFilter.map((item, index) => (
                        <MenuItemSelectCustom
                          key={index + 1}
                          value={item.value}
                        >
                          {t(`${item.name}` as any)}
                        </MenuItemSelectCustom>
                      ))}
                    </SelectCustom>
                  </FormControl>
                )}
              />
            </Box>

            <Box mb={2}>
              <InputLabelCustom
                htmlFor="reason"
                sx={{
                  color: '#49516F',
                  fontSize: '1.2rem',
                }}
              >
                {t('availability')}
              </InputLabelCustom>
              <Controller
                control={controlFilter}
                name="availability"
                defaultValue={[]}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <SelectCustom
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderRadius: '4px',
                          fontSize: '1.4rem',
                          borderWidth: '1px !important',
                          borderColor: '#E1E6EF',
                        },
                      }}
                      IconComponent={() => (
                        <KeyboardArrowDownIcon
                          sx={{ border: '1.5px #49516F' }}
                        />
                      )}
                      id="status"
                      {...field}
                      value={field.value}
                      multiple
                      onChange={(event: any) => {
                        const {
                          target: { value },
                        } = event
                        setValueFilter(
                          'availability',
                          typeof value === 'string' ? value.split(',') : value
                        )
                      }}
                    >
                      {availabilityFilter.map((item, index) => (
                        <MenuItemSelectCustom
                          key={index + 1}
                          value={item.value}
                        >
                          {t(`${item.name}` as any)}
                        </MenuItemSelectCustom>
                      ))}
                    </SelectCustom>
                  </FormControl>
                )}
              />
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
                  onClick={() => setStateDrawerFilter(false)}
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

      <MenuAction
        elevation={0}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
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
        <MenuItem
          onClick={() => {
            setStateDrawerDetail(true)
            handleCloseMenu()
          }}
        >
          {t('viewDetails')}
        </MenuItem>
      </MenuAction>

      <VoucherDetailComponent
        open={stateDrawerDetail}
        onClose={setStateDrawerDetail}
        stateIdProduct={stateIdProduct}
        handleGetVoucherList={handleGetVoucherList}
      />
    </>
  )
}

export default ListVoucherComponent
