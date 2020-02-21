const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// const fse = require('fs-extra')
const getEntryList = () => {
  const res = {}
  const demoList = require(path.resolve('./.libraui/temp/demo/demo-path.json'))
  demoList.map(item => {
    res[item] = path.resolve('./.libraui/temp/demo', `${item}.js`)
  })
  return res
}
const demoConfig = (param) => {
  const externals = {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
  const prod = param === 'build'
  const mode = prod ? 'production' : 'development'
  const devtool = prod ? 'source-map' : 'eval-source-map'
  return {
    entry: getEntryList(),
    mode,
    externals,
    output: {
      filename: '[name]/index.js',
      path: path.resolve('./.libraui/demo')
    },
    devtool,
    plugins: [
      // new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name]/index.css',
        chunkFilename: '[name]/index.css'
      })
      // new SimpleProgressWebpackPlugin()
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

module.exports = demoConfig
