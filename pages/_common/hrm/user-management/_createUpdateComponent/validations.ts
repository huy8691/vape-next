import { TFunction } from 'i18next'
import * as yup from 'yup'

const schema = (t: TFunction<['user-management'], undefined>) => {
  return yup.object().shape(
    {
      first_name: yup
        .string()
        .required(t('user-management:validate.firstName.required'))
        .matches(
          /^[a-zA-Z_]*$/,
          t('user-management:validate.firstName.matches')
        )
        .min(2, t('user-management:validate.firstName.min'))
        .max(50, t('user-management:validate.firstName.max')),
      last_name: yup
        .string()
        .required(t('user-management:validate.lastName.required'))
        .matches(/\S+/, t('user-management:validate.lastName.matches'))
        .matches(
          /^[a-zA-Z0-9\s]+$/,
          t('user-management:validate.lastName.matches1')
        )
        .matches(
          /^[a-zA-Z\s]+$/,
          t('user-management:validate.lastName.matches2')
        )
        .min(2, t('user-management:validate.lastName.min'))
        .max(50, t('user-management:validate.lastName.max')),
      email: yup
        .string()
        .email(t('user-management:validate.email.invalid'))
        .required(t('user-management:validate.email.required')),
      nick_name: yup.string().nullable().notRequired(),
      phone_number: yup
        .string()
        .required(t('user-management:validate.phoneNumber.required'))
        .matches(
          /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
          t('user-management:validate.phoneNumber.matches')
        ),
      commission: yup
        .number()
        .notRequired()
        .nullable()
        .transform((_, val) => {
          console.log('val', val)
          return val !== '' ? Number(val) : null
        })
        .when('commission', {
          is: (value: any) => {
            return value || value === 0
          },
          then: (rule) => {
            return rule
              .positive(t('user-management:validate.commission.positive'))
              .typeError(t('user-management:validate.commission.typeError'))
              .min(0, t('user-management:validate.commission.minMax'))
              .max(100, t('user-management:validate.commission.minMax'))
          },
        }),
      user_type: yup.string().required(t('user-management:validate.userType')),
      roles: yup.array().required(t('user-management:validate.roles')),
      // .min(1, 'Role is a required field'),
    },
    [
      // Add Cyclic deps here because when require itself
      ['commission', 'commission'],
    ]
  )
}
const schemaUpdate = (t: TFunction<['user-management'], undefined>) => {
  return yup.object().shape({
    first_name: yup
      .string()
      .required(t('user-management:validate.firstName.required'))
      .matches(/^[a-zA-Z_]*$/, t('user-management:validate.firstName.matches'))
      .min(2, t('user-management:validate.firstName.min'))
      .max(50, t('user-management:validate.firstName.max')),
    last_name: yup
      .string()
      .required(t('user-management:validate.lastName.required'))
      .matches(/\S+/, t('user-management:validate.lastName.matches'))
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        t('user-management:validate.lastName.matches1')
      )
      .matches(/^[a-zA-Z\s]+$/, t('user-management:validate.lastName.matches2'))
      .min(2, t('user-management:validate.lastName.min'))
      .max(50, t('user-management:validate.lastName.max')),
    nick_name: yup.string().nullable().notRequired(),

    phone_number: yup
      .string()
      .required(t('user-management:validate.phoneNumber.required'))
      .matches(
        /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
        t('user-management:validate.phoneNumber.matches')
      ),
  })
}

export { schema, schemaUpdate }
