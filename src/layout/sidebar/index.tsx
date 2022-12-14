import React from 'react'
// api
import { useAppSelector } from 'src/store/hooks'

import MenuMerchant from './menuMerchant'
import MenuSupplier from './menuSupplier'
// other

type Props = {
  open: boolean
}

const SideBar = ({ open }: Props) => {
  const userInfo = useAppSelector((state) => state.userInfo)
  console.log(userInfo.data.user_type)
  return (
    <>
      {userInfo.data.user_type === 'MERCHANT' && <MenuMerchant open={open} />}
      {userInfo.data.user_type === 'SUPPLIER' && <MenuSupplier open={open} />}
    </>
  )
}
export default SideBar
