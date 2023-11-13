// detail
export interface RouteDetailResponseType {
  data: {
    user: {
      id: number
      full_name: string
    }
    date_from: string
    origin: string
    origin_location: {
      latitude: string
      longitude: string
    }
    destination: string
    destination_location: {
      latitude: string
      longitude: string
    }
    optimize: boolean
    locations: {
      address: string
      latitude: string
      longitude: string
      contact: {
        business_name: string
        id: number | null
      }
    }[]
  }
  erros: any
}

export interface FormRouterType {
  seller_id: number
  name: string
  date_from: string
  origin: {
    address: string
    latitude: string
    longitude: string
  }
  destination: {
    address: string
    latitude: string
    longitude: string
  }
  optimize: boolean
  locations: {
    address: string
    latitude: string
    longitude: string
    contact: {
      business_name: string
      id: number | null
    }
  }[]
}
