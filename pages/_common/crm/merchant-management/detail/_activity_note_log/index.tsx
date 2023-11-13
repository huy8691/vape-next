// react
import React, { useCallback, useEffect, useState } from 'react'
import {
  Typography,
  Grid,
  Avatar,
  IconButton,
  FormControl,
  FormHelperText,
  Dialog,
  Pagination,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { Stack } from '@mui/material'
import {
  CreateActivityLogsType,
  ListActivityDataResponseType,
  UpdateActivityLogsType,
} from './activityModel'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  createActivityLogAPI,
  deleteActivityLogAPI,
  getActivityLogAPI,
  updateActivityLogAPI,
} from './activityAPI'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  checkPermission,
  handlerGetErrMessage,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import Image from 'next/image'
import {
  DotsThreeVertical,
  PaperclipHorizontal,
  X,
} from '@phosphor-icons/react'
import Link from 'next/link'
import moment from 'moment'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  MenuAction,
  MenuItemSelectCustom,
  ReadMore,
  SelectPaginationCustom,
  TextFieldCustom,
  TypographyH2,
} from 'src/components'
import Box from '@mui/material/Box'
import { ActivityDataType } from './activityModel'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import UploadFileList from 'src/components/uploadFileList'
import MenuItem from '@mui/material/MenuItem'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

interface Props {
  handleGetAttachments: () => void
  queryParam: any
}

const ActivityLog: React.FC<Props> = (props) => {
  const { t } = useTranslation('merchant-management')
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const theme = useTheme()

  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  const userInfo = useAppSelector((state) => state.userInfo)
  const router = useRouter()

  //Activity
  const [stateListActivity, setStateListActivity] =
    useState<ListActivityDataResponseType>()
  const [stateActivityLog, setStateActivityLog] = useState<ActivityDataType>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  // const [stateItemActivityUpdate, setStateItemActivityUpdate] =
  //   useState<ActivityDataType>()

  const [stateUpdateItem, setStateUpdateItem] = useState<boolean>(false)

  //Dialog
  const [stateOpenDialog, setStateOpenDialog] = useState(false)
  const [stateOpenInput, setStateOpenInput] = useState<boolean>(false) //Input create

  //activity something
  const open = Boolean(anchorEl)
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleDialogDelete = () => {
    setStateOpenDialog(!stateOpenDialog)
    handleCloseMenu()
  }

  const getListActivityOrNote = useCallback(() => {
    setStateListActivity(undefined)
    props.queryParam.log_type = props.queryParam.log_type
      ? props.queryParam.log_type
      : 'ACTIVITY LOG'
    getActivityLogAPI(Number(props.queryParam.id), {
      ...props.queryParam,
      id: null,
    })
      .then((res) => {
        const { data } = res
        setStateListActivity(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        if (status == 404) {
          router.push('/404')
        }
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [props.queryParam])

  const onSubmitCreate = (values: CreateActivityLogsType) => {
    dispatch(loadingActions.doLoading())
    createActivityLogAPI(Number(props.queryParam.id), {
      content: values?.content,
      files: values?.files,
      log_type: props.queryParam.log_type,
    })
      .then(() => {
        const message =
          props.queryParam.log_type == 'NOTE'
            ? t('message.theNoteLogHasBeenCreatedSuccessfully')
            : t('message.theActivityLogHasBeenCreatedSuccessfully')
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(message, 'success')
        getListActivityOrNote()
        reset()
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })

    props.handleGetAttachments()
  }

  const onSubmitUpdate = (values: UpdateActivityLogsType) => {
    // console.log('haha', values)
    dispatch(loadingActions.doLoading())
    if (stateActivityLog) {
      updateActivityLogAPI(stateActivityLog.id, {
        content: values.content,
        files:
          props.queryParam.log_type == 'NOTE'
            ? null
            : Array.isArray(values?.files) && values?.files?.length > 0
            ? values.files
            : null,
      })
        .then(() => {
          const message =
            props.queryParam.log_type == 'NOTE'
              ? t('message.theNoteLogHasBeenUpdatedSuccessfully')
              : props.queryParam.log_type == 'ACTIVITY LOG' &&
                t('message.theActivityLogHasBeenUpdatedSuccessfully')
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(message, 'success')
          getListActivityOrNote()
          resetUpdate()
          setStateActivityLog(undefined)
          setStateUpdateItem(false)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      props.handleGetAttachments()
    }
  }

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    trigger,
    watch,
    reset,
  } = useForm<CreateActivityLogsType>({
    resolver: yupResolver(schema(t)),
    defaultValues: {
      files: [],
    },
    mode: 'all',
    reValidateMode: 'onChange',
  })

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

  const handleUpdateActivityLog = () => {
    if (stateActivityLog) {
      setValueUpdate('content', stateActivityLog?.content)
      setValueUpdate('files', stateActivityLog?.files)
      setStateUpdateItem(true)
    }
  }

  const handleDeleteActivityLog = () => {
    dispatch(loadingActions.doLoading())
    if (stateActivityLog) {
      deleteActivityLogAPI(stateActivityLog.id)
        .then(() => {
          const message =
            props.queryParam.log_type == 'NOTE'
              ? t('message.theNoteLogHasBeenDeletedSuccessfully')
              : props.queryParam.log_type == 'ACTIVITY LOG' &&
                t('message.theActivityLogHasBeenDeletedSuccessfully')
          dispatch(loadingActions.doLoadingSuccess())
          handleDialogDelete()
          pushMessage(message, 'success')
          getListActivityOrNote()
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })

      props.handleGetAttachments()
    }
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
    if (props.queryParam.id) {
      getListActivityOrNote()
    }
  }, [props.queryParam, getListActivityOrNote])

  const handleCheckDots = () => {
    if (
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Merchant,
        PERMISSION_RULE.UpdateActivityLog
      ) &&
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Merchant,
        PERMISSION_RULE.DeleteActivityLog
      )
    ) {
      return false
    }
    return true
  }
  return (
    <>
      <Box>
        {checkPermission(
          arrayPermission,
          KEY_MODULE.Merchant,
          PERMISSION_RULE.CreateActivityLog
        ) && (
          <Stack
            spacing={2}
            direction="row"
            p={2}
            sx={{
              backgroundColor: '#F8F9FC',
              padding: '15px',
              marginBottom: '25px',
              borderRadius: '10px',
            }}
          >
            <Avatar
              alt={userInfo.data.first_name}
              src={userInfo.data.avatar}
              sx={{ width: 36, height: 36 }}
            />
            <form
              onSubmit={handleSubmit(onSubmitCreate)}
              style={{ width: '100%' }}
            >
              <Stack spacing={2} direction="column">
                <Controller
                  control={control}
                  name="content"
                  defaultValue=""
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <TextFieldCustom
                        sx={{ backgroundColor: '#FFFFFF' }}
                        id="content"
                        onClick={() => setStateOpenInput(true)}
                        multiline={stateOpenInput}
                        rows={stateOpenInput ? 4 : 1}
                        placeholder={
                          router.query.log_type == 'ACTIVITY LOG' ||
                          !router.query.log_type
                            ? t('details.enterActivity')
                            : t('details.enterNote')
                        }
                        error={!!errors.content}
                        autoFocus={stateOpenInput}
                        {...field}
                      />
                      <FormHelperText error={!!errors.content}>
                        {errors.content && `${errors.content.message}`}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
                {stateOpenInput && (
                  <Grid
                    container
                    alignItems="flex-end"
                    spacing={2}
                    sx={{ paddingRight: '15px' }}
                  >
                    <Grid item xs style={{ width: '100%' }}>
                      {router.query.log_type == 'ACTIVITY LOG' && (
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
                          />
                        </FormControl>
                      )}
                    </Grid>
                    <Grid item xs="auto">
                      <ButtonCustom
                        variant="contained"
                        type="submit"
                        size="large"
                        sx={{ marginLeft: 'auto' }}
                      >
                        {t('details.send')}
                      </ButtonCustom>
                    </Grid>
                  </Grid>
                )}
              </Stack>
            </form>
          </Stack>
        )}

        {stateListActivity?.data.length == 0 ? (
          <>
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
                {!router.query.log_type ||
                router.query.log_type == 'ACTIVITY LOG'
                  ? t('details.thereAreNoActivityLogToShow')
                  : t('details.thereAreNoNoteLogToShow')}
              </Typography>
            </Stack>
          </>
        ) : (
          <>
            <Box>
              {stateListActivity?.data.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    border: '1px solid #E1E6EF',
                    borderRadius: '10px',
                    padding: '15px',
                    marginBottom: '25px',
                  }}
                >
                  <Stack spacing="5px" sx={{ color: '#49516F' }}>
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
                        <Typography sx={{ color: theme.palette.primary.main }}>
                          {item?.log_type == 'ACTIVITY LOG'
                            ? t('details.loggedAnActivity')
                            : t('details.loggedAnNote')}
                        </Typography>
                      </Stack>
                      <Stack spacing="5px" direction="row" alignItems="center">
                        <Typography sx={{ fontStyle: 'italic' }}>
                          {moment(item.time).format('MM/DD/YYYY - HH:mm A')}
                        </Typography>
                        {item?.is_edited && (
                          <Tooltip
                            title={moment(item.updated_time).format(
                              'MM/DD/YYYY - HH:mm A'
                            )}
                            placement="top-start"
                          >
                            <Typography
                              sx={{
                                fontStyle: 'italic',
                                '&:hover': { cursor: 'pointer' },
                              }}
                            >
                              <FiberManualRecordIcon
                                sx={{ fontSize: '8px', marginRight: '5px' }}
                              />
                              {t('details.edited')}
                            </Typography>
                          </Tooltip>
                        )}

                        {handleCheckDots() && (
                          <IconButton
                            onClick={(event) => {
                              setStateActivityLog(item)
                              handleOpenMenu(event)
                            }}
                            sx={{ padding: '0' }}
                          >
                            <DotsThreeVertical size={36} />
                          </IconButton>
                        )}
                      </Stack>
                    </Stack>
                    {stateUpdateItem == true &&
                    stateActivityLog?.id === item.id ? (
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
                        <Grid container alignItems="flex-end" spacing={2}>
                          <Grid item xs style={{ width: '100%' }}>
                            {router.query.log_type == 'ACTIVITY LOG' && (
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
                                />
                              </FormControl>
                            )}
                          </Grid>
                          <Grid item xs="auto">
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
                                size="large"
                                onClick={() => {
                                  setStateActivityLog(undefined)
                                  setStateUpdateItem(false)
                                }}
                              >
                                {t('details.cancel')}
                              </ButtonCancel>
                              <ButtonCustom
                                variant="contained"
                                type="submit"
                                size="large"
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
                </Box>
              ))}
            </Box>
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
                count={stateListActivity ? stateListActivity.totalPages : 0}
              />
            </Stack>
          </>
        )}
      </Box>

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
        {' '}
        {checkPermission(
          arrayPermission,
          KEY_MODULE.Merchant,
          PERMISSION_RULE.UpdateActivityLog
        ) && (
          <>
            {stateActivityLog?.is_creator && (
              <MenuItem
                onClick={() => {
                  handleCloseMenu()
                  handleUpdateActivityLog()
                }}
              >
                {t('details.edited')}
              </MenuItem>
            )}
          </>
        )}
        {checkPermission(
          arrayPermission,
          KEY_MODULE.Merchant,
          PERMISSION_RULE.DeleteActivityLog
        ) && (
          <MenuItem onClick={handleDialogDelete} sx={{ justifyContent: 'end' }}>
            {t('details.delete')}
          </MenuItem>
        )}
      </MenuAction>
      <Dialog open={stateOpenDialog} onClose={handleDialogDelete}>
        <DialogTitleTws>
          <IconButton onClick={handleDialogDelete}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('details.deleteActivity')}
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

export default ActivityLog
