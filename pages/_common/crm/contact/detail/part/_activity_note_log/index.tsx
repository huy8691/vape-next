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
import Link from 'next/link'
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
import {
  checkPermission,
  handlerGetErrMessage,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import { loadingActions } from 'src/store/loading/loadingSlice'
import UploadFileList from 'src/components/uploadFileList'
import Image from 'next/image'
import moment from 'moment'
import {
  DotsThreeVertical,
  PaperclipHorizontal,
  X,
} from '@phosphor-icons/react'
import WithPermission from 'src/utils/permission.utils'
import { useTranslation } from 'next-i18next'

type Props = {
  handleGetAttachments?: () => void
}

const Note: React.FC<Props> = (props) => {
  const { t } = useTranslation('contact')
  const arrayPermission = useAppSelector((state) => state.permission.data)
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
          pushMessage(
            t('message.theActivityLogHasBeenDeletedSuccessfully'),
            'success'
          )
          handleGetListActivityLogs()
          props.handleGetAttachments && props.handleGetAttachments()
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }
  //form create Activity log
  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    watch,
    reset,
    clearErrors: clearErrorsCreate,
    formState: { errors },
  } = useForm<CreateActivityLogsType>({
    resolver: yupResolver(schema(t)),
    defaultValues: {
      files: [],
    },
    mode: 'all',
    reValidateMode: 'onChange',
  })

  //form update Activity log
  const {
    handleSubmit: handleSubmitUpdate,
    control: controlUpdate,
    formState: { errors: errorsUpdate },
    setValue: setValueUpdate,
    trigger: triggerUpdate,
    watch: watchUpdate,
    reset: resetUpdate,
  } = useForm<CreateActivityLogsType>({
    resolver: yupResolver(schema(t)),
    defaultValues: {
      files: [],
    },
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
      files: values?.files,
      log_type: 1,
    })
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(t('message.createActivityLogSuccessfully'), 'success')
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
        props.handleGetAttachments && props.handleGetAttachments()
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
      setValueUpdate('files', stateActivityLog?.files)
      setStateActivityLogIsUpdate(stateActivityLog)
    }
  }

  //handle submit update Activity log
  const onSubmitUpdate = (values: UpdateActivityLogsType) => {
    dispatch(loadingActions.doLoading())
    if (stateActivityLog) {
      updateActivityLogs(stateActivityLog.id, {
        ...values,
        files:
          Array.isArray(values?.files) && values?.files?.length > 0
            ? values.files
            : null,
      })
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(t('message.updateActivityLogSuccessfully'), 'success')
          handleGetListActivityLogs()
          resetUpdate()
          setStateActivityLog(undefined)
          setStateActivityLogIsUpdate(undefined)
          props.handleGetAttachments && props.handleGetAttachments()
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
    if (
      checkPermission(
        arrayPermission,
        KEY_MODULE.Contact,
        PERMISSION_RULE.ViewListActivityLog
      )
    ) {
      getListActivityLogs(Number(router.query.id), {
        limit: router?.query?.limit,
        page: router?.query?.page,
        log_type__name: 'ACTIVITY LOG',
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
    clearErrorsCreate('content')
  }, [router.query.id, router.query.page, router.query.limit])

  const handleCheckMenuAction = () => {
    if (
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Contact,
        PERMISSION_RULE.UpdateActivityLog
      ) &&
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Contact,
        PERMISSION_RULE.DeleteActivityLog
      )
    ) {
      return false
    }
    return true
  }

  return (
    <>
      {WithPermission(
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
                        placeholder={t('details.enterActivity')}
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
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="flex-end"
                    style={{ marginTop: 0 }}
                  >
                    <FormControl fullWidth>
                      <UploadFileList
                        maxFiles={5}
                        files={watch('files') as string[]}
                        onFileSelectSuccess={(file: string[]) => {
                          setValue('files', file)
                          trigger('files')
                        }}
                        onFileSelectError={() => {
                          return
                        }}
                        onFileSelectDelete={(file) => {
                          setValue('files', file)
                          trigger('files')
                        }}
                        sizeButton="small"
                      />
                    </FormControl>
                    <ButtonCustom
                      variant="contained"
                      type="submit"
                      size="small"
                    >
                      {t('details.send')}
                    </ButtonCustom>
                  </Stack>
                )}
              </Stack>
            </form>
          </Stack>
        </BoxCustom>,
        KEY_MODULE.Contact,
        PERMISSION_RULE.CreateActivityLog
      )}

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
                    {t('details.thereAreNoActivityLogAtThisTime')}
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
                          {t('details.loggedAnActivity')}
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
                                  placeholder={t('details.enterActivity')}
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
                        <Grid container alignItems="flex-end" spacing={2}>
                          <Grid xs style={{ width: '100%' }}>
                            <FormControl fullWidth>
                              <UploadFileList
                                maxFiles={5}
                                files={watchUpdate('files') as string[]}
                                onFileSelectSuccess={(file: string[]) => {
                                  setValueUpdate('files', file)
                                  triggerUpdate('files')
                                }}
                                onFileSelectError={() => {
                                  return
                                }}
                                onFileSelectDelete={(file) => {
                                  setValueUpdate('files', file)
                                  triggerUpdate('files')
                                }}
                                sizeButton="small"
                              />
                            </FormControl>
                          </Grid>
                          <Grid xs="auto">
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="flex-start"
                              spacing={2}
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
                        <Stack spacing={2} direction="row" alignItems="center">
                          {item?.files.map((value, index: number) => (
                            <Stack
                              direction="row"
                              alignItems="center"
                              key={index}
                            >
                              <PaperclipHorizontal
                                size={20}
                                color="#2F6FED"
                                style={{ transform: 'rotate(90deg)' }}
                              />
                              <Link href={value} target="_blank">
                                <a
                                  style={{
                                    width: '100%',
                                    maxWidth: '135px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    direction: 'rtl',
                                    color: '#2F6FED',
                                  }}
                                >
                                  {value}
                                </a>
                              </Link>
                            </Stack>
                          ))}
                        </Stack>
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
              <Typography> {t('details.rowsPerPage')}</Typography>
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
        {handleCheckMenuAction() && (
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
            {WithPermission(
              <MenuItem
                onClick={() => {
                  handleCloseMenu()
                  handleGetDetailActivityLog()
                }}
              >
                {t('edit')}
              </MenuItem>,
              KEY_MODULE.Contact,
              PERMISSION_RULE.UpdateActivityLog
            )}
            {WithPermission(
              <MenuItem
                onClick={handleDialogDelete}
                sx={{ justifyContent: 'end' }}
              >
                {t('details.delete')}
              </MenuItem>,
              KEY_MODULE.Contact,
              PERMISSION_RULE.DeleteActivityLog
            )}
          </MenuAction>
        )}
      </Box>

      <Dialog open={stateOpenDialog} onClose={handleDialogDelete}>
        <DialogTitleTws>
          <IconButton onClick={handleDialogDelete}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('details.deleteActivityLog')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {' '}
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
