import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Box,
  Card,
  CardHeader,
  Chip,
  Dialog,
  FormControl,
  FormHelperText,
  IconButton,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/system'
import React, { useCallback, useEffect, useState } from 'react'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InputLabelCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
  TypographyH2,
} from 'src/components'
// import AttributeOptionComponent from './part/AttributeOption'
// import FormVariant from './part/FormVariant'
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import {
  schemaBrandAndManufacturer,
  schemaCategory,
  schemaUpdate,
} from './validations'
// style
import { platform } from 'src/utils/global.utils'
import {
  AddBrandManufacturerType,
  AddCategoryType,
  AddProductType,
  // AttributeResponseType,
  // DistributionType,
  // DistributionWithPriceType,
  ProductBrandResponseType,
  ProductCategoryOnMarketPlaceDetailType,
  ProductCategoryResponseType,
  ProductManufacturerResponseType,
  ValidateCreateProductDataType,
  WarehouseType,
} from './addProductModel'
//react-quill
// import ReactQuill from 'react-quill'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

import 'react-quill/dist/quill.snow.css'
import {
  createBrand,
  createCategory,
  createManufacturer,
  // getAttributes,
  getDistribution,
  getProductBrand,
  getProductCategory,
  getProductCategoryOnMarketPlace,
  getProductManufacturer,
  getWareHouse,
} from './apiAddProduct'

import { handlerGetErrMessage } from 'src/utils/global.utils'

import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import UploadImage from 'src/components/uploadImage'
import UploadList from 'src/components/uploadList'

import { LoadingButton } from '@mui/lab'
import { Plus, X } from '@phosphor-icons/react'
import { useRouter } from 'next/router'
import InfiniteScrollSelect from 'src/components/InfiniteScrollSelect'
import RequiredLabel from 'src/components/requiredLabel'
import InfiniteScrollSelectForCategory from './part/InfiniteScrollSelectForCategory'
import UploadFileList from 'src/components/uploadFileList'
import { useTranslation } from 'react-i18next'

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
const LoadingButtonCustom = styled(LoadingButton)({
  backgroundColor: 'linear-gradient(93.37deg, #1CB35B 0%, #20B598 116.99%)',
  boxShadow: '0px 3px 44px rgba(71, 255, 123, 0.27)',
  borderRadius: '12px',
  textTransform: 'none',
  '&.MuiButton-contained': {
    color: '#ffffff',
  },
  '&.MuiButton-sizeLarge': {
    padding: '7px 25px',
  },
})
const unitTypeArray: {
  id: number
  name: string
}[] = [
  {
    id: 1,
    name: 'UNIT',
  },
  {
    id: 2,
    name: 'PACKAGE',
  },
]

interface Props {
  productDetail?: any
  handleSubmitProps: (value: any, hasVariant: boolean) => void
  update?: boolean
  errorApi?: number
}

const UpdateComponent: React.FC<Props> = (props) => {
  const { t } = useTranslation('product')
  // const [count, setCount] = useState(0)
  const router = useRouter()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateLoadingSubmit, setStateLoadingSubmit] = useState(false)
  const [stateListCategory, setStateListCategory] =
    useState<ProductCategoryResponseType>({ data: [] })
  const [stateListCategoryForCreate, setStateListCategoryForCreate] =
    useState<ProductCategoryResponseType>({ data: [] })
  const [stateListBrand, setStateListBrand] =
    useState<ProductBrandResponseType>({
      data: [],
    })
  const [stateListManufacturer, setStateListManufacturer] =
    useState<ProductManufacturerResponseType>({
      data: [],
    })
  const [stateListWarehouse, setStateListWarehouse] = useState<WarehouseType[]>(
    []
  )
  const [
    stateProductCategoryOnMarketPlace,
    setStateProductCategoryOnMarketPlace,
  ] = useState<ProductCategoryOnMarketPlaceDetailType[]>([])
  // const [stateListDistribution, setStateListDistribution] = useState<
  //   DistributionType[]
  // >([])
  const [state, setState] = useState({
    openCategory: false,
    openManufacturer: false,
    openBrand: false,
  })

  const [stateModalOpenCategory, setStateModalOpenCategory] =
    useState<boolean>(false)
  const { openCategory, openManufacturer, openBrand } = state
  const [stateModalAddBrand, setStateModalAddBrand] = useState<boolean>(false)
  const [stateBrandOrManufacturer, setStateBrandOrManufacturer] =
    useState<string>('')
  const [stateOnMarketPlace, setStateOnMarketPlace] = useState(true)

  // const [stateAttributeApi, setStateAttributeApi] =
  //   useState<AttributeResponseType>({
  //     data: [],
  //   })

  // react-hook-form
  // const [stateVariant, setStateVariant] = useState<
  //   {
  //     options: { name: string; option: string }[]
  //     price: number
  //     warehouses: {
  //       warehouse: number
  //       quantity: number
  //     }[]
  //     thumbnail: string
  //     images: string[]
  //     distribution_channel: DistributionWithPriceType[]
  //     error?: boolean
  //   }[]
  // >([])

  // const [stateAttribute, setStateAttribute] = useState<
  //   { name: string; options: string[] }[]
  // >([])
  useEffect(() => {
    handleGetCategory('')
    handleGetCategoryForCreate('')
    handleGetBrand('')
    handleGetManufacturer('')
    getProductCategoryOnMarketPlace({ page: 1, limit: 100 })
      .then((res) => {
        const { data } = res.data
        setStateProductCategoryOnMarketPlace(data)
      })
      .catch((error) => {
        const { status, data } = error.response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
    getWareHouse()
      .then((res) => {
        const { data } = res.data
        setStateListWarehouse(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })

    getDistribution()
      .then((res) => {
        const { data } = res.data
        // setStateListDistribution(data)
        setValue('distribution_channel.0.id', data[0].id)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [])

  const {
    handleSubmit,
    control,
    setValue,
    getValues,
    trigger,
    watch,
    register,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<ValidateCreateProductDataType>({
    resolver: yupResolver(schemaUpdate(t, stateOnMarketPlace)),
    defaultValues: {
      images: [],
      distribution_channel: [
        {
          id: 0,
          price: 0,
        },
      ],
    },
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const {
    handleSubmit: handleSubmitAddBrandManufacturer,
    control: controlAddBrandManufacturer,
    formState: { errors: errorsBrandManufacturer },
    setValue: setValueAddBrandManufacturer,
    watch: watchAddBrandManufacturer,
    trigger: triggerAddBrandManufacturer,
    clearErrors: clearErrorsAddBrandManufacturer,
  } = useForm<AddBrandManufacturerType>({
    resolver: yupResolver(schemaBrandAndManufacturer(t)),
    mode: 'all',
    reValidateMode: 'onChange',
  })
  const {
    handleSubmit: handleSubmitAddCategory,
    control: controlAddCategory,
    formState: { errors: errorsCategory },
    setValue: setValueAddCategory,
    getValues: getValuesAddCategory,
    clearErrors: clearErrorsAddCategory,
  } = useForm<AddCategoryType>({
    resolver: yupResolver(schemaCategory(t)),
    mode: 'all',
    reValidateMode: 'onChange',
  })

  const onSubmitCreateProduct = (values: ValidateCreateProductDataType) => {
    console.log('values', values)
    let arrWarehouse: any = []
    // let arrAfterValidate: any = []
    if (!props.update) {
      arrWarehouse = values.warehouses.map((item, index) => {
        console.log(`index ${index}`, stateListWarehouse[index].id)
        return {
          warehouse: stateListWarehouse[index].id,
          quantity: item.quantity ? Number(item.quantity) : 0,
        }
      })
    }
    const addProduct: AddProductType = {
      name: values.name,
      ...((stateOnMarketPlace || (!stateOnMarketPlace && values.brand)) && {
        brand: Number(values.brand!.slice(0, values.brand!.indexOf('-'))),
      }),
      ...((stateOnMarketPlace ||
        (!stateOnMarketPlace && values.manufacturer)) && {
        manufacturer: Number(
          values.manufacturer!.slice(0, values.manufacturer!.indexOf('-'))
        ),
      }),
      unit_type: values.unit_type,
      description: values.description === '' ? null : values.description,
      longDescription:
        values.longDescription === '' ? null : values.longDescription,
      category: Number(values.category.slice(0, values.category.indexOf('-'))),
      ...((stateOnMarketPlace ||
        (!stateOnMarketPlace && values.category_marketplace)) && {
        category_marketplace: Number(values.category_marketplace),
      }),
      ...((stateOnMarketPlace || (!stateOnMarketPlace && values.thumbnail)) && {
        thumbnail: values.thumbnail,
      }),
      images: values.images,
      warehouses: arrWarehouse,
      distribution_channel: values.distribution_channel,
      price: values.price,
      ...((stateOnMarketPlace || (!stateOnMarketPlace && values.uom)) && {
        uom: values.uom,
      }),
      ...((stateOnMarketPlace || (!stateOnMarketPlace && values.weight)) && {
        weight: values.weight,
      }),

      ...((stateOnMarketPlace || (!stateOnMarketPlace && values.documents)) && {
        documents: values.documents,
      }),
      on_market: stateOnMarketPlace,
      ...(values.bar_code && { bar_code: values.bar_code }),
    }

    if (values.images.length > 0 && values.images.some((item) => !item)) {
      pushMessage(t('createUpdate.message.pleaseRemoveImagesInvalid'), 'error')
      return
    }
    if (
      values.longDescription &&
      values.longDescription.replace(/<(.|\n)*?>/g, '').trim().length < 20
    ) {
      setError('longDescription', {
        message: t(
          'createUpdate.message.longDescriptionMustBeAtLeast_20Characters'
        ),
      })

      return
    }
    setStateLoadingSubmit(true)
    props.handleSubmitProps(addProduct, false)
    setStateLoadingSubmit(false)
  }

  // react hook form submit outside form
  const onEditorStateChange = (content: string, editor: any) => {
    console.log('longDescription', editor.getLength())
    if (editor.getHTML() === '<p><br></p>') {
      clearErrors('longDescription')
    }

    if (
      editor
        .getHTML()
        .replace(/<(.|\n)*?>/g, '')
        .trim().length === 0
    ) {
      setValue('longDescription', '')
    } else {
      console.log(
        'text',
        editor
          .getHTML()
          .replace(/<(.|\n)*?>/g, '')
          .trim().length
      )
      if (
        editor
          .getHTML()
          .replace(/<(.|\n)*?>/g, '')
          .trim().length > 19
      ) {
        clearErrors('longDescription')
      }
      setValue('longDescription', content)
    }
  }

  const handleGetManufacturer = (value: string | null) => {
    getProductManufacturer(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListManufacturer(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetBrand = (value: string | null) => {
    getProductBrand(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListBrand(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetCategory = (value: string | null) => {
    getProductCategory(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListCategory(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleGetCategoryForCreate = (value: string | null) => {
    getProductCategory(1, {
      name: value ? value : null,
    })
      .then((res) => {
        const { data } = res
        setStateListCategoryForCreate(data)
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }

  const fetchMoreDataBrand = useCallback(
    (value: { page: number; name: string }) => {
      getProductBrand(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListBrand((prev: any) => {
            return {
              ...data,
              data: [...prev.data, ...res.data.data],
            }
          })
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    },
    [setStateListBrand, pushMessage]
  )

  const fetchMoreDataCategory = useCallback(
    (value: { page: number; name: string }) => {
      getProductCategory(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListCategory((prev: any) => {
            return {
              ...data,
              data: [...prev.data, ...res.data.data],
            }
          })
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setStateListCategory, pushMessage]
  )
  const fetchMoreDataCategoryForCreate = useCallback(
    (value: { page: number; name: string }) => {
      getProductCategory(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListCategoryForCreate((prev: any) => {
            return {
              ...data,
              data: [...prev.data, ...res.data.data],
            }
          })
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setStateListCategoryForCreate, pushMessage]
  )

  const fetchMoreDataManufacturer = useCallback(
    (value: { page: number; name: string }) => {
      getProductManufacturer(value.page, { name: value.name })
        .then((res) => {
          const { data } = res
          setStateListManufacturer((prev: any) => {
            return {
              ...data,
              data: [...prev.data, ...res.data.data],
            }
          })
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })

      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setStateListManufacturer, pushMessage]
  )

  useEffect(() => {
    if (!props.productDetail) return
    if (platform() === 'SUPPLIER' || props.productDetail.is_owner) {
      setStateOnMarketPlace(props.productDetail.on_market)
      console.log('props.productdetail', props.productDetail)
      setValue('name', props.productDetail.name)

      setValue('description', props.productDetail.description)
      setValue('longDescription', props.productDetail.longDescription)
      console.log(
        'get value from longDescription',
        props.productDetail.longDescription
      )
      if (
        props.productDetail.on_market ||
        (!props.productDetail.on_market && props.productDetail.brand)
      ) {
        setValue(
          'brand',
          `${props.productDetail.brand.id}-${props.productDetail.brand.name}`
        )
      }
      if (
        props.productDetail.on_market ||
        (!props.productDetail.on_market && props.productDetail.manufacturer)
      ) {
        setValue(
          'manufacturer',
          `${props.productDetail.manufacturer.id}-${props.productDetail.manufacturer.name}`
        )
      }

      setValue(
        'category',
        `${props.productDetail.category.id}-${props.productDetail.category.name}`
      )
      setValue('unit_type', props.productDetail.unit_type)
      if (
        props.productDetail.on_market ||
        (!props.productDetail.on_market && props.productDetail.thumbnail)
      ) {
        setValue('thumbnail', props.productDetail.thumbnail)
      }

      setValue('images', props.productDetail.images)
      if (
        props.productDetail.on_market ||
        (!props.productDetail.on_market &&
          props.productDetail.category_marketplace)
      ) {
        setValue(
          'category_marketplace',
          props.productDetail.category_marketplace.id
        )
      }
      if (
        props.productDetail.on_market ||
        (!props.productDetail.on_market &&
          props.productDetail.category_marketplace)
      ) {
        setValue('documents', props.productDetail.documents)
      }

      console.log(
        'props.productDetail.category_marketplace.id',
        props.productDetail.category_marketplace.id
      )
    } else {
      console.log('?')
      router.push('/404')
    }
  }, [props.productDetail, router, setValue])

  useEffect(() => {
    // 👇️ don't run on the initial render
    if (props.errorApi !== 0) {
      setStateLoadingSubmit(false)
    }
  }, [props.errorApi])

  const handleCloseModalCreateNew = () => {
    setValueAddBrandManufacturer('name', '')
    setValueAddBrandManufacturer('logo', null)
    setValueAddCategory('name', '')
    setValueAddCategory('parent_category', '')
    setStateModalAddBrand(false)
    clearErrorsAddBrandManufacturer('name')
    clearErrorsAddBrandManufacturer('logo')
    clearErrorsAddCategory('name')
    clearErrorsAddCategory('parent_category')
  }
  const onSubmitCreate = (value: AddBrandManufacturerType) => {
    const submitValue = {
      ...value,
      logo: value.logo ? value.logo : null,
    }
    switch (stateBrandOrManufacturer) {
      case 'brand':
        createBrand(submitValue)
          .then(() => {
            handleGetBrand('')
            handleCloseModalCreateNew()
            pushMessage(
              t('createUpdate.message.createNewBrandSuccessfully'),
              'success'
            )
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        break
      case 'manufacturer':
        createManufacturer(submitValue)
          .then(() => {
            handleCloseModalCreateNew()
            handleGetManufacturer('')

            pushMessage(
              t('createUpdate.message.createNewManufacturerSuccessfully'),
              'success'
            )
          })
          .catch(({ response }) => {
            const { status, data } = response
            pushMessage(handlerGetErrMessage(status, data), 'error')
          })
        break
    }
  }
  const onSubmitCreateCategory = (value: AddCategoryType) => {
    console.log(value)
    const submitCategory = {
      name: value.name,
      parent_category: value.parent_category
        ? Number(
            value.parent_category.slice(0, value.parent_category.indexOf('-'))
          )
        : null,
    }
    createCategory(submitCategory)
      .then(() => {
        handleGetCategory('')
        handleCloseModalCreateNew()
        pushMessage(
          t('createUpdate.message.createNewCategorySuccess'),
          'success'
        )
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const onError = (err: any) => {
    console.log('error', err)
  }

  return (
    <>
      <form>
        <Stack direction="row" spacing={2} mb={2}>
          <CustomStack spacing={2}>
            <Typography sx={{ fontWeight: 500 }}>
              {stateOnMarketPlace && <RequiredLabel />}

              {t('createUpdate.productThumbnail')}
            </Typography>
            <Box
              p={'15px'}
              mb={'25px'}
              maxWidth={'193px'}
              borderRadius={'10px'}
              sx={{
                backgroundColor: 'white',
              }}
            >
              <input {...register('thumbnail')} hidden />
              <UploadImage
                file={watch('thumbnail') as string}
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
              <FormHelperText error={!!errors.thumbnail}>
                {errors.thumbnail && `${errors.thumbnail.message}`}
              </FormHelperText>
            </Box>
          </CustomStack>
          <CustomStack
            spacing={2}
            sx={{ width: '100%', whiteSpace: 'no-wrap', overflowX: 'auto' }}
          >
            <Stack direction="row" spacing={1}>
              <Typography sx={{ fontWeight: 500 }}>
                {' '}
                {t('createUpdate.productImages')}
              </Typography>
              <Typography sx={{ color: '#757C91', fontWeight: 300 }}>
                {t('createUpdate.maximum_10Images')}
              </Typography>
            </Stack>

            <UploadList
              files={watch('images') as string[]}
              onFileSelectSuccess={(file: string[]) => {
                setValue('images', file)
                trigger('images')
              }}
              onFileSelectError={() => {
                return
              }}
              onFileSelectDelete={(file) => {
                setValue('images', file)
                trigger('images')
              }}
            />
          </CustomStack>
        </Stack>
        <CustomStack
          spacing={2}
          sx={{ width: '100%', whiteSpace: 'no-wrap', overflowX: 'auto' }}
          mb={2}
        >
          <Stack direction="row" spacing={1}>
            <Typography sx={{ fontWeight: 500 }}>
              {' '}
              {t('createUpdate.documents')}
            </Typography>
            <Typography sx={{ color: '#757C91', fontWeight: 300 }}>
              {t('createUpdate.maximum_3Files')}
            </Typography>
          </Stack>

          <UploadFileList
            maxFiles={3}
            files={getValues('documents')}
            onFileSelectSuccess={(value: string[]) => {
              console.log('value', value)
            }}
            onFileSelectError={() => {
              return
            }}
            onFileSelectDelete={(file) => {
              setValue('documents', file)
              trigger('documents')
            }}
          />
        </CustomStack>
        <CustomStack
          sx={{
            background: '#FFFFFF',
            border: '1px solid #1DB46A',
            paddingBottom: 0,
          }}
          mb={2}
        >
          <Card sx={{ boxShadow: 'none', background: 'none' }}>
            <CardHeader
              subheader={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography style={{ fontWeight: 600, color: '#1DB469' }}>
                    Put product on market place
                  </Typography>
                  <Switch
                    checked={stateOnMarketPlace}
                    onChange={() => {
                      if (stateOnMarketPlace) {
                        clearErrors()
                      }
                      setStateOnMarketPlace((prev) => !prev)
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
              }
              sx={{ padding: '0px', marginBottom: '10px' }}
            />
          </Card>
        </CustomStack>
        <CustomStack spacing={2} mb={2}>
          <Typography sx={{ fontSize: '1,6rem', fontWeight: 500 }}>
            {t('createUpdate.productInfo')}
          </Typography>
          <Box sx={{ marginBottom: '15px' }}>
            <Grid container columnSpacing={2}>
              <Grid xs={6}>
                <CustomBox>
                  <Box sx={{ marginBottom: '15px' }}>
                    <Controller
                      control={control}
                      name="name"
                      defaultValue=""
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="name"
                            error={!!errors.name}
                          >
                            <RequiredLabel /> {t('createUpdate.productName')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="name"
                              placeholder={t('createUpdate.enterProductName')}
                              error={!!errors.name}
                              {...register('name')}
                              {...field}
                            />
                            <FormHelperText error={!!errors.name}>
                              {errors.name && `${errors.name.message}`}
                            </FormHelperText>
                          </FormControl>
                        </>
                      )}
                    />
                  </Box>
                  {stateProductCategoryOnMarketPlace &&
                    getValues('category_marketplace') && (
                      <Box>
                        <Controller
                          control={control}
                          name="category_marketplace"
                          // defaultValue={9}
                          render={({ field }) => (
                            <>
                              <InputLabelCustom
                                htmlFor="category_marketplace"
                                error={!!errors.category_marketplace}
                              >
                                {stateOnMarketPlace && <RequiredLabel />}{' '}
                                {t('createUpdate.categoryMarketplace')}
                              </InputLabelCustom>
                              <FormControl fullWidth>
                                <SelectCustom
                                  {...field}
                                  id="category_marketplace"
                                  // displayEmpty
                                  IconComponent={() => (
                                    <KeyboardArrowDownIcon />
                                  )}
                                  renderValue={(value: any) => {
                                    console.log('vlaue', value)
                                    console.log(
                                      'stateProductCategoryOnMarketPlace',
                                      stateProductCategoryOnMarketPlace
                                    )
                                    if (!value) {
                                      return (
                                        <PlaceholderSelect>
                                          <div>
                                            {' '}
                                            {t('createUpdate.selectCategory')}
                                          </div>
                                        </PlaceholderSelect>
                                      )
                                    }
                                    return stateProductCategoryOnMarketPlace?.find(
                                      (obj) => obj.id === value
                                    )?.name
                                  }}
                                  onChange={(event: any) => {
                                    setValue(
                                      'category_marketplace',
                                      event.target.value
                                    )
                                  }}
                                >
                                  {stateProductCategoryOnMarketPlace.map(
                                    (item, index) => {
                                      return (
                                        <MenuItemSelectCustom
                                          value={item.id}
                                          key={index + Math.random()}
                                        >
                                          {item.name}
                                        </MenuItemSelectCustom>
                                      )
                                    }
                                  )}
                                </SelectCustom>
                                <FormHelperText
                                  error={!!errors.category_marketplace}
                                >
                                  {errors.category_marketplace &&
                                    `${errors.category_marketplace.message}`}
                                </FormHelperText>
                              </FormControl>
                            </>
                          )}
                        />
                      </Box>
                    )}
                </CustomBox>
              </Grid>
              <Grid xs={6}>
                <CustomBox>
                  <Grid container columnSpacing={2} spacing={1}>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        name="category"
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabelCustom
                              htmlFor="category"
                              error={!!errors.category}
                            >
                              <RequiredLabel /> {t('createUpdate.category')}
                              <Chip
                                icon={<Plus size={16} />}
                                onClick={() => {
                                  setStateBrandOrManufacturer('category')
                                  setStateModalAddBrand(true)
                                }}
                                label="Add new"
                                size="small"
                                sx={{ marginLeft: '10px' }}
                                // variant="outlined"
                              />
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <SelectCustom
                                id="category"
                                displayEmpty
                                IconComponent={() => <KeyboardArrowDownIcon />}
                                open={openCategory}
                                onClick={() => {
                                  setState({
                                    ...state,
                                    openCategory: !openCategory,
                                  })
                                }}
                                renderValue={(value: any) => {
                                  if (value === '') {
                                    return (
                                      <PlaceholderSelect>
                                        <div>
                                          {' '}
                                          {t('createUpdate.selectValue')}
                                        </div>
                                      </PlaceholderSelect>
                                    )
                                  }
                                  return value.slice(
                                    value.indexOf('-') + 1,
                                    value.length
                                  )
                                }}
                                {...register('category')}
                                {...field}
                                onChange={(e) => console.log(e)}
                              >
                                <InfiniteScrollSelect
                                  propData={stateListCategory}
                                  handleSearch={(value) => {
                                    setStateListCategory({ data: [] })
                                    handleGetCategory(value)
                                  }}
                                  fetchMore={(value) => {
                                    fetchMoreDataCategory(value)
                                  }}
                                  onClickSelectItem={(item: any) => {
                                    setValue(
                                      'category',
                                      `${item.id}-${item.name}`
                                    )
                                    clearErrors('category')
                                    setState({
                                      ...state,
                                      openCategory: false,
                                    })
                                  }}
                                  propsGetValue={getValues('category')}
                                />
                              </SelectCustom>
                              <FormHelperText error={!!errors.category}>
                                {errors.category &&
                                  `${errors.category.message}`}
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
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabelCustom
                              htmlFor="manufacturer"
                              error={!!errors.manufacturer}
                            >
                              {stateOnMarketPlace && <RequiredLabel />}{' '}
                              {t('createUpdate.manufacturer')}
                              <Chip
                                icon={<Plus size={16} />}
                                onClick={() => {
                                  setStateBrandOrManufacturer('manufacturer')
                                  setStateModalAddBrand(true)
                                }}
                                label="Add new"
                                size="small"
                                sx={{ marginLeft: '10px' }}
                                // variant="outlined"
                              />
                            </InputLabelCustom>

                            <FormControl fullWidth>
                              <SelectCustom
                                id="manufacturer"
                                displayEmpty
                                error={!!errors.manufacturer}
                                IconComponent={() => <KeyboardArrowDownIcon />}
                                open={openManufacturer}
                                onClick={() => {
                                  setState({
                                    ...state,
                                    openManufacturer: !openManufacturer,
                                  })
                                }}
                                renderValue={(value: any) => {
                                  if (value === '') {
                                    return (
                                      <PlaceholderSelect>
                                        <div>
                                          {' '}
                                          {t('createUpdate.selectValue')}
                                        </div>
                                      </PlaceholderSelect>
                                    )
                                  }
                                  return value.slice(
                                    value.indexOf('-') + 1,
                                    value.length
                                  )
                                }}
                                {...register('manufacturer')}
                                {...field}
                                onChange={(e) => console.log(e)}
                              >
                                <InfiniteScrollSelect
                                  propData={stateListManufacturer}
                                  handleSearch={(value) => {
                                    setStateListManufacturer({ data: [] })
                                    handleGetManufacturer(value)
                                  }}
                                  fetchMore={(value) => {
                                    fetchMoreDataManufacturer(value)
                                  }}
                                  onClickSelectItem={(item: any) => {
                                    setValue(
                                      'manufacturer',
                                      `${item.id}-${item.name}`
                                    )
                                    clearErrors('manufacturer')
                                    setState({
                                      ...state,
                                      openManufacturer: false,
                                    })
                                  }}
                                  propsGetValue={getValues('manufacturer')}
                                />
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
                        defaultValue=""
                        render={({ field }) => (
                          <>
                            <InputLabelCustom
                              htmlFor="brand"
                              error={!!errors.brand}
                            >
                              {stateOnMarketPlace && <RequiredLabel />}
                              {t('createUpdate.brand')}
                              <Chip
                                icon={<Plus size={16} />}
                                onClick={() => {
                                  setStateBrandOrManufacturer('brand')
                                  setStateModalAddBrand(true)
                                }}
                                label="Add new"
                                size="small"
                                sx={{ marginLeft: '10px' }}
                                // variant="outlined"
                              />
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <SelectCustom
                                id="brand"
                                displayEmpty
                                defaultValue=""
                                IconComponent={() => <KeyboardArrowDownIcon />}
                                open={openBrand}
                                onClick={() => {
                                  setState({
                                    ...state,
                                    openBrand: !openBrand,
                                  })
                                }}
                                renderValue={(value: any) => {
                                  if (!value) {
                                    return (
                                      <PlaceholderSelect>
                                        <div>
                                          {' '}
                                          {t('createUpdate.selectBrand')}
                                        </div>
                                      </PlaceholderSelect>
                                    )
                                  }
                                  return value.slice(
                                    value.indexOf('-') + 1,
                                    value.length
                                  )
                                }}
                                {...register('brand')}
                                {...field}
                                onChange={(e) => console.log(e)}
                              >
                                <InfiniteScrollSelect
                                  propData={stateListBrand}
                                  handleSearch={(value) => {
                                    setStateListBrand({ data: [] })
                                    handleGetBrand(value)
                                  }}
                                  fetchMore={(value) => {
                                    fetchMoreDataBrand(value)
                                  }}
                                  onClickSelectItem={(item: any) => {
                                    setValue('brand', `${item.id}-${item.name}`)
                                    clearErrors('brand')
                                    setState({
                                      ...state,
                                      openBrand: false,
                                    })
                                  }}
                                  propsGetValue={getValues('brand')}
                                />
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
                        defaultValue="UNIT"
                        render={({ field }) => (
                          <>
                            <InputLabelCustom
                              htmlFor="unit_type"
                              error={!!errors.unit_type}
                            >
                              <RequiredLabel /> {t('createUpdate.unitType')}
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <SelectCustom
                                id="unit_type"
                                displayEmpty
                                IconComponent={() => <KeyboardArrowDownIcon />}
                                renderValue={(value: any) => {
                                  if (!value) {
                                    return (
                                      <PlaceholderSelect>
                                        <div>
                                          {' '}
                                          {t('createUpdate.selectUnitType')}
                                        </div>
                                      </PlaceholderSelect>
                                    )
                                  }
                                  return unitTypeArray?.find(
                                    (obj) => obj.name === value
                                  )?.name
                                }}
                                {...register('unit_type')}
                                {...field}
                                onChange={(event: any) => {
                                  setValue(
                                    'unit_type',
                                    event.target.value.toUpperCase()
                                  )
                                }}
                              >
                                {unitTypeArray?.map((item, index) => {
                                  return (
                                    <MenuItemSelectCustom
                                      value={item.name}
                                      key={index + Math.random()}
                                      sx={{ textTransform: 'capitalize' }}
                                    >
                                      {item.name?.toLowerCase()}
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
            </Grid>
          </Box>

          <Typography sx={{ fontSize: '1,6rem', fontWeight: 500 }}>
            {t('createUpdate.description')}
          </Typography>
          <CustomBox>
            <Stack>
              <Box sx={{ marginBottom: '15px' }}>
                <Controller
                  control={control}
                  name="description"
                  defaultValue=""
                  render={({ field }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="description"
                        error={!!errors.description}
                      >
                        {t('createUpdate.shortDescription')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <TextFieldCustom
                          id="description"
                          multiline
                          rows={4}
                          placeholder={t('createUpdate.enterShortDescription')}
                          error={!!errors.description}
                          style={{
                            backgroundColor: '#ffffff',
                          }}
                          {...register('description')}
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

              <Box>
                <Controller
                  control={control}
                  name="longDescription"
                  defaultValue=""
                  render={({ field: { ref, ...field } }) => (
                    <>
                      <InputLabelCustom
                        htmlFor="longDescription"
                        error={!!errors.longDescription}
                        ref={ref}
                      >
                        {t('createUpdate.longDescription')}
                      </InputLabelCustom>
                      <FormControl fullWidth>
                        <ReactQuill
                          style={{
                            backgroundColor: '#ffffff',
                          }}
                          theme="snow"
                          {...field}
                          onChange={(content, delta, source, editor) => {
                            console.log('ne', delta, source)
                            onEditorStateChange(content, editor)
                          }}
                          // ref={ref}
                        />
                      </FormControl>
                      <FormHelperText error={!!errors.longDescription}>
                        {errors.longDescription &&
                          `${errors.longDescription.message}`}
                      </FormHelperText>
                    </>
                  )}
                />
              </Box>
            </Stack>
          </CustomBox>
        </CustomStack>
      </form>

      {/* {stateSwitch && (
        <>
          <AttributeOptionComponent
            stateAttribute={stateAttributeApi}
            handleSubmitCreateVariant={(value: any, attributes) => {
              setStateVariant(value)
              setStateAttribute(attributes)
            }}
          />
          {stateVariant.map((item, index: number) => {
            return (
              <FormVariant
                key={index}
                item={item}
                count={count}
                indexVariant={index}
                listWarehouses={stateListWarehouse}
                listDistribution={stateListDistribution}
                unitType={watch('unit_type')}
                propValue={(value) => handleValueVariant(value, index)}
                handleDeleteVariant={(value) => {
                  setStateVariant((prevState) =>
                    prevState.filter((prevItem, index) => {
                      console.log(prevItem)
                      return index !== value
                    })
                  )
                  pushMessage('Delete success', 'success')
                }}
                variantLength={stateVariant.length}
              />
            )
          })}
        </>
      )} */}

      <CustomStack direction="row" justifyContent="flex-end">
        <LoadingButtonCustom
          style={{
            paddingTop: '11px',
            paddingBottom: '11px',
          }}
          variant="contained"
          size="large"
          type="submit"
          onClick={() => {
            handleSubmit(onSubmitCreateProduct, onError)()
          }}
          loading={stateLoadingSubmit}
          loadingPosition="start"
        >
          {t('createUpdate.submit')}
        </LoadingButtonCustom>
      </CustomStack>

      <Dialog open={stateModalAddBrand} onClose={handleCloseModalCreateNew}>
        <form
          onSubmit={
            stateBrandOrManufacturer === 'category'
              ? handleSubmitAddCategory(onSubmitCreateCategory)
              : handleSubmitAddBrandManufacturer(onSubmitCreate)
          }
        >
          <DialogTitleTws>
            <IconButton onClick={handleCloseModalCreateNew}>
              <X size={20} />
            </IconButton>
          </DialogTitleTws>
          <TypographyH2 sx={{ fontSize: '2.4rem' }} textAlign="center">
            {t('createUpdate.addNew')} {stateBrandOrManufacturer}
          </TypographyH2>
          {stateBrandOrManufacturer === 'category' ? (
            <DialogContentTws>
              <DialogContentTextTws>
                <Box maxWidth={'458px'}>
                  <Controller
                    control={controlAddCategory}
                    name="name"
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="name"
                          sx={{ marginBottom: '10px', textAlign: 'start' }}
                          error={!!errorsCategory.name}
                        >
                          <RequiredLabel />
                          {t('createUpdate.categoryName')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="name"
                            error={!!errorsCategory.name}
                            {...field}
                            sx={{ marginBottom: '15px' }}
                            placeholder="Enter category name"
                          />
                          <FormHelperText error={!!errorsCategory.name}>
                            {errorsCategory.name &&
                              `${errorsCategory.name.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                  <Controller
                    control={controlAddCategory}
                    name="parent_category"
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="parent_category"
                          sx={{ marginBottom: '10px', textAlign: 'start' }}
                          error={!!errorsCategory.parent_category}
                        >
                          {t('createUpdate.parentCategoryIfHave')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <SelectCustom
                            id="parent_category"
                            displayEmpty
                            sx={{ textAlign: 'start' }}
                            IconComponent={() => <KeyboardArrowDownIcon />}
                            open={stateModalOpenCategory}
                            onClick={() => {
                              setStateModalOpenCategory(!stateModalOpenCategory)
                            }}
                            renderValue={(value: any) => {
                              if (value === '') {
                                return (
                                  <PlaceholderSelect>
                                    <div> {t('createUpdate.selectValue')}</div>
                                  </PlaceholderSelect>
                                )
                              }
                              return value?.slice(
                                value.indexOf('-') + 1,
                                value.length
                              )
                            }}
                            {...field}
                            onChange={(e) => console.log(e)}
                          >
                            <InfiniteScrollSelectForCategory
                              propData={stateListCategoryForCreate}
                              handleSearch={(value) => {
                                setStateListCategoryForCreate({ data: [] })
                                handleGetCategoryForCreate(value)
                              }}
                              fetchMore={(value) => {
                                fetchMoreDataCategoryForCreate(value)
                              }}
                              onClickSelectItem={(item: any) => {
                                setValueAddCategory(
                                  'parent_category',
                                  `${item.id}-${item.name}`
                                )
                                clearErrors('category')
                                setState({
                                  ...state,
                                  openCategory: false,
                                })
                              }}
                              propsGetValue={getValuesAddCategory(
                                'parent_category'
                              )}
                            />
                          </SelectCustom>
                          <FormHelperText
                            error={!!errorsCategory.parent_category}
                          >
                            {errorsCategory.parent_category &&
                              `${errorsCategory.parent_category.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
              </DialogContentTextTws>
            </DialogContentTws>
          ) : (
            <DialogContentTws>
              <DialogContentTextTws>
                <InputLabelCustom
                  sx={{ marginBottom: '10px', textAlign: 'start' }}
                >
                  {stateBrandOrManufacturer === 'brand'
                    ? 'Brand logo'
                    : 'Manufacturer logo'}
                </InputLabelCustom>
                <Box
                  p={'15px'}
                  mb={'15px'}
                  maxWidth={'193px'}
                  borderRadius={'10px'}
                  sx={{
                    backgroundColor: '#F8F9FC',
                  }}
                >
                  <UploadImage
                    file={watchAddBrandManufacturer('logo') as string}
                    onFileSelectSuccess={(file: string) => {
                      setValueAddBrandManufacturer('logo', file)
                      triggerAddBrandManufacturer('logo')
                    }}
                    onFileSelectError={() => {
                      return
                    }}
                    onFileSelectDelete={() => {
                      setValueAddBrandManufacturer('logo', null)
                      triggerAddBrandManufacturer('logo')
                    }}
                  />
                </Box>
                <Box maxWidth={'458px'}>
                  <Controller
                    control={controlAddBrandManufacturer}
                    name="name"
                    defaultValue=""
                    render={({ field }) => (
                      <>
                        <InputLabelCustom
                          htmlFor="name"
                          sx={{ marginBottom: '10px', textAlign: 'start' }}
                          error={!!errorsBrandManufacturer.name}
                        >
                          <RequiredLabel />
                          {stateBrandOrManufacturer === 'brand'
                            ? t('createUpdate.brandName')
                            : t('createUpdate.manufacturerName')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="name"
                            error={!!errorsBrandManufacturer.name}
                            {...field}
                            placeholder="Enter brand name"
                          />
                          <FormHelperText
                            error={!!errorsBrandManufacturer.name}
                          >
                            {errorsBrandManufacturer.name &&
                              `${errorsBrandManufacturer.name.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Box>
              </DialogContentTextTws>
            </DialogContentTws>
          )}

          <DialogActionsTws>
            <Stack spacing={2} direction="row">
              <ButtonCancel
                onClick={handleCloseModalCreateNew}
                variant="outlined"
                size="large"
              >
                {t('createUpdate.cancel')}
              </ButtonCancel>
              <ButtonCustom variant="contained" size="large" type="submit">
                {t('createUpdate.submit')}
              </ButtonCustom>
            </Stack>
          </DialogActionsTws>
        </form>
      </Dialog>
    </>
  )
}

export default UpdateComponent
