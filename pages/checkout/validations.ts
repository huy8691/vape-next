import * as Yup from 'yup'

const schema = Yup.object().shape({
  address_name: Yup.string().required(),
  recipient_name: Yup.string().required(),
  address: Yup.string().required(),
  phone_number: Yup.string().required(),
  note: Yup.string().required(),
})

export { schema }
