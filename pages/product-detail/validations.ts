import * as yup from 'yup'

const schema = yup.object().shape({
  number: yup.string().required(),
  // .password('Password invalid'),
})

export { schema }
