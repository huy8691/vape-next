import * as Yup from 'yup'
const phoneRegExp = /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/
import zipState from 'zip-state'

export const schemaAddress = () => {
  return Yup.object().shape({
    name: Yup.string()
      .required('Address name is required')
      .min(2, 'Address name must be at least 2 characters')
      .max(50, 'Address name must be at most 50 characters')
      .matches(/^(?!\s).*/, 'Address name invalid'),
    phone_number: Yup.string()
      .required('Phone number is required')
      .matches(phoneRegExp, 'Phone number invalid'),
    address: Yup.string()
      .required('Address is required')
      .min(2, 'Address must be at least 2 characters')
      .max(50, 'Address must be at most 50 characters')
      .matches(/^(?!\s).*/, 'Address invalid'),
    receiver_name: Yup.string()
      .required('Receiver name is required')
      .min(2, 'Receiver name must be at least 2 characters')
      .max(50, 'Receiver name must be at most 50 characters')
      .matches(/^(?!\s).*/, 'Receiver name invalid'),
    city: Yup.string()
      .required('City field is required')
      .min(2, 'City must be at least 2 characters')
      .max(500, 'City must be at most 500 characters'),
    state: Yup.object()
      .shape({
        name: Yup.string().required('State field is required'),
        abbreviation: Yup.string().required('State field is required'),
      })
      .required('State field is required'),
    postal_zipcode: Yup.string()
      .required('Postal zip code field is required')
      .min(5, 'Postal zip code must be at least 5 characters')
      .max(9, 'Postal zip code must be at most 9 characters')
      .test(
        'custom-validation',
        'Postal zip code does not match City/State',
        function (value) {
          if (value) return zipState(value) === this.parent?.state?.abbreviation
          return false
        }
      ),
  })
}

export const schemaForm = () => {
  return Yup.object().shape(
    {
      external_supplier: Yup.string().required(
        'External supplier field is required'
      ),
      code: Yup.string()
        .notRequired()
        .nullable(true)
        .when('code', {
          is: (value: string) => value,
          then: (rule) =>
            rule
              .min(6, 'The voucher code must be from 6 to 50 characters')
              .max(50, 'The voucher code must be from 6 to 50 characters'),
        }),

      discount_amount: Yup.number()
        .notRequired()
        .nullable(true)
        .when('discount_amount', {
          is: (value: any) => value,
          then: (rule) =>
            rule
              .min(
                1 / 100,
                'Discount amount must be between $0.01 and $10,000,000'
              )
              .max(
                10000000,
                'Discount amount must be between $0.01 and $10,000,000'
              ),
        }),
      tax_amount: Yup.number()
        .notRequired()
        .nullable(true)
        .when('tax_amount', {
          is: (value: any) => value,
          then: (rule) =>
            rule
              .min(1 / 100, 'Tax amount must be between $0.01 and $10,000,000')
              .max(
                10000000,
                'Tax amount must be between $0.01 and $10,000,000'
              ),
        }),
      items: Yup.array()
        .test(
          'items',
          'The external order must have at least one item',
          (value: any) => {
            return value.length >= 1
          }
        )
        .of(
          Yup.object().shape({
            quantity: Yup.number()
              .typeError('The quantity field is required')
              .required('The quantity field is required')
              .min(1, 'Quantity must be between 1 and 10,000,000')
              .max(10000000, 'Quantity must be between 1 and 10,000,000'),
            price: Yup.number()
              .typeError('The unit price field is required')
              .required('The unit price field is required')
              .min(1 / 100, 'Unit price must be between $0.01 and $10,000,000')
              .max(
                10000000,
                'Unit price must be between $0.01 and $10,000,000'
              ),
          })
        ),
    },
    [
      ['items', 'price'],
      ['discount_amount', 'discount_amount'],
      ['tax_amount', 'tax_amount'],
      ['code', 'code'],
    ]
  )
}

export const schemaExternalSupplier = Yup.object().shape(
  {
    email: Yup.string().email('Email invalid'),
    name: Yup.string()
      .required('The field is required')
      .min(2, 'Business name must be at least 2 characters')
      .max(50, 'Business name must be at least 50 characters')
      .matches(/^(?!\s).*/, 'Business name invalid'),
    phone_number: Yup.string()
      .notRequired()
      .nullable(true)
      .when('phone_number', {
        is: (value: any) => {
          return value
        },
        then: (rule) => {
          return rule.matches(phoneRegExp, 'Phone number invalid')
        },
      }),
    address: Yup.string()
      .notRequired()
      .max(255, 'Address must be at least 255 characters')
      .matches(/^(?!\s).*/, 'Address invalid'),
    city: Yup.string()
      .notRequired()
      .max(500, 'City must be at least 500 characters'),
    state: Yup.object().shape({
      name: Yup.string().notRequired(),
      abbreviation: Yup.string().notRequired(),
    }),
    postal_zipcode: Yup.string()
      .notRequired()
      .when('postal_zipcode', {
        is: (value: any) => {
          return value
        },
        then: (rule) => {
          return rule
            .min(5, 'Postal zip code must be at least 5 characters')
            .max(10, 'Postal zip code must be at most 9 characters')
            .test(
              'custom-validation',
              'Postal zip code does not match City/State',
              function (value) {
                if (value)
                  return zipState(value) === this.parent?.state?.abbreviation
                return false
              }
            )
        },
      }),
  },
  [
    ['phone_number', 'phone_number'],
    ['postal_zipcode', 'postal_zipcode'],
  ]
)

export const schemaOCR = Yup.object().shape(
  {
    items: Yup.array().of(
      Yup.object().shape({
        // name: Yup.string().when('name', {
        //   is: (value: string) => value,
        //   then: (schema) =>
        //     schema
        //       .typeError('The name field is required')
        //       .required('The name field is required'),
        // }),
        base_price: Yup.number().when('name', {
          is: (value: string) => value,
          then: (schema) =>
            schema
              .typeError('The base price field is required')
              .required('The base price field is required')
              .min(1 / 100, 'base price must be between $0.01 and $10,000,000')
              .max(
                10000000,
                'base price must be between $0.01 and $10,000,000'
              ),
        }),
        category: Yup.string().when('name', {
          is: (value: string) => value,
          then: (schema) =>
            schema
              .typeError('The category field is required')
              .required('The category field is required'),
        }),
        brand: Yup.string().when('name', {
          is: (value: string) => value,
          then: (schema) =>
            schema
              .typeError('The brand field is required')
              .required('The brand field is required'),
        }),
        unit_type: Yup.string().when('name', {
          is: (value: string) => value,
          then: (schema) => schema.required('The unit type is required'),
        }),

        product_variant: Yup.string()
          .nullable(true)
          .when('name', (type, schema) => {
            return type
              ? schema
              : schema
                  .typeError('The product variant is required')
                  .required('The product variant is required')
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
  },
  [
    ['name', 'name'],
    ['name', 'base_price'],
    ['name', 'category'],
    ['name', 'brand'],
    ['name', 'unit_type'],
    ['name', 'product_variant'],
  ]
)
