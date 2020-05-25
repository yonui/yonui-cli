const path = require('path')
const { getManifestJson, getLib, getLibraConfig, getTempDir, getPackageJson } = require('../utils')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BannerPlugin = require('webpack').BannerPlugin
const buildConfig = () => {
  const lib = getLib()
  const externals = {}
  lib.forEach(item => {
    externals[item.key] = item.value
  })
  const manifestJson = getManifestJson()
  const libraConfigJson = getLibraConfig()
  const { output, extraCss = true, outputConfig = {} } = libraConfigJson
  const libName = process.env.componentName ? process.env.componentName : manifestJson.name
  const mode = process.env.NODE_ENV
  const plugins = [
    new CleanWebpackPlugin(),
    // new SimpleProgressWebpackPlugin(),
    new BannerPlugin(`build time: ${new Date().toLocaleString()}\nversion: ${getPackageJson().version}`)
  ]
  if (extraCss) {
    plugins.push(new MiniCssExtractPlugin({
      filename: 'index.css',
      chunkFilename: 'index.css'
    }))
  }
  // if (mode === 'development') {
  //   plugins.push(
  //     new BundleAnalyzerPlugin({
  //       analyzerPort: 8080,
  //       generateStatsFile: false
  //     }))
  // }
  return {
    entry: {
      [libName]: path.resolve(`${getTempDir()}/temp/build/index.js`)
    },
    mode,
    externals,
    output: {
      filename: 'index.js',
      path: path.resolve(output.dist),
      libraryTarget: 'umd',
      library: '__[name]__',
      libraryExport: 'default',
      globalObject: 'this',
      ...outputConfig
    },
    devtool: 'source-map',
    plugins
  }
}

module.exports = buildConfig
