import Link from 'next/link'
import { useLayoutEffect, useMemo, useState, useContext } from 'react'
// mui
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
  Tooltip,
  Box,
  Typography,
} from '@mui/material'
import { OpenSideBar } from '../nestedLayout'
import { useRouter } from 'next/router'
// mui
// other
import {
  Bell,
  Gear,
  Notebook,
  Notepad,
  Leaf,
  PaintBrushBroad,
  Package,
  ShoppingCart,
  ChartBarHorizontal,
  Factory,
  SquaresFour,
  Stack,
  ListBullets,
  ListChecks,
  TreeStructure,
  AddressBook,
  UserRectangle,
  NavigationArrow,
  MapPin,
  Path,
  Users,
  FileText,
  Handshake,
  StackSimple,
  Faders,
  Envelope,
  Truck,
  UsersThree,
  DesktopTower,
  FilePlus,
  ListPlus,
  ArchiveBox,
  Gift,
  Ticket,
  ChartPieSlice,
  ArrowSquareIn,
  ArrowsLeftRight,
} from '@phosphor-icons/react'
import { useAppSelector } from 'src/store/hooks'
import {
  checkMultiplePermissions,
  checkPermission,
  KEY_MODULE,
  PERMISSION_RULE,
} from 'src/utils/global.utils'
import { useTranslation } from 'next-i18next'
import dayjs from 'dayjs'
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
const MenuSupplier = ({ open }: Props) => {
  const { t } = useTranslation('common')
  const { setOpen }: any = useContext(OpenSideBar)
  const router = useRouter()
  const arrayPermission = useAppSelector((state) => state.permission.data)
  console.log('arrayPermission', arrayPermission)
  const DEFAULT_MENU_SUPPLIER: MenuSupplierItemType[] = useMemo(
    () => [
      {
        icon: <DesktopTower size={24} />,
        text: 'POS',
        link: 'pos',
        open: true,
        children: [
          {
            icon: <FilePlus size={18} />,
            text: t('menu.createRetailOrder'),
            link: '/supplier/pos/retail-order/create',
            permission_array: [
              {
                key_module: 'Inventory',
                permission_rule: 'SupplierViewList',
              },
            ],
            isHide: false,
          },

          {
            icon: <ListPlus size={18} />,
            text: t('menu.transactions'),
            link: '/supplier/pos/retail-order/retail-order-list',
            permission_array: [
              {
                key_module: 'Inventory',
                permission_rule: 'SupplierViewList',
              },
            ],
            isHide: false,
          },
        ],
      },
      {
        icon: <ArchiveBox size={24} />,
        text: t('menu.inventory'),
        link: 'inventory',
        open: true,
        children: [
          {
            icon: <Package size={18} />,
            text: t('menu.product'),
            link: '/supplier/inventory/product/list',
            permission_array: [
              {
                key_module: 'Inventory',
                permission_rule: 'SupplierViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <PaintBrushBroad size={18} />,
            text: t('menu.attribute&Option'),
            link: '/supplier/inventory/attribute-option/list',
            permission_array: [
              {
                key_module: 'Inventory',
                permission_rule: 'ViewListAttribute',
              },
            ],
            isHide: false,
          },
          {
            icon: <Leaf size={18} />,
            text: t('menu.brand'),
            link: '/supplier/inventory/brand/list',
            permission_array: [
              {
                key_module: 'Brand',
                permission_rule: 'SupplierViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <Factory size={18} />,
            text: t('menu.manufacturer'),
            link: '/supplier/inventory/manufacturer/list',
            permission_array: [
              {
                key_module: 'Manufacturer',
                permission_rule: 'SupplierViewList',
              },
            ],
            isHide: false,
          },

          {
            icon: <SquaresFour size={18} />,
            text: t('menu.productCategory'),
            link: '/supplier/inventory/category/list',
            permission_array: [
              {
                key_module: 'Category',
                permission_rule: 'SupplierViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <Stack size={18} />,
            text: t('menu.warehouse'),
            link: '/supplier/inventory/warehouse/list',
            permission_array: [
              {
                key_module: 'Warehouse',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
        ],
      },
      {
        icon: <ShoppingCart size={24} />,
        text: t('menu.marketplace'),
        link: 'market-place',
        open: true,
        children: [
          {
            icon: <ListBullets size={18} />,
            text: t('menu.orders'),
            link: '/supplier/market-place/orders/list',
            permission_array: [
              {
                key_module: 'Order',
                permission_rule: 'SupplierViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <ListChecks size={18} />,
            text: t('menu.fieldSalesOrders'),
            link: '/supplier/market-place/field-sales-orders/list',
            permission_array: [
              { key_module: 'PurchaseOrder', permission_rule: 'ViewList' },
            ],
            isHide: false,
          },
          {
            icon: <TreeStructure size={18} />,
            text: t('menu.distributionChannel'),
            link: '/supplier/market-place/distribution-channel/list',
            permission_array: [
              {
                key_module: 'DistributionChannel',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
        ],
      },
      {
        icon: <Notebook size={24} />,
        text: 'CRM',
        link: 'crm',
        open: true,
        children: [
          {
            icon: <AddressBook size={18} />,
            text: t('menu.leads'),
            link: '/supplier/crm/contact/list',
            permission_array: [
              {
                key_module: 'Contact',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <UserRectangle size={18} />,
            text: t('menu.retailers'),
            link: '/supplier/crm/merchant-management/list',
            permission_array: [
              {
                key_module: 'Merchant',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <Envelope size={18} />,
            text: t('menu.message'),
            link: '/supplier/crm/messages/list',
            permission_array: [
              {
                key_module: 'Merchant',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <UsersThree size={18} />,
            text: t('menu.customers'),
            link: '/supplier/crm/customer/list',
            permission_array: [
              {
                key_module: 'Merchant',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <UsersThree size={18} />,
            text: t('menu.loyalty'),
            link: '/supplier/crm/loyalty',
            permission_array: [
              {
                key_module: 'Settings',
                permission_rule: 'LoyaltyConfiguration',
              },
            ],
            isHide: false,
          },
        ],
      },
      {
        icon: <Notepad size={24} />,
        text: 'HRM',
        link: 'hrm',
        open: true,
        children: [
          {
            icon: <Users size={18} />,
            text: t('menu.user'),
            link: '/supplier/hrm/user-management/list',
            permission_array: [
              {
                key_module: 'Employee',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <FileText size={18} />,
            text: t('menu.rolePermissions'),
            link: '/supplier/hrm/role/list',
            permission_array: [
              {
                key_module: 'Role',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <Handshake size={18} />,
            text: t('menu.permissionConfigurations'),
            link: '/supplier/hrm/permission',
            permission_array: [
              {
                key_module: 'Role',
                permission_rule: 'Config',
              },
            ],
            isHide: false,
          },
          {
            icon: <StackSimple size={18} />,
            text: t('menu.roleTypeManagement'),
            link: '/supplier/hrm/role-type/list',

            permission_array: [
              {
                key_module: 'Role',
                permission_rule: 'ViewListRoleType',
              },
            ],
            isHide: false,
          },
          {
            icon: <UsersThree size={18} />,
            text: 'Work Logs History',
            link: '/supplier/hrm/work-log-history',
            permission_array: [
              {
                key_module: 'WorkLog',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
        ],
      },
      {
        icon: <ArrowsLeftRight size={24} />,
        text: 'Account Receivable',
        link: 'account-receivable',
        open: true,
        children: [
          {
            icon: <ArrowSquareIn size={18} />,
            text: 'AR Report',
            link: '/supplier/account-receivable/account-receivable',
            permission_array: [
              {
                key_module: 'Report',
                permission_rule: 'ReportAPAR',
              },
            ],
            isHide: false,
          },
        ],
      },
      {
        icon: <NavigationArrow size={24} />,
        text: 'Map',
        link: 'map',
        open: true,
        children: [
          {
            icon: <MapPin size={18} />,
            text: t('menu.map'),
            link: '/supplier/map/map',
            permission_array: [
              {
                key_module: 'Map',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <Path size={18} />,
            text: t('menu.route'),
            link: '/supplier/map/route-management/list',
            permission_array: [
              {
                key_module: 'Route',
                permission_rule: 'RouteScheduling',
              },
            ],
            isHide: false,
          },
        ],
      },
      {
        icon: <Gift size={24} />,
        text: t('menu.promotion'),
        link: 'promotion',
        open: true,
        children: [
          {
            icon: <Ticket size={18} />,
            text: t('menu.voucher'),
            link: '/supplier/promotion/voucher/list',
            isHide: false,
            permission_array: [
              {
                key_module: 'Voucher', //Permission for voucher page not have
                permission_rule: 'ViewListVoucher',
              },
            ],
          },
        ],
      },
      {
        icon: <Gear size={24} />,
        text: t('menu.setting'),
        link: 'setting',
        open: true,
        children: [
          {
            icon: <Faders size={18} />,
            text: t('menu.notificationConfiguration'),
            link: '/supplier/setting/notification-configuration',
            permission_array: [
              {
                key_module: 'Notification',
                permission_rule: 'NotificationsHistory',
              },
            ],
            isHide: false,
          },
          {
            icon: <Bell size={18} />,
            text: t('menu.notificationHistory'),
            link: '/supplier/setting/notification-history?tab=all',
            permission_array: [
              {
                key_module: 'Notification',
                permission_rule: 'NotificationsHistory',
              },
            ],
            isHide: false,
          },
          {
            icon: <Truck size={18} />,
            text: t('menu.shippingConfiguration'),
            link: '/supplier/setting/shipping',
            permission_array: [
              {
                key_module: 'Settings',
                permission_rule: 'ShippingConfiguration',
              },
            ],
            isHide: false,
          },
        ],
      },
      // {
      //   icon: <Notepad size={24} />,
      //   text: 'APAR',
      //   link: 'APAR',
      //   open: true,
      //   children: [
      //     {
      //       icon: <Users size={18} />,
      //       text: 'Account receivable',
      //       link: '/supplier/APAR/',
      //       permission_array: [
      //         {
      //           key_module: 'Report',
      //           permission_rule: 'ReportAPAR',
      //         },
      //       ],
      //       isHide: false,
      //     },
      //   ],
      // },
    ],
    [t]
  )
  const [stateMenu, setStateMenu] = useState<MenuSupplierItemType[]>([])
  useLayoutEffect(() => {
    const temporaryArray: MenuSupplierItemType[] = []
    DEFAULT_MENU_SUPPLIER.forEach((item) => {
      item.children.forEach((value) => {
        if (checkMultiplePermissions(value.permission_array, arrayPermission)) {
          value.isHide = true
        }
      })
      if (
        item.children.some((currentValue) => currentValue.isHide === true) &&
        !temporaryArray.includes(item)
      ) {
        temporaryArray.push(item)
      }
      // temporaryArray.push(item)
    })

    const cloneArrayFromTemporaryArray = [...temporaryArray]
    setStateMenu(cloneArrayFromTemporaryArray)
  }, [DEFAULT_MENU_SUPPLIER, arrayPermission])

  const handleSelectedMenuItem = (item: any) => {
    if (item.link === router.pathname) {
      return true
    }
    const valueCondition = item.link.indexOf('list')
    if (valueCondition > -1) {
      const menuItemChildren = item.link.slice(0, valueCondition)
      const menuItem = router.pathname.includes(menuItemChildren)
      return menuItem
    }

    return false
  }
  const handleMenuColor = (item: any) => {
    const routerPathName = router.pathname.split('/')
    if (item.link === routerPathName[2]) {
      return true
    }
  }

  return (
    <>
      {checkPermission(
        arrayPermission,
        KEY_MODULE.Report,
        PERMISSION_RULE.DashboardSupplier
      ) && (
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <Link href="/supplier/dashboard?type=ALL">
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
                        router.pathname === '/supplier/dashboard'
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
                        router.pathname === 'supplier/dashboard'
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
      {checkPermission(
        arrayPermission,
        KEY_MODULE.Report,
        PERMISSION_RULE.SupplierReportSettlement
      ) && (
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <Link
              href={`/supplier/report?tab=settlementReport&type=ALL&time=day&fromDate=${dayjs()
                .startOf('day')
                .format('YYYY-MM-DD')}&toDate=${dayjs()
                .endOf('day')
                .format('YYYY-MM-DD')}`}
            >
              <a>
                <ListItemButtonCustom
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                  }}
                >
                  <Tooltip title={t('menu.report')} arrow placement="right">
                    <ListItemIconCustom
                      className={
                        router.pathname === '/supplier/report'
                          ? 'menu-active'
                          : ''
                      }
                      sx={{
                        minWidth: 0,
                        mr: open ? 2 : 0,
                      }}
                    >
                      <ChartBarHorizontal size={24} />
                    </ListItemIconCustom>
                  </Tooltip>
                  {open && (
                    <ListItemTextCustom
                      primary={t('menu.report')}
                      className={
                        router.pathname === '/supplier/report'
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

      {stateMenu.map((item, index) => {
        return (
          <List key={index + Math.random()}>
            <ListItem
              disablePadding
              sx={{
                display: 'block',
              }}
            >
              <ListItemButtonCustom
                onClick={() => {
                  if (open) {
                    setStateMenu((prevState) => {
                      prevState[index].open = !prevState[index].open
                      return [...prevState]
                    })
                  } else {
                    setOpen(!open)
                    setStateMenu((prevState) => {
                      console.log('prevState', prevState)
                      const newArr = prevState.map((item, idx) => ({
                        ...item,
                        open:
                          idx === index || handleMenuColor(item) ? true : false,
                      }))
                      // prevState[index].open = !prevState[index].open
                      return newArr
                    })
                  }
                }}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                }}
                className={handleMenuColor(item) ? 'menu-active' : ''}
              >
                <Tooltip title={item.text} arrow placement="right">
                  <ListItemIconCustom
                    className={handleMenuColor(item) ? 'menu-active' : ''}
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : 0,
                    }}
                  >
                    {item.icon}
                  </ListItemIconCustom>
                </Tooltip>
                {open && (
                  <>
                    <ListItemText primary={item.text} />
                    {item.open ? <ExpandLess /> : <ExpandMore />}
                  </>
                )}
              </ListItemButtonCustom>
            </ListItem>
            {open && (
              <Collapse in={item.open} timeout="auto" unmountOnExit>
                <List
                  component="div"
                  disablePadding
                  sx={{
                    '&.MuiList-root': {
                      paddingLeft: '40px',
                      paddingRight: '10px',
                    },
                  }}
                >
                  {item?.children?.map(
                    (children: MenuSupplierChildrenItemType, idx: number) => {
                      if (
                        checkMultiplePermissions(
                          children?.permission_array,
                          arrayPermission
                        )
                      ) {
                        return (
                          <Link href={children.link} key={idx}>
                            <a>
                              <ListItemButtonCustom
                                sx={{
                                  borderLeft: `3px solid  ${
                                    handleSelectedMenuItem(children)
                                      ? '#1DB46A'
                                      : 'transparent'
                                  } `,
                                  paddingLeft: '10px',
                                }}
                                selected={handleSelectedMenuItem(children)}
                              >
                                <ListItemTextCustom
                                  primary={
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Box mr={1}>{children.icon}</Box>
                                      <Typography>{children.text}</Typography>
                                    </Box>
                                  }
                                  className={
                                    handleSelectedMenuItem(children)
                                      ? 'menu-active'
                                      : ''
                                  }
                                  sx={{ whiteSpace: 'normal' }}
                                ></ListItemTextCustom>
                              </ListItemButtonCustom>
                            </a>
                          </Link>
                        )
                      }
                    }
                  )}
                </List>
              </Collapse>
            )}
          </List>
        )
      })}
    </>
  )
}
export default MenuSupplier
