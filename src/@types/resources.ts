import common from '../../public/locales/en/common.json'
import login from '../../public/locales/en/login.json'
import register from '../../public/locales/en/register.json'
import report from '../../public/locales/en/report.json'
import retailOrderList from '../../public/locales/en/retail-order-list.json'
import product from '../../public/locales/en/product.json'
import attributeOption from '../../public/locales/en/attribute-option.json'
import brand from '../../public/locales/en/brand.json'
import manufacturer from '../../public/locales/en/manufacturer.json'
import dc from '../../public/locales/en/dc.json'
import browseProduct from '../../public/locales/en/browse-product.json'
import cart from '../../public/locales/en/cart.json'
import checkout from '../../public/locales/en/checkout.json'
import featured from '../../public/locales/en/featured.json'
import order from '../../public/locales/en/order.json'
import wishList from '../../public/locales/en/wish-list.json'
import map from '../../public/locales/en/map.json'
import productDetail from '../../public/locales/en/productDetail.json'
import category from '../../public/locales/en/category.json'
import warehouse from '../../public/locales/en/warehouse.json'
import contact from '../../public/locales/en/contact.json'
import customer from '../../public/locales/en/customer.json'
import shipping from '../../public/locales/en/shipping.json'
import notificationHistory from '../../public/locales/en/notification-history.json'
import notificationConfiguration from '../../public/locales/en/notification-configuration.json'
import voucher from '../../public/locales/en/voucher.json'
import changePassword from '../../public/locales/en/change-password.json'
import forgotPassword from '../../public/locales/en/forgot-password.json'
import account from '../../public/locales/en/account.json'
import merchantManagement from '../../public/locales/en/merchant-management.json'
import messages from '../../public/locales/en/messages.json'
import permission from '../../public/locales/en/permission.json'
import role from '../../public/locales/en/role.json'
import roleType from '../../public/locales/en/role-type.json'
import userManagement from '../../public/locales/en/user-management.json'
import verifyCustomer from '../../public/locales/en/verify-customer.json'
import business from '../../public/locales/en/business.json'
import loyalty from '../../public/locales/en/loyalty.json'
import apar from '../../public/locales/en/apar.json'
import fieldSalesOrders from '../../public/locales/en/field-sales-orders.json'
import workLogHistory from '../../public/locales/en/work-log-history.json'
import requestSupplier from '../../public/locales/en/request-supplier.json'
import registerSupplier from '../../public/locales/en/register-supplier.json'
import verifySupplier from '../../public/locales/en/verify-supplier.json'
import externalSupplier from '../../public/locales/en/external-supplier.json'
import externalOrder from '../../public/locales/en/external-order.json'
const resources = {
  common,
  login,
  register,
  report,
  // retailOrderList,
  'retail-order-list': retailOrderList,
  'attribute-option': attributeOption,
  'notification-history': notificationHistory,
  'notification-configuration': notificationConfiguration,
  'change-password': changePassword,
  'forgot-password': forgotPassword,
  business,
  account,
  voucher,
  shipping,
  product,
  brand,
  category,
  manufacturer,
  dc,
  cart,
  checkout,
  'browse-product': browseProduct,
  featured,
  'wish-list': wishList,
  productDetail,
  order,
  map,
  warehouse,
  contact,
  customer,
  'merchant-management': merchantManagement,
  messages,
  permission,
  role,
  'role-type': roleType,
  'user-management': userManagement,
  'verify-customer': verifyCustomer,
  apar,
  loyalty,
  'field-sales-orders': fieldSalesOrders,
  'work-log-history': workLogHistory,
  'request-supplier': requestSupplier,
  'register-supplier': registerSupplier,
  'verify-supplier': verifySupplier,
  'external-supplier': externalSupplier,
  'external-order': externalOrder,
} as const

export default resources
