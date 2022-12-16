export interface DistributionChannelType {
  id: number
  name: string
  code: string
}

export interface DistributionChannelListResponseType {
  data: DistributionChannelType[]
  totalPages?: number
  totalItems: number
  errors?: any
  currentPage: number
  previousPage: number | null
  nextPage: number | null
}
