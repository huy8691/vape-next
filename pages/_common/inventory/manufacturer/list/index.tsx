import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'

// react-hook-form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { loadingActions } from 'src/store/loading/loadingSlice'
import * as yup from 'yup'

//Api
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import {
  addSampleManu,
  deleteManufacturer,
  getListManufacturers,
  getSampleManu,
  uploadFileImportApi,
} from './manufacturerAPI'

//model
import {
  FormSearch,
  ManufacturerListResponseType,
  ManufacturerTypeData,
  SampleManuResponseType,
} from './manufacturerModel'

import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  MenuAction,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldCustom,
  TextFieldSearchCustom,
  TypographyH2,
} from 'src/components'

import {
  checkPermission,
  handlerGetErrMessage,
  isEmptyObject,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'

//material
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  styled,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
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
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import WithPermission from 'src/utils/permission.utils'
import classes from './styles.module.scss'
import { schemaImportContact } from './validations'
import { useTranslation } from 'next-i18next'
import { useDebouncedCallback } from 'use-debounce'
import { Search } from '@mui/icons-material'
import InfiniteScroll from 'react-infinite-scroll-component'

const BoxModalCustom = styled(Box)(() => ({
  width: '400px',
  background: 'white',
  borderStyle: 'none',
  padding: '50px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '10px',
}))

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
const ListManufacturerComponent = () => {
  const { t } = useTranslation('manufacturer')
  const [pushMessage] = useEnqueueSnackbar()
  const dispatch = useAppDispatch()
  const router = useRouter()

  // state use for
  const [stateManufacturerList, setStateManufacturerList] =
    useState<ManufacturerListResponseType>()
  const [stateIdManufacturer, setStateIdManufacturer] =
    useState<ManufacturerTypeData>()
  const [stateFile, setStateFile] = React.useState<{ name: string }>()
  const [stateLinkError, setStateLinkError] = useState<string | null>()
  const [openDialog, setOpenDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openModalImport, setOpenModalImport] = React.useState(false)
  const [stateSampleManufacturer, setStateSampleManufacturer] =
    useState<SampleManuResponseType>({ data: [] })
  const [statePage, setStatePage] = useState(1)
  const [stateValueSearch, setStateValueSearch] = useState('')
  const [stateListCheckBox, setStateListCheckBox] = useState<number[]>([])
  const [stateOpenImportDrawer, setStateOpenImportDrawer] = useState(false)
  const textFieldRef = React.useRef<HTMLInputElement>(null)
  const arrayPermission = useAppSelector((state) => state.permission.data)

  const handleOpenModalImport = () => {
    setOpenModalImport(true)
  }
  const handleCloseModalImport = () => {
    setOpenModalImport(false)
    setStateLinkError(null)
    setStateFile(undefined)
    resetImportFile()
  }
  //form hooks
  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormSearch>({
    defaultValues: {
      name: '',
    },
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().max(255),
      })
    ),
  })
  const {
    handleSubmit: handleSubmitImportFile,
    register: registerImportFile,
    control: controlImportFile,
    reset: resetImportFile,
    clearErrors,
    formState: { errors: errorsImportFile },
  } = useForm({
    resolver: yupResolver(schemaImportContact(t)),
    mode: 'all',
  })

  const onSubmitImportFile = (data: any) => {
    const formData = new FormData()
    console.log('data', data)
    // console.log('aaa', getValuesImportfile('fileImportContact').importData[0])
    formData.append('importData', data.importData[0])
    console.log(formData)
    uploadFileImportApi(formData)
      .then(() => {
        pushMessage(t('importSuccessfully'), 'success')
        handleCloseModalImport()
        handleGetListManufacturer({})
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
  const handleFileInput = (e: any) => {
    // handle validations
    const fileInput = e.target.files[0]
    if (fileInput.size) {
      setStateLinkError(null)
      setStateFile(fileInput)
      clearErrors('importData')
    }
  }
  const handleDeleteFile = () => {
    // fileInputRef.current.value = null
    setStateFile(undefined)
    resetImportFile()
    setStateLinkError(null)
  }
  // dialog
  const handleDialog = () => {
    setOpenDialog(!openDialog)
    setAnchorEl(null)
  }

  //search
  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        name: values.name,
        page: 1,
      })}`,
    })
  }

  //pagination
  const handleChangePagination = (event: any, page: number) => {
    console.log(event)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }

  // trigger when change row per page option ( page size )
  const handleChangeRowsPerPage = (event: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }

  //Menu Delete and edit
  const open = Boolean(anchorEl)
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleDelete = () => {
    dispatch(loadingActions.doLoading())
    if (stateIdManufacturer) {
      deleteManufacturer(stateIdManufacturer.id)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(
            t(
              'deleteManufacturerStateIdManufacturerNameSuccessfully',
              stateIdManufacturer.name
            ),
            'success'
          )

          setOpenDialog(false)
          handleGetListManufacturer(router.query)
        })
        .catch(({ response }) => {
          const { status, data } = response
          dispatch(loadingActions.doLoadingFailure())
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }

    setAnchorEl(null)
  }
  const handleGetListManufacturer = (query: any) => {
    dispatch(loadingActions.doLoading())
    getListManufacturers(query)
      .then((res) => {
        const data = res.data
        dispatch(loadingActions.doLoadingSuccess())
        setStateManufacturerList(data)
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    if (router.asPath.length !== router.pathname.length) {
      if (router.query.name) {
        setValue('name', router.query.name)
      }
      if (!isEmptyObject(router.query)) {
        handleGetListManufacturer(router.query)
      }
    } else {
      handleGetListManufacturer({})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])

  //downloadfile
  const downloadEmployeeData = () => {
    fetch(
      'https://twss-sgp-public-storage.s3.ap-southeast-1.amazonaws.com/media/import-manufacturers.xlsx',
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
        link.setAttribute('download', `import-manufacturers.xlsx`)

        // Append to html link element page
        document.body.appendChild(link)

        // Start download
        link.click()
        // Clean up and remove the link
        link?.parentNode?.removeChild(link)
      })
  }

  // const checkGear = (permissionRule: string[]) => {
  //   const permissionGear = []
  //   for (const i of permissionRule) {
  //     permissionGear.push([checkPermission(KEY_MODULE.Warehouse, i)]) // get true/false value and push to array permissionGear
  //   }
  //   const check = (element: any) => element == 'true'

  //   return permissionGear.some(check) // return true if has least 1 element in array is true
  // }
  const handleGetListSampleManu = (value: object) => {
    getSampleManu(1, value)
      .then((res) => {
        const { data } = res
        setStateSampleManufacturer(data)
        if (data.nextPage) {
          setStatePage(2)
        }
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const fetchMoreDataBrand = useCallback(
    (value: { page: number; name: string }) => {
      getSampleManu(value.page, { search: value.name })
        .then((res) => {
          const { data } = res
          setStateSampleManufacturer((prev: any) => {
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
    [setStateSampleManufacturer, pushMessage]
  )
  useEffect(() => {
    handleGetListSampleManu({})
  }, [])

  const next = () => {
    setStatePage((prev) => {
      console.log(statePage)
      fetchMoreDataBrand({
        page: prev,
        name: stateValueSearch,
      })
      return prev + 1
    })
  }
  const debounced = useDebouncedCallback((e) => {
    setStateSampleManufacturer({ data: [] })
    setStateValueSearch(e.target.value)
    handleGetListSampleManu({ search: e.target.value })
  }, 500)
  const handleCheckGear = () => {
    if (
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Manufacturer,
        platform() === 'SUPPLIER'
          ? PERMISSION_RULE.SupplierUpdate
          : PERMISSION_RULE.MerchantUpdate
      ) &&
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Manufacturer,
        platform() === 'SUPPLIER'
          ? PERMISSION_RULE.SupplierDelete
          : PERMISSION_RULE.MerchantDelete
      )
    ) {
      return false
    }
    return true
  }
  const handleChangeCheckBox = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const cloneListCheckBox: number[] = JSON.parse(
      JSON.stringify(stateListCheckBox)
    )
    if (event.target.checked) {
      cloneListCheckBox.push(index)
    } else {
      const foundIndex = cloneListCheckBox.findIndex((item) => item === index)
      cloneListCheckBox.splice(foundIndex, 1)
    }
    setStateListCheckBox(cloneListCheckBox)
  }
  const handleCheckIsChecked = (index: number) => {
    const cloneListCheckBox: number[] = JSON.parse(
      JSON.stringify(stateListCheckBox)
    )
    const foundIndex = cloneListCheckBox.findIndex((item) => item === index)
    if (foundIndex >= 0) {
      return true
    }
    return false
  }
  const handleCloseDrawerImport = () => {
    setStateOpenImportDrawer(false)
  }
  const handleImportSelected = () => {
    dispatch(loadingActions.doLoading())
    addSampleManu({ ids: stateListCheckBox })
      .then(() => {
        setStateListCheckBox([])
        handleGetListSampleManu({})
        if (!isEmptyObject(router.query)) {
          handleGetListManufacturer(router.query)
        } else {
          handleGetListManufacturer({})
        }
        setStateOpenImportDrawer(false)
        pushMessage('Import successfully', 'success')
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  const handleImportAll = () => {
    dispatch(loadingActions.doLoading())
    addSampleManu({ ids: [] })
      .then(() => {
        setStateListCheckBox([])
        handleGetListSampleManu({})
        if (!isEmptyObject(router.query)) {
          handleGetListManufacturer(router.query)
        } else {
          handleGetListManufacturer({})
        }
        setStateOpenImportDrawer(false)
        pushMessage('Import successfully', 'success')

        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        dispatch(loadingActions.doLoadingFailure())
      })
  }
  return (
    <>
      <Grid container columnSpacing={'14px'}>
        <Grid xs>
          <form onSubmit={handleSubmit(handleSearch)} className="form-search">
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <>
                  <FormControl fullWidth>
                    <TextFieldSearchCustom
                      error={!!errors.name}
                      placeholder={t('searchByNameManufacturer')}
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

        {WithPermission(
          <>
            <Grid xs sx={{ maxWidth: '68px' }}>
              <Tooltip title="Upload file">
                <ButtonCustom
                  onClick={handleOpenModalImport}
                  variant="outlined"
                  size="large"
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
            <Grid xs style={{ maxWidth: '68px' }}>
              <Tooltip title="Download file">
                <ButtonCustom
                  onClick={() => {
                    downloadEmployeeData()
                  }}
                  variant="outlined"
                  size="large"
                  style={{ padding: '14px 0' }}
                  sx={{
                    border: '1px solid #E1E6EF',
                    color: '#49516F',
                    minWidth: '50px',
                  }}
                >
                  <DownloadSimple size={20} />
                </ButtonCustom>
              </Tooltip>
            </Grid>
          </>,
          KEY_MODULE.Manufacturer,
          PERMISSION_RULE.Import
        )}

        {WithPermission(
          <>
            <Grid xs style={{ maxWidth: '550px' }}>
              <Stack direction="row" spacing={2}>
                <Link
                  href={`/${platform().toLowerCase()}/inventory/manufacturer/create`}
                >
                  <a>
                    <ButtonCustom variant="contained" size="large">
                      {t('addNewManufacturer')}
                    </ButtonCustom>
                  </a>
                </Link>
                <ButtonCustom
                  variant="contained"
                  size="large"
                  onClick={() => setStateOpenImportDrawer(true)}
                >
                  Import
                </ButtonCustom>
              </Stack>
            </Grid>
          </>,
          KEY_MODULE.Manufacturer,
          platform() === 'SUPPLIER'
            ? PERMISSION_RULE.SupplierCreate
            : PERMISSION_RULE.MerchantCreate
        )}
      </Grid>
      {stateManufacturerList?.data.length === 0 ? (
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
                {t('thereAreNoManufacturerToShow')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <>
          {' '}
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                    {t('list.no.')}
                  </TableCellTws>
                  <TableCellTws width={120}> {t('list.logo')}</TableCellTws>
                  <TableCellTws> {t('list.manufacturerName')}</TableCellTws>
                  {handleCheckGear() && (
                    <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                      {t('list.action')}
                    </TableCellTws>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {stateManufacturerList?.data?.map(
                  (row: ManufacturerTypeData, index: number) => {
                    return (
                      <TableRowTws key={`item-${index}`}>
                        <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                          {(router.query.limit
                            ? Number(router.query.limit)
                            : 10) *
                            (router.query.page
                              ? Number(router.query.page)
                              : 1) -
                            (router.query.limit
                              ? Number(router.query.limit)
                              : 10) +
                            index +
                            1}
                        </TableCellTws>
                        <TableCellTws>
                          <Avatar
                            alt={row.name}
                            src={
                              row.logo
                                ? row.logo
                                : '/images/default-brand-manu.png'
                            }
                          />
                        </TableCellTws>
                        <TableCellTws>{row.name}</TableCellTws>
                        {handleCheckGear() && (
                          <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                            <IconButton
                              onClick={(e) => {
                                setStateIdManufacturer(row)
                                handleOpenMenu(e)
                              }}
                            >
                              <Gear size={28} />
                            </IconButton>
                          </TableCellTws>
                        )}
                      </TableRowTws>
                    )
                  }
                )}
              </TableBody>
            </Table>
          </TableContainerTws>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <Typography> {t('list.rowsPerPage')}</Typography>
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
              count={
                stateManufacturerList ? stateManufacturerList?.totalPages : 0
              }
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
            {WithPermission(
              <MenuItem>
                <Link
                  href={`/${platform().toLowerCase()}/inventory/manufacturer/update/${Number(
                    stateIdManufacturer ? stateIdManufacturer.id : 0
                  )}`}
                >
                  <a className="menu-item-action"> {t('list.edit')}</a>
                </Link>
              </MenuItem>,
              KEY_MODULE.Manufacturer,
              platform() === 'SUPPLIER'
                ? PERMISSION_RULE.SupplierUpdate
                : PERMISSION_RULE.MerchantUpdate
            )}
            {WithPermission(
              <MenuItem onClick={handleDialog}> {t('list.delete')}</MenuItem>,
              KEY_MODULE.Manufacturer,
              platform() === 'SUPPLIER'
                ? PERMISSION_RULE.SupplierDelete
                : PERMISSION_RULE.MerchantDelete
            )}
          </MenuAction>
          <Dialog open={openDialog} onClose={handleDialog}>
            <DialogTitleTws>
              <IconButton onClick={handleDialog}>
                <X size={20} />
              </IconButton>
            </DialogTitleTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('deleteManufacturer')}
            </TypographyH2>
            <DialogContentTws>
              <DialogContentTextTws>
                {t('areYouSureToRemoveTheManufacturerOutOfList')}
              </DialogContentTextTws>
            </DialogContentTws>
            <DialogActionsTws>
              <Stack spacing={2} direction="row">
                <ButtonCancel
                  onClick={handleDialog}
                  variant="outlined"
                  size="large"
                >
                  {t('no')}
                </ButtonCancel>
                <ButtonCustom
                  variant="contained"
                  size="large"
                  onClick={handleDelete}
                >
                  {t('yes')}
                </ButtonCustom>
              </Stack>
            </DialogActionsTws>
          </Dialog>
          <Drawer
            anchor="right"
            open={openModalImport}
            onClose={handleCloseModalImport}
          >
            <BoxModalCustom>
              <Stack
                direction="row"
                spacing={1}
                sx={{ marginBottom: '15px' }}
                alignItems="center"
              >
                <IconButton onClick={handleCloseModalImport}>
                  <ArrowRight size={24} />
                </IconButton>
                <TypographyH2> {t('importManufacturer')}</TypographyH2>
              </Stack>

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

                        <ButtonGroup
                          sx={{ position: 'relative', width: '100%' }}
                        >
                          <ButtonUploadFileCustom
                            variant="contained"
                            startIcon={<UploadSimple size={20} />}
                            onClick={() => {
                              textFieldRef.current &&
                                textFieldRef.current.click()
                              textFieldRef.current &&
                                textFieldRef.current.focus()
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
                      )}{' '}
                      <Link href={stateLinkError}>
                        <a className={classes['errorText']}>
                          {' '}
                          {t('clickHere')}
                        </a>
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
                  <Stack
                    direction="row"
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <ButtonCancel
                      onClick={handleCloseModalImport}
                      variant="outlined"
                      size="large"
                    >
                      {t('cancel')}
                    </ButtonCancel>
                    <ButtonCustom
                      variant="contained"
                      size="large"
                      type="submit"
                    >
                      {' '}
                      {t('submit')}
                    </ButtonCustom>
                  </Stack>
                </Stack>
              </form>
            </BoxModalCustom>
          </Drawer>
        </>
      )}
      <Drawer
        anchor="right"
        open={stateOpenImportDrawer}
        onClose={handleCloseDrawerImport}
      >
        <BoxModalCustom>
          <Stack
            direction="row"
            spacing={1}
            sx={{ marginBottom: '15px' }}
            alignItems="center"
          >
            <IconButton onClick={handleCloseDrawerImport}>
              <ArrowRight size={24} />
            </IconButton>
            <TypographyH2>Import Manufacturer</TypographyH2>
          </Stack>
          <TextFieldCustom
            onChange={(e) => debounced(e)}
            sx={{ width: '100%', marginBottom: '15px' }}
            size="small"
            InputProps={{
              startAdornment: <Search style={{ fontSize: '18px' }} />,
            }}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          />
          <Box sx={{ height: '510px', marginBottom: '15px' }}>
            <InfiniteScroll
              dataLength={Number(stateSampleManufacturer.data.length)} //This is important field to render the next data
              height={500}
              next={next}
              hasMore={stateSampleManufacturer.nextPage ? true : false}
              loader={
                <Box
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <CircularProgress size="2rem" />
                </Box>
              }
            >
              {stateSampleManufacturer.data.map((item, index) => {
                return (
                  <FormControlLabel
                    sx={{ display: 'block' }}
                    key={index}
                    control={
                      <Checkbox
                        checked={handleCheckIsChecked(item.id)}
                        onChange={(e) => handleChangeCheckBox(e, item.id)}
                      />
                    }
                    label={item.name}
                  />
                )
              })}
            </InfiniteScroll>
          </Box>

          <Stack spacing={2}>
            <ButtonCustom
              disabled={stateListCheckBox.length === 0}
              size="large"
              variant="contained"
              onClick={handleImportSelected}
            >
              Import Selected
            </ButtonCustom>
            <ButtonCustom
              disabled={stateSampleManufacturer.data.length === 0}
              onClick={handleImportAll}
              size="large"
              variant="contained"
            >
              Import All
            </ButtonCustom>
            <ButtonCustom
              variant="outlined"
              size="large"
              onClick={handleCloseDrawerImport}
            >
              Cancel
            </ButtonCustom>
          </Stack>
        </BoxModalCustom>
      </Drawer>
    </>
  )
}

export default ListManufacturerComponent
