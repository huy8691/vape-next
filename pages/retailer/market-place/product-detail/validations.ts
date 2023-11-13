import * as Yup from 'yup'

const schema = Yup.object().shape({
  quantity: Yup.number().required().min(1).max(1000000),
})
const schemaUpdateInstock = Yup.object().shape({
  quantity: Yup.number().required().min(1).max(1000000),
})

const schemaAddToCart = Yup.object().shape({
  list_variants: Yup.array().of(
    Yup.object().shape(
      {
        product_variant: Yup.number(),
        distribution_channel: Yup.number().required(),
        quantity: Yup.number()
          .nullable(true)
          .notRequired()
          .transform((_, val) => {
            console.log('val', val)
            return val !== '' ? Number(val) : null
          })
          .when('quantity', {
            is: (value: any) => {
              return value
            },
            then: (rule) => {
              return rule
                .positive('Quantity must be a positive number')
                .typeError('Quantity must be a number')
                .min(1, 'Quantity must be between 1 and 10,000,000')
                .max(10000000, 'Quantity must be between 1 and 10,000,000')
                .nullable(true)
            },
          }),
      },
      [
        // Add Cyclic deps here because when require itself
        ['quantity', 'quantity'],
      ]
    )
  ),
})
export { schema, schemaUpdateInstock, schemaAddToCart }
