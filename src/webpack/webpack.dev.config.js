const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin')
const { getTempDir } = require('../utils')
const getEntryList = () => {
  const res = {}
  res.view = path.resolve(`${getTempDir()}/temp/view/index.js`)
  return res
}

const htmlConf = {
  filename: 'index.html',
  template: path.resolve(`${getTempDir()}/temp/view/index.html`),
  inject: 'body',
  hash: true
}

const devConfig = (port = 8090, openBrowser = true) => {
  const externals = {
    react: 'React',
    'react-dom': 'ReactDOM'
  }
  const plugins = [
    new CleanWebpackPlugin(),
    new HtmlWebPackPlugin(htmlConf),
    new MiniCssExtractPlugin({
      filename: 'index.css',
      chunkFilename: 'index.css'
    })
  ]
  if (openBrowser) {
    plugins.push(new OpenBrowserWebpackPlugin({ url: `http://localhost:${port}` }))
  }
  return {
    entry: getEntryList(),
    output: {
      filename: 'index.js',
      path: path.resolve(`${getTempDir()}/server`)
    },
    externals,
    mode: 'development',
    devtool: 'eval-source-map',
    plugins
  }
}

module.exports = devConfig
