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
// mui

// import classes from './styles.module.scss'

// other
import { House, Cube, Storefront } from 'phosphor-react'
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
            key={`${item.text}${index}`}
            disablePadding
            sx={{ display: 'block' }}
          >
            <Link href={item.link}>
              <a>
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
            <Link href="/">
              <a>
                <ListItemButton sx={{ pl: 6 }}>
                  {/* <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon> */}
                  <ListItemText primary="Browse products" />
                </ListItemButton>
              </a>
            </Link>
            <Link href="/">
              <a>
                <ListItemButton sx={{ pl: 6 }}>
                  {/* <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon> */}
                  <ListItemText primary="Cart" />
                </ListItemButton>
              </a>
            </Link>
            <Link href="/">
              <a>
                <ListItemButton sx={{ pl: 6 }}>
                  {/* <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon> */}
                  <ListItemText primary="Wishlist" />
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
