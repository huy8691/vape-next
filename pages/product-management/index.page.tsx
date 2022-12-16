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
  FormControl,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'

import { NextPageWithLayout } from 'pages/_app.page'
import { ListProductDataType, ProductData } from './modalProductManagement'
import NestedLayout from 'src/layout/nestedLayout'
import { isEmptyObject, objToStringParam } from 'src/utils/global.utils'
import { MenuItemSelectCustom, SelectCustom } from 'src/components'
import classes from './styles.module.scss'
import Link from 'next/link'

// other
import ImageDefault from 'public/images/logo.svg'

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

const TableCellBodyTextCustom = styled(TableCell)(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: 500,
  color: theme.palette.mode === 'dark' ? '#ddd' : '#49516F',
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

const ListProduct: NextPageWithLayout = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  // state use for
  const [stateListProduct, setStateListProduct] = useState<ProductData[]>()
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [count, setCount] = useState<ListProductDataType>()

  useEffect(() => {
    const asPath = router.asPath
    if (!isEmptyObject(router.query)) {
      dispatch(loadingActions.doLoading())
      getProduct(router.query)
        .then((res) => {
          setCount(res.data)
          if (asPath.indexOf('limit=') !== -1) {
            const sliceAsPathCodeSearch = asPath.slice(
              asPath.indexOf('limit=') + 6, //position start
              asPath.indexOf('&', asPath.indexOf('limit=')) // position end
            )
            setRowsPerPage(Number(sliceAsPathCodeSearch))
          }
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

  // handleChangePagination
  const handleChangePagination = (e: any, page: number) => {
    console.log('e', e)
    router.replace({
      search: `${objToStringParam({
        ...router.query,
        page: page,
      })}`,
    })
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
      <TypographyH2 variant="h2" mb={4}>
        Product management
      </TypographyH2>

      <TableContainer
        component={Paper}
        elevation={0}
        style={{ border: '1px solid #E1E6EF', marginBottom: '15px' }}
      >
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
              <TableRowCustom
                key={item.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCellBodyTextCustom component="th" scope="row">
                  {item.id}
                </TableCellBodyTextCustom>

                <TableCellBodyTextCustom
                  align="left"
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  {' '}
                  <div className={classes['image-wrapper']}>
                    <Link href={`/product-detail/${item.id}`}>
                      <Image
                        alt="icon previous page"
                        objectFit="contain"
                        src={item.thumbnail || ImageDefault}
                        width={100}
                        height={100}
                      ></Image>
                    </Link>
                  </div>
                  <Link href={`/product-detail/${item.id}`}>{item.name}</Link>
                </TableCellBodyTextCustom>
                <TableCellBodyTextCustom align="center">
                  {item.code}
                </TableCellBodyTextCustom>
                <TableCellBodyTextCustom align="center">
                  {item.manufacturer}
                </TableCellBodyTextCustom>
                <TableCellBodyTextCustom align="center">
                  {item.brand}
                </TableCellBodyTextCustom>
                <TableCellBodyTextCustom align="center">
                  {item.category}
                </TableCellBodyTextCustom>
                <TableCellBodyTextCustom align="center">
                  {item.price}/{item.unit_types}
                </TableCellBodyTextCustom>
                <TableCellBodyTextCustom align="center">
                  {item.is_active.toString()}
                </TableCellBodyTextCustom>
              </TableRowCustom>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-end"
        spacing={2}
      >
        <Typography>Rows per page</Typography>

        <FormControl sx={{ m: 1 }}>
          <SelectCustom
            value={rowsPerPage.toString()}
            onChange={handleChangeRowsPerPage}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItemSelectCustom value={10}>10</MenuItemSelectCustom>
            <MenuItemSelectCustom value={20}>20</MenuItemSelectCustom>
            <MenuItemSelectCustom value={30}>30</MenuItemSelectCustom>
          </SelectCustom>
        </FormControl>
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          defaultPage={1}
          page={Number(router.query.page) ? Number(router.query.page) : 1}
          onChange={(e, page: number) => handleChangePagination(e, page)}
          count={count ? count?.totalPages : 0}
        ></Pagination>
      </Stack>
    </>
  )
}
ListProduct.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default ListProduct
