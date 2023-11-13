import * as Yup from 'yup'
import { TFunction } from 'i18next'

export const schema = (t: TFunction<['voucher'], undefined>) =>
  Yup.object().shape(
    {
      title: Yup.string().required(t('voucher:validate.title')).trim(),
      code: Yup.string()
        .required('Code is required')
        .min(6, 'The voucher code must be from 6 to 50 characters')
        .max(50, 'The voucher code must be from 6 to 50 characters'),
      availability: Yup.array()
        .of(Yup.string())
        .test('availability', 'This field required', (value: any) => {
          return value && value.length > 0 && value[0].trim() !== ''
        }),
      limit_per_voucher: Yup.number()
        .required(t('voucher:validate.limitPerVoucher.required'))
        .integer(t('voucher:validate.limitPerVoucher.integer'))
        .min(1, t('voucher:validate.limitPerVoucher.minMax'))
        .max(10000000, t('voucher:validate.limitPerVoucher.minMax'))
        .typeError(t('voucher:validate.limitPerVoucher.typeError') as string),
      limit_per_user: Yup.number()
        // .required(t('voucher:validate.limitPerUser.required'))
        .integer(t('voucher:validate.limitPerUser.integer'))
        .min(0, t('voucher:validate.limitPerUser.minMax'))
        .max(10000000, t('voucher:validate.limitPerUser.minMax'))
        .typeError('The field should have digits only'),
      discount_amount: Yup.number()
        .typeError(t('voucher:validate.discountAmount.typeError') as string)
        .required(t('voucher:validate.discountAmount.required'))
        .when('type', {
          is: (value: string) => {
            return value === 'PERCENTAGE'
          },
          then: (rule) => {
            return rule
              .transform((_, val) => (val === Number(val) ? val : null))
              .positive(t('voucher:validate.discountAmount.positive'))
              .typeError(
                t('voucher:validate.discountAmount.typeError') as string
              )
              .min(
                5 / 10,
                t('voucher:validate.discountAmount.percentage.minMax')
              )
              .max(100, t('voucher:validate.discountAmount.percentage.minMax'))
          },
        })
        .when('type', {
          is: (value: string) => {
            return value === 'FIXEDAMOUNT'
          },
          then: (rule) => {
            return rule
              .positive(t('voucher:validate.discountAmount.positive'))
              .typeError(
                t('voucher:validate.discountAmount.typeError') as string
              )
              .min(
                1 / 100,
                t('voucher:validate.discountAmount.fixedAmount.minMax')
              )
              .max(
                10000000,
                t('voucher:validate.discountAmount.fixedAmount.minMax')
              )
          },
        }),
      minimum_spend: Yup.number()
        .notRequired()
        .nullable(true)
        .transform((_, val) => (val === Number(val) ? val : null))
        .typeError(t('voucher:validate.minimumSpend.typeError') as string)
        .when('minimum_spend', {
          is: (value: any) => {
            return value || value === 0
          },
          then: (rule) => {
            return rule
              .positive(t('voucher:validate.minimumSpend.positive'))
              .typeError(t('voucher:validate.minimumSpend.minMax') as string)
              .min(1 / 100, t('voucher:validate.minimumSpend.minMax'))
              .max(10000000, t('voucher:validate.minimumSpend.minMax'))
          },
        }),
      max_discount_amount: Yup.number()
        .typeError(t('voucher:validate.maxDiscountAmount.typeError') as string)
        .notRequired()
        .nullable(true)
        .transform((_, val) => (val === Number(val) ? val : null))
        .when('max_discount_amount', {
          is: (value: any) => {
            return value || value === 0
          },
          then: (rule) => {
            return rule
              .positive(t('voucher:validate.maxDiscountAmount.positive'))
              .typeError(
                t('voucher:validate.maxDiscountAmount.minMax') as string
              )
              .min(1 / 100, t('voucher:validate.maxDiscountAmount.minMax'))
              .max(1000000, t('voucher:validate.maxDiscountAmount.minMax'))
          },
        }),

      start_date: Yup.date()
        .required(t('voucher:validate.startDate.required'))
        .typeError(t('voucher:validate.startDate.typeError') as string),
      expiry_date: Yup.date()
        .required(t('voucher:validate.expiryDate.required'))
        .typeError(t('voucher:validate.expiryDate.typeError') as string)
        .min(Yup.ref('start_date'), t('voucher:validate.expiryDate.min')),
    },
    [
      ['max_discount_amount', 'max_discount_amount'],
      ['minimum_spend', 'minimum_spend'],
    ]
  )

export const schemaSearch = Yup.object().shape({
  search: Yup.string(),
})
