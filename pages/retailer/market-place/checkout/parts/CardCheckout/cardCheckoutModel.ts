export interface VaultCardType {
  number: string
  code: string
  name: string
  cvc: string
  expiryMonth: string
  expiryYear: string
  avsZip?: string
  magstripe?: string
  avsStreet?: string
  isDefault: boolean
}

export interface AddCardType {
  number: string
  name: string
  cvc: string
  expiry: string
}

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

  customer_id?: number
  created_at?: Date
  card_type?: string
  expiry_month?: number
  expiry_year?: number
  avs_address?: string
  avs_zip?: string
  payment_method_type?: string
}
export interface ListCardType {
  records: CardDetailInListCardType[]
  recordCound: number
}
export interface ListCardResponseType {
  data: ListCardType
}
export interface SubmitPaymentType {
  online: string
  partially_paid: string
}
// export interface SubmitPaymentType {
//   order_ids: number[]
//   payment_token: string
// }

export interface CustomerType {
  customer_id: number
}
export interface CustomerResponseType {
  data: CustomerType
  errors: any
}
