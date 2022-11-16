import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { formatMoney } from 'src/utils/money.utils'
import classes from './styles.module.scss'
// import defaultImage from "/image/ProductImageComingSoon.png";

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
    price: number
    unit_types?: string
    quantity?: number
    code?: string
    category?: {
      name: string
    }
  }
}
const ItemProduct: React.FC<Props> = (props: Props) => {
  return (
    <CardCustom variant="outlined" className={classes['item-product']}>
      <Link href={`/product-detail/${props.dataProduct.id}`}>
        <a>
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
        </a>
      </Link>
      <CardContent style={{ paddingBottom: '16px' }}>
        <TypographyCategory
          variant="body1"
          component="div"
          className={classes['item-product__category']}
        >
          {props.dataProduct.category?.name}
        </TypographyCategory>
        <Typography variant="h6" className={classes['item-product__name']}>
          {props.dataProduct.name}
        </Typography>
        <Box className={classes['item-product__price']}>
          {formatMoney(props.dataProduct.price)}/
          <span className={classes['item-product__price__unit']}>
            {props.dataProduct.unit_types}
          </span>
        </Box>
        <Box className={classes['item-product__code']}>
          {props.dataProduct.code}
        </Box>
      </CardContent>
    </CardCustom>
  )
}

export default ItemProduct
