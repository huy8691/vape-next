import ExpandMore from '@mui/icons-material/ExpandMore'
import {
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
  Pagination,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useState } from 'react'
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
  TextFieldCustom,
  TextFieldSearchCustom,
  TypographyH2,
} from 'src/components'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  categoryListResponseType,
  categoryTypeData,
  SampleCategoryResponseType,
  SearchFormInput,
} from './modelProductCategories'
import classes from './styles.module.scss'

import { yupResolver } from '@hookform/resolvers/yup'
import MenuItem from '@mui/material/MenuItem'
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
import { Controller, useForm } from 'react-hook-form'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  checkPermission,
  handlerGetErrMessage,
  isEmptyObject,
  KEY_MODULE,
  objToStringParam,
  PERMISSION_RULE,
  platform,
} from 'src/utils/global.utils'
import WithPermission from 'src/utils/permission.utils'
import * as yup from 'yup'
import {
  deleteCategories,
  getListCategories,
  getListSampleCategory,
  uploadFileImportApi,
  addSampleCategory,
} from './apiCategories'
import { schemaImportCategory } from './validations'
import { useTranslation } from 'next-i18next'
import { useDebouncedCallback } from 'use-debounce'

import InfiniteScroll from 'react-infinite-scroll-component'
import { Search } from '@mui/icons-material'

const TableRowTws = styled(TableRow)(({ theme }) => ({
  backgroundColor: theme.palette.action.hover,
}))
const CategoryMenu = styled('div')(({ theme }) => ({
  // borderLeft:
  //   theme.palette.mode === 'dark'
  //     ? '1px solid rgba(81, 81, 81, 1)'
  //     : '1px solid rgba(224, 224, 224, 1)',
  position: 'relative',
  paddingLeft: '30px',
  fontStyle: 'italic',
  '&:before': {
    position: 'absolute',
    top: '21px',
    left: '0px',
    width: '20px',
    height: '1px',
    content: "''",
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(81, 81, 81, 1)'
        : 'rgba(0, 0, 0, 0.4)',
  },
  '&:after': {
    position: 'absolute',
    top: '0',
    left: '0px',
    width: '1px',
    height: '100%',
    content: "''",
    backgroundColor:
      theme.palette.mode === 'dark'
        ? 'rgba(81, 81, 81, 1)'
        : 'rgba(0, 0, 0, 0.4)',
  },
  '&:last-child:after': {
    height: '50%',
  },
}))
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
const ListCategoryComponent = () => {
  const { t } = useTranslation('category')
  const theme = useTheme()
  const [pushMessage] = useEnqueueSnackbar()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [showPopover, setShowPopover] = useState(false)
  const [dataItem, setDataItem] = useState<categoryTypeData>()
  const [openDialog, setOpenDialog] = useState(false)
  const [stateFile, setStateFile] = React.useState<{ name: string }>()
  const [stateLinkError, setStateLinkError] = useState<string | null>()
  const handleDialog = () => {
    setOpenDialog(!openDialog)
    setAnchorEl(null)
    setShowPopover(false)
  }

  const [openModalImport, setOpenModalImport] = React.useState(false)
  const [stateOpenImportDrawer, setStateOpenImportDrawer] = useState(false)
  const [stateSampleCategory, setStateSampleCategory] =
    useState<SampleCategoryResponseType>({ data: [] })
  const [statePage, setStatePage] = useState(1)
  const [stateValueSearch, setStateValueSearch] = useState('')
  const [stateListCheckBox, setStateListCheckBox] = useState<number[]>([])
  const textFieldRef = React.useRef<HTMLInputElement>(null)
  const arrayPermission = useAppSelector((state) => state.permission.data)

  const handleOpenModalImport = () => setOpenModalImport(true)
  const handleCloseModalImport = () => {
    setOpenModalImport(false)
    setStateLinkError(null)
    setStateFile(undefined)
    resetImportFile()
  }
  const router = useRouter()
  const dispatch = useAppDispatch()

  // state use for
  const [stateCategoryChannelList, setStateCategoryChannelList] =
    useState<categoryListResponseType>()

  //form hooks
  const {
    setValue,
    handleSubmit,
    control,

    formState: { errors },
  } = useForm<SearchFormInput>({
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
    resolver: yupResolver(schemaImportCategory(t)),
    mode: 'all',
  })

  const onSubmitImportFile = (data: any) => {
    const formData = new FormData()
    formData.append('importData', data.importData[0])
    uploadFileImportApi(formData)
      .then(() => {
        pushMessage(t('importCategory'), 'success')
        handleCloseModalImport()
        handleGetListCategory({})
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

  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        search: values.name,
        page: 1,
      })}`,
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
  //
  const handleClickShow = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
    setShowPopover(!showPopover)
  }

  const handleClose = () => {
    setShowPopover(false)
  }
  //delete
  const handleDelete = () => {
    const deleteCategoriesId = dataItem?.id
    dispatch(loadingActions.doLoading())

    deleteCategories(Number(deleteCategoriesId))
      .then(() => {
        pushMessage(
          t('message.deleteDataItemNameSuccessfully', String(dataItem?.name)),
          'success'
        )

        handleClose()
        getListCategories(router.query)
          .then((res) => {
            const data = res.data
            setStateCategoryChannelList(data)

            dispatch(loadingActions.doLoadingSuccess())
            handleGetListSampleCate({})
          })
          .catch(({ response }) => {
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
  //pagination
  const handleChangePagination = (e: any, page: number) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
    console.log(e)
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
  const handleGetListCategory = (event: any) => {
    dispatch(loadingActions.doLoading())
    getListCategories(event)
      .then((res) => {
        const data = res.data
        // setStateCategoryList(data)
        setStateCategoryChannelList(data)
        dispatch(loadingActions.doLoadingSuccess())
      })

      .catch((response) => {
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
        handleGetListCategory(router.query)
      }
    } else {
      handleGetListCategory({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])

  //downloadfile
  const downloadEmployeeData = () => {
    fetch(
      'https://twss-sgp-public-storage.s3.ap-southeast-1.amazonaws.com/media/import-categories.xlsx',
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
        link.setAttribute('download', `import-categories.xlsx`)

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
        KEY_MODULE.Category,
        platform() === 'SUPPLIER'
          ? PERMISSION_RULE.SupplierUpdate
          : PERMISSION_RULE.MerchantUpdate
      ) &&
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Category,
        platform() === 'SUPPLIER'
          ? PERMISSION_RULE.SupplierDelete
          : PERMISSION_RULE.MerchantDelete
      )
    ) {
      return false
    }
    return true
  }
  // CategoryItem
  const CategoryItem = ({ list }: any) => {
    return (
      <>
        {list.map((dataChild: categoryTypeData) => (
          <CategoryMenu key={dataChild.id}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid xs>
                <Stack direction="row" spacing={1} alignItems="center">
                  {/* {dataChild.child_category.length > 0 && <ExpandMore />} */}
                  {dataChild.name}
                </Stack>
              </Grid>
              {handleCheckGear() && (
                <Grid xs style={{ maxWidth: '80px', textAlign: 'center' }}>
                  <PopupState variant="popover" popupId="demo-popup-menu">
                    {(popupState) => (
                      <React.Fragment>
                        <IconButton
                          // onClick={() => {
                          //   setDataItem(dataChild)
                          // }}
                          {...bindTrigger(popupState)}
                        >
                          <Gear size={28} />
                        </IconButton>

                        <MenuAction
                          {...bindMenu(popupState)}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                          }}
                        >
                          <MenuItem onClick={handleClose}>
                            <Link
                              href={`/${platform().toLowerCase()}/inventory/category/update/${
                                dataChild?.id
                              }`}
                            >
                              <a className="menu-item-action">{t('edit')}</a>
                            </Link>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              setDataItem(dataChild)
                              handleDialog()
                            }}
                          >
                            {t('delete')}
                          </MenuItem>
                        </MenuAction>
                      </React.Fragment>
                    )}
                  </PopupState>
                </Grid>
              )}
            </Grid>
            {dataChild.child_category.length > 0 && (
              <div style={{ paddingLeft: '20px' }}>
                <CategoryItem list={dataChild.child_category} />
              </div>
            )}
          </CategoryMenu>
        ))}
      </>
    )
  }
  const handleCloseDrawerImport = () => {
    setStateOpenImportDrawer(false)
  }
  const handleGetListSampleCate = (value: object) => {
    getListSampleCategory(1, value)
      .then((res) => {
        const { data } = res
        setStateSampleCategory(data)
        if (data.nextPage) {
          setStatePage(2)
        }
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const fetchMoreDataCate = useCallback(
    (value: { page: number; name: string }) => {
      getListSampleCategory(value.page, { search: value.name })
        .then((res) => {
          const { data } = res
          setStateSampleCategory((prev: any) => {
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
    [setStateSampleCategory, pushMessage]
  )
  useEffect(() => {
    handleGetListSampleCate({})
  }, [])

  const next = () => {
    setStatePage((prev) => {
      console.log(statePage)
      fetchMoreDataCate({
        page: prev,
        name: stateValueSearch,
      })
      return prev + 1
    })
  }
  const debounced = useDebouncedCallback((e) => {
    setStateSampleCategory({ data: [] })
    setStateValueSearch(e.target.value)
    handleGetListSampleCate({ search: e.target.value })
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
    addSampleCategory({ ids: stateListCheckBox })
      .then(() => {
        setStateListCheckBox([])
        handleGetListSampleCate({})
        if (!isEmptyObject(router.query)) {
          handleGetListCategory(router.query)
        } else {
          handleGetListCategory({})
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
    addSampleCategory()
      .then(() => {
        setStateListCheckBox([])
        handleGetListSampleCate({})
        if (!isEmptyObject(router.query)) {
          handleGetListCategory(router.query)
        } else {
          handleGetListCategory({})
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
      <Grid container columnSpacing={'28px'}>
        <Grid xs>
          <form onSubmit={handleSubmit(handleSearch)} className="form-search">
            <Controller
              control={control}
              name="name"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="search"
                    error={!!errors.name}
                    placeholder={t('searchCategoryByName')}
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
          KEY_MODULE.Category,
          PERMISSION_RULE.Import
        )}

        <Grid xs style={{ maxWidth: '500px' }}>
          <Stack direction="row" spacing={2}>
            {WithPermission(
              <Link
                href={`/${platform().toLowerCase()}/inventory/category/create`}
              >
                <a>
                  <ButtonCustom variant="contained" size="large">
                    {t('addNewCategory')}
                  </ButtonCustom>
                </a>
              </Link>,
              KEY_MODULE.Category,
              platform() === 'SUPPLIER'
                ? PERMISSION_RULE.SupplierCreate
                : PERMISSION_RULE.MerchantCreate
            )}
            <ButtonCustom
              variant="contained"
              size="large"
              onClick={() => setStateOpenImportDrawer(true)}
            >
              {t('import')}
            </ButtonCustom>
          </Stack>
        </Grid>
      </Grid>
      {stateCategoryChannelList?.data.length === 0 ? (
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
                {t('thereAreNoProductCategoryToShow')}
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
                  <TableCellTws align="center">{t('list.no.')}</TableCellTws>
                  <TableCellTws>{t('list.categoryName')}</TableCellTws>
                  {handleCheckGear() && (
                    <TableCellTws align="center" width={80}>
                      {t('list.action')}
                    </TableCellTws>
                  )}
                </TableRow>
              </TableHead>

              <TableBody>
                {stateCategoryChannelList?.data?.map((item, index: number) => {
                  return (
                    <React.Fragment key={`item-${index}`}>
                      <TableRowTws>
                        <TableCellTws
                          align="center"
                          width={80}
                          className={
                            item.child_category.length > 0
                              ? classes.borderRowNone
                              : ''
                          }
                        >
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
                        <TableCellTws
                          className={
                            item.child_category.length > 0
                              ? classes.borderRowNone
                              : ''
                          }
                          style={{ fontWeight: 500 }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            {item.child_category.length > 0 && <ExpandMore />}
                            {item.name}
                          </Stack>
                        </TableCellTws>
                        {handleCheckGear() && (
                          <TableCellTws
                            sx={{ textAlign: 'center' }}
                            className={
                              item.child_category.length > 0
                                ? classes.borderRowNone
                                : ''
                            }
                            width={80}
                          >
                            <IconButton
                              onClick={(e) => {
                                setDataItem(item)
                                handleClickShow(e)
                              }}
                              id={`${item.id}`}
                            >
                              <Gear size={28} />
                            </IconButton>
                          </TableCellTws>
                        )}
                      </TableRowTws>
                      {item.child_category.length > 0 && (
                        <TableRowTws>
                          <TableCellTws
                            colSpan={3}
                            style={{
                              // padding: '0px 0px 0px 60px',
                              paddingLeft: '50px',
                              paddingRight: '0px',
                              backgroundColor:
                                theme.palette.mode === 'dark'
                                  ? '#121212'
                                  : '#ffffff',
                            }}
                          >
                            <CategoryItem list={item.child_category} />
                          </TableCellTws>
                        </TableRowTws>
                      )}
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
              count={
                stateCategoryChannelList
                  ? stateCategoryChannelList?.totalPages
                  : 0
              }
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
              <MenuItem onClick={handleClose}>
                <Link
                  href={`/${platform().toLowerCase()}/inventory/category/update/${Number(
                    dataItem?.id
                  )}`}
                >
                  <a className="menu-item-action">{t('list.edit')}</a>
                </Link>
              </MenuItem>,
              KEY_MODULE.Category,
              platform() === 'SUPPLIER'
                ? PERMISSION_RULE.SupplierUpdate
                : PERMISSION_RULE.MerchantUpdate
            )}
            {WithPermission(
              <MenuItem onClick={handleDialog}>Delete</MenuItem>,
              KEY_MODULE.Category,
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
              {t('deleteCategory')}
            </TypographyH2>
            <DialogContentTws>
              <DialogContentTextTws>
                {t('areYouSureToRemoveTheCategoriesOutOfList')}
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
              <TypographyH2
                sx={{ fontSize: '2.4rem', marginBottom: '24px' }}
                alignSelf="center"
              >
                {t('importCategory')}
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
                  {/* <Controller
                    control={controlImportFile}
                    name="data_type"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="data_type"
                          sx={{ marginBottom: '10px' }}
                        >
                          Category type
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <RadioGroup
                            defaultValue="PARENT"
                            {...field}
                            id="data_type"
                            name="radio-buttons-group"
                          >
                            <FormControlLabel
                              value="PARENT"
                              control={<Radio />}
                              label="Parent category"
                            />
                            <FormControlLabel
                              value="CHILDREN"
                              control={<Radio />}
                              label="Children category"
                            />
                          </RadioGroup>
                        </FormControl>
                      </>
                    )}
                  /> */}

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
                      type="submit"
                      size="large"
                    >
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
            <TypographyH2>Import Category</TypographyH2>
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
              dataLength={Number(stateSampleCategory.data.length)} //This is important field to render the next data
              height={500}
              next={next}
              hasMore={stateSampleCategory.nextPage ? true : false}
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
              {stateSampleCategory.data.map((item, index) => {
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
              disabled={stateSampleCategory.data.length}
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

export default ListCategoryComponent
