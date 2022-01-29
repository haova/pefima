module.exports = {
  ssr: false,
  router: {
    mode: 'hash'
  },
  buildModules: [
    '@nuxt/postcss8',
    '@nuxtjs/pwa',
  ],
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
  modules: [
    'nuxt-minimal-admin'
  ],
  pwa: {
    meta: {
      title: 'Pefima',
      author: 'Vu Anh Hao <hi@anhhao.me> (https://www.anhhao.me)',
    },
    manifest: {
      name: 'Pefima',
      lang: 'en',
      short_name: 'Pefima',
    }
  },
  css: [
    '~/assets/scss/main.scss'
  ]
}