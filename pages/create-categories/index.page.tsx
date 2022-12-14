import React, { ReactElement, useEffect, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { NextPageWithLayout } from 'pages/_app.page'
import {
  Box,
  FormControl,
  FormHelperText,
  Typography,
  Grid,
} from '@mui/material'
import {
  ButtonCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
  InputLabelCustom,
} from 'src/components'
import { Controller, useForm } from 'react-hook-form'
import {
  addCategories,
  getListCategories,
} from 'pages/categories-management/apiCategories'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { useRouter } from 'next/router'
import {
  AddCategoryType,
  categoryTypeData,
} from 'pages/categories-management/modelProductCategories'
import { useAppDispatch } from 'src/store/hooks'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
import { notificationActions } from 'src/store/notification/notificationSlice'
import Link from 'next/link'

const CreateCategories: NextPageWithLayout = () => {
  // const [stateOpenModal, setStateOpenModal] = React.useState(false)
  // const handleOpenModal = () => setStateOpenModal(true)
  // const handleCloseModal = () => {
  //   reset()
  //   setStateOpenModal(false)
  // }
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
  }, [dispatch, router.query])

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCategoryType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  //
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
        reset()
        // console.log('dataAdd', addCategories)
        getListCategories(router.query)
          .then((res) => {
            const { data } = res.data
            setStateCategoryList(data)
            dispatch(loadingActions.doLoadingSuccess())
            // console.log('data', data)
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
      <Typography variant="h4" mb={2}>
        Create New Product Catenogy
      </Typography>
      <Typography mb={4}>
        <Link href="/categories-management">Product Catenogy </Link>
        {'>'} Create New Product Catenogy
      </Typography>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={6}>
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
          </Grid>
          <Grid item xs={12}>
            <Grid
              container
              rowSpacing={1}
              columnSpacing={{ xs: 1, sm: 2, md: 3 }}
            >
              <Grid item xs={2}>
                <Link href="/categories-management">
                  <ButtonCustom
                    variant="contained"
                    size="large"
                    fullWidth
                    style={{ backgroundColor: ' #BABABA' }}
                  >
                    Cancel
                  </ButtonCustom>
                </Link>
              </Grid>
              <Grid item xs={2}>
                <ButtonCustom
                  variant="contained"
                  size="large"
                  fullWidth
                  type="submit"
                >
                  Submit
                </ButtonCustom>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
      {/* <Grid item xs={6}>

      </Grid>
      <Grid item xs={6}>
        <Item>4</Item>
      </Grid> */}
    </>
  )
}

CreateCategories.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default CreateCategories
