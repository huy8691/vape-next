import { TFunction } from 'i18next'
import * as Yup from 'yup'

export const schema = (t: TFunction<['business'], undefined>) => {
  return Yup.object().shape({
    logo: Yup.string().required(t('business:validate.logo')),
  })
}
