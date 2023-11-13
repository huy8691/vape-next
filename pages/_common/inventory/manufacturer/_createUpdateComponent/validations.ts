import * as yup from 'yup'
const schema = (t: any) => {
  return yup.object().shape({
    name: yup
      .string()
      .required(t('validate.name.required'))
      .min(2, t('validate.name.min'))
      .max(50, t('validate.name.max'))
      .matches(/\S+/, t('validate.name.matches')),
    logo: yup.string().nullable(),
  })
}
export { schema }
