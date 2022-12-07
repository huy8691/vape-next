import * as Yup from 'yup'

const schema = Yup.object().shape({
  name: Yup.string()
    .required('Product name is a required field')
    .min(2, 'Product name must be at least 2 characters')
    .max(50, 'Product name must be at most 50 characters'),
  brand: Yup.number().required('Brand  is a required field'),
  manufacturer: Yup.number().required('Manufacturer is a required field'),
  unit_type: Yup.string().required('Unit type is a required field'),
  price: Yup.number()
    .required('Price is a required field')
    .positive('Price must be a positive number'),
  description: Yup.string()
    .required('Short description is a required field')
    .min(2, 'Short description must be at least 2 characters')
    .max(500),
  longDescription: Yup.string()
    .required('Overview is a required field')
    .min(20)
    .max(500),
  category: Yup.number().required(),
  child_category: Yup.string().when('category', {
    is: '1',
    then: Yup.string().required(),
  }),
})

export { schema }
