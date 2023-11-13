import * as Yup from 'yup'

export const schema = Yup.object().shape(
  {
    value_points: Yup.number()
      .typeError('Discount amount is required')
      .required('Discount amount is required')
      .min(5 / 10, 'Discount amount must be between 0.5% and 100%')
      .max(100, 'Discount amount must be between 0.5% and 100%'),
    max_discount_amount: Yup.number()
      .typeError('Max discount amount is required')
      .notRequired()
      .nullable(true)
      .transform((_, val) => (val === Number(val) ? val : null))
      .when('max_discount_amount', {
        is: (value: any) => {
          return value || value === 0
        },
        then: (rule) => {
          return rule
            .positive('Max discount amount must be a positive number')
            .typeError('Max discount amount must be a number')
            .min(
              1 / 100,
              'Max discount amount must be between 0.01$ and 1,000,000$'
            )
            .max(
              1000000,
              'Max discount amount must be between 0.01$ and 1,000,000$'
            )
        },
      }),
  },
  [['max_discount_amount', 'max_discount_amount']]
)
export const schemaSearch = Yup.object().shape({
  search: Yup.string(),
})
