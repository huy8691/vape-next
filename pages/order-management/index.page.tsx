import {
  FormControl,
  FormHelperText,
  IconButton,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useEffect, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { styled } from '@mui/system'
import { MagnifyingGlass } from 'phosphor-react'
import classes from './styles.module.scss'
// import { Controller } from 'react-hook-form'

// not need this time
// import { ButtonCustom } from 'src/components'

// import PropTypes from 'prop-types'
import TablePaginationAction from './parts/TablePaginationAction'
import { formatMoney } from 'src/utils/money.utils'
import { isEmptyObject, objToStringParam } from 'src/utils/global.utils'

// react-hook-form
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useRouter } from 'next/router'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { getOrders } from './apiOrders'
import { notificationActions } from 'src/store/notification/notificationSlice'
import { OrderListDataResponseType } from './modelOrders'
import moment from 'moment'
import Image from 'next/image'
import { TextFieldCustom } from 'src/components'

const schema = yup.object({
  content: yup.string().matches(
    // /^[aA-zZ\s]+$/,
    /^[\w-_.]*$/,
    'Special character are not allowed for this field '
  ),
})

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 'bold',
  color: theme.palette.mode === 'dark' ? '#ddd' : '##49516F',
}))

const TableRowCustom = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.mode === 'dark' ? '#212125' : '#F8F9FC',
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

// const TableRowPaginationnCustom = styled(TableRow)(({ theme }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? '#212125' : '#F8F9FC',
// }))

const StatusFilterType: {
  [key: string]: number
} = {
  WAITING_FOR_APPROVED: 1,
  APPROVED: 2,
  DELIVERING: 3,
  DELIVERED: 4,
  CANCELLED: 5,
}

const StatusOrder: {
  [key: string]: number
} = {
  'WAITING FOR APPROVED': 0,
  APPROVED: 1,
  DELIVERING: 2,
  DELIVERED: 3,
  CANCELLED: 4,
}

const Status = [
  {
    text: 'WAITING FOR APPROVED',
    color: '#49516F',
  },
  {
    text: 'APPROVED',
    color: '#1DB46A',
  },
  {
    text: 'DELIVERING',
    color: '#2F6FED',
  },
  {
    text: 'DELIVERED',
    color: '#1DB46A',
  },
  {
    text: 'CANCELLED',
    color: '#E02D3C',
  },
]

interface SearchFormInput {
  content: string
}

const OrderManageMent: NextPageWithLayout = () => {
  // state use for table
  const [rowsPerPage, setRowsPerPage] = useState(10)
  // state use for tab
  const [valueTab, setValueTab] = useState(0)
  // state use for list order
  const [dataOrders, setDataOrders] = useState<OrderListDataResponseType>()
  const router = useRouter()
  const dispatch = useAppDispatch()
  // state use for store next page is null or <number></number>
  const [nextPage, setNextPage] = useState<number | null>()
  // const [page, setPage] = useState(0)

  //state use for tab
  const [tabDisabled, setTabDisabled] = useState<boolean>(false)
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
  }
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event)
    setValueTab(newValue)
  }
  const {
    // register,
    setValue,
    control,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormInput>({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    let asPath = router.asPath
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
          if (asPath.indexOf('code=') !== -1) {
            let sliceAsPathCodeSearch = asPath.slice(
              asPath.indexOf('code=') + 5, //position start
              asPath.indexOf('&', asPath.indexOf('code=')) // position end
            )
            setValue('content', sliceAsPathCodeSearch)
          }
          if (asPath.indexOf('status=') !== -1) {
            let sliceAsPathStatusFilter: string = asPath.slice(
              asPath.indexOf('status=') + 7,
              asPath.indexOf('&', asPath.indexOf('status='))
            )
            console.log('here', sliceAsPathStatusFilter)

            setValueTab(StatusFilterType[sliceAsPathStatusFilter])
            // if (sliceAsPathStatusFilter === StatusFilterType[1]) {
            //   setValueTab(1)
            // }
          } else {
            setValueTab(0)
          }
          setDataOrders(data)
          dispatch(loadingActions.doLoadingSuccess())
          setTabDisabled(false)
        })
        .catch((error: any) => {
          const data = error.response?.data
          console.log(data)
          setDataOrders(undefined)
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
          // if (data.data.length === 0) {
          //   dispatch(
          //     notificationActions.doNotification({
          //       message: 'There are no orders at this time',
          //       type: 'error',
          //     })
          //   )
          // }
          setValue('content', '')
          setDataOrders(data)
          dispatch(loadingActions.doLoadingSuccess())
          setTabDisabled(false)
          setValueTab(0)
          setRowsPerPage(10)
        })
        .catch(() => {
          // const data = error.response?.data
          // console.log(
          //   '🚀 ~ file: index.page.tsx ~ line 386 ~ useEffect ~ data',
          //   data
          // )
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
  // check if input has white space
  function hasWhiteSpace(s: string) {
    return /^\s+$/g.test(s)
  }

  function hasSpecialCharacter(input: string) {
    // eslint-disable-next-line no-useless-escape
    return /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\/\\?\,]+$/g.test(
      input
    )
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
    }
    if (hasSpecialCharacter(getValues('content'))) {
      dispatch(
        notificationActions.doNotification({
          message: 'Error',
          type: 'error',
        })
      )
    } else {
      router.replace({
        search: `${objToStringParam({
          ...router.query,
          code: getValues('content'),
          page: 1,
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
      <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: '20px' }}>
        <Grid container spacing={2}>
          <Grid xs={8} display="flex" alignItems="center">
            <div className={classes[`form-search`]}>
              <Controller
                control={control}
                name="content"
                render={({ field }) => (
                  <>
                    <FormControl fullWidth>
                      <TextFieldCustom
                        // sx={{
                        //   padding: '10px',
                        // }}
                        id="content"
                        error={!!errors.content}
                        placeholder="Search by order no..."
                        onKeyPress={(event) => {
                          if (hasSpecialCharacter(event.key)) {
                            event.preventDefault()
                          }
                        }}
                        {...field}
                      />
                    </FormControl>
                  </>
                )}
              />

              <IconButton
                type="submit"
                sx={{ p: '10px' }}
                aria-label="search"
                className={classes[`form-search__button`]}
              >
                <MagnifyingGlass size={20} />
              </IconButton>
            </div>
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
        <FormHelperText error>{errors.content?.message}</FormHelperText>
      </form>
      {dataOrders?.data.length === 0 ? (
        <>
          <Grid container spacing={2} justifyContent="center">
            <Grid>
              <Stack
                p={5}
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src="/images/not-found.svg"
                  alt="Logo"
                  width="200"
                  height="200"
                />
                <Typography variant="h6" sx={{ marginTop: '0' }}>
                  You don’t have any order
                </Typography>
                {/* <Link href="/browse-products">
                  <ButtonCustom variant="contained" style={{ padding: '15px' }}>
                    <Typography style={{ fontWeight: '600' }}>
                      Back to home
                    </Typography>
                  </ButtonCustom>
                </Link> */}
              </Stack>
            </Grid>
          </Grid>
        </>
      ) : (
        <>
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
                      style={{
                        textTransform: 'capitalize',
                        color: `${Status[StatusOrder[row.status]].color}`,
                      }}
                    >
                      {row.status.toLowerCase()}
                    </TableCellBodyTextCustom>
                    {/* <TableCellBodyTextCustom align="center">{row.paymentMethod}</TableCellBodyTextCustom> */}
                    <TableCellBodyTextCustom
                      align="center"
                      style={{ textTransform: 'capitalize' }}
                    >
                      {row.payment_status.toLowerCase()}
                    </TableCellBodyTextCustom>
                    <TableCellBodyTextCustom align="center">
                      {row.receiver}
                    </TableCellBodyTextCustom>
                    {row.address.length > 15 ? (
                      <Tooltip
                        title={row.address}
                        placement="top"
                        arrow
                        sx={{ fontSize: '14px' }}
                      >
                        <TableCellBodyTextCustom
                          align="center"
                          style={{
                            maxWidth: '150px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {row.address}
                        </TableCellBodyTextCustom>
                      </Tooltip>
                    ) : (
                      <TableCellBodyTextCustom
                        align="center"
                        style={{
                          maxWidth: '150px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.address}
                      </TableCellBodyTextCustom>
                    )}
                  </TableRowCustom>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <table
            style={{
              width: '100%',
              // backgroundColor: '#F1F3F9',
              borderRadius: '5px',
              border: '1px solid #E1E6EF',
            }}
          >
            <tbody>
              <TableRow>
                <TablePagination
                  sx={{ borderBottom: '0' }}
                  count={dataOrders ? dataOrders?.totalItems : 0}
                  rowsPerPageOptions={[5, 10, 15, 20]}
                  rowsPerPage={rowsPerPage}
                  page={
                    Number(router.query.page)
                      ? Number(router.query.page) - 1
                      : 0
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
              </TableRow>
            </tbody>
          </table>
        </>
      )}
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
