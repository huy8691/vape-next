import * as Yup from 'yup'

const schema = Yup.object().shape({
  warehouse_quantity: Yup.array().of(
    Yup.object().shape(
      {
        warehouse: Yup.number(),
        quantity: Yup.number()
          .nullable(true)
          .notRequired()
          .transform((_, val) => (val !== '' ? Number(val) : null))
          .when('quantity', {
            is: (value: any) => value?.length,
            then: (rule) =>
              rule
                .positive('Quantity must be a positive number')
                .typeError('Quantity must be a number')
                .min(1, 'Quantity must between 1 and 10,000,000')
                .max(10000000, 'Quantity must between 1 and 10,000,000'),
          }),
      },
      [
        // Add Cyclic deps here because when require itself
        ['quantity', 'quantity'],
      ]
    )
  ),
})
const schemaCancelOrder = Yup.object().shape({
  reason: Yup.string()
    .required('Reason is required')
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason must be at most 500 characters')
    .matches(/\S+/, 'Reason invalid'),
})
export { schema, schemaCancelOrder }
