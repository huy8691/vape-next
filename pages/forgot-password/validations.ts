import * as Yup from 'yup'
import { TFunction } from 'i18next'

const schema = (t: TFunction<['forgot-password']>) => {
  return Yup.object().shape({
    email: Yup.string()
      .email(t('forgot-password:invalidEmail'))
      .max(255)
      .required(t('forgot-password:emailIsARequiredField')),
  })
}
const schemaPassword = (t: TFunction<['forgot-password']>) => {
  return Yup.object().shape({
    new_password: Yup.string()
      .required(t('forgot-password:passwordIsRequired'))
      .min(8, t('forgot-password:mustContain_8Characters'))
      .matches(
        /^[^\s]+(\s+[^\s]+)*$/,
        t('forgot-password:notAllowSpaceAtTheFirstAndLastCharacter')
      ),
    confirmPassword: Yup.string()
      .required(t('forgot-password:confirmPassword'))
      .min(8, t('forgot-password:mustContain_8Characters'))
      .matches(
        /^[^\s]+(\s+[^\s]+)*$/,
        t('forgot-password:notAllowSpaceAtTheFirstAndLastCharacter')
      )
      .oneOf(
        [Yup.ref('new_password'), null],
        t('forgot-password:passwordsMustMatch')
      ),
  })
}

export { schema, schemaPassword }
