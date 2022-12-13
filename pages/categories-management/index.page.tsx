import React, { ReactElement, useEffect, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { styled } from '@mui/system'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { NextPageWithLayout } from 'pages/_app.page'
import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,

  // Popover,
  // Box,
  // Stack,
  // Modal,
  // IconButton,
  // Collapse,
} from '@mui/material'

// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// import Checkbox from '@mui/material/Checkbox'
import SettingsIcon from '@mui/icons-material/Settings'
import SearchIcon from '@mui/icons-material/Search'

import { AddCategoryType, categoryTypeData } from './modelProductCategories'
import { useRouter } from 'next/router'
import { addCategories, getListCategories } from './apiCategories'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import {
  ButtonCustom,
  InputLabelCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
} from 'src/components'

import { X } from 'phosphor-react'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
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
const TableCellCustome = styled(TableCell)(() => ({
  '&.MuiTableCell-body': {
    width: '33.3%',
  },
}))
const TableCellPadding = styled(TableCell)(() => ({
  '&.MuiTableCell-body': {
    padding: '0',
    width: '33.3%',
  },
}))
const TableCellCustomeChild = styled(TableCell)(() => ({
  '&.MuiTableCell-body': {
    padding: '0 0 0 64px',
    width: '33.3%',
  },
}))
const IconSetting = styled(SettingsIcon)(({ theme }) => ({
  '&.MuiSvgIcon-fontSizeMedium': {
    color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
  },
}))
// const TableCellBodyTextCustom = styled(TableCell)(({ theme }) => ({
//   fontSize: '1.4rem',
//   fontWeight: 500,
//   color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
// }))
// const TableCellCustomeHeadingTextCustom = styled(TableCellCustome)(({ theme }) => ({
//   fontSize: '1.4rem',
//   fontWeight: 400,
//   color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
// }))

const SupplierCategories: NextPageWithLayout = () => {
  // const [showModalChild, setShowModalChild] = useState(false)
  const [stateOpenModal, setStateOpenModal] = React.useState(false)
  const handleOpenModal = () => setStateOpenModal(true)
  const handleCloseModal = () => setStateOpenModal(false)
  // state use for list cata
  const [stateCategoryList, setStateCategoryList] =
    useState<categoryTypeData[]>()
  const router = useRouter()
  const dispatch = useAppDispatch()

  // data call api
  useEffect(() => {
    dispatch(loadingActions.doLoading())
    getListCategories(router.query)
      .then((res) => {
        const { data } = res.data
        setStateCategoryList(data)
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
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AddCategoryType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  // const {
  //   control: controlSearch,
  //   handleSubmit: handleSubmitSearch,
  //   setValue: setValueSearch,
  //   formState: { errors: errorsSearch },
  // } = useForm({
  //   resolver: yupResolver(schema),
  //   mode: 'all',
  // })

  const OnSubmit = (values: AddCategoryType) => {
    const createCategory: AddCategoryType = {
      name: values.name,
      parent_category: values.parent_category,
    }
    dispatch(loadingActions.doLoading())
    addCategories(createCategory)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: 'Success',
          })
        )
        getListCategories(router.query)
          .then((res) => {
            const { data } = res.data
            setStateCategoryList(data)
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
        handleCloseModal()
      })
      .catch(() => {
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: 'Error',
            type: 'error',
          })
        )
      })
    console.log(values)
  }

  return (
    <>
      <TypographyH2 sx={{ marginBottom: '15px' }}>
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
              <TableCellCustome align="left">Category Name</TableCellCustome>
              <TableCellCustome align="center">Acction</TableCellCustome>
            </TableRow>
          </TableHead>

          <TableBody>
            {stateCategoryList?.map((item) => {
              return (
                <>
                  <TableRowCustom key={item.id}>
                    {/* <TableCellCustome>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        key={item.id}
                        onClick={() => handleShowChild(item)}
                      >
                        {open && item.id === idCheck ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCellCustome> */}
                    <TableCellCustome align="left">
                      {item.name}
                    </TableCellCustome>
                    <TableCellCustome align="center">
                      {/* <Button onClick={(e) => handleShowPopover(e, item)}> */}

                      <IconSetting />
                    </TableCellCustome>
                  </TableRowCustom>
                  {item.child_category.length > 0 && (
                    <>
                      <TableRow>
                        <TableCellPadding colSpan={2}>
                          <Table size="small" aria-label="purchases">
                            <TableBody>
                              {item.child_category.map((dataChild) => {
                                console.log('dataChild: ', dataChild)
                                return (
                                  <>
                                    <TableRowCustom key={dataChild.id}>
                                      <TableCellCustomeChild align="left">
                                        {dataChild.name}
                                      </TableCellCustomeChild>

                                      <TableCellCustome align="center">
                                        <IconSetting />
                                      </TableCellCustome>
                                    </TableRowCustom>
                                  </>
                                )
                              })}
                              {/* ))} */}
                            </TableBody>
                          </Table>
                        </TableCellPadding>
                      </TableRow>
                    </>
                  )}
                </>
              )
            })}
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
              Create new Categories
            </Typography>
            <IconButton onClick={handleCloseModal}>
              <X size={24} />
            </IconButton>
          </Stack>

          <form onSubmit={handleSubmit(OnSubmit)}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Box mb={2}>
                  <InputLabelCustom htmlFor="name" error={!!errors.name}>
                    Category name
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
                </Box>
              )}
            />
            <Controller
              control={control}
              name="parent_category"
              render={({ field }) => (
                <Box mb={2}>
                  <InputLabelCustom
                    htmlFor="parent_category"
                    error={!!errors.parent_category}
                  >
                    Parent Category (if have)
                  </InputLabelCustom>
                  <FormControl fullWidth>
                    <SelectCustom
                      id="parent_category"
                      displayEmpty
                      defaultValue=""
                      IconComponent={() => <KeyboardArrowDownIcon />}
                      renderValue={(value: any) => {
                        if (value === '') {
                          return (
                            <PlaceholderSelect>
                              <div> Select category </div>
                            </PlaceholderSelect>
                          )
                        }
                        return stateCategoryList?.find(
                          (obj) => obj.id === value
                        )?.name
                      }}
                      {...field}
                      onChange={(event: any) => {
                        setValue('parent_category', event.target.value)
                        // trigger('monthly_purchase')
                      }}
                    >
                      {stateCategoryList?.map((item, index) => {
                        return (
                          <MenuItemSelectCustom
                            value={item.id}
                            key={index + Math.random()}
                          >
                            {item.name}
                          </MenuItemSelectCustom>
                        )
                      })}
                    </SelectCustom>
                    <FormHelperText error={!!errors.parent_category}>
                      {errors.parent_category &&
                        ` ${errors.parent_category.message} `}
                    </FormHelperText>
                  </FormControl>
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

SupplierCategories.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default SupplierCategories
