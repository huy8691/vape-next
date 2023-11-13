import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import classes from './styles.module.scss'
// import defaultImage from "/image/ProductImageComingSoon.png";
import { Stack } from '@mui/material'
import { formatMoney } from 'src/utils/money.utils'
import iconFavorite from './parts/icon/heartWishList.svg'
import { useTranslation } from 'react-i18next'
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
    id?: number
    name: string
    thumbnail: string

    unit_type?: string
    quantity?: number
    code?: string
    category?: {
      name: string
    }
    is_favorite: boolean
    price: number

    product_id?: number
  }
}
const ItemProduct: React.FC<Props> = (props: Props) => {
  console.log('🚀 ~ file: index.tsx:48 ~ props:', props.dataProduct)
  const { t } = useTranslation('wish-list')
  return (
    <>
      <Link
        href={
          props.dataProduct.id
            ? `/retailer/market-place/product-detail/${props.dataProduct.product_id}?variant=${props.dataProduct.id}`
            : `/retailer/market-place/product-detail/${props.dataProduct.product_id}`
        }
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
                  : '/' + '/images/defaultProductImage.png'
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
                {props.dataProduct.category?.name}
              </TypographyCategory>
              <Typography
                variant="h6"
                className={classes['item-product__name']}
              >
                {props.dataProduct.name}
              </Typography>
              <Box className={classes['item-product__price']}>
                {formatMoney(props.dataProduct.price)}

                <span className={classes['item-product__price__unit']}>
                  {'/'}
                  {t(`${props.dataProduct.unit_type}` as any)}
                </span>
              </Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box className={classes['item-product__code']}>
                  #{props.dataProduct.code}
                </Box>
              </Stack>
            </CardContent>
          </CardCustom>
        </a>
      </Link>
    </>
  )
}

export default ItemProduct
