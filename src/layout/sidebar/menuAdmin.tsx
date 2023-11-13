import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  styled,
} from '@mui/material'
import { UserList } from '@phosphor-icons/react'

import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useTranslation } from 'react-i18next'

type Props = {
  open: boolean
}

export interface MenuAdminItemType {
  icon: JSX.Element
  text: string
  link: string
  open: boolean
}
const ListItemButtonCustom = styled(ListItemButton)(({ theme }) => ({
  color: '#49516f',
  '&.menu-active': {
    color: theme.palette.primary.main,
    '& .MuiTypography-root': {
      fontWeight: '500',
    },
  },
  '&.Mui-selected': {
    // borderRadius: '8px',
    background: '#F8F9FC',
  },
  // '&:hover': {
  //   borderRadius: '8px',
  // },
  // '&.MuiListItemButton-root': {
  //   paddingLeft: '10px',
  // },
}))
const ListItemIconCustom = styled(ListItemIcon)(({ theme }) => ({
  color: '#49516f',
  '&.menu-active': {
    color: theme.palette.primary.main,
  },
}))
const ListItemTextCustom = styled(ListItemText)(({ theme }) => ({
  color: '#49516f',
  '&.menu-active': {
    color: theme.palette.primary.main,

    '& .MuiTypography-root': {
      fontWeight: '500',
    },
  },
}))
const MenuAdmin = ({ open }: Props) => {
  const { t } = useTranslation('common')
  const router = useRouter()

  return (
    <>
      <List>
        <ListItem disablePadding sx={{ display: 'block' }}>
          <Link href={`/admin/request-supplier`}>
            <a>
              <ListItemButtonCustom
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                }}
              >
                <Tooltip title="Request" arrow placement="right">
                  <ListItemIconCustom
                    className={
                      router.pathname === '/admin/request-supplier'
                        ? 'menu-active'
                        : ''
                    }
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 0,
                    }}
                  >
                    <UserList size={24} />
                  </ListItemIconCustom>
                </Tooltip>
                {open && (
                  <ListItemTextCustom
                    primary={t('menu.requestSupplier')}
                    className={
                      router.pathname === '/admin/request-supplier'
                        ? 'menu-active'
                        : ''
                    }
                  />
                )}
              </ListItemButtonCustom>
            </a>
          </Link>
        </ListItem>
      </List>
    </>
  )
}
export default MenuAdmin
