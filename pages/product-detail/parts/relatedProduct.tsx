import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// import { Result, Row, Col, Typography, Space, Alert } from 'antd'
// import { FileSyncOutlined } from '@ant-design/icons'
//mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'

import { getRelatedProduct } from '../apiProductDetail'
import { ItemProduct } from 'src/components'

import {
  ProductListDataResponseType,
  ProductDataType,
} from '../modelProductDetail'

//api
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
// import { notificationActions } from 'src/store/notification/notificationSlice'

const RelatedProduct: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [relatedProducts, setRelatedProducts] =
    useState<ProductListDataResponseType>()

  // Call api "get related products" and assign variables
  useEffect(() => {
    console.log('555', router.query)
    setRelatedProducts({})
    if (router.query.id) {
      dispatch(loadingActions.doLoading())
      getRelatedProduct(router.query.id)
        .then((res) => {
          const data = res.data

          setRelatedProducts(data)
          dispatch(loadingActions.doLoadingSuccess())
        })
        .catch((error) => {
          const data = error.response?.data
          console.log(
            '🚀 ~ file: relatedProduct.tsx ~ line 43 ~ useEffect ~ data',
            data
          )
          dispatch(loadingActions.doLoadingFailure())
          // dispatch(
          //   notificationActions.doNotification({
          //     message: data?.message ? data?.message : 'Error',
          //     type: 'error',
          //   })
          // )
        })
    }
  }, [router, dispatch])
  // Check conditions then map data and render related products
  const renderResult = () => {
    if (relatedProducts?.errors) {
      return <div> Somethings went wrong </div>
    }
    if (relatedProducts?.data?.length === 0) {
      return <div>Products not found</div>
    }
    return (
      <>
        <Box mb={4}>
          <Grid container spacing={2}>
            {relatedProducts?.data?.map(
              (item: ProductDataType, index: number) => (
                <Grid xs={2} key={index}>
                  <ItemProduct dataProduct={item} />
                </Grid>
              )
            )}
          </Grid>
        </Box>
      </>
    )
  }

  return renderResult()
}

export default RelatedProduct
