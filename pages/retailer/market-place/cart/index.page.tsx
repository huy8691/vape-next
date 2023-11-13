import {
  useContext,
  // ChangeEvent,
  useEffect,
  useState,
} from 'react'
// next
import Head from 'next/head'
import Image from 'next/image'
// next

//layout
import type { NextPageWithLayout } from 'pages/_app.page'
import type { ReactElement } from 'react'
import NestedLayout, { DrawerWidthContext } from 'src/layout/nestedLayout'
//mui
import {
  Box,
  Checkbox,
  Fade,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  IconButton,
  Modal,
  Paper,
  Popover,
  Skeleton,
  Typography,
} from '@mui/material'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/system'

//other

import {
  CurrencyCircleDollar,
  NotePencil,
  TrashSimple,
  Warning,
  X,
} from '@phosphor-icons/react'
import {
  ButtonCustom,
  TextFieldCustom,
  TypographyH2,
  TypographyTitlePage,
} from 'src/components'
import { formatMoney } from 'src/utils/money.utils'

// api
import { useAppDispatch, useAppSelector } from 'src/store/hooks'

import classes from './styles.module.scss'

// react-hook-form
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { CartItem, CartType } from 'src/store/cart/cartModels'
import * as yup from 'yup'
//api
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEnqueueSnackbar } from 'src/components/enqueueSnackbar'
import { cartActions } from 'src/store/cart/cartSlice'
import { loadingActions } from 'src/store/loading/loadingSlice'
import {
  checkPermission,
  handlerGetErrMessage,
  isEmpty,
  KEY_MODULE,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import {
  deleteCartItem,
  getInstockAPI,
  updateQuantityProduct,
  verifyCartItem,
} from './cartAPI'
import { ArrayCartItem, invalidCartItemType } from './cartModel'
import { useTranslation } from 'react-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

//style

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

const BoxModalCustom = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '400px',
  background: 'white',
  borderStyle: 'none',
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: '10px',
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
      .typeError('Quantity must be a number')
      .integer('Quantity must be an integer')
      .required('Quantity is required')
      .max(1000000, 'Quantity must be between 1 and 1,000,000'),
  })
  .required()

interface QuantityFormInput {
  quantity: number
}
//State use for select all checkbox

const Cart: NextPageWithLayout = () => {
  const { t } = useTranslation('cart')

  const [pushMessage] = useEnqueueSnackbar()
  const drawerWidthContext = useContext(DrawerWidthContext)
  //dispatch
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const cart = useAppSelector((state) => state.cart)
  //state for instock
  const [instock, setInstock] = useState<number>()
  // state use for checkbox
  const [stateIsCheckedListItem, setStateIsCheckedListItem] = useState<{
    [key: number]: boolean
  }>({})
  const [stateIsCheckAll, setStateIsCheckAll] = useState(false)
  const [stateCartCheck, setStateCartCheck] = useState<CartType['items']>()
  const [stateFlagUpdate, setStateFlagUpdate] = useState(false)
  //state use for modal
  const [currentProduct, setCurrentProduct] = useState<CartItem>()
  //state use for total
  const [total, setTotal] = useState<number>(0)
  // state use for popper from material ui
  const [anchorEl, setAnchorEl] = useState(null)
  // state use for temporary quantity
  const [tempQuantity, setTempQuantity] = useState<number>(0)
  // state use for temporary invalid item
  const [tempInvalid, setTempInvalid] = useState<ArrayCartItem>([0])
  //state use for child modal
  const [openChildModal, setOpenChildModal] = useState(false)
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const [stateDeleteCurrentCartItem, setStateDeleteCurrentCartItem] =
    useState(false)
  const handleOpenChildModal = () => {
    setOpenChildModal(true)
  }
  const handleCloseChildModal = () => {
    setOpenChildModal(false)
  }

  useEffect(() => {
    // if (cart.data.items.length === 0) return
    let cartItem: any
    let fakeArr: Array<number>

    if (localStorage.getItem('ListCartItem')) {
      cartItem = JSON.parse(localStorage.getItem('ListCartItem') as string)
      fakeArr = cartItem[0]
    }

    if (stateFlagUpdate) {
      // return
      const newArr = cart?.data?.items?.map((item) => {
        // console.log('id', item.cartItemId)
        if (!fakeArr)
          return {
            ...item,
            isCheck: stateIsCheckedListItem[item.cartItemId],
          }
        if (
          fakeArr.find((items) => {
            return items === item.cartItemId
          })
        ) {
          return {
            ...item,
            isCheck: true,
          }
        }
        return {
          ...item,
          isCheck: stateIsCheckedListItem[item.cartItemId],
        }
      })
      // if (newArr?.every((item) => item.isCheck == true)) {
      //   setIsCheckAll(true)
      // }
      setStateCartCheck(newArr)
      calculateTotal(newArr)
    } else {
      const newArr = cart?.data?.items?.map((item) => {
        // console.log('item.cartItemId', item.cartItemId)
        if (!fakeArr)
          return {
            ...item,
            isCheck: false,
          }
        if (
          fakeArr.find((items) => {
            return items === item.cartItemId
          })
        ) {
          return {
            ...item,
            isCheck: true,
          }
        }
        return {
          ...item,
          isCheck: false,
        }
      })
      // setIsCheckAll(true)
      setStateCartCheck(newArr)
      calculateTotal(newArr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart, stateFlagUpdate])

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
      setStateIsCheckAll(true)
    } else {
      setStateIsCheckAll(false)
    }
    setStateCartCheck(newState)
    console.log('new State', newState)
    setStateIsCheckedListItem({
      ...stateIsCheckedListItem,
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

  useEffect(() => {
    if (localStorage.getItem('ListCartItem')) {
      const cartItem: Array<number> = JSON.parse(
        localStorage.getItem('ListCartItem') as string
      )
      console.log('no', cartItem)
    }

    // if (cart?.data?.items) {
    //   const arr: number[] = []
    //   cart?.data?.items.forEach((item) => arr.push(item.cartItemId))
    //   localStorage.setItem('listCartItemId', JSON.stringify(arr))
    // }
  }, [])
  useEffect(() => {
    localStorage.removeItem('order-success')
    // if (cart?.data?.items) {
    //   const arr: number[] = []
    //   cart?.data?.items.forEach((item) => arr.push(item.cartItemId))
    //   localStorage.setItem('listCartItemId', JSON.stringify(arr))
    // }
  }, [cart?.data?.items])
  useEffect(() => {
    dispatch(cartActions.doCart())
  }, [])
  const handleRemoveFromCart = () => {
    const deleteCartItemId = currentProduct?.cartItemId
    const arrNumber = [deleteCartItemId]
    dispatch(loadingActions.doLoading())
    deleteCartItem(arrNumber)
      .then(() => {
        setStateFlagUpdate(true)
        dispatch(cartActions.doCart())
        pushMessage(
          `Delete ${currentProduct?.productName} successfully`,
          'success'
        )
        handleCloseChildModal()
        handleCloseModal()
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleClickRemoveFromCart = () => {
    const deleteCartItemId = currentProduct?.cartItemId
    const arrNumber = [deleteCartItemId]
    dispatch(loadingActions.doLoading())
    deleteCartItem(arrNumber)
      .then(() => {
        handleClosePopover()
        setStateFlagUpdate(true)
        dispatch(cartActions.doCart())
        pushMessage(
          t('message.deleteCurrentProductProductNameSuccessfully', {
            0: String(currentProduct?.productName),
          }),
          'success'
        )
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        handleClosePopover()
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  const handleDeleteCurrentCartItem = () => {
    if (!stateCartCheck) return
    const arrCurrentCartItemID: number[] = []
    stateCartCheck.forEach((item) => {
      if (item.isCheck) {
        arrCurrentCartItemID.push(item.cartItemId)
      }
    })
    console.log('arrCurrentCartItemID', arrCurrentCartItemID)
    if (arrCurrentCartItemID && arrCurrentCartItemID?.length <= 0) return
    deleteCartItem(arrCurrentCartItemID)
      .then(() => {
        setStateDeleteCurrentCartItem(false)
        setStateFlagUpdate(true)
        dispatch(cartActions.doCart())
        pushMessage(t('message.deleteCartItemSuccessfully'), 'success')
        dispatch(loadingActions.doLoadingSuccess())
      })
      .catch(({ response }) => {
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
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

        setStateIsCheckedListItem({
          ...stateIsCheckedListItem,
          ...itemNew,
        })
      }
      setTotal(Number(cart?.data?.totalPrice))
      setStateCartCheck(newArr)
      setStateIsCheckAll(!stateIsCheckAll)
    } else {
      const newArr = stateCartCheck?.map((item) => {
        return { ...item, isCheck: false }
      })
      if (newArr) {
        let itemNew: any = {}
        newArr.forEach((item) => {
          itemNew = { ...itemNew, [item.cartItemId]: false }
        })
        setStateIsCheckedListItem({
          ...stateIsCheckedListItem,
          ...itemNew,
        })
      }
      setStateCartCheck(newArr)
      setTotal(0)
      setStateIsCheckAll(!stateIsCheckAll)
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
    trigger,
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
      pushMessage(
        t(
          'message.theStockIsNotEnoughForYourOrderPleaseDecreaseYourProductQuantity'
        ),
        'error'
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
          pushMessage(t('message.updateQuantitySuccessfully'), 'success')
          setStateFlagUpdate(true)
          handleCloseModal()
        })
        .catch(({ response }) => {
          dispatch(loadingActions.doLoadingFailure())
          const { status, data } = response
          pushMessage(handlerGetErrMessage(status, data), 'error')
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
      .catch(({ response }) => {
        handleClosePopover()
        dispatch(loadingActions.doLoadingFailure())
        const { status, data } = response
        pushMessage(handlerGetErrMessage(status, data), 'error')
      })
  }
  // handle change quantity value
  const handleOnChangeQuantity = (e: any) => {
    if (e.target.value) {
      setValue('quantity', Number(e.target.value))

      setTempQuantity(Number(e.target.value))
    } else setTempQuantity(0)
  }
  const handleCheckOutButton = () => {
    if (stateCartCheck?.every((arr) => arr.isCheck === false)) {
      pushMessage(t('message.youMustChooseAtLeastOneItems'), 'error')
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
          console.log(data)
          dispatch(loadingActions.doLoadingSuccess())
          localStorage.setItem('listCartItemId', JSON.stringify(listCartId))
          router.push('/retailer/market-place/checkout')
        })
        .catch((error) => {
          const { data } = error.response.data
          console.log('data', data)
          const invalidListItem: Array<number> = []
          data &&
            data.forEach((item: invalidCartItemType) => {
              invalidListItem.push(Number(item.productId))
              pushMessage(
                t(
                  'message.theStockForTheProductItemProductNameIsNotEnoughForYourOrder',
                  { 0: String(item.productName) }
                ),
                'error'
              )
            })
          setTempInvalid(invalidListItem)
          dispatch(loadingActions.doLoadingFailure())
        })
    }
  }
  const handleCheckEnableDeleteItemsFromCart = () => {
    if (!stateCartCheck) return true
    if (stateCartCheck?.some((item) => item.isCheck)) {
      return false
    }
    return true
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
          <title>{t('cart')} | TWSS</title>
        </Head>
        <TypographyTitlePage mb={2}>{t('shoppingCart')}</TypographyTitlePage>

        <Grid container spacing={2} justifyContent="center">
          <Grid>
            <Stack p={5} spacing={2}>
              <Image
                src={'/' + '/images/not-found.svg'}
                alt="Logo"
                width="200"
                height="300"
              />
              <Typography variant="h6">{t('cartEmpty')}</Typography>
              <Link href="/retailer/market-place/browse-products">
                <ButtonCustom variant="contained" style={{ padding: '15px' }}>
                  <Typography style={{ fontWeight: '600' }}>
                    {t('searchMore')}
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
        <title>{t('cart')} | TWSS</title>
      </Head>
      <TypographyTitlePage mb={2}>{t('shoppingCart')}</TypographyTitlePage>

      <Grid container spacing={2} mb={2} justifyContent="space-between">
        <Grid xs="auto" style={{ minWidth: '58px' }}></Grid>
        <Grid xs={4}>
          <TypographyCustom>{t('product')}</TypographyCustom>
        </Grid>
        <Grid xs={2}>
          <TypographyCustom align="center">{t('price')}</TypographyCustom>
        </Grid>
        <Grid xs={2}>
          <TypographyCustom align="center">{t('quantity')}</TypographyCustom>
        </Grid>
        <Grid xs={2}>
          <TypographyCustom align="center">{t('subtotal')}</TypographyCustom>
        </Grid>
        <Grid xs={1}></Grid>
      </Grid>
      <Box sx={{ paddingBottom: '60px' }}>
        {!cart?.data ? (
          SkeletonItemCart()
        ) : (
          <>
            {stateCartCheck?.map((item) => {
              if (
                tempInvalid.find(
                  (invalidId) => invalidId === item.productId
                ) === item.productId
              ) {
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
                            {checkPermission(
                              arrayPermission,
                              KEY_MODULE.Product,
                              PERMISSION_RULE.ViewDetails
                            ) ? (
                              <Link
                                href={`/retailer/market-place/product-detail/${item?.product.id}`}
                              >
                                <a>
                                  <Image
                                    src={
                                      item.productThumbnail
                                        ? item.productThumbnail
                                        : '/' +
                                          '/images/defaultProductImage.png'
                                    }
                                    alt="product"
                                    width={80}
                                    height={80}
                                  />
                                </a>
                              </Link>
                            ) : (
                              <Image
                                src={
                                  item.productThumbnail
                                    ? item.productThumbnail
                                    : '/' + '/images/defaultProductImage.png'
                                }
                                alt="product"
                                width={80}
                                height={80}
                              />
                            )}
                          </div>
                          {checkPermission(
                            arrayPermission,
                            KEY_MODULE.Product,
                            PERMISSION_RULE.ViewDetails
                          ) ? (
                            <Link
                              href={`/retailer/market-place/product-detail/${item?.product.id}`}
                            >
                              <a>
                                <Typography component="div">
                                  {item?.productName}
                                </Typography>
                              </a>
                            </Link>
                          ) : (
                            <Typography component="div">
                              {item?.productName}
                            </Typography>
                          )}
                        </Stack>
                      </Grid>
                      <Grid xs={2} justifyContent="center">
                        <Stack
                          direction="row"
                          justifyContent="center"
                          alignItems="center"
                          gap={'5px'}
                        >
                          {!isEmpty(item.price_discount) ? (
                            <>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="baseline"
                              >
                                <Typography
                                  sx={{
                                    fontWeight: '600',
                                  }}
                                >
                                  {formatMoney(item.price_discount)}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: '1rem',
                                    textDecoration: 'line-through',
                                  }}
                                >
                                  {' '}
                                  {formatMoney(item.unitPrice)}
                                </Typography>
                              </Stack>
                            </>
                          ) : (
                            <>
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
                                {t(`${item?.unitType}` as any)}
                              </Typography>
                            </>
                          )}
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
                            {t(`${item?.unitType}` as any)}
                          </Typography>
                          <IconButtonCustom
                            onClick={() => handleClickModalButton(item)}
                          >
                            <NotePencil
                              style={{ color: '#49516F' }}
                              weight="bold"
                              size={16}
                            />
                          </IconButtonCustom>
                        </StackQuantity>
                      </Grid>
                      <Grid xs={2}>
                        <TypographyPrice>
                          {!isEmpty(item.price_discount)
                            ? formatMoney(
                                Number(item?.quantity) *
                                  Number(item?.price_discount)
                              )
                            : formatMoney(
                                Number(item?.quantity) * Number(item?.unitPrice)
                              )}
                        </TypographyPrice>
                      </Grid>
                      <Grid
                        xs={1}
                        style={{ display: 'flex' }}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          sx={{ marginRight: '4px' }}
                          onClick={(e) => handleClickRemoveButton(e, item)}
                        >
                          <TrashSimple size={24} />
                        </IconButton>
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
                        {/* The product {item.productName} is no longer available */}
                        {t('productNotAvailable')}
                      </Typography>
                    </Box>
                  </>
                )
              } else {
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
                            href={`/retailer/market-place/product-detail/${item?.product.id}?variant=${item.productId}`}
                          >
                            <a>
                              <Image
                                src={
                                  item.productThumbnail
                                    ? item.productThumbnail
                                    : '/' + '/images/defaultProductImage.png'
                                }
                                alt="product"
                                width={80}
                                height={80}
                              />
                            </a>
                          </Link>
                        </div>
                        <Stack>
                          <Link
                            href={`/retailer/market-place/product-detail/${item?.product.id}?variant=${item.productId}`}
                          >
                            <a>
                              <Typography component="div">
                                {item?.productName}
                              </Typography>
                            </a>
                          </Link>
                          <Stack direction="row" spacing={2}>
                            {item.attribute_options.map((obj, idx) => {
                              return (
                                <Stack key={idx} direction="row" spacing={1}>
                                  <Typography
                                    sx={{
                                      color: '#1B1F27',
                                      fontWeight: 700,
                                      fontSize: '1.2rem',
                                    }}
                                  >
                                    {obj.attribute}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: '#1B1F27',
                                      fontWeight: 300,
                                      fontSize: '1.2rem',
                                    }}
                                  >
                                    {obj.option}
                                  </Typography>
                                </Stack>
                              )
                            })}
                          </Stack>

                          {/* <Typography sx={{ fontSize: '1.2rem ' }}>
                            {' '}
                            {fieldVariantName}{' '}
                          </Typography> */}
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid xs={2} justifyContent="center">
                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        gap={'5px'}
                      >
                        {!isEmpty(item.price_discount) ? (
                          <>
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="baseline"
                            >
                              <Typography
                                style={{
                                  fontWeight: '600',
                                }}
                              >
                                {formatMoney(item.price_discount)}
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: '1rem',
                                  textDecoration: 'line-through',
                                }}
                              >
                                {formatMoney(item.unitPrice)}
                              </Typography>
                            </Stack>
                          </>
                        ) : (
                          <>
                            {' '}
                            <Typography
                              style={{
                                fontWeight: '600',
                              }}
                            >
                              {formatMoney(item.unitPrice)}
                            </Typography>
                          </>
                        )}
                        /
                        <Typography
                          style={{
                            textTransform: 'lowercase',
                            fontSize: '1.2rem',
                          }}
                        >
                          {t(`${item?.unitType}` as any)}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid xs={2}>
                      <StackQuantity
                        direction="row"
                        alignItems="center"
                        justifyContent="end"
                        spacing={1}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => handleClickModalButton(item)}
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
                          {t(`${item?.unitType}` as any)}
                        </Typography>
                        <IconButtonCustom
                          onClick={() => handleClickModalButton(item)}
                        >
                          <NotePencil
                            style={{ color: '#49516F' }}
                            weight="bold"
                            size={16}
                          />
                        </IconButtonCustom>
                      </StackQuantity>
                    </Grid>
                    <Grid xs={2}>
                      <TypographyPrice>
                        {!isEmpty(item.price_discount)
                          ? formatMoney(
                              Number(item?.quantity) *
                                Number(item?.price_discount)
                            )
                          : formatMoney(
                              Number(item?.quantity) * Number(item?.unitPrice)
                            )}
                      </TypographyPrice>
                    </Grid>
                    <Grid
                      xs={1}
                      style={{ display: 'flex' }}
                      justifyContent="flex-end"
                    >
                      <IconButton
                        sx={{ marginRight: '4px' }}
                        onClick={(e) => handleClickRemoveButton(e, item)}
                      >
                        <TrashSimple size={24} />
                      </IconButton>
                    </Grid>
                  </GridCustom>
                )
              }
            })}
          </>
        )}
      </Box>

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
          <Typography mb={2}>{t('askForRemoveItem')}</Typography>
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
              {t('yes')}
            </ButtonCustom>
            <ButtonCustom
              onClick={handleClosePopover}
              variant="contained"
              color="error"
              size="small"
            >
              {t('cancel')}
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
              <Box>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={(e) => handleSelectAllCheckBox(e)}
                        checked={stateIsCheckAll}
                      />
                    }
                    label={t('selectAllProductOnCart')}
                  ></FormControlLabel>
                </FormGroup>
              </Box>

              {/* <Typography>Select all product on cart</Typography> */}
              <ButtonCustom
                onClick={() => {
                  setStateDeleteCurrentCartItem(true)
                }}
                disabled={handleCheckEnableDeleteItemsFromCart()}
              >
                {t('deleteCheckedItem')}
              </ButtonCustom>
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
                {t('checkout')}
              </ButtonCustom>
            </Stack>
          </Grid>
        </Grid>
      </BarCheckout>
      {/* popup */}
      <Modal
        open={stateDeleteCurrentCartItem}
        onClose={() => setStateDeleteCurrentCartItem(false)}
        closeAfterTransition
      >
        <Fade in={stateDeleteCurrentCartItem}>
          <BoxModalCustom>
            <IconButton
              sx={{
                position: 'absolute',
                top: '0',
                right: '0',
                padding: '10px',
              }}
              onClick={() => setStateDeleteCurrentCartItem(false)}
            >
              <X size={24} />
            </IconButton>
            <TypographyH2 mb={2}>{t('askForRemoveItem')}</TypographyH2>
            <Stack direction="row" spacing={2}>
              <ButtonCustom
                onClick={() => setStateDeleteCurrentCartItem(false)}
                variant="outlined"
                size="large"
              >
                {t('cancel')}
              </ButtonCustom>
              <ButtonCustom
                onClick={handleDeleteCurrentCartItem}
                variant="contained"
                size="large"
              >
                {t('yes')}
              </ButtonCustom>
            </Stack>
          </BoxModalCustom>
        </Fade>
      </Modal>
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
                  {t('adjustQuantity')}
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
                    {t('currentInstock')}
                  </TypographyCurrentInstock>
                  <div className={classes['popup-quantity__current-instock']}>
                    {instock}
                  </div>
                </StackStock>
                <Box mb={3}>
                  <Typography mb="5px">{t('quantity')}</Typography>
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
                        trigger('quantity')
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
                    {t('subtotal')}{' '}
                  </span>
                  {currentProduct && (
                    <div className={classes['popup-quantity__subtotal']}>
                      {!isEmpty(currentProduct.price_discount)
                        ? formatMoney(
                            tempQuantity * Number(currentProduct.price_discount)
                          )
                        : formatMoney(
                            tempQuantity * Number(currentProduct.unitPrice)
                          )}
                    </div>
                  )}
                </Stack>

                <Stack direction="row" justifyContent="center" mb={2}>
                  <ButtonCustom variant="contained" type="submit">
                    {t('apply')}
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
                <p id="child-modal-description">{t('askForRemoveItem')}</p>
                <Stack direction="row">
                  <ButtonCustom
                    variant="contained"
                    onClick={handleCloseChildModal}
                    sx={{ background: 'gray' }}
                  >
                    {t('close')}
                  </ButtonCustom>
                  <ButtonCustom
                    variant="contained"
                    onClick={handleRemoveFromCart}
                    sx={{ marginLeft: '10px' }}
                  >
                    {t('confirm')}
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
export const getStaticProps = async ({ locale }: { locale: string }) => {
  return {
    props: {
      locale,
      ...(await serverSideTranslations(locale, ['common', 'account', 'cart'])),
    },
  }
}
Cart.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
Cart.permissionPage = {
  key_module: KEY_MODULE.Cart,
  permission_rule: PERMISSION_RULE.Create,
}

export default Cart
