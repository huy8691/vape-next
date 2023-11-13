import React from 'react'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html data-theme="light">
      <Head />
      {/* <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDqJSGdEAuuq5SBbDmuAaQN4VQgkWl9Vr0"></script> */}
      <link rel="manifest" href="/manifest.json" />
      <meta
        httpEquiv="Content-Security-Policy"
        content="upgrade-insecure-requests"
      ></meta>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
