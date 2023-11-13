import * as Yup from 'yup'

const schema = Yup.object().shape({
  name: Yup.string().required('Name is a required field'),
})

export { schema }
