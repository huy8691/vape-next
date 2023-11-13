import * as Yup from 'yup'

const schema = (t: any) => {
  return Yup.object().shape({
    key: Yup.string().matches(/^[a-zA-Z0-9\s]*$/, t('validate.search')),
    product_code: Yup.string(),
    product_name: Yup.string(),
    category: Yup.string(),
    quantity: Yup.number(),
    branch: Yup.string(),
    manufacturer: Yup.string(),
    price: Yup.string(),
  })
}

const retailSchema = Yup.object().shape({
  retail_price: Yup.number()
    .required('Retail price is required')
    .transform((value) =>
      isNaN(value) || value === null || value === undefined ? 0 : value
    )
    .min(1, 'Retail price must be greater or equal than 1')
    .max(10000000, 'Retail price must be less or equal than 10000000'),
})

const filterSchema = (t: any) => {
  return Yup.object().shape({
    category: Yup.array(),
    instock_gte: Yup.number()
      .transform((value) =>
        isNaN(value) || value === null || value === undefined ? 0 : value
      )
      .test(
        'match',
        t('validate.quantityFromFieldMustBeLessThanOrEqualToQuantityToField'),
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
    instock_lte: Yup.number()
      .transform((value) =>
        isNaN(value) || value === null || value === undefined ? 0 : value
      )
      .test(
        'match',
        t('validate.quantityFromFieldMustBeLessThanOrEqualToQuantityToField'),
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
    branch: Yup.array(),
    manufacturer: Yup.array(),
    price_gte: Yup.number()
      .transform((value) =>
        isNaN(value) || value === null || value === undefined ? 0 : value
      )
      .test(
        'match',
        t('validate.priceFromFieldMustBeLessThanOrEqualToPriceToField'),
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
    price_lte: Yup.number()
      .transform((value) =>
        isNaN(value) || value === null || value === undefined ? 0 : value
      )
      .test(
        'match',
        t('validate.priceFromFieldMustBeLessThanOrEqualToPriceToField'),
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
}

export { schema, filterSchema, retailSchema }
