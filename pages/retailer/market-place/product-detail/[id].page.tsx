import { ReactElement } from 'react'

import { ProductDetailType } from './modelProductDetail'
// mui
import Box from '@mui/material/Box'

// form

// icon wishlist
//slick

// other
import Link from 'next/link'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

// api

// custom style
import { NextPageWithLayout } from 'pages/_app.page'
import 'react-photo-view/dist/react-photo-view.css'
import NestedLayout from 'src/layout/nestedLayout'
import { KEY_MODULE, PERMISSION_RULE } from 'src/utils/global.utils'

import ProductDetailComponent from './parts'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
// style

type Props = {
  category: ProductDetailType['category']
  organization: ProductDetailType['organization']
}
const BreadcrumbsCategory = (props: Props) => {
  return (
    <Box
      style={{
        display: 'flex',
        flexWrap: 'nowrap',
      }}
    >
      {props.category?.parent_category?.id && (
        <>
          <BreadcrumbsCategory
            category={props.category?.parent_category}
            organization={props.organization}
          />
          <span
            style={{
              display: 'flex',
              userSelect: 'none',
              marginLeft: '8px',
              marginRight: '8px',
            }}
          >
            {'>'}
          </span>
        </>
      )}
      <Link
        href={`/retailer/market-place/browse-products?page=1&category=category-${
          props.category.id
        }-parentId${
          props.category.parent_category?.id
            ? props.category.parent_category?.id
            : ''
        }-org${props.organization.id}-name${props.category.name}`}
      >
        <a style={{ color: '#2F6FED', fontSize: '1.4rem' }}>
          {props.category.name}
        </a>
      </Link>
    </Box>
  )
}

const ProductDetail: NextPageWithLayout = () => {
  return <ProductDetailComponent />
}

ProductDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
ProductDetail.permissionPage = {
  key_module: KEY_MODULE.Product,
  permission_rule: PERMISSION_RULE.ViewDetails,
}
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'account',
        'productDetail',
      ])),
    },
  }
}
export default ProductDetail
