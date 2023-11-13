import * as Yup from 'yup'
import { TFunction } from 'i18next'

const phoneRegExp = /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/

const schema = (t: TFunction<['account'], undefined>) => {
  return Yup.object().shape({
    phone_number: Yup.string()
      .required(t('account:validate.required'))
      .matches(phoneRegExp, 'Phone number invalid'),
    first_name: Yup.string()
      .required(t('account:validate.required'))
      .min(2, 'First name must be at least 2 characters')
      .max(50, 'First name must be at most 50 characters')
      .matches(/^(?!\s).*/, 'First name invalid')
      .matches(
        /^[a-zA-Z0-9]+$/,
        'First name does not allow special characters '
      )
      .matches(/^[a-zA-Z\s]+$/, 'First name does not allow number '),

    last_name: Yup.string()
      .required(t('account:validate.required'))
      .min(2, 'Last name must be at least 2 characters')
      .max(50, 'Last name must be at most 50 characters')
      .matches(/^(?!\s).*/, 'Last name invalid')
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        'Last name does not allow special characters '
      )
      .matches(/^[a-zA-Z\s]+$/, 'Last name does not allow number '),
    dob: Yup.string()
      .nullable()
      .test(function (values: any) {
        const date = new Date()
        const date2 = new Date(values)
        if (values) {
          if (date2 > date) {
            return this.createError({
              message: 'The date must less than present date',
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

    gender: Yup.string().required(t('account:validate.required')),
    address: Yup.string()
      .test(function (value) {
        if (value) {
          if (value.length < 2) {
            return this.createError({
              message: 'Address name must be at least 2 characters',
            })
          }
        }
        return true
      })
      .transform(function (value) {
        return this.isType(value) && value == '' ? null : value
      })
      .nullable()
      .max(500, 'Address name must be at most 500 characters')
      .matches(/^(?!\s).*/, 'Address invalid'),
  })
}

export { schema }
