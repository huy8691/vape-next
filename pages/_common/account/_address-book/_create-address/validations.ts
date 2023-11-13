import { TFunction } from 'i18next'
import * as Yup from 'yup'
const phoneRegExp = /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/

import zipState from 'zip-state'
const schema = (t: TFunction<['account'], undefined>) =>
  Yup.object().shape({
    name: Yup.string()
      .required(t('account:validate.required'))
      .min(2, t('account:validate.name.min'))
      .max(50, t('account:validate.name.max'))
      .matches(/^(?!\s).*/, t('account:validate.name.matches')),
    phone_number: Yup.string()
      .required(t('account:validate.required'))
      .matches(phoneRegExp, t('account:validate.phoneNumber.matches')),
    address: Yup.string()
      .required(t('account:validate.required'))
      .min(2, t('account:validate.address.min'))
      .max(255, t('account:validate.address.max'))
      .matches(/^(?!\s).*/, t('account:validate.address.matches')),
    receiver_name: Yup.string()
      .required(t('account:validate.required'))
      .min(2, t('account:validate.receiverName.min'))
      .max(50, t('account:validate.receiverName.max'))
      .matches(/^(?!\s).*/, t('account:validate.receiverName.matches')),
    city: Yup.string()
      .required(t('account:validate.required'))
      .min(2, t('account:validate.city.min'))
      .max(500, t('account:validate.city.max')),
    state: Yup.object()
      .shape({
        name: Yup.string().required(t('account:validate.required')),
        abbreviation: Yup.string().required(t('account:validate.required')),
      })
      .required(),
    postal_zipcode: Yup.string()
      .required(t('account:validate.required'))
      .min(5, t('account:validate.postalZipcode.min'))
      .max(10, t('account:validate.postalZipcode.max'))
      .test(
        'custom-validation',
        t('account:validate.postalZipcode.test'),
        function (value) {
          if (value) return zipState(value) === this.parent?.state?.abbreviation
          return false
        }
      ),
  })

export { schema }
