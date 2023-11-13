import * as Yup from 'yup'

const schema = (t: any) => {
  return Yup.object().shape(
    {
      content: Yup.string()
        .required(t('validate.content.required'))
        .test('', '', function (value: any) {
          const regex = /^\s*$/
          if (regex.test(value)) {
            console.log(regex.test(value))
            return this.createError({
              message: t('validate.content.invalid'),
            })
          }
          return true
        })
        .max(5000, t('validate.content.max'))
        .min(2, t('validate.content.min')),
    },
    [['content', 'content']]
  )
}
const schemaConvertContactToMerchant = (t: any) => {
  return Yup.object().shape(
    {
      email: Yup.string()
        .typeError(t('validate.email.typeError'))
        .required(t('validate.email.required'))
        .email(t('validate.email.email'))

        .required(t('validate.email.required')),
      phone_number: Yup.string()
        .required(t('validate.phoneNumber.required'))
        .matches(
          /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
          t('validate.phoneNumber.matches')
        ),
      first_name: Yup.string()
        .required(t('validate.firstName.required'))
        .matches(/^[a-zA-Z_]*$/, t('validate.firstName.matches'))
        .min(2, t('validate.firstName.min'))
        .max(50, t('validate.firstName.max')),
      last_name: Yup.string()
        .required(t('validate.lastName.required'))
        .matches(/\S+/, t('validate.lastName.matches1'))
        .matches(/^[a-zA-Z0-9\s]+$/, t('validate.lastName.matches2'))
        .matches(/^[a-zA-Z\s]+$/, t('validate.lastName.matches3'))
        .min(2, t('validate.lastName.min'))
        .max(50, t('validate.lastName.max')),
      business_name: Yup.string()
        .required(t('validate.businessName.required'))
        .matches(/\S+/, t('validate.businessName.required'))
        .min(2, t('validate.businessName.min'))
        .max(50, t('validate.businessName.max')),
      federal_tax_id: Yup.string()
        .required(t('validate.federalTaxId.required'))
        .matches(/\S+/, t('validate.federalTaxId.matches'))
        .min(5, t('validate.federalTaxId.min'))
        .max(200, t('validate.federalTaxId.max')),
      address: Yup.string()
        .required(t('validate.address.required'))
        .matches(/\S+/, t('validate.address.matches'))
        .min(2, t('validate.address.min'))
        .max(500, t('validate.address.max')),
      website_link_url: Yup.string()
        .notRequired()
        .when('website_link_url', {
          is: (value: string) => value?.length,
          then: (rule) =>
            rule.matches(
              /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
              t('validate.websiteLinkUrl')
            ),
        }),

      monthly_purchase: Yup.string().required(t('validate.monthlyPurchase')),
      monthly_purchase_other: Yup.string().when('monthly_purchase', {
        is: '1',
        then: Yup.string()
          .required(t('validate.monthlyPurchaseOther.required'))
          .max(200, t('validate.monthlyPurchaseOther.max'))
          .matches(/\S+/, t('validate.monthlyPurchaseOther.matches')),
      }),

      monthly_sale: Yup.string().required(t('validate.monthlySale')),
      monthly_sale_other: Yup.string().when('monthly_sale', {
        is: '1',
        then: Yup.string()
          .required(t('validate.type_of_sale_other.required'))
          .max(200, t('validate.type_of_sale_other.max'))
          .matches(/\S+/, t('validate.type_of_sale_other.matches')),
      }),
      type_of_sale: Yup.string().required(t('validate.type_of_sale')),
      type_of_sale_other: Yup.string().when('type_of_sale', {
        is: '1',
        then: Yup.string()
          .required(t('validate.type_of_sale_other.required'))
          .max(200, t('validate.type_of_sale_other.max'))
          .matches(/\S+/, t('validate.type_of_sale_other.matches')),
      }),
      total_locations: Yup.number()
        .required(t('validate.totalLocations.required'))
        .integer(t('validate.totalLocations.integer'))
        .min(0, t('validate.totalLocations.min'))
        .max(10000, t('validate.totalLocations.max'))
        .typeError(t('validate.totalLocations.typeError')),
      find_us_over: Yup.string().required(t('validate.findUsOver')),
      find_us_over_other: Yup.string().when('find_us_over', {
        is: '1',
        then: Yup.string()
          .required(t('validate.findUsOverOther.required'))
          .matches(/\S+/, t('validate.findUsOverOther.matches'))
          .max(200, t('validate.findUsOverOther.max')),
      }),
      id_verification: Yup.string().required(t('validate.idVerification')),
      payment_processing: Yup.string().required(
        t('validate.paymentProcessing')
      ),
      sub_address: Yup.string()
        .notRequired()
        .nullable()
        .when('address2', {
          is: (value: string) => value?.length,
          then: (rule) =>
            rule
              .min(2, t('validate.sudAddress.min'))
              .max(255, t('validate.sudAddress.max'))
              .matches(/\S+/, t('validate.sudAddress.matches')),
        }),
      city: Yup.string()
        .required(t('validate.city.required'))
        .matches(/\S+/, t('validate.city.matches'))
        .min(2, t('validate.city.min'))
        .max(100, t('validate.city.max')),
      state: Yup.string()
        .required(t('validate.state.required'))
        .matches(/\S+/, t('validate.state.matches'))
        .min(2, t('validate.state.min'))
        .max(100, t('validate.state.max')),
      // zipcode: Yup.number().notRequired().nullable(),
      postal_zipcode: Yup.string()
        .required(t('validate.postalZipcode.required')) // optional
        .length(5, t('validate.postalZipcode.length')) // optional as well
        .matches(/[0-9]+/gi, t('validate.postalZipcode.matches'))
        .matches(/\S+/, t('validate.postalZipcode.invalid')),
    },
    [
      ['sub_address', 'sub_address'],
      ['website_link_url', 'website_link_url'],
    ]
  )
}
export { schema, schemaConvertContactToMerchant }
