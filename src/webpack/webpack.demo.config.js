const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const fse = require('fs-extra')
const getEntryList = () => {
  const res = {}
  const demoList = fse.readJSONSync(path.resolve('./.libraui/temp/demo/demo-path.json'))
  demoList.map(item => {
    res[item] = path.resolve('./.libraui/temp/demo', `${item}.js`)
  })
  return res
}
const demoConfig = () => {
  return {
    entry: getEntryList(),
    mode: 'development',
    output: {
      filename: '[name]/index.js',
      path: path.resolve('./.libraui/demo')
    },
    devtool: 'source-map',
    plugins: [
      // new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name]/index.css',
        chunkFilename: '[name]/index.css'
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

module.exports = demoConfig
