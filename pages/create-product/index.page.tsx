import {
  Box,
  FormControl,
  FormHelperText,
  InputAdornment,

  // IconButton,
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
  // ItemProduct,
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
  // AddFormInput,
  CreateProductDataType,
  DistributionType,
  // DistributionType,
  DropdownDataType,
  ProductBrandType,
  ProductCategoryType,
  ProductManufacturerType,
  WarehouseType,
  // WarehouseType,
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
  getDistribution,
} from './apiAddProduct'
import { loadingActions } from 'src/store/loading/loadingSlice'

import { useAppDispatch } from 'src/store/hooks'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { hasSpecialCharacter } from 'src/utils/global.utils'
// import ModalAddNewBrand from './parts/ModalAddNewBrand'
// import ModalAddManufacturer from './parts/ModalAddManufacturer'
import UploadImage from 'src/components/uploadImage'
import UploadList from 'src/components/uploadList'
// import ModalAddNewBrand from './parts/ModalAddNewBrand'

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2.4rem',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#1B1F27',
}))
const CustomBox = styled(Box)(({ theme }) => ({
  padding: '15px',
  background: '#FFFF',
  borderRadius: '10px',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.12)' : '#fff',
}))

const CustomStack = styled(Stack)(({ theme }) => ({
  // background: '#F8F9FC',
  padding: '15px',
  borderRadius: '10px',
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
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
  const [stateListWarehouse, setStateListWarehouse] = useState<WarehouseType[]>(
    []
  )
  const [stateListDistribution, setStateListDistribution] = useState<
    DistributionType[]
  >([])

  // const router = useRouter()
  const dispatch = useAppDispatch()

  // react-hook-form
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    trigger,
    watch,
    register,
    reset,
    formState: { errors },
  } = useForm<CreateProductDataType>({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const onSubmit = (values: CreateProductDataType) => {
    console.log('here', values)
    const addProduct: CreateProductDataType = {
      name: values.name,
      brand: values.brand,
      manufacturer: values.manufacturer,
      unit_type: values.unit_type,
      description: values.description,
      longDescription: values.longDescription,
      price: values.price,
      quantity: values.quantity,
      category: values.category,
      thumbnail: values.thumbnail,
      images: values.images,
      warehouse: stateListWarehouse[0].id,
      distribution_channel: stateListDistribution[0].id,
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
        reset({
          name: '',
          description: '',
          longDescription: '',
          quantity: 0,
          thumbnail: '',
          price: 0,
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
  }

  useEffect(() => {
    register('longDescription', { required: true, minLength: 11 })
  }, [dispatch, register])

  const editorContent = watch('longDescription')
  const onEditorStateChange = (value: string) => {
    // console.log(value)
    setValue('longDescription', value)
    console.log(getValues('longDescription'))
  }

  useEffect(() => {
    // dispatch(loadingActions.doLoading())
    setValue('unit_type', 'UNIT')
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
    getWareHouse()
      .then((res) => {
        const { data } = res.data
        setStateListWarehouse(data)
        console.log('data', data)
        setValue('warehouse', data[0])
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
    getDistribution()
      .then((res) => {
        const { data } = res.data
        setStateListDistribution(data)
        console.log(data)
        setValue('distribution_channel', data[0])
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <TypographyH2 variant="h2" mb={3}>
        Create New Product
      </TypographyH2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomStack direction="row" spacing={2} mb={2}>
          <Stack
            spacing={1}
            sx={{ background: 'white', padding: '15px', borderRadius: '10px' }}
          >
            <Typography sx={{ width: '165px' }}>
              {' '}
              Add Thumbnail Product
            </Typography>
            <UploadImage
              onFileSelectSuccess={(file: string) => {
                setValue('thumbnail', file)
                trigger('thumbnail')
              }}
              onFileSelectError={() => {
                return
              }}
              onFileSelectDelete={() => {
                setValue('thumbnail', '')
                trigger('thumbnail')
              }}
            />
          </Stack>
        </CustomStack>
        <CustomStack direction="row" spacing={2} mb={2}>
          <Stack
            spacing={1}
            sx={{ background: 'white', padding: '15px', borderRadius: '10px' }}
          >
            <Typography sx={{ width: '165px', textAlign: 'center' }}>
              Add Product Images
            </Typography>
            <UploadList
              onFileSelectSuccess={(file: string[]) => {
                setValue('images', file)
                trigger('images')
              }}
              onFileSelectError={() => {
                return
              }}
              onFileSelectDelete={() => {
                setValue('images', [''])
                trigger('images')
              }}
            />
            {/* <CustomImageBox></CustomImageBox> */}
          </Stack>
        </CustomStack>

        <CustomStack spacing={2}>
          <Grid container spacing={2}>
            <Grid xs={6}>
              <CustomBox>
                <Grid container columnSpacing={3} rowSpacing={2}>
                  <Grid xs={12}>
                    <Controller
                      control={control}
                      name="name"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <Stack
                            direction="row"
                            alignItems="center"
                            height={33}
                          >
                            <InputLabelCustom
                              required
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
                  <Grid xs={12}>
                    <Controller
                      control={control}
                      name="price"
                      defaultValue={0}
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="price"
                            required
                            error={!!errors.price}
                          >
                            Price
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="price"
                              placeholder="Enter price"
                              type="number"
                              inputProps={{ min: 0, max: 1000000 }}
                              error={!!errors.price}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    $
                                  </InputAdornment>
                                ),
                              }}
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
                  <Grid xs={6}>
                    <Box>
                      <Controller
                        control={control}
                        name="category"
                        defaultValue={0}
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
                                renderValue={(value: any) => {
                                  // console.log('aaaa', stateListCategory)
                                  let nameValue = ''
                                  if (!value) {
                                    return (
                                      <PlaceholderSelect>
                                        <div>Select category</div>
                                      </PlaceholderSelect>
                                    )
                                  }
                                  const itemSelected = stateListCategory?.find(
                                    (obj) => obj.id === value
                                  )
                                  if (itemSelected) {
                                    return itemSelected.name
                                  }
                                  stateListCategory?.forEach((item) => {
                                    const foundItem = item.child_category.find(
                                      (_item) => _item.id === value
                                    )
                                    if (foundItem) {
                                      nameValue = foundItem.name
                                      return
                                    }
                                  })
                                  return nameValue
                                }}
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
                                  } else {
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
                                {errors.category &&
                                  `${errors.category.message}`}
                              </FormHelperText>
                            </FormControl>
                          </>
                        )}
                      />
                    </Box>
                  </Grid>
                  <Grid xs={6}>
                    <Controller
                      control={control}
                      name="manufacturer"
                      defaultValue={0}
                      render={({ field }) => (
                        <>
                          <Stack direction="row" alignItems="center">
                            <InputLabelCustom
                              htmlFor="manufacturer"
                              error={!!errors.manufacturer}
                            >
                              Manufacturer
                            </InputLabelCustom>
                            {/* <IconButtonCustom
                              onClick={handleOpenModalAddManufacturer}
                            >
                              <span className="icon-icon-edit"></span>
                            </IconButtonCustom> */}
                          </Stack>
                          <FormControl fullWidth>
                            <SelectCustom
                              id="manufacturer"
                              displayEmpty
                              IconComponent={() => <KeyboardArrowDownIcon />}
                              renderValue={(value: any) => {
                                if (!value) {
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
                      name="brand"
                      defaultValue={0}
                      render={({ field }) => (
                        <>
                          <Stack direction="row" alignItems="center">
                            <InputLabelCustom
                              htmlFor="brand"
                              error={!!errors.brand}
                            >
                              Brand
                            </InputLabelCustom>
                            {/* <IconButtonCustom onClick={handleOpenModalAddBrand}>
                              <span className="icon-icon-edit"></span>
                            </IconButtonCustom> */}
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
                      name="unit_type"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <Stack
                            direction="row"
                            alignItems="center"
                            height={33}
                          >
                            <InputLabelCustom
                              htmlFor="unit_type"
                              error={!!errors.unit_type}
                            >
                              Unit type
                            </InputLabelCustom>
                          </Stack>
                          <FormControl fullWidth>
                            <SelectCustom
                              id="unit_type"
                              displayEmpty
                              IconComponent={() => <KeyboardArrowDownIcon />}
                              renderValue={(value: any) => {
                                console.log('unit_type', value)
                                if (!value) {
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
                              {errors.unit_type &&
                                `${errors.unit_type.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Grid>
                </Grid>
              </CustomBox>
            </Grid>
            <Grid xs={6}>
              <CustomBox mb={2}>
                <Grid container spacing={2}>
                  <Grid xs={6}>
                    <Controller
                      control={control}
                      name="warehouse"
                      defaultValue=""
                      render={({ field }) => {
                        return (
                          <>
                            <Stack direction="row" alignItems="center">
                              <InputLabelCustom
                                htmlFor="warehouse"
                                error={!!errors.warehouse}
                              >
                                Warehouse
                              </InputLabelCustom>
                            </Stack>
                            <FormControl fullWidth disabled>
                              <SelectCustom
                                id="warehouse"
                                displayEmpty
                                sx={{ background: '#F6F6F6' }}
                                IconComponent={() => (
                                  <KeyboardArrowDownIcon
                                    sx={{ color: 'transparent' }}
                                  />
                                )}
                                renderValue={(value: any) => {
                                  return (
                                    <PlaceholderSelect>
                                      <div>{value.name}</div>
                                    </PlaceholderSelect>
                                  )
                                }}
                                {...field}
                              ></SelectCustom>

                              <FormHelperText error={!!errors.warehouse}>
                                {errors.warehouse &&
                                  `${errors.warehouse.message}`}
                              </FormHelperText>
                            </FormControl>
                          </>
                        )
                      }}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <Controller
                      control={control}
                      name="quantity"
                      defaultValue={0}
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="quantity"
                            required
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
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    {watch('unit_type')}
                                  </InputAdornment>
                                ),
                              }}
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
                </Grid>
              </CustomBox>
              <CustomBox>
                <Grid container>
                  <Grid xs={12}>
                    <Controller
                      control={control}
                      name="distribution_channel"
                      defaultValue=""
                      render={({ field }) => {
                        return (
                          <>
                            <Stack direction="row" alignItems="center">
                              <InputLabelCustom
                                htmlFor="distribution_channel"
                                error={!!errors.distribution_channel}
                              >
                                Distribution channel
                              </InputLabelCustom>
                            </Stack>
                            <FormControl fullWidth disabled>
                              <SelectCustom
                                {...field}
                                sx={{ background: '#F6F6F6' }}
                                IconComponent={() => (
                                  <KeyboardArrowDownIcon
                                    sx={{ color: 'transparent' }}
                                  />
                                )}
                                renderValue={(value: any) => {
                                  console.log('hehehe', value)
                                  return (
                                    <PlaceholderSelect>
                                      <div>{value.name}</div>
                                    </PlaceholderSelect>
                                  )
                                }}
                              ></SelectCustom>

                              <FormHelperText
                                error={!!errors.distribution_channel}
                              >
                                {errors.distribution_channel &&
                                  `${errors.distribution_channel.message}`}
                              </FormHelperText>
                            </FormControl>
                          </>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
              </CustomBox>
            </Grid>
          </Grid>
          <CustomBox>
            <Grid container columnSpacing={3} rowSpacing={2}>
              <Grid xs={12}>
                <Controller
                  control={control}
                  name="description"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <Stack direction="row" alignItems="center" height={33}>
                        <InputLabelCustom
                          htmlFor="description"
                          required
                          error={!!errors.description}
                        >
                          Short description
                        </InputLabelCustom>
                      </Stack>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="description"
                          multiline
                          rows={4}
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
              </Grid>
              <Grid xs={12}>
                <Box>
                  <Controller
                    control={control}
                    name="longDescription"
                    defaultValue=""
                    render={() => (
                      <>
                        <InputLabelCustom
                          htmlFor="longDescription"
                          required
                          error={!!errors.longDescription}
                        >
                          Long description
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
            </Grid>
          </CustomBox>

          <Box display="flex" justifyContent="flex-end">
            <ButtonCustom variant="contained" size="large" type="submit">
              Submit
            </ButtonCustom>
          </Box>
        </CustomStack>
      </form>

      {/* <ModalAddNewBrand
        openBrandModal={stateOpenModalAddBrand}
        handleClose={handleCloseModalAddBrand}
        handleSetStateBrand={setStateListBrand}
      ></ModalAddNewBrand>
      <ModalAddManufacturer
        openManufacturer={stateOpenModalManufacturer}
        handleClose={handleCloseModalAddManufacturer}
        handleSetStateManufacturer={setStateListManufacturer}
      ></ModalAddManufacturer> */}
    </>
  )
}

CreateProduct.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default CreateProduct
