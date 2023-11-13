import * as Yup from 'yup'

const schema = Yup.object().shape({
  reason: Yup.string()
    .required('Reason is required')
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason must be at most 500 characters')
    .matches(/\S+/, 'Reason invalid'),
})

export { schema }
