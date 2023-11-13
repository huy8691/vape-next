// Sold Product
export interface SoldProductListResponseType {
  data: {
    id: number
    name: string
    sold_quantity: number
    total_value: number
    unit: string
    thumbnail: string
  }[]
  totalPages: number
}

// Orders
export interface OrdersListResponseType {
  data: {
    id: number
    code: string
    date: string
    status: string
    payment_status: string
    total: number
    type: string
  }[]
  totalPages: number
}

// Money
export interface SettlementMoneyResponseType {
  data: {
    cash: number
    credit: number
    refund: number
  }
}
