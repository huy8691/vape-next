import { yupResolver } from '@hookform/resolvers/yup'
import {
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
import { Gear, MagnifyingGlass, X } from '@phosphor-icons/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
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
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  formatPhoneNumber,
  handlerGetErrMessage,
  isEmptyObject,
  objToStringParam,
} from 'src/utils/global.utils'
import * as Yup from 'yup'
import {
  deleteExternalSupplier,
  getListExternalSupplier,
} from './externalSupplierAPI'
import {
  ExternalSupplierListResponseType,
  ExternalSupplierTypeData,
  FormSearch,
} from './externalSupplierModel'
import CreateExternalSupplierComponent from '../create'
import UpdateExternalSupplierComponent from '../update'
import { useTranslation } from 'react-i18next'

const ListExternalSupplierComponent: React.FC = () => {
  const { t } = useTranslation('external-supplier')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [stateOpenDialog, setStateOpenDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [openCreateExternal, setOpenCreateExternal] = useState(false)
  const [openUpdateExternal, setOpenUpdateExternal] = useState(false)
  const [stateExternalSupplierList, setStateExternalSupplierList] =
    useState<ExternalSupplierListResponseType>()
  const [pushMessage] = useEnqueueSnackbar()
  const [idExternalSupplier, setIdExternalSupplier] =
    useState<ExternalSupplierTypeData>()
  const {
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormSearch>({
    defaultValues: {
      search: '',
    },
    resolver: yupResolver(
      Yup.object().shape({
        search: Yup.string().max(255),
      })
    ),
  })

  const handleGetListExternalSupplier = (query: any) => {
    dispatch(loadingActions.doLoading())
    getListExternalSupplier(query)
      .then((res) => {
        const data = res.data
        dispatch(loadingActions.doLoadingSuccess())
        setStateExternalSupplierList(data)
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const handleSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        search: values.search,
        page: 1,
      })}`,
    })
  }

  const handleChangeRowsPerPage = (event: any) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: Number(event.target.value),
        page: 1,
      })}`,
    })
  }

  const handleChangePagination = (page: number) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  useEffect(() => {
    if (router.asPath.length !== router.pathname.length) {
      if (router.query.search) {
        setValue('search', router.query.search)
      }
      if (!isEmptyObject(router.query)) {
        handleGetListExternalSupplier(router.query)
      }
    } else {
      handleGetListExternalSupplier({})
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])

  const handleDialogDelete = () => {
    setStateOpenDialog(!stateOpenDialog)
  }

  const handleDeleteActivityLog = () => {
    dispatch(loadingActions.doLoading())
    if (idExternalSupplier?.id) {
      deleteExternalSupplier(idExternalSupplier.id)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(
            t('message.theExternalSupplierHasBeenDeletedSuccessfully'),
            'success'
          )
          handleGetListExternalSupplier(router.query)
          setStateOpenDialog(false)
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }
  return (
    <>
      <Grid container columnSpacing={'14px'}>
        <Grid xs>
          <form onSubmit={handleSubmit(handleSearch)} className="form-search">
            <Controller
              control={control}
              name="search"
              render={({ field }) => (
                <>
                  <FormControl fullWidth>
                    <TextFieldSearchCustom
                      error={!!errors.search}
                      placeholder={t('search')}
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
        <Grid xs style={{ maxWidth: '200px' }}>
          <ButtonCustom
            variant="contained"
            fullWidth
            size="large"
            onClick={() => setOpenCreateExternal(true)}
          >
            {t('create')}
          </ButtonCustom>
        </Grid>
      </Grid>

      {stateExternalSupplierList?.data.length === 0 ? (
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
                {t('thereAreNoExternalToShow')}
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
                  <TableCellTws>{t('businessName')}</TableCellTws>
                  <TableCellTws>{t('phoneNumber')}</TableCellTws>
                  <TableCellTws>{t('email')}</TableCellTws>
                  <TableCellTws>{t('address')}</TableCellTws>
                  <TableCellTws></TableCellTws>
                </TableRow>
              </TableHead>
              <TableBody>
                {stateExternalSupplierList?.data?.map((item, index) => {
                  return (
                    <React.Fragment key={`item-${index}`}>
                      <TableRowTws
                        key={`item-${index}`}
                        sx={{
                          cursor: 'pointer',
                        }}
                      >
                        <TableCellTws>{item.name || 'N/A'}</TableCellTws>
                        <TableCellTws>
                          {formatPhoneNumber(item.phone_number || '') || 'N/A'}
                        </TableCellTws>
                        <TableCellTws>{item.email || 'N/A'}</TableCellTws>
                        <TableCellTws>{item.address || 'N/A'}</TableCellTws>
                        <TableCellTws width={80} sx={{ textAlign: 'center' }}>
                          <IconButton
                            onClick={(e) => {
                              setIdExternalSupplier(item)
                              handleOpenMenu(e)
                              e.stopPropagation()
                            }}
                          >
                            <Gear size={28} />
                          </IconButton>
                        </TableCellTws>
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
              onChange={(_event, page: number) => handleChangePagination(page)}
              count={
                stateExternalSupplierList
                  ? stateExternalSupplierList.totalPages
                  : 0
              }
            />
          </Stack>
        </>
      )}

      <MenuAction
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
        <MenuItem
          onClick={() => {
            setOpenUpdateExternal(true)
            handleCloseMenu()
          }}
        >
          {t('edit')}
        </MenuItem>
        <MenuItem onClick={handleDialogDelete}>{t('delete')}</MenuItem>
      </MenuAction>

      <Dialog open={stateOpenDialog} onClose={handleDialogDelete}>
        <DialogTitleTws>
          <IconButton onClick={handleDialogDelete}>
            <X size={20} />
          </IconButton>
        </DialogTitleTws>
        <TypographyH2 sx={{ fontSize: '2.4rem' }} alignSelf="center">
          {t('deleteExternalSupplier')}
        </TypographyH2>
        <DialogContentTws>
          <DialogContentTextTws>
            {t('areYouSureToDeleteThisExternalSupplier')}
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
              onClick={handleDeleteActivityLog}
              size="large"
            >
              {t('yes')}
            </ButtonCustom>
          </Stack>
        </DialogActionsTws>
      </Dialog>

      <CreateExternalSupplierComponent
        open={openCreateExternal}
        onClose={setOpenCreateExternal}
        handleGetListExternalSupplier={handleGetListExternalSupplier}
      />

      <UpdateExternalSupplierComponent
        open={openUpdateExternal}
        onClose={setOpenUpdateExternal}
        handleGetListExternalSupplier={handleGetListExternalSupplier}
        idExternalSupplier={idExternalSupplier?.id}
      />
    </>
  )
}

export default ListExternalSupplierComponent
