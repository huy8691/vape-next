import {
  Box,
  FormControl,
  FormHelperText,
  IconButton,
  ListSubheader,
  Stack,
  Typography,
} from '@mui/material'
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useEffect, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { styled } from '@mui/system'
import {
  ButtonCustom,
  InputLabelCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
} from 'src/components'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Grid from '@mui/material/Unstable_Grid2/Grid2'

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'
// style
import classes from './styles.module.scss'
import {
  AddFormInput,
  CreateProductDataType,
  DropdownDataType,
  OrganizationType,
  ProductBrandType,
  ProductCategoryType,
  ProductManufacturerType,
  WarehouseType,
} from './addProductModel'

//react-quill
// import ReactQuill from 'react-quill'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'
import {
  CreateProductApi,
  getProductBrand,
  getProductCategory,
  getProductManufacturer,
  getWareHouse,
  getOrganization,
} from './apiAddProduct'
import { loadingActions } from 'src/store/loading/loadingSlice'

import { useAppDispatch } from 'src/store/hooks'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { hasSpecialCharacter } from 'src/utils/global.utils'
import ModalAddNewBrand from './parts/ModalAddNewBrand'
import ModalAddManufacturer from './parts/ModalAddManufacturer'
// import ModalAddNewBrand from './parts/ModalAddNewBrand'

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '3.2rem',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#1B1F27',
}))
const CustomBox = styled(Box)(() => ({
  padding: '15px',
  background: '#FFFF',
  borderRadius: '10px',
}))

const CustomStack = styled(Stack)(() => ({
  background: '#F8F9FC',
  padding: '15px',
  borderRadius: '10px',
}))

const CustomImageBox = styled(Box)(() => ({
  paddingBottom: '100%',
  border: '1px dashed #BABABA',
  background: '#F1F3F9',
  borderRadius: '10px',
}))

const IconButtonCustom = styled(IconButton)(({ theme }) => ({
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.23)'
      : '1px solid #E1E6EF',
  borderRadius: '10px',
  padding: '5px',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#fff',
  marginBottom: '5px',
  marginLeft: '10px',
  '& span': {
    fontSize: '1.6rem',
    color:
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : '#49516F',
  },
}))

const unitTypeArray: DropdownDataType[] = [
  {
    id: 1,
    name: 'UNIT',
  },
  {
    id: 2,
    name: 'PACKAGE',
  },
]

const CreateProduct: NextPageWithLayout = () => {
  // const [stateParentCategorySelected, setStateParentCategorySelected] =
  //   useState<number>()
  const [stateListCategory, setStateListCategory] =
    useState<ProductCategoryType[]>()
  const [stateListBrand, setStateListBrand] = useState<ProductBrandType[]>()
  const [stateListManufacturer, setStateListManufacturer] =
    useState<ProductManufacturerType[]>()
  const [stateOpenModalAddBrand, setStateOpenModalAddBrand] = useState(false)
  const [stateOpenModalManufacturer, setStateOpenModalManufacturer] =
    useState(false)
  const [stateListWarehouse, setStateListWarehouse] =
    useState<WarehouseType[]>()
  const [stateOrganization, setStateOrganization] =
    useState<OrganizationType[]>()
  const handleCloseModalAddBrand = () => setStateOpenModalAddBrand(false)
  const handleOpenModalAddBrand = () => setStateOpenModalAddBrand(true)
  const handleCloseModalAddManufacturer = () =>
    setStateOpenModalManufacturer(false)
  const handleOpenModalAddManufacturer = () =>
    setStateOpenModalManufacturer(true)

  // const router = useRouter()
  const dispatch = useAppDispatch()

  // react-hook-form
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    register,
    reset,
    formState: { errors },
  } = useForm<AddFormInput>({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  // const {
  //   handleSubmit: handleSubmitBrand,
  //   control: brandControl,
  //   formState: { errors: errorsBrand },
  // } = useForm<AddBrandType>({
  //   resolver: yupResolver(brandSchema),
  //   mode: 'all',
  // })

  const onSubmit = (values: AddFormInput) => {
    console.log('here', values)

    const addProduct: CreateProductDataType = {
      name: values.name,
      brand: values.brand,
      manufacturer: values.manufacturer,
      unit_type: values.unit_type,
      description: values.description,
      price: values.price,
      quantity: values.quantity,
      category: values.category,
      thumbnail:
        'https://develop-bizbookly.s3.ap-southeast-1.amazonaws.com/images/2022/8/9/Combo_91__36775.png',
      warehouse: stateListWarehouse ? stateListWarehouse[0].id : 0,
      distribution_channel: stateOrganization ? stateOrganization[0].id : 0,
    }
    console.log(
      '🚀 ~ file: index.page.tsx:140 ~ onSubmit ~ addProduct',
      addProduct
    )

    dispatch(loadingActions.doLoading())
    CreateProductApi(addProduct)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: 'Successfully',
          })
        )
        reset()
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
  }
  // const onSubmitBrand = (values: AddBrandType) => {
  //   console.log(values)
  //   const addBrand: AddBrandType = {
  //     name: values.name,
  //     logo: 'https://vape-test.s3.ap-southeast-1.amazonaws.com/images/2022/9/23/767445.png',
  //   }
  //   dispatch(loadingActions.doLoading())

  //   createBrand(addBrand)
  //     .then(() => {
  //       dispatch(loadingActions.doLoadingSuccess())
  //       dispatch(
  //         notificationActions.doNotification({
  //           message: 'Successfully',
  //         })
  //       )

  //       getProductBrand()
  //         .then((res) => {
  //           const { data } = res.data
  //           setStateListBrand(data)
  //         })
  //         .catch((error) => {
  //           console.log(error)
  //           dispatch(
  //             notificationActions.doNotification({
  //               message: 'Error',
  //               type: 'error',
  //             })
  //           )
  //         })
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
  // }

  useEffect(() => {
    getWareHouse()
      .then((res) => {
        const { data } = res.data
        setStateListWarehouse(data)
        // console.log(data)
        dispatch(
          notificationActions.doNotification({
            message: 'Success',
          })
        )
      })
      .catch(() => {
        dispatch(
          notificationActions.doNotification({
            message: 'Error',
            type: 'error',
          })
        )
      })
    getOrganization()
      .then((res) => {
        const { data } = res.data
        setStateOrganization(data)
        console.log(data)
        dispatch(
          notificationActions.doNotification({
            message: 'Success',
          })
        )
      })
      .catch(() => {
        dispatch(
          notificationActions.doNotification({
            message: 'Error',
            type: 'error',
          })
        )
      })

    register('description', { required: true, minLength: 11 })
  }, [])

  const editorContent = watch('description')
  const onEditorStateChange = (value: string) => {
    // console.log(value)
    setValue('description', value)
    console.log(getValues('description'))
  }

  useEffect(() => {
    // dispatch(loadingActions.doLoading())

    getProductCategory()
      .then((res) => {
        const { data } = res.data
        setStateListCategory(data)
      })
      .catch((error) => {
        console.log(error)
        dispatch(
          notificationActions.doNotification({
            message: 'Error',
            type: 'error',
          })
        )
      })
    getProductBrand()
      .then((res) => {
        const { data } = res.data
        setStateListBrand(data)
      })
      .catch((error) => {
        console.log(error)
        dispatch(
          notificationActions.doNotification({
            message: 'Error',
            type: 'error',
          })
        )
      })
    getProductManufacturer()
      .then((res) => {
        const { data } = res.data
        setStateListManufacturer(data)
      })
      .catch((error) => {
        console.log(error)
        dispatch(
          notificationActions.doNotification({
            message: 'Error',
            type: 'error',
          })
        )
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // const renderDOM = () => {
  //   let array = []
  //   const cloneData = JSON.parse(JSON.stringify(stateListCategory))
  //   cloneData.forEach((item: any) => {
  //     if (item.child_category.length > 0) {
  //       array.push({
  //         item,
  //       })
  //     }
  //     if (item.parent_category) {
  //       array.push({
  //         parent_category: {
  //           id: 22,
  //           name: 'Cape',
  //         },
  //       })
  //     }
  //   })
  // }

  return (
    <>
      <TypographyH2 variant="h2" sx={{ textAlign: 'center' }} mb={4}>
        Create
      </TypographyH2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomStack direction="row" spacing={2}>
          <Stack
            spacing={1}
            sx={{ background: 'white', padding: '15px', borderRadius: '10px' }}
          >
            <Typography sx={{ width: '165px' }}>
              {' '}
              Add Thumbnail Product
            </Typography>
            <CustomImageBox></CustomImageBox>
          </Stack>
          <Stack
            spacing={1}
            sx={{ background: 'white', padding: '15px', borderRadius: '10px' }}
          >
            <Typography sx={{ width: '165px', textAlign: 'center' }}>
              Add Product Images
            </Typography>
            <CustomImageBox></CustomImageBox>
          </Stack>
        </CustomStack>
        <CustomStack spacing={2}>
          <CustomBox>
            <Grid container columnSpacing={3} rowSpacing={2}>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <>
                      <Stack direction="row" alignItems="center" height={38}>
                        <InputLabelCustom
                          htmlFor="product_name"
                          error={!!errors.name}
                        >
                          Product name
                        </InputLabelCustom>
                      </Stack>

                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="product_name"
                          placeholder="Enter product name"
                          error={!!errors.name}
                          {...field}
                        />
                        <FormHelperText error={!!errors.name}>
                          {errors.name && `${errors.name.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="brand"
                  render={({ field }) => (
                    <>
                      <Stack direction="row" alignItems="center">
                        <InputLabelCustom
                          htmlFor="brand"
                          error={!!errors.brand}
                        >
                          Brand
                        </InputLabelCustom>

                        <IconButtonCustom onClick={handleOpenModalAddBrand}>
                          <span className="icon-icon-edit"></span>
                        </IconButtonCustom>
                      </Stack>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="brand"
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>Select brand</div>
                                </PlaceholderSelect>
                              )
                            }
                            return stateListBrand?.find(
                              (obj) => obj.id === value
                            )?.name
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('brand', event.target.value)
                            // trigger('monthly_purchase')
                          }}
                        >
                          {stateListBrand?.map((item, index) => {
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
                        <FormHelperText error={!!errors.brand}>
                          {errors.brand && `${errors.brand.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="manufacturer"
                  render={({ field }) => (
                    <>
                      <Stack direction="row">
                        <InputLabelCustom
                          htmlFor="manufacturer"
                          error={!!errors.manufacturer}
                        >
                          Manufacturer
                        </InputLabelCustom>

                        <IconButtonCustom
                          onClick={handleOpenModalAddManufacturer}
                        >
                          <span className="icon-icon-edit"></span>
                        </IconButtonCustom>
                      </Stack>

                      <FormControl fullWidth>
                        <SelectCustom
                          id="manufacturer"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>Select manufacturer</div>
                                </PlaceholderSelect>
                              )
                            }
                            return stateListManufacturer?.find(
                              (obj) => obj.id === value
                            )?.name
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('manufacturer', event.target.value)
                            // trigger('monthly_purchase')
                          }}
                        >
                          {stateListManufacturer?.map((item, index) => {
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
                        <FormHelperText error={!!errors.manufacturer}>
                          {errors.manufacturer &&
                            `${errors.manufacturer.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="unit_type"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="unit_type"
                        error={!!errors.unit_type}
                      >
                        Unit type
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="unit_type"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>Select unit type</div>
                                </PlaceholderSelect>
                              )
                            }
                            return unitTypeArray?.find(
                              (obj) => obj.name === value
                            )?.name
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('unit_type', event.target.value)
                          }}
                        >
                          {unitTypeArray?.map((item, index) => {
                            return (
                              <MenuItemSelectCustom
                                value={item.name}
                                key={index + Math.random()}
                              >
                                {item.name}
                              </MenuItemSelectCustom>
                            )
                          })}
                        </SelectCustom>
                        <FormHelperText error={!!errors.unit_type}>
                          {errors.unit_type && `${errors.unit_type.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="quantity"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="quantity"
                        error={!!errors.price}
                      >
                        Quantity
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="quantity"
                          placeholder="Enter quantity"
                          type="number"
                          error={!!errors.price}
                          className={classes['input-number']}
                          onKeyPress={(event) => {
                            if (hasSpecialCharacter(event.key)) {
                              event.preventDefault()
                            }
                          }}
                          {...field}
                        />
                        <FormHelperText error={!!errors.quantity}>
                          {errors.quantity && `${errors.quantity.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
              <Grid xs={6}>
                <Controller
                  control={control}
                  name="price"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom htmlFor="price" error={!!errors.price}>
                        Price
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="price"
                          placeholder="Enter price"
                          type="number"
                          error={!!errors.price}
                          className={classes['input-number']}
                          onKeyPress={(event) => {
                            if (hasSpecialCharacter(event.key)) {
                              event.preventDefault()
                            }
                          }}
                          {...field}
                        />
                        <FormHelperText error={!!errors.price}>
                          {errors.price && `${errors.price.message}`}
                        </FormHelperText>
                      </FormControl>
                    </>
                  )}
                />
              </Grid>
            </Grid>
          </CustomBox>
          <CustomBox>
            <Grid container columnSpacing={3}>
              <Grid xs={6}>
                <Box>
                  <Controller
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="category"
                          error={!!errors.category}
                        >
                          Category
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <SelectCustom
                            id="category"
                            displayEmpty
                            IconComponent={() => <KeyboardArrowDownIcon />}
                            {...field}
                            onChange={(event: any) => {
                              setValue('category', event.target.value)
                            }}
                          >
                            {stateListCategory?.map((item, index) => {
                              if (item.child_category.length > 0) {
                                const listChild = item.child_category.map(
                                  (childItem) => {
                                    return (
                                      <MenuItemSelectCustom
                                        value={childItem.id}
                                        key={index + Math.random()}
                                        sx={{ marginLeft: '15px' }}
                                      >
                                        {childItem.name}
                                      </MenuItemSelectCustom>
                                    )
                                  }
                                )
                                return [
                                  <ListSubheader
                                    key={index + Math.random()}
                                    sx={{ fontStyle: 'italic' }}
                                  >
                                    {item.name}
                                  </ListSubheader>,
                                  listChild,
                                ]
                              }
                              if (
                                item.child_category.length === 0 &&
                                !item.parent_category
                              ) {
                                return (
                                  <MenuItemSelectCustom
                                    value={item.id}
                                    key={index + Math.random()}
                                  >
                                    {item.name}
                                  </MenuItemSelectCustom>
                                )
                              }
                            })}
                          </SelectCustom>
                          <FormHelperText error={!!errors.category}>
                            {errors.category && `${errors.category.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
              </Grid>
            </Grid>
          </CustomBox>
          <CustomBox>
            <Grid container columnSpacing={3}>
              <Grid xs={12}>
                <Box>
                  <Controller
                    control={control}
                    name="description"
                    render={() => (
                      <>
                        <InputLabelCustom
                          htmlFor="description"
                          error={!!errors.description}
                        >
                          Overview
                        </InputLabelCustom>
                        <FormControl
                          fullWidth
                          style={{
                            height: '300px',
                          }}
                        >
                          <ReactQuill
                            style={{ height: 'calc(100% - 42px)' }}
                            theme="snow"
                            value={editorContent}
                            onChange={onEditorStateChange}
                          />
                          <FormHelperText error={!!errors.description}>
                            {errors.description &&
                              `${errors.description.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
              </Grid>
              <Grid xs={12}></Grid>
            </Grid>
          </CustomBox>
          <Box display="flex" justifyContent="flex-end">
            <ButtonCustom variant="contained" size="large" type="submit">
              Submit
            </ButtonCustom>
          </Box>
        </CustomStack>
      </form>

      <ModalAddNewBrand
        openBrandModal={stateOpenModalAddBrand}
        handleClose={handleCloseModalAddBrand}
        handleSetStateBrand={setStateListBrand}
      ></ModalAddNewBrand>
      <ModalAddManufacturer
        openManufacturer={stateOpenModalManufacturer}
        handleClose={handleCloseModalAddManufacturer}
        handleSetStateManufacturer={setStateListManufacturer}
      ></ModalAddManufacturer>
    </>
  )
}

CreateProduct.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default CreateProduct
