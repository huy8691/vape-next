import React, { useState } from 'react'

//layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'
//mui
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Divider,
  Fade,
  IconButton,
  InputBase,
  Modal,
  Paper,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import Grid from '@mui/material/Unstable_Grid2'

//other
import Image from 'next/image'
import { formatMoney } from 'src/utils/money.utils'
import edit from './parts/edit.svg'
import { CurrencyCircleDollar, X } from 'phosphor-react'
import classes from './styles.module.scss'

const Cart: NextPageWithLayout = () => {
  function createData(
    id: number,
    name: string,
    image: string,
    price: number,
    quantity: number
  ) {
    return { id, name, image, price, quantity }
  }

  const rows = [
    createData(
      1,
      'Coastal Clouds Salt TFN 3000...',
      '/images/vapeProduct.png',
      350,
      1
    ),
    createData(
      2,
      'Coastal Clouds Salt TFN 3000...',
      '/images/vapeProduct.png',
      350,
      1
    ),
    createData(
      3,
      'Coastal Clouds Salt TFN 3000...',
      '/images/vapeProduct.png',
      350,
      1
    ),
    createData(
      4,
      'Coastal Clouds Salt TFN 3000...',
      '/images/vapeProduct.png',
      350,
      1
    ),
  ]
  const TypographyH2 = styled(Typography)(({ theme }) => ({
    fontSize: '20px',
    fontWeight: 'bold',
    color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
  }))
  const CustomTableHeadText = styled('div')(() => ({
    fontSize: '14px',
    fontWeight: '400',
    color: '#BABABA',
    padding: '10px',
  }))
  const CustomSubTotal = styled('div')(() => ({
    fontSize: '14px',
    fontWeight: '700',
    color: '#1CB25B',
    display: 'flex',
    justifyContent: 'center',
  }))
  const CustomRemoveButtonText = styled('div')(() => ({
    fontSize: '14px',
    fontWeight: '700',
    color: '#E02D3C',
    textDecorationLine: 'underline',
  }))

  const CustomButton = styled(Button)(() => ({
    fontSize: '14px',
    fontWeight: '700',
    textTransform: 'capitalize',
  }))
  const CustomPrice = styled('div')(() => ({
    fontSize: '14px',
    fontWeight: '400',
    color: '#49516F',
    display: 'flex',
    justifyContent: 'center',
  }))
  const ImageWrapper = styled('div')(() => ({
    border: '1px solid #E1E6EF',
    borderRadius: '5px',
    padding: '5px',
    marginRight: '17px',
    width: '80px',
  }))
  const CustomIconButton = styled(IconButton)(() => ({
    border: '1px solid #E1E6EF',
    borderRadius: '10px',
    padding: '5px',
    background: 'white',
    marginLeft: '10px',
  }))
  const ProductWrapper = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
  }))
  const CustomGrid = styled(Grid)(() => ({
    border: '1px solid #E1E6EF',
    borderRadius: '10px',
  }))
  const CustomUnitText = styled('span')(() => ({
    fontSize: '12px',
    fontWeight: '400px',
  }))
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
  const CustomContainer = styled('div')(() => ({
    padding: '16px 25px',
  }))

  const CustomWrapper = styled('div')(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }))
  const CustomCurrentInStockText = styled('span')(() => ({
    fontWeight: '400',
    fontSize: '14px',
    color: '#20B598',
  }))
  const CustomCurrentInStockWrapper = styled('div')(() => ({
    background: 'linear-gradient(93.37deg, #1CB35B 0%, #20B598 116.99%)',
    borderRadius: '4px',
    padding: '4px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }))
  const CustomNumberCurrentInstock = styled('span')(() => ({
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
  }))

  const CustomInputBase = styled(InputBase)(() => ({
    border: '1px solid #E1E6EF',
    borderRadius: '8px',
    width: '100%',
    padding: '5px 15px',
    marginBottom: '25px',
  }))
  const CustomModalSubTotal = styled('span')(() => ({
    fontWeight: '700',
    fontSize: '24px',
    background: 'linear-gradient(93.37deg, #1CB35B 0%, #20B598 116.99%)',
    backgroundClip: 'text',
    textFillColor: 'transparent',
  }))
  const CustomCheckoutBar = styled('div')(() => ({
    position: 'fixed',
    bottom: '0',
    right: '0',
    width: 'calc(100% - 250px)',
    height: '170px',
    background: '#fff',
    boxShadow: '0px -16px 62px rgba(0, 0, 0, 0.03)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 240px',
  }))
  const CustomTextTotal = styled('div')(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: '500',
    fontSize: '14px',
  }))
  const CustomTotal = styled(Box)(() => ({
    color: '#1CB25B',
    fontWeight: '700',
    fontSize: '20px',
  }))

  const CustomButtonCheckout = styled(Button)(() => ({
    background: 'linear-gradient(93.37deg, #1CB35B 0%, #20B598 116.99%)',
    borderRadius: '10px',
    padding: '15px 60px',
    textTransform: 'capitalize',
    fontSize: '16px',
  }))

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  let total = 0

  //State use for select all checkbox

  return (
    <>
      <TypographyH2 variant="h2" mb={3}>
        Cart
      </TypographyH2>
      <Grid container spacing={2} mb={2}>
        <Grid xs={1}></Grid>
        <Grid xs={4}>
          <CustomTableHeadText>Product</CustomTableHeadText>
        </Grid>
        <Grid xs={2}>
          <CustomTableHeadText
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            Price
          </CustomTableHeadText>
        </Grid>
        <Grid xs={2}>
          <CustomTableHeadText
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            Quantity
          </CustomTableHeadText>
        </Grid>
        <Grid xs={2}>
          <CustomTableHeadText
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            Subtotal
          </CustomTableHeadText>
        </Grid>
        <Grid xs={1}></Grid>
      </Grid>
      {rows.map((row) => (
        <CustomGrid
          container
          spacing={2}
          key={row.id}
          mb={3}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Grid xs={1}>
            <Checkbox
              sx={{
                color: '#E1E6EF',
                '&.Mui-checked': {
                  color: '#1CB25B',
                },
              }}
              key={row.id}
            />
          </Grid>

          <Grid xs={4} style={{ display: 'flex', alignItems: 'center' }}>
            <ProductWrapper>
              <ImageWrapper>
                <Image
                  src={row.image}
                  alt="product"
                  width={80}
                  height={80}
                ></Image>
              </ImageWrapper>
            </ProductWrapper>
            {row.name}
          </Grid>
          <Grid xs={2}>
            <CustomPrice>
              {formatMoney(row.price)}/ <CustomUnitText> unit</CustomUnitText>
            </CustomPrice>
          </Grid>
          <Grid xs={2} style={{ display: 'flex', justifyContent: 'center' }}>
            <Paper
              component="form"
              sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                height: '40px',
                width: 'fit-content',
              }}
              elevation={0}
              style={{ background: '#F8F9FC' }}
            >
              <Box
                style={{
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '40px',
                }}
              >
                {row.quantity}
                <Divider
                  sx={{ height: 10, margin: '10px' }}
                  orientation="vertical"
                  variant="middle"
                  color="primary"
                />
                <CustomUnitText>unit</CustomUnitText>
                <CustomIconButton onClick={handleOpen}>
                  <Image
                    alt="icon edit"
                    src={edit}
                    objectFit="contain"
                    width={18}
                    height={18}
                  />
                </CustomIconButton>
              </Box>
            </Paper>
          </Grid>
          <Grid xs={2}>
            <CustomSubTotal>
              {formatMoney(row.quantity * row.price)}
            </CustomSubTotal>
          </Grid>
          <Grid xs={1} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <CustomButton>
              <CustomRemoveButtonText>Remove</CustomRemoveButtonText>
            </CustomButton>
          </Grid>
        </CustomGrid>
      ))}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <CustomBoxModal>
            <CustomContainer>
              <CustomWrapper style={{ marginBottom: '25px' }}>
                <TypographyH6 id="modal-modal-title" variant="h6">
                  Adjust quantity
                </TypographyH6>
                <IconButton onClick={handleClose}>
                  <X size={24} />
                </IconButton>
              </CustomWrapper>

              <CustomWrapper
                style={{
                  background: '#F8F9FC',
                  padding: '5px 10px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                }}
              >
                <CustomCurrentInStockText>
                  Current in stock
                </CustomCurrentInStockText>
                <CustomCurrentInStockWrapper>
                  <CustomNumberCurrentInstock>4</CustomNumberCurrentInstock>
                </CustomCurrentInStockWrapper>
              </CustomWrapper>
              <div style={{ marginBottom: '5px' }}>Quantity</div>
              <CustomInputBase
                type="number"
                placeholder="Ex: 1000"
                className={classes['input-number']}
              ></CustomInputBase>
              <CustomWrapper>
                <span style={{ fontSize: '12px', fontWeight: '300' }}>
                  Sub Total:{' '}
                </span>
                <CustomModalSubTotal>{formatMoney(0)}</CustomModalSubTotal>
              </CustomWrapper>
              <div style={{ textAlign: 'center' }}>
                <CustomButtonCheckout
                  variant="contained"
                  style={{ color: 'white' }}
                >
                  Apply
                </CustomButtonCheckout>
              </div>
            </CustomContainer>
          </CustomBoxModal>
        </Fade>
      </Modal>
      <TypographyH2 variant="h2" mb={3}>
        Viewed Product
      </TypographyH2>
      <CustomCheckoutBar className={classes['custom-checkout']}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {' '}
          <Checkbox
            sx={{
              color: '#E1E6EF',
              '&.Mui-checked': {
                color: '#1CB25B',
              },
            }}
          />{' '}
          <Box sx={{ marginLeft: '10px', marginRight: '10px' }}>
            Select all product on cart
          </Box>
          <CustomCurrentInStockWrapper>
            <CustomNumberCurrentInstock>4</CustomNumberCurrentInstock>
          </CustomCurrentInStockWrapper>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <CurrencyCircleDollar size={18} />
          <CustomTextTotal>Total</CustomTextTotal>
          <CustomTotal sx={{ marginLeft: '40px', marginRight: '40px' }}>
            {formatMoney(total)}
          </CustomTotal>
          <CustomButtonCheckout variant="contained" style={{ color: 'white' }}>
            Checkout
          </CustomButtonCheckout>
        </Box>
      </CustomCheckoutBar>
    </>
  )
}
Cart.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Cart
