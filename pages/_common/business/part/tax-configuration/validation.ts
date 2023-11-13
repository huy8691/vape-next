import { TFunction } from 'i18next'
import * as Yup from 'yup'

export const schema = (t: TFunction<['business']>) => {
  return Yup.object().shape(
    {
      custom_tax_rate: Yup.number()
        .nullable()
        .notRequired()
        .typeError(t('business:validate.taxRateMustBeANumber'))

        .transform((value) => (isNaN(value) ? null : value))
        .when('custom_tax_rate', {
          is: (value: any) => {
            return value || value === 0
          },
          then: (rule) =>
            rule
              .min(0, t('business:validate.taxRateMustBeGreaterOrEqual_0'))
              .max(100, t('business:validate.taxRateMustBeLowerOrEqual_100')),
        }),
    },
    [
      // Add Cyclic deps here because when require itself
      ['custom_tax_rate', 'custom_tax_rate'],
    ]
  )
}
