const path = require('path')
const { getManifestJson } = require('../utils')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const buildConfig = () => {
  const manifestJson = getManifestJson()
  const libName = manifestJson.name
  return {
    entry: {
      [libName]: path.resolve('./.libraui/temp/build/index.js')
    },
    mode: 'development',
    output: {
      filename: 'index.js',
      path: path.resolve('dist'),
      libraryTarget: 'umd',
      library: '__[name]__',
      libraryExport: 'default',
      globalObject: 'this'
    },
    devtool: 'source-map',
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'index.css',
        chunkFilename: 'index.css'
      })
      // new OptimizeCSSAssetsPlugin({
      //     cssProcessorOptions: {
      //         safe: true,
      //         mergeLonghand: false,
      //         discardComments: { removeAll: true }
      //     },
      //     canPrint: true
      // }),
      // new TerserPlugin({
      //     cache: true,
      //     parallel: true,
      //     sourceMap: true
      // }),
    ]

  }
}

module.exports = buildConfig
