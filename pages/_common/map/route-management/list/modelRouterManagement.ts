export interface UserProfileType {
  status: string
}

export interface RouterListType {
  creator_id: number
  id: number
  stop_number: number
  date_from: number
  date_to: number
  //TODO description
  desc: string
  nick_name: string
  date: string
  destination: string
  locations: string
  name: string
  origin: string
  status: string
  userprofile: UserProfileType
}
export interface RouterListResponseType {
  data: RouterListType[]
  error?: any
  totalPages: number
}
