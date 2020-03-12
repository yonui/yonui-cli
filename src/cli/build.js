const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const runGulp = require('../gulp/index')
const baseConfig = require('../webpack/webpack.base.config')
const buildConfig = require('../webpack/webpack.build.config')
const demoConfig = require('../webpack/webpack.demo.config')
// const lessConfig = require('../webpack/webpack.less2css.config');
const writeResources = require('../utils/writeResources')
const writeBuildEntry = require('../utils/writeBuildEntry')
const path = require('path')
const fse = require('fs-extra')

// 产出dist文件
const buildDist = () => {
  const distWebpackConfig = webpackMerge(baseConfig(), buildConfig())
  const compiler = webpack(distWebpackConfig)
  compiler.run((err) => {
    if (err) {
      console.error(err)
    } else {
      console.log('build dist successfully')
      runGulp('manifest') //  产出manifest.json
      buildExtra()
    }
  })
}

// 产出demo文件
const buildDemo = () => {
  const demoWebpackConfig = webpackMerge(baseConfig(), demoConfig('build'))
  const compiler = webpack(demoWebpackConfig)
  compiler.run((err) => {
    if (err) {
      console.error(err)
    } else {
      console.log('build demo successfully')
      fse.ensureDirSync(path.resolve('.libraui/demo/demo-view'))
      fse.copyFileSync(path.join(__dirname, '../../templates/demoView.html'), path.resolve('.libraui/demo/demo-view/index.html'))
    }
  })
}

// 产出dist和demo
const buildDistAndDemo = () => {
  const distWebpackConfig = webpackMerge(baseConfig(), buildConfig())
  const demoWebpackConfig = webpackMerge(baseConfig(), demoConfig('build'))
  const compiler = webpack([distWebpackConfig, demoWebpackConfig])
  compiler.run((err) => {
    if (err) {
      console.error(err)
    } else {
      console.log('build dist and demos successfully ')
      runGulp('build') //  产出lib文件和manifest.json
      buildExtra()
      fse.ensureDirSync(path.resolve('.libraui/demo/demo-view'))
      fse.copyFileSync(path.join(__dirname, '../../templates/demoView.html'), path.resolve('.libraui/demo/demo-view/index.html'))
    }
  })
}
// 产出其他文件，如package.json等
const buildExtra = () => {
  // runGulp(['extra'])
  // copyFile('./package.json','./.libraui/package.json');
  // copyFile('./README.md','./.libraui/README.md');
}

const build = (arg) => {
  switch (arg) {
    case 'entry': {
      writeBuildEntry()
      writeResources() // write demo entry
      break
    }
    case 'lib': {
      runGulp('lib')
      break
    }
    case 'dist': {
      writeBuildEntry()
      buildDist()
      break
    }
    case 'demo': {
      writeResources()
      buildDemo()
      break
    }
    default : {
      writeBuildEntry()
      writeResources()
      buildDistAndDemo()
    }
  }
}

module.exports = build
