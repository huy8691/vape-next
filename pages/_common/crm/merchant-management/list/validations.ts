import * as yup from 'yup'

const schema = yup.object().shape({
  search: yup.string().max(255),
})

const filterSchema = yup.object().shape({
  assignee: yup.array(),
})

const assignSeller = yup.object().shape({
  sellers: yup.array(),
})

export { schema, filterSchema, assignSeller }
