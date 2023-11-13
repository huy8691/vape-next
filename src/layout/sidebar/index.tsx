import { Box } from '@mui/material'
import { useRouter } from 'next/router'
import { useAppSelector } from 'src/store/hooks'
import MenuMerchant from './menuMerchant'
import MenuSupplier from './menuSupplier'
import MenuSupplierMaster from './menuSupplierMaster'
import MenuRetailerMaster from './menuRetailerMaster'
import MenuAdmin from './menuAdmin'

type Props = {
  open: boolean
}

const SideBar = ({ open }: Props) => {
  const userInfo = useAppSelector((state) => state.userInfo)
  const router = useRouter()
  console.log('userInfo', userInfo)
  return (
    <Box sx={{ paddingBottom: '50px' }}>
      {((router.pathname.startsWith('/404') &&
        userInfo.data.user_type === 'MERCHANT') ||
        (router.pathname.startsWith('/403') &&
          userInfo.data.user_type === 'MERCHANT')) && (
        <>
          {userInfo.data.is_master === true && (
            <MenuRetailerMaster open={open} />
          )}
          {userInfo.data.is_master === false && <MenuMerchant open={open} />}
        </>
      )}
      {((router.pathname.startsWith('/404') &&
        userInfo.data.user_type === 'SUPPLIER') ||
        (router.pathname.startsWith('/403') &&
          userInfo.data.user_type === 'SUPPLIER')) && (
        <>
          {userInfo.data.is_master === true && (
            <MenuSupplierMaster open={open} />
          )}
          {userInfo.data.is_master === false && <MenuSupplier open={open} />}
        </>
      )}
      {router.pathname.startsWith('/retailer') && (
        <>
          {userInfo.data.is_master === true && (
            <MenuRetailerMaster open={open} />
          )}
          {userInfo.data.is_master === false && <MenuMerchant open={open} />}
        </>
      )}
      {router.pathname.startsWith('/supplier') && (
        <>
          {userInfo.data.is_master === true && (
            <MenuSupplierMaster open={open} />
          )}
          {userInfo.data.is_master === false && <MenuSupplier open={open} />}
        </>
      )}
      {((router.pathname.startsWith('/404') &&
        userInfo.data.user_type === 'ADMIN') ||
        (router.pathname.startsWith('/403') &&
          userInfo.data.user_type === 'ADMIN')) && <MenuAdmin open={open} />}
      {router.pathname.startsWith('/admin') && <MenuAdmin open={open} />}
    </Box>
  )
}

export default SideBar
