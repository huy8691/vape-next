export interface BurningDetailType {
  id: number
  points: number
  burning_rule: 'FIXAMOUNT' | 'PERCENTAGE'
  value: number
  max_value: number
}

export interface BurningDetailResponseType {
  data: BurningDetailType[]
  errors?: any
  totalItems: number
  nextPage: number
  previousPage: number
  limit: number
  totalPages: number
}
