const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin')
const getEntryList = () => {
  const res = {}
  res.view = path.resolve('./.libraui/temp/view/index.js')
  return res
}

const htmlConf = {
  filename: 'index.html',
  template: path.resolve('./.libraui/temp/view/index.html'),
  inject: 'body',
  hash: true
}

const devConfig = (port = 8090) => {
  const externals = {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
  return {
    entry: getEntryList(),
    output: {
      filename: 'index.js',
      path: path.resolve('./.libraui/server')
    },
    externals,
    mode: 'development',
    devtool: 'eval-source-map',
    plugins: [
      new OpenBrowserWebpackPlugin({ url: `http://localhost:${port}` }),
      new CleanWebpackPlugin(),
      new HtmlWebPackPlugin(htmlConf),
      new MiniCssExtractPlugin({
        filename: 'index.css',
        chunkFilename: 'index.css'
      })
    ]
  }
}

module.exports = devConfig
