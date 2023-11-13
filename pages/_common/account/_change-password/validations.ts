import * as Yup from 'yup'
import { TFunction } from 'i18next'

const schemaPassword = (t: TFunction<['account'], undefined>) =>
  Yup.object().shape({
    current_password: Yup.string()
      .required(t('account:validate.required'))
      .min(8, t('account:validate.min'))
      .matches(/^[^\s]+(\s+[^\s]+)*$/, t('account:validate.matches')),
    new_password: Yup.string()
      .required(t('account:validate.required'))
      .min(8, t('account:validate.min'))
      .matches(/^[^\s]+(\s+[^\s]+)*$/, t('account:validate.matches'))
      .notOneOf(
        [Yup.ref('curr_password'), null],
        'New password must not same as current password.'
      ),
    confirm_password: Yup.string()
      .required(t('account:validate.required'))
      .min(8, t('account:validate.min'))
      .matches(/^[^\s]+(\s+[^\s]+)*$/, t('account:validate.matches'))
      .oneOf([Yup.ref('new_password'), null], t('account:validate.matches')),
  })

export { schemaPassword }
