/* eslint-disable jsx-a11y/alt-text */
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useEffect, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import classes from './styles.module.scss'
import { styled } from '@mui/system'
import {
  Typography,
  Paper,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  // Modal,
  // Stack,
  // Box,
  FormControl,
  // FormHelperText,
} from '@mui/material'
// import SettingsIcon from '@mui/icons-material/Settings'
import { MagnifyingGlass } from 'phosphor-react'
import SettingsIcon from '@mui/icons-material/Settings'
import { ButtonCustom, TextFieldCustom } from 'src/components'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { getListBrand } from './apiBrand'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { brandTypeData } from './brandModel'
import { Controller, useForm } from 'react-hook-form'
import { AddBrandType } from 'pages/create-product/addProductModel'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, schemaSearch } from './validations'
// import UploadImage from 'src/components/uploadImage'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { objToStringParam } from 'src/utils/global.utils'
import Link from 'next/link'

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))
const TableCellCustome = styled(TableCell)(() => ({
  '&.MuiTableCell-head': {
    width: '2%',
  },
}))
const TableCellNo = styled(TableCell)(() => ({
  '&.MuiTableCell-head': {
    width: '0.1%',
  },
}))
const TableCellLogo = styled(TableCell)(() => ({
  '&.MuiTableCell-head': {
    width: '0.3%',
  },
}))
const TableCellAction = styled(TableCell)(() => ({
  '&.MuiTableCell-head': {
    width: '0.3%',
  },
}))
const TableRowCustom = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.mode === 'dark' ? '#212125' : '#F8F9FC',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))
// const ModalBoxCustom = styled(Box)(({ theme }) => ({
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 600,
//   // background: '#FFF',
//   backgroundColor: theme.palette.mode === 'dark' ? '#212125' : '#fff',
//   borderRadius: '10px',
//   padding: '15px',
// }))
const TextFieldSearchCustom = styled(TextFieldCustom)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: '10px 45px 10px 15px',
    textOverflow: 'ellipsis',
    backgroundColor:
      theme.palette.mode === 'light' ? '#ffffff' : theme.palette.action.hover,
  },
}))
const Brand: NextPageWithLayout = () => {
  // const [stateOpenModal, setStateOpenModal] = React.useState(false)
  // const handleOpenModal = () => setStateOpenModal(true)
  // const handleCloseModal = () => setStateOpenModal(false)
  // // state use for list cata
  const [stateBrandList, setStateBrandList] = useState<brandTypeData[]>()
  const router = useRouter()
  const dispatch = useAppDispatch()

  // data call api
  useEffect(() => {
    dispatch(loadingActions.doLoading())
    getListBrand(router.query)
      .then((res) => {
        const { data } = res.data
        setStateBrandList(data)
        dispatch(loadingActions.doLoadingSuccess())
        console.log('data', data)
      })
      .catch((error: any) => {
        const data = error.response?.data
        console.log(data)
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: 'Something went wrongs with the server',
            type: 'error',
          })
        )
      })
  }, [dispatch, router.query])

  const {
    // control,
    // reset,
    // setValue,
    // trigger,
    // handleSubmit,
    formState: { errors },
  } = useForm<AddBrandType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  //search
  const { handleSubmit: handleSubmitSearch, control: controlSearch } = useForm({
    resolver: yupResolver(schemaSearch),
    mode: 'all',
  })

  const onSubmitSearch = (values: any) => {
    router.replace({
      search: `${objToStringParam({ name: values.name })}`,
    })
    console.log('value', values)
  }
  //
  //onSubmit create brand
  // const OnSubmitCreate = (values: AddBrandType) => {
  //   console.log('dataCreated', values)
  //   const CreateBrand: AddBrandType = {
  //     name: values.name,
  //     logo: values.logo,
  //   }
  //   dispatch(loadingActions.doLoading())
  //   addBrand(CreateBrand)
  //     .then(() => {
  //       dispatch(loadingActions.doLoadingSuccess())
  //       dispatch(
  //         notificationActions.doNotification({
  //           message: 'Success',
  //         })
  //       )
  //       reset()
  //       // console.log('dataAdd', addCategories)
  //       getListBrand(router.query)
  //         .then((res) => {
  //           const { data } = res.data
  //           setStateBrandList(data)
  //           dispatch(loadingActions.doLoadingSuccess())
  //           // console.log('data', data)
  //         })
  //         .catch((error: any) => {
  //           const data = error.response?.data
  //           console.log(data)
  //           dispatch(loadingActions.doLoadingFailure())
  //           dispatch(
  //             notificationActions.doNotification({
  //               message: 'Something went wrongs with the server',
  //               type: 'error',
  //             })
  //           )
  //         })

  //       handleCloseModal()
  //     })
  //     .catch(() => {
  //       dispatch(loadingActions.doLoadingFailure())
  //       dispatch(
  //         notificationActions.doNotification({
  //           message: 'Error',
  //           type: 'error',
  //         })
  //       )
  //     })
  //   console.log(values)
  // }

  return (
    <>
      <TypographyH2 variant="h2" sx={{ marginBottom: '15px' }}>
        Brand Management
      </TypographyH2>
      <Grid container spacing={2} sx={{ marginBottom: '15px' }}>
        <Grid xs={10}>
          <form
            onSubmit={handleSubmitSearch(onSubmitSearch)}
            className={classes[`form-search`]}
          >
            <Controller
              control={controlSearch}
              name="name"
              render={({ field }) => (
                <>
                  <FormControl fullWidth>
                    <TextFieldSearchCustom
                      id="name"
                      error={!!errors.name}
                      placeholder="Search Brand by name..."
                      {...field}
                    />
                  </FormControl>
                </>
              )}
            />
            <IconButton
              aria-label="Search"
              type="submit"
              className={classes[`form-search__button`]}
            >
              <MagnifyingGlass size={20} />
            </IconButton>
          </form>
        </Grid>
        <Grid xs={2}>
          <Link href="/create-brand">
            <ButtonCustom
              // onClick={handleOpenModal//
              variant="contained"
            >
              Add new brands
            </ButtonCustom>
          </Link>
        </Grid>
      </Grid>
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCellNo align="left">No</TableCellNo>
              <TableCellLogo align="left">Logo</TableCellLogo>
              <TableCellCustome align="left">Brand Name</TableCellCustome>
              <TableCellAction align="left">Acction</TableCellAction>
            </TableRow>
          </TableHead>

          <TableBody>
            {stateBrandList?.map((item, index) => {
              return (
                <React.Fragment key={item.id}>
                  <TableRowCustom>
                    <TableCellNo align="left">{index + 1}</TableCellNo>
                    <TableCellLogo align="left">
                      <Avatar alt="Remy Sharp" src={item.logo} />
                    </TableCellLogo>
                    <TableCellCustome align="left">
                      {item.name}
                    </TableCellCustome>
                    <TableCellAction align="left">
                      <SettingsIcon></SettingsIcon>
                    </TableCellAction>
                  </TableRowCustom>
                </React.Fragment>
              )
            })}

            {/* )
            })} */}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <Modal
        open={stateOpenModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalBoxCustom>
          <Stack direction="row" justifyContent="space-between">
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create new Brand
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <X size={24} />
            </IconButton>
          </Stack>

          <form onSubmit={handleSubmit(OnSubmitCreate)}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Box mb={2}>
                  <InputLabelCustom htmlFor="name" error={!!errors.name}>
                    Brand name
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <TextFieldCustom
                      id="name"
                      error={!!errors.name}
                      placeholder="Input other average monthly sale volume..."
                      {...field}
                    />
                    <FormHelperText error={!!errors.name}>
                      {errors.name && `${errors.name.message}`}
                    </FormHelperText>
                  </FormControl>
                  <Stack
                    spacing={1}
                    sx={{
                      background: 'white',
                      padding: '15px',
                      borderRadius: '10px',
                    }}
                  >
                    <Typography sx={{ width: '165px', textAlign: 'center' }}>
                      Add Images
                    </Typography>
                    <UploadImage
                      fileList={undefined}
                      onFileSelectSuccess={(file: string) => {
                        setValue('logo', file)
                        trigger('logo')
                      }}
                      onFileSelectError={() => {
                        return
                      }}
                      onFileSelectDelete={() => {
                        setValue('logo', '')
                        trigger('logo')
                      }}
                    />
                    {/* <CustomImageBox></CustomImageBox> */}
      {/* </Stack>
                </Box>
              )}
            />
            <ButtonCustom
              variant="contained"
              size="small"
              fullWidth
              type="submit"
            >
              Submit
            </ButtonCustom>
          </form>
        </ModalBoxCustom>
      </Modal> */}
    </>
  )
}
Brand.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Brand
