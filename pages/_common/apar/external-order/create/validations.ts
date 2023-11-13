import { TFunction } from 'i18next'
import * as Yup from 'yup'
const phoneRegExp = /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/
import zipState from 'zip-state'

export const schemaAddress = (t: TFunction<['external-order']>) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('validate.name.required'))
      .min(2, t('validate.name.min'))
      .max(50, t('validate.name.max'))
      .matches(/^(?!\s).*/, t('validate.name.matches')),
    phone_number: Yup.string()
      .required(t('validate.phoneNumber.required'))
      .matches(phoneRegExp, t('validate.phoneNumber.matches')),
    address: Yup.string()
      .required(t('validate.address.required'))
      .min(2, t('validate.address.min'))
      .max(50, t('validate.address.max'))
      .matches(/^(?!\s).*/, t('validate.address.matches')),
    receiver_name: Yup.string()
      .required(t('validate.receiverName.required'))
      .min(2, t('validate.receiverName.min'))
      .max(50, t('validate.receiverName.max'))
      .matches(/^(?!\s).*/, t('validate.receiverName.matches')),
    city: Yup.string()
      .required(t('validate.city.required'))
      .min(2, t('validate.city.min'))
      .max(500, t('validate.city.max')),
    state: Yup.object()
      .shape({
        name: Yup.string().required(t('validate.state.required')),
        abbreviation: Yup.string().required(t('validate.state.required')),
      })
      .required(t('validate.state.required')),
    postal_zipcode: Yup.string()
      .required(t('validate.postalCode.required'))
      .min(5, t('validate.postalCode.min'))
      .max(9, t('validate.postalCode.max'))
      .test(
        'custom-validation',
        t('validate.postalCode.test'),
        function (value) {
          if (value) return zipState(value) === this.parent?.state?.abbreviation
          return false
        }
      ),
  })
}

export const schemaForm = (t: TFunction<['external-order']>) => {
  return Yup.object().shape(
    {
      external_supplier: Yup.string().required(
        t('validate.externalSupplier.required')
      ),
      code: Yup.string()
        .notRequired()
        .nullable(true)
        .when('code', {
          is: (value: string) => value,
          then: (rule) =>
            rule.min(6, t('validate.code.min')).max(50, t('validate.code.max')),
        }),

      discount_amount: Yup.number()
        .notRequired()
        .nullable(true)
        .when('discount_amount', {
          is: (value: any) => value,
          then: (rule) =>
            rule
              .min(1 / 100, t('validate.discountAmount.minMax'))
              .max(10000000, t('validate.discountAmount.minMax')),
        }),
      tax_amount: Yup.number()
        .notRequired()
        .nullable(true)
        .when('tax_amount', {
          is: (value: any) => value,
          then: (rule) =>
            rule
              .min(1 / 100, t('validate.taxAmount.minMax'))
              .max(10000000, t('validate.taxAmount.minMax')),
        }),
      items: Yup.array()
        .test('items', t('validate.items.test'), (value: any) => {
          return value.length >= 1 && value
        })
        .of(
          Yup.object().shape({
            quantity: Yup.number()
              .required(t('validate.items.quantity'))
              .typeError(t('validate.items.quantity'))
              .min(1, 'Quantity must be between 1 and 10,000,000')
              .max(10000000, 'Quantity must be between 1 and 10,000,000'),
            price: Yup.number()
              .required(t('validate.items.price'))
              .typeError(t('validate.items.price'))
              .min(1 / 100, t('validate.items.minMax'))
              .max(10000000, t('validate.items.minMax')),
          })
        ),
    },
    [
      ['items', 'price'],
      ['discount_amount', 'discount_amount'],
      ['tax_amount', 'tax_amount'],
      ['code', 'code'],
    ]
  )
}

export const schemaExternalSupplier = (t: TFunction<['external-order']>) => {
  return Yup.object().shape(
    {
      email: Yup.string().email(t('validate.email')),
      name: Yup.string()
        .required(t('validate.nameBusiness.required'))
        .min(2, t('validate.nameBusiness.min'))
        .max(50, t('validate.nameBusiness.max'))
        .matches(/^(?!\s).*/, t('validate.nameBusiness.matches')),
      phone_number: Yup.string()
        .notRequired()
        .nullable(true)
        .when('phone_number', {
          is: (value: any) => {
            return value
          },
          then: (rule) => {
            return rule.matches(
              phoneRegExp,
              t('validate.phoneNumber.typeError')
            )
          },
        }),
      address: Yup.string()
        .notRequired()
        .max(255)
        .matches(/^(?!\s).*/, t('validate.address.matches')),
      city: Yup.string().notRequired().max(500, t('validate.city.max')),
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
              .max(9, t('validate.postalCode.max'))
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
