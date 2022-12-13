/* eslint-disable jsx-a11y/alt-text */
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useEffect, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'

import { styled } from '@mui/system'
import {
  Typography,
  Paper,
  InputBase,
  IconButton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Modal,
  Stack,
  Box,
  FormControl,
  FormHelperText,
} from '@mui/material'
// import SettingsIcon from '@mui/icons-material/Settings'
import { X } from 'phosphor-react'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'
import { ButtonCustom, InputLabelCustom, TextFieldCustom } from 'src/components'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import getListBrand from './apiBrand'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { brandTypeData } from './brandModel'
import { Controller, useForm } from 'react-hook-form'
import { AddBrandType } from 'pages/create-product/addProductModel'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import UploadImage from 'src/components/uploadImage'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

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
const ModalBoxCustom = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  // background: '#FFF',
  backgroundColor: theme.palette.mode === 'dark' ? '#212125' : '#fff',
  borderRadius: '10px',
  padding: '15px',
}))

const Brand: NextPageWithLayout = () => {
  const [stateOpenModal, setStateOpenModal] = React.useState(false)
  const handleOpenModal = () => setStateOpenModal(true)
  const handleCloseModal = () => setStateOpenModal(false)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    control,
    // handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<AddBrandType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  return (
    <>
      <TypographyH2 variant="h2" sx={{ marginBottom: '15px' }}>
        Categories Management
      </TypographyH2>
      <Grid container spacing={2} sx={{ marginBottom: '15px' }}>
        <Grid xs={10}>
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #E1E6EF',
              borderRadius: '8px',
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search by category name"
              inputProps={{ 'aria-label': 'search google maps' }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        <Grid xs={2}>
          <ButtonCustom
            onClick={handleOpenModal}
            variant="contained"
            fullWidth
            style={{ height: '100%' }}
          >
            Add new categories
          </ButtonCustom>
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
                <>
                  <TableRowCustom key={item.id}>
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
                </>
              )
            })}

            {/* )
            })} */}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
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

          {/* <form onSubmit={handleSubmit(OnSubmit)}> */}
          <form>
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
                  </Stack>
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
      </Modal>
    </>
  )
}
Brand.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Brand
