import Link from 'next/link'
// mui
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
} from '@mui/material'
import { useRouter } from 'next/router'
// mui
// other
import { ChartPieSlice } from '@phosphor-icons/react'
import { useAppSelector } from 'src/store/hooks'
import {
  checkPermission,
  KEY_MODULE,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import { useTranslation } from 'next-i18next'
// other
type Props = {
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
const ListItemTextCustom = styled(ListItemText)(({ theme }) => ({
  color: '#49516f',
  '&.menu-active': {
    color: theme.palette.primary.main,

    '& .MuiTypography-root': {
      fontWeight: '500',
    },
  },
}))

const ListItemIconCustom = styled(ListItemIcon)(({ theme }) => ({
  color: '#49516f',
  '&.menu-active': {
    color: theme.palette.primary.main,
  },
}))

export interface PermissionObjectType {
  key_module: string
  permission_rule: string
}
export interface MenuSupplierChildrenItemType {
  icon: JSX.Element
  text: string
  link: string
  permission_array: PermissionObjectType[]
  isHide: boolean
}
export interface MenuSupplierItemType {
  icon: JSX.Element
  text: string
  link: string
  open: boolean
  children: MenuSupplierChildrenItemType[]
}
const MenuRetailerMaster = ({ open }: Props) => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const arrayPermission = useAppSelector((state) => state.permission.data)
  console.log('arrayPermission', arrayPermission)

  return (
    <>
      {checkPermission(
        arrayPermission,
        KEY_MODULE.Report,
        PERMISSION_RULE.DashboardMerchant
      ) && (
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <Link href="/retailer/dashboard?&type=ALL">
              <a>
                <ListItemButtonCustom
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                  }}
                >
                  <Tooltip title={t('menu.dashboard')} arrow placement="right">
                    <ListItemIconCustom
                      className={
                        router.pathname === '/retailer/dashboard'
                          ? 'menu-active'
                          : ''
                      }
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 0,
                      }}
                    >
                      <ChartPieSlice size={24} />
                    </ListItemIconCustom>
                  </Tooltip>
                  {open && (
                    <ListItemTextCustom
                      primary={t('menu.dashboard')}
                      className={
                        router.pathname === '/retailer/dashboard'
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
      )}
    </>
  )
}
export default MenuRetailerMaster
