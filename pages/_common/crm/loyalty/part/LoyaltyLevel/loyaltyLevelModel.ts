export interface RankingConfigOfOrgType {
  id: number
  rank_id: number
  name: string
  points_to_reach: number
}

export interface RankingConfigOfOrgResponseType {
  data: RankingConfigOfOrgType[]
  errors?: any
}

export interface LoyaltyLevelValidateType {
  bronze_point: number
  silver_point: number
  gold_point: number
  platinum_point: number
  diamond_point: number
}

export interface SubmitLoyaltyLevelValidateType {
  rank: number
  point_to_reach: number
}

export interface SubmitValueType {
  items: SubmitLoyaltyLevelValidateType[]
}
