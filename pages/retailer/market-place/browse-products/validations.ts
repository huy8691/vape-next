import * as yup from 'yup'

const schema = yup.object().shape({
  key: yup.string().max(50, 'Product name, code be at most 50 characters'),
})

export { schema }
