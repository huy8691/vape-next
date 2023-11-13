export interface BannerType {
  id: number
  name: string
  description: string
  image: string
}

export interface BannerResponseType {
  data: BannerType[]
  errors?: any
}
