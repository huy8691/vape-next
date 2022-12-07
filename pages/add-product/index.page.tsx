import {
  Box,
  FormControl,
  FormHelperText,
  Stack,
  Typography,
} from '@mui/material'
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useState } from 'react'
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
import { AddFormInput, DropdownDataType } from './addProductModel'

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
    name: ' Name',
  },
  {
    id: 2,
    name: 'Name 2',
  },
  {
    id: 3,
    name: 'Name 3',
  },
]

const AddProduct: NextPageWithLayout = () => {
  const [stateParentCategorySelected, setStateParentCategorySelected] =
    useState<string>()
  // const [stateParentCategorySelected, setStateParentCategorySelected] =
  //   useState<DropdownDataType>()

  // react-hook-form
  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<AddFormInput>({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const onSubmit = (values: AddFormInput) => {
    console.log('here', values)
  }

  const hasSpecialCharacter = (input: string) => {
    // eslint-disable-next-line no-useless-escape
    return /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\/\\?\,]+$/g.test(
      input
    )
  }

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
                  name="product_name"
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="product_name"
                        error={!!errors.product_name}
                      >
                        Product name
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="product_name"
                          placeholder="Enter product name"
                          error={!!errors.product_name}
                          {...field}
                        />
                        <FormHelperText error={!!errors.product_name}>
                          {errors.product_name &&
                            `${errors.product_name.message}`}
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
                            return temporaryArray?.find(
                              (obj) => obj.id === value
                            )?.name
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('brand', event.target.value)
                            // trigger('monthly_purchase')
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
                            return temporaryArray?.find(
                              (obj) => obj.id === value
                            )?.name
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('manufacturer', event.target.value)
                            // trigger('monthly_purchase')
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
                              (obj) => obj.id === value
                            )?.name
                          }}
                          {...field}
                          onChange={(event: any) => {
                            setValue('unit_type', event.target.value)
                            // trigger('monthly_purchase')
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
                    name="parent_category"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="parent_category"
                          error={!!errors.parent_category}
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
                              return temporaryArray?.find(
                                (obj) => obj.id === value
                              )?.name
                            }}
                            {...field}
                            onChange={(event: any) => {
                              setValue('parent_category', event.target.value)
                              setStateParentCategorySelected(
                                getValues('parent_category')
                              )
                              // trigger('monthly_purchase')
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
                          <FormHelperText error={!!errors.parent_category}>
                            {errors.parent_category &&
                              `${errors.parent_category.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
              </Grid>
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
                </Box>
              </Grid>
            </Grid>
          </CustomBox>
          <CustomBox>
            <Grid container columnSpacing={3}>
              <Grid xs={4}>
                <Box>
                  <Controller
                    control={control}
                    name="short_description"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="short_description"
                          error={!!errors.short_description}
                        >
                          Short description
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="short_description"
                            multiline
                            minRows={5}
                            placeholder="Enter short description"
                            error={!!errors.short_description}
                            {...field}
                          />
                          <FormHelperText error={!!errors.short_description}>
                            {errors.short_description &&
                              `${errors.short_description.message}`}
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
                    name="overview"
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="overview"
                          error={!!errors.overview}
                        >
                          Overview
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="overview"
                            multiline
                            minRows={5}
                            placeholder="Enter overview"
                            error={!!errors.overview}
                            {...field}
                          />
                          <FormHelperText error={!!errors.overview}>
                            {errors.overview && `${errors.overview.message}`}
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
    </>
  )
}

AddProduct.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default AddProduct
