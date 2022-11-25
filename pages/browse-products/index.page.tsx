import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import classes from './styles.module.scss'

import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormGroup from '@mui/material/FormGroup'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Slider from '@mui/material/Slider'
import Pagination from '@mui/material/Pagination'
import MenuItem from '@mui/material/MenuItem'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'

import { ItemProduct } from 'src/components'
import {
  getProducts,
  getProductCategory,
  getProductBrand,
  getProductManufacturer,
} from './apiProducts'
import { ProductDataType } from './modelProducts'
// import SideBarProducts from './parts/sidebarProducts'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import {
  ProductListDataResponseType,
  ProductCategoryResponseType,
  ProductBrandResponseType,
  ProductBrandType,
  ProductCategoryType,
  ProductManufacturerResponseType,
  ProductManufacturerType,
} from './modelProducts'
import { objToStringParam, isEmptyObject } from 'src/utils/global.utils'
// layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema, schemaPrice } from './validations'

// custom style
import { ButtonCustom, TextFieldCustom, InputLabelCustom } from 'src/components'

// other
import { FunnelSimple, Eraser, MagnifyingGlass } from 'phosphor-react'

const CardCustom = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#F8F9FC' : theme.palette.action.hover,
  boxShadow: 'none',
  height: '100%',
}))

const FormControlLabelCustom = styled(FormControlLabel)(() => ({
  fontSize: '1.4rem',
  '& .MuiTypography-root': {
    fontSize: '1.4rem',
  },
}))

const FormLabelCustom = styled(FormLabel)(() => ({
  fontWeight: '600',
}))

const TextFieldSearchCustom = styled(TextFieldCustom)(({ theme }) => ({
  '& .MuiInputBase-input': {
    padding: '10px 45px 10px 15px',
    textOverflow: 'ellipsis',
    backgroundColor:
      theme.palette.mode === 'light' ? '#ffffff' : theme.palette.action.hover,
  },
}))
const GridProduct = styled(Grid)(() => ({
  ['@media (min-width:1536px) and (max-width:1700px)']: {
    flexBasis: '20%',
    maxWidth: '20%',
  },
}))
const BoxCustom = styled(Box)(() => ({
  position: 'relative',
}))
const BoxSort = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '10px',
  transform: 'translateY(-50%)',
  lineHeight: '1',
}))

const SelectCustomSort = styled(Select)({
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '8px',
    fontSize: '1.4rem',
    borderWidth: '1px !important',
  },
  '& .MuiOutlinedInput-input': {
    padding: '8.5px 15px 8.5px 40px',
    fontSize: '1.4rem',
    '&[aria-expanded="true"]': {
      '& ~ .MuiSvgIcon-root': {
        transform: 'rotate(180deg)',
        width: '1.5em',
      },
    },
  },
  '& .MuiSvgIcon-root': {
    width: '1.5em',
  },
})

const BrowseProducts: NextPageWithLayout = () => {
  const minDistance = 10
  const [dataProducts, setDataProducts] =
    useState<ProductListDataResponseType>()
  const [stateProductCategory, setStateProductCategory] =
    useState<ProductCategoryResponseType>()
  const [stateProductCategoryConstant, setStateProductCategoryConstant] =
    useState<ProductCategoryResponseType>()
  const [stateProductBrand, setStateProductBrand] =
    useState<ProductBrandResponseType>()
  const [stateProductManufacturer, setStateProductManufacturer] =
    useState<ProductManufacturerResponseType>()
  const [stateDisableFilter, setStateDisableFilter] = useState<boolean>(false)

  const router = useRouter()
  const dispatch = useAppDispatch()

  const [valueRangePrice, setValueRangPrice] = React.useState<number[]>([0, 40])
  // const [stateMaxPrice, setStateMaxPrice] = React.useState<number>(0)

  const CategoryItem = ({ list }: any) => {
    return list?.map((item: ProductCategoryType, index: number) => {
      return (
        <Box key={index}>
          <FormControlLabelCustom
            label={item.name}
            control={
              <Checkbox
                checked={item.checked ? true : false}
                indeterminate={item.indeterminate ? true : false}
                name={item.id?.toString()}
                onChange={(e) => handleChangeCategory(e, item)}
              />
            }
          />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              ml: 3,
            }}
          >
            <CategoryItem list={item?.child_category} />
          </Box>
        </Box>
      )
    })
  }

  const handleChangePrice = (
    event: Event,
    newValue: number | number[],
    activeThumb: number
  ) => {
    console.log('11', event)
    if (!Array.isArray(newValue)) {
      return
    }

    if (activeThumb === 0) {
      setValueRangPrice([
        Math.min(newValue[0], valueRangePrice[1] - minDistance),
        valueRangePrice[1],
      ])
    } else {
      setValueRangPrice([
        valueRangePrice[0],
        Math.max(newValue[1], valueRangePrice[0] + minDistance),
      ])
    }
    setValuePrice('from', valueRangePrice[0])
    setValuePrice('to', valueRangePrice[1])
  }

  // form search
  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  // check Price
  const {
    setValue: setValuePrice,
    handleSubmit: handleSubmitPrice,
    control: controlPrice,
    // reset: resetCheckMail,
  } = useForm({
    resolver: yupResolver(schemaPrice),
    // reValidateMode: 'onChange',
    mode: 'all',
  })

  const onSubmitSearch = (values: any) => {
    handleClearFilterPrice()
    handleClearFilterBrand()
    handleClearFilterManufacturer()
    router.replace({
      search: `${objToStringParam({ key: values.key, page: 1 })}`,
    })
  }

  const onSubmitPrice = (values: any) => {
    console.log('value', values)
    if (values.to < values.from) {
      dispatch(
        notificationActions.doNotification({
          message: 'Max price must be greater than or equal to min price',
          type: 'error',
        })
      )
      return
    }

    setStateDisableFilter(true)
    // setTimeout(function () {
    //   setStateDisableFilter(false)
    // }, 10000)

    router.replace({
      search: `${objToStringParam({
        ...router.query,
        price_gte: values.from,
        price_lte: values.to,
      })}`,
    })
  }

  // handleChangePagination
  const handleChangePagination = (e: any, page: number) => {
    console.log('e', e)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
  }

  const handleChangeCategory = async (
    event: React.ChangeEvent<HTMLInputElement>,
    item: ProductCategoryType
  ) => {
    setStateDisableFilter(true)
    // setTimeout(function () {
    //   setStateDisableFilter(false)
    // }, 10000)
    const newArrCategory = stateProductCategory?.data?.map((object) => {
      // cap 2
      let newChildCategory = object.child_category
      if (item?.parent_category) {
        if (object.child_category?.length > 0) {
          newChildCategory = object.child_category?.map((item) => {
            if (event.target.name === item.id.toString()) {
              return { ...item, checked: !item.checked }
            }
            return item
          })
          // kiem tra thang con bao nhieu cai da check
          let lengthChecked = newChildCategory
            .map((obj) => {
              if (obj.checked === true) {
                return obj
              }
            })
            .filter((value) => {
              return value !== undefined
            })
          return {
            ...object,
            indeterminate:
              lengthChecked.length > 0 &&
              lengthChecked.length < object.child_category?.length
                ? true
                : false,
            checked:
              lengthChecked.length === object.child_category?.length
                ? true
                : false,
            child_category: newChildCategory,
          }
        }
      }

      //   // cap1
      if (event.target.name === object.id.toString()) {
        if (object.child_category?.length > 0) {
          newChildCategory = object.child_category?.map((item) => {
            if (object.checked) {
              return { ...item, checked: false }
            }
            return { ...item, checked: true }
          })
        }
        return {
          ...object,
          checked: !object.checked,
          indeterminate: false,
          child_category: newChildCategory,
        }
      }
      return {
        ...object,
        child_category: newChildCategory,
      }
    })
    setStateProductCategory({
      ...stateProductCategory,
      data: newArrCategory,
    })

    //
    let category: string[] = []
    const flatten = function (arr: ProductCategoryType[]) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].child_category?.length > 0) {
          flatten(arr[i].child_category)
        }
        if (arr[i].checked === true) category?.push(arr[i].id.toString())
      }
      return category
    }
    let routerQuery = {
      ...router.query,
      page: 1,
      category: newArrCategory ? flatten(newArrCategory).toString() : null,
    }
    let search = objToStringParam(routerQuery)
    router.replace({
      search: `${search}`,
    })
  }

  // handle change brand
  const handleChangeBrand = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateDisableFilter(true)
    // setTimeout(function () {
    //   setStateDisableFilter(false)
    // }, 10000)
    //
    const newArrBrand = stateProductBrand?.data?.map((object) => {
      if (event.target.name === object.id.toString()) {
        return { ...object, checked: !object.checked }
      }
      return object
    })
    setStateProductBrand({
      ...stateProductBrand,
      data: newArrBrand,
    })

    //
    let brand = await router.query.brand
    if (!brand) {
      brand = `${event.target.name}`
    } else {
      let arrayBrand = await `${brand}`?.split(',')
      const index = await arrayBrand.indexOf(event.target.name)
      if (index > -1) {
        await arrayBrand.splice(index, 1)
        brand = await arrayBrand.join(',')
      } else {
        await arrayBrand.push(event.target.name)
        brand = await arrayBrand.join(',')
      }
    }
    await router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: 1,
        brand: brand,
      })}`,
    })
  }

  // handle change manufacturer
  const handleChangeManufacturer = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setStateDisableFilter(true)
    // setTimeout(function () {
    //   setStateDisableFilter(false)
    // }, 10000)
    //
    const newArrManufacturer = stateProductManufacturer?.data?.map((object) => {
      if (event.target.name === object.id.toString()) {
        return { ...object, checked: !object.checked }
      }
      return object
    })
    setStateProductManufacturer({
      ...stateProductManufacturer,
      data: newArrManufacturer,
    })

    //
    let manufacturer = await router.query.manufacturer
    if (!manufacturer) {
      manufacturer = `${event.target.name}`
    } else {
      let arrayManufacturer = await `${manufacturer}`?.split(',')
      const index = await arrayManufacturer.indexOf(event.target.name)
      if (index > -1) {
        await arrayManufacturer.splice(index, 1)
        manufacturer = await arrayManufacturer.join(',')
      } else {
        await arrayManufacturer.push(event.target.name)
        manufacturer = await arrayManufacturer.join(',')
      }
    }
    await router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: 1,
        manufacturer: manufacturer,
      })}`,
    })
  }

  // handle clear price
  const handleClearFilterPrice = () => {
    if (router.query.price_lte || router.query.price_gte) {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          price_lte: null,
          price_gte: null,
        })}`,
      })
    }
  }
  // handle clear category
  const handleClearFilterCategory = () => {
    if (router.query.category) {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          category: null,
        })}`,
      })
      setStateProductCategory(stateProductCategoryConstant)
    }
  }
  // handle clear brand
  const handleClearFilterBrand = () => {
    if (router.query.brand) {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          brand: null,
        })}`,
      })
      let newArrBrand = stateProductBrand?.data?.map((object) => {
        return { ...object, checked: false }
      })
      setStateProductBrand({
        ...stateProductBrand,
        data: newArrBrand,
      })
    }
  }
  // handle clear manufacturer
  const handleClearFilterManufacturer = () => {
    if (router.query.manufacturer) {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          manufacturer: null,
        })}`,
      })
      let newArrManufacturer = stateProductManufacturer?.data?.map((object) => {
        return { ...object, checked: false }
      })
      setStateProductManufacturer({
        ...stateProductManufacturer,
        data: newArrManufacturer,
      })
    }
  }

  useEffect(() => {
    let asPath = router.asPath
    // category
    getProductCategory()
      .then((res) => {
        const data = res.data
        // find category
        if (asPath.indexOf('category=') !== -1) {
          let sliceAsPathCategory = asPath.slice(
            asPath.indexOf('category=') + 9, //position start
            asPath.indexOf('&', asPath.indexOf('category=')) // position end
          )
          let arrayCategory = sliceAsPathCategory?.split(',')
          const newArrCategory = data?.data?.map((object) => {
            // cap 2
            let newChildCategory = object.child_category
            if (object.child_category?.length > 0) {
              //
              for (let i = 0; i < arrayCategory.length; i++) {
                if (arrayCategory[i] === object.id.toString()) {
                  return {
                    ...object,
                    checked: true,
                    child_category: object.child_category?.map((item) => {
                      return { ...item, checked: true }
                    }),
                  }
                }
              }

              //
              newChildCategory = object.child_category?.map((item) => {
                for (let i = 0; i < arrayCategory.length; i++) {
                  if (arrayCategory[i] === item.id.toString()) {
                    return { ...item, checked: true }
                  }
                }
                return item
              })
              // kiem tra thang con bao nhieu cai da check
              let lengthChecked = newChildCategory
                .map((obj) => {
                  if (obj.checked === true) {
                    return obj
                  }
                })
                .filter((value) => {
                  return value !== undefined
                })

              return {
                ...object,
                indeterminate:
                  lengthChecked.length > 0 &&
                  lengthChecked.length < object.child_category?.length
                    ? true
                    : false,
                checked:
                  lengthChecked.length === object.child_category?.length
                    ? true
                    : false,
                child_category: newChildCategory,
              }
            }
            for (let i = 0; i < arrayCategory.length; i++) {
              if (arrayCategory[i] === object.id.toString()) {
                return { ...object, checked: true }
              }
            }
            return {
              ...object,
              child_category: newChildCategory,
            }
          })
          setStateProductCategory({
            ...data,
            data: newArrCategory,
          })
        } else {
          setStateProductCategory(data)
        }
        setStateProductCategoryConstant(data)
      })
      .catch((error) => {
        const data = error.response?.data
        dispatch(
          notificationActions.doNotification({
            message: data?.message ? data?.message : '',
            type: 'error',
          })
        )
      })

    // category
    getProductBrand()
      .then((res) => {
        const data = res.data

        // find brand
        if (asPath.indexOf('brand=') !== -1) {
          let sliceAsPathBrand = asPath.slice(
            asPath.indexOf('brand=') + 6, //position start
            asPath.indexOf('&', asPath.indexOf('brand=')) // position end
          )
          let arrayBrand = sliceAsPathBrand?.split(',')
          const newArr = data?.data?.map((object) => {
            for (let i = 0; i < arrayBrand.length; i++) {
              if (arrayBrand[i] === object.id.toString()) {
                return { ...object, checked: true }
              }
            }
            return { ...object, checked: false }
          })
          setStateProductBrand({
            ...data,
            data: newArr,
          })
        } else {
          setStateProductBrand(data)
        }
      })
      .catch((error) => {
        const data = error.response?.data
        dispatch(
          notificationActions.doNotification({
            message: data?.message ? data?.message : '',
            type: 'error',
          })
        )
      })

    // category
    getProductManufacturer()
      .then((res) => {
        const data = res.data
        // find Manufacturer
        if (asPath.indexOf('manufacturer=') !== -1) {
          let sliceAsPathManufacturer = asPath.slice(
            asPath.indexOf('manufacturer=') + 13, //position start
            asPath.indexOf('&', asPath.indexOf('manufacturer=')) // position end
          )
          let arrayManufacturer = sliceAsPathManufacturer?.split(',')
          const newArr = data?.data?.map((object) => {
            for (let i = 0; i < arrayManufacturer.length; i++) {
              if (arrayManufacturer[i] === object.id.toString()) {
                return { ...object, checked: true }
              }
            }
            return { ...object, checked: false }
          })
          setStateProductManufacturer({
            ...data,
            data: newArr,
          })
        } else {
          setStateProductManufacturer(data)
        }
      })
      .catch((error) => {
        const data = error.response?.data
        dispatch(
          notificationActions.doNotification({
            message: data?.message ? data?.message : '',
            type: 'error',
          })
        )
      })

    // find key search
    if (asPath.indexOf('key=') !== -1) {
      let sliceAsPathKeySearch = asPath.slice(
        asPath.indexOf('key=') + 4, //position start
        asPath.indexOf('&', asPath.indexOf('key=')) // position end
      )
      setValue('key', sliceAsPathKeySearch)
    }
    //
  }, [])

  // show err key search
  useEffect(() => {
    if (errors.key) {
      dispatch(
        notificationActions.doNotification({
          message: 'Key search must be at most 200 characters',
          type: 'error',
        })
      )
    }
  }, [errors])

  useEffect(() => {
    if (!isEmptyObject(router.query)) {
      dispatch(loadingActions.doLoading())
      getProducts(router.query)
        .then((res) => {
          setDataProducts({})
          const data = res.data
          setDataProducts(data)
          dispatch(loadingActions.doLoadingSuccess())
          setStateDisableFilter(false)
        })
        .catch((error) => {
          const data = error.response?.data
          dispatch(loadingActions.doLoadingFailure())
          dispatch(
            notificationActions.doNotification({
              message: data?.message ? data?.message : 'Error',
              type: 'error',
            })
          )
        })
    }
    if (router.asPath === '/browse-products') {
      dispatch(loadingActions.doLoading())
      getProducts()
        .then((res) => {
          setDataProducts({})
          const data = res.data
          setDataProducts(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((error) => {
          const data = error.response?.data
          dispatch(loadingActions.doLoadingFailure())
          dispatch(
            notificationActions.doNotification({
              message: data?.message ? data?.message : 'Error',
              type: 'error',
            })
          )
        })

      let newArrBrand = stateProductBrand?.data?.map((object) => {
        return { ...object, checked: false }
      })
      let newArrManufacturer = stateProductManufacturer?.data?.map((object) => {
        return { ...object, checked: false }
      })
      setStateProductBrand({
        ...stateProductBrand,
        data: newArrBrand,
      })
      setStateProductManufacturer({
        ...stateProductManufacturer,
        data: newArrManufacturer,
      })
      setStateProductCategory(stateProductCategoryConstant)
      setValue('key', '')
    }
  }, [router, dispatch])

  const renderResult = () => {
    if (!dataProducts?.data) {
      return (
        <Box mb={4}>
          <Grid container spacing={2}>
            {Array.from(Array(18).keys()).map((index: number) => (
              <GridProduct item lg={3} xl={2} key={index}>
                <CardCustom variant="outlined">
                  <Box mb={1}>
                    <Skeleton animation="wave" variant="rounded" height={204} />
                  </Box>
                  <CardContent style={{ paddingBottom: '16px' }}>
                    <Skeleton variant="text" sx={{ fontSize: '1.4rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.6rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.6rem' }} />
                    <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
                  </CardContent>
                </CardCustom>
              </GridProduct>
            ))}
          </Grid>
        </Box>
      )
    }
    if (dataProducts?.data?.length === 0) {
      return (
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Image
              src="/images/not-found.svg"
              alt="Logo"
              width="300"
              height="300"
            />
            <Typography variant="h6" style={{ textAlign: 'center' }}>
              No products found
            </Typography>
          </Grid>
        </Grid>
      )
    }
    return (
      <>
        <Box mb={4}>
          <Grid container spacing={2}>
            {dataProducts?.data?.map((item: ProductDataType, index: number) => (
              <GridProduct item lg={3} xl={2} key={index}>
                <ItemProduct dataProduct={item} />
              </GridProduct>
            ))}
          </Grid>
        </Box>
        {Number(dataProducts?.totalPages) > 1 && (
          <Pagination
            color="primary"
            count={dataProducts?.totalPages}
            variant="outlined"
            shape="rounded"
            defaultPage={1}
            page={Number(router.query.page) ? Number(router.query.page) : 1}
            onChange={(e, page: number) => handleChangePagination(e, page)}
          />
        )}
      </>
    )
  }
  return (
    <>
      <Head>
        <title>Products | VAPE</title>
      </Head>
      <Grid container spacing={2}>
        <Grid item xs={2} style={{ minWidth: '270px' }}>
          <CardCustom>
            <CardContent>
              <FormControl component="fieldset" variant="standard" fullWidth>
                <FormLabelCustom>
                  Price{' '}
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleClearFilterPrice()}
                  >
                    <Eraser size={20} />
                  </IconButton>
                </FormLabelCustom>
                <Slider
                  // getAriaLabel={() => 'Minimum distance shift'}
                  value={valueRangePrice}
                  onChange={handleChangePrice}
                  valueLabelDisplay="auto"
                  disableSwap
                  // getAriaValueText={valuetext}
                  step={10}
                  max={100}
                  marks={[
                    {
                      value: 0,
                      label: '$0',
                    },
                    {
                      value: 100,
                      label: '$100',
                    },
                  ]}
                />
              </FormControl>
              <form onSubmit={handleSubmitPrice(onSubmitPrice)}>
                <Grid container spacing={1} mb={2}>
                  <Grid item xs>
                    <Controller
                      control={controlPrice}
                      defaultValue={valueRangePrice[0]}
                      name="from"
                      render={({ field }) => (
                        <Box>
                          <InputLabelCustom htmlFor="from">
                            From
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="from"
                              type="number"
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                              onKeyPress={(event) => {
                                if (
                                  event?.key === '-' ||
                                  event?.key === '+' ||
                                  event?.key === ',' ||
                                  event?.key === '.' ||
                                  event?.key === 'e'
                                ) {
                                  event.preventDefault()
                                }
                              }}
                              {...field}
                              // onChange={(e) => {
                              //   setStateMaxPrice(Number(e.target.value))
                              //   setValuePrice('from', e.target.value)
                              // }}
                              onBlur={(e) => {
                                if (!e.target.value) {
                                  setValuePrice('from', 0)
                                } else {
                                  setValuePrice('from', e.target.value)
                                }
                              }}
                            />
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid item xs>
                    <Controller
                      control={controlPrice}
                      defaultValue={valueRangePrice[1]}
                      name="to"
                      render={({ field }) => (
                        <Box>
                          <InputLabelCustom htmlFor="to">To</InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="to"
                              type="number"
                              InputProps={{
                                inputProps: { min: 0 },
                              }}
                              onKeyPress={(event) => {
                                if (
                                  event?.key === '-' ||
                                  event?.key === '+' ||
                                  event?.key === ',' ||
                                  event?.key === '.' ||
                                  event?.key === 'e'
                                ) {
                                  event.preventDefault()
                                }
                              }}
                              {...field}
                              onBlur={(e) => {
                                if (!e.target.value) {
                                  setValuePrice('to', 0)
                                } else {
                                  setValuePrice('to', e.target.value)
                                }
                              }}
                            />
                          </FormControl>
                        </Box>
                      )}
                    />
                  </Grid>
                  <Grid item xs={24}>
                    <ButtonCustom
                      variant="contained"
                      type="submit"
                      size="small"
                      fullWidth
                      disabled={stateDisableFilter}
                    >
                      Submit
                    </ButtonCustom>
                  </Grid>
                </Grid>
              </form>
              <Divider />
              <FormControl sx={{ mt: 2 }} disabled={stateDisableFilter}>
                <FormLabelCustom>
                  Category{' '}
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleClearFilterCategory()}
                  >
                    <Eraser size={20} />
                  </IconButton>
                </FormLabelCustom>
                <CategoryItem list={stateProductCategory?.data} />
              </FormControl>
              <Divider />
              <FormControl sx={{ mt: 2 }} disabled={stateDisableFilter}>
                <FormLabelCustom>
                  Brand{' '}
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleClearFilterBrand()}
                  >
                    <Eraser size={20} />
                  </IconButton>
                </FormLabelCustom>
                <FormGroup>
                  {stateProductBrand?.data?.map(
                    (item: ProductBrandType, index: number) => {
                      return (
                        <FormControlLabelCustom
                          control={
                            <Checkbox
                              name={item.id?.toString()}
                              onChange={handleChangeBrand}
                              checked={item.checked ? true : false}
                            />
                          }
                          label={item.name}
                          key={index}
                        />
                      )
                    }
                  )}
                </FormGroup>
              </FormControl>
              <Divider />
              <FormControl sx={{ mt: 2 }} disabled={stateDisableFilter}>
                <FormLabelCustom>
                  Manufacturer{' '}
                  <IconButton
                    aria-label="delete"
                    size="small"
                    onClick={() => handleClearFilterManufacturer()}
                  >
                    <Eraser size={20} />
                  </IconButton>
                </FormLabelCustom>
                <FormGroup>
                  {stateProductManufacturer?.data?.map(
                    (item: ProductManufacturerType, index: number) => {
                      return (
                        <FormControlLabelCustom
                          control={
                            <Checkbox
                              name={item.id?.toString()}
                              onChange={handleChangeManufacturer}
                              checked={item.checked ? true : false}
                            />
                          }
                          label={item.name}
                          key={index}
                        />
                      )
                    }
                  )}
                </FormGroup>
              </FormControl>
            </CardContent>
          </CardCustom>
        </Grid>
        <Grid item xs>
          <CardCustom>
            <CardContent>
              <Grid container spacing={2} mb={2}>
                <Grid item xs>
                  <form
                    onSubmit={handleSubmit(onSubmitSearch)}
                    className={classes[`form-search`]}
                  >
                    <Controller
                      control={control}
                      name="key"
                      render={({ field }) => (
                        <>
                          <FormControl fullWidth>
                            <TextFieldSearchCustom
                              id="key"
                              error={!!errors.key}
                              placeholder="Search product by code, name..."
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
                <Grid item xs={2}>
                  <BoxCustom>
                    <BoxSort>
                      <FunnelSimple size={16} />
                    </BoxSort>
                    <SelectCustomSort
                      fullWidth
                      IconComponent={() => <KeyboardArrowDownIcon />}
                      // renderValue={(value: any) => {
                      //   if (value === '') {
                      //     return (
                      //       <PlaceholderSelect>
                      //         <div>Select value</div>
                      //       </PlaceholderSelect>
                      //     )
                      //   }
                      //   return stateSelectMonthlySale.find(
                      //     (obj) => obj.id === value
                      //   )?.monthly_sale
                      // }}
                      onChange={() => {}}
                      defaultValue="0"
                    >
                      <MenuItem value="0">Newest</MenuItem>
                      <MenuItem value="1">Oldest</MenuItem>
                    </SelectCustomSort>
                  </BoxCustom>
                </Grid>
                <Grid item xs={2}>
                  <Link href="/browse-products">
                    <a>
                      <ButtonCustom variant="contained" startIcon={<Eraser />}>
                        Clear filter
                      </ButtonCustom>
                    </a>
                  </Link>
                </Grid>
              </Grid>
              {renderResult()}
            </CardContent>
          </CardCustom>
        </Grid>
      </Grid>
    </>
  )
}

BrowseProducts.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default BrowseProducts
