import * as Yup from 'yup'

export const schema = (t: any) => {
  return Yup.object().shape(
    {
      discount_amount: Yup.number()
        .typeError(t('validate.discountAmount.typeError'))
        .required(t('validate.discountAmount.required'))
        .min(5 / 10, t('validate.discountAmount.miMax'))
        .max(100, t('validate.discountAmount.minMax')),
      max_discount_amount: Yup.number()
        .typeError(t('validate.maxDiscount.typeError'))
        .notRequired()
        .nullable(true)
        .transform((_, val) => (val === Number(val) ? val : null))
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
export const schemaSearch = Yup.object().shape({
  search: Yup.string(),
})
