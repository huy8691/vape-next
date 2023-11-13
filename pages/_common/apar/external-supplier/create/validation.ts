import { TFunction } from 'i18next'
import * as Yup from 'yup'
const phoneRegExp = /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/

import zipState from 'zip-state'
const schema = (t: TFunction<['external-supplier']>) => {
  return Yup.object().shape(
    {
      email: Yup.string().email(t('validate.email')),
      name: Yup.string()
        .required(t('validate.name.required'))
        .min(2, t('validate.name.min'))
        .max(50, t('validate.name.max'))
        .matches(/^(?!\s).*/, t('validate.name.matches')),
      phone_number: Yup.string()
        .notRequired()
        .nullable(true)
        .when('phone_number', {
          is: (value: any) => {
            return value
          },
          then: (rule) => {
            return rule.matches(phoneRegExp, t('validate.phoneNumber'))
          },
        }),
      address: Yup.string()
        .notRequired()
        .max(255, t('validate.address.max'))
        .matches(/^(?!\s).*/, t('validate.address.matches')),
      city: Yup.string().notRequired().max(500, t('validate.city')),
      state: Yup.object().shape({
        name: Yup.string().notRequired(),
        abbreviation: Yup.string().notRequired(),
      }),
      postal_zipcode: Yup.string()
        .notRequired()
        .when('postal_zipcode', {
          is: (value: any) => {
            return value
          },
          then: (rule) => {
            return rule
              .min(5, t('validate.postalCode.min'))
              .max(10, t('validate.postalCode.max'))
              .test(
                'custom-validation',
                t('validate.postalCode.test'),
                function (value) {
                  if (value)
                    return zipState(value) === this.parent?.state?.abbreviation
                  return false
                }
              )
          },
        }),
    },
    [
      ['phone_number', 'phone_number'],
      ['postal_zipcode', 'postal_zipcode'],
    ]
  )
}

export { schema }
