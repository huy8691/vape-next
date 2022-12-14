import * as Yup from 'yup'

const schema = Yup.object().shape({
  quantity: Yup.number().required().min(1).max(1000000),
})

export { schema }
