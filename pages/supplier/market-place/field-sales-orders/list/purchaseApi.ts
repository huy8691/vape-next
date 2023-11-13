import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { purchaseOrderResponseTypeData } from './purchaseModel'

const getListPurchaseOrder = (
  params?: object
): Promise<AxiosResponse<purchaseOrderResponseTypeData>> => {
  return callAPIWithToken({
    url: `/api/purchase-orders/`,
    method: 'GET',
    params: {
      ...params,
    },
  })
}

export { getListPurchaseOrder }
