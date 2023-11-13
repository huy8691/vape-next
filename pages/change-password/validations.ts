import * as Yup from 'yup'
import { TFunction } from 'i18next'

const schemaPassword = (t: TFunction<['change-password']>) => {
  return Yup.object().shape({
    password: Yup.string()
      .required(t('change-password:validate.password.required'))
      .min(8, t('change-password:validate.password.min'))
      .matches(/^\S(.*\S)?$/gm, t('change-password:validate.password.matches')),
    confirmPassword: Yup.string()
      .required('Confirm password is required')
      .min(8, t('change-password:validate.confirmPassword.min'))
      .oneOf(
        [Yup.ref('password'), null],
        t('change-password:validate.confirmPassword.oneOf')
      )
      .matches(
        /^\S(.*\S)?$/gm,
        t('change-password:validate.confirmPassword.matches')
      ),
  })
}

export { schemaPassword }
