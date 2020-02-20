const path = require('path')
const { getLibraConfig, getEntryArr } = require('../utils')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const getEntryList = () => {
  const entryArr = getEntryArr()
  const { sourcePath } = getLibraConfig()
  const res = {}
  entryArr.forEach(item => {
    res[item.split(sourcePath).pop()] = path.resolve(item + '/style/index.less')
  })
  res._style = path.resolve(sourcePath + '/_style/index.less')
  return res
}
const demoConfig = () => {
  return {
    entry: getEntryList(),
    mode: 'development',
    output: {
      filename: '.trash/index.js',
      path: path.resolve('lib')
    },
    plugins: [
      // new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name]/index.css',
        chunkFilename: '[name]/index.css'
      })
    ]

  }
}

module.exports = demoConfig
