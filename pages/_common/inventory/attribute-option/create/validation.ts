import * as Yup from 'yup'

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Attribute name is a required field')
    .min(2, 'Attribute name must be at least 2 characters')
    .max(50, 'Attribute name must be at most 50 characters')
    .matches(/\S+/, 'Invalid Attribute Name'),
  options: Yup.array().nullable(),
})

export { schema }
