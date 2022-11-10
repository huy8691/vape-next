import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import RelatedProduct from './parts/relatedProduct'

import {
  getProductDetail,
  postWishList,
  getRelatedProduct,
} from './apiProductDetail'

import {
  ProductDetailType,
  ProductListDataResponseType,
} from './modelProductDetail'
import { formatMoney } from 'src/utils/money.utils'
import classes from './styles.module.scss'
// mui
import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'
import Skeleton from '@mui/material/Skeleton'
import Paper from '@mui/material/Paper'
import ButtonGroup from '@mui/material/ButtonGroup'

// layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'

// icon wishlist
import iconFavorite from './parts/icon/icon-favorite.svg'
import iconFavorited from './parts/icon/icon-favorited.svg'
//slick
import Slider from 'react-slick'

// other
import Link from 'next/link'
import { ShoppingCart } from 'phosphor-react'

// api
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'

// custom style
import { ButtonCustom, TextFieldCustom } from 'src/components'

// style
const TypographyH1 = styled(Typography)(() => ({
  fontSize: '32px',
  fontWeight: 'bold',
}))
const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))
const TypographyColor = styled('div')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  maxWidth: '100%',
}))

const TabPanelCustom = styled('div')(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
  padding: theme.spacing(2),
  minHeight: '300px',
}))

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  color: theme.palette.text.secondary,
  boxShadow: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  borderRadius: '4px',
}))
const CardCustom = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'light' ? '#F8F9FC' : theme.palette.action.hover,
  boxShadow: 'none',
  borderRadius: '10px',
}))
const StickyWrapper = styled('div')(() => ({
  position: 'sticky',
  top: '80px',
}))
const ButtonIncreaseDecrease = styled(Button)(({ theme }) => ({
  borderColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.23)'
      : 'rgba(0, 0, 0, 0.23)',
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: '15px',
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
}))
const IconButtonFavorite = styled(Button)(() => ({
  padding: '14px',
  borderRadius: '10px',
  minWidth: '50px',
}))
const TextFieldAddToCart = styled(TextFieldCustom)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '0px',
  },
}))

const ProductDetail: NextPageWithLayout = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [nav1, setNav1] = useState()
  const [nav2, setNav2] = useState()
  const [valueTab, setValueTab] = useState(0)
  const [stateProductDetail, setStateProductDetail] =
    useState<ProductDetailType>()
  const [relatedProducts, setRelatedProducts] =
    useState<ProductListDataResponseType>()
  const [isAddWistList, setIsAddWishList] = useState(false)
  const [total, setTotal] = useState(0)

  const settings1 = {
    slidesToShow: 1,
    dots: false,
    fade: true,
  }
  const settings2 = {
    dots: false,
    infinite:
      stateProductDetail?.images && stateProductDetail?.images?.length > 3
        ? true
        : false,
    slidesToShow: 3,
    slidesToScroll: 1,
    focusOnSelect: true,
    centerMode: true,
    arrows: false,
    centerPadding: '0px',
  }

  // tabs
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
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
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  const onSubmit = (values: any) => {
    console.log('4444', values)
    if (values.quantity > Number(stateProductDetail?.inStock)) {
      dispatch(
        notificationActions.doNotification({
          message: `Only ${stateProductDetail?.inStock} products left in stock`,
          type: 'error',
        })
      )
      return
    }
  }

  // Call api "get product detail" and assign variables
  useEffect(() => {
    if (router.query.id) {
      setStateProductDetail(undefined)
      dispatch(loadingActions.doLoading())
      getProductDetail(router?.query?.id)
        .then((res) => {
          const { data } = res.data
          setStateProductDetail(data)
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

      //
      setRelatedProducts(undefined)
      getRelatedProduct(router?.query?.id)
        .then((res) => {
          const data = res.data
          setRelatedProducts(data)
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
    }
  }, [router, dispatch])
  const handleWishList = () => {
    dispatch(loadingActions.doLoading())
    postWishList({ product: router?.query?.id })
      .then((res) => {
        const { data } = res
        console.log('dd', data)
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: data?.message ? data?.message : 'Success',
          })
        )
        setIsAddWishList(!isAddWistList)
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
  const handleChangeQuantityAddToCart = (e: any) => {
    if (stateProductDetail?.price) {
      setTotal(e * stateProductDetail.price)
    }
    if (Number(e) > Number(stateProductDetail?.inStock)) {
      dispatch(
        notificationActions.doNotification({
          message: `Only ${stateProductDetail?.inStock} products left in stock`,
          type: 'error',
        })
      )
      // setValue('number', stateProductDetail?.inStock)
      return
    }
  }
  const renderSlides1 = () => {
    if (!stateProductDetail?.images) {
      return <Skeleton animation="wave" variant="rounded" height={340} />
    }

    return (
      <Slider {...settings1} asNavFor={nav1} ref={(c: any) => setNav2(c)}>
        {stateProductDetail?.images.map((item: any, idx: number) => {
          return (
            <ImageWrapper key={idx}>
              <Image
                alt={stateProductDetail?.name}
                src={item}
                objectFit="contain"
                width={500}
                height={500}
              />
            </ImageWrapper>
          )
        })}
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
        {stateProductDetail?.images?.map((item: any, idx: number) => {
          return (
            <div
              key={idx}
              className={classes['product-detail__slick-carousel__item']}
            >
              <ImageWrapper>
                <Image
                  alt={stateProductDetail?.name}
                  src={item}
                  objectFit="contain"
                  width="130"
                  height="130"
                />
              </ImageWrapper>
            </div>
          )
        })}
      </Slider>
    )
  }
  //
  return (
    <div className={classes['product-detail']}>
      <Head>
        {/* <title>{dataProductDetail.data?.name} | VAPE</title> */}
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>
      <Grid container spacing={3} mb={5}>
        <Grid xs>
          <StickyWrapper>
            <CardCustom>
              <CardContent>
                <Box mb={2}>{renderSlides1()}</Box>
                <Box className={classes['product-detail__slick-carousel']}>
                  {renderSlides2()}
                </Box>
              </CardContent>
            </CardCustom>
          </StickyWrapper>
        </Grid>
        <Grid xs={6}>
          {stateProductDetail ? (
            <TypographyH2 variant="h2" mb={3}>
              Product details
            </TypographyH2>
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
          <Box mb={3}>
            {stateProductDetail ? (
              <Breadcrumbs separator=">" aria-label="breadcrumb">
                <Link href="/browse-products">
                  <a style={{ color: '#2F6FED', fontSize: '14px' }}>Home</a>
                </Link>
                {stateProductDetail?.category?.parent_category?.name && (
                  <Link
                    href={`/browse-products?page=1&category=${stateProductDetail.category.parent_category.id}&`}
                  >
                    <a style={{ color: '#2F6FED', fontSize: '14px' }}>
                      {stateProductDetail?.category?.parent_category?.name}
                    </a>
                  </Link>
                )}
                <Link
                  href={`/browse-products?page=1&category=${stateProductDetail?.category?.id}&`}
                >
                  <a style={{ color: '#2F6FED', fontSize: '14px' }}>
                    {stateProductDetail?.category?.name}
                  </a>
                </Link>
                <Link
                  href={`/product-detail/${stateProductDetail?.id}`}
                  style={{ fontSize: '14px' }}
                >
                  <>{stateProductDetail?.name}</>
                </Link>
              </Breadcrumbs>
            ) : (
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ fontSize: '14px' }}
              />
            )}
          </Box>
          <Box mb={3}>
            {stateProductDetail ? (
              <TypographyH1 variant="h1">
                {stateProductDetail?.name}
              </TypographyH1>
            ) : (
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ fontSize: '32px' }}
              />
            )}
          </Box>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
            mb={2}
          >
            {stateProductDetail ? (
              <Typography component="div" sx={{ fontWeight: 'bold' }}>
                {stateProductDetail?.code}
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
              <TypographyColor className={classes['product-detail__priceUnit']}>
                <span>{formatMoney(stateProductDetail?.price)}</span>
                <span className={classes['product-detail__priceUnit__unit']}>
                  /unit
                </span>
              </TypographyColor>
            ) : (
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ fontSize: '1.6rem' }}
                width="100%"
              />
            )}
          </Stack>
          {stateProductDetail ? (
            <Typography variant="body2" mb={2}>
              Short description: {stateProductDetail?.description}
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
                <Tab label="Overview" {...a11yProps(0)} />
                <Tab label="Specification" {...a11yProps(1)} />
                <Tab label="Reviews" {...a11yProps(2)} />
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
            {stateProductDetail ? (
              <>
                <TabPanel value={valueTab} index={0}>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: stateProductDetail?.longDescription!,
                    }}
                  />
                </TabPanel>
                <TabPanel value={valueTab} index={1}>
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2">Product name</Typography>
                      <Item>{stateProductDetail?.name}</Item>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Brand</Typography>
                      <Item>
                        <Image
                          alt={stateProductDetail?.brand?.name}
                          src={stateProductDetail?.brand?.logo}
                          objectFit="cover"
                          width="34"
                          height="34"
                        />
                        {stateProductDetail?.brand?.name}
                      </Item>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Manufacturer</Typography>
                      <Item>
                        <Image
                          alt={stateProductDetail?.manufacturer?.name}
                          src={stateProductDetail?.manufacturer?.logo}
                          objectFit="cover"
                          width="34"
                          height="34"
                        />
                        {stateProductDetail?.manufacturer?.name}
                      </Item>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Unit type</Typography>
                      <Item>{stateProductDetail?.unit_types}</Item>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2">Unit type</Typography>
                      <Item>{stateProductDetail?.unit_types}</Item>
                    </Box>
                  </Stack>
                </TabPanel>
                <TabPanel value={valueTab} index={2}>
                  Review
                </TabPanel>
              </>
            ) : (
              <Skeleton variant="rectangular" animation="wave" height={300} />
            )}
          </Box>
        </Grid>
        <Grid xs>
          <StickyWrapper>
            <Box mb={2}>
              {stateProductDetail ? (
                <CardCustom>
                  <CardContent style={{ paddingBottom: '16px' }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <div>Instock</div>
                      <TypographyColor>
                        {stateProductDetail?.inStock}
                      </TypographyColor>
                    </Stack>
                  </CardContent>
                </CardCustom>
              ) : (
                <Skeleton variant="rounded" animation="wave" height={56} />
              )}
            </Box>
            {stateProductDetail ? (
              <CardCustom>
                <CardContent>
                  <TypographyH2 mb={1}>Order This Product</TypographyH2>
                  <Typography component="div" sx={{ fontSize: 14 }} mb={2}>
                    Enter Number of [unit] you want to order
                  </Typography>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <Box mb={2}>
                      <Controller
                        control={control}
                        name="quantity"
                        render={({ field }) => (
                          <>
                            <FormControl fullWidth>
                              <ButtonGroup
                                variant="outlined"
                                aria-label="outlined button group"
                              >
                                <ButtonIncreaseDecrease
                                  disabled={
                                    getValues('quantity') < 2 ? true : false
                                  }
                                  onClick={() => {
                                    if (getValues('quantity') > 1) {
                                      handleChangeQuantityAddToCart(
                                        Number(getValues('quantity')) - 1
                                      )
                                      setValue(
                                        'quantity',
                                        Number(getValues('quantity')) - 1
                                      )
                                      trigger('quantity')
                                    }
                                  }}
                                >
                                  -
                                </ButtonIncreaseDecrease>
                                <TextFieldAddToCart
                                  className={classes['text-field-add-to-cart']}
                                  type="quantity"
                                  id="quantity"
                                  placeholder="Ex:100"
                                  error={!!errors.quantity}
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
                                  inputProps={{ min: 1, max: 100000 }}
                                  onChange={(event: any) => {
                                    if (event.target.value < 100001) {
                                      setValue('quantity', event.target.value)
                                      trigger('quantity')
                                      handleChangeQuantityAddToCart(
                                        event.target.value
                                      )
                                    }
                                  }}
                                />
                                <ButtonIncreaseDecrease
                                  onClick={() => {
                                    if (
                                      Number(getValues('quantity')) < 100000
                                    ) {
                                      handleChangeQuantityAddToCart(
                                        Number(getValues('quantity')) + 1
                                      )
                                      setValue(
                                        'quantity',
                                        Number(getValues('quantity')) + 1
                                      )
                                      trigger('quantity')
                                    }
                                  }}
                                >
                                  +
                                </ButtonIncreaseDecrease>
                              </ButtonGroup>
                            </FormControl>
                          </>
                        )}
                      />
                    </Box>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                      mb={1}
                    >
                      <div style={{ fontSize: '12px' }}>Total:</div>
                      <TypographyColor sx={{ fontSize: 24 }}>
                        <span>{formatMoney(total)}</span>
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
                        variant={isAddWistList ? `text` : `outlined`}
                      >
                        <Image
                          alt="icon-favorite"
                          src={isAddWistList ? iconFavorited : iconFavorite}
                          objectFit="contain"
                          width="20"
                          height="20"
                        />
                      </IconButtonFavorite>
                      <ButtonCustom
                        style={{ paddingTop: '11px', paddingBottom: '11px' }}
                        variant="contained"
                        size="large"
                        type="submit"
                        fullWidth
                        disabled={errors.number ? true : false}
                        startIcon={<ShoppingCart />}
                      >
                        Add To Cart
                      </ButtonCustom>
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
        {stateProductDetail ? (
          <TypographyH2 variant="h2" mb={2}>
            Related Products
          </TypographyH2>
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

        <RelatedProduct relatedProducts={relatedProducts} />
      </Box>
    </div>
  )
}

ProductDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default ProductDetail
