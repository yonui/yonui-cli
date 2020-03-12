
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
const fse = require('fs-extra')
const { getLibraConfig, getIp } = require('../utils')
const Express = require('express')
const app = new Express()

const buildDemo = () => {
  const webpackConfig = webpackMerge(baseConfig(), demoConfig())
  const compiler = webpack(webpackConfig)
  compiler.watch({
    // watchOptions 示例
    aggregateTimeout: 300,
    poll: undefined
  }, () => {
    // 在这里打印 watch/build 结果...
    console.log('update')
  })
  fse.ensureDirSync(path.resolve('.libraui/demo/demo-view'))
  fse.copyFileSync(path.join(__dirname, '../../templates/demoView.html'), path.resolve('.libraui/demo/demo-view/index.html'))
}
const start = (cmdPort, openBrowser) => {
  const { autoTemplate, port, output } = getLibraConfig()
  const _port = cmdPort || port
  const _ip = getIp()
  process.env.devPort = _port
  process.env.devIp = _ip
  writeResources()
  buildDemo()
  if (autoTemplate) {
    writeViewHtml()
    writeViewJs()
    writeViewLess()
  }

  const webpackConfig = webpackMerge(baseConfig(), devConfig(_port, openBrowser))
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
  app.use(Express.static(path.resolve(output.demo)))
  // 加载实例
  app.use(instance)
  // 热更新
  app.use(hotMiddleware(compiler))
  app.listen(_port, () => {
    console.log(`start server at 127.0.0.1:${_port}`)
  })
}

module.exports = start
