import * as Yup from 'yup'

const schema = Yup.object().shape({
  key: Yup.string(),
  product_code: Yup.string(),
  product_name: Yup.string(),
  category: Yup.string(),
  quantity: Yup.number(),
  branch: Yup.string(),
  manufacturer: Yup.string(),
  price: Yup.string(),
})

const filterSchema = Yup.object().shape({
  category: Yup.array(),
  instock_gte: Yup.number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .test(
      'match',
      'Quantity From field must be less than or equal to Quantity To field',
      function (value) {
        if (
          value == null ||
          value == undefined ||
          value == 0 ||
          this.parent.instock_lte == 0
        ) {
          return true
        } else {
          if (value > this.parent.instock_lte) {
            return false
          }
        }
        return true
      }
    ),
  instock_lte: Yup.number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .test(
      'match',
      'Quantity To field must be greater than or equal to Quantity From field',
      function (value) {
        if (value == null || value == undefined || value == 0) {
          return true
        } else {
          if (value < this.parent.instock_gte) {
            return false
          }
        }
        return true
      }
    ),
  branch: Yup.array(),
  manufacturer: Yup.array(),
  retail_price_gte: Yup.number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .test(
      'match',
      'Price from field must be less than or equal to Price To field',
      function (value) {
        console.log('????', value)
        if (
          value == null ||
          value == undefined ||
          value == 0 ||
          this.parent.retail_price_lte == 0
        ) {
          return true
        } else {
          if (value > this.parent.retail_price_lte) {
            return false
          }
        }
        return true
      }
    ),
  retail_price_lte: Yup.number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .test(
      'match',
      'Price To field must be greater than or equal to Price From field',
      function (value) {
        if (value == null || value == undefined || value == 0) {
          return true
        } else {
          if (value < this.parent.retail_price_gte) {
            return false
          }
        }
        return true
      }
    ),
})

const retailSchema = Yup.object().shape({
  retail_price: Yup.number()
    .typeError('Retail price must be a number')
    .required('Retail price is required')
    .min(1 / 100, 'Retail price must be greater or equal than 0.01')
    .max(10000000, 'Retail price must be less or equal than 10,000,000'),
})

const createUpdateProductOCRSchema = Yup.object().shape({
  list_product: Yup.array().of(
    Yup.object().shape({
      isCreate: Yup.boolean(),
      checked: Yup.boolean(),
      unit_type: Yup.string()
        .notRequired()
        .nullable()
        .when('isCreate', {
          is: true,
          then: Yup.string()
            .notRequired()
            .nullable()
            .when('checked', {
              is: true,
              then: Yup.string().required('Unit type is required'),
            }),
        }),
      // unit_type: Yup.string().test(
      //   'unitTypeCondition',
      //   'Unit type is required',
      //   function (value) {
      //     const isCreateValue = this.parent.isCreate
      //     const checked = this.parent.checked
      //     if (isCreateValue && checked) {
      //       return Yup.string().required().validate(value)
      //     }
      //     return true
      //   }
      // ),
      brand: Yup.string()
        .notRequired()
        .when('isCreate', {
          is: true,
          then: Yup.string()
            .notRequired()
            .nullable()
            .when('checked', {
              is: true,
              then: Yup.string().required('Brand is required'),
            }),
        }),
      category: Yup.string()
        .notRequired()
        .nullable()
        .when('isCreate', {
          is: true,
          then: Yup.string()
            .notRequired()
            .nullable()
            .when('checked', {
              is: true,
              then: Yup.string().required('Category is required'),
            }),
        }),
      product: Yup.number()
        .notRequired()
        .nullable()
        .when('isCreate', {
          is: false,
          then: Yup.number()
            .notRequired()
            .nullable()
            .when('checked', {
              is: true,
              then: Yup.number()
                .required('Please select similar product')
                .typeError('Please select similar product'),
            }),
        }),
      // .when('checked', {
      //   is: true,
      //   then: Yup.number().required(),
      // })
      name: Yup.string()
        .notRequired()
        .nullable()
        .when('isCreate', {
          is: true,
          then: Yup.string()
            .notRequired()
            .nullable()
            .when('checked', {
              is: true,
              then: Yup.string().required('Name is required'),
            }),
        }),
      // .when('checked', {
      //   is: true,
      //   then: Yup.string().required(),
      // })
      price: Yup.number()
        .notRequired()
        .when('isCreate', {
          is: true,
          then: Yup.number()
            .notRequired()
            .when('checked', {
              is: true,
              then: Yup.number()
                .typeError('Base price is required')
                .required('Base price is required')
                .min(
                  1 / 100,
                  'Base price must be between $0.01 and $10,000,000.00'
                )
                .max(
                  10000000,
                  'Base price must be between $0.01 and $10,000,000.00'
                ),
            }),
        }),
      warehouses: Yup.array()
        .of(
          Yup.object().shape({
            warehouse: Yup.number().notRequired().nullable(),
            quantity: Yup.number().notRequired().nullable(),
          })
        )
        .notRequired()
        .nullable(),
    })
  ),
})
export { schema, filterSchema, retailSchema, createUpdateProductOCRSchema }
