const path = require('path')
const fse = require('fs-extra')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const buildConfig = require('./webpack.build.config')
const demoConfig = require('./webpack.demo.config')
const { getTempDir, logger } = require('../utils')

const buildDist = (param) => {
  return new Promise((resolve, reject) => {
    runWebpack(buildConfig())
      .then(() => {
        console.log('build dist done')
        resolve()
      })
  })
}

const buildDemo = (param) => {
  if (param === 'build') {
    runWebpack(demoConfig('build'))
      .then(() => {
        console.log('build demo successfully')
      })
  } else {
    runWebpack(demoConfig(), 'watch')
  }
  fse.ensureDirSync(path.resolve(`${(getTempDir())}/demo/demo-view`))
  fse.copyFileSync(path.join(__dirname, '../../templates/demoView.html'), path.resolve(`${getTempDir()}/demo/demo-view/index.html`))
}

const buildDistAndDemo = (param) => {
  return new Promise((resolve, reject) => {
    runWebpack([buildConfig(), demoConfig(param)])
      .then(() => {
        fse.ensureDirSync(path.resolve(`${getTempDir()}/demo/demo-view`))
        fse.copyFileSync(path.join(__dirname, '../../templates/demoView.html'), path.resolve(`${getTempDir()}/demo/demo-view/index.html`))
        console.log('build dist and demos successfully ')
        resolve()
      })
  })
}

const runWebpack = (extraConfig, mode = 'run') => {
  return new Promise((resolve, reject) => {
    let webpackConfig
    if (Array.isArray(extraConfig)) {
      webpackConfig = extraConfig.map(item => webpackMerge(baseConfig(), item))
    } else {
      webpackConfig = webpackMerge(baseConfig(), extraConfig)
    }
    const compiler = webpack(webpackConfig)
    switch (mode) {
      case 'watch': {
        compiler.watch({
          // watchOptions 示例
          aggregateTimeout: 300,
          poll: undefined
        }, () => {
          console.log('update at', Date.now())
        })
        break
      }
      case 'run': {
        compiler.run((err, status) => {
          // console.log('errors:\n', status.compilation ? status.compilation.errors : '')
          logger.error(status.compilation ? status.compilation.errors : '')
          // console.log('warnings:\n', status.compilation ? status.compilation.warnings : '')
          logger.warnning(status.compilation ? status.compilation.warnings : '')

          if (err) {
            console.error(err)
          } else {
            resolve()
          }
        })
        break
      }
    }
  })
}

module.exports = {
  buildDist,
  buildDemo,
  buildDistAndDemo,
  runWebpack
}
