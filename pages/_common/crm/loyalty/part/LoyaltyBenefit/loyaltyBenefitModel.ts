export interface RankDetailType {
  id: number
  name: string
}
export interface TieredBenefitType {
  id: number
  enable_discount: boolean
  discount_value: number
  enable_points_earning_bonus: boolean
  points_earning_value: number
  enable_freeship: boolean
  custom_benefit: string[]
  rank: RankDetailType
}

export interface TieredBenefitResponseType {
  data: TieredBenefitType[]
  errors?: any
}
