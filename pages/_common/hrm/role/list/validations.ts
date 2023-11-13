import * as Yup from 'yup'

const schema = Yup.object().shape({
  search: Yup.string(),
})

export { schema }
