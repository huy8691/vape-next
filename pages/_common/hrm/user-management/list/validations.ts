import * as yup from 'yup'

const schema = yup.object().shape({
  search: yup.string().max(255),
})
const schemaAssignRole = yup.object().shape({
  roles: yup.array().required('Role is a required field'),
})
const schemaCommission = yup.object().shape(
  {
    commission: yup
      .number()
      .notRequired()
      .nullable()
      .transform((_, val) => {
        console.log('val', val)
        return val !== '' ? Number(val) : null
      })
      .when('commission', {
        is: (value: any) => {
          return value || value === 0
        },
        then: (rule) => {
          return rule
            .positive('Commission must be a positive number')
            .typeError('Commission must be a number')
            .min(0, 'Commission must be between 0% and 100%')
            .max(100, 'Commission must be between 0% and 100%')
        },
      }),
  },
  [
    // Add Cyclic deps here because when require itself
    ['commission', 'commission'],
  ]
)
export { schema, schemaAssignRole, schemaCommission }
