export interface SubmitUpdateTieredType {
  enable_discount: boolean
  discount_value: number
  enable_points_earning_bonus: boolean
  points_earning_value: number
  enable_freeship: boolean
  custom_benefit: string[]
}
export interface ValidateUpdateTieredType {
  discount_value: number
  points_earning_value: number
}

export interface ValidateBenefitNameType {
  benefit_name: string
}
