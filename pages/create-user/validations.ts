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

export { schema }
