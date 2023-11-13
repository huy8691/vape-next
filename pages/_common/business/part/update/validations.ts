import { TFunction } from 'i18next'
import * as Yup from 'yup'

export const schema = (t: TFunction<['business'], undefined>) => {
  return Yup.object().shape(
    {
      business_name: Yup.string().required(t('business:validate.businessName')),
      website_link_url: Yup.string()
        .nullable()
        .notRequired()
        .when('website_link_url', {
          is: (value: string) => value?.length,
          then: (rule) =>
            rule.matches(
              /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
              t('business:validate.websiteLinkUrlIsNotCorrect')
            ),
        }),
      city: Yup.string().required(t('business:validate.city')),
      state: Yup.string().required(t('business:validate.state')),
      postal_zipcode: Yup.string().required(t('business:validate.postZipcode')),
      address: Yup.string()
        .required(t('business:validate.address.required'))
        .min(2, t('business:validate.address.min'))
        .max(500, t('business:validate.address.max')),
    },
    [
      // Add Cyclic deps here because when require itself
      ['website_link_url', 'website_link_url'],
    ]
  )
}
