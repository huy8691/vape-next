import * as Yup from 'yup'

const schemaPassword = Yup.object().shape({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Must contain 8 characters'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .min(8, 'Must contain 8 characters')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
})

export { schemaPassword }
