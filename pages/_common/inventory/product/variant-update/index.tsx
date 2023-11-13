import { yupResolver } from '@hookform/resolvers/yup'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import {
  Box,
  Breadcrumbs,
  Card,
  CardHeader,
  Chip,
  Dialog,
  FormControl,
  FormHelperText,
  IconButton,
  MenuItem,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/system'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Plus, PlusCircle, Trash, Warning, X } from '@phosphor-icons/react'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import 'react-quill/dist/quill.snow.css'
import {
  ButtonCancel,
  ButtonCustom,
  DialogActionsTws,
  DialogContentTextTws,
  DialogContentTws,
  DialogTitleTws,
  InfiniteScrollSelect,
  InputLabelCustom,
  MenuItemSelectCustom,
  PlaceholderSelect,
  SelectCustom,
  TextFieldCustom,
  TypographyH2,
  TypographyTitlePage,
} from 'src/components'

import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import RequiredLabel from 'src/components/requiredLabel'
import UploadImage from 'src/components/uploadImage'
import UploadList from 'src/components/uploadList'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { handlerGetErrMessage, platform } from 'src/utils/global.utils'
import {
  createBrand,
  createCategory,
  createManufacturer,
  getDetailVariant,
  getDistribution,
  getProductBrand,
  getProductCategory,
  getProductManufacturer,
  updateProductVariant,
  getProductCategoryOnMarketPlace,
  getUOMList,
} from './apiUpdateVariant'
import {
  AddBrandManufacturerType,
  AddCategoryType,
  DistributionChannelType,
  DistributionType,
  DropdownDataType,
  ListUOMType,
  ProductBrandResponseType,
  ProductCategoryOnMarketPlaceDetailType,
  ProductCategoryResponseType,
  ProductManufacturerResponseType,
  SubmitUpdateVariantType,
  SubmitUpdateWithoutVariantType,
  VariantDetailType,
} from './modelUpdateVariant'
import InfiniteScrollSelectForCategory from './part/InfiniteScrollSelectForCategory'
import classes from './styles.module.scss'
import {
  schema,
  schemaBrandAndManufacturer,
  schemaCategory,
  schemaWithOutVariant,
} from './validations'
import CurrencyNumberFormat from 'src/components/CurrencyNumberFormat'
import WeightNumberFormat from './part/WeightNumberFormat'
import UploadFileList from 'src/components/uploadFileList'
import { useTranslation } from 'react-i18next'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
const CustomStack = styled(Stack)(({ theme }) => ({
  // background: '#F8F9FC',
  padding: '15px',
  borderRadius: '10px',
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
}))
const CustomBox = styled(Box)(({ theme }) => ({
  padding: '15px',
  background: '#FFFF',
  borderRadius: '10px',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.12)' : '#fff',
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
const UpdateVariantComponent: React.FC = () => {
  const { t } = useTranslation('product')
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [pushMessage] = useEnqueueSnackbar()
  const [stateListUOM, setStateListUOM] = useState<ListUOMType[]>([])

  // const [stateErrorPrice, setStateErrorPrice] = useState<boolean>(false)
  const [state, setState] = useState({
    openCategory: false,
    openManufacturer: false,
    openBrand: false,
  })
  const [stateVariantDetail, setStateVariantDetail] =
    useState<VariantDetailType>()
  const [stateModalOpenCategory, setStateModalOpenCategory] =
    useState<boolean>(false)
  const { openCategory, openManufacturer, openBrand } = state
  const [stateModalAddBrand, setStateModalAddBrand] = useState<boolean>(false)
  const [stateBrandOrManufacturer, setStateBrandOrManufacturer] =
    useState<string>('')
  const [stateListCategory, setStateListCategory] =
    useState<ProductCategoryResponseType>({ data: [] })
  const [
    stateProductCategoryOnMarketPlace,
    setStateProductCategoryOnMarketPlace,
  ] = useState<ProductCategoryOnMarketPlaceDetailType[]>([])
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
  const [stateListDistribution, setStateListDistribution] = useState<
    DistributionType[]
  >([])
  const [stateOnMarketPlace, setStateOnMarketPlace] = useState(true)

  const {
    handleSubmit,
    control,
    setValue,
    trigger,
    watch,
    register,
    clearErrors,
    getValues,
    formState: { errors },
  } = useForm<SubmitUpdateVariantType>({
    resolver: yupResolver(
      stateVariantDetail?.attribute_options.length === 0
        ? schemaWithOutVariant(t, stateOnMarketPlace)
        : schema(t, stateOnMarketPlace)
    ),
    defaultValues: {
      images: [],
    },
    mode: 'all',
    reValidateMode: 'onChange',
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'distribution_channels',
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
  const handleGetUOM = () => {
    getUOMList()
      .then((res) => {
        const { data } = res.data
        setStateListUOM(data)
        console.log('get list uom')
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  useEffect(() => {
    if (router.query.id) {
      getDetailVariant(Number(router.query.id))
        .then((res) => {
          const { data } = res.data

          setStateOnMarketPlace(data.on_market)

          handleGetCategory('')
          handleGetCategoryForCreate('')
          handleGetBrand('')
          handleGetManufacturer('')

          console.log('data.manufacturer', data.manufacturer?.name)
          if (data.manufacturer) {
            setValue(
              'manufacturer',
              `${data.manufacturer?.id}-${data.manufacturer?.name}`
            )
          }
          if (data.brand) {
            setValue('brand', `${data.brand?.id}-${data.brand?.name}`)
          }
          setValue('category', `${data.category?.id}-${data.category?.name}`)
          setValue('unit_type', data.unit_type)

          if (data.category_marketplace) {
            setValue('category_marketplace', data.category_marketplace.id)
          }

          setStateVariantDetail(data)
          dispatch(loadingActions.doLoadingSuccess())
          setValue('name', data.name)
          setValue('description', data.description)
          if (data.uom) {
            console.log('co uom')
            console.log('getValueUom', getValues('uom'))
            setValue('uom', data.uom.id)
          }
          console.log('data.uom', getValues('uom'))
          if (data.weight) {
            setValue('weight', Number(data.weight.toFixed(2)))
          }
          setValue('price', Number(data.wholesale_price.toFixed(2)))

          setValue(
            'longDescription',
            data.longDescription ? data.longDescription : ''
          )
          setValue('thumbnail', data.thumbnail ? data.thumbnail : '')
          setValue('images', data.images)
          setValue('distribution_channels', data.distribution_channels)

          console.log('data.distribution_channels', data.distribution_channels)
          setValue('documents', data.documents)
          setValue('bar_code', data.bar_code)

          // data.distribution_channels.forEach((item, index) => {
          //   setValue(`distribution_channels.${index}.id`, item.id)
          //   setValue(`distribution_channels.${index}.price`, item.price)
          // })
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          dispatch(loadingActions.doLoadingFailure())
        })
      handleGetUOM()

      getProductCategoryOnMarketPlace({ page: 1, limit: 100 })
        .then((res) => {
          const { data } = res.data
          setStateProductCategoryOnMarketPlace(data)
        })
        .catch((error) => {
          const { status, data } = error.response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      dispatch(loadingActions.doLoading())
    }
  }, [router.query.id])
  useEffect(() => {
    getDistribution()
      .then((res) => {
        const { data } = res.data
        setStateListDistribution(data)

        if (stateVariantDetail?.distribution_channels.length === 0) {
          append({
            id: data[0].id,
            price: 0,
          })
        }
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }, [stateVariantDetail?.distribution_channels.length])
  const onSubmitUpdate = (data: any) => {
    console.log('barcode', data.bar_code)
    const temporaryArrayDc = data.distribution_channels.map(
      (item: DistributionChannelType) => {
        return { id: item.id, price: item.price }
      }
    )
    const result = temporaryArrayDc.every((item: any) => item.price === 0)
    if (stateVariantDetail?.attribute_options.length === 0) {
      const submitData: SubmitUpdateWithoutVariantType = {
        name: data.name,
        ...((stateOnMarketPlace || (!stateOnMarketPlace && !result)) && {
          distribution_channels: temporaryArrayDc,
        }),
        description:
          data.description === '' || !data.description
            ? null
            : data.description,
        longDescription:
          data.longDescription === '' || !data.longDescription
            ? null
            : data.longDescription,
        ...((stateOnMarketPlace || (!stateOnMarketPlace && data.thumbnail)) && {
          thumbnail: data.thumbnail,
        }),
        images: data.images,
        ...((stateOnMarketPlace || (!stateOnMarketPlace && data.uom)) && {
          uom: data.uom,
        }),
        ...((stateOnMarketPlace || (!stateOnMarketPlace && data.weight)) && {
          weight: data.weight,
        }),
        price: data.price,
        ...((stateOnMarketPlace || (!stateOnMarketPlace && data.bar_code)) && {
          bar_code: data.bar_code ? data.bar_code : null,
        }),
        ...((stateOnMarketPlace || (!stateOnMarketPlace && data.documents)) && {
          documents: data.documents,
        }),
        ...((stateOnMarketPlace || (!stateOnMarketPlace && data.brand)) && {
          brand: Number(
            getValues('brand')
              ?.toString()
              .slice(0, getValues('brand')?.toString().indexOf('-'))
          ),
        }),
        ...((stateOnMarketPlace ||
          (!stateOnMarketPlace && data.manufacturer)) && {
          manufacturer: Number(
            getValues('manufacturer')
              ?.toString()
              .slice(0, getValues('manufacturer')?.toString().indexOf('-'))
          ),
        }),
        category: Number(
          getValues('category')
            ?.toString()
            .slice(0, getValues('category')?.toString().indexOf('-'))
        ),
        ...((stateOnMarketPlace ||
          (!stateOnMarketPlace && data.category_marketplace)) && {
          category_marketplace: Number(getValues('category_marketplace')),
        }),
        unit_type: getValues('unit_type'),
        on_market: stateOnMarketPlace,
      }
      console.log('barcode stateVariant detail', submitData)
      updateProductVariant(Number(router.query.id), submitData)
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          pushMessage(
            t('variantUpdate.message.updateProductVariantSuccessfully'),
            'success'
          )
          // router.push(`/${platform().toLowerCase()}/inventory/product/list`)
          router.push(
            `/${platform().toLowerCase()}/inventory/product/detail/${Number(
              router.query.id
            )}`
          )
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      return
    }
    const submitData: SubmitUpdateVariantType = {
      name: data.name,
      ...((stateOnMarketPlace || (!stateOnMarketPlace && !result)) && {
        distribution_channels: temporaryArrayDc,
      }),
      ...((stateOnMarketPlace || (!stateOnMarketPlace && data.uom)) && {
        uom: data.uom,
      }),
      ...((stateOnMarketPlace || (!stateOnMarketPlace && data.weight)) && {
        weight: data.weight,
      }),
      price: data.price,
      ...((stateOnMarketPlace || (!stateOnMarketPlace && data.bar_code)) && {
        bar_code: data.bar_code ? data.bar_code : null,
      }),
      description:
        data.description === '' || !data.description ? null : data.description,
      longDescription:
        data.longDescription === '' || !data.longDescription
          ? null
          : data.longDescription,
      ...((stateOnMarketPlace || (!stateOnMarketPlace && data.thumbnail)) && {
        thumbnail: data.thumbnail,
      }),
      images: data.images,
      options:
        stateVariantDetail?.attribute_options.length === 0 ? [] : data.options,
      ...((stateOnMarketPlace || (!stateOnMarketPlace && data.documents)) && {
        documents: data.documents,
      }),
      ...(stateOnMarketPlace &&
        !stateVariantDetail?.brand && {
          brand: Number(
            getValues('brand')
              ?.toString()
              .slice(0, getValues('brand')?.toString().indexOf('-'))
          ),
        }),
      ...(stateOnMarketPlace &&
        !stateVariantDetail?.manufacturer && {
          manufacturer: Number(
            getValues('manufacturer')
              ?.toString()
              .slice(0, getValues('manufacturer')?.toString().indexOf('-'))
          ),
        }),
      ...(stateOnMarketPlace &&
        !stateVariantDetail?.category_marketplace && {
          category_marketplace: Number(getValues('category_marketplace')),
        }),
      on_market: stateOnMarketPlace,
    }
    console.log('barcode withoutVariant detail', submitData)

    updateProductVariant(Number(router.query.id), submitData)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(
          t('variantUpdate.message.updateProductVariantSuccessfully'),
          'success'
        )
        // router.push(`/${platform().toLowerCase()}/inventory/product/list`)
        router.push(
          `/${platform().toLowerCase()}/inventory/product/detail/${Number(
            router.query.id
          )}`
        )
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const onError = (err: any) => {
    console.log('error', err)
  }
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
        // resetAddBrandManufacturer('name')
        // resetAddBrandManufacturer('logo')
        // resetAddCategory('name')
        // resetAddCategory('parent_category')
        // setStateModalAddBrand(false)
        handleGetCategory('')
        handleCloseModalCreateNew()
        pushMessage(
          t('variantUpdate.message.createNewCategorySuccess'),
          'success'
        )
      })
      .catch(({ response }) => {
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
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
              t('variantUpdate.message.createNewBrandSuccessfully'),
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
            // setValueAddBrandManufacturer('name', '')
            // setValueAddBrandManufacturer('logo', null)
            // setValueAddCategory('name', '')
            // setValueAddCategory('parent_category', '')
            handleCloseModalCreateNew()
            handleGetManufacturer('')

            pushMessage(
              t('variantUpdate.message.createNewManufacturerSuccessfully'),
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

  return (
    <>
      <Head>
        <title>
          {stateVariantDetail &&
          stateVariantDetail?.attribute_options?.length > 0
            ? t('variantUpdate.updateVariantDetails')
            : t('variantUpdate.updateProductDetails')}
          | TWSS
        </title>
      </Head>
      <TypographyTitlePage mb={2} variant="h1">
        {stateVariantDetail && stateVariantDetail?.attribute_options?.length > 0
          ? t('variantUpdate.updateVariantDetails')
          : t('variantUpdate.updateProductDetails')}
      </TypographyTitlePage>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link
          href={`/${
            platform() === 'SUPPLIER' ? 'supplier' : 'retailer'
          }/inventory/product/list`}
        >
          <a>{t('variantUpdate.productManagement')}</a>
        </Link>
        <Typography>
          {' '}
          {stateVariantDetail &&
          stateVariantDetail?.attribute_options?.length > 0
            ? t('variantUpdate.updateVariantDetails')
            : t('variantUpdate.updateProductDetails')}
        </Typography>
      </Breadcrumbs>
      <form onSubmit={handleSubmit(onSubmitUpdate, onError)}>
        <Stack direction="row" spacing={2} mb={2}>
          <CustomStack spacing={2}>
            <Typography sx={{ fontWeight: 500 }}>
              {stateOnMarketPlace && <RequiredLabel />}

              {t('variantUpdate.productThumbnail')}
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
            </Box>
          </CustomStack>
          <CustomStack
            spacing={2}
            sx={{ width: '100%', whiteSpace: 'no-wrap', overflowX: 'auto' }}
          >
            <Stack direction="row" spacing={1}>
              <Typography sx={{ fontWeight: 500 }}>
                <RequiredLabel />
                {t('variantUpdate.productImages')}
              </Typography>
              <Typography sx={{ color: '#757C91', fontWeight: 300 }}>
                {t('variantUpdate.maximum_10Images')}
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
              {t('variantUpdate.documents')}
            </Typography>
            <Typography sx={{ color: '#757C91', fontWeight: 300 }}>
              {t('variantUpdate.maximum_3Files')}
            </Typography>
          </Stack>

          <UploadFileList
            maxFiles={3}
            files={getValues('documents') ? getValues('documents')! : []}
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
          <Typography sx={{ fontWeight: 500 }}>
            {t('variantUpdate.productInfo')}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ marginBottom: '15px' }}>
            <CustomBox sx={{ width: '100%' }}>
              <Grid container columnSpacing={3} rowSpacing={2}>
                <Grid xs={6}>
                  <Box>
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
                            <RequiredLabel />
                            {stateVariantDetail?.attribute_options &&
                            stateVariantDetail.attribute_options.length > 0
                              ? t('variantUpdate.variantName')
                              : t('variantUpdate.productName')}
                          </InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              id="name"
                              placeholder={t('variantUpdate.enterVariantName')}
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
                  </Box>

                  {/* {getValues('category_marketplace')} */}
                </Grid>
                <Grid xs={6}>
                  <Controller
                    control={control}
                    name="price"
                    render={() => (
                      <>
                        <InputLabelCustom htmlFor="price">
                          <RequiredLabel />
                          {t('variantUpdate.basePrice')}
                        </InputLabelCustom>
                        <FormControl fullWidth>
                          <div className={classes['input-number']}>
                            <CurrencyNumberFormat
                              defaultPrice={stateVariantDetail?.wholesale_price.toFixed(
                                2
                              )}
                              propValue={(value) => {
                                setValue(`price`, Number(value))
                                trigger(`price`)
                              }}
                              error={!!errors.price}
                            />
                          </div>
                          <FormHelperText error={!!errors.price}>
                            {errors.price && `${errors.price.message}`}
                          </FormHelperText>
                        </FormControl>
                      </>
                    )}
                  />
                </Grid>
                {((stateVariantDetail?.attribute_options &&
                  stateVariantDetail?.attribute_options.length === 0) ||
                  (stateOnMarketPlace &&
                    stateVariantDetail &&
                    !stateVariantDetail?.category_marketplace)) && (
                  <Grid xs={6}>
                    {stateProductCategoryOnMarketPlace && (
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
                                <RequiredLabel />
                                {t('variantUpdate.categoryMarketplace')}
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
                                            {t('variantUpdate.selectCategory')}
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
                  </Grid>
                )}

                <Grid xs={6}>
                  <Box>
                    <Stack direction="row" spacing={2}>
                      <Box sx={{ width: '100%' }}>
                        <Controller
                          control={control}
                          name="weight"
                          render={() => (
                            <>
                              <InputLabelCustom htmlFor="weight">
                                {stateOnMarketPlace && <RequiredLabel />}
                                {t('variantUpdate.weight')}
                              </InputLabelCustom>
                              <FormControl fullWidth>
                                <div className={classes['input-number']}>
                                  <WeightNumberFormat
                                    defaultPrice={Number(
                                      stateVariantDetail?.weight
                                    ).toFixed(2)}
                                    propValue={(value) => {
                                      setValue(`weight`, Number(value))
                                      trigger(`weight`)
                                    }}
                                    error={!!errors.weight}
                                  />
                                </div>
                                <FormHelperText error={!!errors.weight}>
                                  {errors.weight && `${errors.weight.message}`}
                                </FormHelperText>
                              </FormControl>
                            </>
                          )}
                        />
                      </Box>
                      {stateListUOM && stateListUOM.length > 0 && (
                        <Box sx={{ width: '100%' }}>
                          <Controller
                            control={control}
                            name="uom"
                            render={({ field }) => (
                              <>
                                <InputLabelCustom
                                  htmlFor="uom"
                                  error={!!errors.uom}
                                >
                                  {stateOnMarketPlace && <RequiredLabel />}
                                  {t('variantUpdate.uom')}
                                </InputLabelCustom>
                                <SelectCustom
                                  defaultValue={getValues('uom')}
                                  error={!!errors.uom}
                                  sx={{ width: '100%' }}
                                  {...field}
                                  onChange={(event: any) => {
                                    console.log('event', event.target.value)
                                    setValue(`uom`, event.target.value)
                                  }}
                                >
                                  {stateListUOM?.map((obj, index) => {
                                    return (
                                      <MenuItem key={index} value={obj.id}>
                                        {obj.name}
                                      </MenuItem>
                                    )
                                  })}
                                </SelectCustom>
                              </>
                            )}
                          />
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </Grid>
                <Grid xs={6}>
                  <Box>
                    <Controller
                      control={control}
                      name="bar_code"
                      render={({ field }) => (
                        <>
                          <InputLabelCustom>Barcode</InputLabelCustom>
                          <FormControl fullWidth>
                            <TextFieldCustom
                              error={!!errors.bar_code}
                              {...field}
                            />
                          </FormControl>
                          <FormHelperText error={!!errors.bar_code}>
                            {errors.bar_code && `${errors.bar_code.message}`}
                          </FormHelperText>
                        </>
                      )}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CustomBox>
            {((stateVariantDetail?.attribute_options &&
              stateVariantDetail?.attribute_options.length === 0) ||
              (stateOnMarketPlace &&
                (!stateVariantDetail?.brand ||
                  !stateVariantDetail.category_marketplace ||
                  !stateVariantDetail.manufacturer))) && (
              <CustomBox sx={{ width: '100%' }}>
                <Grid container columnSpacing={2}>
                  <Grid xs={6}>
                    <Box>
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
                              <RequiredLabel /> {t('variantUpdate.category')}
                              <Chip
                                icon={<Plus size={16} />}
                                onClick={() => {
                                  setStateBrandOrManufacturer('category')
                                  setStateModalAddBrand(true)
                                }}
                                label={t('variantUpdate.addNew')}
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
                                          {t('variantUpdate.selectValue')}
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
                            {/* <ButtonCustom
               variant="text"
               onClick={() => {
                 setStateBrandOrManufacturer('category')
                 setStateModalAddBrand(true)
               }}
             >
               Add new category
             </ButtonCustom> */}
                          </>
                        )}
                      />
                    </Box>
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
                            {t('variantUpdate.manufacturer')}
                            <Chip
                              icon={<Plus size={16} />}
                              onClick={() => {
                                setStateBrandOrManufacturer('manufacturer')
                                setStateModalAddBrand(true)
                              }}
                              label={t('variantUpdate.addNew')}
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
                                        {t('variantUpdate.selectValue')}
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
                            {stateOnMarketPlace && <RequiredLabel />}{' '}
                            {t('variantUpdate.brand')}
                            <Chip
                              icon={<Plus size={16} />}
                              onClick={() => {
                                setStateBrandOrManufacturer('brand')
                                setStateModalAddBrand(true)
                              }}
                              label={t('variantUpdate.addNew')}
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
                                        {t('variantUpdate.selectBrand')}
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
                      defaultValue={t(`unit`)}
                      render={({ field }) => (
                        <>
                          <InputLabelCustom
                            htmlFor="unit_type"
                            error={!!errors.unit_type}
                          >
                            <RequiredLabel /> {t('variantUpdate.unitType')}
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
                                        {t('variantUpdate.selectUnitType')}
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
                                    {t(`${item.name?.toLowerCase()}` as any)}
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
            )}
          </Stack>

          <Stack sx={{ width: '100%' }}>
            <Typography
              sx={{
                fontSize: '1.6rem',
                marginBottom: '15px',
                fontWeight: 500,
              }}
            >
              {t('variantUpdate.distributionChannelPricing')}
            </Typography>
            <Controller
              control={control}
              name="distribution_channels"
              render={() => {
                return (
                  <>
                    <CustomBox>
                      <Box sx={{ marginBottom: '15px' }}>
                        {fields.map((item, index) => {
                          // if (item.price) {
                          //   setValue(
                          //     `distribution_channels.${index}.price`,
                          //     Number(item.price.toFixed(2))
                          //   )
                          // }

                          return (
                            <Stack
                              key={item.id}
                              direction="row"
                              spacing={2}
                              alignItems="end"
                              sx={{ marginBottom: '15px' }}
                            >
                              <Box sx={{ width: '100%' }}>
                                <Controller
                                  control={control}
                                  name={`distribution_channels.${index}.id`}
                                  render={({ field }) => {
                                    return (
                                      <>
                                        <InputLabelCustom
                                          htmlFor={`distribution_channel.${index}.id`}
                                          error={
                                            !!errors.distribution_channels?.[
                                              index
                                            ]?.id
                                          }
                                        >
                                          <RequiredLabel />{' '}
                                          {t(
                                            'variantUpdate.distributionChannel'
                                          )}
                                        </InputLabelCustom>
                                        <FormControl
                                          fullWidth
                                          disabled={index === 0}
                                        >
                                          <SelectCustom
                                            {...field}
                                            sx={{
                                              background:
                                                index === 0 ? '#F6F6F6' : '',
                                            }}
                                            IconComponent={() => (
                                              <KeyboardArrowDownIcon
                                                sx={{
                                                  color: 'transparent',
                                                }}
                                              />
                                            )}
                                            onChange={(event: any) => {
                                              console.log(
                                                'event',
                                                event.target.value
                                              )
                                              setValue(
                                                `distribution_channels.${index}.id`,
                                                event.target.value
                                              )
                                            }}
                                          >
                                            {stateListDistribution.map(
                                              (obj, index) => {
                                                return (
                                                  <MenuItem
                                                    disabled={index === 0}
                                                    key={index}
                                                    value={obj.id}
                                                  >
                                                    {obj.name}
                                                  </MenuItem>
                                                )
                                              }
                                            )}
                                          </SelectCustom>
                                          <FormHelperText
                                            error={
                                              !!errors.distribution_channels?.[
                                                index
                                              ]?.id
                                            }
                                          >
                                            {errors.distribution_channels?.[
                                              index
                                            ]?.id &&
                                              errors.distribution_channels?.[
                                                index
                                              ]?.id?.message}
                                          </FormHelperText>
                                        </FormControl>
                                      </>
                                    )
                                  }}
                                />
                              </Box>
                              <Box sx={{ width: '100%' }}>
                                <Controller
                                  control={control}
                                  name={`distribution_channels.${index}.price`}
                                  render={() => (
                                    <>
                                      <InputLabelCustom
                                        htmlFor={`distribution_channels.${index}.price`}
                                        error={
                                          !!errors.distribution_channels?.[
                                            index
                                          ]?.price
                                        }
                                      >
                                        <RequiredLabel />{' '}
                                        {t('variantUpdate.price')}
                                      </InputLabelCustom>
                                      <FormControl fullWidth>
                                        <div
                                          className={classes['input-number']}
                                        >
                                          <CurrencyNumberFormat
                                            defaultPrice={item.price.toFixed(2)}
                                            propValue={(value) => {
                                              console.log('prop value', value)
                                              setValue(
                                                `distribution_channels.${index}.price`,
                                                Number(value)
                                              )
                                              console.log(
                                                'value',
                                                getValues(
                                                  `distribution_channels.${index}.price`
                                                )
                                              )
                                              trigger(
                                                `distribution_channels.${index}.price`
                                              )
                                            }}
                                            error={
                                              !!errors.distribution_channels?.[
                                                index
                                              ]?.price
                                            }
                                          />
                                        </div>
                                        <FormHelperText
                                          error={
                                            !!errors.distribution_channels?.[
                                              index
                                            ]?.price
                                          }
                                        >
                                          {errors.distribution_channels?.[index]
                                            ?.price &&
                                            errors.distribution_channels?.[
                                              index
                                            ]?.price?.message}
                                        </FormHelperText>
                                      </FormControl>
                                    </>
                                  )}
                                />
                              </Box>
                              {fields.length > 1 && index !== 0 && (
                                <IconButton onClick={() => remove(index)}>
                                  <Trash color="#F5222D" size={20} />
                                </IconButton>
                              )}
                            </Stack>
                          )
                        })}
                      </Box>
                      <ButtonCustom
                        size="large"
                        variant="outlined"
                        startIcon={<PlusCircle size={24} />}
                        onClick={() => {
                          append({
                            id: 0,
                            price: 0,
                          })
                        }}
                      >
                        {t('variantUpdate.addDistributionChannel')}
                      </ButtonCustom>
                    </CustomBox>
                  </>
                )
              }}
            />
          </Stack>
        </CustomStack>
        <CustomStack spacing={2} mb={2}>
          <Typography sx={{ fontWeight: 500 }}>
            {t('variantUpdate.description')}
          </Typography>
          <CustomBox>
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
                      {t('variantUpdate.description')}
                    </InputLabelCustom>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        id="description"
                        multiline
                        rows={4}
                        placeholder={t('variantUpdate.enterDescription')}
                        error={!!errors.description}
                        style={{
                          backgroundColor: '#ffffff',
                          marginBottom: '10px',
                        }}
                        {...field}
                      />
                      <Stack direction="row" spacing={2}>
                        <Warning color="#3F444D" size={18} />
                        <Typography sx={{ color: '#3F444D' }}>
                          {t('variantUpdate.maxLength_500Characters')}
                        </Typography>
                      </Stack>
                      <FormHelperText error={!!errors.description}>
                        {errors.description && `${errors.description.message}`}
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
                      {t('variantUpdate.longDescription')}
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
          </CustomBox>
        </CustomStack>

        <ButtonCustom variant="contained" type="submit">
          {t('variantUpdate.submit')}
        </ButtonCustom>
      </form>
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
            {t('variantUpdate.addNew')} {stateBrandOrManufacturer}
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
                          Category name
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
                          {t('variantUpdate.parentCategoryIfHave')}
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
                                    <div>{t('variantUpdate.selectValue')}</div>
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
                            ? 'Brand name'
                            : 'Manufacturer name'}
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
                {t('variantUpdate.cancel')}
              </ButtonCancel>
              <ButtonCustom variant="contained" size="large" type="submit">
                {t('variantUpdate.submit')}
              </ButtonCustom>
            </Stack>
          </DialogActionsTws>
        </form>
      </Dialog>
    </>
  )
}

export default UpdateVariantComponent
