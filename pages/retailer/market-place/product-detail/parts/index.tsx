import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import defaultLogo from 'public/images/logo.svg'
import React, { useEffect, useState } from 'react'
import {
  addToCart,
  getDistributionChannelOfProduct,
  getProductDetailWithVariant,
  getRelatedProduct,
  putWishList,
} from '../apiProductDetail'
import RelatedProduct from './relatedProduct'

import { formatMoney } from 'src/utils/money.utils'
import {
  ArrayAddMultiVariantToCartType,
  DistributionOfProductType,
  ProductDetailWithVariant,
  ProductListDataResponseType,
} from '../modelProductDetail'
import classes from '../styles.module.scss'
// mui
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { styled } from '@mui/material/styles'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'

// form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { schemaAddToCart } from '../validations'

import iconFavorite from './icon/icon-favorite.svg'
// icon wishlist
import iconFavorited from './icon/icon-favorited.svg'
//slick
import Slider from 'react-slick'

// other
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

// api
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'

// custom style
import { LoadingButton } from '@mui/lab'
import {
  Breadcrumbs,
  FormControl,
  FormHelperText,
  MenuItem,
} from '@mui/material'
import { ShoppingCart } from '@phosphor-icons/react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { SelectCustom, TextFieldCustom } from 'src/components'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { cartActions } from 'src/store/cart/cartSlice'
import {
  handlerGetErrMessage,
  isEmpty,
  objToStringParam,
} from 'src/utils/global.utils'
import Link from 'next/link'
import SelectDistributionChannelComponent from './SelectDistributionChannel'
import { useTranslation } from 'react-i18next'

// style
const TypographyH1 = styled(Typography)(() => ({
  fontSize: '2.8rem',
  fontWeight: '700',
}))
const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))

const TabPanelCustom = styled('div')(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
  padding: theme.spacing(2),
  minHeight: '300px',
  borderRadius: '8px',
}))
const TextFieldAddToCart = styled(TextFieldCustom)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '0px',
  },
}))
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
  boxShadow: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  borderRadius: '4px',
}))
const CardCustom = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#F8F9FC' : theme.palette.action.hover,
  boxShadow: 'none',
  borderRadius: '10px',
  paddingBottom: theme.spacing(0),
}))
const StickyWrapper = styled('div')(() => ({
  position: 'sticky',
  top: '80px',
}))
const BoxSlick = styled(Box)(({ theme }) => ({
  borderTop:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(0, 0, 0, 0.23)'
      : '1px solid #E1E6EF',
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 24,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
    // background: 'linear-gradient(93.37deg, #1cb35b 0%, #20b598 116.99%)',
  },
}))

const ImageWrapper = styled('div')(() => ({
  background: 'white',
  cursor: 'pointer',
}))
const IconButtonFavorite = styled(Button)(() => ({
  padding: '14px',
  borderRadius: '10px',
  minWidth: '50px',
  border: '1px solid rgba(29, 180, 106, 0.5)',
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
const TypographyColor = styled('div')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: '100%',
}))
// type Props = {
//   category: ProductDetailType['category']
//   organization: ProductDetailType['organization']
// }
// const BreadcrumbsCategory = (props: Props) => {
//   return (
//     <Box
//       style={{
//         display: 'flex',
//         flexWrap: 'nowrap',
//       }}
//     >
//       {props.category?.parent_category?.id && (
//         <>
//           <BreadcrumbsCategory
//             category={props.category?.parent_category}
//             organization={props.organization}
//           />
//           <span
//             style={{
//               display: 'flex',
//               userSelect: 'none',
//               marginLeft: '8px',
//               marginRight: '8px',
//             }}
//           >
//             {'>'}
//           </span>
//         </>
//       )}
//       <Link
//         href={`/retailer/market-place/browse-products?page=1&category=category-${
//           props.category.id
//         }-parentId${
//           props.category.parent_category?.id
//             ? props.category.parent_category?.id
//             : ''
//         }-org${props.organization.id}-name${props.category.name}`}
//       >
//         <a style={{ color: '#2F6FED', fontSize: '1.4rem' }}>
//           {props.category.name}
//         </a>
//       </Link>
//     </Box>
//   )
// }

const ProductDetailComponent: React.FC = () => {
  const { t } = useTranslation('productDetail')

  const [pushMessage] = useEnqueueSnackbar()

  const router = useRouter()
  const dispatch = useAppDispatch()
  const [indexSlider1, setIndexSlider1] = useState(0)
  const [nav1, setNav1] = useState()
  const [nav2, setNav2] = useState()
  const [valueTab, setValueTab] = useState(0)
  const [stateProductDetail, setStateProductDetail] =
    useState<ProductDetailWithVariant>()
  const [relatedProducts, setRelatedProducts] =
    useState<ProductListDataResponseType>()

  const [stateVariantIndex, setStateVariantIndex] = useState<number>(0)
  const [stateLoadingAddToCart, setStateLoadingAddToCart] = useState(false)
  const cartItem = useAppSelector((state) => state.cart.data)
  const [stateListDistributionChannel, setStateListDistributionChannel] =
    useState<DistributionOfProductType[]>([])
  console.log('cartItem', cartItem)
  const handleChangeVariantIndex = (event: any) => {
    setStateVariantIndex(Number(event.target.value))
  }
  console.log('stateVariantIndex', stateVariantIndex)
  console.log('stateProductDetail', stateProductDetail)
  const handleFoundCurrentCartItem = (id: number) => {
    const foundCurrentItem = cartItem.items?.find(
      (item) => item.productId === id
    )
    if (foundCurrentItem && foundCurrentItem?.quantity > 99) {
      return '99+'
    }
    return foundCurrentItem?.quantity
  }
  const settings1 = {
    slidesToShow: 1,
    dots: false,
    fade: true,
    arrows: false,
    afterChange: (index: number) => {
      setIndexSlider1(index)
    },
  }

  const settings2 = {
    dots: true,
    infinite:
      stateProductDetail &&
      stateProductDetail.product_variant[stateVariantIndex].variant_images &&
      stateProductDetail.product_variant[stateVariantIndex].variant_images
        .length > 3
        ? true
        : false,
    slidesToShow: 3,
    slidesToScroll: 1,
    focusOnSelect: true,
    centerMode: true,
    arrows: false,
    centerPadding: '0px',
  }
  console.log('stateVariantIndex', stateVariantIndex)
  // tabs
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    console.log('event', event)
    setValueTab(newValue)
  }
  interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props
    return (
      <TabPanelCustom
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </TabPanelCustom>
    )
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  // form add to cart
  const {
    setValue,
    getValues,
    trigger,
    handleSubmit,
    register,

    control,
    formState: { errors },
  } = useForm<ArrayAddMultiVariantToCartType>({
    resolver: yupResolver(schemaAddToCart),
    mode: 'all',
  })
  const handleSubmitVariant = (value: ArrayAddMultiVariantToCartType) => {
    setStateLoadingAddToCart(true)
    console.log('value from submit variant', value)
    for (let i = 0; i < value.list_variants.length; i++) {
      const quantity = getValues(`list_variants.${i}.quantity`)
      const stockAll = getValues(`list_variants.${i}.stockAll`)
      if (Number(quantity) > Number(stockAll)) {
        pushMessage(t('pushMessage.inputQuantityHigherAvailability'), 'error')
        setStateLoadingAddToCart(false)
        return
      }
    }
    const filteredArray = value.list_variants.filter(
      (item) => Number(item.quantity) > 0
    )
    if (filteredArray.length === 0) {
      pushMessage(t('pushMessage.pleaseFillAtLeastOne'), 'error')
      setStateLoadingAddToCart(false)

      return
    }
    //TODO code here
    let checkEnableAddToCart = true
    filteredArray.every((item) => {
      const foundModule = cartItem.items?.findIndex(
        (element) => item.product_variant === Number(element.productId)
      )
      if (!cartItem.items) return true
      if (Number(foundModule) < 0) return true
      if (
        Number(item.quantity) +
          cartItem?.items?.[Number(foundModule)]?.quantity >
        Number(item.stockAll)
      ) {
        pushMessage(
          t('pushMessage.pleaseCheckProductVariantQuantity', {
            0: String(cartItem?.items?.[Number(foundModule)].productName),
          }),
          'error'
        )
        checkEnableAddToCart = false
        setStateLoadingAddToCart(false)

        return false
      }
    })
    console.log('filteredArray', filteredArray)
    if (checkEnableAddToCart) {
      const submitAddToCart: ArrayAddMultiVariantToCartType = {
        list_variants: filteredArray,
      }
      console.log('submit add to cart', submitAddToCart)
      addToCart(submitAddToCart)
        .then(() => {
          pushMessage(t('pushMessage.addToCartSuccess'), 'success')
          dispatch(cartActions.doCart())
          setStateLoadingAddToCart(false)
        })
        .catch(({ response }) => {
          const { status, data } = response

          setStateLoadingAddToCart(false)
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
  }

  // Call api "get product detail" and assign variables
  useEffect(() => {
    setValueTab(0)
    setStateVariantIndex(0)
    if (router.query.id) {
      // setStateProductDetail(undefined)
      getDistributionChannelOfProduct(Number(router.query.id))
        .then((res) => {
          const { data } = res.data
          setStateListDistributionChannel(data)
          getProductDetailWithVariant(Number(router?.query?.id), data[0].id)
            .then((res) => {
              const { data } = res.data
              setStateProductDetail(data)

              dispatch(loadingActions.doLoadingSuccess())
            })
            .catch(({ response }) => {
              // dispatch(loadingActions.doLoadingFailure())
              const { status, data } = response
              pushMessage(handlerGetErrMessage(status, data), 'error')
              // if (data.data.code === 'API035') {
              //   router.push('/403')
              // }
              if (status === 404) {
                router.push('/404')
              }
            })
        })
        .catch(({ response }) => {
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
      dispatch(loadingActions.doLoading())

      setRelatedProducts(undefined)
      getRelatedProduct(router?.query?.id)
        .then((res) => {
          const data = res.data
          setRelatedProducts(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id, dispatch])
  useEffect(() => {
    if (router.query.dc_id) {
      getProductDetailWithVariant(
        Number(router?.query?.id),
        Number(router.query.dc_id)
      )
        .then((res) => {
          const { data } = res.data
          setStateProductDetail(data)

          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch(({ response }) => {
          // dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
          // if (data.data.code === 'API035') {
          //   router.push('/403')
          // }
          if (status === 404) {
            router.push('/404')
          }
        })
    }
  }, [router.query.dc_id])
  // wishlist
  const handleWishList = () => {
    dispatch(loadingActions.doLoading())
    putWishList(
      Number(stateProductDetail?.product_variant[stateVariantIndex].variant_id)
    )
      .then((response) => {
        const { data } = response
        if (router.query.id) {
          // setStateProductDetail(undefined)
          getDistributionChannelOfProduct(Number(router.query.id))
            .then((res) => {
              const { data } = res.data
              setStateListDistributionChannel(data)
              getProductDetailWithVariant(Number(router?.query?.id), data[0].id)
                .then((res) => {
                  const { data } = res.data
                  setStateProductDetail(data)

                  dispatch(loadingActions.doLoadingSuccess())
                })
                .catch(({ response }) => {
                  // dispatch(loadingActions.doLoadingFailure())
                  const { status, data } = response
                  pushMessage(handlerGetErrMessage(status, data), 'error')
                  // if (data.data.code === 'API035') {
                  //   router.push('/403')
                  // }
                  if (status === 404) {
                    router.push('/404')
                  }
                })
            })
            .catch(({ response }) => {
              const { status, data } = response
              pushMessage(handlerGetErrMessage(status, data), 'error')
            })
          dispatch(loadingActions.doLoading())

          setRelatedProducts(undefined)
          getRelatedProduct(router?.query?.id)
            .then((res) => {
              const data = res.data
              setRelatedProducts(data)
              dispatch(loadingActions.doLoadingSuccess())
            })
            .catch(({ response }) => {
              dispatch(loadingActions.doLoadingFailure())
              const { status, data } = response
              pushMessage(handlerGetErrMessage(status, data), 'error')
            })
        }
        dispatch(loadingActions.doLoadingSuccess())
        pushMessage(`${data.message}`, 'success')
        // setIsAddWishList(!isAddWistList)
      })
      .catch((response) => {
        const { status, data } = response
        dispatch(loadingActions.doLoadingFailure())
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleCalculateTotal = () => {
    const temporaryListVariant = getValues('list_variants')
    if (
      temporaryListVariant.every(
        (item) =>
          item.quantity === 0 ||
          item.quantity === null ||
          item.quantity === undefined
      )
    ) {
      return formatMoney(0)
    }
    let totalPrice = 0
    stateProductDetail?.product_variant.forEach((item, index) => {
      if (
        getValues(`list_variants.${index}.quantity`) === undefined ||
        getValues(`list_variants.${index}.quantity`) === null
      ) {
        totalPrice += 0
      } else {
        totalPrice +=
          (typeof item.distribution_channels[0].price_discount !==
            'undefined' || item.distribution_channels[0].price_discount != null
            ? item.distribution_channels[0].price_discount
            : item.distribution_channels[0].price) *
          Number(getValues(`list_variants.${index}.quantity`))
      }
    })
    return formatMoney(totalPrice)
  }
  const renderSlides1 = () => {
    if (!stateProductDetail?.images) {
      return <Skeleton animation="wave" variant="rounded" height={340} />
    }

    return (
      <Slider {...settings1} asNavFor={nav1} ref={(c: any) => setNav2(c)}>
        {stateProductDetail.product_variant[stateVariantIndex].variant_images
          .length === 0 ? (
          <ImageWrapper>
            <PhotoProvider maskOpacity={0.5}>
              <PhotoView src={'/images/defaultProductImage.png'}>
                <Image
                  alt={stateProductDetail?.name}
                  src={'/' + '/images/defaultProductImage.png'}
                  objectFit="contain"
                  width={500}
                  height={500}
                />
              </PhotoView>
            </PhotoProvider>
          </ImageWrapper>
        ) : (
          stateProductDetail.product_variant[
            stateVariantIndex
          ].variant_images.map((item: any, idx: number) => {
            return (
              <ImageWrapper key={`slider-1-${idx}`}>
                <PhotoProvider maskOpacity={0.5}>
                  <PhotoView
                    src={
                      stateProductDetail.product_variant[stateVariantIndex]
                        .variant_images[indexSlider1]
                    }
                  >
                    <Image
                      alt={stateProductDetail?.name}
                      src={item}
                      objectFit="contain"
                      width={500}
                      height={500}
                    />
                  </PhotoView>
                </PhotoProvider>
              </ImageWrapper>
            )
          })
        )}
      </Slider>
    )
  }
  const renderSlides2 = () => {
    if (!stateProductDetail?.images) {
      return (
        <Skeleton
          animation="wave"
          variant="rounded"
          height={130}
          width={`calc(100% - 10px)`}
          style={{ marginLeft: '5px' }}
        />
      )
    }
    return (
      <Slider {...settings2} asNavFor={nav2} ref={(c: any) => setNav1(c)}>
        {stateProductDetail.product_variant[stateVariantIndex].variant_images
          .length === 0 ? (
          <ImageWrapper>
            <PhotoProvider maskOpacity={0.5}>
              <PhotoView src={'/images/defaultProductImage.png'}>
                <Image
                  alt={stateProductDetail?.name}
                  src={'/' + '/images/defaultProductImage.png'}
                  objectFit="contain"
                  width={500}
                  height={500}
                />
              </PhotoView>
            </PhotoProvider>
          </ImageWrapper>
        ) : (
          stateProductDetail.product_variant[
            stateVariantIndex
          ].variant_images.map((item: any, idx: number) => {
            return (
              <ImageWrapper key={`slider-1-${idx}`}>
                <Image
                  key={idx}
                  alt={stateProductDetail?.name}
                  src={item}
                  objectFit="contain"
                  width={500}
                  height={500}
                />
              </ImageWrapper>
            )
          })
        )}
      </Slider>
    )
  }
  useEffect(() => {
    if (!router.query.variant || !stateProductDetail) return
    const foundIndex = stateProductDetail?.product_variant.findIndex(
      (item) => item.variant_id === Number(router.query.variant)
    )
    if (foundIndex < 0) return

    setStateVariantIndex(foundIndex)
  }, [router.query.variant, stateProductDetail])
  //

  const handleOnChangeVariantSelect = (variant_id: number) => {
    router.replace(
      {
        search: `${objToStringParam({
          ...router.query,
          variant: variant_id,
        })}`,
      },
      undefined,
      { scroll: false }
    )
  }

  return (
    <>
      <div className={classes['product-detail']}>
        <Head>
          <title>{stateProductDetail?.name} | TWSS</title>
        </Head>

        <Grid container spacing={3} mb={5}>
          <Grid xs>
            <StickyWrapper>
              <CardCustom>
                <CardContent>
                  <Box mb={2} style={{ minHeight: '300px' }}>
                    {renderSlides1()}
                  </Box>
                  <BoxSlick />
                  <Box className={classes['product-detail__slick-carousel']}>
                    {renderSlides2()}
                  </Box>
                </CardContent>
              </CardCustom>
            </StickyWrapper>
          </Grid>
          <Grid xs={6}>
            {stateProductDetail ? (
              <Stack direction="row" justifyContent="space-between">
                <TypographyH2 variant="h2" sx={{ marginBottom: '15px' }}>
                  {t('productDetail')}
                </TypographyH2>
                <SelectDistributionChannelComponent
                  listDistribution={stateListDistributionChannel}
                />
              </Stack>
            ) : (
              <Box mb={1}>
                <Skeleton
                  animation="wave"
                  variant="text"
                  sx={{ fontSize: '3rem' }}
                  width={400}
                />
              </Box>
            )}
            {stateProductDetail ? (
              // <Breadcrumbs
              //   separator=">"
              //   aria-label="breadcrumb"
              //   sx={{ marginBottom: '15px' }}
              // >
              //   <Link
              //     href={
              //       Object.keys(stateProductDetail.category.parent_category)
              //         .length === 0
              //         ? `/retailer/market-place/browse-products?category=,category-${stateProductDetail.category.id}-parentId-org${stateProductDetail.category.organization_info.id}-name${stateProductDetail.category.name}`
              //         : `/retailer/market-place/browse-products?category=category-${stateProductDetail.category.parent_category.id}-parentId-org${stateProductDetail.category.parent_category.organization_info.id}-name${stateProductDetail.category.parent_category.name},category-${stateProductDetail.category.id}-parentId${stateProductDetail.category.parent_category.id}-org${stateProductDetail.category.organization_info.id}-name${stateProductDetail.category.name}`
              //     }
              //   >
              //     <a style={{ color: '#2F6FED' }}>
              //       {stateProductDetail.category.name}
              //     </a>
              //   </Link>
              //   <Typography>{stateProductDetail.name}</Typography>
              // </Breadcrumbs>
              <Breadcrumbs
                separator=">"
                aria-label="breadcrumb"
                sx={{ marginBottom: '15px' }}
              >
                <Link
                  href={`/retailer/market-place/browse-products?category_marketplace=${stateProductDetail?.category_marketplace?.id}`}
                >
                  <a style={{ color: '#2F6FED' }}>
                    {stateProductDetail?.category_marketplace?.name}
                  </a>
                </Link>
                <Typography>{stateProductDetail?.name}</Typography>
              </Breadcrumbs>
            ) : (
              <Skeleton
                sx={{ marginBottom: '15px' }}
                variant="rectangular"
                width="500px"
                height={16}
              />
            )}
            {/* <Box sx={{ marginBottom: '15px' }}>
              {stateProductDetail ? (
                <Breadcrumbs separator=">" aria-label="breadcrumb">
                  <BreadcrumbsCategory
                    category={stateProductDetail?.category}
                    organization={stateProductDetail?.organization}
                  />

                  <Link
                    href={`/retailer/market-place/product-detail/${stateProductDetail?.id}`}
                    style={{ fontSize: '1.4rem' }}
                  >
                    <>{stateProductDetail?.name}</>
                  </Link>
                </Breadcrumbs>
              ) : (
                <Skeleton
                  animation="wave"
                  variant="text"
                  sx={{ fontSize: '1.4rem' }}
                />
              )}
            </Box> */}
            <Box sx={{ marginBottom: '15px' }}>
              {stateProductDetail ? (
                <>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack spacing={2}>
                      <TypographyH1 variant="h1">
                        {stateProductDetail.name}
                      </TypographyH1>
                      {stateProductDetail.product_variant[0].attribute_options
                        .length > 0 && (
                        <Box>
                          <FormControl>
                            <SelectCustom
                              value={stateVariantIndex}
                              onChange={handleChangeVariantIndex}
                            >
                              {stateProductDetail.product_variant.map(
                                (element, index) => {
                                  return (
                                    <MenuItem
                                      key={index}
                                      value={index}
                                      onClick={() =>
                                        handleOnChangeVariantSelect(
                                          element.variant_id
                                        )
                                      }
                                    >
                                      <Stack
                                        key={index}
                                        direction="row"
                                        // sx={{
                                        //   border:
                                        //     stateVariantIndex !== index
                                        //       ? '1px solid #BABABA'
                                        //       : '',
                                        //   background:
                                        //     stateVariantIndex === index
                                        //       ? '#1DB46A'
                                        //       : '',
                                        //   padding: '10px',
                                        //   borderRadius: '5px',
                                        //   marginBottom: '10px',
                                        // }}
                                        spacing={2}
                                      >
                                        <Image
                                          alt="icon-favorite"
                                          src={
                                            element.variant_thumbnail
                                              ? element.variant_thumbnail
                                              : '/' +
                                                '/images/defaultProductImage.png'
                                          }
                                          objectFit="contain"
                                          width="25"
                                          height="25"
                                        />
                                        <Stack
                                          direction="row"
                                          spacing={2}
                                          alignItems="center"
                                        >
                                          {element.attribute_options.map(
                                            (obj, idx) => {
                                              return (
                                                <Stack
                                                  direction="row"
                                                  spacing={1}
                                                  key={idx}
                                                >
                                                  <Typography
                                                    sx={{
                                                      fontSize: '1.2rem',
                                                      fontWeight: 700,
                                                    }}
                                                  >
                                                    {obj.attribute}
                                                  </Typography>
                                                  <Typography
                                                    sx={{
                                                      fontSize: '1.2rem',
                                                      fontWeight: 300,
                                                    }}
                                                  >
                                                    {obj.option}
                                                  </Typography>
                                                </Stack>
                                              )
                                            }
                                          )}
                                        </Stack>
                                      </Stack>
                                    </MenuItem>
                                  )
                                }
                              )}
                            </SelectCustom>
                          </FormControl>
                          {/* <FormControl>
                            <RadioGroupCustom
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="controlled-radio-buttons-group"
                              value={stateVariantIndex}
                              onChange={handleChangeVariantIndex}
                            >
                              <Stack
                                direction="row"
                                spacing={1}
                                flexWrap={'wrap'}
                              >
                                {stateProductDetail.product_variant.map(
                                  (element, index) => {
                                    return (
                                      <FormControlLabel
                                        key={index}
                                        value={index}
                                        control={<Radio />}
                                        label={
                                          <Stack
                                            key={index}
                                            direction="row"
                                            sx={{
                                              border:
                                                stateVariantIndex !== index
                                                  ? '1px solid #BABABA'
                                                  : '',
                                              background:
                                                stateVariantIndex === index
                                                  ? '#1DB46A'
                                                  : '',
                                              padding: '10px',
                                              borderRadius: '5px',
                                              marginBottom: '10px',
                                            }}
                                            spacing={2}
                                          >
                                            <Image
                                              alt="icon-favorite"
                                              src={element.variant_thumbnail}
                                              objectFit="contain"
                                              width="25"
                                              height="25"
                                            />
                                            <Stack
                                              direction="row"
                                              spacing={2}
                                              alignItems="center"
                                            >
                                              {element.attribute_options.map(
                                                (obj, idx) => {
                                                  return (
                                                    <Stack
                                                      direction="row"
                                                      spacing={1}
                                                      key={idx}
                                                      sx={{
                                                        color:
                                                          stateVariantIndex ===
                                                          index
                                                            ? '#FFF'
                                                            : '#1B1F27',
                                                      }}
                                                    >
                                                      <Typography
                                                        sx={{
                                                          fontSize: '1.2rem',
                                                          fontWeight: 700,
                                                        }}
                                                      >
                                                        {obj.attribute}
                                                      </Typography>
                                                      <Typography
                                                        sx={{
                                                          fontSize: '1.2rem',
                                                          fontWeight: 300,
                                                        }}
                                                      >
                                                        {obj.option}
                                                      </Typography>
                                                    </Stack>
                                                  )
                                                }
                                              )}
                                            </Stack>
                                          </Stack>
                                        }
                                      />
                                    )
                                  }
                                )}
                              </Stack>


                            </RadioGroupCustom>
                          </FormControl> */}
                        </Box>
                      )}

                      {/* <Stack direction="row" spacing={1} flexWrap="wrap">
                        {stateProductDetail.product_variant.map(
                          (element, index) => {
                            return (
                              <Stack
                                key={index}
                                direction="row"
                                sx={{
                                  border:
                                    stateVariantIndex !== index
                                      ? '1px solid #BABABA'
                                      : '',
                                  background:
                                    stateVariantIndex === index
                                      ? '#1DB46A'
                                      : '',
                                  padding: '10px',
                                  borderRadius: '5px',
                                }}
                                spacing={2}
                              >
                                <Radio
                                  checked={stateVariantIndex === index}
                                  onChange={handleChangeVariantIndex}
                                  value={index}
                                  name="radio-buttons"
                                  inputProps={{ 'aria-label': 'A' }}
                                />
                                <Image
                                  alt="icon-favorite"
                                  src={element.variant_thumbnail}
                                  objectFit="contain"
                                  width="25"
                                  height="25"
                                />
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                >
                                  {element.attribute_options.map((obj, idx) => {
                                    return (
                                      <Stack
                                        direction="row"
                                        spacing={1}
                                        key={idx}
                                        sx={{
                                          color:
                                            stateVariantIndex === index
                                              ? '#FFF'
                                              : '#1B1F27',
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            fontSize: '1.2rem',
                                            fontWeight: 700,
                                          }}
                                        >
                                          {obj.attribute}
                                        </Typography>
                                        <Typography
                                          sx={{
                                            fontSize: '1.2rem',
                                            fontWeight: 300,
                                          }}
                                        >
                                          {obj.option}
                                        </Typography>
                                      </Stack>
                                    )
                                  })}
                                </Stack>
                              </Stack>
                            )
                          }
                        )}
                      </Stack> */}
                    </Stack>
                  </Stack>
                </>
              ) : (
                <Skeleton
                  animation="wave"
                  variant="text"
                  sx={{ fontSize: '3.2rem' }}
                />
              )}
            </Box>
            {stateProductDetail &&
              stateProductDetail.product_variant[0].attribute_options.length >
                0 && (
                <Stack spacing={2} sx={{ marginBottom: '20px' }}>
                  {stateProductDetail ? (
                    <Typography
                      component="div"
                      sx={{
                        fontWeight: '700',
                        fontSize: '18px',
                        color: '#BABABA',
                      }}
                    >
                      {
                        stateProductDetail.product_variant[stateVariantIndex]
                          .variant_name
                      }
                    </Typography>
                  ) : (
                    <Skeleton
                      animation="wave"
                      variant="text"
                      sx={{ fontSize: '1.6rem' }}
                      width="100%"
                    />
                  )}
                </Stack>
              )}

            <Stack direction="row" justifyContent="space-between">
              {stateProductDetail ? (
                <Typography
                  component="div"
                  sx={{ fontWeight: 'bold', fontSize: '18px' }}
                >
                  #
                  {
                    stateProductDetail?.product_variant[stateVariantIndex]
                      .variant_code
                  }
                </Typography>
              ) : (
                <Skeleton
                  animation="wave"
                  variant="text"
                  sx={{ fontSize: '1.6rem' }}
                  width="100%"
                />
              )}
              {stateProductDetail ? (
                <Stack direction="row" alignItems="baseline">
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography
                      component="div"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '2.4rem',
                        color: '#1DB46A',
                      }}
                    >
                      {!isEmpty(
                        stateProductDetail?.product_variant[stateVariantIndex]
                          .distribution_channels[0].price_discount
                      )
                        ? formatMoney(
                            stateProductDetail?.product_variant[
                              stateVariantIndex
                            ].distribution_channels[0].price_discount
                          )
                        : formatMoney(
                            stateProductDetail?.product_variant[
                              stateVariantIndex
                            ].distribution_channels[0].price
                          )}
                      /
                      {t(
                        `${stateProductDetail.unit_type.toLowerCase()}` as any
                      )}
                    </Typography>
                    {!isEmpty(
                      stateProductDetail?.product_variant[stateVariantIndex]
                        .distribution_channels[0].price_discount
                    ) && (
                      <Typography
                        sx={{
                          fontSize: '1.6rem',
                          color: '#1DB46A',

                          textDecoration: 'line-through',
                        }}
                      >
                        {formatMoney(
                          stateProductDetail?.product_variant[stateVariantIndex]
                            .distribution_channels[0].price
                        )}
                        /{stateProductDetail.unit_type.toLowerCase()}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              ) : (
                <Skeleton
                  animation="wave"
                  variant="text"
                  sx={{ fontSize: '1.6rem' }}
                  width="100%"
                />
              )}
            </Stack>

            {/* </Stack> */}
            {stateProductDetail ? (
              <Typography variant="body2" sx={{ marginBottom: '5px' }}>
                {t('shortDescription')}:{' '}
                {stateProductDetail?.product_variant[stateVariantIndex]
                  .variant_description
                  ? stateProductDetail?.product_variant[stateVariantIndex]
                      .variant_description
                  : 'N/A'}
              </Typography>
            ) : (
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ fontSize: '1.4rem' }}
              />
            )}

            <Box>
              {stateProductDetail ? (
                <StyledTabs
                  value={valueTab}
                  onChange={handleChangeTab}
                  aria-label="basic tabs example"
                  TabIndicatorProps={{
                    children: <span className="MuiTabs-indicatorSpan" />,
                  }}
                >
                  <Tab
                    sx={{ textTransform: 'capitalize' }}
                    label={t('overview')}
                    {...a11yProps(0)}
                  />
                  <Tab
                    sx={{ textTransform: 'capitalize' }}
                    label={t('specification')}
                    {...a11yProps(1)}
                  />
                  {/* <Tab label="Reviews" {...a11yProps(2)} /> */}
                </StyledTabs>
              ) : (
                <Box mb={1}>
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ fontSize: '3rem' }}
                    width={400}
                  />
                </Box>
              )}
              {/* {stateProductDetail ? (
      <>
        <TabPanel value={valueTab} index={0}>
          <div
            dangerouslySetInnerHTML={{
              __html: `${stateProductDetail?.longDescription}`,
            }}
          />
        </Box>
      )} */}
              {stateProductDetail ? (
                <>
                  <TabPanel value={valueTab} index={0}>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: `${
                          stateProductDetail.product_variant[stateVariantIndex]
                            .variant_longDescription
                            ? stateProductDetail.product_variant[
                                stateVariantIndex
                              ].variant_longDescription
                            : 'N/A'
                        }`,
                      }}
                    />
                  </TabPanel>
                  <TabPanel value={valueTab} index={1}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2">
                          {t('productName')}
                        </Typography>
                        <Item>{stateProductDetail?.name}</Item>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">
                          {t('brand')}
                        </Typography>
                        <Item>
                          <Image
                            alt={stateProductDetail?.brand?.name}
                            src={
                              stateProductDetail?.brand?.logo
                                ? stateProductDetail.brand.logo
                                : defaultLogo
                            }
                            objectFit="contain"
                            width="34"
                            height="34"
                          />

                          {stateProductDetail?.brand?.name}
                        </Item>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">
                          {t('manufacturer')}
                        </Typography>
                        <Item>
                          <Image
                            alt={stateProductDetail?.manufacturer?.name}
                            src={
                              stateProductDetail?.manufacturer?.logo
                                ? stateProductDetail.manufacturer.logo
                                : defaultLogo
                            }
                            objectFit="contain"
                            width="34"
                            height="34"
                          />
                          {stateProductDetail?.manufacturer?.name}
                        </Item>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">
                          {t('unitType')}
                        </Typography>
                        <Item>
                          {t(`${stateProductDetail?.unit_type}` as any)}
                        </Item>
                      </Box>
                      {/* <Box>
              <Typography variant="subtitle2">Unit type</Typography>
              <Item>{stateProductDetail?.unit_type}</Item>
            </Box> */}
                    </Stack>
                  </TabPanel>
                  {/* <TabPanel value={valueTab} index={2}>
            Review
          </TabPanel> */}
                </>
              ) : (
                <Skeleton variant="rectangular" animation="wave" height={300} />
              )}
            </Box>
          </Grid>
          <Grid xs={3}>
            <StickyWrapper>
              {stateProductDetail &&
                stateProductDetail.product_variant[0].attribute_options
                  .length === 0 && (
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{
                      background: '#F8F9FC',
                      padding: '5px 15px',
                      borderRadius: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600 }}>
                      {t('instock')}
                    </Typography>
                    <Typography sx={{ color: '#1DB46A', fontWeight: 700 }}>
                      {stateProductDetail?.product_variant[0].stockAll}
                    </Typography>
                  </Stack>
                )}
              {stateProductDetail ? (
                <CardCustom>
                  <CardContent>
                    {stateProductDetail.product_variant[0].attribute_options
                      .length === 0 ? (
                      <TypographyH2 mb={1}>
                        {t('orderThisProduct')}
                      </TypographyH2>
                    ) : (
                      <TypographyH2 mb={1}>{t('addToCart')}</TypographyH2>
                    )}

                    <Typography component="div" sx={{ fontSize: 14 }} mb={2}>
                      {t('enterNumberOf')}{' '}
                      {stateProductDetail.unit_type?.toLowerCase()}{' '}
                      {t('youWantToOrder')}
                    </Typography>
                    <form onSubmit={handleSubmit(handleSubmitVariant)}>
                      {stateProductDetail.product_variant[0].attribute_options
                        .length > 0 && (
                        <div className={classes['wrapper-add-to-cart']}>
                          <Stack spacing={2} mb={2}>
                            {stateProductDetail?.product_variant.map(
                              (item, index: number) => {
                                if (item.distribution_channels.length > 0) {
                                  setValue(
                                    `list_variants.${index}.distribution_channel`,
                                    router.query.dc_id
                                      ? Number(router.query.dc_id)
                                      : item.distribution_channels[0].id
                                  )
                                  setValue(
                                    `list_variants.${index}.product_variant`,
                                    item.variant_id
                                  )
                                  setValue(
                                    `list_variants.${index}.stockAll`,
                                    item.stockAll
                                  )
                                }
                                return (
                                  <Stack
                                    key={index}
                                    spacing={2}
                                    sx={{
                                      borderBottom: '1px dashed #BABABA',
                                      paddingBottom: '10px',
                                    }}
                                  >
                                    <Stack
                                      direction="row"
                                      spacing={2}
                                      alignItems="center"
                                      flexWrap="wrap"
                                    >
                                      <Image
                                        alt={item.variant_name}
                                        src={
                                          item.variant_thumbnail
                                            ? item.variant_thumbnail
                                            : '/' +
                                              '/images/defaultProductImage.png'
                                        }
                                        objectFit="contain"
                                        width="25"
                                        height="25"
                                      />
                                      {item.attribute_options.map(
                                        (element, idx) => {
                                          return (
                                            <Stack
                                              key={idx}
                                              direction="row"
                                              spacing={1}
                                            >
                                              <Typography
                                                sx={{
                                                  fontWeight: 700,
                                                  fontSize: '1.2rem',
                                                  color: '#1B1F27',
                                                }}
                                              >
                                                {element.attribute}
                                              </Typography>
                                              <Typography
                                                sx={{
                                                  fontWeight: 300,
                                                  fontSize: '1.2rem',
                                                  color: '#1B1F27',
                                                }}
                                              >
                                                {element.option}
                                              </Typography>
                                            </Stack>
                                          )
                                        }
                                      )}
                                    </Stack>
                                    <Stack
                                      direction="row"
                                      spacing={1}
                                      alignItems="center"
                                    >
                                      <Controller
                                        control={control}
                                        name={`list_variants.${index}.quantity`}
                                        render={({ field }) => (
                                          <>
                                            <FormControl fullWidth>
                                              <div
                                                className={
                                                  classes['input-number']
                                                }
                                              >
                                                <TextFieldAddToCart
                                                  className={
                                                    classes[
                                                      'text-field-add-to-cart'
                                                    ]
                                                  }
                                                  placeholder={t(
                                                    'enterQuantity'
                                                  )}
                                                  key={item.variant_id}
                                                  id={`list_variant.${index}.quantity`}
                                                  type="number"
                                                  {...register(
                                                    `list_variants.${index}.quantity`
                                                  )}
                                                  error={
                                                    errors.list_variants &&
                                                    !!errors.list_variants[
                                                      index
                                                    ]?.quantity
                                                  }
                                                  style={{
                                                    backgroundColor: '#ffffff',
                                                  }}
                                                  fullWidth
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
                                                  inputProps={{
                                                    min: 0,
                                                    max: 1000000,
                                                  }}
                                                  onChange={(e) => {
                                                    if (!e.target.value) {
                                                      // setValue(
                                                      //   `list_variants.${index}.quantity`,
                                                      //   ''
                                                      // )
                                                      setValue(
                                                        `list_variants.${index}.quantity`,

                                                        null
                                                      )
                                                    } else {
                                                      setValue(
                                                        `list_variants.${index}.quantity`,

                                                        Number(e.target.value)
                                                      )
                                                    }

                                                    trigger(
                                                      `list_variants.${index}.quantity`
                                                    )
                                                  }}
                                                />
                                              </div>

                                              <FormHelperText
                                                error={
                                                  errors.list_variants &&
                                                  !!errors.list_variants[index]
                                                    ?.quantity
                                                }
                                              >
                                                {errors.list_variants &&
                                                  !!errors.list_variants[index]
                                                    ?.quantity &&
                                                  errors.list_variants[index]
                                                    ?.quantity?.message}
                                              </FormHelperText>
                                            </FormControl>
                                          </>
                                        )}
                                      />
                                      <Box
                                        sx={{
                                          borderRadius: '99%',
                                          minHeight: '26px',
                                          minWidth: '26px',
                                          padding: '5px',
                                          background: '#1DB46A',

                                          position: 'relative',
                                        }}
                                      >
                                        <Typography
                                          sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%,-50%)',
                                            color: 'white',
                                            fontWeight: 700,
                                            fontSize: '1.2rem',
                                          }}
                                        >
                                          {typeof handleFoundCurrentCartItem(
                                            item.variant_id
                                          ) === 'undefined'
                                            ? 0
                                            : handleFoundCurrentCartItem(
                                                item.variant_id
                                              )}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                    <Stack
                                      direction="row"
                                      justifyContent="space-between"
                                    >
                                      <Stack direction="row" spacing={1}>
                                        <Typography sx={{ fontWeight: 700 }}>
                                          {t('instock')}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 300 }}>
                                          {item.stockAll}
                                        </Typography>
                                      </Stack>
                                      <Stack direction="row" spacing={1}>
                                        <Typography sx={{ fontWeight: 700 }}>
                                          {t('unitPrice')}
                                        </Typography>
                                        {!isEmpty(
                                          item.distribution_channels[0]
                                            .price_discount
                                        ) ? (
                                          <>
                                            <Stack
                                              direction="row"
                                              spacing={1}
                                              alignItems="baseline"
                                            >
                                              <Typography
                                                sx={{ fontWeight: 300 }}
                                              >
                                                {formatMoney(
                                                  item.distribution_channels[0]
                                                    .price_discount
                                                )}
                                              </Typography>
                                              <Typography
                                                sx={{
                                                  fontWeight: 300,
                                                  fontSize: '1rem',
                                                  textDecoration:
                                                    'line-through',
                                                }}
                                              >
                                                {formatMoney(
                                                  item.distribution_channels[0]
                                                    .price
                                                )}
                                              </Typography>
                                            </Stack>
                                          </>
                                        ) : (
                                          <>
                                            <Typography
                                              sx={{ fontWeight: 300 }}
                                            >
                                              {formatMoney(
                                                item.distribution_channels[0]
                                                  .price
                                              )}
                                            </Typography>
                                          </>
                                        )}
                                      </Stack>
                                    </Stack>
                                  </Stack>
                                )
                              }
                            )}
                          </Stack>
                        </div>
                      )}
                      {stateProductDetail.product_variant[0].attribute_options
                        .length === 0 && (
                        <Stack spacing={2} mb={2}>
                          {stateProductDetail?.product_variant.map(
                            (item, index: number) => {
                              if (item.distribution_channels.length > 0) {
                                setValue(
                                  `list_variants.${index}.distribution_channel`,
                                  item.distribution_channels[0].id
                                )
                                setValue(
                                  `list_variants.${index}.product_variant`,
                                  item.variant_id
                                )
                                setValue(
                                  `list_variants.${index}.stockAll`,
                                  item.stockAll
                                )
                              }
                              return (
                                <Stack key={index} spacing={2}>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    <Controller
                                      control={control}
                                      name={`list_variants.${index}.quantity`}
                                      render={({ field }) => (
                                        <>
                                          <FormControl fullWidth>
                                            <div
                                              className={
                                                classes['input-number']
                                              }
                                            >
                                              <TextFieldAddToCart
                                                className={
                                                  classes[
                                                    'text-field-add-to-cart'
                                                  ]
                                                }
                                                placeholder={t('enterQuantity')}
                                                key={item.variant_id}
                                                id={`list_variant.${index}.quantity`}
                                                type="number"
                                                {...register(
                                                  `list_variants.${index}.quantity`
                                                )}
                                                error={
                                                  errors.list_variants &&
                                                  !!errors.list_variants[index]
                                                    ?.quantity
                                                }
                                                style={{
                                                  backgroundColor: '#ffffff',
                                                }}
                                                fullWidth
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
                                                inputProps={{
                                                  min: 0,
                                                  max: 1000000,
                                                }}
                                                onChange={(e) => {
                                                  if (!e.target.value) {
                                                    // setValue(
                                                    //   `list_variants.${index}.quantity`,
                                                    //   ''
                                                    // )
                                                    setValue(
                                                      `list_variants.${index}.quantity`,

                                                      null
                                                    )
                                                  } else {
                                                    setValue(
                                                      `list_variants.${index}.quantity`,

                                                      Number(e.target.value)
                                                    )
                                                  }

                                                  trigger(
                                                    `list_variants.${index}.quantity`
                                                  )
                                                }}
                                              />
                                            </div>

                                            <FormHelperText
                                              error={
                                                errors.list_variants &&
                                                !!errors.list_variants[index]
                                                  ?.quantity
                                              }
                                            >
                                              {errors.list_variants &&
                                                !!errors.list_variants[index]
                                                  ?.quantity &&
                                                errors.list_variants[index]
                                                  ?.quantity?.message}
                                            </FormHelperText>
                                          </FormControl>
                                        </>
                                      )}
                                    />
                                    <Box
                                      sx={{
                                        borderRadius: '99%',
                                        height: '26px',
                                        padding: '10px',
                                        background: '#1DB46A',
                                        width: '26px',
                                        position: 'relative',
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          position: 'absolute',
                                          top: '50%',
                                          left: '50%',
                                          transform: 'translate(-50%,-50%)',
                                          color: 'white',
                                          fontWeight: 700,
                                          fontSize: '1.2rem',
                                        }}
                                      >
                                        {typeof handleFoundCurrentCartItem(
                                          item.variant_id
                                        ) === 'undefined'
                                          ? 0
                                          : handleFoundCurrentCartItem(
                                              item.variant_id
                                            )}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                </Stack>
                              )
                            }
                          )}
                        </Stack>
                      )}

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        mb={1}
                      >
                        <div style={{ fontSize: '12px' }}>{t('total')}:</div>
                        <TypographyColor sx={{ fontSize: 24 }}>
                          {handleCalculateTotal()}
                        </TypographyColor>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                      >
                        <IconButtonFavorite
                          onClick={handleWishList}
                          variant={
                            stateProductDetail.product_variant[
                              stateVariantIndex
                            ].is_favorite
                              ? `text`
                              : `outlined`
                          }
                        >
                          <Image
                            alt="icon-favorite"
                            src={
                              stateProductDetail.product_variant[
                                stateVariantIndex
                              ].is_favorite
                                ? iconFavorited
                                : iconFavorite
                            }
                            objectFit="contain"
                            width="18"
                            height="18"
                          />
                        </IconButtonFavorite>
                        <LoadingButtonCustom
                          style={{
                            paddingTop: '11px',
                            paddingBottom: '11px',
                          }}
                          variant="contained"
                          size="large"
                          type="submit"
                          loading={stateLoadingAddToCart}
                          loadingPosition="start"
                          fullWidth
                          startIcon={<ShoppingCart />}
                        >
                          {t('addToCart')}
                        </LoadingButtonCustom>
                      </Stack>
                    </form>
                  </CardContent>
                </CardCustom>
              ) : (
                <Skeleton variant="rounded" animation="wave" height={265} />
              )}
            </StickyWrapper>
          </Grid>
        </Grid>
        <Box>
          {relatedProducts?.data && relatedProducts?.data?.length > 0 ? (
            <>
              {stateProductDetail ? (
                <>
                  <TypographyH2 variant="h2" mb={2}>
                    {t('relatedProduct')}
                  </TypographyH2>
                  <RelatedProduct relatedProducts={relatedProducts} />
                </>
              ) : (
                <Box mb={1}>
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ fontSize: '2rem' }}
                    width={200}
                  />
                </Box>
              )}
            </>
          ) : (
            <></>
          )}
        </Box>
      </div>
    </>
  )
}

export default ProductDetailComponent
