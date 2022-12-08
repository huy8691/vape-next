import * as Yup from 'yup'

const schema = Yup.object().shape({
  first_name: Yup.string()
    .required('First name is a required field')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be at most 50 characters'),

  last_name: Yup.string()
    .required('Last name is a required field')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be at most 50 characters'),

  gender: Yup.string().required('Gender is a required field'),
  address: Yup.string().required('Address is a required field'),
})

export { schema }
