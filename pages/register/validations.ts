import * as Yup from 'yup'

const phoneRegExp = /(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/

const schema = Yup.object().shape(
  {
    // email: Yup.string().email().max(255).required(),
    first_name: Yup.string().required(),
    last_name: Yup.string().required(),
    business_name: Yup.string().required(),
    phone_number: Yup.string()
      .required('Please enter your phone number')
      .max(10, 'Phone number is not valid')
      .matches(
        /^[2-9]{1}[0-9]{2}[0-9]{3}[0-9]{4}$/,
        'Phone number is not valid'
      ),
    // phone_number: Yup.string().required().matches(phoneRegExp),
    website_link_url: Yup.string()
      .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url!'
      )
      .required(),
    monthly_purchase: Yup.string().required(),
    // monthly_purchase_other: Yup.string().max(200),
    // monthly_purchase_other: Yup.string().when('monthly_purchase_other', {
    //   is: (exists: any) => !!exists,
    //   then: Yup.string().required(),
    //   otherwise: Yup.string(),
    // }),
    monthly_purchase_other: Yup.string().when('monthly_purchase', {
      is: '10',
      then: Yup.string().required().max(200),
    }),
    // monthly_purchase_other: Yup.string().when(
    //   'monthly_purchase',
    //   (val, schema) => {
    //     if (val===10) {
    //       console.log('value', val, schema)
    //       if (val.length > 0) {
    //         //if address exist then apply min max else not
    //         return Yup.string()
    //           .min(5, 'min 5')
    //           .max(255, 'max 255')
    //           .required('Required')
    //       } else {

    //       }
    //     } else {
    //       return Yup.string().notRequired()
    //     }
    //   }
    // ),

    monthly_sale: Yup.string().required(),
    // monthly_sale_other: Yup.string().max(200),
    monthly_sale_other: Yup.string().when('monthly_sale', {
      is: '10',
      then: Yup.string().required().max(200),
    }),
    type_of_sale: Yup.string().required(),
    // type_of_sale_other: Yup.string().max(200),
    type_of_sale_other: Yup.string().when('type_of_sale', {
      is: '6',
      then: Yup.string().required().max(200),
    }),
    total_locations: Yup.number()
      .integer()
      .min(0)
      .required()
      .transform((value) => (isNaN(value) ? undefined : value)),
    find_us_over: Yup.string().required(),
    find_us_over_other: Yup.string().when('find_us_over', {
      is: '5',
      then: Yup.string().required().max(200),
    }),
    id_verification: Yup.string().required(),
    payment_processing: Yup.string().required(),
    federal_tax_id: Yup.string().required().min(5).max(200),
    business_tax_document: Yup.string().required(),
    vapor_tobacco_license: Yup.string().required(),
    address: Yup.string().required(),
    city: Yup.string().required(),
    state: Yup.string().required(),
    postal_zipcode: Yup.number().integer().min(0),
    checkbox: Yup.bool().oneOf(
      [true],
      'You must accept the terms and conditions'
    ),
    // password: Yup.string()
    //   .required('Vui lòng nhập mật khẩu')
    //   .min(6, 'Mật khẩu ít nhất có 8 ký tự')
    //   // .matches(/^(?=.*[a-z])/, 'Phải chứa ít nhất một ký tự viết thường')
    //   .matches(/^(?=.*[A-Z])/, 'Phải chứa ít nhất một ký tự viết hoa')
    //   .matches(/^(?=.*[0-9])/, 'Phải chứa ít nhất một chữ số'),
    // .matches(/^(?=.*[!@#%&])/, 'Must contain at least one special character'),

    // dob: Yup.date()
    //   .required('Vui lòng nhập ngày sinh')
    //   .nullable()
    //   .default(undefined)
    //   .typeError('Invalid Date'),

    // phoneOtp: Yup.string().required('Vui lòng nhập mã OTP'),
    // gender: Yup.string().required('Vui lòng chọn giới tính'),
  },
  [['monthly_purchase_other', 'monthly_purchase_other']]
)

const schemaCheckMail = Yup.object().shape({
  email: Yup.string().email().max(255).required(),
})

export { schema, phoneRegExp, schemaCheckMail }
