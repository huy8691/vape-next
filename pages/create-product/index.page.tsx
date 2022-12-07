import {
  Box,
  FormControl,
  FormHelperText,
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
  DropdownDataType,
  ProductBrandType,
  ProductCategoryType,
  ProductManufacturerType,
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
} from './apiAddProduct'
import { loadingActions } from 'src/store/loading/loadingSlice'

import { useAppDispatch } from 'src/store/hooks'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { hasSpecialCharacter } from 'src/utils/global.utils'

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

const temporaryArray: DropdownDataType[] = [
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
  const [stateParentCategorySelected, setStateParentCategorySelected] =
    useState<number>()
  const [stateListCategory, setStateListCategory] =
    useState<ProductCategoryType[]>()
  const [stateListBrand, setStateListBrand] = useState<ProductBrandType[]>()
  const [stateListManufacturer, setStateListManufacturer] =
    useState<ProductManufacturerType[]>()

  // const router = useRouter()
  const dispatch = useAppDispatch()
  // const [stateParentCategorySelected, setStateParentCategorySelected] =
  //   useState<DropdownDataType>()

  // react-hook-form
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    register,
    formState: { errors },
  } = useForm<AddFormInput>({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const onSubmit = (values: AddFormInput) => {
    console.log('here', values)
    let addProduct: AddFormInput = {
      name: values.name,
      brand: values.brand,
      manufacturer: values.manufacturer,
      unit_type: values.unit_type,
      category: values.category,
      longDescription: values.longDescription,
      price: values.price,
      description: values.description,
      thumbnail:
        'https://develop-bizbookly.s3.ap-southeast-1.amazonaws.com/images/2022/8/9/Combo_91__36775.png',
    }
    dispatch(loadingActions.doLoading())
    CreateProductApi(addProduct)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: 'Successfully',
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
  }

  useEffect(() => {
    register('longDescription', { required: true, minLength: 11 })
  })

  const editorContent = watch('longDescription')
  const onEditorStateChange = (value: string) => {
    // console.log(value)
    setValue('longDescription', value)
    console.log(getValues('longDescription'))
  }

  // // fix error when use next theme
  // const [mounted, setMounted] = useState(false)
  // useEffect(() => {
  //   setMounted(true)
  // }, [])
  // if (!mounted) {
  //   return null
  // }
  // fix error when use next theme
  useEffect(() => {
    // dispatch(loadingActions.doLoading())
    getProductCategory()
      .then((res) => {
        const { data } = res.data
        setStateListCategory(data)
      })
      .catch((error) => {})
    getProductBrand()
      .then((res) => {
        const { data } = res.data
        setStateListBrand(data)
      })
      .catch((error) => {})
    getProductManufacturer()
      .then((res) => {
        const { data } = res.data
        setStateListManufacturer(data)
      })
      .catch((error) => {})
  }, [])

  return (
    <>
      <TypographyH2 variant="h2" sx={{ textAlign: 'center' }} mb={4}>
        Add new product
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
            <CustomImageBox>
              <Box>Choose a image</Box>
            </CustomImageBox>
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
                      <InputLabelCustom
                        htmlFor="product_name"
                        error={!!errors.name}
                      >
                        Product name
                      </InputLabelCustom>
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
                      <InputLabelCustom htmlFor="brand" error={!!errors.brand}>
                        Brand
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="brannd"
                          displayEmpty
                          defaultValue=""
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>Select value</div>
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
                      <InputLabelCustom
                        htmlFor="manufacturer"
                        error={!!errors.manufacturer}
                      >
                        Manufacturer
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <SelectCustom
                          id="manufacturer"
                          displayEmpty
                          IconComponent={() => <KeyboardArrowDownIcon />}
                          renderValue={(value: any) => {
                            if (value === '') {
                              return (
                                <PlaceholderSelect>
                                  <div>Select value</div>
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
                                  <div>Select value</div>
                                </PlaceholderSelect>
                              )
                            }
                            return temporaryArray?.find(
                              (obj) => obj.name === value
                            )?.name
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('unit_type', event.target.value)
                          }}
                        >
                          {temporaryArray?.map((item, index) => {
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
                          htmlFor="parent_category"
                          error={!!errors.category}
                        >
                          Parent category
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <SelectCustom
                            id="parent_category"
                            displayEmpty
                            IconComponent={() => <KeyboardArrowDownIcon />}
                            renderValue={(value: any) => {
                              if (value === '') {
                                return (
                                  <PlaceholderSelect>
                                    <div>Select value</div>
                                  </PlaceholderSelect>
                                )
                              }
                              return stateListCategory?.find(
                                (obj) => obj.id === value
                              )?.name
                            }}
                            {...field}
                            onChange={(event: any) => {
                              setValue('category', event.target.value)
                              // setStateParentCategorySelected(
                              //   getValues('category')
                              // )
                              // trigger('monthly_purchase')
                            }}
                          >
                            {stateListCategory?.map((item, index) => {
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
                          <FormHelperText error={!!errors.category}>
                            {errors.category && `${errors.category.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
              </Grid>
              <Grid xs={6}>
                {/* <Box>
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
                            // disable={}
                            disabled={
                              stateParentCategorySelected ? false : true
                            }
                            IconComponent={() => <KeyboardArrowDownIcon />}
                            renderValue={(value: any) => {
                              if (value === '') {
                                return (
                                  <PlaceholderSelect>
                                    <div>Select value</div>
                                  </PlaceholderSelect>
                                )
                              }
                              return temporaryArray?.find(
                                (obj) => obj.id === value
                              )?.name
                            }}
                            {...field}
                            onChange={(event: any) => {
                              setValue('category', event.target.value)
                            }}
                          >
                            {temporaryArray?.map((item, index) => {
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
                          <FormHelperText error={!!errors.category}>
                            {errors.category && `${errors.category.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box> */}
              </Grid>
            </Grid>
          </CustomBox>
          <CustomBox>
            <Grid container columnSpacing={3}>
              <Grid xs={4}>
                <Box>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="description"
                          error={!!errors.description}
                        >
                          Short description
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="description"
                            multiline
                            minRows={5}
                            placeholder="Enter short description"
                            error={!!errors.description}
                            {...field}
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
              <Grid xs={8}>
                <Box>
                  <Controller
                    control={control}
                    name="longDescription"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="longDescription"
                          error={!!errors.longDescription}
                        >
                          Overview
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <ReactQuill
                            theme="snow"
                            value={editorContent}
                            onChange={onEditorStateChange}
                          />
                          <FormHelperText error={!!errors.longDescription}>
                            {errors.longDescription &&
                              `${errors.longDescription.message}`}
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
    </>
  )
}

CreateProduct.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default CreateProduct
