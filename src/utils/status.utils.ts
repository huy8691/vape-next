export const statusPayment = (value: string) => {
  switch (value) {
    case 'WAITING_FOR_PAYMENT':
      return {
        text: 'WAITING FOR PAYMENT',
        color: '#49516F',
      }
    case 'PAID':
      return {
        text: 'PAID',
        color: '#1DB46A',
      }
    case 'DELAY_PAYMENT':
      return {
        text: 'DELAY PAYMENT',
        color: '#2F6FED',
      }
    case 'REFUNDED':
      return {
        text: 'REFUNDED',
        color: '#F08420',
      }
    default:
      return {
        text: 'N/A',
        color: '#49516F',
      }
  }
}

export const statusOrder = (value: string) => {
  switch (value) {
    case 'WAITING_FOR_APPROVED':
      return {
        text: 'Confirmation',
        color: '#49516F',
      }
    case 'APPROVED':
      return {
        text: 'APPROVED',
        color: '#1DB46A',
      }
    case 'DELIVERING':
      return {
        text: 'DELIVERING',
        color: '#2F6FED',
      }
    case 'DELIVERED':
      return {
        text: 'DELIVERED',
        color: '#1DB46A',
      }
    case 'CANCELLED':
      return {
        text: 'CANCELLED',
        color: '#E02D3C',
      }
    case 'COMPLETED':
      return {
        text: 'COMPLETED',
        color: '#1DB46A',
      }
    default:
      return {
        text: 'N/A',
        color: '#49516F',
      }
  }
}
