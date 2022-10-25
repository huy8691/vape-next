import * as Yup from 'yup'

const schema = Yup.object().shape(
  {
    // email: Yup.string().email().max(255).required(),
    first_name: Yup.string()
      .required('First name is a required field')
      .max(50, 'First name must be at most 50 characters')
      .min(2, 'First name must be at least 2 characters')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
    last_name: Yup.string()
      .required('Last name is a required field')
      .max(50, 'Last name must be at most 50 characters')
      .min(2, 'Last name must be at least 2 characters')
      .matches(/^[aA-zZ\s]+$/, 'Only alphabets are allowed for this field '),
    business_name: Yup.string()
      .required('Business name is a required field')
      .max(50, 'Business name must be at most 50 characters')
      .min(2, 'Business name must be at least 2 characters'),
    phone_number: Yup.string()
      .required('Phone number is a required field')
      .min(10, 'Phone number is not valid')
      .matches(
        /^[2-9]{1}[0-9]{2}[0-9]{3}[0-9]{4}$/,
        'Phone number is not valid'
      ),
    website_link_url: Yup.string()
      .required('Website link URL is a required field')
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Website link URL is not correct'
      )
      .required(),
    monthly_purchase: Yup.string().required('This field is required'),
    monthly_purchase_other: Yup.string().when('monthly_purchase', {
      is: '1',
      then: Yup.string()
        .required('This field is required')
        .max(200, 'Must be at most 200 characters'),
    }),

    monthly_sale: Yup.string().required('This field is required'),
    monthly_sale_other: Yup.string().when('monthly_purchase', {
      is: '1',
      then: Yup.string()
        .required('This field is required')
        .max(200, 'Must be at most 200 characters'),
    }),
    type_of_sale: Yup.string().required('This field is required'),
    type_of_sale_other: Yup.string().when('type_of_sale', {
      is: '1',
      then: Yup.string()
        .required('This field is required')
        .max(200, 'Must be at most 200 characters'),
    }),
    total_locations: Yup.number()
      .required('This field is required')
      .min(0, 'Min value 0.')
      .typeError('The field should have digits only'),
    find_us_over: Yup.string().required('This field is required'),
    find_us_over_other: Yup.string().when('find_us_over', {
      is: '1',
      then: Yup.string()
        .required('This field is required')
        .max(200, 'Must be at most 200 characters'),
    }),
    id_verification: Yup.string().required('This field is required'),
    payment_processing: Yup.string().required('This field is required'),
    federal_tax_id: Yup.string()
      .required('Federal tax ID is a required field')
      .max(200, 'Federal tax ID must be at most 200 characters')
      .min(5, 'Federal tax ID must be at least 5 characters'),
    business_tax_document: Yup.string().required('This field is required'),
    vapor_tobacco_license: Yup.string().required('This field is required'),
    address: Yup.string().required('This field is required'),
    city: Yup.string().required('This field is required'),
    state: Yup.string()
      .required('This field is required')
      .min(2, 'State must be at least 2 characters'),
    // postal_zipcode: Yup.number().integer().min(0),
    postal_zipcode: Yup.number()
      .required('Zip code is a required field') // optional
      .typeError('Zip code can only be a number') // optional as well
      .test(
        'len',
        'Zip code needs to be excatly 5 digits',
        (val: any) => val.toString().length === 5
      ),
    checkbox: Yup.bool().oneOf(
      [true],
      'You must accept the terms and conditions'
    ),
  },
  [['monthly_purchase_other', 'monthly_purchase_other']]
)

const schemaCheckMail = Yup.object().shape({
  email: Yup.string().email().max(255).required('Email is a required field'),
})

export { schema, schemaCheckMail }
