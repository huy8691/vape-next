import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Slider from 'react-slick'
// import RelatedProduct from './parts/relatedProduct'
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
import FormHelperText from '@mui/material/FormHelperText'
import Skeleton from '@mui/material/Skeleton'
import Paper from '@mui/material/Paper'

// layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'

// other
import { ShoppingCart, Heart } from 'phosphor-react'

// style
const TypographyH1 = styled(Typography)(() => ({
  fontSize: '32px',
}))
const TypographyH2 = styled(Typography)(() => ({
  fontSize: '20px',
}))

const TabPanelCustom = styled('div')(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
  padding: theme.spacing(2),
}))

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  color: theme.palette.text.secondary,
  boxShadow: 'none',
}))

// api
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'

// custom style
import { ButtonCustom, TextFieldCustom } from 'src/components'

const ProductDetail: NextPageWithLayout = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [nav1, setNav1] = useState()
  const [nav2, setNav2] = useState()
  const [value, setValue] = useState(0)
  const [stateProductDetail, setStateProductDetail] =
    useState<ProductDetailType>()

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  const detailSlide1 = {
    slidesToShow: 1,
    arrows: false,
    dots: false,
  }
  const detailSlide2 = {
    dots: true,
    // infinite:
    //   stateProductDetail?.images && stateProductDetail?.images?.length > 1
    //     ? true
    //     : false,
    slidesToShow: 3,
    slidesToScroll: 1,
    focusOnSelect: true,
    centerMode: true,
    centerPadding: '0px',
  }

  // tabs
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
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

  // form add to card
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
          dispatch(loadingActions.doLoadingFailure())
          dispatch(
            notificationActions.doNotification({
              message: data?.message ? data?.message : 'Error',
              type: 'error',
            })
          )
        })
    }
  }, [router])

  const renderSlides1 = () => {
    if (!stateProductDetail?.images) {
      return (
        <Skeleton animation="wave" variant="rounded" height={330} width={275} />
      )
    }
    if (stateProductDetail?.images.length === 0) {
      return (
        <div
          style={{
            width: '275px',
            height: '330px',
            backgroundColor: '#F8F9FC',
          }}
        ></div>
      )
    }

    return (
      <Slider {...settings}>
        {stateProductDetail?.images.map((item: any, idx: number) => {
          return (
            <div key={idx} style={{ width: '0px' }}>
              <Image
                alt={stateProductDetail?.name}
                src={item}
                objectFit="cover"
                width="275"
                height="330"
              />
            </div>
          )
        })}
      </Slider>
    )
  }

  return (
    <>
      <Head>
        {/* <title>{dataProductDetail.data?.name} | VAPE</title> */}
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid xs>
            <div className={classes.rowSlideShow}>
              {renderSlides1()}
              <div className={classes.slideShowSmall}>
                {/* <Slider
                  {...detailSlide2}
                  asNavFor={nav2}
                  ref={(c: any) => setNav1(c)}
                >
                  {stateProductDetail?.images?.map((item: any, idx: number) => {
                    return (
                      <div key={idx}>
                        <Image
                          alt={stateProductDetail.name}
                          src={item}
                          // objectFit="cover"
                          width="90"
                          height="90"
                        />
                      </div>
                    )
                  })}
                </Slider> */}
              </div>
            </div>
          </Grid>
          <Grid xs={6}>
            <TypographyH2 variant="h2" mb={2}>
              Product details
            </TypographyH2>
            <Breadcrumbs aria-label="breadcrumb" mb={2}>
              <Link underline="hover" color="inherit" href="/">
                MUI
              </Link>
              <Link
                underline="hover"
                color="inherit"
                href="/material-ui/getting-started/installation/"
              >
                Core
              </Link>
              <Link
                underline="hover"
                color="text.primary"
                href="/material-ui/react-breadcrumbs/"
                aria-current="page"
              >
                Breadcrumbs
              </Link>
            </Breadcrumbs>
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
                <div>{stateProductDetail?.code}</div>
              ) : (
                <Skeleton
                  animation="wave"
                  variant="text"
                  sx={{ fontSize: '1.6rem' }}
                  width="100%"
                />
              )}
              {stateProductDetail?.price ? (
                <div>
                  {formatMoney(stateProductDetail?.price)}/
                  {stateProductDetail?.unit_types}
                </div>
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
              <Typography variant="body2">
                {stateProductDetail?.description}
              </Typography>
            ) : (
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ fontSize: '1.4rem' }}
              />
            )}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
              >
                <Tab label="Overview" {...a11yProps(0)} />
                <Tab label="Specification" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Box sx={{ width: '100%' }}>
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
                    <Typography variant="subtitle2">Manufacturer</Typography>

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
                    <Typography variant="subtitle2">Unit type</Typography>

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
                </Stack>
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <div
                dangerouslySetInnerHTML={{
                  __html: stateProductDetail?.longDescription,
                }}
              />
            </TabPanel>
          </Grid>
          <Grid xs>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <div>Stock</div>
                  <div>{stateProductDetail?.inStock}</div>
                </Stack>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Typography variant="h5">Lizard</Typography>
                <Typography variant="h5" component="div" sx={{ fontSize: 14 }}>
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
                              error={!!errors.number}
                              {...field}
                            />
                            <FormHelperText error={!!errors.number}>
                              {errors.number && `${errors.number.message}`}
                            </FormHelperText>
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
                    mb={2}
                  >
                    <div>Total:</div>
                    <div>$0.00</div>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid xs="auto">
                      <ButtonCustom
                        variant="outlined"
                        size="large"
                        type="submit"
                        startIcon={<Heart />}
                      ></ButtonCustom>
                    </Grid>
                    <Grid xs>
                      <ButtonCustom
                        variant="contained"
                        size="large"
                        type="submit"
                        fullWidth
                        startIcon={<ShoppingCart />}
                      >
                        Add To Cart
                      </ButtonCustom>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

ProductDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default ProductDetail
