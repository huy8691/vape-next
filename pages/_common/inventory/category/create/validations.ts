import * as Yup from 'yup'
const schema = Yup.object().shape({
  name: Yup.string()
    .required('Category name is a required field')
    .min(2, 'Category name must be at least 2 characters')
    .max(50, 'Category name must be at most 50 characters')
    .matches(/\S+/, ' Invalid Category Name'),
  parent_category: Yup.number().nullable(),
})
export { schema }
