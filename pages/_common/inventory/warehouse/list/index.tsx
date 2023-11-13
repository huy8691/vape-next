import React, { useCallback, useEffect, useState } from 'react'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  MenuAction,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldSearchCustom,
  TypographyH2,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { WarehouseResponseType, WarehouseType } from './warehouseModel'

import { yupResolver } from '@hookform/resolvers/yup'
import {
  Chip,
  Dialog,
  FormControl,
  IconButton,
  MenuItem,
  Pagination,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Gear, MagnifyingGlass, X } from '@phosphor-icons/react'
import { Controller, useForm } from 'react-hook-form'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  checkPermission,
  handlerGetErrMessage,
  isEmptyObject,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import {
  deleteWarehouseApi,
  getWarehouseBelongToUser,
  setDefaultWarehouseApi,
} from './apiWarehouse'
import { schema } from './validations'

import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'
import WithPermission from 'src/utils/permission.utils'
import { useTranslation } from 'react-i18next'

const ListWarehouseComponent = () => {
  const { t } = useTranslation('warehouse')
  const [pushMessage] = useEnqueueSnackbar()

  const [stateCurrentWarehouse, setStateCurrentWarehouse] =
    useState<WarehouseType>()
  const [stateWarehouse, setStateWarehouse] = useState<WarehouseResponseType>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const router = useRouter()
  const dispatch = useAppDispatch()

  const arrayPermission = useAppSelector((state) => state.permission.data)

  const {
    handleSubmit: handleSubmitSearch,
    control: controlSearch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema(t)),
    mode: 'all',
  })
  const handleGetProductInWarehouse = (query: any) => {
    dispatch(loadingActions.doLoading())
    getWarehouseBelongToUser(query)
      .then((res) => {
        const data = res.data
        setStateWarehouse(data)
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetWareHouseBelongToUser = useCallback(() => {
    if (router.asPath.length !== router.pathname.length) {
      //   if (router.query.name) {
      //     setValue('name', router.query.name)
      //   }
      if (!isEmptyObject(router.query)) {
        handleGetProductInWarehouse(router.query)
      }
    } else {
      handleGetProductInWarehouse({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, router.asPath, router.pathname])
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
  useEffect(() => {
    handleGetWareHouseBelongToUser()
  }, [handleGetWareHouseBelongToUser])

  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        search: values.search,
        page: 1,
      })}`,
    })
  }
  const handleChangePagination = (e: any, page: number) => {
    console.log(e)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }
  //Menu Delete and edit
  const open = Boolean(anchorEl)
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    console.log('hehe')
    setAnchorEl(null)
  }

  const handleSetDefaultWarehouse = () => {
    handleCloseMenu()
    setDefaultWarehouseApi(stateCurrentWarehouse?.id.toString())
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        handleGetWareHouseBelongToUser()
        pushMessage(
          t(
            'message.theWarehouseStateCurrentWarehouseNameHasBeenMarkedAsDefaultSuccessfully',
            String(stateCurrentWarehouse?.name)
          ),
          'success'
        )
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleConfirmDeleteWarehouse = () => {
    deleteWarehouseApi(stateCurrentWarehouse?.id?.toString())
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t(
            'message.theWarehouseStateCurrentWarehouseNameHasBeenDeletedSuccessfully',
            String(stateCurrentWarehouse?.name)
          ),
          'success'
        )
        handleGetWareHouseBelongToUser()
        handleDialog()
        handleCloseMenu()
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  // dialog
  const handleDialog = () => {
    setOpenDialog(!openDialog)
  }
  const handleGear = () => {
    if (
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Warehouse,
        PERMISSION_RULE.Update
      ) &&
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Warehouse,
        PERMISSION_RULE.SetDefault
      ) &&
      !checkPermission(
        arrayPermission,
        KEY_MODULE.Warehouse,
        PERMISSION_RULE.Delete
      )
    ) {
      return false
    }
    return true
  }

  return (
    <>
      <Grid container columnSpacing={'28px'}>
        <Grid xs>
          <form
            onSubmit={handleSubmitSearch(handleSearch)}
            className="form-search"
          >
            <Controller
              control={controlSearch}
              name="search"
              defaultValue=""
              render={({ field }) => (
                <FormControl fullWidth>
                  <TextFieldSearchCustom
                    id="search"
                    error={!!errors.search}
                    placeholder={t('searchProductByName')}
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
        {/* <Grid xs style={{ maxWidth: '78px' }}>
          <ButtonCustom
            onClick={(e) => (e)}
            variant="outlined"
            size="large"
            style={{ padding: '14px 0' }}
            sx={{
              border: '1px solid #E1E6EF',
              color: '#49516F',
              minWidth: '50px',
            }}
          >
            <Badge badgeContent={filter} color="default">
              <FunnelSimple size={20} />
            </Badge>
          </ButtonCustom>
        </Grid> */}
        {WithPermission(
          <Grid xs style={{ maxWidth: '330px' }}>
            <Link
              href={`/${platform().toLowerCase()}/inventory/warehouse/create`}
            >
              <a>
                <ButtonCustom
                  variant="contained"
                  sx={{ padding: '11px 30px' }}
                  fullWidth
                  size="large"
                >
                  {t('addNewWarehouse')}
                </ButtonCustom>
              </a>
            </Link>
          </Grid>,
          KEY_MODULE.Warehouse,
          PERMISSION_RULE.Create
        )}
      </Grid>
      {stateWarehouse?.data?.length === 0 ? (
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
                  {t('thereAreNoWarehouseToShow')}
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
                  <TableCellTws width={200}>
                    {' '}
                    {t('list.warehouseName')}
                  </TableCellTws>

                  <TableCellTws>{t('list.address')}</TableCellTws>
                  <TableCellTws>{t('list.city')}</TableCellTws>
                  <TableCellTws>{t('list.state')}</TableCellTws>
                  <TableCellTws>{t('list.postalCode')}</TableCellTws>
                  <TableCellTws align="center">
                    {t('list.isDefault')}
                  </TableCellTws>

                  {handleGear() && (
                    <TableCellTws align="center">
                      {t('list.action')}
                    </TableCellTws>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {stateWarehouse?.data?.map((item, index) => (
                  <TableRowTws
                    key={`item-${index}`}
                    hover={checkPermission(
                      arrayPermission,
                      KEY_MODULE.Warehouse,
                      PERMISSION_RULE.ViewDetails
                    )}
                    sx={{
                      cursor: `${
                        checkPermission(
                          arrayPermission,
                          KEY_MODULE.Warehouse,
                          PERMISSION_RULE.ViewDetails
                        ) && 'pointer'
                      }`,
                    }}
                    onClick={() => {
                      return (
                        checkPermission(
                          arrayPermission,
                          KEY_MODULE.Warehouse,
                          PERMISSION_RULE.ViewDetails
                        ) &&
                        router.push(
                          `/${platform().toLowerCase()}/inventory/warehouse/detail/${
                            item.id
                          }`
                        )
                      )
                    }}
                  >
                    <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                      {(router.query.limit ? Number(router.query.limit) : 10) *
                        (router.query.page ? Number(router.query.page) : 1) -
                        (router.query.limit ? Number(router.query.limit) : 10) +
                        index +
                        1}
                    </TableCellTws>
                    <TableCellTws>{item.name ? item.name : 'N/A'}</TableCellTws>
                    <TableCellTws>
                      {item.address ? item.address : 'N/A'}
                    </TableCellTws>
                    <TableCellTws>{item.city ? item.city : 'N/A'}</TableCellTws>
                    <TableCellTws>
                      {item.state ? item.state : 'N/A'}
                    </TableCellTws>
                    <TableCellTws>
                      {item.postal_zipcode ? item.postal_zipcode : 'N/A'}
                    </TableCellTws>
                    <TableCellTws align="center">
                      {item.is_default && (
                        <Chip
                          label={t('list.default')}
                          sx={{
                            color: '#50D1AA',
                            backgroundColor: '#6BE2BE3D',
                          }}
                        />
                      )}
                    </TableCellTws>
                    {handleGear() && (
                      <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                        <IconButton
                          onClick={(e) => {
                            setStateCurrentWarehouse(item)
                            handleOpenMenu(e)
                            e.stopPropagation()
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
              onChange={(event, page: number) =>
                handleChangePagination(event, page)
              }
              count={stateWarehouse ? stateWarehouse?.totalPages : 0}
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
                  href={`
                    /${platform().toLowerCase()}/inventory/warehouse/update/${
                    stateCurrentWarehouse?.id
                  }`}
                >
                  <a className="menu-item-action" style={{ textAlign: 'left' }}>
                    {t('edit')}
                  </a>
                </Link>
              </MenuItem>,
              KEY_MODULE.Warehouse,
              PERMISSION_RULE.Update
            )}
            {stateCurrentWarehouse && !stateCurrentWarehouse.is_default && (
              <>
                {WithPermission(
                  <MenuItem
                    // onMouseDown={handleSetDefaultWarehouse}
                    onClick={handleSetDefaultWarehouse}
                    // onClick={handleCloseMenu}
                  >
                    {t('markAsDefault')}
                  </MenuItem>,
                  KEY_MODULE.Warehouse,
                  PERMISSION_RULE.SetDefault
                )}
              </>
            )}
            {WithPermission(
              <MenuItem onClick={handleDialog}>
                {' '}
                {t('deleteWarehouse')}
              </MenuItem>,
              KEY_MODULE.Warehouse,
              PERMISSION_RULE.Delete
            )}
          </MenuAction>
          <Dialog open={openDialog} onClose={handleDialog}>
            <DialogTitleTws>
              <IconButton onClick={handleDialog}>
                <X size={20} />
              </IconButton>
            </DialogTitleTws>
            <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
              {t('deleteWarehouse')}
            </TypographyH2>
            <DialogContentTws>
              <DialogContentTextTws>
                {t(
                  'areYouSureToRemoveTheStateCurrentWarehouseNameOutOfList',
                  String(stateCurrentWarehouse?.name)
                )}
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
                  onClick={handleConfirmDeleteWarehouse}
                >
                  {t('yes')}
                </ButtonCustom>
              </Stack>
            </DialogActionsTws>
          </Dialog>
        </>
      )}
    </>
  )
}

export default ListWarehouseComponent
