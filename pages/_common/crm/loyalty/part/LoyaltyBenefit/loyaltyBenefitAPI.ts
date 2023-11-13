import { AxiosResponse } from 'axios'
import { callAPIWithToken } from 'src/services/jwt-axios'
import { TieredBenefitResponseType } from './loyaltyBenefitModel'

const getTieredBenefit = (): Promise<
  AxiosResponse<TieredBenefitResponseType>
> => {
  return callAPIWithToken({
    url: `/api/organization/tiered-benefit/`,
    method: 'get',
  })
}

export { getTieredBenefit }
