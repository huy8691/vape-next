import * as Yup from 'yup'

const schema = Yup.object().shape({
  email: Yup.string().email().max(255).required(),
})

const schemaPassword = Yup.object().shape({
  new_password: Yup.string().required('Password is required'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
})

export { schema, schemaPassword }
