import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

import classes from './styles.module.scss'
// import defaultImage from "/image/ProductImageComingSoon.png";
import iconFavorite from './parts/icon/heartWishList.svg'
import { formatMoney } from 'src/utils/money.utils'
import { Stack } from '@mui/material'
import { Cube } from '@phosphor-icons/react'
const CardCustom = styled(Card)(({ theme }) => ({
  borderRadius: '15px',
  // border: '1px solid #E1E6EF',
  border:
    theme.palette.mode === 'light'
      ? '1px solid #E1E6EF'
      : '1px solid rgba(255, 255, 255, 0.12)',
}))

const TypographyCategory = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
}))

type Props = {
  dataProduct: {
    id: number
    name: string
    thumbnail: string
    stock_all?: number
    instock?: number
    price?: number
    unit_type?: string
    quantity?: number
    code?: string
    category?: {
      name: string
    }
    category_marketplace?: {
      name: string
    }
    is_favorite?: boolean
    stockAll?: number
    min_price?: number
    max_price?: number
    variants_count?: number
    product_id?: number
    price_discount?: number | null
  }
}
const ItemProduct: React.FC<Props> = (props: Props) => {
  return (
    <>
      <Link
        href={`/retailer/market-place/product-detail/${props.dataProduct.id}`}
      >
        <a>
          <CardCustom variant="outlined" className={classes['item-product']}>
            {props?.dataProduct?.is_favorite && (
              <div className={classes['item-product__icon-hear']}>
                <Image
                  alt="icon-favorite"
                  src={iconFavorite}
                  objectFit="contain"
                  width="18"
                  height="18"
                />
              </div>
            )}

            <Image
              alt={props.dataProduct.name}
              src={
                props.dataProduct.thumbnail
                  ? props.dataProduct.thumbnail
                  : 'https://via.placeholder.com/200x200?text=VAPE'
              }
              width="260"
              height="260"
              objectFit="contain"
            />

            <CardContent style={{ paddingBottom: '16px' }}>
              <TypographyCategory
                variant="body1"
                className={classes['item-product__category']}
              >
                {props.dataProduct.category_marketplace?.name}
              </TypographyCategory>
              <Typography
                variant="h6"
                className={classes['item-product__name']}
              >
                {props.dataProduct.name}
              </Typography>
              <Box className={classes['item-product__price']}>
                {props.dataProduct.min_price === props.dataProduct.max_price ? (
                  props.dataProduct.price_discount ? (
                    <Stack direction="row" spacing={0.5} alignItems="baseline">
                      <Typography>
                        {formatMoney(props.dataProduct.price_discount)}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: '1.2rem',
                          textDecoration: 'line-through !important',
                        }}
                      >
                        {formatMoney(props.dataProduct.min_price)}
                      </Typography>
                      <span className={classes['item-product__price__unit']}>
                        {'/'}
                        {props.dataProduct.unit_type}
                      </span>
                    </Stack>
                  ) : (
                    <Stack direction="row" spacing={1} alignItems="baseline">
                      {formatMoney(props.dataProduct.min_price)}{' '}
                      <span className={classes['item-product__price__unit']}>
                        {'/'}
                        {props.dataProduct.unit_type}
                      </span>
                    </Stack>
                  )
                ) : (
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    {formatMoney(props.dataProduct.min_price)} -
                    {formatMoney(props.dataProduct.max_price)}
                    <span className={classes['item-product__price__unit']}>
                      {'/'}
                      {props.dataProduct.unit_type}
                    </span>
                  </Stack>
                )}
                {/*
                <span className={classes['item-product__price__unit']}>
                  {'/'}
                  {props.dataProduct.unit_type}
                </span> */}
              </Box>
              <Box
                className={classes['item-product__code']}
                sx={{ marginBottom: '5px' }}
              >
                #{props.dataProduct.code}
              </Box>

              {props.dataProduct.variants_count &&
              props.dataProduct.variants_count > 0 ? (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      fontWeight: 300,
                      fontSize: '1rem',
                      textTransform: 'lowercase',
                      color: '#1B1F27',
                    }}
                  >
                    {props.dataProduct.variants_count} variants
                  </Typography>
                  <Cube size={18} />
                </Stack>
              ) : (
                <Typography
                  sx={{
                    fontWeight: 300,
                    fontSize: '1rem',
                    textTransform: 'lowercase',
                    color: '#1B1F27',
                  }}
                >
                  {props.dataProduct.instock} {props.dataProduct.unit_type} in
                  stock
                </Typography>
              )}
            </CardContent>
          </CardCustom>
        </a>
      </Link>
    </>
  )
}

export default ItemProduct
