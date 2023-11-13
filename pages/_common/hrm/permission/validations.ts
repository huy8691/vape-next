import * as Yup from 'yup'

const schemaUpdate = Yup.object().shape({
  search: Yup.string().max(255),
})
export { schemaUpdate }
