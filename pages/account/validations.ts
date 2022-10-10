import * as Yup from 'yup'
const schema = Yup.object().shape({
  fullName: Yup.string().required('Vui lòng nhập tên đăng nhập của bạn'),
  email: Yup.string()
    .email('Email không đúng')
    .max(255)
    .required('Vui lòng nhập email'),
  dob: Yup.date()
    .required('Vui lòng nhập ngày sinh')
    .nullable()
    .default(undefined),
  gender: Yup.string().required('Vui lòng chọn giới tính'),
})

const schemaPassword = Yup.object().shape({
  currentPassword: Yup.string().required('Vui lòng nhập mật khẩu cũ'),
  newPassword: Yup.string().required('Vui lòng nhập mật khẩu mới'),
  passwordConfirmation: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    .oneOf([Yup.ref('newPassword'), null], 'Mật khẩu không khớp'),
})

export { schema, schemaPassword }
