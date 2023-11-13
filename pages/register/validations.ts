import * as Yup from 'yup'
import zipState from 'zip-state'

const schema = (t: any) => {
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
      phone_number: Yup.string()
        .matches(
          /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
          t('validate.businessName.matches')
        )
        .required(t('validate.businessName.required')),
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

      monthly_purchase: Yup.string().required(t('validate.required')),
      monthly_purchase_other: Yup.string().when('monthly_purchase', {
        is: '1',
        then: Yup.string()
          .required(t('validate.required'))
          .max(200, t('validate.monthlyPurchaseOther.max'))
          .matches(/\S+/, t('validate.monthlyPurchaseOther.matches')),
      }),

      monthly_sale: Yup.string().required(t('validate.required')),
      monthly_sale_other: Yup.string().when('monthly_sale', {
        is: '1',
        then: Yup.string()
          .required(t('validate.required'))
          .max(200, t('validate.monthlySaleOther.max'))
          .matches(/\S+/, t('validate.monthlySaleOther.matches')),
      }),
      type_of_sale: Yup.string().required(t('validate.required')),
      type_of_sale_other: Yup.string().when('type_of_sale', {
        is: '1',
        then: Yup.string()
          .required(t('validate.required'))
          .max(200, t('validate.typeOfSaleOther.max'))
          .matches(/\S+/, t('validate.typeOfSaleOther.matches')),
      }),
      total_locations: Yup.number()
        .required(t('validate.required'))
        .integer(t('validate.totalLocations.integer'))
        .min(0, t('validate.totalLocations.min'))
        .max(10000, t('validate.totalLocations.max'))
        .typeError(t('validate.totalLocations.typeError')),
      find_us_over: Yup.string().required(t('validate.required')),
      find_us_over_other: Yup.string().when('find_us_over', {
        is: '1' || '6',
        then: Yup.string()
          .required(t('validate.required'))
          .matches(/\S+/, t('validate.findUsOverOther.matches'))
          .max(200, t('validate.findUsOverOther.max')),
      }),
      id_verification: Yup.string().required(t('validate.required')),
      payment_processing: Yup.string().required(t('validate.required')),
      federal_tax_id: Yup.string()
        .required(t('validate.federalTaxId.required'))
        .max(200, t('validate.federalTaxId.max'))
        .min(5, t('validate.federalTaxId.min'))
        .matches(/\S+/, t('validate.federalTaxId.matches')),
      business_tax_document: Yup.string().required(t('validate.required')),
      vapor_tobacco_license: Yup.string().required(t('validate.required')),
      address: Yup.string()
        .required(t('validate.required'))
        .matches(/\S+/, t('validate.address.matches'))
        .min(2, t('validate.address.min'))
        .max(255, t('validate.address.max')),
      address2: Yup.string()
        .notRequired()
        .nullable()
        .when('address2', {
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
      state: Yup.object()
        .shape({
          name: Yup.string().required(t('validate.required')),
          abbreviation: Yup.string().required(t('validate.required')),
        })
        .required(),
      // postal_zipcode: Yup.number().integer().min(0),
      // postal_zipcode: Yup.number()
      //   .required('Zip code is a required field') // optional
      //   .typeError('Zip code can only be a number') // optional as well
      //   .test(
      //     'len',
      //     'Zip code needs to be exactly 5 digits',
      //     (val: any) => val.toString().length === 5
      //   ),

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
      organization_refferal: Yup.string()
        .notRequired()
        .nullable()
        .when('organization_refferal', {
          is: (value: any) => {
            return value
          },
          then: (rule) =>
            rule
              .min(5, t('validate.organizationRefferal.min'))
              .max(255, t('validate.organizationRefferal.max')),
        }),
      checkbox: Yup.bool().oneOf([true], t('validate.checkbox.bool')),
    },
    [
      ['monthly_purchase_other', 'monthly_purchase_other'],
      ['address2', 'address2'],
      ['website_link_url', 'website_link_url'],
      ['organization_refferal', 'organization_refferal'],
    ]
  )
}
const schemaCheckMail = (t: any) => {
  return Yup.object().shape({
    email: Yup.string()
      .email(t('validate.email.invalid'))
      .max(255)
      .required(t('validate.email.required')),
  })
}

export { schema, schemaCheckMail }
