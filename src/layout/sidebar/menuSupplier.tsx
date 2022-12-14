import React, { useState } from 'react'
import Link from 'next/link'
// mui
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import Tooltip from '@mui/material/Tooltip'
import { useRouter } from 'next/router'
// mui

// other
import {
  House,
  Cube,
  FileSearch,
  ListBullets,
  // UsersThree,
  At,
  Factory,
  ShoppingCart,
} from 'phosphor-react'
// other

type Props = {
  open: boolean
}
const Menu = [
  {
    icon: <ListBullets size={24} />,
    text: 'Category',
    link: '/categories-management',
  },
  {
    icon: <At size={24} />,
    text: 'Brand',
    link: '/brand',
  },
  {
    icon: <Factory size={24} />,
    text: 'Manufacturer',
    link: '/manufacturer',
  },
  // {
  //   icon: <UsersThree size={24} />,
  //   text: 'Staff',
  //   link: '/staff',
  // },
  {
    icon: <ShoppingCart size={24} />,
    text: 'Order',
    link: '/order-management',
  },
]

const MenuSupplier = ({ open }: Props) => {
  const router = useRouter()
  const [openCollapseInventory, setOpenCollapseInventory] =
    useState<boolean>(true)

  return (
    <>
      <List>
        <ListItem
          disablePadding
          selected={router.pathname === '/'}
          sx={{ display: 'block' }}
        >
          <Link href="/">
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
                      <House size={24} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Dashboard"
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </>
              ) : (
                <Tooltip title="Dashboard" arrow placement="right">
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
                      <House size={24} />
                    </ListItemIcon>
                    <ListItemText
                      primary="Dashboard"
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </Tooltip>
              )}
            </a>
          </Link>
        </ListItem>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => setOpenCollapseInventory(!openCollapseInventory)}
          >
            <ListItemIcon>
              <Cube size={24} />
            </ListItemIcon>
            <ListItemText primary="Inventory" />
            {openCollapseInventory ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openCollapseInventory} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link href="/product-management">
              <a>
                <ListItemButton
                  sx={{ pl: 3 }}
                  selected={router.pathname === '/product-management'}
                >
                  {open ? (
                    <ListItemText primary="Product management" />
                  ) : (
                    <ListItemIcon>
                      <FileSearch />
                    </ListItemIcon>
                  )}
                </ListItemButton>
              </a>
            </Link>
            <Link href="/create-product">
              <a>
                <ListItemButton
                  sx={{ pl: 3 }}
                  selected={router.pathname === '/create-product'}
                >
                  {open ? (
                    <ListItemText primary="Create product" />
                  ) : (
                    <ListItemIcon>
                      <FileSearch />
                    </ListItemIcon>
                  )}
                </ListItemButton>
              </a>
            </Link>
          </List>
        </Collapse>
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
      </List>
    </>
  )
}
export default MenuSupplier
