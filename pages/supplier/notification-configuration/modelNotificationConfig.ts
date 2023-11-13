export interface NotificationListDataResponseType {
  success?: boolean
  statusCode?: number
  message?: string
  totalItems?: number
  nextPage?: null
  previousPage?: null
  currentPage?: number
  totalPages?: number
  limit?: number
  data?: NotificationTypeItem[]
}

export interface NotificationTypeItem {
  id?: number
  name?: string
  description?: string
  type?: string
  enable?: boolean
}

export interface NotificationDetailResponseType {
  success?: boolean
  status?: number
  message?: string
  data?: Data
}

export interface Data {
  id?: number
  name?: string
  description?: string
  type?: string
  configurations?: Configurations
}

export interface Configurations {
  enable?: boolean
  over_sms?: boolean
  over_email?: boolean
  over_notifications?: boolean
  time?: null
  time_frame?: string
  email_content?: string
  time_reminder?: string
}
