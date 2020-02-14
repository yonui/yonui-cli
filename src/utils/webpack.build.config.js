const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { getDir, getLibraConfig, getManifestJson } = require('./index');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fse = require('fs-extra');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
/**
 * 根据libra.config.js中的参数判断入口文件
 */

const buildConfig = () => {
    const manifestJson = getManifestJson();
    const libName = manifestJson.name;
    return {
        entry: {
            [libName]: path.resolve(`./.libraui/temp/build/index.js`)
        },
        mode: 'development',
        output: {
            filename: '[name].js',
            path: path.resolve('./.libraui/dist'),
            libraryTarget: "umd",
            library:'__[name]__',
            libraryExport: 'default',
            globalObject: 'this',
        },
        devtool: 'source-map',
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[name].css'
            }),
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
        ],
        
    }
}



module.exports = buildConfig;
