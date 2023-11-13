import * as yup from 'yup'

const schema = (t: any) => {
  return yup.object().shape(
    {
      discount_amount: yup
        .number()
        .typeError(t('validate.discountAmount.typeError'))
        .required(t('validate.discountAmount.required'))
        .min(5 / 10, t('validate.discountAmount.miMax'))
        .max(100, t('validate.discountAmount.minMax')),
      max_discount_amount: yup
        .number()
        .typeError(t('validate.maxDiscount.typeError'))
        .nullable()
        .notRequired()
        .transform((_, val) => {
          console.log('val', val)
          return val !== '' ? Number(val) : null
        })
        .when('max_discount_amount', {
          is: (value: any) => {
            return value || value === 0
          },
          then: (rule) => {
            return rule
              .positive(t('validate.maxDiscount.positive'))
              .typeError(t('validate.maxDiscount.typeError'))
              .min(1 / 100, t('validate.maxDiscount.minMax'))
              .max(1000000, t('validate.maxDiscount.minMax'))
          },
        }),
      distribution_channels: yup.array().notRequired().nullable(),
    },
    [['max_discount_amount', 'max_discount_amount']]
  )
}
const schemaUpdate = (t: any) => {
  return yup.object().shape(
    {
      discount_amount: yup
        .number()
        .typeError(t('validate.discountAmount.typeError'))
        .required(t('validate.discountAmount.required'))
        .min(5 / 10, t('validate.discountAmount.miMax'))
        .max(100, t('validate.discountAmount.minMax')),
      max_discount_amount: yup
        .number()
        .typeError(t('validate.maxDiscount.typeError'))
        .nullable()
        .notRequired()
        .transform((_, val) => {
          console.log('val', val)
          return val !== '' ? Number(val) : null
        })
        .when('max_discount_amount', {
          is: (value: any) => {
            return value || value === 0
          },
          then: (rule) => {
            return rule
              .positive(t('validate.maxDiscount.positive'))
              .typeError(t('validate.maxDiscount.typeError'))
              .min(1 / 100, t('validate.maxDiscount.minMax'))
              .max(1000000, t('validate.maxDiscount.minMax'))
          },
        }),
    },
    [['max_discount_amount', 'max_discount_amount']]
  )
}
const schemaDelay = (t: any) => {
  return yup.object().shape({
    duration: yup
      .number()
      .typeError(t('validate.duration.required'))
      .required(t('validate.duration.required'))
      .integer(t('validate.duration.integer'))
      .min(0, t('validate.duration.min'))
      .max(1000, t('validate.duration.max')),
  })
}
export { schema, schemaDelay, schemaUpdate }
