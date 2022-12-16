import {
  Box,
  Breadcrumbs,
  Modal,
  ButtonGroup,
  Grow,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
} from '@mui/material'
import { X } from 'phosphor-react'
import Popper from '@mui/material/Popper'

import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'

import ClickAwayListener from '@mui/material/ClickAwayListener'
import { NextPageWithLayout } from 'pages/_app.page'
import { CircleWavyCheck, ClockClockwise, Truck } from 'phosphor-react'
import React, { ReactElement, useEffect, useState, useMemo } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { styled } from '@mui/system'
import Link from 'next/link'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { getOrderDetail, updateOrderDetail } from './apiOrderDetail'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { OrderDetailType } from './modelOrderDetail'
import moment from 'moment'
import { formatMoney } from 'src/utils/money.utils'
import Image from 'next/image'
import classes from './styles.module.scss'
import { ButtonCustom } from 'src/components'

// other
import ImageDefault from 'public/images/logo.svg'

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '3.2rem',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#1B1F27',
}))
const TypographyH3 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))
const TypographyCustom = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: '400',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#1B1F27',
}))
const TypographyInformationCustom = styled(Typography)(({ theme }) => ({
  fontSize: '1.6rem',
  fontWeight: '700',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
  textTransform: 'capitalize',
}))
const TypographyTableHeadCustom = styled(Typography)(() => ({
  fontSize: '1.4rem',
  fontWeight: '400',
  color: '#BABABA',
}))
const TypographyTotalCustom = styled(Typography)(() => ({
  fontSize: '1.8rem',
  fontWeight: '600',
  color: '#1CB25B',
}))
const StickyWrapper = styled('div')(() => ({
  position: 'sticky',
  top: '80px',
}))
const BoxCustom = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#121212' : '#F8F9FC',
  border: theme.palette.mode === 'dark' ? '1px solid #E1E6EF' : 'none',
}))

const TableRowCustom = styled(TableRow)(() => ({
  '& .MuiTableCell-root': {
    borderBottom: '0px',
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

const OrderDetail: NextPageWithLayout = () => {
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = React.useState<number>(1)
  const [stateOrderDetail, setStateOrderDetail] = useState<OrderDetailType>()
  const [openModal, setOpenModal] = useState(false)
  const [flagUpdateStatus, setFlagUpdateStatus] = useState<string>('')
  const router = useRouter()
  const dispatch = useAppDispatch()

  const optionStatus = useMemo(
    () => [
      {
        text: 'WAITING FOR APPROVED',
        icon: <ClockClockwise color="#49516F" size={24} />,
        color: '#49516F',
        disabled: false,
      },
      {
        text: 'APPROVED',
        icon: <CircleWavyCheck color="#1DB46A" size={24} />,
        color: '#1DB46A',
        disabled: false,
      },
      {
        text: 'DELIVERING',
        icon: <Truck color="#2F6FED" size={24} />,
        color: '#2F6FED',
        disabled: false,
      },
      {
        text: 'DELIVERED',
        icon: <ClockClockwise color="#1DB46A" size={24} />,
        color: '#1DB46A',
        disabled: false,
      },
      {
        text: 'CANCELLED',
        icon: (
          <span style={{ color: '#E02D3C' }} className="icon-Package"></span>
        ),
        color: '#E02D3C',
        disabled: false,
      },
    ],
    []
  )

  useEffect(() => {
    if (router.query.id) {
      dispatch(loadingActions.doLoading())
      getOrderDetail(router.query.id)
        .then((res) => {
          const { data } = res.data
          setStateOrderDetail(data)
          optionStatus.forEach((item, index) => {
            if (data?.status === 'DELIVERED') {
              return (optionStatus[index].disabled = true)
            }

            if (data?.status === item.text) {
              return (optionStatus[index].disabled = true)
            }

            if (
              optionStatus.findIndex((item) => item.text === data?.status) ===
              index - 1
            ) {
              return (optionStatus[index].disabled = false)
            }

            if (index === optionStatus.length - 1) {
              return (optionStatus[index].disabled = false)
            }

            return (optionStatus[index].disabled = true)
          })
          setSelectedIndex(
            optionStatus.findIndex((item) => item.text === data?.status)
          )
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
  }, [router, dispatch, optionStatus, flagUpdateStatus])

  const handleMenuItemClick = (
    _event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    setSelectedIndex(index)
    setOpen(false)
    setOpenModal(true)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleCloseModal = () => setOpenModal(false)
  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  const handleConfirmUpdateStatus = () => {
    try {
      dispatch(loadingActions.doLoading())

      console.log('3333', optionStatus[selectedIndex].text)
      updateOrderDetail(
        router.query?.id as string,
        optionStatus[selectedIndex].text
      )
        .then(() => {
          dispatch(loadingActions.doLoadingSuccess())
          setOpen(false)
          handleCloseModal()
          setFlagUpdateStatus('update status' + new Date())
        })
        .catch(() => {
          dispatch(loadingActions.doLoadingFailure())
          // setSelectedIndex(
          //   optionStatus.findIndex(
          //     (item) => item.text === stateOrderDetail?.status
          //   )
          // )
          dispatch(
            notificationActions.doNotification({
              message: 'Some items in your order were invalid',
              type: 'error',
            })
          )
        })
    } catch (error) {
      return
    }
  }

  return (
    <>
      <Grid container spacing={5}>
        <Grid xs={8}>
          <Stack spacing={2}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              {stateOrderDetail ? (
                <TypographyH2 variant="h2">
                  Order detail {stateOrderDetail?.code}
                </TypographyH2>
              ) : (
                <Box mb={1}>
                  <Skeleton
                    animation="wave"
                    variant="text"
                    sx={{ fontSize: '3.2rem' }}
                    width={400}
                  />
                </Box>
              )}

              {stateOrderDetail ? (
                <>
                  <ButtonGroup
                    variant="outlined"
                    aria-label="outlined button group"
                    ref={anchorRef}
                  >
                    <ButtonCustom onClick={handleToggle}>
                      {optionStatus[selectedIndex].text}
                    </ButtonCustom>
                  </ButtonGroup>
                  <Popper
                    sx={{
                      zIndex: 1,
                    }}
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                    nonce={undefined}
                    onResize={undefined}
                    onResizeCapture={undefined}
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === 'bottom'
                              ? 'center top'
                              : 'center bottom',
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList id="split-button-menu" autoFocusItem>
                              {optionStatus.map((option, index) => (
                                <MenuItem
                                  key={option.text}
                                  disabled={option.disabled}
                                  selected={index === selectedIndex}
                                  onClick={(event) =>
                                    handleMenuItemClick(event, index)
                                  }
                                >
                                  {option.text}
                                </MenuItem>
                              ))}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </>
              ) : (
                <Skeleton variant="rounded" width={300} height={60} />
              )}
            </Stack>
            {stateOrderDetail ? (
              <Breadcrumbs separator=">" aria-label="breadcrumb">
                <Link href="/order-management">
                  <a style={{ color: '#2F6FED' }}>Order Management</a>
                </Link>
                <Link href={`/order-detail/${stateOrderDetail.id}`}>
                  <a>Order Detail {stateOrderDetail?.code}</a>
                </Link>
              </Breadcrumbs>
            ) : (
              <Skeleton
                animation="wave"
                variant="text"
                sx={{ fontSize: '1.4rem' }}
                width={300}
              />
            )}

            <TypographyH3>Order Details</TypographyH3>
            {stateOrderDetail ? (
              <BoxCustom
                sx={{
                  padding: '15px',
                  borderRadius: '5px',
                  marginTop: '5px !important',
                }}
              >
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <TypographyCustom>Order No</TypographyCustom>
                    <TypographyInformationCustom>
                      {stateOrderDetail?.code}
                    </TypographyInformationCustom>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <TypographyCustom>Order Status:</TypographyCustom>
                    <Box sx={{ textTransform: 'lowercase' }}>
                      <TypographyInformationCustom
                        sx={{ textTransform: 'capitalize' }}
                      >
                        {stateOrderDetail?.status.toLowerCase()}
                      </TypographyInformationCustom>
                    </Box>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <TypographyCustom>Order Date</TypographyCustom>
                    <TypographyInformationCustom>
                      {moment(stateOrderDetail?.order_date).format(
                        'DD/MM/YYYY - h:mm:ss A'
                      )}
                    </TypographyInformationCustom>
                  </Stack>
                </Stack>
              </BoxCustom>
            ) : (
              <Skeleton variant="rounded" width="100%" height={140} />
            )}

            <TypographyH3>Products</TypographyH3>
            {stateOrderDetail ? (
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{
                  border: '1px solid #E1E6EF',
                  marginTop: '5px !important',
                }}
              >
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRowCustom>
                      <TableCell>
                        <TypographyTableHeadCustom
                          sx={{ fontWeight: '400', fontSize: '14px' }}
                        >
                          Product
                        </TypographyTableHeadCustom>
                      </TableCell>
                      <TableCell align="center">
                        <TypographyTableHeadCustom
                          sx={{ fontWeight: '400', fontSize: '14px' }}
                        >
                          Quantity
                        </TypographyTableHeadCustom>
                      </TableCell>
                      <TableCell align="center">
                        <TypographyTableHeadCustom
                          sx={{ fontWeight: '400', fontSize: '14px' }}
                        >
                          Price
                        </TypographyTableHeadCustom>
                      </TableCell>
                      <TableCell align="center">
                        <TypographyTableHeadCustom
                          sx={{ fontWeight: '400', fontSize: '14px' }}
                        >
                          Sub total
                        </TypographyTableHeadCustom>
                      </TableCell>
                    </TableRowCustom>
                  </TableHead>
                  <TableBody>
                    {stateOrderDetail?.items.map((items) => (
                      <TableRowCustom
                        key={items.id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Stack direction="row" alignItems="center">
                            <div className={classes['image-wrapper']}>
                              <Link href={`/product-detail/${items.id}`}>
                                <a>
                                  <Image
                                    alt="product-image"
                                    src={items.thumbnail || ImageDefault}
                                    width={100}
                                    height={100}
                                  />
                                </a>
                              </Link>
                            </div>
                            <Stack padding={2}>
                              <TypographyCustom sx={{ fontSize: '16px' }}>
                                <Link href={`/product-detail/${items.id}`}>
                                  <a>{items.name}</a>
                                </Link>
                              </TypographyCustom>
                              <TypographyCustom
                                sx={{ fontSize: '14px', fontWeight: '300' }}
                              >
                                {items.code}
                              </TypographyCustom>
                            </Stack>
                          </Stack>
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ textTransform: 'lowercase' }}
                        >
                          {items.quantity} {items.unit_type}
                        </TableCell>
                        <TableCell align="center">
                          <TypographyInformationCustom
                            sx={{
                              fontSize: '14px',
                              textTransform: 'lowercase',
                            }}
                          >
                            {formatMoney(items.unit_price)}
                            <span
                              style={{ fontWeight: '400', fontSize: '12px' }}
                            >
                              {''} / {items.unit_type}
                            </span>
                          </TypographyInformationCustom>
                        </TableCell>
                        <TableCell align="center">
                          <TypographyTotalCustom
                            sx={{ fontWeight: '700', fontSize: '16px' }}
                          >
                            {formatMoney(items.total)}
                          </TypographyTotalCustom>
                        </TableCell>
                      </TableRowCustom>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Skeleton variant="rounded" width="100%" height={400} />
            )}

            <TypographyH3>Shipping Address</TypographyH3>
            {stateOrderDetail ? (
              <BoxCustom
                sx={{
                  padding: '15px',
                  borderRadius: '5px',
                  marginTop: '5px !important',
                }}
              >
                <Stack spacing={2}>
                  <TypographyCustom>
                    {stateOrderDetail?.shipping_address.receiver_name}
                  </TypographyCustom>
                  <TypographyCustom>
                    {stateOrderDetail?.shipping_address.phone_number}
                  </TypographyCustom>
                  <TypographyCustom>
                    {stateOrderDetail?.shipping_address.address}
                  </TypographyCustom>
                </Stack>
              </BoxCustom>
            ) : (
              <Skeleton variant="rounded" width="100%" height={100} />
            )}

            <TypographyH3>Shipping Method</TypographyH3>
            {stateOrderDetail ? (
              <BoxCustom
                sx={{
                  padding: '15px',
                  borderRadius: '5px',
                  marginTop: '5px !important',
                }}
              >
                <TypographyCustom>
                  {/* {stateOrderDetail?.shipping_method} */}
                  Basic Shipping
                </TypographyCustom>
              </BoxCustom>
            ) : (
              <Skeleton variant="rounded" width="100%" height={50} />
            )}

            <TypographyH3>Note For Merchant</TypographyH3>
            {stateOrderDetail ? (
              <BoxCustom
                sx={{
                  padding: '15px',
                  borderRadius: '5px',
                  marginTop: '5px !important',
                }}
              >
                {stateOrderDetail.notes === null ||
                stateOrderDetail.notes == '' ? (
                  <TypographyCustom>Nothing noted</TypographyCustom>
                ) : (
                  <TypographyCustom>{stateOrderDetail?.notes}</TypographyCustom>
                )}
              </BoxCustom>
            ) : (
              <Skeleton variant="rounded" width="100%" height={50} />
            )}
          </Stack>
        </Grid>
        <Grid xs={4}>
          <StickyWrapper>
            <TypographyH3 sx={{ marginBottom: '15px' }}>
              Payment Details
            </TypographyH3>
            {stateOrderDetail ? (
              <Box
                sx={{
                  border: '1px solid #E1E6EF',
                  padding: '15px',
                  borderRadius: '5px',
                }}
              >
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <TypographyCustom sx={{ fontSize: '14px' }}>
                      Sub Total
                    </TypographyCustom>
                    <TypographyCustom sx={{ fontSize: '14px' }}>
                      {formatMoney(stateOrderDetail?.sub_total)}
                    </TypographyCustom>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <TypographyCustom sx={{ fontSize: '14px' }}>
                      Total shipping
                    </TypographyCustom>
                    {stateOrderDetail?.delivery_fee === 0 ? (
                      <TypographyCustom sx={{ fontSize: '14px' }}>
                        Free
                      </TypographyCustom>
                    ) : (
                      <TypographyCustom sx={{ fontSize: '14px' }}>
                        {formatMoney(stateOrderDetail?.delivery_fee)}
                      </TypographyCustom>
                    )}
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <TypographyTotalCustom>Total</TypographyTotalCustom>
                    <TypographyTotalCustom>
                      {formatMoney(stateOrderDetail?.total_billing)}
                    </TypographyTotalCustom>
                  </Stack>
                </Stack>
              </Box>
            ) : (
              <Skeleton variant="rounded" width="100%" height={120} />
            )}
          </StickyWrapper>
        </Grid>
      </Grid>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <BoxModalCustom sx={{ border: 'none', borderRadius: '8px' }}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton onClick={handleCloseModal}>
              <X size={24} />
            </IconButton>
          </Box>

          <Typography
            id="modal-modal-description"
            sx={{ mb: 2, fontSize: '20px' }}
            alignSelf="center"
          >
            Are you sure to update order status?
          </Typography>
          <Stack direction="row" justifyContent="center" p={2}>
            <ButtonCustom
              variant="contained"
              size="large"
              onClick={handleCloseModal}
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
              onClick={handleConfirmUpdateStatus}
              sx={{ marginLeft: '10px' }}
            >
              Confirm
            </ButtonCustom>
          </Stack>
        </BoxModalCustom>
      </Modal>
    </>
  )
}
OrderDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default OrderDetail
