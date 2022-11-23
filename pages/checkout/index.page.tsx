// react
import React, { useState, useEffect } from 'react'

// react

// next
import Link from 'next/link'
import Image from 'next/image'
import Head from 'next/head'
import { useRouter } from 'next/router'
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
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
// mui

// form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './validations'

// api
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import { CartType, CartItem } from 'src/store/cart/cartModels'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
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
} from 'phosphor-react'
// other

// custom style
import { ButtonCustom, TextFieldCustom, InputLabelCustom } from 'src/components'

// style
import classes from './styles.module.scss'
// style

// custom style
const CardPage = styled(Card)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
  boxShadow: 'none',
}))
const CardCustom = styled(Card)(() => ({
  boxShadow: 'none',
}))
const ButtonCheckboxCustom = styled(ButtonCustom)(({ theme }) => ({
  boxShadow: 'none',
  borderRadius: '4px',
}))
const CardHeaderCustom = styled(CardHeader)(() => ({
  paddingBottom: '0px',
}))
const CardContentCustom = styled(CardContent)(({ theme }) => ({
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
// custom style

const Checkout: NextPageWithLayout = () => {
  const theme = useTheme()
  const cart = useAppSelector((state) => state.cart)
  const [stateInventoryList, setStateInventoryList] =
    useState<CartType['items']>()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })
  const dispatch = useAppDispatch()

  const onSubmit = (values: any) => {}

  useEffect(() => {
    // if (cart.data.items.length === 0) return
    if (cart?.data?.items) {
      setStateInventoryList(cart?.data?.items)
    }
  }, [cart])

  return (
    <div>
      <Head>
        <title>Checkout | Vape</title>
      </Head>
      <TypographyH1 variant="h1" mb={3}>
        Shopping cart
      </TypographyH1>
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
                        render={({ field }) => (
                          <>
                            <InputLabelCustom
                              htmlFor="phone_number"
                              error={!!errors.phone_number}
                            >
                              <span style={{ color: theme.palette.error.main }}>
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
                        )}
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
                      <Typography>Unit</Typography>
                    </Grid>
                    <Grid xs={2}>
                      <Typography>Price</Typography>
                    </Grid>
                  </Grid>
                  {stateInventoryList?.map((item: CartItem) => {
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
                        <Grid xs={2}>
                          <Typography>{item?.quantity}</Typography>
                        </Grid>

                        <Grid xs={2}>
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
                      <FormControlLabel
                        value="1"
                        control={
                          <ButtonCheckboxCustom size="small" variant="outlined">
                            Ship COD
                          </ButtonCheckboxCustom>
                        }
                        label=""
                      />
                      <FormControlLabel
                        value="2"
                        control={
                          <ButtonCheckboxCustom size="small" variant="outlined">
                            Visa/Master card
                          </ButtonCheckboxCustom>
                        }
                        disabled
                        label=""
                      />
                      <FormControlLabel
                        value="3"
                        control={
                          <ButtonCheckboxCustom size="small" variant="outlined">
                            E-Wallet
                          </ButtonCheckboxCustom>
                        }
                        disabled
                        label=""
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
                            <InputLabelCustom
                              htmlFor="note"
                              error={!!errors.note}
                            >
                              Address name
                            </InputLabelCustom>
                            <FormControl fullWidth>
                              <TextFieldCustom
                                id="note"
                                error={!!errors.note}
                                multiline
                                rows={2}
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
                        <Typography>$700.000,00</Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        mb={1}
                      >
                        <Typography>Total shipping</Typography>
                        <Typography>Free</Typography>
                      </Stack>
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        spacing={2}
                        mb={1}
                      >
                        <TypographyTotal>Total:</TypographyTotal>
                        <TypographyTotal>$700.000</TypographyTotal>
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
