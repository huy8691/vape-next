import * as Yup from 'yup'

const schema = (t: any) => {
  return Yup.object().shape({
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
                  .positive(t('Quantity must be a positive number'))
                  .typeError(t('Quantity must be a number'))
                  .min(1, t('Quantity must between 1 and 10,000,000'))
                  .max(10000000, t('Quantity must between 1 and 10,000,000')),
            }),
        },
        [
          // Add Cyclic deps here because when require itself
          ['quantity', 'quantity'],
        ]
      )
    ),
  })
}
const schemaCancelOrder = (t: any) => {
  return Yup.object().shape({
    reason: Yup.string()
      .required(t('Reason is required'))
      .min(5, t('Reason must be at least 5 characters'))
      .max(500, t('Reason must be at most 500 characters'))
      .matches(/\S+/, t('Reason invalid')),
  })
}
export { schema, schemaCancelOrder }
