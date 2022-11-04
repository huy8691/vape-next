import React from 'react'
import Link from 'next/link'
// mui
import ListItem from '@mui/material/ListItem'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import PersonIcon from '@mui/icons-material/Person'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import Collapse from '@mui/material/Collapse'
import StarBorder from '@mui/icons-material/StarBorder'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
// mui

// import classes from './styles.module.scss'

// other
import {
  House,
  Cube,
  Storefront,
  ShoppingCart,
  FileSearch,
  Heart,
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
    text: 'Product',
    link: '/products',
  },
]

const SideBar = ({ open }: Props) => {
  const [openCollapse, setOpenCollapse] = React.useState(true)

  const handleClick = () => {
    setOpenCollapse(!openCollapse)
  }
  return (
    <>
      {/* <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Link href="/">
            <a>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </a>
          </Link>
        </ListItem>
      </List> */}
      {/* <Divider /> */}
      <List>
        {Menu.map((item, index) => (
          <ListItem
            disablePadding
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
        <ListItem disablePadding sx={{ display: 'block' }}>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <Storefront size={24} />
            </ListItemIcon>
            <ListItemText primary="Market Place" />
            {openCollapse ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>
        <Collapse in={openCollapse} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link href="/products">
              <a>
                <ListItemButton sx={{ pl: 3 }}>
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
            <Link href="/">
              <a>
                <ListItemButton sx={{ pl: 3 }}>
                  {open ? (
                    <>
                      <ListItemText primary="Cart" />
                      <IconButton>
                        <Badge badgeContent={10} color="primary"></Badge>
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
        </Collapse>
      </List>
    </>
  )
}
export default SideBar
