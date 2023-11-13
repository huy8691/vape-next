import * as Yup from 'yup'

const schema = Yup.object().shape({
  search: Yup.string(),
})

export const schemaThreshold = Yup.object().shape({
  amount: Yup.number()
    .typeError('Threshold is required')
    //   .notRequired()
    //   .nullable(true)
    //   .transform((_, val) => (val === Number(val) ? val : null))
    .required('Threshold is required')
    .positive('Threshold must be a positive number')
    .typeError('Threshold must be a number')
    .min(1 / 100, 'Threshold must be between $0.01 and $1,000,000.00')
    .max(1000000, 'Threshold must be between $0.01 and $1,000,000.00'),
  //   .when('amount', {
  //     is: (value: any) => {
  //       return value || value === 0
  //     },
  //     then: (rule) => {
  //       return rule
  //         .positive('Threshold must be a positive number')
  //         .typeError('Threshold must be a number')
  //         .min(1 / 100, 'Threshold must be between $0.01 and $1,000,000.00')
  //         .max(1000000, 'Threshold must be between $0.01 and $1,000,000.00')
  //     },
  //   }),
})

export { schema }
