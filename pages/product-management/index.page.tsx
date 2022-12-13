/* eslint-disable react-hooks/exhaustive-deps */
//React/Next
import React, { ReactElement, useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

//API
import { notificationActions } from 'src/store/notification/notificationSlice'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { getProduct } from './apiProductManagement'

//material
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'

import { NextPageWithLayout } from 'pages/_app.page'
import { ListProductDataType, ProductData } from './modalProductManagement'
import NestedLayout from 'src/layout/nestedLayout'
import { isEmptyObject, objToStringParam } from 'src/utils/global.utils'
import TablePaginationAction from './parts/TablePaginationAction'

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '3.2rem',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#1B1F27',
}))

const TableCellHeadingTextCustom = styled(TableCell)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 400,
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
}))
const ListProduct: NextPageWithLayout = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  // state use for
  const [stateListProduct, setStateListProduct] = useState<ProductData[]>()
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [count, setCount] = useState<ListProductDataType>()

  useEffect(() => {
    if (!isEmptyObject(router.query)) {
      dispatch(loadingActions.doLoading())
      getProduct(router.query)
        .then((res) => {
          setCount(res.data)
          const { data } = res.data
          setStateListProduct(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((error: any) => {
          const data = error.response?.data
          console.log(data)
          setStateListProduct(undefined)
          dispatch(loadingActions.doLoadingFailure())
          dispatch(
            notificationActions.doNotification({
              message: 'Something went wrongs with the server',
              type: 'error',
            })
          )
        })
    }
    if (router.asPath === '/product-management') {
      dispatch(loadingActions.doLoading())
      getProduct({ page: 1 })
        .then((res) => {
          setCount(res.data)
          const { data } = res.data
          setStateListProduct(data)
          dispatch(loadingActions.doLoadingSuccess())
          setRowsPerPage(10)
        })
        .catch(() => {
          dispatch(loadingActions.doLoadingFailure())
          dispatch(
            notificationActions.doNotification({
              message: 'Something went wrongs with the server',
              type: 'error',
            })
          )
        })
    }
  }, [dispatch, router.query])
  //TablePagination
  const handleChangePage = (event: any) => {
    console.log(event)
  }

  // trigger when change row per page option ( page size )
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    const tableSize = parseInt(event.target.value)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        limit: tableSize,
        page: 1,
      })}`,
    })
  }
  return (
    <>
      <TypographyH2 variant="h2" sx={{ textAlign: 'center' }} mb={4}>
        List product
      </TypographyH2>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCellHeadingTextCustom align="left">
                ID
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="left">
                Name
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="center">
                Code
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="center">
                Manufacturer
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="center">
                Brand
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="center">
                Category
              </TableCellHeadingTextCustom>
              <TableCellHeadingTextCustom align="center">
                Price
              </TableCellHeadingTextCustom>

              <TableCellHeadingTextCustom align="center">
                Is Active
              </TableCellHeadingTextCustom>
            </TableRow>
          </TableHead>
          <TableBody>
            {stateListProduct?.map((item) => (
              <TableRow
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {item.id}
                </TableCell>

                <TableCell
                  align="left"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {' '}
                  <Image
                    alt="icon previous page"
                    objectFit="contain"
                    src={item.thumbnail}
                    width={100}
                    height={100}
                  ></Image>
                  {item.name}
                </TableCell>
                <TableCell align="center">{item.code}</TableCell>
                <TableCell align="center">{item.manufacturer}</TableCell>
                <TableCell align="center">{item.brand}</TableCell>
                <TableCell align="center">{item.category}</TableCell>
                <TableCell align="center">
                  {item.price}/{item.unit_types}
                </TableCell>

                <TableCell align="center">
                  {item.is_active.toString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableRow>
            <TablePagination
              sx={{ borderBottom: '0' }}
              count={count ? count?.totalItems : 0}
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
                    nextIsNull={Number(count ? count?.nextPage : 0)}
                  />
                )
              }}
            ></TablePagination>
          </TableRow>
        </Table>
      </TableContainer>
    </>
  )
}
ListProduct.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default ListProduct
