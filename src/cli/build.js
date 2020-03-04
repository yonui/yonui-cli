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
// 打包产出dist文件
const buildDist = () => {
  const distWebpackConfig = webpackMerge(baseConfig(), buildConfig())
  const demoWebpackConfig = webpackMerge(baseConfig(), demoConfig('build'))
  const compiler = webpack([distWebpackConfig, demoWebpackConfig])
  compiler.run((err) => {
    if (err) {
      console.error(err)
    } else {
      console.log('build dist and demo files success ')
      // buildLib()
      runGulp(['build']) //  产出lib文件和manifest.json
      buildExtra()
      fse.ensureDirSync(path.resolve('.libraui/demo/demo-view'))
      fse.copyFileSync(path.join(__dirname, '../../templates/demoView.html'), path.resolve('.libraui/demo/demo-view/index.html'))
    }
  })
}

// 产出lib文件
// const buildLib = () => {
//   // runGulp(['javascript','less','css','img']);
//   // const webpackConfig = webpackMerge(baseConfig(),lessConfig());
//   // const compiler = webpack(webpackConfig);
//   // compiler.run( (err, status) => {
//   //     if(err){
//   //         console.error(err);
//   //     }
//   //     else {
//   //         console.log('build lib file success ')
//   //     }
//   // })
//   runGulp(['build'])
// }

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
      writeResources('build') // write demo entry
      break
    }
    case 'lib': {
      runGulp(['build'])
      break
    }
    case 'manifest': {
      runGulp(['manifest']) // 产出manifest.json
      break
    }
    default : {
      writeBuildEntry()
      writeResources('build')
      buildDist()
    }
  }
}

module.exports = build
