import * as Yup from 'yup'

const schemaUpdateInstock = (t: any) => {
  return Yup.object().shape(
    {
      quantity: Yup.string().required(t('validate.quantity')),
      description: Yup.string()
        .nullable()
        .notRequired()
        .when('description', {
          is: (value: string) => value?.length,
          then: (rule) => rule.max(500, t('validate.description.max')),
        }),
      reason: Yup.string().required(t('validate.reason')),
      warehouse: Yup.number().required(),
    },
    [
      // Add Cyclic deps here because when require itself
      ['description', 'description'],
    ]
  )
}

const retailSchema = (t: any) => {
  return Yup.object().shape({
    retail_price: Yup.number()
      .typeError(t('validate.retailPrice.typeError'))
      .required(t('validate.retailPrice.required'))
      .min(1 / 100, t('validate.retailPrice.min'))
      .max(10000000, t('validate.retailPrice.max')),
  })
}
const schemaLowStock = (t: any) => {
  return Yup.object().shape({
    low_stock_alert_level: Yup.string().required(
      t('validate.lowStockAlertLevel')
    ),
  })
}

const schemaFilter = (t: any) => {
  return Yup.object().shape({
    from_date: Yup.string()
      .nullable()
      .test('', '', function (values: any) {
        const date = new Date(this.parent.to_date)
        const date2 = new Date(values)
        if (values) {
          if (!this.parent.to_date) {
            if (String(date2) == 'Invalid Date') {
              return this.createError({
                message: t('validate.fromDate.invalidDate'),
              })
            }
            return true
          }
          if (date2 > date) {
            return this.createError(
              t('validate.fromDate.fromFieldMustBeLessThanOrEqualToToField')
            )
          }
        }
        return true
      }),
    to_date: Yup.string()
      .nullable()
      .test(
        'match',
        t('validate.toDate.toFieldMustBeGreaterThanOrEqualToFromField'),
        function (values: any) {
          const date = new Date(this.parent.from_date)
          const date2 = new Date(values)
          if (values) {
            if (date2 < date) {
              return this.createError({
                message: t(
                  'validate.toDate.toFieldMustBeGreaterThanOrEqualToFromField'
                ),
              })
            }
            if (!this.parent.from_date) {
              if (String(date2) == 'Invalid Date') {
                return this.createError({
                  message: t('validate.toDate.invalidDate'),
                })
              }
            }
          }
          return true
        }
      ),
    reason: Yup.array(),
    warehouse: Yup.array(),
  })
}

const schemaAddNewVariant = (t: any) => {
  return Yup.object().shape({
    option_array: Yup.array().of(
      Yup.object().shape({
        option: Yup.string()
          .required(t('validate.optionArray.required'))
          .min(1, t('validate.optionArray.min'))
          .max(50, t('validate.optionArray.max'))
          .matches(/\S+/, t('validate.optionArray.matches')),
        name: Yup.string().required(t('validate.optionArray.name')),
      })
    ),

    distribution_channel: Yup.array().of(
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
    ),
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
const schemaUpdateAttribute = (t: any) => {
  return Yup.object().shape({
    name: Yup.string().required(t('validate.name.required')),
  })
}
export {
  schemaUpdateInstock,
  retailSchema,
  schemaFilter,
  schemaLowStock,
  schemaAddNewVariant,
  schemaUpdateAttribute,
}
