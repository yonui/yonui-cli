const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseConfig = require('../utils/webpack.base.config');
const buildConfig = require('../utils/webpack.build.config');
const runGulp = require('../gulp/index');

// 打包产出dist文件
const buildDist = () => {
    const webpackConfig = webpackMerge(baseConfig(),buildConfig());
    const compiler = webpack(webpackConfig);
    compiler.run( (err, status) => {
        console.log(status);
    })
}

// 产出lib文件
const buildLib = () => {
    runGulp(['javascript','less','css','img']);
}

// 产出其他文件，如package.json等
const buildExtra = () => {
    runGulp(['extra'])
}

const build = () => {
    buildDist(); 
    buildLib(); 
    buildExtra();
}

module.exports = build;