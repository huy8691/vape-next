import { TFunction } from 'i18next'
import * as Yup from 'yup'
import zipState from 'zip-state'
const schema = (t: TFunction<['register-supplier']>) => {
  return Yup.object().shape(
    {
      // email: Yup.string().email().max(255).required(),
      first_name: Yup.string()
        .required(t('validate.firstName.required'))
        .max(50, t('validate.firstName.max'))
        .min(2, t('validate.firstName.min'))
        .matches(/^[aA-zZ\s]+$/, t('validate.firstName.matches'))
        .matches(/\S+/, t('validate.firstName.invalid')),
      last_name: Yup.string()
        .required(t('validate.lastName.required'))
        .max(50, t('validate.lastName.max'))
        .min(2, t('validate.lastName.min'))
        .matches(/^[aA-zZ\s]+$/, t('validate.lastName.matches'))
        .matches(/\S+/, t('validate.lastName.invalid')),
      business_name: Yup.string()
        .required(t('validate.businessName.required'))
        .max(50, t('validate.businessName.max'))
        .min(2, t('validate.businessName.min'))
        .matches(/\S+/, t('validate.businessName.matches')),
      business_phone_number: Yup.string()
        .matches(
          /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
          t('validate.businessName.matches')
        )
        .required(t('validate.businessName.required')),
      address: Yup.string()
        .required(t('validate.required'))
        .matches(/\S+/, t('validate.address.matches'))
        .min(2, t('validate.address.min'))
        .max(255, t('validate.address.max')),
      sub_address: Yup.string()
        .notRequired()
        .nullable()
        .when('address_line2', {
          is: (value: string) => value?.length,
          then: (rule) =>
            rule
              .min(2, t('validate.address2.min'))
              .max(255, t('validate.address2.max'))
              .matches(/\S+/, t('validate.address2.matches')),
        }),
      city: Yup.string()
        .required(t('validate.required'))
        .matches(/\S+/, t('validate.city.matches'))
        .min(2, t('validate.city.min'))
        .max(100, t('validate.city.max')),
      website_link_url: Yup.string()
        .notRequired()
        .when('website_link_url', {
          is: (value: string) => value?.length,
          then: (rule) =>
            rule.matches(
              /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
              t('validate.websiteLinkUrl.matches')
            ),
        }),
      state: Yup.object()
        .shape({
          name: Yup.string().required(t('validate.required')),
          abbreviation: Yup.string().required(t('validate.required')),
        })
        .required(),
      postal_zipcode: Yup.string()
        .required(t('validate.postalZipcode.required')) // optional
        // .length(5, 'Zip code needs to be exactly 5 digits') // optional as well
        .min(5, t('validate.postalZipcode.min'))
        .max(9, t('validate.postalZipcode.max'))
        .matches(/[0-9]+/gi, t('validate.postalZipcode.matches09'))
        .matches(/\S+/, t('validate.postalZipcode.matches'))
        .test(
          'custom-validation',
          t('validate.postalZipcode.test'),
          function (value) {
            if (value)
              return zipState(value) === this.parent?.state?.abbreviation
            return false
          }
        ),

      business_tax_document: Yup.string().required(t('validate.required')),
      vapor_tobacco_license: Yup.string().required(t('validate.required')),
      poc_first_name: Yup.string()
        .required(t('validate.firstName.required'))
        .max(50, t('validate.firstName.max'))
        .min(2, t('validate.firstName.min'))
        .matches(/^[aA-zZ\s]+$/, t('validate.firstName.matches'))
        .matches(/\S+/, t('validate.firstName.invalid')),
      poc_last_name: Yup.string()
        .required(t('validate.lastName.required'))
        .max(50, t('validate.lastName.max'))
        .min(2, t('validate.lastName.min'))
        .matches(/^[aA-zZ\s]+$/, t('validate.lastName.matches'))
        .matches(/\S+/, t('validate.lastName.invalid')),
      owner_email: Yup.string()
        .email(t('validate.email.invalid'))
        .max(255)
        .required(t('validate.email.required')),
      poc_email: Yup.string()
        .email(t('validate.email.invalid'))
        .max(255)
        .required(t('validate.email.required')),
      poc_phone_number: Yup.string()
        .matches(
          /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
          t('validate.businessName.matches')
        )
        .required(t('validate.businessName.required')),
      name_on_account: Yup.string()
        .required(t('validate.firstName.required'))
        .max(50, t('validate.firstName.max'))
        .min(2, t('validate.firstName.min'))
        .matches(/^[aA-zZ\s]+$/, t('validate.firstName.matches'))
        .matches(/\S+/, t('validate.firstName.invalid')),
      bank_name: Yup.string()
        .required(t('validate.firstName.required'))
        .max(50, t('validate.firstName.max'))
        .min(2, t('validate.firstName.min'))
        .matches(/^[aA-zZ\s]+$/, t('validate.firstName.matches'))
        .matches(/\S+/, t('validate.firstName.invalid')),
      bank_address: Yup.string()
        .required(t('validate.required'))
        .matches(/\S+/, t('validate.address.matches'))
        .min(2, t('validate.address.min'))
        .max(255, t('validate.address.max')),
      account_number: Yup.string()
        .required(t('validate.accountNumber.required'))
        .matches(/[0-9]+/gi, t('validate.accountNumber.matches'))
        .min(1, t('validate.accountNumber.min'))
        .max(25, t('validate.accountNumber.max')),
      bank_phone_number: Yup.string()
        .matches(
          /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
          t('validate.businessName.matches')
        )
        .required(t('validate.businessName.required')),
      routing_number: Yup.string()
        .required(t('validate.routingNumber.required'))
        .min(1, t('validate.routingNumber.min'))
        .max(25, t('validate.routingNumber.max')),
      checkbox: Yup.bool().oneOf([true], t('validate.checkbox.bool')),
      shipping_services: Yup.array()
        .test('items', t('validate.shippingServices.min'), (value: any) => {
          console.log('🚀 ~ file: validations.ts:148 ~ .test ~ value:', value)
          return value.length > 1 || value[0] !== ''
        })
        .min(1, t('validate.shippingServices.min'))
        .required(t('validate.shippingServices.min')),
      // name_shipping: Yup.string().required('This field is required'),
      name_shipping: Yup.string().when('shipping_services', {
        is: (value: any) =>
          value.filter((item: any) => item === 'OTHER').length > 0,
        then: Yup.string().required(t('validate.shippingServices.min')),
        // .matches(/\S+/, t('validate.findUsOverOther.matches'))
        // .max(200, t('validate.findUsOverOther.max')),
      }),
      federal_tax_id: Yup.string()
        .required(t('validate.federalTaxId.required'))
        .matches(/\S+/, t('validate.federalTaxId.matches'))
        .min(5, t('validate.federalTaxId.min'))
        .max(200, t('validate.federalTaxId.max')),
      phone_number: Yup.string()
        .matches(
          /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
          t('validate.businessName.matches')
        )
        .required(t('validate.businessName.required')),
    },
    [
      ['website_link_url', 'website_link_url'],
      ['address_line2', 'address_line2'],
      [' owner_email', ' owner_email'],
      ['poc_email', 'poc_email'],
      ['poc_phone_number', 'poc_phone_number'],
      ['owner_phone_number', 'owner_phone_number'],
      ['bank_phone_number', 'bank_phone_number'],
    ]
  )
}
const schemaCheckMail = (t: TFunction<['register-supplier']>) => {
  return Yup.object().shape({
    email: Yup.string()
      .email(t('validate.email.invalid'))
      .max(255)
      .required(t('validate.email.required')),
  })
}

export { schema, schemaCheckMail }
