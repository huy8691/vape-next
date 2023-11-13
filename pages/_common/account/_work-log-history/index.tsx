import {
  Badge,
  Box,
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
import { ArrowRight, FunnelSimple } from '@phosphor-icons/react'
import moment, { Moment } from 'moment'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  InputLabelCustom,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldCustom,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, objToStringParam } from 'src/utils/global.utils'
import CreateUpdateWorkLogComponent from './part/createUpdate'
import { getListWorkLogHistory } from './workLogHistoryAPI'
import {
  WorkLogHistoryDataType,
  WorkLogHistoryResponseType,
} from './workLogHistoryModels'

const WorkLogHistoryComponent: React.FC = () => {
  const { t } = useTranslation('account')
  const dispatch = useAppDispatch()
  const [stateWorkLogHistory, setStateWorkLogHistory] =
    useState<WorkLogHistoryResponseType>()
  const [pushMessage] = useEnqueueSnackbar()
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  // const [openDialog, setOpenDialog] = useState(false)
  const [stateWorkLog, setStateWorkLog] = useState<WorkLogHistoryDataType>()
  const [anchorFilter, setAnchorFilter] = useState<HTMLElement | null>(null)
  const [anchorUpdate, setAnchorUpdate] = useState<HTMLElement | null>(null)
  // const [stateTotalSpentTime, setStateTotalSpentTime] = useState(0)
  const { isRefresh } = useAppSelector((state) => state.workLogs)

  const router = useRouter()
  const tabs = router.query.tab

  useEffect(() => {
    if (tabs === 'work-log-history') {
      const { tab, ...rest } = router.query
      console.log('tab:', tab)
      handleGetWorkLogHistoryList({
        ...rest,
        page: router.query.page,
        limit: router.query.limit,
      })
    }
  }, [router.query, tabs, isRefresh])

  const {
    reset: resetFilter,
    handleSubmit: handleSubmitFilter,
    setValue: setValueFilter,
    control: controlFilter,
    formState: { errors: errorsFilter },
  } = useForm({
    mode: 'all',
  })

  // const handleFormatTimeSpent = (totalMinutes: number) => {
  //   const minutesInHour = 60
  //   const minutesInDay = 24 * minutesInHour
  //   const hours = Math.floor((totalMinutes % minutesInDay) / minutesInHour)
  //   const minutes = totalMinutes % minutesInHour
  //   const formattedTime = `${hours}h ${minutes}m`

  //   return formattedTime
  // }

  const handleGetWorkLogHistoryList = (query: object) => {
    dispatch(loadingActions.doLoading())
    getListWorkLogHistory(query)
      .then((res) => {
        const { data } = res
        setStateWorkLogHistory(data)
        dispatch(loadingActions.doLoadingSuccess())

        // getTotalSpentTime().then((res) => {
        //   const { data } = res.data
        //   setStateTotalSpentTime(data)
        // })
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

  // const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget)
  // }

  // const handleCloseMenu = () => {
  //   setAnchorEl(null)
  // }

  // const handleDialogDelete = () => {
  //   setOpenDialog(!openDialog)
  //   handleCloseMenu()
  // }

  // const handleDeleteContact = () => {
  //   deleteWorkLogHistory(Number(stateWorkLog?.id))
  //     .then(() => {
  //       dispatch(loadingActions.doLoadingSuccess())
  //       handleDialogDelete()
  //       pushMessage(t('message.theWorkLogHasBeenDeleted'), 'success')
  //       setStateWorkLog(undefined)
  //       handleGetWorkLogHistoryList({
  //         page: router.query.page,
  //         limit: router.query.limit,
  //       })
  //     })
  //     .catch((response) => {
  //       dispatch(loadingActions.doLoadingFailure())
  //       const { status, data } = response.response
  //       pushMessage(handlerGetErrMessage(status, data), 'error')
  //       handleDialogDelete()
  //       setStateWorkLog(undefined)
  //     })
  // }

  const handleOpenMenuFilter = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorFilter(event.currentTarget)
  }

  // const handleOpenEdit = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorUpdate(event.currentTarget)
  //   handleCloseMenu()
  // }

  const handleCloseMenuFilter = () => {
    setAnchorFilter(null)
  }

  const handleCloseEdit = () => {
    setAnchorUpdate(null)
    setStateWorkLog(undefined)
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
          tab: 'work-log-history',
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
        {/* <Box
          sx={{
            backgroundColor: '#F8F9FC',
            padding: '15px',
          }}
        >
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            gap={'15px'}
          >
            <Typography
              sx={{
                color: '#0A0D14',
                fontSize: '16px',
                fontWeight: 600,
              }}
            >
              {t('totalTimeSpent')}
            </Typography>
            <Typography
              sx={{
                color: '#1DB46A',
                fontSize: '20px',
                fontWeight: 700,
              }}
            >
              {convertMinutesToHHMM(stateTotalSpentTime)}
            </Typography>
          </Stack>
        </Box> */}
        {/* <ButtonCustom
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            setStateWorkLog(undefined)
            handleOpenEdit(e)
          }}
          variant="contained"
          size="large"
          sx={{
            border: '1px solid #E1E6EF',
            color: '#49516F',
            minWidth: '200px',
          }}
        >
          {t('createWorkLog')}
        </ButtonCustom> */}
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
              {/* <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                {t('action')}
              </TableCellTws> */}
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
                    {/* <TableCellTws sx={{ textAlign: 'center' }}>
                      <IconButton
                        onClick={(e) => {
                          handleOpenMenu(e)
                          setStateWorkLog(item)
                          e.stopPropagation()
                        }}
                      >
                        <Gear size={28} />
                      </IconButton>
                    </TableCellTws> */}
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

      {/* <MenuAction
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
        <MenuItem onClick={handleOpenEdit}>{t('edit')}</MenuItem>
        <MenuItem onClick={handleDialogDelete} sx={{ justifyContent: 'end' }}>
          {t('delete')}
        </MenuItem>
      </MenuAction> */}

      {/* <Dialog open={openDialog} onClose={handleDialogDelete}>
        <DialogTitleTws>
          <IconButton onClick={handleDialogDelete}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('deleteContact')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {t('areYouSureToDeleteTheWorkLog')}
          </DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={handleDialogDelete}
              variant="outlined"
              size="large"
            >
              {t('no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleDeleteContact}
              size="large"
            >
              {t('yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog> */}

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
      <CreateUpdateWorkLogComponent
        stateWorkLog={stateWorkLog}
        open={Boolean(anchorUpdate)}
        onClose={handleCloseEdit}
        // handleGetWorkLogHistoryList={handleGetWorkLogHistoryList}
      />
    </>
  )
}

export default WorkLogHistoryComponent
