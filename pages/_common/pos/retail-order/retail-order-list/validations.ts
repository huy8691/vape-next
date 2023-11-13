import * as yup from 'yup'

const schema = yup.object().shape({
  search: yup.string().max(255),
})

const filterSchema = yup.object().shape({
  payment: yup.array().nullable(),
  from_date: yup
    .string()
    .nullable()
    .test('', '', function (values: any) {
      const date = new Date(this.parent.to_date)
      const date2 = new Date(values)
      if (values) {
        if (!this.parent.to_date) {
          if (String(date2) == 'Invalid Date') {
            return this.createError({
              message: 'Invalid Date',
            })
          }
          return true
        }
        if (date2 > date) {
          return this.createError({
            message: 'From field must be less than or equal to To field',
          })
        }
      }
      return true
    })
    .test(function (values: any) {
      const date = new Date()
      const date2 = new Date(values)
      if (values) {
        if (date2 > date) {
          return this.createError({
            message: 'The from date must less than present date',
          })
        }
        if (String(date2) == 'Invalid Date') {
          return this.createError({
            message: 'Invalid Date',
          })
        }
      }
      return true
    }),
  to_date: yup
    .string()
    .nullable()
    .test(
      'match',
      'To field must be greater than or equal to From field',
      function (values: any) {
        const date = new Date(this.parent.from_date)
        const date2 = new Date(values)
        if (values) {
          if (date2 < date) {
            return this.createError({
              message: 'To field must be greater than or equal to From field',
            })
          }
          if (!this.parent.from_date) {
            if (String(date2) == 'Invalid Date') {
              return this.createError({
                message: 'Invalid Date',
              })
            }
          }
        }
        return true
      }
    )
    .test(function (values: any) {
      const date = new Date()
      const date2 = new Date(values)
      if (values) {
        if (date2 > date) {
          return this.createError({
            message: 'The to date must less than present date',
          })
        }
        if (String(date2) == 'Invalid Date') {
          return this.createError({
            message: 'Invalid Date',
          })
        }
      }
      return true
    }),
  price_gte: yup
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
  price_lte: yup
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

export { schema, filterSchema }
