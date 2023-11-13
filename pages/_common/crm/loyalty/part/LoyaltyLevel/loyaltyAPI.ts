import { AxiosResponse } from 'axios'

import { callAPIWithToken } from 'src/services/jwt-axios'
import {
  RankingConfigOfOrgResponseType,
  SubmitValueType,
} from './loyaltyLevelModel'

const getRankingConfigOfOrganization = (): Promise<
  AxiosResponse<RankingConfigOfOrgResponseType>
> => {
  return callAPIWithToken({
    url: `/api/organization/rankings/`,
    method: 'get',
  })
}

const updateLoyaltyLevel = (data: SubmitValueType): Promise<AxiosResponse> => {
  return callAPIWithToken({
    url: `/api/organization/rankings/update/`,
    method: 'put',
    data: data,
  })
}
export { getRankingConfigOfOrganization, updateLoyaltyLevel }
