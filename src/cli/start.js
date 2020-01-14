
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseConfig = require('../utils/webpack.base.config');
const devConfig = require('../utils/webpack.dev.config');
const writeJs = require('../utils/writeJs');
const writeHtml = require('../utils/writeHtml');
const writeLess = require('../utils/writeLess');
const writeResources = require('../utils/writeResources');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const { getLibraConfig } = require('../utils');
const express = require('express');
const app = new express();
const start = (flag = false) => {
    const { port = 8090, autoTemplate } = getLibraConfig();
    if (autoTemplate) {
        writeHtml();
        writeJs();
        writeLess();
        writeResources();
    }
    const webpackConfig = webpackMerge(baseConfig(), devConfig())
    const compiler = webpack(webpackConfig);
    if (flag) {
        compiler.run();
        return;
    }
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
    // 加载实例
    app.use(instance);
    // 热更新
    app.use(hotMiddleware(compiler));
    app.listen(port, () => {
        console.log(`start server at port ${port}`);
        console.log(`click to open : http://127.0.0.1:${port}`)
    });
}

module.exports = start;