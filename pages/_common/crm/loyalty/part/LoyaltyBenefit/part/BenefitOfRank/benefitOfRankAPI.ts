import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { SubmitUpdateTieredType } from './benefitOfRankModel'

const updateTieredBenefit = (
  id: number,
  data: SubmitUpdateTieredType
): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/tiered-benefit/${id}/update/`,
    method: 'put',
    data: data,
  })
}

export { updateTieredBenefit }
