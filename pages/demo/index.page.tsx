import React, { ReactElement } from 'react'
import UploadImage from 'src/components/uploadImage'
import NestedLayout from 'src/layout/nestedLayout'

const Demo = () => {
  return <UploadImage />
}

Demo.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout>{page}</NestedLayout>
}
export default Demo
