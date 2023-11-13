import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  // useImperativeHandle,
  useState,
} from 'react'

import Grid from '@mui/material/Unstable_Grid2'
import { useTheme } from '@mui/material/styles'
import { yupResolver } from '@hookform/resolvers/yup'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Chip,
  Dialog,
  Drawer,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Modal,
  Pagination,
  SelectChangeEvent,
  Stack,
  styled,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material'
import Link from 'next/link'
import {
  ArrowRight,
  DownloadSimple,
  Export,
  Gear,
  MagnifyingGlass,
  UploadSimple,
  X,
  XCircle,
} from '@phosphor-icons/react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  // DialogTitleTws,
  MenuAction,
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
import {
  deleteContact,
  getContactList,
  getSellerList,
  postAssignSeller,
  uploadFileImportApi,
} from './contactApi'
import {
  Contact,
  ContactResponseType,
  ImportFileContactType,
  ListSellerDataResponseType,
  ListSellerDataType,
  ResearchContactType,
} from './contactModel'
import { schema, schemaAssignSeller, schemaImportContact } from './validations'

import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  checkPermission,
  formatPhoneNumber,
  handlerGetErrMessage,
  isEmptyObject,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
  platform,
} from 'src/utils/global.utils'
// style
import InfiniteScrollSelectMultiple from './parts/InfiniteScrollSelectMultiple'
import classes from './styles.module.scss'
import WithPermission from 'src/utils/permission.utils'
import { useTranslation } from 'next-i18next'

const BoxModalCustom = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '490px',
  background: 'white',
  borderStyle: 'none',
  padding: '50px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '10px',
}))
const ButtonUploadFileCustom = styled(Button)({
  whiteSpace: 'nowrap',
  position: 'absolute',
  padding: '6.5px 15px',
  zIndex: '1',
  borderRadius: '7px 0 0 7px',
  background: '#F1F3F9',
  top: '1px',
  left: '2px',
  textTransform: 'none',
  fontWeight: '400',
  boxShadow: 'none',
})
const ChipCustom = styled(Chip)({
  position: 'absolute',
  right: '7px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: '1',
  maxWidth: 'calc(100% - 160px)',
  height: '26px',
  background: '#F1F3F9',
  borderRadius: '7px',
})
const DeleteIcon = styled('div')({
  width: '20px',
  display: 'flex',
  alignItems: 'center',
})

const ContactList: React.FC = () => {
  const { t } = useTranslation('contact')
  const permission = useAppSelector((state) => state.permission.data)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const [stateContact, setStateContact] = useState<Contact>()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateContactList, setStateContactList] =
    useState<ContactResponseType>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [anchorElSeller, setAnchorElSeller] = useState<null | HTMLElement>(null)
  const [stateFile, setStateFile] = React.useState<{ name: string }>()
  const [stateLinkError, setStateLinkError] = useState<string | null>()
  const [openDialog, setOpenDialog] = useState(false)
  const [stateIdAssignee, setStateIdAssignee] = useState([])
  // const [openSeller, setOpenSeller] = useState<boolean>(false)
  const [stateListSeller, setStateListSeller] =
    useState<ListSellerDataResponseType>({ data: [] })

  //Menu Delete and edit
  const router = useRouter()
  const open = Boolean(anchorEl)
  const textFieldRef = React.useRef<HTMLInputElement>(null)

  const [openModalImport, setOpenModalImport] = React.useState(false)
  const [openDrawerAssignSeller, setOpenDrawerAssignSeller] =
    React.useState(false)
  const openSellerInformation = Boolean(anchorElSeller)
  // const [stateSellerAssignee, setStateSellerAssignee] = useState<any>()

  const handlePopoverClose = () => {
    setAnchorElSeller(null)
  }
  const handleOpenModalImport = () => setOpenModalImport(true)
  const handleCloseModalImport = () => {
    setOpenModalImport(false)
    setStateLinkError(null)
    setStateFile(undefined)
    resetImportFile()
  }
  const handleOpenDrawerAssignSeller = () => {
    getSellerList()
      .then((response) => {
        const { data } = response
        setStateListSeller(data)
        setValue('sellers', stateIdAssignee)
        setOpenDrawerAssignSeller(true)
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })

    handleCloseMenu()
  }

  const handleCloseDrawerAssignSeller = () => {
    setOpenDrawerAssignSeller(false)
    resetAssignSeller()
    setAnchorEl(null)
  }

  const hasWhiteSpace = (s: string) => {
    return /^\s+$/g.test(s)
  }
  const hasSpecialCharacter = (input: string) => {
    // eslint-disable-next-line no-useless-escape
    return /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\/\\?\,]+$/g.test(
      input
    )
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleGetContactList = (query: object) => {
    dispatch(loadingActions.doLoading())
    getContactList(query)
      .then((res) => {
        const { data } = res
        setStateContactList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        console.log('response', response)
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetSellers = (value: string | null) => {
    getSellerList(1, { search: value ? value : null })
      .then((res) => {
        const { data } = res
        setStateListSeller(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const fetchMoreDataSellers = useCallback(
    (value: { page: number; name: string }) => {
      getSellerList(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          console.log('🚀 ~  data:', data)
          setStateListSeller((prev: any) => {
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
    [setStateListSeller, pushMessage]
  )

  // const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorElSeller(event.currentTarget)
  // }

  useEffect(() => {
    if (router.asPath.length !== router.pathname.length) {
      if (!isEmptyObject(router.query)) {
        handleGetContactList(router.query)
      }
    } else {
      handleGetContactList({})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResearchContactType>({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitImportFile,
    register: registerImportFile,
    control: controlImportFile,
    reset: resetImportFile,
    formState: { errors: errorsImportFile },
    clearErrors,
  } = useForm<ImportFileContactType>({
    resolver: yupResolver(schemaImportContact(t)),
    mode: 'all',
  })
  const {
    handleSubmit: handleSubmitAssignSeller,
    control: controlAssignSeller,
    reset: resetAssignSeller,
    formState: { errors: errorsAssignSeller },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schemaAssignSeller(t)),
    mode: 'all',
  })

  const onSubmit = (data: any) => {
    if (hasWhiteSpace(data.search) || hasSpecialCharacter(data.search)) {
      pushMessage('Error', 'error')
    } else {
      router.replace(
        {
          search: `${objToStringParam({
            ...router.query,
            key: data.search,
            page: 1,
          })}`,
        },
        undefined,
        { scroll: false }
      )
    }
  }
  const onSubmitImportFile = (data: ImportFileContactType) => {
    const formData = new FormData()
    formData.append('importData', data.importData[0])
    uploadFileImportApi(formData)
      .then(() => {
        pushMessage(t('message.importSuccessfully'), 'success')
        handleCloseModalImport()
        handleGetContactList({})
      })
      .catch(({ response }) => {
        const { data, status } = response
        if (typeof data.data === 'string') {
          setStateLinkError(data.data)
          return
        }
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const onSubmitAssignSeller = () => {
    const assignSellerArr: Array<number> = []
    getValues('sellers').forEach((item: string) => {
      console.log(item)
      assignSellerArr.push(Number(item.slice(0, item.indexOf('-'))))
    })
    const assignSeller = { sellers: assignSellerArr }
    postAssignSeller(Number(stateContact?.id), assignSeller)
      .then(() => {
        pushMessage(t('message.theLeadHasBeenAssignedSuccessfully'), 'success')
        setAnchorEl(null)
        dispatch(loadingActions.doLoadingSuccess())
        handleCloseDrawerAssignSeller()
        handleGetContactList(router.query)
      })
      .catch(({ response }) => {
        const { data, status } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  //pagination
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

  // trigger when change row per page option ( page size )
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

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const fileInput = event.target.files[0]
      setStateLinkError(null)
      setStateFile(fileInput)
      clearErrors('importData')
    }
  }
  const handleDeleteFile = () => {
    setStateFile(undefined)
    setStateLinkError(null)
    resetImportFile()
  }
  //downLoadFile
  const downloadEmployeeData = () => {
    fetch(
      'https://twss-sgp-public-storage.s3.ap-southeast-1.amazonaws.com/media/import-contacts.xlsx',
      {
        method: 'GET',
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `import-contacts.xlsx`)

        // Append to html link element page
        document.body.appendChild(link)

        // Start download
        link.click()
        // Clean up and remove the link
        link?.parentNode?.removeChild(link)
      })
  }

  //dialog Delete
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDialogDelete = () => {
    setOpenDialog(!openDialog)
    handleClose()
  }

  // Delete Contact
  const handleDeleteContact = () => {
    deleteContact(Number(stateContact?.id))
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        handleDialogDelete()

        pushMessage(
          t(
            'message.theLeadStateContactBusinessNameHasBeenDeletedSuccessfully',
            { 0: String(stateContact?.business_name) }
          ),
          'success'
        )
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
        handleGetContactList({})
        setStateContact(undefined)
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        handleDialogDelete()
        setStateContact(undefined)
      })
  }

  const isMdScr = useMediaQuery(theme.breakpoints.down('md'))
  const isSmScr = useMediaQuery(theme.breakpoints.down('sm'))

  const screen = isSmScr ? 'small' : isMdScr ? 'medium' : 'large'
  const handleCheckGear = () => {
    if (
      !checkPermission(
        permission,
        KEY_MODULE.Contact,
        PERMISSION_RULE.ViewDetails
      ) &&
      !checkPermission(
        permission,
        KEY_MODULE.Contact,
        PERMISSION_RULE.Update
      ) &&
      !checkPermission(
        permission,
        KEY_MODULE.Contact,
        PERMISSION_RULE.ViewDetails
      ) &&
      !checkPermission(permission, KEY_MODULE.Contact, PERMISSION_RULE.Assign)
    ) {
      return false
    }
    return true
  }
  return (
    <>
      <Grid container columnSpacing={'28px'}>
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
                    placeholder={t('searchLeadByName')}
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
            <FormHelperText error>
              {errors.search && `${errors.search.message}`}
            </FormHelperText>
          </form>
        </Grid>

        {WithPermission(
          <>
            <Grid xs style={{ maxWidth: '78px' }}>
              <Tooltip title="Upload file">
                <ButtonCustom
                  onClick={handleOpenModalImport}
                  variant="outlined"
                  size={screen}
                  style={{ padding: '14px 0' }}
                  sx={{
                    border: '1px solid #E1E6EF',
                    color: '#49516F',
                    minWidth: '50px',
                  }}
                >
                  <Export size={20} />
                </ButtonCustom>
              </Tooltip>
            </Grid>
            <Grid xs style={{ maxWidth: '78px' }}>
              <Tooltip title="Download file">
                <ButtonCustom
                  variant="outlined"
                  size={screen}
                  style={{ padding: '14px 0' }}
                  sx={{
                    border: '1px solid #E1E6EF',
                    color: '#49516F',
                    minWidth: '50px',
                  }}
                  onClick={() => {
                    downloadEmployeeData()
                  }}
                >
                  <DownloadSimple size={20} />
                </ButtonCustom>
              </Tooltip>
            </Grid>
          </>,
          KEY_MODULE.Contact,
          PERMISSION_RULE.Import
        )}
        {WithPermission(
          <Grid xs style={{ maxWidth: '288px' }}>
            <Link href={`/${platform().toLowerCase()}/crm/contact/create`}>
              <a>
                <ButtonCustom
                  variant="contained"
                  fullWidth
                  sx={{
                    '&.MuiButton-sizeMedium': {
                      fontSize: '1.05rem',
                    },
                  }}
                  size={screen}
                >
                  {t('addNewLead')}
                </ButtonCustom>
              </a>
            </Link>
          </Grid>,
          KEY_MODULE.Contact,
          PERMISSION_RULE.Create
        )}
      </Grid>
      {stateContactList?.data.length === 0 ? (
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
                  {t('thereAreNoLeadToShow')}
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
                  <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                    {t('list.no.')}
                  </TableCellTws>
                  <TableCellTws> {t('list.businessName')}</TableCellTws>
                  <TableCellTws>{t('list.firstName')}</TableCellTws>
                  <TableCellTws>{t('list.lastNam')}</TableCellTws>
                  <TableCellTws>{t('list.phoneNumber')}</TableCellTws>
                  <TableCellTws>{t('list.federalTaxNo')}</TableCellTws>
                  <TableCellTws>{t('list.address')}</TableCellTws>
                  <TableCellTws width={300}>{t('list.assignee')}</TableCellTws>
                  {handleCheckGear() && (
                    <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                      {t('list.action')}
                    </TableCellTws>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {stateContactList?.data.map((item: any, index) => (
                  <TableRowTws
                    key={`item-${index}`}
                    hover={checkPermission(
                      permission,
                      KEY_MODULE.Contact,
                      PERMISSION_RULE.ViewDetails
                    )}
                    onClick={() => {
                      if (
                        checkPermission(
                          permission,
                          KEY_MODULE.Contact,
                          PERMISSION_RULE.ViewDetails
                        )
                      ) {
                        router.push(
                          `/${platform().toLowerCase()}/crm/contact/detail/${
                            item?.id
                          }/`
                        )
                      }
                    }}
                    sx={{
                      cursor: checkPermission(
                        permission,
                        KEY_MODULE.Contact,
                        PERMISSION_RULE.ViewDetails
                      )
                        ? 'pointer'
                        : '',
                    }}
                  >
                    <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                      {(router.query.limit ? Number(router.query.limit) : 10) *
                        (router.query.page ? Number(router.query.page) : 1) -
                        (router.query.limit ? Number(router.query.limit) : 10) +
                        index +
                        1}
                    </TableCellTws>
                    <TableCellTws>{item.business_name}</TableCellTws>
                    <TableCellTws>{item.first_name}</TableCellTws>
                    <TableCellTws>{item.last_name}</TableCellTws>
                    <TableCellTws>
                      {formatPhoneNumber(item.phone_number)}
                    </TableCellTws>
                    <TableCellTws>{item.federal_tax_id}</TableCellTws>
                    <TableCellTws>{item.address}</TableCellTws>
                    <TableCellTws width={300}>
                      <div
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                        aria-owns={
                          openSellerInformation
                            ? 'mouse-over-popover'
                            : undefined
                        }
                        // onMouseEnter={(
                        //   event: React.MouseEvent<HTMLElement>
                        // ) => {
                        //   const valueAssignee = item.assignee.map(
                        //     (items: any) => items
                        //   )
                        //   setStateSellerAssignee(valueAssignee)
                        //   handlePopoverOpen(event)
                        // }}
                        onMouseLeave={handlePopoverClose}
                      >
                        {item.assignee.length > 0 ? (
                          <>
                            {item.assignee
                              ?.map((items: any) => ' ' + items.full_name)
                              .toString()}
                          </>
                        ) : (
                          'N/A'
                        )}
                      </div>
                    </TableCellTws>
                    {handleCheckGear() && (
                      <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                        <IconButton
                          onClick={(e) => {
                            setStateContact(item)
                            handleOpenMenu(e)
                            const idAssignee = item.assignee.map(
                              (items: ListSellerDataType) => {
                                return `${items.id}-${items.full_name}`
                              }
                            )
                            e.stopPropagation()
                            setStateIdAssignee(idAssignee)
                          }}
                        >
                          <Gear size={28} />
                        </IconButton>
                      </TableCellTws>
                    )}
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
            <Typography>{t('list.rowsPerPage')}</Typography>
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
              onChange={(event: ChangeEvent<unknown>, page: number) =>
                handleChangePagination(event, page)
              }
              count={stateContactList ? stateContactList.totalPages : 0}
            />
          </Stack>
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
            {checkPermission(
              permission,
              KEY_MODULE.Contact,
              PERMISSION_RULE.ViewDetails
            ) && (
              <MenuItem sx={{ justifyContent: 'end' }}>
                <Link
                  href={`/${platform().toLowerCase()}/crm/contact/detail/${
                    stateContact?.id
                  }`}
                >
                  <a>{t('viewDetail')}</a>
                </Link>
              </MenuItem>
            )}

            {checkPermission(
              permission,
              KEY_MODULE.Contact,
              PERMISSION_RULE.Update
            ) && (
              <MenuItem>
                <Link
                  href={`/${platform().toLowerCase()}/crm/contact/update/${
                    stateContact?.id
                  }`}
                >
                  <a className="menu-item-action">{t('edit')}</a>
                </Link>
              </MenuItem>
            )}
            {checkPermission(
              permission,
              KEY_MODULE.Contact,
              PERMISSION_RULE.Delete
            ) && (
              <MenuItem
                onClick={handleDialogDelete}
                sx={{ justifyContent: 'end' }}
              >
                {t('delete')}
              </MenuItem>
            )}
            {checkPermission(
              permission,
              KEY_MODULE.Contact,
              PERMISSION_RULE.Assign
            ) && (
              <MenuItem onClick={handleOpenDrawerAssignSeller}>
                {t('assignSeller')}
              </MenuItem>
            )}
          </MenuAction>
        </>
      )}
      <Modal open={openModalImport} onClose={handleCloseModalImport}>
        <BoxModalCustom>
          <Box
            sx={{
              position: 'absolute',
              top: '0',
              right: '0',
              padding: '10px',
            }}
          >
            <IconButton onClick={handleCloseModalImport}>
              <X size={24} />
            </IconButton>
          </Box>
          <TypographyH2
            sx={{ fontSize: '2.4rem', marginBottom: '24px' }}
            alignSelf="center"
          >
            {t('importContact')}
          </TypographyH2>

          <form onSubmit={handleSubmitImportFile(onSubmitImportFile)}>
            <Stack spacing={2}>
              <Controller
                control={controlImportFile}
                name="importData"
                render={() => (
                  <Box>
                    <InputLabelCustom
                      htmlFor="importData"
                      error={!!errorsImportFile.importData}
                    >
                      {t('selectImportFile')}
                    </InputLabelCustom>

                    <ButtonGroup sx={{ position: 'relative' }}>
                      <ButtonUploadFileCustom
                        variant="contained"
                        startIcon={<UploadSimple size={20} />}
                        onClick={() => {
                          textFieldRef.current && textFieldRef.current.click()
                          textFieldRef.current && textFieldRef.current.focus()
                        }}
                      >
                        {t('uploadFile')}
                      </ButtonUploadFileCustom>
                      <div className={classes['uploadTextFieldWrapper']}>
                        <TextFieldCustom
                          type="file"
                          inputProps={{ accept: '.csv,.xlsx' }}
                          {...registerImportFile('importData', {
                            required: true,
                          })}
                          error={!!errorsImportFile.importData}
                          onChange={handleFileInput}
                          inputRef={textFieldRef}
                        />
                      </div>

                      {stateFile && (
                        <ChipCustom
                          label={stateFile.name}
                          onDelete={handleDeleteFile}
                          deleteIcon={
                            <DeleteIcon>
                              <XCircle size={20} />
                            </DeleteIcon>
                          }
                        />
                      )}
                    </ButtonGroup>
                    <FormHelperText error={!!errorsImportFile.importData}>
                      {errorsImportFile.importData &&
                        `${errorsImportFile.importData.message}`}
                    </FormHelperText>
                  </Box>
                )}
              />
              {stateLinkError && (
                <FormHelperText error={true}>
                  {t(
                    'thereAreSomeErrorsWithTheImportFilePleaseDownloadTheErrorFileForMoreInformation'
                  )}
                  <Link href={stateLinkError}>
                    <a className={classes['errorText']}>{t('clickHere')}</a>
                  </Link>
                </FormHelperText>
              )}
              <Box>
                <Typography sx={{ fontStyle: 'italic' }}>
                  <span
                    className={classes['downText']}
                    onClick={() => {
                      downloadEmployeeData()
                    }}
                  >
                    {t('clickHere')}
                  </span>{' '}
                  {t('toDownTheImportTemplate')}
                </Typography>
                <Typography sx={{ fontStyle: 'italic' }}>
                  {t('allowedFileExtensionXlsxCsv')}
                </Typography>
                <Typography sx={{ fontStyle: 'italic' }}>
                  {t('allowedFileSizeIs_10Mb')}
                </Typography>
              </Box>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <ButtonCancel
                  onClick={handleCloseModalImport}
                  variant="outlined"
                  size="large"
                >
                  {t('cancel')}
                </ButtonCancel>
                <ButtonCustom variant="contained" size="large" type="submit">
                  {t('submit')}
                </ButtonCustom>
              </Stack>
            </Stack>
          </form>
        </BoxModalCustom>
      </Modal>

      <Drawer
        anchor={'right'}
        open={openDrawerAssignSeller}
        onClose={handleCloseDrawerAssignSeller}
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
            <IconButton onClick={handleCloseDrawerAssignSeller}>
              <ArrowRight size={24} />
            </IconButton>
            <Typography
              sx={{
                fontSize: '2.4rem',
                fontWeight: 700,
                color: '#49516F',
              }}
            >
              {t('assignSeller')}
            </Typography>
          </Stack>
          <form onSubmit={handleSubmitAssignSeller(onSubmitAssignSeller)}>
            <Stack spacing={3}>
              <Grid xs={6}>
                <Controller
                  control={controlAssignSeller}
                  name="sellers"
                  defaultValue={[]}
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="sellers"
                        error={!!errorsAssignSeller.sellers}
                      >
                        {t('selectSeller')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="sellers"
                          displayEmpty
                          multiple
                          placeholder={t('selectSeller')}
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          {...field}
                          renderValue={(value: any) => {
                            if (!value) {
                              return (
                                <PlaceholderSelect>
                                  <div>{t('selectSeller')}</div>
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
                                {value.map(function (
                                  item: string,
                                  idx: number
                                ) {
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
                                        const temporarySellerArr = getValues(
                                          'sellers'
                                        ).filter((x: string) => {
                                          return x != item
                                        })

                                        setValue('sellers', temporarySellerArr)
                                      }}
                                      avatar={
                                        <Avatar
                                          src={
                                            stateListSeller?.data.find(
                                              (index: ListSellerDataType) =>
                                                index.id ===
                                                Number(
                                                  item.slice(
                                                    0,
                                                    item.indexOf('-')
                                                  )
                                                )
                                            )?.avatar
                                          }
                                        />
                                      }
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
                                        </Typography>
                                      }
                                    />
                                  )
                                })}
                              </Box>
                            )
                          }}
                        >
                          <InfiniteScrollSelectMultiple
                            propData={stateListSeller}
                            handleSearch={(value) => {
                              setStateListSeller({ data: [] })
                              handleGetSellers(value)
                            }}
                            fetchMore={(value) => {
                              fetchMoreDataSellers(value)
                            }}
                            onClickSelectItem={(item: any) => {
                              setValue('sellers', item)
                            }}
                            propsGetValue={getValues('sellers')}
                            propName={'full_name'}
                          />
                        </SelectCustom>
                        <FormHelperText error={!!errorsAssignSeller.sellers}>
                          {errorsAssignSeller.sellers &&
                            `${errorsAssignSeller.sellers.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <ButtonCancel
                  onClick={handleCloseDrawerAssignSeller}
                  variant="outlined"
                  size="large"
                >
                  {t('cancel')}
                </ButtonCancel>
                <ButtonCustom variant="contained" size="large" type="submit">
                  {t('submit')}
                </ButtonCustom>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Drawer>

      <Dialog open={openDialog} onClose={handleDialogDelete}>
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
            {t('message.areYouSureToDeleteLeadStateContactBusinessName', {
              0: String(stateContact?.business_name),
            })}
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
      </Dialog>

      {/* <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={openSellerInformation}
        anchorEl={anchorElSeller}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Stack p="15px" spacing="15px" direction="column" borderRadius="10px">
          {stateSellerAssignee?.map(
            (item: ListSellerDataType, index: number) => {
              return (
                <MenuItemSelectCustom
                  value={item.id}
                  key={index + Math.random()}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar alt={item.full_name} src={item.avatar} />
                    <Typography>{item.full_name}</Typography>
                  </Stack>
                </MenuItemSelectCustom>
              )
            }
          )}
        </Stack>
      </Popover> */}
    </>
  )
}

export default ContactList
