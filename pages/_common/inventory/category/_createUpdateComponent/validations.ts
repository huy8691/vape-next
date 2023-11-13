import * as Yup from 'yup'
const schema = (t: any) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('validate.name.required'))
      .min(2, t('validate.name.min'))
      .max(50, t('validate.name.max'))
      .matches(/\S+/, t('validate.name.matches')),
    parent_category: Yup.string().nullable(),
  })
}
export { schema }
