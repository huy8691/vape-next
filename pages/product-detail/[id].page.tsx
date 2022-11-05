import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import RelatedProduct from './parts/relatedProduct'

// import CommentProduct from './parts/commentProduct'
import { getProductDetail } from './apiProductDetail'

import { ProductDetailType } from './modelProductDetail'
// import { messageError } from 'src/constants/message.constant'
import { formatMoney } from 'src/utils/money.utils'
import classes from './styles.module.scss'

// mui
import Grid from '@mui/material/Unstable_Grid2'
import Box from '@mui/material/Box'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'
// import FormHelperText from '@mui/material/FormHelperText'
import Skeleton from '@mui/material/Skeleton'
import Paper from '@mui/material/Paper'
// import IconButton from '@mui/material/IconButton'

// layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'

//slick
import Slider from 'react-slick'

// other
import { ShoppingCart } from 'phosphor-react'

// style
const TypographyH1 = styled(Typography)(() => ({
  fontSize: '32px',
  fontWeight: 'bold',
}))
const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))
const TypographyColor = styled('div')(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 'bold',
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
const StyledTabs = styled(Tabs)(() => ({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 24,
    width: '100%',
    backgroundColor: '#34DC75',
    background: 'linear-gradient(93.37deg, #1cb35b 0%, #20b598 116.99%)',
  },
}))

// api
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
// import { notificationActions } from 'src/store/notification/notificationSlice'

// custom style
import { ButtonCustom, TextFieldCustom } from 'src/components'
import AddFavoriteButton from './parts/AddFavoriteButton'

const ProductDetail: NextPageWithLayout = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [nav1, setNav1] = useState()
  const [nav2, setNav2] = useState()
  const [value, setValue] = useState(0)
  const [stateProductDetail, setStateProductDetail] =
    useState<ProductDetailType>()

  const settings1 = {
    slidesToShow: 1,
    arrows: true,
    dots: false,
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
    setValue(newValue)
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
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = (values: any) => {
    console.log('4444', values)
  }

  // Call api "get product detail" and assign variables
  useEffect(() => {
    console.log('4444', router.query)
    if (router.query.id) {
      dispatch(loadingActions.doLoading())
      getProductDetail(router?.query?.id)
        .then((res) => {
          const { data } = res.data
          console.log('data', data)
          setStateProductDetail(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((error) => {
          const data = error.response?.data
          console.log(
            '🚀 ~ file: [id].page.tsx ~ line 183 ~ useEffect ~ data',
            data
          )

          dispatch(loadingActions.doLoadingFailure())
          // dispatch(
          //   notificationActions.doNotification({
          //     message: data?.message ? data?.message : 'Error',
          //     type: 'error',
          //   })
          // )
        })
    }
  }, [router, dispatch])

  const renderSlides1 = () => {
    if (!stateProductDetail?.images) {
      return (
        <Skeleton animation="wave" variant="rounded" height={460} width={296} />
      )
    }
    if (stateProductDetail?.images.length === 0) {
      return (
        <div
          style={{
            width: '296px',
            height: '340px',
            backgroundColor: '#F8F9FC',
          }}
        ></div>
      )
    }

    return (
      <Slider {...settings1} asNavFor={nav1} ref={(c: any) => setNav2(c)}>
        {stateProductDetail?.images.map((item: any, idx: number) => {
          return (
            <div key={idx}>
              <Image
                alt={stateProductDetail?.name}
                src={item}
                objectFit="contain"
                width="296"
                height="340"
              />
            </div>
          )
        })}
      </Slider>
    )
  }

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
          <CardCustom>
            <CardContent>
              <Box mb={2}>{renderSlides1()}</Box>
              <Box className={classes['product-detail__slick-carousel']}>
                <Slider
                  {...settings2}
                  asNavFor={nav2}
                  ref={(c: any) => setNav1(c)}
                >
                  {stateProductDetail?.images?.map((item: any, idx: number) => {
                    return (
                      <div key={idx}>
                        <Image
                          alt={stateProductDetail.name}
                          src={item}
                          objectFit="contain"
                          width="130"
                          height="130"
                        />
                      </div>
                    )
                  })}
                </Slider>
              </Box>
            </CardContent>
          </CardCustom>
        </Grid>
        <Grid xs={6}>
          <TypographyH2 variant="h2" mb={3}>
            Product details
          </TypographyH2>
          <Box mb={3}>
            <Breadcrumbs separator=">" aria-label="breadcrumb">
              <Link underline="hover" color="link" href="/">
                Home
              </Link>
              <Link
                underline="hover"
                color="text.primary"
                href="/material-ui/react-breadcrumbs/"
                aria-current="page"
              >
                {stateProductDetail?.name}
              </Link>
            </Breadcrumbs>
          </Box>
          <Box mb={3}>
            {stateProductDetail?.name ? (
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
            {stateProductDetail?.code ? (
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
            {stateProductDetail?.price ? (
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
          {stateProductDetail?.description ? (
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
            <StyledTabs
              value={value}
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
            <TabPanel value={value} index={0}>
              <div
                dangerouslySetInnerHTML={{
                  __html: stateProductDetail?.longDescription!,
                }}
              />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2">Product name</Typography>
                  {stateProductDetail?.name ? (
                    <Item>{stateProductDetail?.name}</Item>
                  ) : (
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      height={36.2}
                    />
                  )}
                </Box>
                <Box>
                  <Typography variant="subtitle2">Brand</Typography>
                  {stateProductDetail?.brand.name ? (
                    <Item>
                      <Image
                        alt={stateProductDetail?.brand?.name}
                        src={stateProductDetail.brand?.logo}
                        objectFit="cover"
                        width="34"
                        height="34"
                      />
                      {stateProductDetail?.brand?.name}
                    </Item>
                  ) : (
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      height={36.2}
                    />
                  )}
                </Box>
                <Box>
                  <Typography variant="subtitle2">Manufacturer</Typography>
                  {stateProductDetail?.manufacturer?.name ? (
                    <Item>
                      <Image
                        alt={stateProductDetail?.manufacturer?.name}
                        src={stateProductDetail.manufacturer?.logo}
                        objectFit="cover"
                        width="34"
                        height="34"
                      />
                      {stateProductDetail?.manufacturer?.name}
                    </Item>
                  ) : (
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      height={36.2}
                    />
                  )}
                </Box>
                <Box>
                  <Typography variant="subtitle2">Unit type</Typography>
                  {stateProductDetail?.unit_types ? (
                    <Item>{stateProductDetail?.unit_types}</Item>
                  ) : (
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      height={36.2}
                    />
                  )}
                </Box>
                <Box>
                  <Typography variant="subtitle2">Unit type</Typography>
                  {stateProductDetail?.unit_types ? (
                    <Item>{stateProductDetail?.unit_types}</Item>
                  ) : (
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      height={36.2}
                    />
                  )}
                </Box>
              </Stack>
            </TabPanel>
            <TabPanel value={value} index={2}></TabPanel>
          </Box>
        </Grid>
        <Grid xs>
          <Box mb={2}>
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
          </Box>

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
                    name="number"
                    render={({ field }) => (
                      <>
                        <FormControl fullWidth>
                          <TextFieldCustom
                            id="number"
                            placeholder="Ex:100"
                            error={!!errors.number}
                            {...field}
                          />
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
                  <div>Total:</div>
                  <TypographyColor sx={{ fontSize: 24 }}>$0.00</TypographyColor>
                </Stack>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <AddFavoriteButton></AddFavoriteButton>
                  <ButtonCustom
                    variant="contained"
                    size="large"
                    type="submit"
                    fullWidth
                    startIcon={<ShoppingCart />}
                  >
                    Add To Cart
                  </ButtonCustom>
                </Stack>
              </form>
            </CardContent>
          </CardCustom>
        </Grid>
      </Grid>
      <Box>
        <TypographyH2 variant="h2" mb={2}>
          Related Products
        </TypographyH2>
        <RelatedProduct />
      </Box>
    </div>
  )
}

ProductDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default ProductDetail
