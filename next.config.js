/** @type {import('next').NextConfig} */
const withPlugins = require('next-compose-plugins')
const withImages = require('next-images')
const withLess = require('next-with-less')
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    // limit of 25 deviceSizes values
    // deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // limit of 25 imageSizes values
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // limit of 50 domains values
    domains: [
      'develop-bizbookly.s3.ap-southeast-1.amazonaws.com',
      'vape-test.s3.ap-southeast-1.amazonaws.com',
      'images.pexels.com',
      'via.placeholder.com',
      'cdn.shopify.com',
      'product.hstatic.net',
    ],
    // path prefix for Image Optimization API, useful with `loader`
    path: '/_next/image',
    // loader can be 'default', 'imgix', 'cloudinary', 'akamai', or 'custom'
    loader: 'default',
    // disable static imports for image files
    disableStaticImages: false,
    // minimumCacheTTL is in seconds, must be integer 0 or more
    minimumCacheTTL: 60,
    // ordered list of acceptable optimized image formats (mime types)
    formats: ['image/webp'],
    // enable dangerous use of SVG images
    dangerouslyAllowSVG: false,
    // set the Content-Security-Policy header
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // the following are experimental features, and may cause breaking changes
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'],
  async redirects() {
    return [
      {
        source: '/products',
        destination: '/404',
        permanent: true,
      },
    ]
  },
  distDir: 'build',
}

module.exports = withPlugins(
  [
    [withImages],
    [
      withLess,
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
    ],
  ],
  nextConfig
)
