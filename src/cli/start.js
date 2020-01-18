
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseConfig = require('../utils/webpack.base.config');
const devConfig = require('../utils/webpack.dev.config');
const writeViewJs = require('../utils/writeViewJs');
const writeViewHtml = require('../utils/writeViewHtml');
const writeViewLess = require('../utils/writeViewLess');
const writeResources = require('../utils/writeResources');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const demoConfig = require('../utils/webpack.demo.config');
const { getLibraConfig } = require('../utils');
const express = require('express');
const app = new express();

const buildDemo = () => {
    
    const webpackConfig = webpackMerge(baseConfig(),demoConfig());
    const compiler = webpack(webpackConfig);
    compiler.run( (err, status) => {
        // console.log(status);
    })
}
const start = (port) => {
    writeResources();
    buildDemo();
    const { autoTemplate } = getLibraConfig();
    if (autoTemplate) {
        writeViewHtml();
        writeViewJs();
        writeViewLess();
    }
    const webpackConfig = webpackMerge(baseConfig(), devConfig(port))
    const compiler = webpack(webpackConfig);
    console.log('xxx')
    // if (flag) {
    //     console.log('flag')
    //     compiler.run();
    //     return;
    // }
    const instance = devMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        logTime: true,
        logLevel: "info",
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        stats: {
            colors: true,
            hash: false,
            children: false,
            chunks: false
        }
    });

    app.use(express.static(path.resolve('./static')));
    app.use(express.static(path.resolve('./.libraui/demo')));
    // 加载实例
    app.use(instance);
    // 热更新
    app.use(hotMiddleware(compiler));
    app.listen(port, () => {
        console.log(`start server at port ${port}`);
    });
}

module.exports = start;