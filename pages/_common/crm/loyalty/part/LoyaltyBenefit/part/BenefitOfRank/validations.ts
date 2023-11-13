import * as Yup from 'yup'

export const schema = Yup.object().shape({
  discount_value: Yup.number()
    .typeError('Discount value is required')
    .required('Discount value is required')
    .min(5 / 10, 'Discount value must be between 0.5% and 100%')
    .max(100, 'Discount value must be between 0.5% and 100%'),
  points_earning_value: Yup.number()
    .typeError('Point earning value is required')
    .required('Point earning value is required')
    .min(5 / 10, 'Point earning value must be between 0.5% and 100%')
    .max(100, 'Point earning value must be between 0.5% and 100%'),
})

// export const schemaCustomBenefit = Yup.object().shape(
//   {
//     items: Yup.array().of(
//       Yup.object().shape({
//         benefit_name: Yup.string()
//           .notRequired()
//           .nullable()
//           .when('benefit_name', {
//             is: (value: string) => value?.length,
//             then: (rule) =>
//               rule
//                 .min(5, 'Benefit name must be between 5 and 5000 characters')
//                 .max(
//                   5000,
//                   'Benefit name must be between 5 and 5000 characters'
//                 ),
//           }),
//       })
//     ),
//   }
//
// )
