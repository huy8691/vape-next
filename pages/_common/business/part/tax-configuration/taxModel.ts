export interface TaxRateSubmitType {
  is_customized: boolean
  custom_tax_rate: number | null
  postal_zipcode?: string
}
export interface TaxRateValidateType {
  custom_tax_rate: number | null
}
export interface TaxRateResponseType {
  data: TaxRateSubmitType
  error?: any
}

export interface TaxRateBasedOnZipcodeType {
  estimatedCombinedRate: number
  zipcode: string
}

export interface TaxRateBasedOnZipcodeTypeResponse {
  data: TaxRateBasedOnZipcodeType
  error?: any
}
