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
  Modal,
  Stack,
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
const ModalBoxCustom = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  background: '#FFF',
  borderRadius: '10px',
  padding: '15px',
}))
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
      <TypographyH2>Categories Management</TypographyH2>
      <Grid container spacing={2}>
        <Grid xs={4}>
          <ButtonCustom onClick={handleOpenModal} variant="contained" fullWidth>
            Add new categories
          </ButtonCustom>
        </Grid>
      </Grid>

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