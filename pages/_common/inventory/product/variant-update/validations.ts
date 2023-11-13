import * as Yup from 'yup'

export const schema = (t: any, on_market: boolean) => {
  return Yup.object().shape(
    {
      options: Yup.array().of(
        Yup.object().shape({
          name: Yup.string().required(),
          option: Yup.string().required(),
        })
      ),
      name: Yup.string()
        .required('Variant name is required')
        .matches(/\S+/, 'Variant name must not contain leading spaces')
        .min(2, 'Variant name must be at least 2 characters')
        .max(100, 'Variant name must be at most 100 characters'),
      description: Yup.string()
        .nullable()
        .when('description', {
          is: (value: string) => value,
          then: (rule) =>
            rule
              .matches(/\S+/, t('validate.description.matches'))
              .min(10, t('validate.description.min'))
              .max(500, t('validate.description.max')),
        }),
      longDescription: Yup.string()
        .nullable()
        .when('longDescription', {
          is: (value: string) => value,
          then: (rule) =>
            rule
              .matches(/\S+/, t('validate.longDescription.matches'))
              .min(10, t('validate.longDescription.min'))
              .max(5000, t('validate.longDescription.max')),
        }),
      price: Yup.number()
        .typeError(t('validate.distributionChannel.requiredPrice'))
        .required(t('validate.distributionChannel.requiredPrice'))
        .min(1 / 100, t('validate.distributionChannel.minMax'))
        .max(10000000, t('validate.distributionChannel.minMax')),
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
            distribution_channels: Yup.array()
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
            distribution_channels: Yup.array()
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
                    //     console.log('here')
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
    },
    [
      // Add Cyclic deps here because when require itself
      ['longDescription', 'longDescription'],
      ['description', 'description'],
      ['bar_code', 'bar_code'],
      ['weight', 'weight'],
    ]
  )
}
export const schemaWithOutVariant = (t: any, on_market: boolean) => {
  return Yup.object().shape(
    {
      name: Yup.string().required(),
      ...(on_market
        ? { brand: Yup.string().required(t('validate.brand')) }
        : { brand: Yup.string().notRequired().nullable() }),
      category: Yup.string().required(t('validate.nameCategory.required')),
      ...(on_market
        ? {
            category_marketplace: Yup.string().required(
              t('validate.categoryMarketplace')
            ),
          }
        : { category_marketplace: Yup.string().notRequired().nullable() }),
      ...(on_market
        ? {
            manufacturer: Yup.string().required(t('validate.manufacturer')),
          }
        : {
            manufacturer: Yup.string().notRequired().nullable(),
          }),
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
      unit_type: Yup.string().required(t('validate.unitType')),
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
      description: Yup.string()
        .nullable()
        .when('description', {
          is: (value: string) => value,
          then: (rule) =>
            rule
              .matches(/\S+/, t('validate.description.matches'))
              .min(10, t('validate.description.min'))
              .max(500, t('validate.description.max')),
        }),
      longDescription: Yup.string().when('longDescription', {
        is: (value: string) => value,
        then: (rule) =>
          rule
            .matches(/\S+/, t('validate.longDescription.matches'))
            .min(10, t('validate.longDescription.min'))
            .max(5000, t('validate.longDescription.max')),
      }),
      ...(on_market
        ? {
            distribution_channels: Yup.array()
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
            distribution_channels: Yup.array()
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
                    //     console.log('here')
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
    },
    [
      // Add Cyclic deps here because when require itself
      ['longDescription', 'longDescription'],
      ['description', 'description'],
      ['bar_code', 'bar_code'],
      ['weight', 'weight'],
    ]
  )
}
export const schemaBrandAndManufacturer = (t: any) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('validate.nameBrand.required'))
      .min(2, t('validate.nameBrand.min'))
      .max(50, t('validate.nameBrand.max'))
      .matches(/\S+/, t('validate.nameBrand.matches')),
    logo: Yup.string().nullable().notRequired(),
  })
}
export const schemaCategory = (t: any) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('validate.nameCategory.required'))
      .min(2, t('validate.nameCategory.min'))
      .max(50, t('validate.nameCategory.max'))
      .matches(/\S+/, t('validate.nameCategory.matches')),
    parent_category: Yup.string().nullable(),
  })
}
