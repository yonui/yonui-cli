const path = require('path')
const fse = require('fs-extra')
const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const buildConfig = require('./webpack.build.config')
const demoConfig = require('./webpack.demo.config')
// const devConfig = require('./webpack.dev.config')
const runGulp = require('../gulp/index')
const { getTempDir } = require('../utils')

const buildDist = (param, callback) => {
  runWebpack(buildConfig(), () => {
    runGulp('manifest') //  产出manifest.json
    console.log('build dist successfully')
  })
}

const buildDemo = (param, callback) => {
  if (param === 'build') {
    runWebpack(demoConfig('build'), () => {
      console.log('build demo successfully')
    })
  } else {
    runWebpack(demoConfig(), () => {
      console.log('update at', Date.now())
    }, 'watch')
  }
  fse.ensureDirSync(path.resolve(`${(getTempDir())}/demo/demo-view`))
  fse.copyFileSync(path.join(__dirname, '../../templates/demoView.html'), path.resolve(`${getTempDir()}/demo/demo-view/index.html`))
}

const buildDistAndDemo = (param, callback) => {
  runWebpack([buildConfig(), demoConfig(param)], () => {
    runGulp('build') //  产出lib文件和manifest.json
    fse.ensureDirSync(path.resolve(`${getTempDir()}/demo/demo-view`))
    fse.copyFileSync(path.join(__dirname, '../../templates/demoView.html'), path.resolve(`${getTempDir()}/demo/demo-view/index.html`))
    console.log('build dist and demos successfully ')
  })
}

const runWebpack = (extraConfig, callback, mode = 'run') => {
  let webpackConfig
  if (Array.isArray(extraConfig)) {
    webpackConfig = extraConfig.map(item => webpackMerge(baseConfig(), item))
  } else {
    webpackConfig = webpackMerge(baseConfig(), extraConfig)
  }
  const compiler = webpack(webpackConfig)
  switch (mode) {
    case 'get': {
      return compiler
    }
    case 'watch': {
      compiler.watch({
        // watchOptions 示例
        aggregateTimeout: 300,
        poll: undefined
      }, () => {
        callback && callback()
      })
      break
    }
    case 'run': {
      compiler.run((err, status) => {
        console.log(status)
        if (err) {
          console.error(err)
        } else {
          callback && callback()
        }
      })
      break
    }
  }
}

module.exports = {
  buildDist,
  buildDemo,
  buildDistAndDemo,
  runWebpack
}
