import React, {
  // useEffect,
  useState,
} from 'react'

//layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'
//mui
import {
  Box,
  // Button,
  // Checkbox,
  // Divider,
  Fade,
  IconButton,
  Modal,
  // Paper,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'

//other
// import Image from 'next/image'
// import { formatMoney } from 'src/utils/money.utils'
// import edit from './parts/edit.svg'
import { CurrencyCircleDollar, X } from 'phosphor-react'
import { ButtonCustom, TextFieldCustom } from 'src/components'

// api
// import { useAppSelector } from 'src/store/hooks'

import classes from './styles.module.scss'

// react-hook-form
import { useForm } from 'react-hook-form'
// import { CartType } from 'src/store/cart/cartModels'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup
  .object({
    quantity: yup
      .number()
      .positive('Input must be positive')
      .integer('Input must be an integer')
      .required('This field is required '),
  })
  .required()

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))

// const CustomIconButton = styled(IconButton)(() => ({
//   border: '1px solid #E1E6EF',
//   borderRadius: '10px',
//   padding: '5px',
//   background: 'white',
//   marginLeft: '10px',
// }))

// const CustomGrid = styled(Grid)(() => ({
//   border: '1px solid #E1E6EF',
//   borderRadius: '10px',
// }))

const CustomBoxModal = styled(Box)(() => ({
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
const CustomTotal = styled(Box)(() => ({
  color: '#1CB25B',
  fontWeight: '700',
  fontSize: '20px',
}))
const CustomTypography = styled(Typography)(() => ({
  color: '#BABABA',
  fontWeight: '400',
  fontSize: '14px',
}))
interface QuantityFormInput {
  quantity: number
}
//State use for select all checkbox

const Cart: NextPageWithLayout = () => {
  const [open, setOpen] = useState(false)
  // const cart = useAppSelector((state) => state.cart)

  //state for instock

  // state use for checkbox
  // const [isCheckAll, setIsCheckAll] = useState(false)
  // const [isCheck, setIsCheck] = useState([])
  // const [list, setList] = useState([])
  //state use for modal
  // const [currentProductQuantity, setCurrentProductQuantity] =
  //   useState<CartType['items']>()
  // assign list product in cart array then set it to state (list)

  // useEffect(() => {
  //   setList(cart?.data?.items)
  // }, [cart])

  // CheckBoxClickHandler
  // const handleClickCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { id, checked } = event.target
  //   console.log(id)
  //   setIsCheck([...isCheck, parseInt(id)])
  //   if (!checked) {
  //     setIsCheck(isCheck.filter((item) => item !== parseInt(id)))
  //   }
  // }
  // const handleSelectAllCheckBox = () => {
  //   setIsCheckAll(!isCheckAll)
  //   setIsCheck(list.map((item) => item.cartItemId))
  //   if (isCheckAll) {
  //     setIsCheck([])
  //   }
  // }
  const handleClose = () => {
    setOpen(false)
  }

  const {
    register,
    // setValue,
    // getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<QuantityFormInput>({
    resolver: yupResolver(schema),
  })
  const onSubmit = (data: QuantityFormInput) => console.log(data)

  // handle open / close modal

  // const handleClickButton = (values: CartType['items']) => {
  //   setValue('quantity', values?.quantity || 0)
  //   setOpen(true)
  //   setCurrentProductQuantity(values)

  // }

  return (
    <>
      <TypographyH2 variant="h2" mb={3}>
        Cart
      </TypographyH2>
      <Grid container spacing={2} mb={2} justifyContent="center">
        {/* <Grid xs="auto"></Grid> */}
        <Grid xs={4}>
          <CustomTypography>Product</CustomTypography>
        </Grid>
        <Grid xs={2}>
          <CustomTypography align="center">Price</CustomTypography>
        </Grid>
        <Grid xs={2}>
          <CustomTypography align="center">Quantity</CustomTypography>
        </Grid>
        <Grid xs={2}>
          <CustomTypography align="center">Subtotal</CustomTypography>
        </Grid>
        <Grid xs={1}></Grid>
      </Grid>
      {/* {cart?.data?.items.map((row: CartType['items']) => (
        <CustomGrid
          spacing={2}
          key={row?.cartItemId}
          mb={3}
          container
          direction="row"
          alignItems="center"
        >
          <Grid xs="auto">
            <Checkbox
              id={row?.cartItemId?.toString()}
              onChange={handleClickCheckbox}
              checked={isCheck.includes(row?.cartItemId)}
            />
          </Grid>
          <Grid xs={4}>
            <Stack direction="row" spacing={2} alignItems="center">
              <div className={classes['image-wrapper']}>
                <Image
                  src={row.productThumbnail}
                  alt="product"
                  width={80}
                  height={80}
                />
              </div>
              <Typography component="div">{row.productName}</Typography>
            </Stack>
          </Grid>
          <Grid xs={2}>
            <Typography component="div" style={{ textAlign: 'center' }}>
              {formatMoney(row?.unitPrice)}/{row?.unitType}
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
                  {row?.quantity}
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
                    {row?.unitType}
                  </Typography>

                  <CustomIconButton onClick={() => handleClickButton(row)}>
                    <Image
                      alt="icon edit"
                      src={edit}
                      objectFit="contain"
                      width={18}
                      height={18}
                    />
                  </CustomIconButton>
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
              {formatMoney(row?.quantity * row?.unitPrice)}
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
        </CustomGrid>
      ))} */}
      <TypographyH2 variant="h2" mb={3}>
        Viewed Product
      </TypographyH2>
      <div className={classes['custom-checkout-bar']}>
        <Grid
          container
          spacing={3}
          justifyContent="space-between"
          direction="row"
        >
          <Grid xs="auto">
            <Stack direction="row" spacing={2} alignItems="center">
              {/* <Checkbox
                checked={isCheckAll}
                onChange={handleSelectAllCheckBox}
              /> */}
              <Box sx={{ marginLeft: '10px', marginRight: '10px' }}>
                Select all product on cart
              </Box>
            </Stack>
          </Grid>
          <Grid xs="auto">
            <Stack direction="row" spacing={2} alignItems="center">
              <CurrencyCircleDollar size={18} />
              <Typography>Total</Typography>
              <CustomTotal>
                {/* {formatMoney(cart?.data?.totalPrice | 0)} */}
              </CustomTotal>
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
          <CustomBoxModal>
            <div className={classes['custom-container']}>
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
                  }}
                >
                  <div className={classes['current-instock ']}>
                    Current in stock
                  </div>
                  <div className={classes['custom-current-instock-wrapper']}>
                    <div className={classes['custom-number-current-instock']}>
                      4
                    </div>
                  </div>
                </Stack>
                <Typography mb={3}>Quantity</Typography>

                <TextFieldCustom
                  type="number"
                  placeholder="Ex: 1000"
                  fullWidth
                  className={classes['input-number']}
                  {...register('quantity')}
                ></TextFieldCustom>
                <Typography style={{ color: 'red' }}>
                  {errors.quantity?.message}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <span>Sub Total: </span>
                  <div className={classes['modal-subtotal']}>
                    {/* {formatMoney(
                      currentProductQuantity?.unitPrice * getValues('quantity')
                    )} */}
                  </div>
                </Stack>

                <Stack direction="row" justifyContent="center" mb={2}>
                  <ButtonCustom variant="contained" type="submit">
                    Apply
                  </ButtonCustom>
                </Stack>
              </form>
            </div>
          </CustomBoxModal>
        </Fade>
      </Modal>
    </>
  )
}
Cart.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Cart
