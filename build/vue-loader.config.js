module.exports = {
  extractCSS: process.env.NODE_ENV === 'production',
  preserveWhitespace: false,
  postcss: [
    require('autoprefixer')({
            browsers: ['last 10 Chrome versions', 'ie > 9', 'last 5 Firefox versions', 'Safari >= 6', '> 1%']
    })
  ],
  loaders: {
      scss: ['vue-style-loader', 'css-loader', 'sass-loader'], // <style lang="scss">
      sass: ['vue-style-loader', 'css-loader', 'sass-loader'] // <style lang="sass">
  }
}
