/**
 * @type {import('next-i18next').UserConfig}
 */

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    fallbackLng: 'en',
    // preload: ['en', 'es'],
    // debug: true,
  },
  // localePath:
  //   typeof window === 'undefined'
  //     ? require('path').resolve('./public/locales')
  //     : '/locales',
  reloadOnPrerender: true,
}
