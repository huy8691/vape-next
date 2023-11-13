import * as Yup from 'yup'

const schema = (t: any) => {
  return Yup.object().shape(
    {
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
      phone_number: Yup.string()
        .required(t('validate.phoneNumber.required'))
        .matches(
          /^\([2-9]{1}[0-9]{2}\)\s[0-9]{3}\s[0-9]{4}$/,
          t('validate.phoneNumber.matches')
        ),
      email: Yup.string().email(t('validate.email.email')),

      type_of_lead: Yup.number(),
      lead_other: Yup.string().when('type_of_lead', {
        is: 1,
        then: Yup.string()
          .required(t('validate.leadOther.required'))
          .matches(/\S+/, t('validate.leadOther.matches'))
          .min(2, t('validate.leadOther.min'))
          .max(255, t('validate.leadOther.max')),
      }),
      // lead_other: Yup.string().test('', '', function (value: any) {
      //   console.log('mmmmmmmmmmmmm', value, this.parent.type_of_lead)

      //   if (this.parent.type_of_lead == 1) {
      //     console.log('mmmmmmmmmmmmm', value)
      //     if (!value) {
      //       return this.createError({ message: 'Lead other is required' })
      //     }
      //   }
      //   return true
      // }),

      contact_type: Yup.number().required(t('validate.contactType')),
      contact_status: Yup.number().required(t('validate.contactStatus')),
      contact_option: Yup.number().required(t('validate.contactOption')),
      expected_revenue: Yup.number().transform((value) =>
        isNaN(value) || value === null || value === undefined ? 0 : value
      ),
    },
    [
      ['type_of_lead', 'type_of_lead'],
      ['email', 'email'],
      ['source', 'source'],
    ]
  )
}
const schemaUpdate = (t: any) => {
  return Yup.object().shape({
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
  })
}
export { schema, schemaUpdate }
