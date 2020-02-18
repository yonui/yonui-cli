const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { getDir, getLibraConfig } = require('../utils');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const fse = require('fs-extra');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const fse = require('fs-extra');
const getEntryList = () => {
//     const { sourcePath , bootList = true, suffixType} = getLibraConfig();
//     let res = {};
//    console.log('xxxx',suffixType)
//     const compList = getDir(`${sourcePath}`, 'dir', {
//         exclude: /(_style)|(_utils)/
//     })
//     // console.log(compList)
//     const styleList = compList.map( item => {
//         const res = path.resolve(`${sourcePath}/${item}/style/index.${suffixType}`);
//         return res;
//     })
    
//     res[libName] = [path.resolve(`${sourcePath}/index.${suffixType}`),...styleList];
//     // res['style'] = styleList;
//     console.log(res);
//     return res;
    // const demoList = getDir(`./.libraui/temp/demo`,'file',{
    //     exclude: /json/
    // })
    // let res = {};
    // demoList.map( item => {
    //     res[item.replace(/\.js/,'')] = path.resolve(`./.libraui/temp/demo/${item}`);
    // })
    let res = {};
    const demoList = fse.readJSONSync(path.resolve('./.libraui/temp/demo/demo-path.json'));
    demoList.map( item => {
        res[item] = path.resolve('./.libraui/temp/demo',`${item}.js`)
    })
    return res;
}
const demoConfig = () => {
    
    return {
        entry: getEntryList(),
        mode: 'development',
        output: {
            filename: '[name]/index.js',
            path: path.resolve('./.libraui/demo'),
        },
        devtool: 'source-map',
        plugins: [
            // new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name]/index.css',
                chunkFilename: '[name]/index.css'
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



module.exports = demoConfig;
