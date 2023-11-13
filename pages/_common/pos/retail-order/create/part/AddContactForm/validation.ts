import * as yup from 'yup'

const schema = (t: any) => {
  return yup.object().shape({
    phone_number: yup
      .string()
      .required(t('create.validation.phoneNumber.required'))
      .matches(
        /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
        t('create.validation.phoneNumber.matches')
      ),
  })
}
const schemaAddGuest = (t: any) => {
  return yup.object().shape(
    {
      first_name: yup.string().required(t('create.validation.firstName')),
      last_name: yup.string().notRequired().nullable(),
      address: yup
        .string()
        .notRequired()
        .nullable()
        .when('address', {
          is: (value: any) => {
            return value || value === null
          },
          then: (rule) =>
            rule
              .min(2, t('create.validation.address.min'))
              .max(255, t('create.validation.address.max')),
        }),
      phone_number: yup
        .string()
        .required(t('create.validation.phoneNumber.required'))
        .matches(
          /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
          t('create.validation.phoneNumber.matches')
        ),
      email: yup
        .string()
        .notRequired()
        .nullable()

        .when('email', {
          is: (value: any) => {
            return value
          },
          then: (rule) => rule.email(t('create.validation.email')),
        }),
    },
    [
      ['email', 'email'],
      ['address', 'address'],
    ]
  )
}

export { schema, schemaAddGuest }
