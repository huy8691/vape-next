import React, {
  ChangeEvent,
  // ChangeEvent,
  useEffect,
  useState,
} from 'react'

//layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'
//mui
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Fade,
  FormHelperText,
  IconButton,
  Modal,
  Paper,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'

//other
import Image from 'next/image'
import { formatMoney } from 'src/utils/money.utils'
import edit from './parts/edit.svg'
import { CurrencyCircleDollar, X } from 'phosphor-react'
import { ButtonCustom, TextFieldCustom } from 'src/components'

// api
import { useAppDispatch, useAppSelector } from 'src/store/hooks'

import classes from './styles.module.scss'

// react-hook-form
import { useForm } from 'react-hook-form'
import { CartType, CartItem } from 'src/store/cart/cartModels'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
//api
import { getInstockAPI, updateQuantityProduct } from './CartAPI'
import { cartActions } from 'src/store/cart/cartSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { loadingActions } from 'src/store/loading/loadingSlice'

//style
const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))

const IconButtonCustom = styled(IconButton)(() => ({
  border: '1px solid #E1E6EF',
  borderRadius: '10px',
  padding: '5px',
  background: 'white',
  marginLeft: '10px',
}))

const GridCustom = styled(Grid)(() => ({
  border: '1px solid #E1E6EF',
  borderRadius: '10px',
}))

const BoxModalCustom = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  background: '#ffff',
}))
const TypographyH6 = styled(Typography)(() => ({
  fontWeight: '400',
  fontSize: '16px',
}))
// const TotalCustom = styled(Box)(() => ({
//   color: '#1CB25B',
//   fontWeight: '700',
//   fontSize: '20px',
// }))
const TypographyCustom = styled(Typography)(() => ({
  color: '#BABABA',
  fontWeight: '400',
  fontSize: '14px',
}))

const TypographyCurrentInstock = styled(Typography)(() => ({
  fontWeight: '400',
  fontSize: '14px',
}))

// dispatch

// validation quantity
const schema = yup
  .object({
    quantity: yup
      .number()
      .positive('Input must be positive')
      .integer('Input must be an integer')
      .required('This field is required '),
  })
  .required()

interface QuantityFormInput {
  quantity: number
}
//State use for select all checkbox

const Cart: NextPageWithLayout = () => {
  //dispatch
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const cart = useAppSelector((state) => state.cart)
  //state for instock
  const [instock, setInstock] = useState<number>()
  // state use for checkbox
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [stateCartCheck, setStateCartCheck] = useState<CartType['items']>()
  //state use for modal
  const [currentProductQuantity, setCurrentProductQuantity] =
    useState<CartItem>()
  //state use for total
  // const [total, setTotal] = useState<number>(0)
  const [subTotal, setSubtotal] = useState<number>(0)
  // assign list product in cart array then set it to state (list)

  useEffect(() => {
    if (cart.data.items.length === 0) return
    let newArr = cart?.data?.items?.map((item) => {
      return {
        ...item,
        isCheck: false,
      }
    })
    setStateCartCheck(newArr)
  }, [cart?.data?.items])

  // CheckBoxClickHandler
  const handleClickCheckbox = (value: CartItem) => {
    if (value.isCheck === false) {
      setIsCheckAll(false)
    }
    const newState = stateCartCheck?.map((item) => {
      if (item.cartItemId === value.cartItemId) {
        return { ...item, isCheck: !item.isCheck }
      }
      return { ...item }
    })
    setStateCartCheck(newState)
  }
  const handleSelectAllCheckBox = () => {
    setIsCheckAll(!isCheckAll)
    if (!isCheckAll) {
      const condition = (arr: CartItem) => arr.isCheck === true
      if (stateCartCheck?.some(condition)) {
        const newState = stateCartCheck?.map((item) => {
          if (item.isCheck === true) {
            return { ...item }
          } else {
            return { ...item, isCheck: true }
          }
        })
        setStateCartCheck(newState)
      } else {
        const newState = stateCartCheck?.map((item) => {
          return { ...item, isCheck: true }
        })
        setStateCartCheck(newState)
      }
    } else {
      const newState = stateCartCheck?.map((item) => {
        return { ...item, isCheck: false }
      })
      setStateCartCheck(newState)
    }
  }

  //close modal handler
  const handleClose = () => {
    setOpen(false)
  }

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<QuantityFormInput>({
    resolver: yupResolver(schema),
  })

  // event submit
  const onSubmit = (data: QuantityFormInput) => {
    console.log(data)
    if (getValues('quantity') > Number(instock)) {
      console.log('not enough')
      dispatch(
        notificationActions.doNotification({
          message: `Only ${instock} products left in stock`,
          type: 'error',
        })
      )
    } else {
      console.log(getValues('quantity'))

      updateQuantityProduct({
        quantity: getValues('quantity'),
        cartItemId: currentProductQuantity?.cartItemId,
      })
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          dispatch(cartActions.doCart())
          dispatch(
            notificationActions.doNotification({
              message: 'Update successfully',
            })
          )
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
  }

  // handle open / close modal
  const handleClickButton = (values: CartItem) => {
    setValue('quantity', values?.quantity || 0)
    setOpen(true)
    setCurrentProductQuantity(values)

    getInstockAPI(values?.productId)
      .then((res) => {
        const { data } = res.data
        setInstock(data?.inStock)
        console.log(instock)
      })
      .catch((error) => {
        const data = error.response?.data
        console.log(
          '🚀 ~ file: index.page.tsx ~ line 161 ~ getInstockAPI ~ data',
          data
        )
      })
  }
  // handle change quantity value
  const handleOnChangeQuantity = (e: any) => {
    if (Number(e.target.value)) {
      setSubtotal(Number(e.target.value))
    } else setSubtotal(0)
  }

  return (
    <>
      <TypographyH2 variant="h2" mb={3}>
        Cart
      </TypographyH2>
      <Grid container spacing={2} mb={2}>
        <Grid xs="auto"></Grid>
        <Grid xs={4}>
          <TypographyCustom>Product</TypographyCustom>
        </Grid>
        <Grid xs={2}>
          <TypographyCustom align="center">Price</TypographyCustom>
        </Grid>
        <Grid xs={2}>
          <TypographyCustom align="center">Quantity</TypographyCustom>
        </Grid>
        <Grid xs={2}>
          <TypographyCustom align="center">Subtotal</TypographyCustom>
        </Grid>
        <Grid xs={1}></Grid>
      </Grid>
      {stateCartCheck?.map((item) => {
        return (
          <GridCustom
            spacing={2}
            key={item?.cartItemId}
            mb={3}
            container
            direction="row"
            alignItems="center"
          >
            <Grid xs="auto">
              <Checkbox
                id={item?.cartItemId?.toString()}
                onChange={() => handleClickCheckbox(item)}
                checked={item?.isCheck}
              />
            </Grid>
            <Grid xs={4}>
              <Stack direction="row" spacing={2} alignItems="center">
                <div className={classes['image-wrapper']}>
                  <Image
                    src={item.productThumbnail}
                    alt="product"
                    width={80}
                    height={80}
                  />
                  {/* {item.productThumbnail} */}
                </div>
                <Typography component="div">{item?.productName}</Typography>
              </Stack>
            </Grid>
            <Grid xs={2}>
              <Typography component="div" style={{ textAlign: 'center' }}>
                {formatMoney(item?.unitPrice)}/{item?.unitType}
              </Typography>
            </Grid>
            <Grid xs={2}>
              <Paper
                elevation={0}
                style={{
                  background: '#F8F9FC',
                  maxWidth: '170px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Box
                  style={{
                    padding: '5px 10px',
                    borderRadius: '10px',
                  }}
                >
                  <Stack direction="row" alignItems="center">
                    {item?.quantity}
                    <Divider
                      orientation="vertical"
                      style={{
                        height: '14px',
                        background: '#1CB25B',
                        marginLeft: '10px',
                        marginRight: '10px',
                      }}
                      variant="middle"
                      flexItem
                    />
                    <Typography
                      component={'div'}
                      style={{
                        fontWeight: '400',
                        fontSize: '12px',
                        textTransform: 'lowercase',
                      }}
                    >
                      {item?.unitType}
                    </Typography>

                    <IconButtonCustom onClick={() => handleClickButton(item)}>
                      <Image
                        alt="icon edit"
                        src={edit}
                        objectFit="contain"
                        width={18}
                        height={18}
                      />
                    </IconButtonCustom>
                  </Stack>
                </Box>
              </Paper>
            </Grid>
            <Grid xs={2}>
              <Typography
                component={'div'}
                style={{
                  color: '#1CB25B',
                  fontWeight: '700',
                  textAlign: 'center',
                }}
              >
                {formatMoney(Number(item?.quantity) * Number(item?.unitPrice))}
              </Typography>
            </Grid>
            <Grid xs={1}>
              <Button
                variant="text"
                style={{
                  color: '#E02D3C',
                  textTransform: 'capitalize',
                  textDecoration: 'underline',
                }}
              >
                Remove
              </Button>
            </Grid>
          </GridCustom>
        )
      })}
      <TypographyH2 variant="h2" mb={3}>
        Viewed Product
      </TypographyH2>
      <div className={classes['checkout-bar']}>
        <Grid
          container
          spacing={3}
          justifyContent="space-between"
          direction="row"
        >
          <Grid xs="auto">
            <Stack direction="row" spacing={2} alignItems="center">
              <Checkbox
                checked={isCheckAll}
                onChange={handleSelectAllCheckBox}
              />
              <Box sx={{ marginLeft: '10px', marginRight: '10px' }}>
                Select all product on cart
              </Box>
            </Stack>
          </Grid>
          <Grid xs="auto">
            <Stack direction="row" spacing={2} alignItems="center">
              <CurrencyCircleDollar size={18} />
              <Typography>Total</Typography>
              {/* <TotalCustom>{formatMoney()}</TotalCustom> */}
              <ButtonCustom variant="contained" size="large">
                Checkout
              </ButtonCustom>
            </Stack>
          </Grid>
        </Grid>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
      >
        <Fade in={open}>
          <BoxModalCustom>
            <div className={classes['popup-quantity']}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <TypographyH6 id="modal-modal-title" variant="h6">
                  Adjust quantity
                </TypographyH6>
                <IconButton onClick={handleClose}>
                  <X size={24} />
                </IconButton>
              </Stack>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                  style={{
                    background: '#F8F9FC',
                    padding: '5px 10px',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    color: '#1CB25B',
                  }}
                >
                  <TypographyCurrentInstock>
                    Current in stock
                  </TypographyCurrentInstock>
                  <div className={classes['popup-quantity__current-instock']}>
                    {instock}
                  </div>
                </Stack>
                <Typography mb={1}>Quantity</Typography>
                <TextFieldCustom
                  type="number"
                  placeholder="Ex: 1000"
                  fullWidth
                  {...register('quantity')}
                  onChange={(e: ChangeEvent) => {
                    handleOnChangeQuantity(e)
                  }}
                  className={classes['input-number']}
                />
                <FormHelperText error>
                  {errors.quantity?.message}
                </FormHelperText>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <span>Sub Total: </span>
                  <div className={classes['modal-subtotal']}>
                    {formatMoney(
                      subTotal * Number(currentProductQuantity?.unitPrice)
                    )}
                  </div>
                </Stack>

                <Stack direction="row" justifyContent="center" mb={2}>
                  <ButtonCustom variant="contained" type="submit">
                    Apply
                  </ButtonCustom>
                </Stack>
              </form>
            </div>
          </BoxModalCustom>
        </Fade>
      </Modal>
    </>
  )
}
Cart.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Cart
