import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement, useEffect, useState } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { styled } from '@mui/system'
import { ProductData } from './modalProductManagement'
import { getProduct } from './apiProductManagement'
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
import { notificationActions } from 'src/store/notification/notificationSlice'
import Image from 'next/image'

const TypographyH2 = styled(Typography)(({ theme }) => ({
  fontSize: '3.2rem',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#ddd' : '#1B1F27',
}))

const ListProduct: NextPageWithLayout = () => {
  const dispatch = useAppDispatch()
  const [stateListProduct, setStateListProduct] = useState<ProductData[]>()

  useEffect(() => {
    dispatch(loadingActions.doLoading())
    getProduct()
      .then((res) => {
        const { data } = res.data
        setStateListProduct(data)
        dispatch(loadingActions.doLoadingSuccess())
        dispatch(
          notificationActions.doNotification({
            message: 'Successfully',
          })
        )
      })
      .catch(() => {
        dispatch(loadingActions.doLoadingFailure())
        dispatch(
          notificationActions.doNotification({
            message: 'Error',
            type: 'error',
          })
        )
      })
  }, [])

  return (
    <>
      <TypographyH2 variant="h2" sx={{ textAlign: 'center' }} mb={4}>
        List product
      </TypographyH2>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">ID</TableCell>
              <TableCell align="left">Name</TableCell>
              <TableCell align="center">Code</TableCell>
              <TableCell align="center">Manufacturer</TableCell>
              <TableCell align="center">Brand</TableCell>
              <TableCell align="center">Category</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Long Description</TableCell>
              <TableCell align="center">Status</TableCell>
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
                <TableCell align="center">{item.description}</TableCell>
                <TableCell align="center">{item.longDescription}</TableCell>
                <TableCell align="center">{item.is_active}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}
ListProduct.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default ListProduct
