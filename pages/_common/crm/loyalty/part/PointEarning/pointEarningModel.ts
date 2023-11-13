export interface PointEarningType {
  id: number
  action_id: number
  action: string
  enable: true
  earning_rule: 'FIXAMOUNT' | 'PERCENTAGE'
  value_points: number
  max_value_points: number
}

export interface PointEarningResponseType {
  data: PointEarningType[]
  totalPages?: number
  errors?: any
  previousPage?: number | null
  nextPage?: number | null
  totalItems?: number
}

export interface ValidateOnlineOrderType {
  value_points: number | null
  max_value_points?: number
  value_percent: number | null
  earning_rule: 'FIXAMOUNT' | 'PERCENTAGE'
}
export interface ValidateRetailOrderType {
  value_points_retail: number | null
  max_value_points_retail?: number
  value_percent_retail: number | null
  earning_rule_retail: 'FIXAMOUNT' | 'PERCENTAGE'
}

export interface UpdateConfigValueType {
  enable: boolean
  earning_rule: string
  value_points: number
  max_value_points?: number | null
}
