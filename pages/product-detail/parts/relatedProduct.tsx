import React from 'react'
import {
  ProductDataType,
  ProductListDataResponseType,
} from '../modelProductDetail'

// next
import Link from 'next/link'
import Image from 'next/image'

//mui
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import { Skeleton, Typography } from '@mui/material'

//styled component
const CardCustom = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  height: '100%',
  border:
    theme.palette.mode === 'light'
      ? '1px solid #E1E6EF'
      : '1px solid rgba(255, 255, 255, 0.12)',
}))
const CodeText = styled('div')(() => ({
  fontSize: '1.2rem',
  fontWeight: '300',
}))
const PriceText = styled('div')(({ theme }) => ({
  fontSize: '1.4rem',
  fontWeight: '700',
  color: theme.palette.error.main,
}))
const TypographyH6 = styled(Typography)(() => ({
  fontSize: '1.4rem',
  fontWeight: '400',
  marginBottom: '5px',
}))

type Props = {
  relatedProducts: ProductListDataResponseType | undefined
}

const RelatedProduct: React.FC<Props> = (props: Props) => {
  if (props?.relatedProducts?.errors) {
    return <div> Somethings went wrong </div>
  }
  if (!props?.relatedProducts?.data) {
    return (
      <Box mb={4}>
        <Grid container spacing={2}>
          {Array.from(Array(6).keys()).map((index: number) => (
            <Grid xs={2} key={index}>
              <CardCustom variant="outlined">
                <Box mb={2}>
                  <Skeleton animation="wave" variant="rounded" height={255} />
                </Box>
                <CardContent style={{ paddingBottom: '16px' }}>
                  <Skeleton variant="text" sx={{ fontSize: '1.2rem' }} />
                  <Skeleton variant="text" sx={{ fontSize: '1.4rem' }} />
                  <Skeleton variant="text" sx={{ fontSize: '1.5rem' }} />
                </CardContent>
              </CardCustom>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }
  return (
    <Box mb={4}>
      <Grid container spacing={2}>
        {props?.relatedProducts?.data?.map(
          (item: ProductDataType, index: number) => (
            <Grid xs={2} key={index}>
              <Link href={`/product-detail/${item.id}`}>
                <a>
                  <CardCustom variant="outlined">
                    <CardMedia>
                      <Image
                        alt={item.name}
                        src={
                          item.thumbnail
                            ? item.thumbnail
                            : 'https://via.placeholder.com/250x250?text=VAPE'
                        }
                        width="290"
                        height="290"
                        objectFit="contain"
                      />
                    </CardMedia>
                    <CardContent style={{ paddingBottom: '16px' }}>
                      <CodeText>{item.code}</CodeText>
                      <TypographyH6 variant="h6">{item.name}</TypographyH6>
                      <PriceText>
                        {item.price}{' '}
                        <span style={{ textTransform: 'lowercase' }}>
                          {item.unit_types}
                        </span>
                      </PriceText>
                    </CardContent>
                  </CardCustom>
                </a>
              </Link>
            </Grid>
          )
        )}
      </Grid>
    </Box>
  )
}

export default RelatedProduct
