export const objToStringParam = (obj: object) => {
  let str = ''
  for (const [key, val] of Object.entries(obj)) {
    if (val) {
      str += `${key}=${val}&`
    }
  }
  return str
}

export const isEmptyObject = (obj: object) => {
  return Object.entries(obj).length === 0 && obj.constructor === Object
}
