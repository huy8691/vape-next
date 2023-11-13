import { TFunction } from 'i18next'
import * as Yup from 'yup'
const payRateSchema = (t: TFunction<['user-management']>) => {
  return Yup.object().shape({
    pay_rate: Yup.number()
      .typeError(t('user-management:validate.payRate.typeError'))
      .required(t('user-management:validate.payRate.required'))
      .min(1 / 100, t('user-management:validate.payRate.min'))
      .max(10000000, t('user-management:validate.payRate.max')),
  })
}
export { payRateSchema }
