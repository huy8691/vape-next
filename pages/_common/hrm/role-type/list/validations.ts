import * as yup from 'yup'

const schema = yup.object().shape({
  search: yup.string().max(255),
})

export { schema }
