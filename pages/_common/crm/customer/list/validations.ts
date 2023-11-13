import * as Yup from 'yup'

const schema = Yup.object().shape({
  search: Yup.string(),
})

const schemaCreateUpdate = Yup.object().shape(
  {
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().notRequired().nullable(),
    email: Yup.string()
      .notRequired()
      .nullable()
      .when('email', {
        is: (value: any) => {
          return value
        },
        then: (rule) => {
          return rule.email('Email is incorrect format')
        },
      }),
    address: Yup.string().notRequired().nullable(),
    phone_number: Yup.string()
      .required('Phone number is required')
      .matches(
        /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
        'Phone number is incorrect format'
      ),
    business_name: Yup.string().notRequired().nullable(),
  },
  [
    // Add Cyclic deps here because when require itself
    ['email', 'email'],
  ]
)

export { schema, schemaCreateUpdate }
