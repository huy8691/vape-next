import * as Yup from 'yup'

const validationSchema = Yup.object().shape({
  bronze_point: Yup.number()
    .integer('Points must be an integer')
    .min(0, 'Points must be greater than or equal to 0')
    .required('Bronze points is required')
    .typeError('Bronze points is required')
    .test(
      'bronze-point',
      'Bronze points must be lower than silver',
      function (value) {
        const silverPoints = this.resolve(Yup.ref('silver_point'))
        if (typeof silverPoints === 'number' && Number(value) >= silverPoints) {
          return this.createError({
            path: this.path,
            message: 'Bronze point must be lower than silver',
          })
        }
        return true
      }
    ),
  silver_point: Yup.number()
    .integer('Points must be an integer')
    .required('Silver points is required')
    .typeError('Silver points is required')
    .test(
      'silver-point',
      'Silver must be greater than bronze and lower than gold',
      function (value) {
        const bronzePoints = this.resolve(Yup.ref('bronze_point'))
        const goldPoints = this.resolve(Yup.ref('gold_point'))
        if (typeof goldPoints === 'number' && Number(value) >= goldPoints) {
          return this.createError({
            path: this.path,
            message: 'Silver point must be lower than gold points',
          })
        }
        if (typeof bronzePoints === 'number' && Number(value) <= bronzePoints) {
          return this.createError({
            path: this.path,
            message: 'Silver point must be greater than bronze point',
          })
        }

        return true
      }
    ),
  gold_point: Yup.number()
    .integer('Points must be an integer')
    .required('Gold points is required')
    .typeError('Gold points is required')
    .test(
      'gold-schema',
      'Gold points must be greater than silver and lower than platinum',
      function (value) {
        const silver_point: number = this.resolve(Yup.ref('silver_point'))
        const platinum_point: number = this.resolve(Yup.ref('platinum_point'))
        if (
          typeof platinum_point === 'number' &&
          Number(value) >= platinum_point
        ) {
          return this.createError({
            path: this.path,
            message: 'Gold point must be lower than platinum points',
          })
        }
        if (typeof silver_point === 'number' && Number(value) <= silver_point) {
          return this.createError({
            path: this.path,
            message: 'Gold point must be greater than silver point',
          })
        }

        return true
      }
    ),
  platinum_point: Yup.number()
    .integer('Points must be an integer')
    .required('Platinum points is required')
    .typeError('Platinum points is required')
    .test(
      'platinum-schema',
      'Platinum points must be greater than gold and lower than diamond',
      function (value) {
        const gold_point: number = this.resolve(Yup.ref('gold_point'))
        const diamond_point: number = this.resolve(Yup.ref('diamond_point'))
        if (
          typeof diamond_point === 'number' &&
          Number(value) >= diamond_point
        ) {
          return this.createError({
            path: this.path,
            message: 'Platinum point must be lower than diamond points',
          })
        }
        if (typeof gold_point === 'number' && Number(value) <= gold_point) {
          return this.createError({
            path: this.path,
            message: 'Platinum point must be greater than Gold point',
          })
        }

        return true
      }
    ),
  diamond_point: Yup.number()
    .integer('Points must be an integer')
    .required('Diamond points is required')
    .typeError('Diamond points is required')
    .test(
      'diamond-schema',
      'Diamond points must be greater than platinum',
      function (value) {
        const platinum_point: number = this.resolve(Yup.ref('platinum_point'))
        if (
          typeof platinum_point === 'number' &&
          Number(value) <= platinum_point
        ) {
          return this.createError({
            path: this.path,
            message: 'Diamond point must be greater than platinum point',
          })
        }

        return true
      }
    ),
})

export { validationSchema }
