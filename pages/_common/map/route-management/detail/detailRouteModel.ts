export interface LocationType {
  address: string
  latitude: number
  longitude: number
  contact: ContactDetailType
}
export interface StartEndLocation {
  lat: number
  lng: number
}
export interface LocationDetailType {
  latitude: number
  longitude: number
}
export interface PointType {
  points: string
}
export interface RouteType {
  overview_polyline: PointType
  legs: RouteRenderDetailType[]
  waypoint_order: number[]
}
export interface RouteRenderDetailType {
  end_location: StartEndLocation
  start_location: StartEndLocation
}
export interface RouteDetailType {
  origin: string
  destination: string
  user: UserProfileType
  optimize: boolean
  stop_number: number
  locations: LocationType[]
  routes: RouteType[]
  destination_location: LocationDetailType
  origin_location: LocationDetailType
  date_from: string
  start_at: string | null
  end_at: string | null
}

export interface RouteDetailResponseType {
  data: RouteDetailType
  erros: any
}
export interface UserProfileType {
  id: number
  full_name: string
  avatar: string | null
  email: string
  user_type: string
  status: string
  created_at: string
  nick_name: string | null
}
export interface ContactDetailType {
  id: number
  business_name: string
  address: string
}
