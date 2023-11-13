interface MonthlySaleType {
  id: number
  created_at: string
  updated_at: string
  is_deleted: boolean
  monthly_sale: string
}
export interface MonthlySaleResponseType {
  data: MonthlySaleType[]
  errors?: any
}

export interface MonthlyPurchaseType {
  id: number
  created_at: string
  updated_at: string
  is_deleted: boolean
  monthly: string
}
export interface MonthlyPurchaseResponseType {
  data: MonthlyPurchaseType[]
  errors?: any
}

export interface GetFindUSOverType {
  id: number
  created_at: string
  updated_at: string
  is_deleted: boolean
  find_us_over: string
}

export interface GetFindUsOverResponseType {
  data: GetFindUSOverType[]
  errors?: any
}

export interface TypeOfSaleType {
  id: number
  created_at: string
  updated_at: string
  is_deleted: boolean
  type_of_sale: string
}

export interface TypeOfSaleResponseType {
  data: TypeOfSaleType[]
  errors?: any
}
