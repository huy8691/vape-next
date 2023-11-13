import React, { ChangeEvent, useEffect, useMemo, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useAppDispatch } from 'src/store/hooks'
import { useRouter } from 'next/router'
import { getSupplierRequestList } from '../../supplierRequestAPI'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  formatPhoneNumber,
  handlerGetErrMessage,
  isEmptyObject,
  objToStringParam,
} from 'src/utils/global.utils'
import Grid from '@mui/material/Unstable_Grid2'
import {
  ButtonCancel,
  ButtonCustom,
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
} from 'src/components'
import {
  Badge,
  Box,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Pagination,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { SupplierRequestDataResponseType } from '../../supplierRequestModel'
import Image from 'next/image'
import DetailSupplierRequest from '../detail'
import moment, { Moment } from 'moment'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import styled from '@emotion/styled'
import { useTranslation } from 'react-i18next'
import { Controller, useForm } from 'react-hook-form'
import {
  ArrowRight,
  FunnelSimple,
  MagnifyingGlass,
} from '@phosphor-icons/react'
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
const TypographyCustom = styled(Typography)({
  fontWeight: '500',
  color: '#49516F',
})

const ListRequest = () => {
  const { t } = useTranslation(['request-supplier'])
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateShowDetail, setStateShowDetail] = useState(false)

  const [stateIdRequest, setStateIdRequest] = useState<number>()
  const [stateSupplierRequest, setStateSupplierRequestList] =
    useState<SupplierRequestDataResponseType>()

  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)
  const [pushMessage] = useEnqueueSnackbar()
  const Status = useMemo(
    () => [
      {
        status: 'NEW',
        text: t('new'),
        color: '#49516F',
      },
      {
        status: 'APPROVED',
        text: t('approved'),
        color: '#1DB46A',
      },
      {
        status: 'REJECTED',
        text: t('rejected'),
        color: '#E02D3C',
      },
    ],
    [t]
  )

  const handleGetSupplierRequestList = (query: object) => {
    dispatch(loadingActions.doLoading())
    getSupplierRequestList(query)
      .then((res) => {
        const data = res.data
        setStateSupplierRequestList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((error) => {
        const { status, data } = error.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  useEffect(() => {
    if (router.asPath.length !== router.pathname.length) {
      console.log('router')
      if (!isEmptyObject(router.query)) {
        handleGetSupplierRequestList(router.query)
      }
    } else {
      handleGetSupplierRequestList({})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<any>({
    // resolver: yupResolver(schema),
    // mode: 'all',
  })

  //pagination
  const handleChangePagination = (
    event: ChangeEvent<unknown>,
    page: number
  ) => {
    console.log(event)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }
  const handleChangeRowsPerPage = (event: SelectChangeEvent<unknown>) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }
  const handleShowDetail = () => {
    setStateShowDetail(false)
  }
  const handleClickRow = (id: number) => {
    setStateShowDetail(true)
    setStateIdRequest(id)
  }
  const onSubmit = (data: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        search: data.search,
        page: 1,
      })}`,
    })
  }
  const handleOpenMenuFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorFilter(event.currentTarget)
  }

  const handleCloseMenuFilter = () => {
    setAnchorFilter(null)
  }
  const onSubmitFilter = (values: any) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          time_from: values.time_from,
          time_to: values.time_to,
          date_from: values.from_date,
          date_to: values.to_date,
          status: values.status,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
    handleCloseMenuFilter()
  }
  const handleReset = () => {
    resetFilter({
      from_date: null,
      to_date: null,
      time_from: null,
      time_to: null,
      status: null,
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
    reset: resetFilter,
    handleSubmit: handleSubmitFilter,
    setValue: setValueFilter,
    register,
    control: controlFilter,
    formState: { errors: errorsFilter },
  } = useForm({
    mode: 'all',
  })
  return (
    <>
      <Grid container columnSpacing={'28px'} mb={2}>
        <Grid xs>
          <form onSubmit={handleSubmit(onSubmit)} className="form-search">
            <Controller
              control={control}
              name="search"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="search"
                    error={!!errors.search}
                    placeholder={'Search...'}
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
      </Grid>
      {stateSupplierRequest?.data?.length === 0 ? (
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
                  {t('thereAreNoRequestSupplierToShow')}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
          <TableContainerTws sx={{ marginTop: '0px' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws>{t('business')}</TableCellTws>
                  <TableCellTws>{t('owner')}</TableCellTws>
                  <TableCellTws>{t('pointOfContact')}</TableCellTws>
                  <TableCellTws>{t('requestDate')}</TableCellTws>
                  <TableCellTws>{t('status')}</TableCellTws>

                  {/* {handleCheckGear() && (
                <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                  {t('action')}
                </TableCellTws>
              )} */}
                </TableRow>
              </TableHead>
              <TableBody>
                {stateSupplierRequest?.data?.map((item: any, index: number) => (
                  <TableRowTws
                    key={`item-${index}`}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleClickRow(item.id)}
                  >
                    <TableCellTws>
                      <Stack direction={'column'}>
                        <TypographyCustom>
                          {item.business_name ? item.business_name : 'N/A'}
                        </TypographyCustom>
                        <TypographyCustom>
                          {formatPhoneNumber(
                            item.business_phone_number
                              ? item.business_phone_number
                              : 'N/A'
                          )}
                        </TypographyCustom>
                      </Stack>
                    </TableCellTws>
                    <TableCellTws>
                      <Stack direction={'column'}>
                        <TypographyCustom>
                          {item.first_name} {item.last_name}
                        </TypographyCustom>
                        <TypographyCustom>
                          {formatPhoneNumber(
                            item.phone_number ? item.phone_number : 'N/A'
                          )}
                        </TypographyCustom>
                        <TypographyCustom>
                          {item.email ? item.email : 'N/A'}
                        </TypographyCustom>
                      </Stack>
                    </TableCellTws>
                    <TableCellTws>
                      <Stack direction={'column'}>
                        <TypographyCustom>
                          {item.poc_first_name} {item.poc_last_name}
                        </TypographyCustom>
                        <TypographyCustom>
                          {formatPhoneNumber(
                            item.poc_phone_number
                              ? item.poc_phone_number
                              : 'N/A'
                          )}
                        </TypographyCustom>
                        <TypographyCustom>
                          {item.poc_email ? item.poc_email : 'N/A'}
                        </TypographyCustom>
                      </Stack>
                    </TableCellTws>
                    <TableCellTws>
                      {item.updated_at
                        ? moment(item.updated_at).format('LLL')
                        : 'N/A'}
                    </TableCellTws>
                    <TableCellTws
                      style={{
                        textTransform: 'capitalize',
                        color: `${
                          Status.find((items) => items.status === item?.status)
                            ?.color
                        }`,
                      }}
                    >
                      {Status?.find(
                        (items) => items.status === item?.status
                      )?.text.toLowerCase()}
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
              count={stateSupplierRequest ? stateSupplierRequest.totalPages : 0}
            />
          </Stack>
          <Drawer
            anchor={'right'}
            open={Boolean(anchorFilter)}
            onClose={handleCloseMenuFilter}
          >
            <Box sx={{ padding: '20px', width: '550px' }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ marginBottom: '10px' }}
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
                <Box mb={2}>
                  <InputLabelCustom
                    htmlFor="assignee"
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
                        name="from_date"
                        render={({ field }) => (
                          <Box>
                            <FormControl fullWidth>
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="MM/DD/YYYY"
                                  {...field}
                                  onChange={(value: Moment | null) => {
                                    if (!value) {
                                      console.log('?', value, field)
                                      setValueFilter('from_date', '', {
                                        shouldValidate: true,
                                      })
                                    } else {
                                      setValueFilter(
                                        'from_date',
                                        moment(value).format('MM/DD/YYYY'),
                                        { shouldValidate: true }
                                      )
                                    }
                                  }}
                                  shouldDisableDate={(day: any) => {
                                    const date = new Date()
                                    if (
                                      moment(day).format('YYYY-MM-DD') >
                                      moment(date).format('YYYY-MM-DD')
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
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker
                                  inputFormat="MM/DD/YYYY"
                                  {...field}
                                  onChange={(value: Moment | null) => {
                                    if (!value) {
                                      console.log('?', value)
                                      setValueFilter('to_date', '', {
                                        shouldValidate: true,
                                      })
                                    } else {
                                      setValueFilter(
                                        'to_date',
                                        moment(value).format('MM/DD/YYYY'),
                                        { shouldValidate: true }
                                      )
                                    }
                                  }}
                                  shouldDisableDate={(day: any) => {
                                    const date = new Date()
                                    if (
                                      moment(day).format('YYYY-MM-DD') >
                                      moment(date).format('YYYY-MM-DD')
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
                    htmlFor="assignee"
                    sx={{
                      color: '#49516F',
                      fontSize: '1.2rem',
                    }}
                  >
                    {t('time')}
                  </InputLabelCustom>
                  <Grid container spacing={2}>
                    <Grid xs>
                      <Controller
                        control={controlFilter}
                        defaultValue=""
                        name="time_from"
                        render={({ field }) => (
                          <Box>
                            <FormControl fullWidth>
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  {...field}
                                  value={moment(field.value, 'HH:mm:ss')}
                                  onChange={(value: Moment | null) => {
                                    if (!value) {
                                      setValueFilter('time_from', '', {
                                        shouldValidate: true,
                                      })
                                    } else {
                                      setValueFilter(
                                        'time_from',
                                        moment(value, 'HH:mm:ss').format(
                                          'HH:mm:ss'
                                        ),
                                        {
                                          shouldValidate: true,
                                        }
                                      )
                                    }
                                  }}
                                  renderInput={(params) => (
                                    <TextFieldCustom
                                      {...params}
                                      error={!!errorsFilter.to_date}
                                    />
                                  )}
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
                        name="time_to"
                        render={({ field }) => (
                          <Box>
                            <FormControl fullWidth>
                              <LocalizationProvider dateAdapter={AdapterMoment}>
                                <TimePicker
                                  {...field}
                                  value={moment(field.value, 'HH:mm:ss')}
                                  onChange={(value: Moment | null) => {
                                    if (!value) {
                                      setValueFilter('time_to', '', {
                                        shouldValidate: true,
                                      })
                                    } else {
                                      setValueFilter(
                                        'time_to',
                                        moment(value, 'HH:mm:ss').format(
                                          'HH:mm:ss'
                                        ),
                                        {
                                          shouldValidate: true,
                                        }
                                      )
                                    }
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
                    sx={{
                      color: '#49516F',
                      fontSize: '1.2rem',
                    }}
                  >
                    {t('status')}
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
                                  return Status.filter(
                                    (item) => item.status === value
                                  )[0].text
                                }}
                                {...field}
                                {...register('status')}
                                onChange={(event: any) => {
                                  setValueFilter('status', event.target.value)
                                }}
                              >
                                {Status.map((item, index) => (
                                  <MenuItem value={item.status} key={index}>
                                    {item.text}
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
                <Stack direction="row" spacing={2}>
                  <ButtonCancel
                    type="reset"
                    onClick={handleReset}
                    size="large"
                    sx={{ color: '#49516F' }}
                  >
                    {t('reset')}
                  </ButtonCancel>
                  <ButtonCustom variant="contained" size="large" type="submit">
                    {t('filter')}
                  </ButtonCustom>
                </Stack>
              </form>
            </Box>
          </Drawer>
        </>
      )}
      <DetailSupplierRequest
        stateShowDetail={stateShowDetail}
        handleShowDetail={handleShowDetail}
        stateIdRequest={stateIdRequest}
        handleGetSupplierRequestList={() =>
          handleGetSupplierRequestList(router.query)
        }
      />
    </>
  )
}
export default ListRequest
