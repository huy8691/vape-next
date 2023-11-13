// OverView Orders
export interface OverViewOrdersResponseType {
  data: {
    total_sales: number
    total_orders: number
    sold_quantity: number
  }
}

// customers
export interface CustomersOverViewResponseType {
  data: {
    all_customer: number
    new_customer: number
  }
}

export interface SellersOverViewResponseType {
  data: {
    total_sales: number
    total_purchase_order: number
    total_order: number
    total_commissions: number
  }
}
