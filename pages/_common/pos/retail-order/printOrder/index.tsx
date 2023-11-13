import {
  Box,
  Stack,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Typography,
  TableCell,
} from '@mui/material'
import Barcode from 'react-barcode'
import { ButtonCustom } from 'src/components'
import { formatMoney } from 'src/utils/money.utils'
import { useReactToPrint } from 'react-to-print'
import { useEffect, useState, useRef } from 'react'
import { getBusinessProfile } from './printOrderApi'
import moment from 'moment'
import { useTranslation } from 'next-i18next'
interface Props {
  data: {
    code?: string
    order_date?: string
    items: {
      name: string
      quantity: number
      total: number
    }[]
    other_products: {
      product_name: string
      quantity: number
      total: number
    }[]
    total_billing?: number
    total_tip?: number
    total_value?: number
  }
  closePopup: () => void
}

const PrintOrder = (props: Props) => {
  const { t } = useTranslation('retail-order-list')
  const [stateBusinessProfile, setStateBusinessProfile] = useState<{
    address: string
    business_name: string
  }>()
  const componentRef = useRef(null)
  useEffect(() => {
    getBusinessProfile()
      .then((res) => {
        const { data } = res.data
        setStateBusinessProfile(data)
      })
      .catch()
  }, [])
  // print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  return (
    <>
      <Box
        sx={{ padding: '40px 20px', margin: '0px auto', maxWidth: '200mm' }}
        ref={componentRef}
      >
        <Stack>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '1.6rem',
              textAlign: 'center',
              marginBottom: '5px !important',
            }}
          >
            {stateBusinessProfile?.business_name}
          </Typography>
          <Typography
            sx={{
              fontWeight: 300,
              textAlign: 'center',
              fontSize: '1.2rem',
              marginBottom: '5px !important',
            }}
          >
            {stateBusinessProfile?.address}
          </Typography>
          <Typography
            sx={{
              fontWeight: 300,
              textAlign: 'center',
              marginBottom: '20px !important',
            }}
          >
            {moment(props?.data?.order_date).format(
              'ddd DD MMM, YYYY -  hh:mm a'
            )}
          </Typography>
          <Typography
            sx={{
              fontWeight: 700,
              textAlign: 'center',
              fontSize: '1.8rem',
            }}
          >
            {t('create.printOrder.receipt')}
          </Typography>
          <Typography
            sx={{
              fontWeight: 500,
              textAlign: 'center',
            }}
          >
            Retail Order Number
          </Typography>
          <Box
            sx={{
              alignSelf: 'center',
              marginBottom: '20px !important',
            }}
          >
            <Barcode
              format="CODE128"
              height={40}
              value={props?.data?.code || ''}
            />
          </Box>
          {props?.data?.items?.length > 0 && (
            <Table
              sx={{
                '@media print': {
                  'page-break-before': 'always',
                },
              }}
            >
              <TableHead>
                <TableRow sx={{ fontWeight: 600, background: '#F8F9FC' }}>
                  <TableCell width="65%">
                    <Typography
                      sx={{
                        '@media print': {
                          fontSize: '12px',
                        },
                      }}
                    >
                      Product
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{
                        '@media print': {
                          fontSize: '12px',
                        },
                      }}
                    >
                      Qty
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography
                      sx={{
                        '@media print': {
                          fontSize: '12px',
                        },
                      }}
                    >
                      Total
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props?.data?.items.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell
                        width="65%"
                        sx={
                          index === props?.data?.items?.length - 1
                            ? {
                                borderBottom: 'none',
                              }
                            : {}
                        }
                      >
                        <Typography
                          sx={{
                            '@media print': {
                              fontSize: '12px',
                            },
                          }}
                        >
                          {item.name}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={
                          index === props?.data?.items?.length - 1
                            ? {
                                borderBottom: 'none',
                              }
                            : {}
                        }
                      >
                        <Typography
                          sx={{
                            '@media print': {
                              fontSize: '12px',
                            },
                          }}
                        >
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={
                          index === props?.data?.items?.length - 1
                            ? {
                                borderBottom: 'none',
                              }
                            : {}
                        }
                      >
                        <Typography
                          sx={{
                            '@media print': {
                              fontSize: '12px',
                            },
                          }}
                        >
                          {formatMoney(item.total)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
          {props?.data?.other_products?.length > 0 && (
            <Table
              sx={{
                marginTop: '32px !important',
                '@media print': {
                  'page-break-before': 'always',
                },
              }}
            >
              <TableHead>
                <TableRow sx={{ fontWeight: 600, background: '#F8F9FC' }}>
                  <TableCell width="65%" sx={{ paddingLeft: '0px' }}>
                    <Typography
                      sx={{
                        '@media print': {
                          fontSize: '12px',
                        },
                      }}
                    >
                      Other Products
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      sx={{
                        '@media print': {
                          fontSize: '12px',
                        },
                      }}
                    >
                      Qty
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ paddingRight: '0px' }}>
                    <Typography
                      sx={{
                        '@media print': {
                          fontSize: '12px',
                        },
                      }}
                    >
                      Total
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props?.data?.other_products.map((item, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell
                        width="65%"
                        sx={
                          index === props?.data?.other_products?.length - 1
                            ? {
                                borderBottom: 'none',
                              }
                            : {}
                        }
                      >
                        <Typography
                          sx={{
                            '@media print': {
                              fontSize: '12px',
                            },
                          }}
                        >
                          {item.product_name}
                        </Typography>
                      </TableCell>

                      <TableCell
                        align="center"
                        sx={
                          index === props?.data?.other_products?.length - 1
                            ? {
                                borderBottom: 'none',
                              }
                            : {}
                        }
                      >
                        <Typography
                          sx={{
                            '@media print': {
                              fontSize: '12px',
                            },
                          }}
                        >
                          {item.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={
                          index === props?.data?.other_products?.length - 1
                            ? {
                                borderBottom: 'none',
                              }
                            : {}
                        }
                      >
                        <Typography
                          sx={{
                            '@media print': {
                              fontSize: '12px',
                            },
                          }}
                        >
                          {formatMoney(item.total)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
          <Table
            sx={{
              marginTop: '32px !important',
              marginBottom: '32px !important',
            }}
          >
            <TableBody>
              <TableRow>
                <TableCell colSpan={2} sx={{ fontWeight: 600 }}>
                  Subtotal
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatMoney(props?.data?.total_value)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} sx={{ fontWeight: 600 }}>
                  Tip
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 600 }}>
                  {formatMoney(props?.data?.total_tip)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2} sx={{ fontWeight: 700 }}>
                  Total Cost
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  {formatMoney(props?.data?.total_billing)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Typography align="center">Thank you and see you again !</Typography>
        </Stack>
      </Box>
      <Stack
        direction="row"
        spacing={2}
        sx={{ padding: 2 }}
        justifyContent="center"
      >
        <ButtonCustom
          onClick={() => props.closePopup()}
          variant="outlined"
          size="large"
        >
          Cancel
        </ButtonCustom>
        <ButtonCustom variant="contained" size="large" onClick={handlePrint}>
          Print Receipt
        </ButtonCustom>
      </Stack>
    </>
  )
}

export default PrintOrder
