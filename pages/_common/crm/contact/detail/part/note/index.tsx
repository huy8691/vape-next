import {
  BoxCustom,
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  MenuAction,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TextFieldCustom,
  TypographyH2,
  ReadMore,
} from 'src/components'
import {
  Avatar,
  Box,
  Dialog,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Pagination,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import CircleIcon from '@mui/icons-material/Circle'
import {
  ActivityLogType,
  ActivityLogsDataResponseType,
  CreateActivityLogsType,
  UpdateActivityLogsType,
} from '../../modelContactDetail'
import { Controller, useForm } from 'react-hook-form'
import { ChangeEvent, useEffect, useState } from 'react'
import {
  createActivityLogs,
  deleteActivityLogs,
  getListActivityLogs,
  updateActivityLogs,
} from '../../apiContactDetail'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from '../../validations'
import { handlerGetErrMessage, objToStringParam } from 'src/utils/global.utils'
import { loadingActions } from 'src/store/loading/loadingSlice'
import Image from 'next/image'
import moment from 'moment'
import { DotsThreeVertical, X } from '@phosphor-icons/react'
import { useTranslation } from 'react-i18next'

const Note: React.FC = () => {
  const { t } = useTranslation('contact')
  const [pushMessage] = useEnqueueSnackbar()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const userInfo = useAppSelector((state) => state.userInfo)
  const [stateListActivityLogs, setStateListActivityLogs] =
    useState<ActivityLogsDataResponseType>({
      data: [],
    })
  const [stateActivityLog, setStateActivityLog] = useState<ActivityLogType>()
  const [stateActivityLogIsUpdate, setStateActivityLogIsUpdate] =
    useState<ActivityLogType>()
  const [stateOpenDialog, setStateOpenDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  //   const [valueTab, setValueTab] = useState<string>('ACTIVITY LOG')
  const [stateOpenInput, setStateOpenInput] = useState<boolean>(false)
  const open = Boolean(anchorEl)
  const handleDialogDelete = () => {
    setStateOpenDialog(!stateOpenDialog)
    handleClose()
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  // handle delete Activity log
  const handleDeleteActivityLog = () => {
    dispatch(loadingActions.doLoading())
    if (stateActivityLog) {
      deleteActivityLogs(stateActivityLog.id)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          handleDialogDelete()
          pushMessage(t('message.theNoteHasBeenDeletedSuccessfully'), 'success')
          handleGetListActivityLogs()
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }
  //form create note
  const {
    handleSubmit,
    control,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<CreateActivityLogsType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
    reValidateMode: 'onChange',
  })

  //form update Activity log
  const {
    handleSubmit: handleSubmitUpdate,
    control: controlUpdate,
    formState: { errors: errorsUpdate },
    setValue: setValueUpdate,
    reset: resetUpdate,
  } = useForm<CreateActivityLogsType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  //handle submit create Activity log
  const onSubmit = (values: CreateActivityLogsType) => {
    dispatch(loadingActions.doLoading())
    createActivityLogs(Number(router.query.id), {
      content: values?.content,
      log_type: 2,
      files: null,
    })
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('message.createNoteSuccessfully'), 'success')
        handleGetListActivityLogs()
        reset()
        router.replace(
          {
            search: `${objToStringParam({
              ...router.query,
              page: 1,
            })}`,
          },
          undefined,
          { scroll: false }
        )
      })
      .catch(({ response }) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleGetDetailActivityLog = () => {
    if (stateActivityLog) {
      setValueUpdate('content', stateActivityLog?.content)
      setStateActivityLogIsUpdate(stateActivityLog)
    }
  }

  //handle submit update Activity log
  const onSubmitUpdate = (values: UpdateActivityLogsType) => {
    dispatch(loadingActions.doLoading())
    if (stateActivityLog) {
      updateActivityLogs(stateActivityLog.id, {
        ...values,
      })
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('message.updateNoteSuccessfully'), 'success')
          handleGetListActivityLogs()
          resetUpdate()
          setStateActivityLog(undefined)
          setStateActivityLogIsUpdate(undefined)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  //handle get list activity log
  const handleGetListActivityLogs = () => {
    dispatch(loadingActions.doLoading())
    getListActivityLogs(Number(router.query.id), {
      limit: router?.query?.limit,
      page: router?.query?.page,
      log_type__name: 'NOTE',
    })
      .then((response) => {
        const { data } = response
        setStateListActivityLogs(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        console.log('??', status)
        if (status === 404) {
          router.push('/404')
        } else {
          pushMessage(handlerGetErrMessage(status, data), 'error')
        }
      })
  }

  // handleChangePagination
  const handleChangePagination = (
    _event: ChangeEvent<unknown>,
    page: number
  ) => {
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

  useEffect(() => {
    if (router.query.id) {
      handleGetListActivityLogs()
    }
    clearErrors('content')
  }, [router.query.id, router.query.page, router.query.limit])

  return (
    <>
      <BoxCustom mb={2}>
        <Stack spacing={2} direction="row">
          <Avatar
            alt={userInfo?.data?.first_name}
            src={userInfo?.data?.avatar}
            sx={{ width: 36, height: 36 }}
          />
          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
            <Stack spacing={2} direction="column">
              <Controller
                control={control}
                name="content"
                defaultValue=""
                render={({ field }) => (
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="content"
                      onClick={() => setStateOpenInput(true)}
                      multiline={stateOpenInput}
                      rows={stateOpenInput ? 4 : 1}
                      placeholder={t('details.enterNote')}
                      error={!!errors.content}
                      autoFocus={stateOpenInput}
                      sx={{ backgroundColor: '#FFFFFF' }}
                      {...field}
                    />
                    <FormHelperText error={!!errors.content}>
                      {errors.content && `${errors.content.message}`}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              {stateOpenInput && (
                <Box sx={{ marginLeft: 'auto !important' }}>
                  <ButtonCustom variant="contained" type="submit" size="small">
                    {t('details.send')}
                  </ButtonCustom>
                </Box>
              )}
            </Stack>
          </form>
        </Stack>
      </BoxCustom>
      <Box>
        {stateListActivityLogs?.data.length === 0 ? (
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
                    {t('details.thereAreNoNoteAtThisTime')}
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </>
        ) : (
          <>
            {stateListActivityLogs?.data.map(
              (item: ActivityLogType, index: number) => {
                return (
                  <Stack
                    spacing="15px"
                    key={index}
                    sx={{
                      color: '#49516F',
                      border: '1px solid #E1E6EF',
                      borderRadius: ' 10px',
                      padding: '15px',
                      marginTop: '10px',
                    }}
                    mb={2}
                  >
                    <Stack direction="row" justifyContent="space-between">
                      <Stack spacing="14px" direction="row" alignItems="center">
                        <Avatar
                          alt={item?.full_name}
                          src={item.avatar}
                          sx={{ width: 36, height: 36 }}
                        />
                        <TypographyH2 sx={{ fontSize: '14px' }}>
                          {item?.full_name}
                        </TypographyH2>
                        <Typography
                          sx={{ color: '#1DB46A', fontStyle: 'italic' }}
                        >
                          {t('details.loggedAnNote')}
                        </Typography>
                      </Stack>
                      <Stack spacing="10px" direction="row" alignItems="center">
                        <Typography sx={{ fontStyle: 'italic' }}>
                          {moment(item.time).format('MM/DD/YYYY - hh:mm A')}
                        </Typography>
                        {item?.is_edited && (
                          <Tooltip
                            title={`${moment(item?.updated_time).format(
                              'MM/DD/YYYY - hh:mm A'
                            )}`}
                            arrow
                            placement="top"
                          >
                            <Typography>
                              <CircleIcon
                                sx={{
                                  fontSize: '8px',
                                  marginRight: '5px',
                                }}
                              />
                              {t('details.edited')}
                            </Typography>
                          </Tooltip>
                        )}
                        <IconButton
                          onClick={(event) => {
                            setStateActivityLog(item)
                            handleOpenMenu(event)
                          }}
                          sx={{ padding: '0' }}
                        >
                          <DotsThreeVertical size={24} />
                        </IconButton>
                      </Stack>
                    </Stack>
                    {stateActivityLogIsUpdate?.id === item.id ? (
                      <form
                        onSubmit={handleSubmitUpdate(onSubmitUpdate)}
                        style={{ width: '100%' }}
                      >
                        <Box mb={1}>
                          <Controller
                            control={controlUpdate}
                            name="content"
                            defaultValue={item.content}
                            render={({ field }) => (
                              <FormControl fullWidth>
                                <TextFieldCustom
                                  id="content"
                                  multiline={true}
                                  rows={4}
                                  placeholder={t('details.enterNote')}
                                  error={!!errorsUpdate.content}
                                  {...field}
                                />
                                <FormHelperText error={!!errorsUpdate.content}>
                                  {errorsUpdate.content &&
                                    `${errorsUpdate.content.message}`}
                                </FormHelperText>
                              </FormControl>
                            )}
                          />
                        </Box>
                        <Grid container justifyContent="flex-end" spacing={2}>
                          <Grid xs="auto">
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              spacing={1}
                              style={{
                                marginLeft: 'auto',
                              }}
                            >
                              <ButtonCancel
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                  setStateActivityLog(undefined)
                                  setStateActivityLogIsUpdate(undefined)
                                }}
                              >
                                {t('details.cancel')}
                              </ButtonCancel>
                              <ButtonCustom
                                variant="contained"
                                type="submit"
                                size="small"
                                sx={{ marginLeft: 'auto' }}
                              >
                                {t('details.update')}
                              </ButtonCustom>
                            </Stack>
                          </Grid>
                        </Grid>
                      </form>
                    ) : (
                      <>
                        <Typography>
                          <ReadMore>{item.content}</ReadMore>
                        </Typography>
                      </>
                    )}
                  </Stack>
                )
              }
            )}
          </>
        )}

        {Number(stateListActivityLogs?.totalPages) >= 1 &&
          stateListActivityLogs?.data.length > 0 && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={2}
            >
              <Typography>{t('details.rowsPerPage')}</Typography>
              <FormControl sx={{ m: 1 }}>
                <SelectPaginationCustom
                  value={
                    Number(router.query.limit) ? Number(router.query.limit) : 10
                  }
                  onChange={handleChangeRowsPerPage}
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
                onChange={(e, page: number) => handleChangePagination(e, page)}
                count={
                  stateListActivityLogs ? stateListActivityLogs?.totalPages : 0
                }
              />
            </Stack>
          )}
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
          <MenuItem
            onClick={() => {
              handleCloseMenu()
              handleGetDetailActivityLog()
            }}
          >
            {t('edit')}
          </MenuItem>
          <MenuItem onClick={handleDialogDelete} sx={{ justifyContent: 'end' }}>
            {t('details.delete')}
          </MenuItem>
        </MenuAction>
      </Box>

      <Dialog open={stateOpenDialog} onClose={handleDialogDelete}>
        <DialogTitleTws>
          <IconButton onClick={handleDialogDelete}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {`Delete note`}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {t('details.areYouSureToDelete')}
          </DialogContentTextTws>
        </DialogContentTws>
        <DialogActionsTws>
          <Stack spacing={2} direction="row">
            <ButtonCancel
              onClick={handleDialogDelete}
              variant="outlined"
              size="large"
            >
              {t('details.no')}
            </ButtonCancel>
            <ButtonCustom
              variant="contained"
              onClick={handleDeleteActivityLog}
              size="large"
            >
              {t('details.yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
    </>
  )
}

export default Note
