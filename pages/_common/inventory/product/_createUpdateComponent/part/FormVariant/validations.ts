import * as Yup from 'yup'

const schema = (t: any, on_market: boolean) => {
  return Yup.object().shape(
    {
      // price: Yup.number()
      //   .typeError('Price is a required field')
      //   .required('Price is a required field')
      //   .min(1, 'Price must be between 1 to 10,000,000')
      //   .max(10000000, 'Price must be between 1 to 10,000,000'),
      // distribution_channel: Yup.number().required(
      //   'Distribution channel is a required field'
      // ),
      ...(on_market
        ? {
            bar_code: Yup.string()
              .notRequired()
              .nullable()
              .when('bar_code', {
                is: (value: string) => value,
                then: (rule) =>
                  rule
                    .matches(/\S+/, t('Invalid barcode'))
                    .min(5, t('Barcode must be at least 5 character')),
              }),
          }
        : { bar_code: Yup.string().notRequired().nullable() }),
      price: Yup.number()
        .typeError(t('validate.basePrice.typeError'))
        .required(t('validate.basePrice.required'))
        .min(1 / 100, t('validate.basePrice.min'))
        .max(10000000, t('validate.basePrice.max')),
      ...(on_market
        ? {
            uom: Yup.number()
              .typeError(t('validate.uom'))
              .required(t('validate.uom')),
          }
        : {
            uom: Yup.number()
              .typeError(t('validate.uom'))
              .notRequired()
              .nullable(),
          }),
      ...(on_market
        ? {
            weight: Yup.number()
              .typeError(t('validate.weight.required'))
              .required(t('validate.weight.required'))
              .min(1 / 100, t('validate.weight.minMax'))
              .max(1000000, t('validate.weight.minMax')),
          }
        : {
            weight: Yup.number()
              .typeError(t('validate.weight.required'))
              .notRequired()
              .nullable()
              .transform((_, val) => {
                console.log('val', val)
                return val !== '' ? Number(val) : null
              })
              .when('weight', {
                is: (value: any) => {
                  return value || value === 0
                },
                then: (rule) => {
                  return (
                    rule

                      .typeError(t('validate.warehouse.typeError'))
                      // .min(1 / 100, t('validate.weight.minMax'))
                      .max(1000000, t('validate.weight.minMax'))
                  )
                },
              }),
          }),
      ...(on_market
        ? {
            distribution_channel: Yup.array()
              .of(
                Yup.object().shape({
                  id: Yup.number().required(),
                  price: Yup.number()
                    .typeError(t('validate.distributionChannel.requiredPrice'))
                    .required(t('validate.distributionChannel.requiredPrice'))
                    .min(1 / 100, t('validate.distributionChannel.minMax'))
                    .max(10000000, t('validate.distributionChannel.minMax')),
                })
              )
              .required(t('validate.distributionChannel.required')),
          }
        : {
            distribution_channel: Yup.array()
              .of(
                Yup.object().shape(
                  {
                    id: Yup.number().notRequired().nullable(),
                    price: Yup.number()
                      .notRequired()
                      .nullable()
                      .transform((_, val) => {
                        console.log('val', val)
                        return val !== '' ? Number(val) : null
                      }),
                    // .when('price', {
                    //   is: (value: any) => {
                    //     return value || value === 0
                    //   },
                    //   then: (rule) => {
                    //     return rule
                    //       .positive(t('validate.warehouse.positive'))
                    //       .integer(t('validate.warehouse.typeError'))
                    //       .typeError(t('validate.warehouse.typeError'))
                    //       .min(1 / 100, t('validate.weight.minMax'))
                    //       .max(1000000, t('validate.weight.minMax'))
                    //   },
                    // }),
                  }
                  // [['price', 'price']]
                )
              )
              .notRequired()
              .nullable(),
          }),
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
    },
    [
      ['bar_code', 'bar_code'],
      ['weight', 'weight'],
    ]
  )
}

export { schema }
