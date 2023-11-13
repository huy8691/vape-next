import * as yup from 'yup'

const schema = yup.object().shape({
  name: yup.string().max(255),
})

export { schema }
