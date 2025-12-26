const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    client: {
      overlay: false
    },
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8101',
        changeOrigin: true
      }
    }
  }
})
