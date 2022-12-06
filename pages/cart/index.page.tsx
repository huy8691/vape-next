import React, {
  // ChangeEvent,
  useEffect,
  useState,
} from 'react'
import { useContext } from 'react'
// next
import Image from 'next/image'
import Head from 'next/head'
// next

//layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { DrawerWidthContext } from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'
//mui
import {
  Box,
  Button,
  Checkbox,
  Fade,
  FormHelperText,
  IconButton,
  Modal,
  Paper,
  Popover,
  Skeleton,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'

//other

import { formatMoney } from 'src/utils/money.utils'
import { CurrencyCircleDollar, Warning, X } from 'phosphor-react'
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
import {
  deleteCartItem,
  getInstockAPI,
  updateQuantityProduct,
  verifyCartItem,
} from './cartAPI'
import { cartActions } from 'src/store/cart/cartSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { loadingActions } from 'src/store/loading/loadingSlice'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { invalidCartItemType, ArrayCartItem } from './cartModel'

//style
const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))

const IconButtonCustom = styled(IconButton)(({ theme }) => ({
  border:
    theme.palette.mode === 'dark'
      ? '1px solid rgba(255, 255, 255, 0.23)'
      : '1px solid #E1E6EF',
  borderRadius: '10px',
  padding: '5px',
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : '#fff',
  marginLeft: '10px',
  '& span': {
    fontSize: '1.6rem',
    color:
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.23)' : '#49516F',
  },
}))

const GridCustom = styled(Grid)(({ theme }) => ({
  border:
    theme.palette.mode === 'light'
      ? '1px solid #E1E6EF'
      : '1px solid rgba(255, 255, 255, 0.12)',
  borderRadius: '10px',
}))

const BoxModalCustom = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  borderRadius: '8px',
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
}))
const TypographyH6 = styled(Typography)(() => ({
  fontWeight: '400',
  fontSize: '1.6rem',
}))
const TotalCustom = styled(Box)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: '700',
  fontSize: '2rem',
}))
const TypographyCustom = styled(Typography)(() => ({
  color: '#BABABA',
  fontWeight: '400',
  fontSize: '1.4rem',
}))

const TypographyCurrentInstock = styled(Typography)(({ theme }) => ({
  fontWeight: '400',
  fontSize: '1.4rem',
  color: theme.palette.primary.main,
}))
const TypographyPrice = styled(Typography)(({ theme }) => ({
  fontWeight: '700',
  color: theme.palette.primary.main,
  textAlign: 'center',
}))
const BarCheckout = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  borderRadius: '0px',
}))
const StackQuantity = styled(Stack)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
  padding: theme.spacing(1),
}))
const ButtonRemove = styled(Button)(({ theme }) => ({
  color: theme.palette.error.main,
  textTransform: 'capitalize',
  textDecoration: 'underline',
}))
const StackStock = styled(Stack)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark' ? theme.palette.action.hover : '#F8F9FC',
  padding: '5px 10px',
  borderRadius: '8px',
  marginBottom: '10px',
}))
const DividerCustom = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  height: '10px',
  width: '1px',
}))

// validation quantity
const schema = yup
  .object({
    quantity: yup
      .number()
      .integer('Input must be an integer')
      .required('This field is required ')
      .max(1000000),
  })
  .required()

interface QuantityFormInput {
  quantity: number
}
//State use for select all checkbox

const Cart: NextPageWithLayout = () => {
  const drawerWidthContext = useContext(DrawerWidthContext)
  //dispatch
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const cart = useAppSelector((state) => state.cart)
  //state for instock
  const [instock, setInstock] = useState<number>()
  // state use for checkbox
  const [isCheckedListItem, setIsCheckedListItem] = useState<{
    [key: number]: boolean
  }>({})
  const [isCheckAll, setIsCheckAll] = useState(false)
  const [stateCartCheck, setStateCartCheck] = useState<CartType['items']>()
  const [flagUpdate, setFlagUpdate] = useState(false)
  //state use for modal
  const [currentProduct, setCurrentProduct] = useState<CartItem>()
  //state use for total
  const [total, setTotal] = useState<number>(0)
  // state use for popper
  const [anchorEl, setAnchorEl] = useState(null)
  // state use for temporary quantity
  const [tempQuantity, setTempQuantity] = useState<number>(0)
  // state use for temporary invalid item
  const [tempInvalid, setTempInvalid] = useState<ArrayCartItem>([0])
  //state use for child modal
  const [openChildModal, setOpenChildModal] = useState(false)
  const handleOpenChildModal = () => {
    setOpenChildModal(true)
  }
  const handleCloseChildModal = () => {
    setOpenChildModal(false)
  }

  useEffect(() => {
    // if (cart.data.items.length === 0) return

    if (flagUpdate) {
      // return
      const newArr = cart?.data?.items?.map((item) => {
        return {
          ...item,
          isCheck: isCheckedListItem[item.cartItemId],
        }
      })
      console.log('second')
      // if (newArr?.every((item) => item.isCheck == true)) {
      //   setIsCheckAll(true)
      // }
      setStateCartCheck(newArr)
      calculateTotal(newArr)
    } else {
      const newArr = cart?.data?.items?.map((item) => {
        return {
          ...item,
          isCheck: false,
        }
      })
      console.log('first')
      // setIsCheckAll(true)
      setStateCartCheck(newArr)
      calculateTotal(newArr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, flagUpdate])

  const handleClickCheckbox = (value: CartItem, e: any) => {
    const newState = stateCartCheck?.map((item) => {
      if (item.cartItemId === value.cartItemId) {
        return {
          ...item,
          isCheck: e.target.checked,
        }
      }
      return {
        ...item,
      }
    })
    if (newState?.every((arr) => arr.isCheck === true)) {
      setIsCheckAll(true)
    } else {
      setIsCheckAll(false)
    }
    setStateCartCheck(newState)
    setIsCheckedListItem({
      ...isCheckedListItem,
      [value.cartItemId]: e.target.checked,
    })
    calculateTotal(newState)
    console.log(newState)
  }

  // handle remove from cart
  //popper
  const handleClickRemoveButton = (event: any, values: CartItem) => {
    setCurrentProduct(values)
    setAnchorEl(event.currentTarget)
    // setOpenPopper((previousOpen) => !previousOpen)
  }
  //popover
  const openPopover = Boolean(anchorEl)
  const id = openPopover ? 'simple-popover' : undefined
  const handleClosePopover = () => {
    setAnchorEl(null)
  }
  const handleRemoveFromCart = () => {
    const deleteCartItemId = currentProduct?.cartItemId
    const arrNumber = [deleteCartItemId]
    dispatch(loadingActions.doLoading())
    deleteCartItem(arrNumber)
      .then(() => {
        setFlagUpdate(true)
        dispatch(cartActions.doCart())
        dispatch(
          notificationActions.doNotification({
            message: `Delete ${currentProduct?.productName} successfully`,
          })
        )
        handleCloseChildModal()
        handleCloseModal()
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(() => {
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: 'Somethings went wrong',
            type: 'error',
          })
        )
      })
  }
  const handleClickRemoveFromCart = () => {
    const deleteCartItemId = currentProduct?.cartItemId
    const arrNumber = [deleteCartItemId]
    dispatch(loadingActions.doLoading())
    deleteCartItem(arrNumber)
      .then(() => {
        handleClosePopover()
        setFlagUpdate(true)
        dispatch(cartActions.doCart())
        dispatch(
          notificationActions.doNotification({
            message: `Delete ${currentProduct?.productName} successfully`,
          })
        )
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(() => {
        handleClosePopover()
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: 'Somethings went wrong',
            type: 'error',
          })
        )
      })
  }

  // CheckallClickHandler
  const handleSelectAllCheckBox = (e: any) => {
    if (e.target.checked) {
      const newArr = stateCartCheck?.map((item) => {
        return { ...item, isCheck: true }
      })
      if (newArr) {
        let itemNew: any = {}
        newArr.forEach((item) => {
          itemNew = { ...itemNew, [item.cartItemId]: true }
        })

        setIsCheckedListItem({
          ...isCheckedListItem,
          ...itemNew,
        })
      }
      setTotal(Number(cart?.data?.totalPrice))
      setStateCartCheck(newArr)
      setIsCheckAll(!isCheckAll)
    } else {
      const newArr = stateCartCheck?.map((item) => {
        return { ...item, isCheck: false }
      })
      if (newArr) {
        let itemNew: any = {}
        newArr.forEach((item) => {
          itemNew = { ...itemNew, [item.cartItemId]: false }
        })
        setIsCheckedListItem({
          ...isCheckedListItem,
          ...itemNew,
        })
      }
      setStateCartCheck(newArr)
      setTotal(0)
      setIsCheckAll(!isCheckAll)
    }
  }
  // calculate total
  const calculateTotal = (newArr: CartType['items']) => {
    let tempTotal = 0
    newArr?.forEach((item: CartItem) => {
      if (item.isCheck) {
        tempTotal += item.subTotal
      }
    })
    setTotal(tempTotal)
  }

  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<QuantityFormInput>({
    resolver: yupResolver(schema),
    mode: 'all',
  })

  //close modal handler
  const handleCloseModal = () => {
    setOpen(false)
    clearErrors('quantity')
  }
  // event submit
  const onSubmit = (data: QuantityFormInput) => {
    console.log(data)
    if (getValues('quantity') > Number(instock)) {
      dispatch(
        notificationActions.doNotification({
          message: `The stock is not enough for your order, please decrease your product quantity`,
          type: 'error',
        })
      )
    } else if (getValues('quantity') == 0) {
      handleOpenChildModal()
    } else {
      dispatch(loadingActions.doLoading())
      updateQuantityProduct(
        {
          quantity: getValues('quantity'),
        },
        Number(currentProduct?.cartItemId)
      )
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          dispatch(cartActions.doCart())
          dispatch(
            notificationActions.doNotification({
              message: 'Update successfully',
            })
          )
          setFlagUpdate(true)
          handleCloseModal()
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
  const handleClickModalButton = (values: CartItem) => {
    setValue('quantity', values?.quantity || 0)
    setOpen(true)
    setCurrentProduct(values)
    setTempQuantity(values?.quantity)
    dispatch(loadingActions.doLoading())
    setInstock(0)
    getInstockAPI(values?.productId)
      .then((res) => {
        const { data } = res.data
        setInstock(data?.inStock)
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
  // handle change quantity value
  const handleOnChangeQuantity = (e: any) => {
    if (Number(e.target.value)) {
      setTempQuantity(Number(e.target.value))
    } else setTempQuantity(0)
  }
  const handleCheckOutButton = () => {
    if (stateCartCheck?.every((arr) => arr.isCheck === false)) {
      dispatch(
        notificationActions.doNotification({
          message: 'You must choose at least one items',
          type: 'error',
        })
      )
    } else {
      const checkedArr = stateCartCheck?.filter(function (item) {
        return item.isCheck === true
      })
      const listCartId: Array<number | undefined> = []
      checkedArr?.forEach((item: CartItem) => {
        listCartId.push(item.cartItemId)
      })
      verifyCartItem(listCartId)
        .then((res) => {
          const { data } = res.data
          console.log('data', data)
          dispatch(loadingActions.doLoadingSuccess())
          localStorage.setItem('listCartItemId', JSON.stringify(listCartId))
          router.push('/checkout')
        })
        .catch((error) => {
          const { data } = error.response.data
          const invalidListItem: Array<number> = []
          data.forEach((item: invalidCartItemType) => {
            invalidListItem.push(item.productId)
            console.log(item.productId)
          })
          setTempInvalid(invalidListItem)
          dispatch(loadingActions.doLoadingFailure())
          dispatch(
            notificationActions.doNotification({
              message: 'Some items in cart were invalid',
              type: 'error',
            })
          )
        })
    }
  }

  // render
  const SkeletonItemCart = () => {
    return (
      <Grid container spacing={2} mb={3} justifyContent="space-between">
        <Grid xs="auto" style={{ minWidth: '58px' }}>
          <Skeleton animation="wave" height={90} />
        </Grid>
        <Grid xs={4}>
          <Skeleton animation="wave" height={90} />
        </Grid>
        <Grid xs={2}>
          <Skeleton animation="wave" height={90} />
        </Grid>
        <Grid xs={2}>
          <Skeleton animation="wave" height={90} />
        </Grid>
        <Grid xs={2}>
          <Skeleton animation="wave" height={90} />
        </Grid>
        <Grid xs={1}>
          <Skeleton animation="wave" height={90} />
        </Grid>
      </Grid>
    )
  }
  if (cart?.data?.items?.length === 0) {
    return (
      <>
        <Head>
          <title>Cart | VAPE</title>
        </Head>
        <TypographyH2 variant="h2" mb={3}>
          Shopping cart
        </TypographyH2>
        <Grid container spacing={2} justifyContent="center">
          <Grid>
            <Stack p={5} spacing={2}>
              <Image
                src="/images/not-found.svg"
                alt="Logo"
                width="200"
                height="300"
              />
              <Typography variant="h6">
                You don’t have any products in yours Cart
              </Typography>
              <Link href="/browse-products">
                <ButtonCustom variant="contained" style={{ padding: '15px' }}>
                  <Typography style={{ fontWeight: '600' }}>
                    Search More
                  </Typography>
                </ButtonCustom>
              </Link>
            </Stack>
          </Grid>
        </Grid>
      </>
    )
  }
  return (
    <>
      <Head>
        <title>Cart | VAPE</title>
      </Head>
      <TypographyH2 variant="h2" mb={3}>
        Shopping cart
      </TypographyH2>
      <Grid container spacing={2} mb={2} justifyContent="space-between">
        <Grid xs="auto" style={{ minWidth: '58px' }}></Grid>
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
      {!cart?.data ? (
        SkeletonItemCart()
      ) : (
        <>
          {stateCartCheck?.map((item) => {
            if (
              tempInvalid.find((invalidId) => invalidId === item.productId) ===
              item.productId
            )
              return (
                <>
                  <GridCustom
                    spacing={2}
                    key={item?.cartItemId}
                    mb={3}
                    container
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ border: '1px solid #E02D3C', marginBottom: '0' }}
                  >
                    <Grid xs="auto">
                      <Checkbox
                        id={item?.cartItemId?.toString()}
                        onChange={(value) => handleClickCheckbox(item, value)}
                        checked={item?.isCheck}
                      />
                    </Grid>
                    <Grid xs={4}>
                      <Stack direction="row" spacing={2} alignItems="center">
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
                    <Grid xs={2} justifyContent="center">
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        gap={'5px'}
                      >
                        <Typography
                          style={{
                            fontWeight: '600',
                          }}
                        >
                          {formatMoney(item?.unitPrice)}
                        </Typography>
                        /
                        <Typography
                          style={{
                            textTransform: 'lowercase',
                            fontSize: '1.2rem',
                          }}
                        >
                          {item?.unitType}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={2}>
                      <StackQuantity
                        direction="row"
                        alignItems="center"
                        justifyContent="end"
                        spacing={1}
                        className={classes['stack-quantity']}
                      >
                        <Typography component="div">
                          {item?.quantity}
                        </Typography>
                        <DividerCustom />
                        <Typography
                          component="div"
                          className={classes['stack-quantity__unitType']}
                        >
                          {item?.unitType}
                        </Typography>
                        <IconButtonCustom
                          onClick={() => handleClickModalButton(item)}
                        >
                          <span className="icon-icon-edit"></span>
                        </IconButtonCustom>
                      </StackQuantity>
                    </Grid>
                    <Grid xs={2}>
                      <TypographyPrice>
                        {formatMoney(
                          Number(item?.quantity) * Number(item?.unitPrice)
                        )}
                      </TypographyPrice>
                    </Grid>
                    <Grid
                      xs={1}
                      style={{ display: 'flex' }}
                      justifyContent="flex-end"
                    >
                      <ButtonRemove
                        variant="text"
                        onClick={(e) => handleClickRemoveButton(e, item)}
                      >
                        Remove
                      </ButtonRemove>
                    </Grid>
                  </GridCustom>
                  <Box
                    display="flex"
                    alignItems="center"
                    sx={{ padding: '10px', marginBottom: '10px' }}
                  >
                    <Warning
                      size={16}
                      style={{ color: 'red', marginRight: '10px' }}
                    />

                    <Typography sx={{ color: 'red', fontSize: '12px' }}>
                      The product {item.productName} is no longer available
                    </Typography>
                  </Box>
                </>
              )
            else
              return (
                <GridCustom
                  spacing={2}
                  key={item?.cartItemId}
                  mb={3}
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid xs="auto">
                    <Checkbox
                      id={item?.cartItemId?.toString()}
                      onChange={(value) => handleClickCheckbox(item, value)}
                      checked={item?.isCheck}
                    />
                  </Grid>
                  <Grid xs={4}>
                    <Stack direction="row" spacing={2} alignItems="center">
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
                  <Grid xs={2} justifyContent="center">
                    <Stack
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      gap={'5px'}
                    >
                      <Typography
                        style={{
                          fontWeight: '600',
                        }}
                      >
                        {formatMoney(item?.unitPrice)}
                      </Typography>
                      /
                      <Typography
                        style={{
                          textTransform: 'lowercase',
                          fontSize: '1.2rem',
                        }}
                      >
                        {item?.unitType}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid xs={2}>
                    <StackQuantity
                      direction="row"
                      alignItems="center"
                      justifyContent="end"
                      spacing={1}
                      className={classes['stack-quantity']}
                    >
                      <Typography component="div">{item?.quantity}</Typography>
                      <DividerCustom />
                      <Typography
                        component="div"
                        className={classes['stack-quantity__unitType']}
                      >
                        {item?.unitType}
                      </Typography>
                      <IconButtonCustom
                        onClick={() => handleClickModalButton(item)}
                      >
                        <span className="icon-icon-edit"></span>
                      </IconButtonCustom>
                    </StackQuantity>
                  </Grid>
                  <Grid xs={2}>
                    <TypographyPrice>
                      {formatMoney(
                        Number(item?.quantity) * Number(item?.unitPrice)
                      )}
                    </TypographyPrice>
                  </Grid>
                  <Grid
                    xs={1}
                    style={{ display: 'flex' }}
                    justifyContent="flex-end"
                  >
                    <ButtonRemove
                      variant="text"
                      onClick={(e) => handleClickRemoveButton(e, item)}
                    >
                      Remove
                    </ButtonRemove>
                  </Grid>
                </GridCustom>
              )
          })}
        </>
      )}
      <Popover
        id={id}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
      >
        <Box sx={{ p: 3, boxShadow: 2 }}>
          <Typography mb={2}>
            Do you want to remove this item from cart ?
          </Typography>
          <Stack
            direction="row"
            justifyContent="flex-end"
            sx={{ p: 1 }}
            gap={2}
          >
            <ButtonCustom
              onClick={handleClickRemoveFromCart}
              variant="contained"
              size="small"
            >
              Yes
            </ButtonCustom>
            <ButtonCustom
              onClick={handleClosePopover}
              variant="contained"
              color="error"
              size="small"
            >
              Cancel
            </ButtonCustom>
          </Stack>
        </Box>
      </Popover>
      {/* <TypographyH2 variant="h2" mb={3}>
        Viewed Product
      </TypographyH2> */}
      {/* bar checkout */}
      <BarCheckout
        className={classes['checkout-bar']}
        style={{
          width: drawerWidthContext?.open
            ? `calc(100% - ${drawerWidthContext.drawerWidth}px`
            : `calc(100% - 65px)`,
        }}
      >
        <Grid
          container
          spacing={3}
          justifyContent="space-between"
          direction="row"
        >
          <Grid xs="auto">
            <Stack direction="row" spacing={2} alignItems="center">
              <Checkbox
                onChange={(e) => handleSelectAllCheckBox(e)}
                checked={isCheckAll}
              />
              <Typography>Select all product on cart</Typography>
            </Stack>
          </Grid>
          <Grid xs="auto">
            <Stack direction="row" spacing={2} alignItems="center">
              <CurrencyCircleDollar size={18} />
              <Typography>Total</Typography>
              <TotalCustom>{formatMoney(total)}</TotalCustom>
              {/* <Link href="/checkout">
                <a>
                 
                </a>
              </Link> */}
              <ButtonCustom
                variant="contained"
                size="large"
                onClick={handleCheckOutButton}
              >
                Checkout
              </ButtonCustom>
            </Stack>
          </Grid>
        </Grid>
      </BarCheckout>
      {/* popup */}
      <Modal
        open={open}
        onClose={handleCloseModal}
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
                <IconButton onClick={handleCloseModal}>
                  <X size={24} />
                </IconButton>
              </Stack>
              <form onSubmit={handleSubmit(onSubmit)}>
                <StackStock
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <TypographyCurrentInstock>
                    Current in stock
                  </TypographyCurrentInstock>
                  <div className={classes['popup-quantity__current-instock']}>
                    {instock}
                  </div>
                </StackStock>
                <Box mb={3}>
                  <Typography mb="5px">Quantity</Typography>
                  <TextFieldCustom
                    type="number"
                    placeholder="Ex: 1000"
                    fullWidth
                    min={0}
                    // inputProps={{ type: 'numeric' }}
                    {...register('quantity')}
                    error={!!errors.quantity}
                    onChange={(e: any) => {
                      if (e.target.value < 1000001) {
                        handleOnChangeQuantity(e)
                      }
                    }}
                    onKeyDown={(event) =>
                      ['e', 'E', '+', '-', ',', '.'].includes(event.key) &&
                      event.preventDefault()
                    }
                    inputProps={{ min: 0, max: 10000000 }}
                    className={classes['input-number']}
                  />
                  <FormHelperText error>
                    {errors.quantity?.message}
                  </FormHelperText>
                </Box>

                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <span className={classes['popup-quantity__subtotal-label']}>
                    Sub Total:{' '}
                  </span>
                  <div className={classes['popup-quantity__subtotal']}>
                    {formatMoney(
                      tempQuantity * Number(currentProduct?.unitPrice)
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
            <Modal
              open={openChildModal}
              onClose={handleCloseChildModal}
              aria-labelledby="child-modal-title"
              aria-describedby="child-modal-description"
            >
              <BoxModalCustom
                sx={{
                  width: '200px',
                  padding: '15px',
                  boxShadow:
                    '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19) ',
                }}
              >
                <p id="child-modal-description">
                  Are you sure to remove the product out of your cart?
                </p>
                <Stack direction="row">
                  <ButtonCustom
                    variant="contained"
                    onClick={handleCloseChildModal}
                    sx={{ background: 'gray' }}
                  >
                    Close
                  </ButtonCustom>
                  <ButtonCustom
                    variant="contained"
                    onClick={handleRemoveFromCart}
                    sx={{ marginLeft: '10px' }}
                  >
                    Confirm
                  </ButtonCustom>
                </Stack>
              </BoxModalCustom>
            </Modal>
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
