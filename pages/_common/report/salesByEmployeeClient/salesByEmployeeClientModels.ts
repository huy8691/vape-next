export interface SalesByEmployeeClientResponseType {
  totalPages: number
  data: {
    id: number
    first_name: string
    last_name: string
    nick_name: string
    sold_products: number
    completed_orders: number
    refund_amount: number
    total_sales: number
  }[]
}
