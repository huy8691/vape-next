import * as Yup from 'yup'
const phoneRegExp = /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/
import zipState from 'zip-state'
import { TFunction } from 'i18next'

const schema = (t: TFunction<['shipping'], undefined>) => {
  return Yup.object().shape({
    location: Yup.object().shape({
      address: Yup.string().required(t('shipping:validate.location.address')),
      latitude: Yup.number().typeError(
        t('shipping:validate.location.latitude') as string
      ),
      longitude: Yup.number().typeError(
        t('shipping:validate.location.longitude') as string
      ),
    }),
    phone_number: Yup.string()
      .required(t('shipping:validate.phoneNumber'))
      .matches(phoneRegExp, 'Phone number invalid'),
    receiver_name: Yup.string()
      .required(t('shipping:validate.receiverName.required'))
      .min(2, t('shipping:validate.receiverName.min'))
      .max(50, t('shipping:validate.receiverName.max'))
      .matches(/^(?!\s).*/, t('shipping:validate.receiverName.matches')),
    city: Yup.string()
      .required(t('shipping:validate.city.required'))
      .min(2, t('shipping:validate.city.min'))
      .max(500, t('shipping:validate.city.max')),
    state: Yup.object()
      .shape({
        name: Yup.string().required(t('shipping:validate.state.name')),
        abbreviation: Yup.string().required(
          t('shipping:validate.state.abbreviation')
        ),
      })
      .required(),
    postal_zipcode: Yup.string()
      .required(t('shipping:validate.postal_zipcode.required'))
      .min(5, t('shipping:validate.postal_zipcode.min'))
      .max(9, t('shipping:validate.postal_zipcode.max'))
      .test(
        'custom-validation',
        t('shipping:validate.postal_zipcode.test') as string,
        function (value) {
          if (value) return zipState(value) === this.parent?.state?.abbreviation
          return false
        }
      ),
    location_return: Yup.object().shape({
      address: Yup.string().required(t('shipping:validate.location.address')),
      latitude: Yup.number().typeError(
        t('shipping:validate.location.latitude') as string
      ),
      longitude: Yup.number().typeError(
        t('shipping:validate.location.longitude') as string
      ),
    }),
    phone_number_return: Yup.string()
      .required(t('shipping:validate.phoneNumber'))
      .matches(phoneRegExp, 'Phone number invalid'),
    receiver_name_return: Yup.string()
      .required(t('shipping:validate.receiverNameReturn.required'))
      .min(2, t('shipping:validate.receiverName.min'))
      .max(50, t('shipping:validate.receiverName.max'))
      .matches(/^(?!\s).*/, t('shipping:validate.receiverNameReturn.matches')),
    city_return: Yup.string()
      .required(t('shipping:validate.cityReturn.required'))
      .min(2, t('shipping:validate.cityReturn.min'))
      .max(500, t('shipping:validate.cityReturn.max')),
    state_return: Yup.object()
      .shape({
        name: Yup.string().required(t('shipping:validate.stateReturn.name')),
        abbreviation: Yup.string().required(
          t('shipping:validate.stateReturn.abbreviation')
        ),
      })
      .required(),
    postal_zipcode_return: Yup.string()
      .required(t('shipping:validate.postal_zipcode.required'))
      .min(5, t('shipping:validate.postalZipcodeReturn.min'))
      .max(9, t('shipping:validate.postalZipcodeReturn.max'))
      .test(
        'custom-validation',
        t('shipping:validate.postalZipcodeReturn.test') as string,
        function (value) {
          if (value)
            return zipState(value) === this.parent?.state_return?.abbreviation
          return false
        }
      ),
  })
}

export { schema }
