import * as yup from 'yup'
const schema = yup.object().shape({
  name: yup
    .string()
    .required('Manufacturer name is a required field')
    .min(2, 'Manufacturer name must be at least 2 characters')
    .max(50, 'Manufacturer name must be at most 50 characters')
    .matches(/\S+/, 'Invalid Manufacturer Name'),
  logo: yup.string(),
})
export { schema }
