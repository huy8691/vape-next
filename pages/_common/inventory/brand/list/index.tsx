/* eslint-disable jsx-a11y/alt-text */
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
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
// import SettingsIcon from '@mui/icons-material/Settings'
import { yupResolver } from '@hookform/resolvers/yup'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { categoryTypeData } from 'pages/_common/inventory/category/list/modelProductCategories'
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
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  checkPermission,
  handlerGetErrMessage,
  isEmptyObject,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import * as yup from 'yup'
import {
  addSampleBrand,
  deleteBrand,
  getListBrand,
  getListSampleBrand,
  uploadFileImportApi,
} from './apiBrand'
import {
  brandResponseTypeData,
  SampleBrandResponseType,
  Search as SearchType,
} from './brandModel'
import classes from './styles.module.scss'
import { schemaImportContact } from './validations'
import { Search } from '@mui/icons-material'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import WithPermission from 'src/utils/permission.utils'
import { useTranslation } from 'next-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'

import { useDebouncedCallback } from 'use-debounce'
const BoxModalCustom = styled(Box)(() => ({
  width: '400px',
  background: 'white',
  borderStyle: 'none',
  padding: '25px',
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

const ListBrand = () => {
  const { t } = useTranslation('brand')
  const [pushMessage] = useEnqueueSnackbar()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

  const [showPopover, setShowPopover] = useState(false)
  const [dataItem, setdataItem] = useState<categoryTypeData>()
  const [openDialog, setOpenDialog] = useState(false)
  const [stateFile, setStateFile] = React.useState<{ name: string }>()
  const [stateLinkError, setStateLinkError] = useState<string | null>()
  // // state use for list cata
  const [stateBrandList, setStateBrandList] = useState<brandResponseTypeData>()
  const [openModalImport, setOpenModalImport] = React.useState(false)
  const textFieldRef = React.useRef<HTMLInputElement>(null)
  const [stateOpenImportDrawer, setStateOpenImportDrawer] = useState(false)
  const [stateSampleBrand, setStateSampleBrand] =
    useState<SampleBrandResponseType>({ data: [] })
  const [statePage, setStatePage] = useState(1)
  const [stateValueSearch, setStateValueSearch] = useState('')
  const [stateListCheckBox, setStateListCheckBox] = useState<number[]>([])

  const handleOpenModalImport = () => setOpenModalImport(true)
  const handleCloseModalImport = () => {
    setOpenModalImport(false)
    setStateLinkError(null)
    setStateFile(undefined)
    resetImportFile()
  }

  const router = useRouter()
  const dispatch = useAppDispatch()
  const arrayPermission = useAppSelector((state) => state.permission.data)

  const handleDialog = () => {
    setAnchorEl(null)
    setShowPopover(false)
    setOpenDialog(!openDialog)
  }
  //search
  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SearchType>({
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
    clearErrors,
    reset: resetImportFile,
    formState: { errors: errorsImportFile },
  } = useForm({
    resolver: yupResolver(schemaImportContact(t)),
    mode: 'all',
  })
  const onSubmitImportFile = (data: any) => {
    console.log('🚀 ~ onSubmitImportFile ~ data:', data)

    const formData = new FormData()
    console.log('data', data)
    // console.log('aaa', getValuesImportfile('fileImportContact').importData[0])
    formData.append('importData', data.importData[0])
    console.log(formData)
    uploadFileImportApi(formData)
      .then(() => {
        pushMessage(t('list.message.importSuccessfully'), 'success')
        handleCloseModalImport()
        handleGetListBrand({})
      })
      .catch(({ response }) => {
        const { data, status } = response
        if (typeof data.data === 'string') {
          setStateLinkError(data.data)
          return
        }
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    // console.log(
    //   '🚀 ~ file: index.page.tsx:200 ~ onSubmitImportFile ~ data',
    //   data.data
    // )

    // pushMessage(handlerGetErrMessage(status, data), 'error')
  }
  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        name: values.name,
        page: 1,
      })}`,
    })
  }

  const handleClickShow = (
    event: React.MouseEvent<HTMLButtonElement>,
    data: any
  ) => {
    setAnchorEl(event.currentTarget)
    setShowPopover(!showPopover)
    setdataItem(data)
  }

  const handleClose = () => {
    setShowPopover(false)
  }

  //delete
  const handleDelete = () => {
    const deleteBrandId = dataItem?.id
    dispatch(loadingActions.doLoading())

    deleteBrand(Number(deleteBrandId))
      .then(() => {
        pushMessage(
          t(
            'list.message.deleteDataItemNameSuccessfully',
            String(dataItem?.name)
          ),
          'success'
        )
        getListBrand(router.query)
          .then((res) => {
            const data = res.data
            setStateBrandList(data)
            dispatch(loadingActions.doLoadingSuccess())
          })
          .catch((response) => {
            dispatch(loadingActions.doLoadingFailure())
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        handleDialog()
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleFileInput = (e: any) => {
    // handle validations
    const fileInput = e.target.files[0]

    if (fileInput.size) {
      clearErrors('importData')
      setStateLinkError(null)
      setStateFile(fileInput)
    }
  }
  const handleDeleteFile = () => {
    // fileInputRef.current.value = null
    setStateFile(undefined)
    resetImportFile()
  }
  //pagination
  const handleChangePagination = (e: any, page: number) => {
    console.log(e)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }
  // change per page
  const handleChangeRowsPerPage = (event: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }
  // data call api
  const handleGetListBrand = (event: any) => {
    dispatch(loadingActions.doLoading())
    getListBrand(event)
      .then((res) => {
        const data = res.data
        setStateBrandList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response

        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  //
  useEffect(() => {
    if (router.asPath.length !== router.pathname.length) {
      if (router.query.name) setValue('name', router.query.name)
      if (!isEmptyObject(router.query)) {
        handleGetListBrand(router.query)
      }
    } else {
      handleGetListBrand({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])

  //downloadfile
  const downloadEmployeeData = () => {
    fetch(
      'https://twss-sgp-public-storage.s3.ap-southeast-1.amazonaws.com/media/import-brands.xlsx',
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
        link.setAttribute('download', `import-brands.xlsx`)

        // Append to html link element page
        document.body.appendChild(link)

        // Start download
        link.click()
        // Clean up and remove the link
        link?.parentNode?.removeChild(link)
      })
  }
  const handleCheckGear = () => {
    if (
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Brand,
        platform() === 'SUPPLIER'
          ? PERMISSION_RULE.SupplierUpdate
          : PERMISSION_RULE.MerchantUpdate
      ) &&
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Brand,
        platform() === 'SUPPLIER'
          ? PERMISSION_RULE.SupplierDelete
          : PERMISSION_RULE.MerchantDelete
      )
    ) {
      return false
    }
    return true
  }
  const handleCloseDrawerImport = () => {
    setStateOpenImportDrawer(false)
  }
  const handleGetListSampleBrand = (value: object) => {
    getListSampleBrand(1, value)
      .then((res) => {
        const { data } = res
        setStateSampleBrand(data)
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
      getListSampleBrand(value.page, { search: value.name })
        .then((res) => {
          const { data } = res
          setStateSampleBrand((prev: any) => {
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
    [setStateSampleBrand, pushMessage]
  )
  useEffect(() => {
    handleGetListSampleBrand({})
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
    setStateSampleBrand({ data: [] })
    setStateValueSearch(e.target.value)
    handleGetListSampleBrand({ search: e.target.value })
  }, 500)
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
  const handleImportSelected = () => {
    dispatch(loadingActions.doLoading())
    addSampleBrand({ ids: stateListCheckBox })
      .then(() => {
        setStateListCheckBox([])
        handleGetListSampleBrand({})
        if (!isEmptyObject(router.query)) {
          handleGetListBrand(router.query)
        } else {
          handleGetListBrand({})
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
    addSampleBrand({ ids: [] })
      .then(() => {
        setStateListCheckBox([])
        handleGetListSampleBrand({})
        if (!isEmptyObject(router.query)) {
          handleGetListBrand(router.query)
        } else {
          handleGetListBrand({})
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
  useEffect(() => {
    console.log('anchorEl', anchorEl)
  }, [anchorEl])
  return (
    <>
      <Grid container columnSpacing={'28px'}>
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
                      placeholder={t('list.searchBrandByName')}
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
            <Grid xs style={{ maxWidth: '78px' }}>
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
            <Grid xs style={{ maxWidth: '78px' }}>
              <Tooltip title="Download file">
                <ButtonCustom
                  variant="outlined"
                  onClick={() => {
                    downloadEmployeeData()
                  }}
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
          KEY_MODULE.Brand,
          PERMISSION_RULE.Import
        )}
        <Grid xs style={{ maxWidth: '450px' }}>
          <Stack direction="row" spacing={2}>
            {WithPermission(
              <Link
                href={`/${platform().toLowerCase()}/inventory/brand/create`}
              >
                <a>
                  <ButtonCustom variant="contained" size="large">
                    {t('list.addNewBrand')}
                  </ButtonCustom>
                </a>
              </Link>,
              KEY_MODULE.Brand,
              platform() === 'SUPPLIER'
                ? PERMISSION_RULE.SupplierCreate
                : PERMISSION_RULE.MerchantCreate
            )}
            <ButtonCustom
              variant="contained"
              size="large"
              onClick={() => setStateOpenImportDrawer(true)}
            >
              Import
            </ButtonCustom>
          </Stack>

          {/* {withPermission(
            ButtonAddBrand,
            JSON.parse(String(localStorage.getItem('permissions'))),
            KEY_MODULE.Brand,
            PERMISSION_RULE.Create
          )} */}
        </Grid>
        ,
      </Grid>

      {stateBrandList?.data.length === 0 ? (
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
                {t('list.thereAreNoBrandToShow')}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <>
          <TableContainerTws>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                    {t('list.number')}
                  </TableCellTws>
                  <TableCellTws width={120}>{t('list.logo')}</TableCellTws>
                  <TableCellTws> {t('list.brandName')}</TableCellTws>
                  {handleCheckGear() && (
                    <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                      {t('list.action')}
                    </TableCellTws>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {stateBrandList?.data?.map((item, index) => {
                  return (
                    <React.Fragment key={`item-${index}`}>
                      <TableRowTws>
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
                            alt={item.name}
                            src={
                              item.logo
                                ? item.logo
                                : '/images/default-brand-manu.png'
                            }
                          />
                        </TableCellTws>
                        <TableCellTws>{item.name}</TableCellTws>
                        {handleCheckGear() && (
                          <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                            <IconButton
                              onClick={(e) => handleClickShow(e, item)}
                            >
                              <Gear size={28} />
                            </IconButton>
                          </TableCellTws>
                        )}
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
            <Typography>{t('list.rowsPerPage')}</Typography>
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
              count={stateBrandList ? stateBrandList?.totalPages : 0}
            />
          </Stack>
          <MenuAction
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            anchorEl={anchorEl}
            open={showPopover}
            onClose={handleClose}
          >
            {WithPermission(
              <MenuItem onClick={handleClose} disableRipple>
                <Link
                  href={
                    platform() === 'SUPPLIER'
                      ? `/supplier/inventory/brand/update/${dataItem?.id}`
                      : `/retailer/inventory/brand/update/${dataItem?.id}`
                  }
                >
                  <a className="menu-item-action">Edit</a>
                </Link>
              </MenuItem>,
              KEY_MODULE.Brand,
              platform() === 'SUPPLIER'
                ? PERMISSION_RULE.SupplierUpdate
                : PERMISSION_RULE.MerchantUpdate
            )}
            {WithPermission(
              <MenuItem onClick={handleDialog}>Delete</MenuItem>,
              KEY_MODULE.Brand,
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
              {t('list.deleteBrand')}
            </TypographyH2>
            <DialogContentTws>
              <DialogContentTextTws>
                {t('list.areYouSureToRemoveTheBrandOutOfList')}
              </DialogContentTextTws>
            </DialogContentTws>
            <DialogActionsTws>
              <Stack spacing={2} direction="row">
                <ButtonCancel
                  onClick={handleDialog}
                  variant="outlined"
                  size="large"
                >
                  {t('list.no')}
                </ButtonCancel>
                <ButtonCustom
                  variant="contained"
                  size="large"
                  onClick={handleDelete}
                >
                  {t('list.yes')}
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
                <TypographyH2>{t('list.importBrand')}</TypographyH2>
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
                          {t('list.selectImportFile')}
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
                            {t('list.uploadFile')}...
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
                        'list.thereAreSomeErrorsWithTheImportFilePleaseDownloadTheErrorFileForMoreInformation'
                      )}
                      <Link href={stateLinkError}>
                        <a className={classes['errorText']}>
                          {t('list.clickHere')}
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
                        {t('list.clickHere')}
                      </span>{' '}
                      {t('list.toDownTheImportTemplate')}
                    </Typography>
                    <Typography sx={{ fontStyle: 'italic' }}>
                      {t('list.allowedFileExtensionXlsxCsv')}
                    </Typography>
                    <Typography sx={{ fontStyle: 'italic' }}>
                      {t('list.allowedFileSizeIs_10Mb')}
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
                      {t('list.cancel')}
                    </ButtonCancel>
                    <ButtonCustom
                      variant="contained"
                      size="large"
                      type="submit"
                    >
                      {t('list.submit')}
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
            <TypographyH2>{t('list.importBrand')}</TypographyH2>
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
              dataLength={Number(stateSampleBrand.data.length)} //This is important field to render the next data
              height={500}
              next={next}
              hasMore={stateSampleBrand.nextPage ? true : false}
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
              {stateSampleBrand.data.map((item, index) => {
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
              onClick={handleImportAll}
              size="large"
              variant="contained"
              disabled={stateSampleBrand.data.length === 0}
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

export default ListBrand
