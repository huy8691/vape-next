import * as Yup from 'yup'

const schemaAttributeOptions = (t: any) => {
  return Yup.object().shape({
    arr_attributes: Yup.array().of(
      Yup.object().shape({
        attribute: Yup.object().shape({
          name: Yup.string()
            .min(2, t('validate.attribute.name.min'))
            .max(50, t('validate.attribute.name.max'))
            .matches(/\S+/, t('validate.attribute.name.matches'))
            .required(t('validate.attribute.name.required')),
        }),
        options: Yup.array()
          .of(
            Yup.string()
              .min(1, t('validate.attribute.option.min'))
              .max(50, t('validate.attribute.option.max'))
              .matches(/\S+/, t('validate.attribute.option.matches'))
              .required(t('validate.attribute.option.required'))
          )
          .min(1, t('validate.attribute.option.required'))
          .max(
            20,
            t(
              'validate.attribute.option.optionMustHaveLessThanOrEqualTo_5Items'
            )
          ),
        // .required('Option is required'),

        // options: Yup.lazy((val) =>
        //   Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string()
        // ),
        // Yup.lazy((val) =>
        //   Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string()
        // ),
      })
    ),
  })
}
const schemaVariant = (t: any) => {
  return Yup.object().shape({
    options_warehouse_distribution: Yup.array().of(
      Yup.object().shape(
        {
          price: Yup.string().required(
            t('validate.distributionChannel.requiredPrice')
          ),
          distribution_channel: Yup.array().min(
            1,
            t('validate.distributionChannel.required')
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
          // .test(
          //   'testwarehouse',
          //   'Warehouse must be fill at least one',
          //   (warehouses: any) => {
          //     return warehouses?.some((item: any) => item.quantity)
          //   }
          // ),
          // .compact((v) => !v.quantity),
          description: Yup.string()
            .nullable()
            .when('description', {
              is: (value: string) => value,
              then: (rule) =>
                rule
                  .min(20, t('validate.description.min'))
                  .matches(/\S+/, t('validate.description.matches'))
                  .max(500, t('validate.description.max')),
            }),
          longDescription: Yup.string()
            .nullable()
            .when('longDescription', {
              is: (value: string) => value?.length,
              then: (rule) =>
                rule
                  .min(20, t('validate.longDescription.min'))
                  .matches(/\S+/, t('validate.longDescription.matches'))
                  .max(5000, t('validate.longDescription.max')),
            }),
        },
        [
          // Add Cyclic deps here because when require itself
          ['longDescription', 'longDescription'],
          ['description', 'description'],
        ]
      )
    ),
  })
}

export { schemaVariant, schemaAttributeOptions }
