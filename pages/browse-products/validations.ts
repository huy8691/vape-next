import * as yup from 'yup'

const schema = yup.object().shape({
  key: yup.string().max(200, 'Key search must be at most 200 characters'),
  // .password('Password invalid'),
})

const schemaPrice = yup.object().shape({
  from: yup.number().required(),
  to: yup.number().required(),
})

export { schema, schemaPrice }
