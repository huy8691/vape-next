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
  child_category: Yup.number().when('category', {
    is: '2',
    then: Yup.number().required(),
  }),
})

const brandSchema = Yup.object().shape({
  name: Yup.string()
    .required('Brand is a required field')
    .min(2, 'Brand name must be at least 2 characters')
    .max(50, 'Brand name must be at most 50 characters'),
})

const manufacturerSchema = Yup.object().shape({
  name: Yup.string()
    .required('Manufacturer is a required field')
    .min(2, 'Manufacturer must be at least 2 characters')
    .max(50, 'Manufacturer must be at most 50 characters'),
})

const categorySchema = Yup.object().shape({
  name: Yup.string()
    .required('Category is a required field')
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be at most 50 characters'),
  parent_category: Yup.string().nullable(),
  child_category: Yup.string().nullable(),
})
export { schema, brandSchema, manufacturerSchema, categorySchema }
