import * as Yup from 'yup'
const schema = Yup.object().shape({
  name: Yup.string()
    .required('Category name is a required field')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be at most 50 characters'),
  parent_category: Yup.number().nullable(),
})

const schemaSearch = Yup.object({
  search: Yup.string().required(),
})
export { schema, schemaSearch }
