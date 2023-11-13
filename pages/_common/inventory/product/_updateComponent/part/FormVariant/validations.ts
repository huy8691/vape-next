import * as Yup from 'yup'

const schema = (t: any) => {
  return Yup.object().shape({
    // price: Yup.number()
    //   .typeError('Price is a required field')
    //   .required('Price is a required field')
    //   .min(1, 'Price must be between 1 to 10,000,000')
    //   .max(10000000, 'Price must be between 1 to 10,000,000'),
    // distribution_channel: Yup.number().required(
    //   'Distribution channel is a required field'
    // ),
    distribution_channel: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.number()
            .typeError(t('validate.distributionChannel.required'))
            .required(t('validate.distributionChannel.required')),
          price: Yup.number()
            .typeError(t('validate.distributionChannel.requiredPrice'))
            .required(t('validate.distributionChannel.requiredPrice'))
            .min(1 / 100, t('validate.distributionChannel.minMax'))
            .max(10000000, t('validate.distributionChannel.minMax')),
        })
      )
      .required(t('validate.distributionChannel.required')),
    warehouses: Yup.array().of(
      Yup.object().shape(
        {
          warehouse: Yup.number(),
          quantity: Yup.number()
            .nullable()
            .notRequired()
            .transform((_, val) => {
              console.log('val', val)
              return val !== '' ? Number(val) : null
            })
            .when('quantity', {
              is: (value: any) => {
                return value || value === 0
              },
              then: (rule) => {
                return rule
                  .positive(t('validate.warehouse.positive'))
                  .integer(t('validate.warehouse.typeError'))
                  .typeError(t('validate.warehouse.typeError'))
                  .min(1, t('validate.warehouse.min'))
                  .max(10000000, t('validate.warehouse.max'))
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
}

export { schema }
