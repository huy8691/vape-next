import * as Yup from 'yup'

const schema = Yup.object().shape({
  search: Yup.string(),
})

const schemaCreateUpdate = (t: any) => {
  return Yup.object().shape(
    {
      first_name: Yup.string().required(t('validate.firstName')),
      last_name: Yup.string().notRequired().nullable(),
      email: Yup.string()
        .notRequired()
        .nullable()
        .when('email', {
          is: (value: any) => {
            return value || null
          },
          then: (rule) => {
            return rule.email(t('validate.email'))
          },
        }),
      address: Yup.string().notRequired().nullable(),
      phone_number: Yup.string()
        .required(t('validate.phoneNumber.required'))
        .matches(
          /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
          t('validate.phoneNumber.matches')
        ),
      business_name: Yup.string().notRequired().nullable(),
    },
    [
      // Add Cyclic deps here because when require itself
      ['email', 'email'],
    ]
  )
}

export { schema, schemaCreateUpdate }
