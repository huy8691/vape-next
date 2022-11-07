import React from 'react'
// import Link from 'next/link'
// layout
import type { NextPageWithLayout } from 'pages/_app.page'

const Custom404: NextPageWithLayout = () => {
  return <div className="container">404</div>
}

export default Custom404

// import React, { useEffect, useState } from 'react'
// // import Link from 'next/link'
// // layout
// // layout
// import type { ReactElement } from 'react'
// import NestedLayout from 'src/layout/nestedLayout'
// import type { NextPageWithLayout } from 'pages/_app.page'

// const Custom404: NextPageWithLayout = () => {
//   // fix error when use next theme
//   const [mounted, setMounted] = useState(false)
//   useEffect(() => {
//     setMounted(true)
//   }, [])
//   if (!mounted) {
//     return null
//   }
//   // fix error when use next theme
//   return <div>404</div>
// }

// Custom404.getLayout = function getLayout(page: ReactElement) {
//   return <NestedLayout>{page}</NestedLayout>
// }
// export default Custom404
