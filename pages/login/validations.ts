import * as yup from 'yup'

const schema = yup.object().shape({
  email: yup.string().email().max(255).required(),
  password: yup.string().required(),
  // .password('Password invalid'),
})

export { schema }
