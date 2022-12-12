import React, { useEffect, useState } from 'react'
import Link from 'next/link'
// mui
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
// import ExpandLess from '@mui/icons-material/ExpandLess'
// import ExpandMore from '@mui/icons-material/ExpandMore'
// import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/router'
// mui

// api
import { useAppDispatch } from 'src/store/hooks'
import { useAppSelector } from 'src/store/hooks'
import { cartActions } from 'src/store/cart/cartSlice'

// other
import {
  House,
  // Storefront,
  ShoppingCart,
  Cube,
  Heart,
  ListBullets,
} from 'phosphor-react'
// other

type Props = {
  open: boolean
}
const Menu = [
  {
    icon: <House size={24} />,
    text: 'Dashboard',
    link: '/',
  },
  {
    icon: <Cube size={24} />,
    text: 'Browse products',
    link: '/browse-products',
  },
  {
    icon: <ShoppingCart size={24} />,
    text: 'Cart',
    link: '/cart',
    suffix: true,
  },
  {
    icon: <ListBullets size={24} />,
    text: 'Order',
    link: '/order-management',
  },
  {
    icon: <Heart size={24} />,
    text: 'Wishlist',
    link: '/',
  },
]

const MenuMerchant = ({ open }: Props) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cart = useAppSelector((state) => state.cart)
  const userInfo = useAppSelector((state) => state.userInfo)
  // const [openCollapse, setOpenCollapse] = useState<boolean>(true)
  const [stateItemCart, setStateItemCart] = useState<number>(0)
  useEffect(() => {
    if (userInfo.data.user_type === 'MERCHANT') {
      dispatch(cartActions.doCart())
    }
  }, [dispatch, userInfo.data.user_type])

  useEffect(() => {
    setStateItemCart(cart.data.amountItems)
  }, [cart])

  return (
    <>
      <List>
        {Menu.map((item, index) => (
          <ListItem
            disablePadding
            selected={item.link === router.pathname}
            sx={{ display: 'block' }}
            key={`${item.text}${index}`}
          >
            <Link href={item.link}>
              <a>
                {open ? (
                  <>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {open && item.suffix && (
                        <IconButton>
                          <Badge
                            badgeContent={stateItemCart}
                            color="primary"
                          ></Badge>
                        </IconButton>
                      )}
                    </ListItemButton>
                  </>
                ) : (
                  <Tooltip title={item.text} arrow placement="right">
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.text}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </Tooltip>
                )}
              </a>
            </Link>
          </ListItem>
        ))}
        {/* <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={() => setOpenCollapse(!openCollapse)}>
            <ListItemIcon>
              <Storefront size={24} />
            </ListItemIcon>
            <ListItemText primary="Market Place" />
            {openCollapse ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openCollapse} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link href="/browse-products">
              <a>
                <ListItemButton
                  sx={{ pl: 3 }}
                  selected={router.pathname === '/browse-products'}
                >
                  {open ? (
                    <ListItemText primary="Browse products" />
                  ) : (
                    <ListItemIcon>
                      <FileSearch />
                    </ListItemIcon>
                  )}
                </ListItemButton>
              </a>
            </Link>
            <Link href="/cart">
              <a>
                <ListItemButton
                  sx={{ pl: 3 }}
                  selected={router.pathname === '/cart'}
                >
                  {open ? (
                    <>
                      <ListItemText primary="Cart" />
                      <IconButton>
                        <Badge
                          badgeContent={stateItemCart}
                          color="primary"
                        ></Badge>
                      </IconButton>
                    </>
                  ) : (
                    <ListItemIcon>
                      <ShoppingCart />
                    </ListItemIcon>
                  )}
                </ListItemButton>
              </a>
            </Link>
            <Link href="/order-management">
              <a>
                <ListItemButton
                  sx={{ pl: 3 }}
                  selected={router.pathname === '/order-management'}
                >
                  {open ? (
                    <>
                      <ListItemText primary="Order" />
                    </>
                  ) : (
                    <ListItemIcon>
                      <ShoppingCart />
                    </ListItemIcon>
                  )}
                </ListItemButton>
              </a>
            </Link>
            <Link href="/">
              <a>
                <ListItemButton sx={{ pl: 3 }}>
                  {open ? (
                    <ListItemText primary="Wishlist" />
                  ) : (
                    <ListItemIcon>
                      <Heart />
                    </ListItemIcon>
                  )}
                </ListItemButton>
              </a>
            </Link>
          </List>
        </Collapse> */}
      </List>
    </>
  )
}
export default MenuMerchant
