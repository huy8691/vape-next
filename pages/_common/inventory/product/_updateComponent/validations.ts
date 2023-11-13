import * as Yup from 'yup'

const schema = (t: any, on_market: boolean) => {
  console.log('on_market', on_market)
  return Yup.object().shape(
    {
      name: Yup.string()
        .required(t('validate.name.required'))
        .matches(/\S+/, t('validate.name.matches')) ///...
        .min(2, t('validate.name.min'))
        .max(100, t('validate.name.max')),
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
        ? { thumbnail: Yup.string().required(t('validate.thumbnail')) }
        : { thumbnail: Yup.string().notRequired().nullable() }),
      ...(on_market
        ? { brand: Yup.string().required(t('validate.brand')) }
        : { brand: Yup.string().notRequired().nullable() }),
      category: Yup.string().required(t('validate.category')),
      ...(on_market
        ? {
            category_marketplace: Yup.string().required(
              t('validate.categoryMarketplace')
            ),
          }
        : { category_marketplace: Yup.string().notRequired().nullable() }),
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
            manufacturer: Yup.string().required(t('validate.manufacturer')),
          }
        : {
            manufacturer: Yup.string().notRequired().nullable(),
          }),
      unit_type: Yup.string().required(t('validate.unitType')),
      description: Yup.string()
        .notRequired()
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
        .notRequired()
        .nullable()
        .when('longDescription', {
          is: (value: string) => value,
          then: (rule) =>
            rule
              .matches(/\S+/, t('validate.longDescription.matches'))
              .min(10, t('validate.longDescription.min'))
              .max(5000, t('validate.longDescription.max')),
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
      warehouses: Yup.array()
        .of(
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
        )
        .test(
          'testwarehouse',
          t('validate.warehouse.test'),
          (warehouses: any) => {
            return warehouses?.some((item: any) => item.quantity)
          }
        ),
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
const schemaCreateProductWithVariant = (t: any, on_market: boolean) => {
  return Yup.object().shape(
    {
      name: Yup.string()
        .required(t('validate.name.required'))
        .matches(/\S+/, t('validate.name.matches'))
        .min(2, t('validate.name.min'))
        .max(100, t('validate.name.max')),
      ...(on_market
        ? { thumbnail: Yup.string().required(t('validate.thumbnail')) }
        : { thumbnail: Yup.string().notRequired().nullable() }),
      ...(on_market
        ? { brand: Yup.string().required(t('validate.brand')) }
        : { brand: Yup.string().notRequired().nullable() }),
      category: Yup.string().required(t('validate.category')),
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
      unit_type: Yup.string().required(t('validate.unitType')),
      description: Yup.string()
        .notRequired()
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
        .notRequired()
        .nullable()
        .when('longDescription', {
          is: (value: string) => value,
          then: (rule) =>
            rule
              .matches(/\S+/, t('validate.longDescription.matches'))
              .min(10, t('validate.longDescription.min'))
              .max(5000, t('validate.longDescription.max')),
        }),
    },
    [
      // Add Cyclic deps here because when require itself
      ['longDescription', 'longDescription'],
      ['description', 'description'],
      ['weight', 'weight'],
    ]
  )
}

const schemaUpdate = (t: any, on_market: boolean) => {
  return Yup.object().shape(
    {
      name: Yup.string()
        .required(t('validate.name.required'))
        .matches(/\S+/, t('validate.name.matches'))
        .min(2, t('validate.name.min'))
        .max(100, t('validate.name.max')),
      ...(on_market
        ? { brand: Yup.string().required(t('validate.brand')) }
        : { brand: Yup.string().notRequired().nullable() }),
      category: Yup.string().required(t('validate.category')),
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
      unit_type: Yup.string().required(t('validate.unitType')),
      description: Yup.string()
        .notRequired()
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
        .notRequired()
        .nullable()
        .when('longDescription', {
          is: (value: string) => value,
          then: (rule) =>
            rule
              .matches(/\S+/, t('validate.longDescription.matches'))
              .min(10, t('validate.longDescription.min'))
              .max(5000, t('validate.longDescription.max')),
        }),

      // distribution_channel: Yup.array()
      //   .of(Yup.number())
      //   .required(t('validate.distributionChannel.required')),
    },
    [
      // Add Cyclic deps here because when require itself
      ['longDescription', 'longDescription'],
      ['description', 'description'],
    ]
  )
}
const schemaBrandAndManufacturer = (t: any) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('validate.nameBrand.required'))
      .min(2, t('validate.nameBrand.min'))
      .max(50, t('validate.nameBrand.max'))
      .matches(/\S+/, t('validate.nameBrand.matches')),
    logo: Yup.string().nullable().notRequired(),
  })
}
const schemaCategory = (t: any) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('validate.nameCategory.required'))
      .min(2, t('validate.nameCategory.min'))
      .max(50, t('validate.nameCategory.max'))
      .matches(/\S+/, t('validate.nameCategory.matches')),
    parent_category: Yup.string().nullable(),
  })
}

const schemaAttributeOptions = (t: any) => {
  return Yup.object().shape({
    attribute_option_array: Yup.array().of(
      Yup.object().shape({
        name: Yup.string()
          .required(t('validate.attribute.name.required'))
          .min(2, t('validate.attribute.name.min'))
          .max(50, t('validate.attribute.name.max'))
          .matches(/\S+/, t('validate.attribute.name.matches')),
        option: Yup.array()
          .max(4, t('validate.attribute.option.max'))
          .required(t('validate.attribute.option.required')),
        // Yup.lazy((val) =>
        //   Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string()
        // ),
      })
    ),
  })
}
export {
  schema,
  schemaUpdate,
  schemaBrandAndManufacturer,
  schemaCategory,
  schemaAttributeOptions,
  schemaCreateProductWithVariant,
}
