import * as Yup from 'yup'

const schema = Yup.object().shape({
  email: Yup.string().email().max(255).required('Email is a required field'),
})

const schemaPassword = Yup.object().shape({
  new_password: Yup.string()
    .required('Password is required')
    .min(8, 'Must contain 8 characters'),
  confirmPassword: Yup.string()
    .required('Confirm password is required')
    .min(8, 'Must contain 8 characters')
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
})

export { schema, schemaPassword }
