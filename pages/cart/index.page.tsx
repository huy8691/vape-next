import React, { useState } from 'react'

//layout
import type { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import type { NextPageWithLayout } from 'pages/_app.page'
//mui
import {
  Box,
  Button,
  Checkbox,
  Fade,
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
import classes from './styles.module.scss'

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))

const CustomIconButton = styled(IconButton)(() => ({
  border: '1px solid #E1E6EF',
  borderRadius: '10px',
  padding: '5px',
  background: 'white',
  marginLeft: '10px',
}))

const CustomGrid = styled(Grid)(() => ({
  border: '1px solid #E1E6EF',
  borderRadius: '10px',
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
  background: '#fff',
  boxShadow: '0px -16px 62px rgba(0, 0, 0, 0.03)',
  padding: '30px',
}))

const CustomTotal = styled(Box)(() => ({
  color: '#1CB25B',
  fontWeight: '700',
  fontSize: '20px',
}))

//State use for select all checkbox

const Cart: NextPageWithLayout = () => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  let total = 0
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

  return (
    <>
      <TypographyH2 variant="h2" mb={3}>
        Cart
      </TypographyH2>
      <Grid container spacing={2} mb={2}>
        <Grid xs="auto"></Grid>
        <Grid xs={4}>
          <Typography component="div">Product</Typography>
        </Grid>
        <Grid xs={2}>
          <Typography align="center" component="div">
            Price
          </Typography>
        </Grid>
        <Grid xs={2}>
          <Typography align="center" component="div">
            Quantity
          </Typography>
        </Grid>
        <Grid xs={2}>
          <Typography align="center" component="div">
            Subtotal
          </Typography>
        </Grid>
        <Grid xs={1}></Grid>
      </Grid>
      {rows.map((row) => (
        <CustomGrid
          spacing={2}
          key={row.id}
          mb={3}
          container
          direction="row"
          alignItems="center"
        >
          <Grid xs="auto">
            <Checkbox />
          </Grid>
          <Grid xs={4}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Image src={row.image} alt="product" width={80} height={80} />
              <Typography component="div">{row.name}</Typography>
            </Stack>
          </Grid>
          <Grid xs={2}>
            <Typography component="div">
              {formatMoney(row.price)}/unit
            </Typography>
          </Grid>
          <Grid xs={2}>
            <Paper style={{ background: '#F8F9FC' }}>
              <Box
                style={{
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '40px',
                }}
              >
                {row.quantity}/unit
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
          <Grid xs={2}>{formatMoney(row.quantity * row.price)}</Grid>
          <Grid xs={1}>
            <Button variant="text">Remove</Button>
          </Grid>
        </CustomGrid>
      ))}

      <TypographyH2 variant="h2" mb={3}>
        Viewed Product
      </TypographyH2>

      <CustomCheckoutBar>
        <Grid
          container
          spacing={3}
          justifyContent="space-between"
          direction="row"
        >
          <Grid xs="auto">
            <Stack direction="row" spacing={2} alignItems="center">
              <Checkbox />
              <Box sx={{ marginLeft: '10px', marginRight: '10px' }}>
                Select all product on cart
              </Box>
            </Stack>
          </Grid>
          <Grid xs="auto">
            <Stack direction="row" spacing={2} alignItems="center">
              <CurrencyCircleDollar size={18} />
              <Typography>Total</Typography>
              <CustomTotal>{formatMoney(total)}</CustomTotal>
              <ButtonCustom variant="contained" size="large">
                Checkout
              </ButtonCustom>
            </Stack>
          </Grid>
        </Grid>
      </CustomCheckoutBar>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        closeAfterTransition
      >
        <Fade in={open}>
          <CustomBoxModal>
            <CustomContainer>
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
                <CustomCurrentInStockText>
                  Current in stock
                </CustomCurrentInStockText>
                <CustomCurrentInStockWrapper>
                  <CustomNumberCurrentInstock>4</CustomNumberCurrentInstock>
                </CustomCurrentInStockWrapper>
              </Stack>

              <Typography mb={3}>Quantity</Typography>
              <TextFieldCustom
                type="number"
                placeholder="Ex: 1000"
                fullWidth
              ></TextFieldCustom>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <span>Sub Total: </span>
                <CustomModalSubTotal>{formatMoney(0)}</CustomModalSubTotal>
              </Stack>

              <Stack direction="row" justifyContent="center" mb={2}>
                <ButtonCustom variant="contained">Apply</ButtonCustom>
              </Stack>
            </CustomContainer>
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
