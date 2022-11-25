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

// not need this time
// import { ButtonCustom } from 'src/components'

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
  '& .Mui-selected': {
    textTransform: 'capitalize',
    fontWeight: '700',
    fontSize: '1.4rem',
  },
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
  fontSize: '1.4rem',
  fontWeight: '400',
  textTransform: 'capitalize',
}))

const TableCellHeadingTextCustom = styled(TableCell)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 400,
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))
const TableCellBodyTextCustom = styled(TableCell)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
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
  // state use for list order
  const [dataOrders, setDataOrders] = useState<OrderListDataResponseType>()
  const router = useRouter()
  console.log('🚀 ~ file: index.page.tsx ~ line 259 ~ router', router)
  const dispatch = useAppDispatch()
  // state use for store next page is null or <number></number>
  const [nextPage, setNextPage] = useState<number | null>()
  // const [page, setPage] = useState(0)

  // temtporary row
  const [tempRow, setTempRow] = useState<OrderDataType>()
  //state use for popper
  const [anchorEl, setAnchorEl] = useState<any>(null)
  //state use for tab
  const [tabDisabled, setTabDisabled] = useState<boolean>(false)
  //state use for temporary input

  // trigger when hover to table cell
  const handleHoverTableCell = (event: any, value: OrderDataType) => {
    setTempRow(value)
    setAnchorEl(value ? event.currentTarget : undefined)
    // setAnchorEl(anchorEl ? null : event.currentTarget)
  }
  // trigger when mouse leave table cell
  const handleLeaveTableCell = () => {
    setTempRow(undefined)
    setAnchorEl(undefined)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popper' : undefined
  // function for table pagination
  const handleChangePage = (event: any) => {
    console.log(event)
    // setPage(newPage)
  }
  // trigger when change row per page option ( page size )
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    let tableSize = parseInt(event.target.value)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: tableSize,
        page: 1,
      })}`,
    })
    // getOrders({ limit: tableSize })
    //   .then(() => {
    //     router.replace({
    //       search: `${objToStringParam({
    //         ...router.query,
    //         limit: tableSize,
    //       })}`,
    //     })
    //     dispatch(loadingActions.doLoadingSuccess())
    //   })
    //   .catch((error) => {
    //     const data = error.response?.data
    //     dispatch(loadingActions.doLoadingFailure())
    //     dispatch(
    //       notificationActions.doNotification({
    //         message: data?.message ? data?.message : 'Error',
    //         type: 'error',
    //       })
    //     )
    //   })
    // setPage(0)
  }
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event)
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
          setTabDisabled(false)
        })
        .catch((error: any) => {
          const data = error.response?.data
          console.log(data)
          dispatch(loadingActions.doLoadingFailure())
          dispatch(
            notificationActions.doNotification({
              message: 'Something went wrongs with the server',
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
          setTabDisabled(false)
        })
        .catch((error: any) => {
          const data = error.response?.data
          console.log(
            '🚀 ~ file: index.page.tsx ~ line 386 ~ useEffect ~ data',
            data
          )

          dispatch(loadingActions.doLoadingFailure())
          dispatch(
            notificationActions.doNotification({
              message: 'Something went wrongs with the server',
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
    console.log(getValues('content'))
    console.log('data', data)
    setTabDisabled(true)
    if (hasWhiteSpace(getValues('content'))) {
      dispatch(
        notificationActions.doNotification({
          message: 'Error',
          type: 'error',
        })
      )
      setDataOrders(undefined)
    } else {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          page: 1,
          code: getValues('content'),
        })}`,
      })
    }
  }
  const handleClickFilterTab = (status: string | null) => {
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: 1,
        status: status,
      })}`,
    })
    setTabDisabled(true)
  }
  const handleRowClick = (id: number) => {
    router.push(`/order-detail/${id}`)
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
          disabled={tabDisabled}
        />
        <TabCustom
          label="Waiting For Approval"
          onClick={() => handleClickFilterTab('WAITING_FOR_APPROVED')}
          disabled={tabDisabled}
        />
        <TabCustom
          label="Approved"
          onClick={() => handleClickFilterTab('APPROVED')}
          disabled={tabDisabled}
        />
        <TabCustom
          label="Delivering"
          onClick={() => handleClickFilterTab('DELIVERING')}
          disabled={tabDisabled}
        />
        <TabCustom
          label="Delivered"
          onClick={() => handleClickFilterTab('DELIVERED')}
          disabled={tabDisabled}
        />
        <TabCustom
          label="Cancelled"
          onClick={() => handleClickFilterTab('CANCELLED')}
          disabled={tabDisabled}
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
              <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                <MagnifyingGlass size={20} />
              </IconButton>
            </Paper>
          </Grid>
          <Grid xs={4}>
            {/* <ButtonCustom
              type="submit"
              variant="contained"
              style={{ color: 'white', padding: '15px', width: '100%' }}
            >
              <Typography style={{ fontWeight: '600' }}>Action</Typography>
            </ButtonCustom> */}
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
              <TableCellHeadingTextCustom align="center">
                Order No
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="center">
                Order Date
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="center">
                Total Billing
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="center">
                Order Status
              </TableCellHeadingTextCustom>
              {/* <TableCellHeadingTextCustom align="center">Payment Method</TableCellHeadingTextCustom> */}
              <TableCellHeadingTextCustom align="center">
                Payment Status
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="center">
                Receiver
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="center">
                Deliver Address
              </TableCellHeadingTextCustom>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataOrders?.data.map((row) => (
              <TableRowCustom
                hover
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => handleRowClick(row.id)}
              >
                <TableCellBodyTextCustom
                  align="center"
                  component="th"
                  scope="row"
                >
                  {row.code}
                </TableCellBodyTextCustom>
                <TableCellBodyTextCustom align="center">
                  {moment(row.orderDate).format('DD/MM/YYYY - h:mm:ss A')}{' '}
                </TableCellBodyTextCustom>
                <TableCellBodyTextCustom align="center">
                  {formatMoney(row.total_value)}
                </TableCellBodyTextCustom>
                <TableCellBodyTextCustom
                  align="center"
                  style={{ textTransform: 'capitalize' }}
                >
                  {row.status}
                </TableCellBodyTextCustom>
                {/* <TableCellBodyTextCustom align="center">{row.paymentMethod}</TableCellBodyTextCustom> */}
                <TableCellBodyTextCustom align="center">
                  {row.payment_status}
                </TableCellBodyTextCustom>
                <TableCellBodyTextCustom align="center">
                  {row.receiver}
                </TableCellBodyTextCustom>
                <TableCellBodyTextCustom
                  align="center"
                  style={{
                    maxWidth: '150px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  onMouseEnter={(e) => handleHoverTableCell(e, row)}
                  onMouseLeave={handleLeaveTableCell}
                >
                  {row.address}
                </TableCellBodyTextCustom>
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
      <Popper id={id} open={open} anchorEl={anchorEl} placement="top-start">
        <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
          {tempRow?.address}
        </Box>
      </Popper>
      <table
        style={{
          width: '100%',
          backgroundColor: '#F1F3F9',
          borderRadius: '5px',
          border: '1px solid #E1E6EF',
        }}
      >
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
                    count={props.count}
                    page={props.page}
                    rowsPerPage={props.rowsPerPage}
                    // onPageChange={props.onPageChange}
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
