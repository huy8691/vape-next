import { TFunction } from 'i18next'
import * as Yup from 'yup'

export const schema = (t: TFunction<['business'], undefined>) => {
  return Yup.object().shape({
    limit_hour: Yup.number()
      .typeError(t('business:validate.limitHours.required'))
      .required(t('business:validate.limitHours.required'))
      .min(1, t('business:validate.limitHours.min'))
      .max(24, t('business:validate.limitHours.max')),
  })
}
