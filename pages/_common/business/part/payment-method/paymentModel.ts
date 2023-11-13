export interface CardDetailInListCardType {
  isDefault: boolean
  id: number
  created: string
  cardType: string
  last4: string
  cardId: string
  // use for call api
  token: string
  expiryMonth: string
  expiryYear: string
  hasContract: boolean
  isDebit: boolean
  name: string
}
export interface ListCardType {
  records: CardDetailInListCardType[]
  recordCound: number
}

export interface CardTypeOfRevitPay {
  id?: number
  customer_id?: number
  name?: string
  created_at?: Date
  card_type?: string
  last4?: string
  expiry_month?: number
  expiry_year?: number
  avs_address?: string
  avs_zip?: string
  payment_method_type?: string
}

export interface ListCardResponseType {
  data: ListCardType
}

export interface AddCardType {
  number: string
  expiryMonth: string
  expiryYear: string
  cvc: string
  code?: string
  name?: string
}
export interface ValidateCardType {
  number: string
  expiry: string
  cvc: string
}
