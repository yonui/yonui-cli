const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { getDir, getLibraConfig } = require('./index');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fse = require('fs-extra');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
/**
 * 根据libra.config.js中的参数判断入口文件
 */
const getEntryList = (libName) => {
    const { sourcePath , bootList = true, suffixType} = getLibraConfig();
    let res = {};
   console.log('xxxx',suffixType)
    const compList = getDir(`${sourcePath}`, 'dir', {
        exclude: /(_style)|(_utils)/
    })
    // console.log(compList)
    const styleList = compList.map( item => {
        const res = path.resolve(`${sourcePath}/${item}/style/index.${suffixType}`);
        return res;
    })
    
    res[libName] = [path.resolve(`${sourcePath}/index.${suffixType}`),...styleList];
    // res['style'] = styleList;
    console.log(res);
    return res;
}

const buildConfig = () => {
    const manifestJson = fse.readJsonSync(path.resolve('./manifest.json'));
    const libName = manifestJson.name;
    return {
        entry: getEntryList(libName),
        mode: 'development',
        output: {
            filename: 'index.js',
            path: path.resolve('./.libraui/dist'),
            libraryTarget: "umd",
            library:'__[name]__',
            globalObject: 'this',
        },
        devtool: 'source-map',
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: 'index.css',
                chunkFilename: 'index.css'
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    safe: true,
                    mergeLonghand: false,
                    discardComments: { removeAll: true }
                },
                canPrint: true
            }),
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
        ],
        
    }
}



module.exports = buildConfig;
