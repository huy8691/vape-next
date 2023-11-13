import * as Yup from 'yup'

const schema = Yup.object().shape({
  avatar: Yup.string(),
})

export { schema }
