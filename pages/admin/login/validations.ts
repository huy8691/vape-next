import { TFunction } from 'i18next'
import * as yup from 'yup'

const schema = (t: TFunction<['common', 'login'], undefined>) => {
  return yup.object().shape({
    email: yup
      .string()
      .email(t('login:validate.email.invalid'))
      .max(255)
      .required(t('login:validate.email.required')),
    password: yup
      .string()
      .required(t('login:validate.password.required'))
      .min(8, t('login:validate.password.min'))
      .matches(/^[^\s]+(\s+[^\s]+)*$/, t('login:validate.password.matches')),
  })
}

export { schema }
