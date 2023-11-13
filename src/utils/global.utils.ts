import { AxiosResponse } from 'axios'
// import { notificationActions } from 'src/store/notification/notificationSlice'

export const objToStringParam = (obj: object) => {
  let str = ''
  for (const [key, val] of Object.entries(obj)) {
    if (val) {
      str += `${key}=${val}&`
    }
  }
  return str
}

export const isEmptyObject = (obj: object) => {
  return Object.entries(obj).length === 0 && obj.constructor === Object
}

export const hasSpecialCharacter = (input: string) => {
  // eslint-disable-next-line no-useless-escape
  return /[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\/\\?\,]+$/g.test(
    input
  )
}
export const hasSpecialCharacterPrice = (input: string) => {
  // eslint-disable-next-line no-useless-escape
  return /[\!\@\#\$\%\^\&\*\)\(\+\=\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-\/\\?]+$/g.test(
    input
  )
}

export const handlerGetErrMessage = (
  status: number,
  dataError: AxiosResponse<{ data: any }>
) => {
  switch (status) {
    case 404:
    case 400: {
      const {
        data,
      }: {
        [key: string]: any
      } = dataError
      if (!data) {
        return 'Something went wrongs with the server.'
      }
      const dataMsgError = JSON.parse(
        localStorage.getItem('error-code') as string
      )
      const msgText: string[] = []

      Object.keys(data).forEach((item: string) => {
        if (item === 'errors') {
          return
        } else if (item === 'files') {
          Object.keys(data[item]).forEach((_item) => {
            // msgText.push(`${_item} ${dataMsgError[data[item][_item]].message}`)
            /* Pushing the message to the array. */
            msgText.push(`${dataMsgError[data[item][_item]].message}`)
          })
        } else {
          if (data[item] === null) return
          msgText.push(
            dataMsgError[data[item]]?.message
              ? dataMsgError[data[item]]?.message
              : 'Something went wrongs with the server'
          )
        }
      })
      return msgText
    }

    case 401: {
      const {
        data,
      }: {
        [key: string]: any
      } = dataError
      if (!data) {
        return 'Something went wrongs with the server.'
      }
      const dataMsgError = JSON.parse(
        localStorage.getItem('error-code') as string
      )
      const msgText: string[] = []

      Object.keys(data).forEach((item: string) => {
        if (item === 'files') {
          Object.keys(data[item]).forEach((_item) => {
            // msgText.push(`${_item} ${dataMsgError[data[item][_item]].message}`)
            /* Pushing the message to the array. */
            msgText.push(`${dataMsgError[data[item][_item]].message}`)
          })
        } else {
          if (data[item] === null) return
          msgText.push(
            dataMsgError[data[item]]?.message
              ? dataMsgError[data[item]]?.message
              : 'Something went wrongs with the server'
          )
        }
      })
      return msgText
    }
    case 403: {
      // const { data } = dataError
      const {
        data,
      }: {
        [key: string]: any
      } = dataError

      return data.code || data.error
    }
    case 500: {
      const {
        data,
      }: {
        [key: string]: any
      } = dataError
      const dataMsgError = JSON.parse(
        localStorage.getItem('error-code') as string
      )

      return dataMsgError[data?.code]?.message || '500 - ' + data.error
    }

    default:
      return 'Something went wrong with the server'
  }
}

export const formatPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return 'N/A'
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )} ${phoneNumber.slice(6, 10)}`
}
// const isBrowser = () => typeof window !== 'undefined'

export const platform = () => {
  const a =
    global.window &&
    window.location.pathname
      .split('/')
      .filter((r) => r === 'supplier' || r === 'retailer')
  if (a.length > 0) {
    return a[0].toUpperCase()
  }
  return ''
}

export const formatNumberLarge = (num: number, precision?: number) => {
  const map = [
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'M', threshold: 1e6 },
    { suffix: 'K', threshold: 1e3 },
    { suffix: '', threshold: 1 },
  ]

  const found = map.find((x) => Math.abs(num) >= x.threshold)
  if (found) {
    const formatted =
      (num / found.threshold).toFixed(precision ? precision : 0) + found.suffix
    return formatted
  }
  return num
}

export const percentIncrease = (a: number, b: number) => {
  let percent
  if (b !== 0) {
    if (a !== 0) {
      percent = ((b - a) / a) * 100
    } else {
      percent = b * 100
    }
  } else {
    percent = -a * 100
  }
  if (percent < -500) return Math.floor(-500)
  if (percent > 500) return Math.floor(500)
  return Math.floor(percent)
}

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
export interface DynamicPermissionType {
  [key: string]: number
}
export interface PermissionType {
  module: string
  permissions: DynamicPermissionType
}

export const checkPermission = (
  arrayPermission: PermissionType[],
  moduleName: string,
  permissionRule: string
) => {
  const foundModule = arrayPermission.findIndex(
    (item) => item.module === moduleName
  )
  if (foundModule < 0 || arrayPermission.length === 0) return false
  const permissionObject = arrayPermission[foundModule].permissions
  if (Object.keys(permissionObject).includes(permissionRule)) {
    return true
  }
  return false
}
export interface PermissionObjectType {
  key_module: string
  permission_rule: string
}
export const checkMultiplePermissions = (
  arrayObjectPermission: PermissionObjectType[],
  arrayPermission: PermissionType[]
) => {
  return arrayObjectPermission.some((element) =>
    checkPermission(
      arrayPermission,
      element.key_module,
      element.permission_rule
    )
  )
}
export const isEmpty = (value: any) => {
  return value == null || typeof value === 'undefined'
}
export const truncateToTwoDecimalPlaces = (number: number) => {
  // Convert the number to a string and split it at the decimal point
  const parts = number.toString().split('.')
  // If there are decimal places, truncate them to 2 digits
  if (parts.length === 2) {
    parts[1] = parts[1].slice(0, 2)
  }
  // Join the parts and convert back to a number
  const result = parseFloat(parts.join('.'))
  return result
}
// example
// const originalNumber = 999990.9999;
// const truncatedNumber = truncateToTwoDecimalPlaces(originalNumber);
// console.log(truncatedNumber); Output: 0.99
export const PERMISSION_RULE = {
  ViewList: 'ViewList',
  Create: 'Create',
  ViewDetails: 'ViewDetails',
  Update: 'Update',
  Delete: 'Delete',
  SetDefault: 'SetDefault',
  SupplierCreate: 'SupplierCreate',
  MerchantDelete: 'MerchantDelete',
  MerchantUpdate: 'MerchantUpdate',
  MerchantViewDetails: 'MerchantViewDetails',
  MerchantCreate: 'MerchantCreate',
  MerchantViewList: 'MerchantViewList',
  Import: 'Import',
  SupplierViewDetails: 'SupplierViewDetails',
  SupplierUpdate: 'SupplierUpdate',
  SupplierViewList: 'SupplierViewList',
  SupplierDelete: 'SupplierDelete',
  ViewListActivityLog: 'ViewListActivityLog',
  DeleteActivityLog: 'DeleteActivityLog',
  UpdateActivityLog: 'UpdateActivityLog',
  ViewDetailsActivityLog: 'ViewDetailsActivityLog',
  CreateActivityLog: 'CreateActivityLog',
  ViewListPurchaseOrderOfContact: 'ViewListPurchaseOrderOfContact',
  Convert: 'Convert',
  ViewTotalRevenue: 'ViewTotalRevenue',
  ViewLastPurchaseOrder: 'ViewLastPurchaseOrder',
  ViewListAttachments: 'ViewListAttachments',
  Assign: 'Assign',
  ViewListMerchantInDC: 'ViewListMerchantInDC',
  SetProductToDC: 'SetProductToDC',
  SetDCToProduct: 'SetDCToProduct',
  RemoveOutDC: 'RemoveOutDC',
  OutDC: 'OutDC',
  ViewJoinedList: 'ViewJoinedList',
  JoinDC: 'JoinDC',
  ResetPassword: 'ResetPassword',
  ViewListTransaction: 'ViewListTransaction',
  SetRetailPrice: 'SetRetailPrice',
  MerchantViewListRetailProduct: 'MerchantViewListRetailProduct',
  ViewBoughtList: 'ViewBoughtList',
  GetInstock: 'GetInstock',
  ConfigLSAL: 'ConfigLSAL',
  SetProductToWarehouse: 'SetProductToWarehouse',
  UpdateStock: 'UpdateStock',
  AdjustStock: 'AdjustStock',
  ViewListTrips: 'ViewListTrips',
  ViewListOrderHistory: 'ViewListOrderHistory',
  CreateRetailOrder: 'CreateRetailOrder',
  ViewListOrderFollowProduct: 'ViewListOrderFollowProduct',
  UpdatePaymentStatus: 'UpdatePaymentStatus',
  ViewDetailsRetailOrder: 'ViewDetailsRetailOrder',
  Approve: 'Approve',
  MerchantCancel: 'MerchantCancel',
  UpdateOrderStatus: 'UpdateOrderStatus',
  ViewListCheckoutItems: 'ViewListCheckoutItems',
  ViewTotalBill: 'ViewTotalBill',
  ReOrder: 'ReOrder',
  ViewListRetailOrder: 'ViewListRetailOrder',
  SetOwner: 'SetOwner',
  UpdateAdminPermissions: 'UpdateAdminPermissions',
  ViewListRolePermissions: 'ViewListRolePermissions',
  ViewListRoleBoundary: 'ViewListRoleBoundary',
  ViewListUserBoundary: 'ViewListUserBoundary',
  ViewListUserPermissions: 'ViewListUserPermissions',
  ViewListRelatedProduct: 'ViewListRelatedProduct',
  ViewListProductInDC: 'ViewListProductInDC',
  ApproveReject: 'ApproveReject',
  ViewListUserWithRoles: 'ViewListUserWithRoles',
  Config: 'Config',
  ViewListUserRole: 'ViewListUserRole',
  ViewListAssignedSeller: 'ViewListAssignedSeller',
  ViewListContactOption: 'ViewListContactOption',
  CreateMonthlySale: 'CreateMonthlySale',
  ViewListTypeOfSale: 'ViewListTypeOfSale',
  CreateTypeOfSale: 'CreateTypeOfSale',
  ViewListFindUsOver: 'ViewListFindUsOver',
  CreateFindUsOver: 'CreateFindUsOver',
  ViewListTypeOfLead: 'ViewListTypeOfLead',
  ViewListMonthlySale: 'ViewListMonthlySale',
  CreateMonthlyPurchase: 'CreateMonthlyPurchase',
  ViewListMonthlyPurchase: 'ViewListMonthlyPurchase',
  CreateSaleStatus: 'CreateSaleStatus',
  CreateTypeOfLead: 'CreateTypeOfLead',
  ViewListSource: 'ViewListSource',
  CreateSource: 'CreateSource',
  ViewListActivityLogType: 'ViewListActivityLogType',
  CreateActivityLogType: 'CreateActivityLogType',
  ViewListContactType: 'ViewListContactType',
  CreateContactType: 'CreateContactType',
  ViewListSaleStatus: 'ViewListSaleStatus',
  CreateContactOption: 'CreateContactOption',
  AcceptReject: 'AcceptReject',
  MarkFavorite: 'MarkFavorite',
  ViewListRoleType: 'ViewListRoleType',
  CreateRoleType: 'CreateRoleType',
  UpdateRoleType: 'UpdateRoleType',
  DeleteRoleType: 'DeleteRoleType',
  ViewDetailsRoleType: 'ViewDetailsRoleType',
  SupplierCreateWithVariants: 'SupplierCreateWithVariants',
  MerchantCreateWithVariants: 'MerchantCreateWithVariants',
  CreateAttribute: 'CreateAttribute',
  ViewListAttribute: 'ViewListAttribute',
  ViewDetailsAttribute: 'ViewDetailsAttribute',
  UpdateAttribute: 'UpdateAttribute',
  DeleteAttribute: 'DeleteAttribute',
  ViewListOption: 'ViewListOption',
  CreateOption: 'CreateOption',
  ViewDetailsOption: 'ViewDetailsOption',
  UpdateOption: 'UpdateOption',
  DeleteOption: 'DeleteOption',
  ViewListVariant: 'ViewListVariant',
  CreateVariant: 'CreateVariant',
  ViewDetailsVariant: 'ViewDetailsVariant',
  UpdateVariant: 'UpdateVariant',
  DeleteVariant: 'DeleteVariant',
  DashboardMerchant: 'DashboardMerchant',
  DashboardSupplier: 'DashboardSupplier',
  ReportAPAR: 'ReportAPAR',
  DeleteClientDiscount: 'DeleteClientDiscount',
  UpdateClientDiscount: 'UpdateClientDiscount',
  ViewDetailsClientDiscount: 'ViewDetailsClientDiscount',
  CreateClientDiscount: 'CreateClientDiscount',
  ViewListClientDiscount: 'ViewListClientDiscount',
  ReOrderRetailOrder: 'ReOrderRetailOrder',
  ViewDetailsRetailOrderByCode: 'ViewDetailsRetailOrderByCode',
  UpdateDelayPayment: 'UpdateDelayPayment',
  ViewDetailsDelayPayment: 'ViewDetailsDelayPayment',
  DeleteDiscount: 'DeleteDiscount',
  UpdateDiscount: 'UpdateDiscount',
  ViewDetailsDiscount: 'ViewDetailsDiscount',
  CreateProductDiscount: 'CreateProductDiscount',
  ViewListProductDiscount: 'ViewListProductDiscount',
  ViewListDCDiscount: 'ViewListDCDiscount',
  CreateDCDiscount: 'CreateDCDiscount',
  DeleteMerchantDiscount: 'DeleteMerchantDiscount',
  UpdateMerchantDiscount: 'UpdateMerchantDiscount',
  ViewDetailsMerchantDiscount: 'ViewDetailsMerchantDiscount',
  ViewListMerchantDiscount: 'ViewListMerchantDiscount',
  CreateMerchantDiscount: 'CreateMerchantDiscount',
  ShippingConfiguration: 'ShippingConfiguration',
  MerchantReportSettlement: 'MerchantReportSettlement',
  SupplierReportSettlement: 'SupplierReportSettlement',
  NotificationsHistory: 'NotificationsHistory',
  CreateVoucher: 'CreateVoucher',
  DeleteVoucher: 'DeleteVoucher',
  UpdateVoucher: 'UpdateVoucher',
  ViewDetailsVoucher: 'ViewDetailsVoucher',
  ViewListVoucher: 'ViewListVoucher',
}

export const KEY_MODULE = {
  AddressBook: 'AddressBook',
  Brand: 'Brand',
  Cart: 'Cart',
  Category: 'Category',
  Contact: 'Contact',
  DistributionChannel: 'DistributionChannel',
  Employee: 'Employee',
  Inventory: 'Inventory',
  Manufacturer: 'Manufacturer',
  Map: 'Map',
  Merchant: 'Merchant',
  Order: 'Order',
  Organization: 'Organization',
  PaymentMethod: 'PaymentMethod',
  Permission: 'Permission',
  Product: 'Product',
  PurchaseOrder: 'PurchaseOrder',
  Role: 'Role',
  ShippingMethod: 'ShippingMethod',
  SingleChoice: 'SingleChoice',
  User: 'User',
  UserRequest: 'UserRequest',
  Warehouse: 'Warehouse',
  WishList: 'WishList',
  Route: 'Route',
  Settings: 'Settings',
  Report: 'Report',
  BusinessProfile: 'BusinessProfile',
  WorkLog: 'WorkLog',
  Client: 'Client',
  ExternalOrder: 'ExternalOrder',
  ExternalSupplier: 'ExternalSupplier',
  Notification: 'Notification',
  Voucher: 'Voucher',
}
