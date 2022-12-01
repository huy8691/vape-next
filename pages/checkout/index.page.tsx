// react
import React, { useState, useEffect } from 'react'

// react

// next
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
// next

// mui
import { styled, useTheme } from '@mui/material/styles'
import {
  Box,
  FormHelperText,
  Stack,
  Card,
  CardHeader,
  CardContent,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Breadcrumbs,
  Modal,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
// mui

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'

// api
import { useAppDispatch } from 'src/store/hooks'
import { CartType, CartItem } from 'src/store/cart/cartModels'
// import { loadingActions } from 'src/store/loading/loadingSlice'
// import { notificationActions } from 'src/store/notification/notificationSlice'
// api

// layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'
// layout

// other
import { formatMoney } from 'src/utils/money.utils'
import {
  Car,
  MapPinLine,
  Cube,
  CurrencyCircleDollar,
  NoteBlank,
  Notepad,
  WarningCircle,
  Check,
  Warning,
} from 'phosphor-react'
// other

// custom style
import { ButtonCustom, TextFieldCustom, InputLabelCustom } from 'src/components'

// style
import classes from './styles.module.scss'
import {
  calculateOrderTotal,
  createOrderItem,
  getItemForCheckout,
  verifyCartItem,
} from './checkoutAPI'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import {
  CalculateOrderType,
  CreateOrderType,
  VerifyArrayCartItem,
} from './checkoutModel'
// import { useRouter } from 'next/router'
import { cartActions } from 'src/store/cart/cartSlice'
import { invalidCartItemType } from 'pages/cart/cartModel'
import { useRouter } from 'next/router'

// style

// custom style
const CardPage = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
  boxShadow: 'none',
}))
const CardCustom = styled(Card)(() => ({
  boxShadow: 'none',
  height: '100%',
}))
const ButtonCheckboxCustom = styled(ButtonCustom)(() => ({
  boxShadow: 'none',
  borderRadius: '4px',
}))
const CardHeaderCustom = styled(CardHeader)(() => ({
  paddingBottom: '0px',
}))
const CardContentCustom = styled(CardContent)(() => ({
  paddingBottom: '16px !important',
}))
const TypographyH1 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))
const TypographyPrice = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: '600',
  color: theme.palette.primary.main,
}))
const TypographyTotal = styled(Typography)(({ theme }) => ({
  fontSize: '1.8rem',
  fontWeight: '600',
  color: theme.palette.primary.main,
}))
const FormControlLabelCustom = styled(FormControlLabel)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '& .MuiTypography-root': {
    position: 'absolute',
    bottom: 0,
    right: 0,
    color: '#fff',
  },
  '&:before': {
    position: 'absolute',
    bottom: '-10px',
    right: '-15px',
    backgroundColor: theme.palette.primary.main,
    width: '20px',
    height: '30px',
    content: '""',
    transform: 'rotate(45deg)',
  },
}))
const BoxModalCustom = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  background: 'white',
  border: '1px solid #000',
  padding: '4px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}))
// custom style

const Checkout: NextPageWithLayout = () => {
  const theme = useTheme()
  const router = useRouter()
  // const cart = useAppSelector((state) => state.cart)

  const dispatch = useAppDispatch()
  const [stateInventoryList, setStateInventoryList] =
    useState<CartType['items']>()
  // state use for temporary invalid item
  const [tempInvalid, setTempInvalid] = useState<VerifyArrayCartItem>([0])
  const [stateCalculate, setStateCalculate] = useState<CalculateOrderType>()
  const [openModal, setOpenModal] = React.useState(false)
  const handleOpen = () => setOpenModal(true)
  const handleClose = () => setOpenModal(false)
  const {
    handleSubmit,
    control,
    getValues,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  })
  let listCartId: Array<number | undefined> = []
  stateInventoryList?.forEach((item: CartItem) => {
    listCartId.push(item.cartItemId)
  })
  console.log('list', listCartId)

  let objectOrder: CreateOrderType = {
    // default values for this phase
    shipping_method: 1,
    // default values for this phase
    payment_method: 1,
    cardItemIds: listCartId,
    notes: getValues('note'),
    address_name: getValues('address_name'),
    recipient_name: getValues('recipient_name'),
    phone_number: getValues('phone_number'),
    address: getValues('address'),
  }
  // const dispatch = useAppDispatch()
  const handleCheckout = () => {
    dispatch(loadingActions.doLoading())
    verifyCartItem(listCartId)
      .then((res) => {
        const { data } = res.data
        console.log('data', data)
        dispatch(loadingActions.doLoadingSuccess())
        handleOpen()
      })
      .catch((error) => {
        const { data } = error.response.data
        console.log('data', data)
        dispatch(loadingActions.doLoadingFailure())
        let invalidListItem: Array<number> = []
        data.forEach((item: invalidCartItemType) => {
          invalidListItem.push(item.productId)
          console.log(item.productId)
        })
        setTempInvalid(invalidListItem)
        dispatch(
          notificationActions.doNotification({
            message: error.message ? error.message : 'Somethings went wrong',
            type: 'error',
          })
        )
      })
  }
  const handleConfimCreateOrder = () => {
    dispatch(loadingActions.doLoading())
    createOrderItem(objectOrder)
      .then(() => {
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: 'Create order successfully',
          })
        )
        dispatch(cartActions.doCart())
        router.push('/order-success')
      })
      .catch((error) => {
        const { data } = error.response.data
        console.log(data)
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: error.message ? error.message : 'Somethings went wrong',
            type: 'error',
          })
        )
      })
  }
  const onSubmit = (values: any) => {
    console.log('đ', values)
    handleCheckout()
  }

  useEffect(() => {
    console.log('first render')
    var cartItem: Array<number | undefined> = JSON.parse(
      localStorage.getItem('listCartItemId') || '[]'
    )

    // check if local storage is empty => redirect to page cart
    if (cartItem.length === 0) {
      router.push('/cart')
    }

    getItemForCheckout(cartItem)
      .then((res) => {
        const { data } = res.data
        setStateInventoryList(data.items)
        console.log('data')
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch((error) => {
        const { data } = error.response.data
        console.log(
          '🚀 ~ file: index.page.tsx ~ line 256 ~ useEffect ~ data',
          data
        )
        dispatch(loadingActions.doLoadingFailure())
      })
    calculateOrderTotal(cartItem)
      .then((res) => {
        const { data } = res.data
        setStateCalculate(data)

        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: 'Success',
          })
        )
      })
      .catch((error) => {
        const { data } = error.response.data
        console.log(
          '🚀 ~ file: index.page.tsx ~ line 256 ~ useEffect ~ data',
          data
        )
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: 'Error',
            type: 'error',
          })
        )
      })

    // clean up
    return () => {
      // localStorage.removeItem('listCartItemId')
      console.log('effect')
    }
  }, [])

  return (
    <div>
      <Head>
        <title>Checkout | Vape</title>
      </Head>
      <TypographyH1 variant="h1" mb={3}>
        Shopping cart
      </TypographyH1>
      <Breadcrumbs
        separator=">"
        aria-label="breadcrumb"
        sx={{ marginBottom: '15px' }}
      >
        <Link href="/">
          <a style={{ color: '#2F6FED', fontSize: '1.4rem' }}>Market Place</a>
        </Link>
        <Link href="/cart">
          <a style={{ color: '#2F6FED', fontSize: '1.4rem' }}>Shopping Cart</a>
        </Link>
        <Link href="/checkout">
          <a style={{ fontSize: '1.4rem' }}>Checkout</a>
        </Link>
      </Breadcrumbs>
      <CardPage>
        <CardContentCustom>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box mb={2}>
              <CardCustom>
                <CardHeaderCustom
                  avatar={
                    <MapPinLine
                      size={20}
                      style={{ color: theme.palette.primary.main }}
                    />
                  }
                  title={<Typography>Shipping Address</Typography>}
                />
                <CardContentCustom>
                  <Grid container rowSpacing={3} columnSpacing={2}>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        name="address_name"
                        render={({ field }) => (
                          <>
                            <InputLabelCustom
                              htmlFor="address_name"
                              error={!!errors.address_name}
                            >
                              <span style={{ color: theme.palette.error.main }}>
                                *
                              </span>
                              Address name
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="address_name"
                                error={!!errors.address_name}
                                {...field}
                              />
                              <FormHelperText error={!!errors.address_name}>
                                {errors.address_name &&
                                  `${errors.address_name.message}`}
                              </FormHelperText>
                            </FormControl>
                          </>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        name="recipient_name"
                        render={({ field }) => (
                          <>
                            <InputLabelCustom
                              htmlFor="recipient_name"
                              error={!!errors.recipient_name}
                            >
                              <span style={{ color: theme.palette.error.main }}>
                                *
                              </span>
                              Receiver Name
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="recipient_name"
                                error={!!errors.recipient_name}
                                {...field}
                              />
                              <FormHelperText error={!!errors.recipient_name}>
                                {errors.recipient_name &&
                                  `${errors.recipient_name.message}`}
                              </FormHelperText>
                            </FormControl>
                          </>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        name="address"
                        render={({ field }) => (
                          <>
                            <InputLabelCustom
                              htmlFor="address"
                              error={!!errors.address}
                            >
                              <span style={{ color: theme.palette.error.main }}>
                                *
                              </span>
                              Address
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="address"
                                error={!!errors.address}
                                {...field}
                              />

                              <FormHelperText error={!!errors.address}>
                                {errors.address && `${errors.address.message}`}
                              </FormHelperText>
                            </FormControl>
                          </>
                        )}
                      />
                    </Grid>
                    <Grid xs={6}>
                      <Controller
                        control={control}
                        name="phone_number"
                        defaultValue=""
                        render={({ field }) => {
                          console.log(field)
                          return (
                            <>
                              <InputLabelCustom
                                htmlFor="phone_number"
                                error={!!errors.phone_number}
                              >
                                <span
                                  style={{ color: theme.palette.error.main }}
                                >
                                  *
                                </span>
                                Phone number
                              </InputLabelCustom>
                              <FormControl fullWidth>
                                <TextFieldCustom
                                  id="phone_number"
                                  error={!!errors.phone_number}
                                  {...field}
                                />
                                <FormHelperText error={!!errors.phone_number}>
                                  {errors.phone_number &&
                                    `${errors.phone_number.message}`}
                                </FormHelperText>
                              </FormControl>
                            </>
                          )
                        }}
                      />
                    </Grid>
                  </Grid>
                </CardContentCustom>
              </CardCustom>
            </Box>
            <Box mb={2}>
              <CardCustom>
                <CardHeaderCustom
                  avatar={
                    <Car
                      size={20}
                      style={{ color: theme.palette.primary.main }}
                    />
                  }
                  title={<Typography>Shipping Method </Typography>}
                />
                <CardContentCustom>
                  <Typography>
                    Basic Shipping |{' '}
                    <span style={{ color: theme.palette.primary.main }}>
                      Free
                    </span>
                  </Typography>
                </CardContentCustom>
              </CardCustom>
            </Box>

            <Box mb={2}>
              <CardCustom>
                <CardHeaderCustom
                  avatar={
                    <Cube
                      size={20}
                      style={{ color: theme.palette.primary.main }}
                    />
                  }
                  title={<Typography>Inventory </Typography>}
                />
                <CardContentCustom>
                  <Grid
                    spacing={2}
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="end"
                  >
                    <Grid xs={2}>
                      <Typography sx={{ textAlign: 'center' }}>Unit</Typography>
                    </Grid>
                    <Grid xs={2}>
                      <Typography sx={{ textAlign: 'center' }}>
                        Price
                      </Typography>
                    </Grid>
                  </Grid>
                  {stateInventoryList?.map((item: CartItem) => {
                    if (
                      tempInvalid.find(
                        (invalidId) => invalidId === item.productId
                      ) === item.productId
                    )
                      return (
                        <Grid
                          spacing={2}
                          key={item?.cartItemId}
                          mb={2}
                          container
                          direction="row"
                          alignItems="center"
                          justifyContent="end"
                          sx={{ background: '#FEF1F2' }}
                        >
                          <Grid xs>
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <div
                                className={classes['image-wrapper']}
                                style={{ opacity: '0.35' }}
                              >
                                <Link
                                  href={`/product-detail/${item?.productId.toString()}`}
                                >
                                  <a>
                                    <Image
                                      src={item.productThumbnail || ''}
                                      alt="product"
                                      width={80}
                                      height={80}
                                    />
                                  </a>
                                </Link>
                              </div>
                              <Stack>
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  alignItems="center"
                                  sx={{ marginBottom: '10px' }}
                                >
                                  <Typography
                                    component="div"
                                    sx={{ fontSize: '1.6rem', opacity: '0.35' }}
                                  >
                                    {item?.productCode}
                                  </Typography>
                                  <div style={{ opacity: '0.35' }}>|</div>
                                  <Link
                                    href={`/product-detail/${item?.productId.toString()}`}
                                  >
                                    <a>
                                      <Typography
                                        component="div"
                                        sx={{
                                          fontSize: '1.6rem',
                                          opacity: '0.35',
                                        }}
                                      >
                                        {item?.productName}
                                      </Typography>
                                    </a>
                                  </Link>
                                </Stack>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={1}
                                >
                                  <Warning size={18} style={{ color: 'red' }} />
                                  <Typography sx={{ color: 'red' }}>
                                    The product {item.productName} is no longer
                                    available{' '}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Stack>
                          </Grid>
                          <Grid xs={2}>
                            <Typography
                              sx={{ opacity: '0.35', textAlign: 'center' }}
                            >
                              {item?.quantity} unit
                            </Typography>
                          </Grid>

                          <Grid xs={2} sx={{ textAlign: 'center' }}>
                            <TypographyPrice sx={{ opacity: '0.35' }}>
                              {formatMoney(
                                Number(item?.quantity) * Number(item?.unitPrice)
                              )}
                            </TypographyPrice>
                          </Grid>
                        </Grid>
                      )
                    else
                      return (
                        <Grid
                          spacing={2}
                          key={item?.cartItemId}
                          mb={2}
                          container
                          direction="row"
                          alignItems="center"
                          justifyContent="end"
                        >
                          <Grid xs>
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                            >
                              <div className={classes['image-wrapper']}>
                                <Link
                                  href={`/product-detail/${item?.productId.toString()}`}
                                >
                                  <a>
                                    <Image
                                      src={item.productThumbnail || ''}
                                      alt="product"
                                      width={80}
                                      height={80}
                                    />
                                  </a>
                                </Link>
                              </div>

                              <Typography component="div">
                                {item?.productCode}
                              </Typography>
                              <div>|</div>
                              <Link
                                href={`/product-detail/${item?.productId.toString()}`}
                              >
                                <a>
                                  <Typography component="div">
                                    {item?.productName}
                                  </Typography>
                                </a>
                              </Link>
                            </Stack>
                          </Grid>
                          <Grid xs={2} sx={{ textAlign: 'center' }}>
                            <Typography>{item?.quantity} unit</Typography>
                          </Grid>

                          <Grid xs={2} sx={{ textAlign: 'center' }}>
                            <TypographyPrice>
                              {formatMoney(
                                Number(item?.quantity) * Number(item?.unitPrice)
                              )}
                            </TypographyPrice>
                          </Grid>
                        </Grid>
                      )
                  })}
                </CardContentCustom>
              </CardCustom>
            </Box>
            <Box mb={2}>
              <CardCustom>
                <CardContentCustom>
                  <Stack direction="row" alignItems="center" spacing={4}>
                    <Stack direction="row" spacing={2}>
                      <CurrencyCircleDollar
                        size={20}
                        style={{ color: theme.palette.primary.main }}
                      />
                      <Typography>Payment method:</Typography>
                    </Stack>
                    <RadioGroup defaultValue="1" name="payment_method" row>
                      <FormControlLabelCustom
                        value="1"
                        control={
                          <ButtonCheckboxCustom size="small" variant="outlined">
                            Ship COD
                          </ButtonCheckboxCustom>
                        }
                        label={<Check size={10} />}
                      />
                      <FormControlLabelCustom
                        value="2"
                        control={
                          <ButtonCheckboxCustom size="small" variant="outlined">
                            Visa/Master card
                          </ButtonCheckboxCustom>
                        }
                        disabled
                        label={<Check size={10} />}
                      />
                      <FormControlLabelCustom
                        value="3"
                        control={
                          <ButtonCheckboxCustom size="small" variant="outlined">
                            E-Wallet
                          </ButtonCheckboxCustom>
                        }
                        disabled
                        label={<Check size={10} />}
                      />
                    </RadioGroup>
                  </Stack>
                </CardContentCustom>
              </CardCustom>
            </Box>
            <Box mb={2}>
              <Grid container rowSpacing={3} columnSpacing={2}>
                <Grid xs={6}>
                  <CardCustom>
                    <CardHeaderCustom
                      avatar={
                        <NoteBlank
                          size={20}
                          style={{ color: theme.palette.primary.main }}
                        />
                      }
                      title={<Typography>Note for merchant </Typography>}
                    />
                    <CardContentCustom>
                      <Controller
                        control={control}
                        name="note"
                        render={({ field }) => (
                          <>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="note"
                                error={!!errors.note}
                                multiline
                                rows={3}
                                {...field}
                              />
                              <FormHelperText error={!!errors.note}>
                                {errors.note && `${errors.note.message}`}
                              </FormHelperText>
                            </FormControl>
                          </>
                        )}
                      />
                    </CardContentCustom>
                  </CardCustom>
                </Grid>
                <Grid xs={6}>
                  <CardCustom>
                    <CardHeaderCustom
                      avatar={
                        <Notepad
                          size={20}
                          style={{ color: theme.palette.primary.main }}
                        />
                      }
                      title={<Typography>Payment detail</Typography>}
                    />
                    <CardContentCustom>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        mb={1}
                      >
                        <Typography>Sub Total</Typography>
                        <Typography>
                          {formatMoney(stateCalculate?.sub_total)}
                        </Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        mb={1}
                      >
                        <Typography>Total shipping</Typography>
                        {stateCalculate?.delivery_fee === 0 ? (
                          <Typography>Free</Typography>
                        ) : (
                          <Typography>
                            {formatMoney(stateCalculate?.delivery_fee)}
                          </Typography>
                        )}
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        mb={1}
                      >
                        <TypographyTotal>Total:</TypographyTotal>
                        <TypographyTotal>
                          {formatMoney(stateCalculate?.total)}
                        </TypographyTotal>
                      </Stack>
                    </CardContentCustom>
                  </CardCustom>
                </Grid>
              </Grid>
            </Box>
            <Stack
              direction="row"
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack
                direction="row"
                spacing={1}
                justifyContent="space-between"
                alignItems="center"
              >
                <WarningCircle
                  size={20}
                  style={{ color: theme.palette.error.main }}
                />
                <Typography>
                  Clicking order means that you have read and understood{' '}
                  <Link href="/">
                    <a>the terms</a>
                  </Link>{' '}
                  of TWS Solutions
                </Typography>
              </Stack>

              <ButtonCustom variant="contained" size="large" type="submit">
                Check Out
              </ButtonCustom>
            </Stack>
            <Modal
              open={openModal}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <BoxModalCustom sx={{ border: 'none', borderRadius: '8px' }}>
                <Typography
                  id="modal-modal-description"
                  sx={{ mt: 2, mb: 2, fontSize: '20px' }}
                  alignSelf="center"
                >
                  Are you sure to place an order
                </Typography>
                <Stack direction="row" justifyContent="center" p={2}>
                  <ButtonCustom
                    variant="contained"
                    size="large"
                    onClick={handleClose}
                    sx={{
                      background: 'white',
                      border: '1px solid #49516F',
                      boxShadow: '0',
                    }}
                  >
                    <Typography variant="body1" sx={{ color: 'black' }}>
                      Cancel
                    </Typography>
                  </ButtonCustom>
                  <ButtonCustom
                    variant="contained"
                    size="large"
                    onClick={handleConfimCreateOrder}
                    sx={{ marginLeft: '10px' }}
                  >
                    Confirm
                  </ButtonCustom>
                </Stack>
              </BoxModalCustom>
            </Modal>
          </form>
        </CardContentCustom>
      </CardPage>
    </div>
  )
}

Checkout.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}

export default Checkout
