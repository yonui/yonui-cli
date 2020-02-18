const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { getDir, getLibraConfig,getEntryArr } = require('../utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const fse = require('fs-extra');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fse = require('fs-extra');
const getEntryList = () => {
    const entryArr = getEntryArr();
    const { sourcePath } = getLibraConfig();
    let res = {};
    entryArr.forEach( item => {
        res[item.split(sourcePath).pop()] = path.resolve(item+'/style/index.less');
    })
    res['_style'] = path.resolve(sourcePath+'/_style/index.less');
    return res;
}
const demoConfig = () => {
    
    return {
        entry: getEntryList(),
        mode: 'development',
        output: {
            filename: '.trash/index.js',
            path: path.resolve('./.libraui/lib'),
        },
        plugins: [
            // new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name]/index.css',
                chunkFilename: '[name]/index.css'
            }),
        ],
        
    }
}



module.exports = demoConfig;
