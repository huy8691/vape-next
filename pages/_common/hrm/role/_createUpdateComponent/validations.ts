import { TFunction } from 'i18next'
import * as Yup from 'yup'
const schema = (t: TFunction<['role'], undefined>) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('role:validate.name.required'))
      .min(2, t('role:validate.name.min'))
      .max(50, t('role:validate.name.max'))
      .matches(/\S+/, t('role:validate.name.matches')),
    parent_role: Yup.number()
      .nullable(true) // checking self-equality works for NaN, transforming it to null
      .transform((_, val) => (val === Number(val) ? val : null)),
  })
}
const schemaUpdate = (t: TFunction<['role'], undefined>) => {
  return Yup.object().shape({
    name: Yup.string()
      .required(t('role:validate.name.required'))
      .min(2, t('role:validate.name.min'))
      .max(50, t('role:validate.name.max'))
      .matches(/\S+/, t('role:validate.name.matches')),
  })
}
export { schema, schemaUpdate }
