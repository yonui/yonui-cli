
const path = require('path')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('../webpack/webpack.base.config')
const devConfig = require('../webpack/webpack.dev.config')
const demoConfig = require('../webpack/webpack.demo.config')
const writeViewJs = require('../utils/writeViewJs')
const writeViewHtml = require('../utils/writeViewHtml')
const writeViewLess = require('../utils/writeViewLess')
const writeResources = require('../utils/writeResources')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')
const { getLibraConfig } = require('../utils')
const Express = require('express')
const app = new Express()

const buildDemo = () => {
  const webpackConfig = webpackMerge(baseConfig(), demoConfig())
  const compiler = webpack(webpackConfig)
  const instance = devMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    logTime: true,
    logLevel: 'info',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    stats: {
      colors: true,
      hash: false,
      children: false,
      chunks: false
    }
  })

  app.use(instance)
}
const start = (cmdPort) => {
  writeResources()
  buildDemo()
  const { autoTemplate, port } = getLibraConfig()
  if (autoTemplate) {
    writeViewHtml()
    writeViewJs()
    writeViewLess()
  }
  const _port = cmdPort || port
  const webpackConfig = webpackMerge(baseConfig(), devConfig(_port))
  const compiler = webpack(webpackConfig)
  const instance = devMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    logTime: true,
    logLevel: 'info',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    stats: {
      colors: true,
      hash: false,
      children: false,
      chunks: false
    }
  })

  app.use(Express.static(path.resolve('./static')))
  app.use(Express.static(path.resolve('./.libraui/demo')))
  // 加载实例
  app.use(instance)
  // 热更新
  app.use(hotMiddleware(compiler))
  app.listen(_port, () => {
    console.log(`start server at port ${_port}`)
  })
}

module.exports = start
