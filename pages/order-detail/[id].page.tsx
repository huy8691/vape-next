import {
  Box,
  Breadcrumbs,
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
} from '@mui/material'
import { NextPageWithLayout } from 'pages/_app.page'
import { CircleWavyCheck, ClockClockwise, Truck } from 'phosphor-react'
import React, { ReactElement, useEffect, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { styled } from '@mui/system'
import Link from 'next/link'
import Grid from '@mui/material/Unstable_Grid2/Grid2'
import { getOrderDetail } from './apiOrderDetail'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { OrderDetailType } from './modelOrderDetail'
import moment from 'moment'
import { formatMoney } from 'src/utils/money.utils'
import Image from 'next/image'
import classes from './styles.module.scss'

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

enum OrderStatus {
  APPROVED,
  DELIVERING,
  DELIVERED,
  CANCELLED,
}

const Status = [
  {
    text: 'WAITING FOR APPROVED',
    icon: <ClockClockwise size={24} />,
    color: '#49516F',
  },
  {
    text: 'APPROVED',
    icon: <CircleWavyCheck color="#1DB46A" size={24} />,
    color: '#1DB46A',
  },
  {
    text: 'DELIVERING',
    icon: <Truck color="#2F6FED" size={24} />,
    color: '#2F6FED',
  },
  {
    text: 'DELIVERED',
    icon: <ClockClockwise color="#1DB46A" size={24} />,
    color: '#1DB46A',
  },
  {
    text: 'CANCELLED',
    icon: <span color="#E02D3C" className="icon-Package"></span>,
    color: '#E02D3C',
  },
]
const StatusFilterType: {
  [key: string]: number
} = {
  'WAITING FOR APPROVED': 0,
  APPROVED: 1,
  DELIVERING: 2,
  DELIVERED: 3,
  CANCELLED: 4,
}

const OrderDetail: NextPageWithLayout = () => {
  const [stateOrderDetail, setStateOrderDetail] = useState<OrderDetailType>()
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (router.query.id) {
      getOrderDetail(router.query.id)
        .then((res) => {
          const { data } = res.data
          setStateOrderDetail(data)
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
  }, [router, dispatch])

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
                <Box
                  sx={{
                    padding: '10px',
                    borderRadius: '32px',
                    backgroundColor: `${
                      Status[StatusFilterType[stateOrderDetail?.status]].color
                      // Status.find((x) => x.text === stateOrderDetail.status)
                      //   ?.color
                    }`,
                  }}
                  display="flex"
                  alignItems="center"
                >
                  <Box
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: '9999px',
                      padding: '5px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: '10px',
                    }}
                  >
                    {Status[StatusFilterType[stateOrderDetail?.status]].icon}
                    {/* {
                      Status.find((x) => x.text === stateOrderDetail.status)
                        ?.icon
                    } */}

                    {/* <ClockClockwise size={24} color="#49516F" /> */}
                  </Box>
                  <TypographyH3
                    sx={{
                      fontSize: '1.4rem',
                      color: 'white',
                      textTransform: 'capitalize',
                    }}
                  >
                    {stateOrderDetail?.status.toLowerCase()}
                  </TypographyH3>
                </Box>
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
                          cursor: 'pointer',
                        }}
                      >
                        <TableCell component="th" scope="row">
                          <Stack direction="row" alignItems="center">
                            <div className={classes['image-wrapper']}>
                              <Link href={`/product-detail/${items.id}`}>
                                <a>
                                  <Image
                                    alt="product-image"
                                    src={items.thumbnail}
                                    width={100}
                                    height={100}
                                  ></Image>
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
    </>
  )
}
OrderDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default OrderDetail
