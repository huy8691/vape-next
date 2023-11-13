export interface ListCarrierType {
  name: string
  id: number
  status: boolean
  logo: string
}

export interface ListCarrierResponseType {
  data: ListCarrierType[]
  errors?: any
}

export interface UpdateCarrierStatusType {
  carrier: number
  status: boolean
}
