export interface DistributionListType {
  id: number
  name: string
}
export interface DiscountOfDCType {
  id: number
  type: string
  discount_amount: number
  max_discount_amount?: number
  distribution_channels: DistributionListType[]
  is_apply_all_channel: boolean
}
export interface DiscountOfDCResponseType {
  data: DiscountOfDCType[]
  errors?: any
  totalPages: number
  totalItems: number
}
export interface DistributionListResponseType {
  data: DistributionListType[]
  errors?: any
}
export interface SubmitAddRuleType {
  type?: string
  discount_amount: number
  max_discount_amount?: number | null
  distribution_channels: number[]
  organization: number
  is_apply_all_channel: boolean
}

export interface DiscountDetailType {
  id?: number
  type?: string
  discount_amount: number
  max_discount_amount?: number | null
  is_apply_all_channel: boolean
  distribution_channels: DistributionListType[]
}

export interface DiscountDetailResponseType {
  data: DiscountDetailType
  errors?: any
}

export interface SetDelayPaymentType {
  is_allowed?: boolean
  duration: number
}

export interface DelayPaymentResponseType {
  data: SetDelayPaymentType
  errors?: any
}
