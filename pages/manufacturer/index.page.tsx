//React/Next
import React, { ReactElement, useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { NextPageWithLayout } from 'pages/_app.page'
import NestedLayout from 'src/layout/nestedLayout'

//styles
import {
  BoxModalCustom,
  ButtonIconSetting,
  StyledTableRow,
  TableCellHeadingTextCustom,
  TypographyH2,
} from './styled'
import { ButtonCustom, InputLabelCustom, TextFieldCustom } from 'src/components'
import { MenuItemSelectCustom, SelectCustom } from 'src/components'
import classes from './styles.module.scss'
import { isEmptyObject, objToStringParam } from 'src/utils/global.utils'

//material
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Unstable_Grid2'
import { Gear, MagnifyingGlass } from 'phosphor-react'
import {
  Box,
  FormHelperText,
  Modal,
  Stack,
  Typography,
  IconButton,
  Avatar,
  Pagination,
  // Menu,
  // MenuItem,
} from '@mui/material'

//Api
import {
  // deleteManufacturer,
  getListManufacturers,
  postManufacturers,
} from './manufacturerAPI'
import { useAppDispatch } from 'src/store/hooks'
import { notificationActions } from 'src/store/notification/notificationSlice'

//model
import { ArrayItem, IListManufacturer } from './manufacturerModel'

// react-hook-form
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import { loadingActions } from 'src/store/loading/loadingSlice'
import UploadImage from 'src/components/uploadImage'

const Manufacturer: NextPageWithLayout = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  // state use for
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [listRows, setListRows] = useState<IListManufacturer>()
  const [rowsPerPage, setRowsPerPage] = useState(10)
  // const [valueMenu, setValueMenu] = useState<number | undefined>()

  //handle modal
  const handleOpen = () => setOpenModal(true)
  const handleClose = () => {
    setOpenModal(false)
    reset()
  }

  const {
    setValue,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  })

  // event submit
  const onSubmit = (values: any) => {
    const value = {
      ...values,
      logo: values.logo.toString(),
    }
    postManufacturers(value)
      .then(() => {
        dispatch(
          notificationActions.doNotification({
            message: 'success',
            type: 'success',
          })
        )
        setOpenModal(false)
        reset()
        router.replace({
          search: `${objToStringParam({
            ...router.query,
            limit: 10,
            page: 1,
          })}`,
        })
      })
      .catch(() => {
        dispatch(
          notificationActions.doNotification({
            message: 'error',
            type: 'error',
          })
        )
      })
  }

  //pagination
  const handleChangePagination = (e: any, page: number) => {
    console.log('e', e)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }
  // trigger when change row per page option ( page size )
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    const tableSize = parseInt(event.target.value)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: tableSize,
        page: 1,
      })}`,
    })
  }

  //Menu Delete and edit
  // const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  // const open = Boolean(anchorEl)
  // const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget)
  // }
  // const handleCloseMenu = () => {
  //   setAnchorEl(null)
  // }
  // const handleEdit = () => {
  //   // deleteManufacturer(valueMenu)
  //   console.log('edit', valueMenu)
  //   setAnchorEl(null)
  // }
  // const handleDelete = () => {
  //   deleteManufacturer(valueMenu)
  //     .then(() => {
  //       dispatch(
  //         notificationActions.doNotification({
  //           message: 'success',
  //           type: 'success',
  //         })
  //       )
  //     })
  //     .catch(() => {
  //       dispatch(
  //         notificationActions.doNotification({
  //           message: 'error',
  //           type: 'error',
  //         })
  //       )
  //     })
  //   setAnchorEl(null)
  // }

  useEffect(() => {
    if (!isEmptyObject(router.query)) {
      dispatch(loadingActions.doLoading())
      getListManufacturers(router.query)
        .then((res) => {
          const data = res.data
          setListRows(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((error: any) => {
          const data = error.response?.data
          console.log(data)
          setListRows(undefined)
          dispatch(loadingActions.doLoadingFailure())
          dispatch(
            notificationActions.doNotification({
              message: 'Something went wrongs with the server',
              type: 'error',
            })
          )
        })
    }
    if (router.asPath === '/manufacturer') {
      dispatch(loadingActions.doLoading())
      getListManufacturers({ page: 1 })
        .then((res) => {
          const data = res.data
          setListRows(data)
          dispatch(loadingActions.doLoadingSuccess())
          setRowsPerPage(10)
        })
        .catch(() => {
          dispatch(loadingActions.doLoadingFailure())
          dispatch(
            notificationActions.doNotification({
              message: 'Something went wrongs with the server',
              type: 'error',
            })
          )
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])
  return (
    <>
      <Head>
        <title>Manufaceturer | VAPE</title>
      </Head>
      <TypographyH2 variant="h2" mb={3}>
        Manufactures Management
      </TypographyH2>
      <Grid container spacing={2}>
        <Grid xs={10}>
          <form className={classes[`form-search`]}>
            <Controller
              control={control}
              name="content"
              render={({ field }) => (
                <>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      error={!!errors.content}
                      placeholder="Search by order no..."
                      {...field}
                    />
                  </FormControl>
                </>
              )}
            />
            <IconButton
              // type="submit"
              sx={{ p: '10px' }}
              className={classes[`form-search__button`]}
            >
              <MagnifyingGlass size={20} />
            </IconButton>
          </form>
        </Grid>
        <Grid xs={2}>
          <ButtonCustom
            variant="contained"
            onClick={handleOpen}
            sx={{ height: '100%', width: '100%' }}
          >
            Add New Manufacturer
          </ButtonCustom>
        </Grid>
      </Grid>
      <TableContainer
        component={Paper}
        elevation={0}
        style={{
          border: '1px solid #E1E6EF',
          marginBottom: '15px',
          marginTop: '35px',
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCellHeadingTextCustom align="center">
                No.
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom>Logo</TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom>Name</TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="right" width={30}>
                Acction
              </TableCellHeadingTextCustom>
            </TableRow>
          </TableHead>
          <TableBody>
            {listRows?.data?.map((row: ArrayItem, index: number) => {
              return (
                <StyledTableRow key={`item-${index}`}>
                  <TableCell width={200} align="center">
                    {index + 1}
                  </TableCell>
                  <TableCell width={200} align="center">
                    <Avatar
                      alt={row?.name}
                      src={`${row?.logo}`}
                      sx={{ width: 30, height: 30 }}
                    />
                  </TableCell>
                  <TableCell>{row?.name}</TableCell>
                  <TableCell align="center" width={30}>
                    <ButtonIconSetting
                    // onClick={(e) => {
                    //   handleOpenMenu(e)
                    //   setValueMenu(row?.id)
                    // }}
                    >
                      <Gear size={32} />
                    </ButtonIconSetting>
                  </TableCell>
                  {/* <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleCloseMenu}
                    transformOrigin={{
                      horizontal: 'right',
                      vertical: 'center',
                    }}
                    anchorOrigin={{ horizontal: 'left', vertical: 'center' }}
                  >
                    <MenuItem onClick={handleEdit}>Edit</MenuItem>
                    <MenuItem onClick={handleDelete}>Delete</MenuItem>
                  </Menu> */}
                </StyledTableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={2}
      >
        <Typography>Rows per page</Typography>
        <FormControl sx={{ m: 1 }}>
          <SelectCustom
            value={rowsPerPage.toString()}
            onChange={handleChangeRowsPerPage}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItemSelectCustom value={10}>10</MenuItemSelectCustom>
            <MenuItemSelectCustom value={20}>20</MenuItemSelectCustom>
            <MenuItemSelectCustom value={30}>30</MenuItemSelectCustom>
          </SelectCustom>
        </FormControl>
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          defaultPage={1}
          page={Number(router.query.page) ? Number(router.query.page) : 1}
          onChange={(e, page: number) => handleChangePagination(e, page)}
          count={listRows ? listRows?.totalPages : 0}
        />
      </Stack>
      <Modal open={openModal} onClose={handleClose}>
        <BoxModalCustom>
          <TypographyH2 variant="h2" mb={3}>
            Add New Manufactures
          </TypographyH2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2}>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <>
                    <InputLabelCustom htmlFor="text" error={!!errors.name}>
                      Name
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom error={!!errors.name} {...field} />
                      {errors.name && (
                        <FormHelperText error={!!errors.name}>
                          {errors.name && `${errors.name.message}`}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </>
                )}
              />
            </Box>
            <Box mb={2}>
              <InputLabelCustom htmlFor="text">Images</InputLabelCustom>
              <UploadImage
                onFileSelectSuccess={(file: string) => {
                  setValue('logo', [file])
                  trigger('logo')
                }}
                onFileSelectError={() => {
                  return
                }}
                onFileSelectDelete={() => {
                  setValue('logo', [''])
                  trigger('logo')
                }}
              />
            </Box>
            <Stack direction="row" justifyContent="center" p={2}>
              <ButtonCustom
                variant="contained"
                size="large"
                onClick={handleClose}
              >
                <Typography sx={{ color: 'black' }}>Cancel</Typography>
              </ButtonCustom>
              <ButtonCustom
                variant="contained"
                size="large"
                type="submit"
                sx={{ marginLeft: '10px' }}
              >
                summit
              </ButtonCustom>
            </Stack>
          </form>
        </BoxModalCustom>
      </Modal>
    </>
  )
}

Manufacturer.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Manufacturer
