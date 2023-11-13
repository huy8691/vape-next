import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  FormControl,
  IconButton,
  Pagination,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  MenuItem,
  Dialog,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { ChangeEvent, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {
  ButtonCustom,
  MenuItemSelectCustom,
  SelectPaginationCustom,
  TableCellTws,
  TableContainerTws,
  TableRowTws,
  TextFieldSearchCustom,
  TypographyTitlePage,
  MenuAction,
  DialogTitleTws,
  TypographyH2,
  DialogContentTws,
  DialogActionsTws,
  DialogContentTextTws,
  ButtonCancel,
} from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import {
  handlerGetErrMessage,
  objToStringParam,
  platform,
} from 'src/utils/global.utils'
import { useAppDispatch } from 'src/store/hooks'
import { getListOfRoute, deleteRouter } from './apiRouterManagement'
import { RouterListResponseType, RouterListType } from './modelRouterManagement'
import { schema } from './validation'
import { Gear, X } from '@phosphor-icons/react'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useTranslation } from 'react-i18next'

const RouteManagementComponent = () => {
  const { t } = useTranslation('map')

  const dispatch = useAppDispatch()
  const [stateRouter, setStateRouter] = useState<RouterListType>()
  const [stateListRoute, setStateListRoute] = useState<RouterListResponseType>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const openMenu = Boolean(anchorEl)
  const router = useRouter()
  const [openDialog, setOpenDialog] = useState(false)
  const [pushMessage] = useEnqueueSnackbar()

  //Menu
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event.currentTarget)
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  // Menu

  const handleChangeRowsPerPage = (event: SelectChangeEvent<unknown>) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }

  //
  //dialog Delete
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDialogDelete = () => {
    setOpenDialog(!openDialog)
    handleClose()
  }

  // Delete router
  const handleDeleteRouter = () => {
    deleteRouter(Number(stateRouter?.id))
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        handleDialogDelete()
        pushMessage(` The router has been deleted successfully`, 'success')
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
        handleGetListOfRoute({})
        setStateRouter(undefined)
      })
      .catch((response) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
        handleDialogDelete()
        setStateRouter(undefined)
      })
  }

  const handleChangePagination = (
    event: ChangeEvent<unknown>,
    page: number
  ) => {
    console.log('event', event)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }
  const handleGetListOfRoute = (query: object) => {
    getListOfRoute(query)
      .then((res) => {
        const { data } = res

        setStateListRoute(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  useEffect(() => {
    handleGetListOfRoute(router.query)
  }, [router.query])

  const {
    handleSubmit: handleSubmitSearch,
    control: controlSearch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        search: values.search,
        page: 1,
      })}`,
    })
  }
  return (
    <Box>
      <Head>
        <title>{t('routeManagement')} | TWSS</title>
      </Head>
      <Box>
        <TypographyTitlePage sx={{ marginBottom: '15px' }}>
          {t('routeManagement')}
        </TypographyTitlePage>
        <Grid container spacing={2} sx={{ marginBottom: '15px' }}>
          <Grid xs={10}>
            <Box>
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
                        placeholder={t('search')}
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
            </Box>
          </Grid>
          <Grid xs>
            <ButtonCustom
              variant="contained"
              size="large"
              sx={{ width: '100%' }}
              onClick={() =>
                router.push(
                  platform() === 'RETAILER'
                    ? `/retailer/map/route-management/create`
                    : `/supplier//map/route-management/create`
                )
              }
            >
              {t('createRoute')}
            </ButtonCustom>
          </Grid>
        </Grid>

        <TableContainerTws sx={{ marginTop: '0 !important' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCellTws>{t('seller')}</TableCellTws>
                <TableCellTws>{t('date')}</TableCellTws>
                <TableCellTws>{t('stops')}</TableCellTws>
                <TableCellTws>{t('startTime')}</TableCellTws>
                <TableCellTws>{t('endTime')}</TableCellTws>
                <TableCellTws>{t('status')}</TableCellTws>
                <TableCellTws>{t('action')}</TableCellTws>
              </TableRow>
            </TableHead>
            <TableBody>
              {stateListRoute &&
                stateListRoute.data.map((item, index) => {
                  return (
                    <TableRowTws
                      key={index}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        router.push(
                          platform() === 'RETAILER'
                            ? `/retailer/map/route-management/detail/${item.id}`
                            : `/supplier/map/route-management/detail/${item.id}`
                        )
                      }}
                    >
                      <TableCellTws>
                        {item.nick_name ? item.nick_name : item.name}
                      </TableCellTws>
                      <TableCellTws>{item.date}</TableCellTws>
                      <TableCellTws>
                        {item.stop_number ? item.stop_number : 0}
                      </TableCellTws>
                      <TableCellTws>{item.date_from}</TableCellTws>
                      <TableCellTws>{item.date_to}</TableCellTws>
                      <TableCellTws>
                        {item.status === 'NEW' && (
                          <Box
                            sx={{
                              padding: '5px 20px',
                              background: '#fff',
                              color: '#E02D3C',
                              border: '1px solid #E02D3C',
                              textTransform: 'uppercase',
                              width: 'fit-content',
                              borderRadius: '40px',
                            }}
                          >
                            {t('new')}
                          </Box>
                        )}
                        {item.status === 'INPROGRESS' && (
                          <Box
                            sx={{
                              padding: '5px 20px',
                              color: '#fff',
                              background: '#2F6FED',
                              textTransform: 'uppercase',
                              width: 'fit-content',
                              borderRadius: '40px',
                            }}
                          >
                            {t('inprogress')}
                          </Box>
                        )}
                        {item.status === 'COMPLETED' && (
                          <Box
                            sx={{
                              padding: '5px 20px',
                              color: '#fff',
                              background: '#1DB46A',
                              textTransform: 'uppercase',
                              width: 'fit-content',
                              borderRadius: '40px',
                            }}
                          >
                            {t('completed')}
                          </Box>
                        )}
                        {item.status === 'CANCELLED' && (
                          <Box
                            sx={{
                              padding: '5px 20px',
                              color: '#fff',
                              background: '#E02D3C',
                              width: 'fit-content',
                              borderRadius: '40px',

                              textTransform: 'uppercase',
                            }}
                          >
                            {t('cancelled')}
                          </Box>
                        )}
                      </TableCellTws>
                      <TableCellTws>
                        <IconButton
                          onClick={(e) => {
                            handleOpenMenu(e)
                            setStateRouter(item)
                            e.stopPropagation()
                          }}
                        >
                          <Gear size={28} />
                        </IconButton>
                      </TableCellTws>
                      {/* <TableCellTws>{item.}</TableCellTws> */}
                    </TableRowTws>
                  )
                })}
            </TableBody>
          </Table>
        </TableContainerTws>
        {stateListRoute &&
          stateListRoute.data &&
          Number(stateListRoute?.totalPages) >= 1 &&
          stateListRoute?.data?.length > 0 && (
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
              spacing={2}
            >
              <Typography>{t('rowsPerPage')}</Typography>
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
                count={stateListRoute ? stateListRoute?.totalPages : 0}
              />
            </Stack>
          )}
      </Box>
      <MenuAction
        elevation={0}
        anchorEl={anchorEl}
        open={openMenu}
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
            router.push(
              platform() === 'RETAILER'
                ? `/retailer/map/route-management/update/${stateRouter?.id}`
                : `/supplier/map/route-management/update/${stateRouter?.id}`
            )
          }}
        >
          {t('update')}
        </MenuItem>
        <MenuItem onClick={handleDialogDelete} sx={{ justifyContent: 'end' }}>
          {t('delete')}
        </MenuItem>
      </MenuAction>
      <Dialog open={openDialog} onClose={handleDialogDelete}>
        <DialogTitleTws>
          <IconButton onClick={handleDialogDelete}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('deleteRouter')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {t('areYouSureToDeleteRouter')}
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
              onClick={handleDeleteRouter}
              size="large"
            >
              {t('yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>
    </Box>
  )
}

export default RouteManagementComponent
