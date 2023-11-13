import * as yup from 'yup'

const schema = yup.object().shape({
  search: yup.string().max(255),
})

const filterSchema = yup.object().shape({
  category: yup.array(),
  instock_gte: yup
    .number()
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
            console.log('error', this.parent.instock_lte)
            return false
          }
        }
        return true
      }
    ),
  instock_lte: yup
    .number()
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
            console.log('error')
            return false
          }
        }
        return true
      }
    ),
  branch: yup.array(),
  manufacturer: yup.array(),
  retail_price_gte: yup
    .number()
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .test(
      'match',
      'Price from field must be less than or equal to Price To field',
      function (value) {
        if (
          value == null ||
          value == undefined ||
          value == 0 ||
          this.parent.price_lte == 0
        ) {
          return true
        } else {
          if (value > this.parent.price_lte) {
            console.log('error')
            return false
          }
        }
        return true
      }
    ),
  retail_price_lte: yup
    .number()
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
          if (value < this.parent.price_gte) {
            console.log('error')
            return false
          }
        }
        return true
      }
    ),
})
const schemaCashPayment = yup.object().shape({
  cash: yup
    .number()
    .typeError('Cash must be number')
    .required('Cash is required')
    .min(1 / 100, 'Cash must be between 0.01$ and 10,000,000$')
    .max(10000000, 'Cash must be between 0.01$ and 10,000,000$'),
})
const schemaTip = yup.object().shape({
  tip: yup
    .number()
    .typeError('Cash must be number')
    .required('Cash is required')
    .min(0, 'Cash must be between $0.00 and $1,000,000.00')
    .max(1000000, 'Cash must be between $0.00 and $1,000,000.00'),
})
const schemaVoucher = yup.object().shape({
  voucher_code: yup.string().required('Voucher code is required'),
})

const schemaCreditCardPayment = yup.object().shape({
  credit: yup
    .number()
    .typeError('Cash must be number')
    .required('Cash is required')
    .min(1 / 100, 'Cash must be between 0.01$ and 10,000,000$')
    .max(10000000, 'Cash must be between 0.01$ and 10,000,000$'),
  number: yup
    .number()
    .typeError('Card number must be a number')
    .required('Card number is required'),
  cvc: yup
    .number()
    .typeError('CVC must be a number')
    .required('CVC is required'),
  expiry: yup
    .string()
    .required('Expiry is required')
    .length(5, 'Expiry is incorrect format'),
})
export {
  schema,
  filterSchema,
  schemaCashPayment,
  schemaCreditCardPayment,
  schemaTip,
  schemaVoucher,
}
