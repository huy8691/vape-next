export const statusOrder = [
  { key: 1, status: 'Đơn hàng mới' },
  { key: 2, status: 'Đã xác nhận' },
  { key: 3, status: 'Đang chuẩn bị' },
  { key: 4, status: 'Đang giao hàng' },
  { key: 5, status: 'Đã giao hàng' },
  { key: 6, status: 'Đã nhận hàng' },
  { key: 7, status: 'Đã đánh giá' },
]

export const statusOrderRender = (data?: number) => {
  switch (data) {
    case 1:
      return 'Đơn hàng mới'
    case 2:
      return 'Đã xác nhận'
    case 3:
      return 'Đang chuẩn bị'
    case 4:
      return 'Đang giao hàng'
    case 5:
      return 'Đã giao hàng'
    case 6:
      return 'Đã nhận hàng'
    case 7:
      return 'Đã đánh giá'
    default:
      return 'N/A'
  }
}
