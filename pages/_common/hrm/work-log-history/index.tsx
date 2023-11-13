import {
  Badge,
  Box,
  Dialog,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  Pagination,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableHead,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { ArrowRight, FunnelSimple, X } from '@phosphor-icons/react'
import moment, { Moment } from 'moment'
import { useRouter } from 'next/router'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldCustom,
  TypographyH2,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, objToStringParam } from 'src/utils/global.utils'
import { doExportExcel, getListWorkLogHistory } from './workLogHistoryAPI'
import { WorkLogHistoryResponseType } from './workLogHistoryModels'
import CreateUpdateWorkLogComponent from 'pages/_common/account/_work-log-history/part/createUpdate'
import { useTranslation } from 'react-i18next'

const WorkLogHistoryComponent: React.FC = () => {
  const { t } = useTranslation(['work-log-history'])
  const dispatch = useAppDispatch()
  const [stateWorkLogHistory, setStateWorkLogHistory] =
    useState<WorkLogHistoryResponseType>()
  const [pushMessage] = useEnqueueSnackbar()
  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)
  const [anchorUpdate, setAnchorUpdate] = useState<HTMLElement | null>(null)
  const [stateOpenDialog, setStateOpenDialog] = useState(false)

  const router = useRouter()

  useEffect(() => {
    handleGetWorkLogHistoryList({
      ...router.query,
      page: router.query.page,
      limit: router.query.limit,
    })
  }, [router.query])

  const {
    reset: resetFilter,
    handleSubmit: handleSubmitFilter,
    setValue: setValueFilter,
    control: controlFilter,
    formState: { errors: errorsFilter },
  } = useForm({
    mode: 'all',
  })

  const handleGetWorkLogHistoryList = (query: object) => {
    dispatch(loadingActions.doLoading())
    getListWorkLogHistory(query)
      .then((res) => {
        const { data } = res
        setStateWorkLogHistory(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleChangeRowsPerPage = (event: SelectChangeEvent<unknown>) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          limit: Number(event.target.value),
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  const handleChangePagination = (
    event: ChangeEvent<unknown>,
    page: number
  ) => {
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

  const handleOpenMenuFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorFilter(event.currentTarget)
  }

  const handleCloseMenuFilter = () => {
    setAnchorFilter(null)
  }

  const handleCloseEdit = () => {
    setAnchorUpdate(null)
  }

  const handleReset = () => {
    resetFilter({
      from_date: null,
      to_date: null,
      time_from: null,
      time_to: null,
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

  const onSubmitFilter = (values: any) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          time_from: values.time_from,
          time_to: values.time_to,
          date_from: values.from_date,
          date_to: values.to_date,
          page: 1,
        })}`,
      },
      undefined,
      { scroll: false }
    )
    handleCloseMenuFilter()
  }

  const doExportExcelClick = () => {
    dispatch(loadingActions.doLoading())
    doExportExcel(router.query)
      .then((res) => {
        const { data } = res.data
        const outputFilename = `${Date.now()}.xls`
        const link = document.createElement('a')
        link.href = data
        link.setAttribute('download', outputFilename)
        document.body.appendChild(link)
        link.click()
        pushMessage(t('message.exportExcelSuccessfully'), 'success')
        setStateOpenDialog(false)
      })
      .finally(() => dispatch(loadingActions.doLoadingSuccess()))
  }

  const convertMinutesToHHMM = (durationInSeconds: number) => {
    if (durationInSeconds === 0) return '00:00:00'
    const hours = Math.floor(durationInSeconds / 3600)
    const minutes = Math.floor((durationInSeconds % 3600) / 60)
    const seconds = Math.floor(durationInSeconds % 60)

    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes = minutes.toString().padStart(2, '0')
    const formattedSeconds = seconds.toString().padStart(2, '0')

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
  }

  return (
    <>
      <Stack
        direction="row"
        justifyContent={'flex-end'}
        alignItems={'center'}
        gap={'15px'}
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
            minWidth: '50px',
          }}
        >
          <Badge color="default">
            <FunnelSimple size={20} />
          </Badge>
        </ButtonCustom>
        <ButtonCustom
          onClick={() => setStateOpenDialog(true)}
          variant="contained"
          size="large"
          sx={{
            border: '1px solid #E1E6EF',
            color: '#49516F',
            minWidth: '200px',
          }}
        >
          {t('exportExcel')}
        </ButtonCustom>
      </Stack>

      <TableContainerTws>
        <Table>
          <TableHead>
            <TableRowTws>
              <TableCellTws>Full name</TableCellTws>
              <TableCellTws>Check-in</TableCellTws>
              <TableCellTws>Check-out</TableCellTws>
              <TableCellTws>Duration</TableCellTws>
              <TableCellTws>Status</TableCellTws>
            </TableRowTws>
          </TableHead>
          <TableBody>
            {stateWorkLogHistory?.data?.map((item, index: number) => {
              return (
                <React.Fragment key={`item-${index}`}>
                  <TableRowTws>
                    <TableCellTws>{item.full_name || 'N/A'}</TableCellTws>
                    <TableCellTws>
                      {item.check_in_at
                        ? moment(item.check_in_at).format(
                            'MMMM D, YYYY hh:mm:ss A'
                          )
                        : 'N/A'}
                    </TableCellTws>
                    <TableCellTws>
                      {item.check_in_at
                        ? moment(item.check_out_at).format(
                            'MMMM D, YYYY hh:mm:ss A'
                          )
                        : 'N/A'}
                    </TableCellTws>
                    <TableCellTws>
                      {convertMinutesToHHMM(item.duration)}
                    </TableCellTws>
                    <TableCellTws>{item.status}</TableCellTws>
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
            value={Number(router.query.limit) ? Number(router.query.limit) : 10}
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
          onChange={(event: ChangeEvent<unknown>, page: number) =>
            handleChangePagination(event, page)
          }
          count={stateWorkLogHistory ? stateWorkLogHistory.totalPages : 0}
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
      <Dialog open={stateOpenDialog} onClose={() => setStateOpenDialog(false)}>
        <DialogTitleTws>
          <IconButton onClick={() => setStateOpenDialog(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('confirmation')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {t('areYouSureYouWantToExportExcel')}
          </DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={() => setStateOpenDialog(false)}
              variant="outlined"
              size="large"
            >
              {t('cancel')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={doExportExcelClick}
              size="large"
            >
              {t('confirm')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
      <CreateUpdateWorkLogComponent
        open={Boolean(anchorUpdate)}
        onClose={handleCloseEdit}
        // handleGetWorkLogHistoryList={handleGetWorkLogHistoryList}
      />
    </>
  )
}

export default WorkLogHistoryComponent
