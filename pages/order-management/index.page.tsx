import {
  Box,
  IconButton,
  InputBase,
  Paper,
  Popper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useEffect, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { styled } from '@mui/system'
import { MagnifyingGlass } from 'phosphor-react'
// import { Controller } from 'react-hook-form'
import { ButtonCustom } from 'src/components'

// import PropTypes from 'prop-types'
import TablePaginationAction from './parts/TablePaginationAction'
import { formatMoney } from 'src/utils/money.utils'
import { isEmptyObject, objToStringParam } from 'src/utils/global.utils'

// react-hook-form
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { getOrders } from './apiOrders'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { OrderDataType, OrderListDataResponseType } from './modelOrders'
import moment from 'moment'

const schema = yup.object({
  content: yup.string(),
})

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))

const TableRowCustom = styled(TableRow)(() => ({
  cursor: 'pointer',
  '&:nth-of-type(odd)': {
    backgroundColor: '#F8F9FC',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

const StyledTabs = styled(Tabs)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 24,
    width: '100%',
    backgroundColor: theme.palette.primary.main,
  },
}))
const TabCustom = styled(Tab)(() => ({
  textTransform: 'capitalize',
  fontWeight: '700',
  fontSize: '1.4rem',
}))

const TableCellCustom = styled(TableCell)(() => ({
  maxWidth: '150px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}))
// form search
// function createData(
//   id: number,
//   orderNo: String,
//   orderDate: String,
//   totalBilling: number,
//   orderStatus: String,
//   paymentMethod: String,
//   paymentStatus: String,
//   receiver: String,
//   deliverAddress: String
// ) {
//   return {
//     id,
//     orderNo,
//     orderDate,
//     totalBilling,
//     orderStatus,
//     paymentMethod,
//     paymentStatus,
//     receiver,
//     deliverAddress,
//   }
// }

// const rows = [
//   createData(
//     1,
//     '#8237ABC',
//     '23/10/2022 - 02:00 PM',
//     2500,
//     'Waiting Approval',
//     'Cash On Delivery',
//     'Waiting For Payment',
//     'Richard Rogers',
//     'USA...'
//   ),
//   createData(
//     2,
//     '#8237ABC',
//     '23/10/2022 - 02:00 PM',
//     2500,
//     'Waiting Approval',
//     'Cash On Delivery',
//     'Waiting For Payment',
//     'Richard Rogers',
//     'USA...'
//   ),
//   createData(
//     3,
//     '#8237ABC',
//     '23/10/2022 - 02:00 PM',
//     2500,
//     'Waiting Approval',
//     'Cash On Delivery',
//     'Waiting For Payment',
//     'Richard Rogers',
//     'USA...'
//   ),
//   createData(
//     4,
//     '#8237ABC',
//     '23/10/2022 - 02:00 PM',
//     2500,
//     'Waiting Approval',
//     'Cash On Delivery',
//     'Waiting For Payment',
//     'Richard Rogers',
//     'USA...'
//   ),
//   createData(
//     5,
//     '#8237ABC',
//     '23/10/2022 - 02:00 PM',
//     2500,
//     'Waiting Approval',
//     'Cash On Delivery',
//     'Waiting For Payment',
//     'Richard Rogers',
//     'USA...'
//   ),
//   createData(
//     6,
//     '#8237ABC',
//     '23/10/2022 - 02:00 PM',
//     2500,
//     'Waiting Approval',
//     'Cash On Delivery',
//     'Waiting For Payment',
//     'Richard Rogers',
//     'USA...'
//   ),
//   createData(
//     7,
//     '#8237ABC',
//     '23/10/2022 - 02:00 PM',
//     2500,
//     'Waiting Approval',
//     'Cash On Delivery',
//     'Waiting For Payment',
//     'Richard Rogers',
//     'USA...'
//   ),
//   createData(
//     8,
//     '#8237ABC',
//     '23/10/2022 - 02:00 PM',
//     2500,
//     'Waiting Approval',
//     'Cash On Delivery',
//     'Waiting For Payment',
//     'Richard Rogers',
//     'USA...'
//   ),
//   createData(
//     9,
//     '#8237ABC',
//     '23/10/2022 - 02:00 PM',
//     2500,
//     'Waiting Approval',
//     'Cash On Delivery',
//     'Waiting For Payment',
//     'Richard Rogers',
//     'USA...'
//   ),
//   createData(
//     10,
//     '#8237ABC',
//     '23/10/2022 - 02:00 PM',
//     2500,
//     'Waiting Approval',
//     'Cash On Delivery',
//     'Waiting For Payment',
//     'Richard Rogers',
//     'USA...'
//   ),
//   createData(
//     11,
//     '#8237ABCcccc',
//     '23/10/2022 - 02:00 PM',
//     2500,
//     'Waiting Approval',
//     'Cash On Delivery',
//     'Waiting For Payment',
//     'Richard Rogers',
//     'USA...'
//   ),
// ]

interface SearchFormInput {
  content: string
}

const OrderManageMent: NextPageWithLayout = () => {
  // state use for table
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [valueTab, setValueTab] = useState(0)
  // state use for
  const [dataOrders, setDataOrders] = useState<OrderListDataResponseType>()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [nextPage, setNextPage] = useState<number | null>()
  const [page, setPage] = useState(0)
  console.log('🚀 ~ file: index.page.tsx ~ line 253 ~ page', page)
  // temtporary row
  const [tempRow, setTempRow] = useState<OrderDataType>()
  //state use for popper
  const [anchorEl, setAnchorEl] = useState<any>(null)

  const handleHoverTableCell = (event: any, value: OrderDataType) => {
    setTempRow(value)
    setAnchorEl(value ? event.currentTarget : undefined)
    // setAnchorEl(anchorEl ? null : event.currentTarget)
  }
  const handleLeaveTableCell = () => {
    setTempRow(undefined)
    setAnchorEl(undefined)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined
  // function for table pagination
  const handleChangePage = (event: any, newPage: number) => {
    console.log(event)
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    let tableSize = parseInt(event.target.value)
    getOrders({ limit: tableSize })
      .then(() => {
        router.replace({
          search: `${objToStringParam({
            ...router.query,
            limit: tableSize,
          })}`,
        })
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
    // setPage(0)
  }
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValueTab(newValue)
  }

  useEffect(() => {
    if (!isEmptyObject(router.query)) {
      dispatch(loadingActions.doLoading())
      getOrders(router.query)
        .then((res) => {
          const data = res.data
          setNextPage(data.nextPage)
          console.log(
            '🚀 ~ file: index.page.tsx ~ line 259 ~ getOrders ~ data',
            data
          )
          if (data.data.length === 0) {
            dispatch(
              notificationActions.doNotification({
                message: 'There are no orders at this time',
                type: 'error',
              })
            )
          }
          setDataOrders(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((error: any) => {
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
    if (router.asPath === '/order-management') {
      dispatch(loadingActions.doLoading())
      getOrders({ page: 1 })
        .then((res) => {
          const data = res.data
          setNextPage(data.nextPage)
          if (data.data.length === 0) {
            dispatch(
              notificationActions.doNotification({
                message: 'There are no orders at this time',
                type: 'error',
              })
            )
          }
          setDataOrders(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((error: any) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, router.query])

  //   Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0
  //     ? Math.max(0, (1 + page) * rowsPerPage - dataOrders?.totalItems)
  //     : 0
  // function for react-hook-form
  const {
    register,
    // setValue,
    getValues,
    handleSubmit,
    // formState: { errors },
  } = useForm<SearchFormInput>({
    resolver: yupResolver(schema),
  })
  // check if input has white space
  function hasWhiteSpace(s: string) {
    return /^\s+$/g.test(s)
  }

  const onSubmit = (data: SearchFormInput) => {
    console.log('here', getValues('content'))
    console.log('data', data)
    if (hasWhiteSpace(getValues('content'))) {
      console.log('xuong ne')
      dispatch(
        notificationActions.doNotification({
          message: 'Error',
          type: 'error',
        })
      )
      setDataOrders(undefined)
    } else {
      console.log('xuong day r nha')
      dispatch(loadingActions.doLoading())
      getOrders({ page: 1, code: getValues('content') })
        .then(() => {
          router.replace({
            search: `${objToStringParam({
              ...router.query,
              page: 1,
              code: getValues('content'),
            })}`,
          })
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
  }
  const handleClickFilterTab = (status: string | null) => {
    if (status) {
      getOrders({ page: 1 })
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          status: null,
        })}`,
      })
    }
    getOrders({ page: 1, status: status })
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: 1,
        status: status,
      })}`,
    })
  }
  return (
    <>
      <TypographyH2 variant="h2" mb={3}>
        Order Management
      </TypographyH2>
      <StyledTabs
        value={valueTab}
        onChange={handleChangeTab}
        aria-label="basic tabs example"
        TabIndicatorProps={{
          children: <span className="MuiTabs-indicatorSpan" />,
        }}
      >
        <TabCustom
          label="All Orders"
          onClick={() => handleClickFilterTab(null)}
        />
        <TabCustom
          label="Waiting For Approval"
          onClick={() => handleClickFilterTab('WAITING_FOR_APPROVED')}
        />
        <TabCustom
          label="Approved"
          onClick={() => handleClickFilterTab('APPROVED')}
        />
        <TabCustom
          label="Delivering"
          onClick={() => handleClickFilterTab('DELIVERING')}
        />
        <TabCustom
          label="Delivered"
          onClick={() => handleClickFilterTab('DELIVERED')}
        />
        <TabCustom
          label="Cancelled"
          onClick={() => handleClickFilterTab('CANCELLED')}
        />
      </StyledTabs>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} style={{ marginBottom: '20px' }}>
          <Grid xs={8} display="flex" alignItems="center">
            <Paper
              elevation={0}
              sx={{
                p: '5px 20px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                border: '1px solid #E1E6EF',
                borderRadius: '8px',
              }}
            >
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search by order no..."
                inputProps={{ 'aria-label': 'Search by order no...' }}
                {...register('content')}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <MagnifyingGlass size={20} />
              </IconButton>
            </Paper>
          </Grid>
          <Grid xs={4}>
            <ButtonCustom
              type="submit"
              variant="contained"
              style={{ color: 'white', padding: '15px', width: '100%' }}
            >
              <Typography style={{ fontWeight: '600' }}>Action</Typography>
            </ButtonCustom>
          </Grid>
        </Grid>
      </form>

      <TableContainer
        component={Paper}
        elevation={0}
        style={{ marginBottom: '20px', border: '1px solid #E1E6EF' }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Order No</TableCell>
              <TableCell align="center">Order Date</TableCell>
              <TableCell align="center">Total Billing</TableCell>
              <TableCell align="center">Order Status</TableCell>
              {/* <TableCell align="center">Payment Method</TableCell> */}
              <TableCell align="center">Payment Status</TableCell>
              <TableCell align="center">Receiver</TableCell>
              <TableCell align="center">Deliver Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataOrders?.data.map((row) => (
              <TableRowCustom
                hover
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center" component="th" scope="row">
                  {row.code}
                </TableCell>

                <TableCell align="center">
                  {moment(row.orderDate).format('DD/MM/YYYY - h:mm:ss A')}{' '}
                </TableCell>
                <TableCell align="center">
                  {formatMoney(row.total_value)}
                </TableCell>
                <TableCell align="center">{row.status}</TableCell>
                {/* <TableCell align="center">{row.paymentMethod}</TableCell> */}
                <TableCell align="center">{row.payment_status}</TableCell>
                <TableCell align="center">{row.receiver}</TableCell>
                <TableCellCustom
                  align="center"
                  onMouseEnter={(e) => handleHoverTableCell(e, row)}
                  onMouseLeave={handleLeaveTableCell}
                >
                  {row.address}
                </TableCellCustom>
              </TableRowCustom>
            ))}
            {/* {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </TableContainer>
      <Popper id={id} open={open} anchorEl={anchorEl}>
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
          {tempRow?.address}
        </Box>
      </Popper>
      <table style={{ width: '100%', backgroundColor: '#F1F3F9' }}>
        <tbody>
          <tr>
            <TablePagination
              count={dataOrders ? dataOrders?.totalItems : 0}
              rowsPerPageOptions={[5, 10, 15, 20]}
              rowsPerPage={rowsPerPage}
              page={
                Number(router.query.page) ? Number(router.query.page) - 1 : 0
              }
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={(props) => {
                return (
                  <TablePaginationAction
                    page={props.page}
                    rowsPerPage={props.rowsPerPage}
                    onPageChange={props.onPageChange}
                    nextIsNull={Number(nextPage)}
                  />
                )
              }}
              // rowsPerPageOptions={[-1]}
            ></TablePagination>
          </tr>
        </tbody>
      </table>
    </>
  )
}
// TablePagination.propTypes = {
//   count: PropTypes.number.isRequired,
//   onPageChange: PropTypes.func.isRequired,
//   page: PropTypes.number.isRequired,
//   rowsPerPage: PropTypes.number.isRequired,
// }
OrderManageMent.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default OrderManageMent
