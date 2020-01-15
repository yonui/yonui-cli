const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OpenBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const { getLibraConfig } = require('./index');
const getEntryList = () => {
    let res = {};
    res.view = path.resolve('./.libraui/temp/temp.js');
    return res;
}

const htmlConf = {
    filename: `index.html`,
    // template: path.join(__dirname, '../templates/view.html'),
    template: path.resolve('./.libraui/temp/temp.html'),
    inject: 'body',
    // chunks: ["index"],
    hash: true
};



const devConfig = () => {
    const { port = 8090 } = getLibraConfig();
    return {
        entry: getEntryList(),
        output: {
            filename: 'index.js',
            path: path.resolve('./.libraui/server')
        },
        mode: 'development',
        devtool: 'inline-source-map',
        plugins: [
            new OpenBrowserWebpackPlugin({url: `http://localhost:${port}`}),
            new CleanWebpackPlugin(),
            new HtmlWebPackPlugin(htmlConf),
            new MiniCssExtractPlugin({
                filename: 'index.css',
                chunkFilename: 'index.css'
            }),
        ],
    }
}



module.exports = devConfig;