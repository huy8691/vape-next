import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
// import { Result, Row, Col, Typography, Space, Alert } from 'antd'
// import { FileSyncOutlined } from '@ant-design/icons'

import { getRelatedProduct } from '../apiProductDetail'
// import { ItemProduct } from 'src/components'

import {
  RelatedListDataResponseType,
  RelatedProducttype,
} from '../modelProductDetail'

//api
import { useAppDispatch } from 'src/store/hooks'
import { loadingActions } from 'src/store/loading/loadingSlice'
// import { notificationActions } from 'src/store/notification/notificationSlice'

//mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles'

//styled component
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Link from 'next/link'
import Image from 'next/image'
import { Skeleton, Typography } from '@mui/material'

const CardCustom = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  border:
    theme.palette.mode === 'light'
      ? '1px solid #E1E6EF'
      : '1px solid rgba(255, 255, 255, 0.12)',
}))
const CodeText = styled('span')(() => ({
  fontSize: '12px',
  fontWeight: '300',
}))
const PriceText = styled('span')(({ theme }) => ({
  fontSize: '14px',
  fontWeight: '700',
  color: theme.palette.error.main,
}))
const TypographyH6 = styled(Typography)(() => ({
  fontSize: '15px',
  fontWeight: '400',
}))

const RelatedProduct: React.FC = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [relatedProducts, setRelatedProducts] =
    useState<RelatedListDataResponseType>()

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
              (item: RelatedProducttype, index: number) => (
                <Grid xs={2} key={index}>
                  {/* <ItemProduct dataProduct={item} /> */}

                  <CardCustom variant="outlined">
                    <Link href={`/product-detail/${item.id}`}>
                      <a>
                        {item.thumbnail ? (
                          <Image
                            alt={item.name}
                            src={
                              item.thumbnail
                                ? item.thumbnail
                                : 'https://via.placeholder.com/200x200?text=VAPE'
                            }
                            width="500"
                            height="500"
                            objectFit="contain"
                          />
                        ) : (
                          <Skeleton
                            animation="wave"
                            variant="rounded"
                            height={340}
                            width="100%"
                          />
                        )}
                      </a>
                    </Link>
                    <CardContent style={{ paddingBottom: '16px' }}>
                      <Box>
                        {item.code ? (
                          <CodeText>{item.code}</CodeText>
                        ) : (
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        )}
                      </Box>
                      <TypographyH6 variant="h6">{item.name}</TypographyH6>
                      <Box>
                        {item.price && item.unit_types ? (
                          <PriceText>
                            {item.price} {item.unit_types}
                          </PriceText>
                        ) : (
                          <Skeleton variant="text" sx={{ fontSize: '1rem' }} />
                        )}
                      </Box>
                    </CardContent>
                  </CardCustom>
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
