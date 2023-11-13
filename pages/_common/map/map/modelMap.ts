export interface ListSellerType {
  id: number
  full_name: string
  phone_number: string
  email: string
  avatar: string
  active: boolean
  latitude: number
  longitude: number
  address: string
  idle_time: number
  time_at_location: string | null
}

export interface SellerFromSocketType {
  user: number
  latitude: number
  longitude: number
  address: string
}
export interface SellerOfflineType {
  action: string
  user_id: number
}
export interface ListSellerResponseTypes {
  data: ListSellerType[]
  error?: any
  totalPages: number
  nextPage: number
  previousPage: number
  currentPage: number
}

export interface PositionType {
  lat: number
  lng: number
}

export interface ListSellerResponseType {
  data: ListSellerType[]
  error?: unknown
}

export interface SearchType {
  search: string
}
