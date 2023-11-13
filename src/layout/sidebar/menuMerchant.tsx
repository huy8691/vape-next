import Link from 'next/link'
import { useContext, useEffect, useMemo, useState } from 'react'
// mui
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import {
  Badge,
  Box,
  Collapse,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'
import { useRouter } from 'next/router'
styled
// mui
// other
import {
  ArrowSquareOut,
  ArchiveBox,
  Bell,
  ChartBarHorizontal,
  DesktopTower,
  Envelope,
  Factory,
  // Path,
  Faders,
  FilePlus,
  // NavigationArrow,
  FileText,
  Gear,
  Gift,
  Handshake,
  Heart,
  Leaf,
  ListBullets,
  // Storefront,
  ListChecks,
  ListPlus,
  Notebook,
  Notepad,
  Package,
  PaintBrushBroad,
  ShoppingCart,
  ShoppingCartSimple,
  SortDescending,
  SquaresFour,
  StackSimple,
  Ticket,
  TreeStructure,
  Truck,
  // UserRectangle,
  Users,
  UsersThree,
  ChartPieSlice,
  UserFocus,
  ArrowsLeftRight,
} from '@phosphor-icons/react'
import { useTranslation } from 'next-i18next'
import { cartActions } from 'src/store/cart/cartSlice'
import { useAppDispatch, useAppSelector } from 'src/store/hooks'
import {
  KEY_MODULE,
  PERMISSION_RULE,
  checkMultiplePermissions,
  checkPermission,
} from 'src/utils/global.utils'
import { OpenSideBar } from '../nestedLayout'
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
  suffix?: boolean

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

const MenuMerchant = ({ open }: Props) => {
  const { t } = useTranslation('common')
  const { setOpen }: any = useContext(OpenSideBar)
  const router = useRouter()
  const dispatch = useAppDispatch()
  const cart = useAppSelector((state) => state.cart)
  const userInfo = useAppSelector((state) => state.userInfo)
  const [stateItemCart, setStateItemCart] = useState<number>(0)
  const [stateMenu, setStateMenu] = useState<MenuSupplierItemType[]>([])
  const arrayPermission = useAppSelector((state) => state.permission.data)
  const defaultArrayMenuMerchant: MenuSupplierItemType[] = useMemo(
    () => [
      // {
      //   icon: <House size={24} />,
      //   text: 'Dashboard',
      //   link: '/',
      // },

      {
        icon: <DesktopTower size={24} />,
        text: 'POS',
        link: 'pos',
        open: true,
        children: [
          {
            icon: <FilePlus size={18} />,
            text: t('menu.createRetailOrder'),
            link: '/retailer/pos/retail-order/create',
            permission_array: [
              {
                key_module: 'Order',
                permission_rule: 'ViewDetailsRetailOrder',
              },
            ],
            isHide: false,
          },

          {
            icon: <ListPlus size={18} />,
            text: t('menu.transactions'),
            link: '/retailer/pos/retail-order/retail-order-list',
            permission_array: [
              {
                key_module: 'Order',
                permission_rule: 'ViewListRetailOrder',
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
            link: '/retailer/inventory/product/list',
            permission_array: [
              {
                key_module: 'Inventory',
                permission_rule: 'MerchantViewList',
              },
              {
                key_module: 'Inventory',
                permission_rule: 'ViewBoughtList',
              },
            ],
            isHide: false,
          },
          {
            icon: <PaintBrushBroad size={18} />,
            text: t('menu.attribute&Option'),
            link: '/retailer/inventory/attribute-option/list',
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
            link: '/retailer/inventory/brand/list',
            permission_array: [
              {
                key_module: 'Brand',
                permission_rule: 'MerchantViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <Factory size={18} />,
            text: t('menu.manufacturer'),
            link: '/retailer/inventory/manufacturer/list',
            permission_array: [
              {
                key_module: 'Manufacturer',
                permission_rule: 'MerchantViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <SquaresFour size={18} />,
            text: t('menu.productCategory'),
            link: '/retailer/inventory/category/list',
            permission_array: [
              {
                key_module: 'Category',
                permission_rule: 'MerchantViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <Package size={18} />,
            text: t('menu.warehouse'),
            link: '/retailer/inventory/warehouse/list',
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
            icon: <SortDescending size={18} />,
            text: t('menu.featuredProduct'),
            link: '/retailer/market-place/featured',
            permission_array: [
              {
                key_module: 'Product',
                permission_rule: 'ViewListFeaturedProducts',
              },
            ],
            isHide: false,
          },
          // {
          //   icon: <Storefront size={18} />,
          //   text: 'Browse Product',
          //   link: '/retailer/market-place/browse-products',
          //   permission_array: [
          //     {
          //       key_module: 'Product',
          //       permission_rule: 'ViewList',
          //     },
          //   ],
          //   isHide: false,
          // },
          // {
          //   icon: <CaretRight size={18} />,
          //   text: 'Featured',
          //   link: '/retailer/market-place/featured',
          //   permission_array: [
          //     {
          //       key_module: 'Product',
          //       permission_rule: 'ViewList',
          //     },
          //   ],
          //   isHide: false,
          // },
          {
            icon: <ShoppingCartSimple size={18} />,
            text: t('menu.cart'),
            link: '/retailer/market-place/cart',
            suffix: true,
            permission_array: [
              { key_module: 'Cart', permission_rule: 'Create' },
            ],
            isHide: false,
          },
          {
            icon: <ListBullets size={18} />,
            text: t('menu.onlineOrders'),
            link: '/retailer/market-place/online-orders/list',
            permission_array: [
              {
                key_module: 'Order',
                permission_rule: 'MerchantViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <ListChecks size={18} />,
            text: t('menu.purchaseOrders'),
            link: '/retailer/market-place/purchase-orders/list',
            permission_array: [
              {
                key_module: 'Order',
                permission_rule: 'MerchantViewListPurchaseOrder',
              },
            ],
            isHide: false,
          },
          {
            icon: <Heart size={18} />,
            text: t('menu.wishList'),
            link: '/retailer/market-place/wish-list',
            permission_array: [
              {
                key_module: 'WishList',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <TreeStructure size={18} />,
            text: t('menu.distributionChannel'),
            link: '/retailer/market-place/distribution-channel/list',
            permission_array: [
              {
                key_module: 'DistributionChannel',
                permission_rule: 'ViewList',
              },
              {
                key_module: 'DistributionChannel',
                permission_rule: 'ViewJoinedList',
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
          // {
          //   icon: <AddressBook size={18} />,
          //   text: t('menu.leads'),
          //   link: '/retailer/crm/contact/list',
          //   permission_array: [
          //     {
          //       key_module: 'Contact',
          //       permission_rule: 'ViewList',
          //     },
          //   ],
          //   isHide: false,
          // },
          // {
          //   icon: <UserRectangle size={18} />,
          //   text: t('menu.retailers'),
          //   link: '/retailer/crm/merchant-management/list',
          //   permission_array: [
          //     {
          //       key_module: 'Merchant',
          //       permission_rule: 'ViewList',
          //     },
          //   ],
          //   isHide: false,
          // },
          {
            icon: <Envelope size={18} />,
            text: t('menu.message'),
            link: '/retailer/crm/messages/list',
            permission_array: [
              {
                key_module: 'CRM',
                permission_rule: 'CRMMessage',
              },
            ],
            isHide: false,
          },
          {
            icon: <UsersThree size={18} />,
            text: t('menu.customers'),
            link: '/retailer/crm/customer/list',
            permission_array: [
              {
                key_module: 'CRM',
                permission_rule: 'CRMCustomer',
              },
            ],
            isHide: false,
          },
          {
            icon: <UsersThree size={18} />,
            text: t('menu.loyalty'),
            link: '/retailer/crm/loyalty',
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
            link: '/retailer/hrm/user-management/list',
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
            link: '/retailer/hrm/role/list',
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
            link: '/retailer/hrm/permission',
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
            text: t('menu.roleType'),
            link: '/retailer/hrm/role-type/list',
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
            text: t('menu.workLogsHistory'),
            link: '/retailer/hrm/work-log-history/',
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
        text: 'Account payable',
        link: 'account-payable',
        open: true,
        children: [
          {
            icon: <ArrowSquareOut size={18} />,
            text: t('menu.accountPayable'),
            link: '/retailer/account-payable/account-payable',
            permission_array: [
              {
                key_module: 'Report',
                permission_rule: 'ReportAPAR',
              },
            ],
            isHide: false,
          },
          {
            icon: <UserFocus size={18} />,
            text: t('menu.externalSuppliers'),
            link: '/retailer/account-payable/external-supplier/list',
            permission_array: [
              {
                key_module: 'ExternalSupplier',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
          {
            icon: <Package size={18} />,
            text: t('menu.externalOrder'),
            link: '/retailer/account-payable/external-order/list',
            permission_array: [
              {
                key_module: 'ExternalOrder',
                permission_rule: 'ViewList',
              },
            ],
            isHide: false,
          },
        ],
      },

      // {
      //   icon: <NavigationArrow size={24} />,
      //   text: 'Map',
      //   link: 'map',
      //   open: true,
      //   children: [
      //     {
      //       icon: <MapPin size={18} />,
      //       text: 'Map',
      //       link: '/retailer/map/map',
      //       permission_array: [
      //         {
      //           key_module: 'Map',
      //           permission_rule: 'ViewList',
      //         },
      //       ],
      //       isHide: false,
      //     },
      //     {
      //       icon: <Path size={18} />,
      //       text: 'Route',
      //       link: '/retailer/map/route-management/list',
      //       permission_array: [
      //         {
      //           key_module: 'Map',
      //           permission_rule: 'ViewList',
      //         },
      //       ],
      //       isHide: false,
      //     },
      //   ],
      // },
      {
        icon: <Gift size={24} />,
        text: t('menu.promotion'),
        link: 'promotion',
        open: true,
        children: [
          {
            icon: <Ticket size={18} />,
            text: t('menu.voucher'),
            link: '/retailer/promotion/voucher/list',
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
        text: 'Setting',
        link: t('menu.setting'),
        open: true,
        children: [
          {
            icon: <Faders size={18} />,
            text: t('menu.notificationConfiguration'),
            link: '/retailer/setting/notification-configuration',
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
            link: '/retailer/setting/notification-history',
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
            link: '/retailer/setting/shipping',
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
      //       text: 'Account payable',
      //       link: '/retailer/APAR/',
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

  useEffect(() => {
    const temporaryArray: MenuSupplierItemType[] = []
    defaultArrayMenuMerchant.forEach((item) => {
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

    const cloneArr = [...temporaryArray]

    setStateMenu(cloneArr)
  }, [arrayPermission, defaultArrayMenuMerchant])

  // const [openCollapse, setOpenCollapse] = useState<boolean>(true)

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

  useEffect(() => {
    if (
      userInfo.data.user_type === 'MERCHANT' &&
      checkPermission(arrayPermission, KEY_MODULE.Cart, PERMISSION_RULE.Create)
    ) {
      dispatch(cartActions.doCart())
    }
  }, [dispatch, arrayPermission, userInfo])
  useEffect(() => {
    setStateItemCart(cart.data.amountItems)
  }, [cart])
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
      {checkPermission(
        arrayPermission,
        KEY_MODULE.Report,
        PERMISSION_RULE.MerchantReportSettlement
      ) && (
        <List>
          <ListItem disablePadding sx={{ display: 'block' }}>
            <Link
              href={`/retailer/report?tab=settlementReport&type=ALL&time=day&fromDate=${dayjs()
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
                        router.pathname === '/retailer/report'
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
                        router.pathname === '/retailer/report'
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
          <List
            key={index + Math.random()}
            // sx={{ padding: `${open ? '0 10px 0 10px' : ''}` }}
          >
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
                                {children.suffix && (
                                  <IconButton>
                                    <Badge
                                      badgeContent={stateItemCart}
                                      color="primary"
                                      sx={{
                                        '& .MuiBadge-colorPrimary': {
                                          fontWeight: '600',
                                          color: 'white',
                                        },
                                      }}
                                    ></Badge>
                                  </IconButton>
                                )}
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
export default MenuMerchant
