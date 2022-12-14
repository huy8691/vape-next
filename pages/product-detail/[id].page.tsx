import { NextPageWithLayout } from 'pages/_app.page'
import React, { ReactElement } from 'react'
import NestedLayout from 'src/layout/nestedLayout'
import { useAppSelector } from 'src/store/hooks'
import MerchantProductDetail from './merchantProductDetail'
import SupplierProductDetail from './supplierProductDetail'
const ProductDetail: NextPageWithLayout = () => {
  const userInfo = useAppSelector((state) => state.userInfo)
  return (
    <>
      {userInfo.data.user_type === 'MERCHANT' && <MerchantProductDetail />}
      {userInfo.data.user_type === 'SUPPLIER' && <SupplierProductDetail />}
    </>
  )
}
ProductDetail.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default ProductDetail
