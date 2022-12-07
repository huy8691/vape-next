import * as Yup from 'yup'

const schema = Yup.object().shape({
  product_name: Yup.string()
    .required('Product name is a required field')
    .min(2, 'Product name must be at least 2 characters')
    .max(50, 'Product name must be at most 50 characters'),
  brand: Yup.string().required('Brand  is a required field'),
  manufacturer: Yup.string().required('Manufacturer is a required field'),
  unit_type: Yup.string().required('Unit type is a required field'),
  price: Yup.number()
    .required('Price is a required field')
    .positive('Price must be a positive number'),
  short_description: Yup.string()
    .required('Short description is a required field')
    .min(2, 'Short description must be at least 2 characters')
    .max(500),
  overview: Yup.string()
    .required('Overview is a required field')
    .min(2)
    .max(500),
  parent_category: Yup.string().required(),
  category: Yup.string(),
})

export { schema }
