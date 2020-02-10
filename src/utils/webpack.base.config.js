const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { getLibraConfig } = require('./index');
const defaultLib = [{
    key: 'react',
    value: 'React',
    js: '//design.yonyoucloud.com/static/react/16.8.4/umd/react.production.min.js',
    css: '',
},
{
    key: 'react-dom',
    value: 'ReactDOM',
    js: '//design.yonyoucloud.com/static/react/16.8.4/umd/react-dom.production.min.js',
    css: ''
},]
module.exports = () => {
    // const entryList = getEntryList();
    const { lib,sourcePath } = getLibraConfig();
    let externals = {};
    lib.concat(defaultLib).forEach(item => {
        externals[item.key] = item.value;
    })
    // console.log('---------------------')
    // console.log(path.resolve(sourcePath,'_style'));
    return {
        // entry: entryList,

        externals: externals,
        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [ ".js",".ts", ".tsx", ".json"], // 影响import的优先级
            alias:{
                '_style': path.resolve(sourcePath,'_style'),
                '_utils': path.resolve(sourcePath,'_utils')
            }
        },
        module: {
            rules: [
                {
                    test: /\.[jt]s[x]?$/,
                    exclude: /(node_modules)/,
                    use: [
                        {
                            loader: require.resolve('babel-loader'),
                            options: {
                                presets: [
                                    require.resolve('@babel/preset-env'),
                                    require.resolve('@babel/preset-react'),
                                    require.resolve('@babel/preset-typescript')
                                    // require.resolve('babel-preset-stage-0'),
                                ],
                                "plugins": [
                                    [require.resolve('@babel/plugin-transform-modules-commonjs')],
                                    [require.resolve('@babel/plugin-proposal-class-properties'), { "legacy": true }],
                                    ["import", { "libraryName": "@libraui/base-mobile", "libraryDirectory": "lib/components"}, "@libraui/base-mobile"]
                                ]
                            }
                        },
                    ]
                },
                {
                    test: /\.(le|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: './'
                            }
                        },
                        require.resolve('css-loader'),
                        // require.resolve('postcss-loader'),
                        {
                            loader: require.resolve('less-loader'),
                            options: {
                                javascriptEnabled: true,
                            }
                        },
                    ]
                },
                {
                    test: /\.(png|jpg|jpeg|gif)(\?.+)?$/,
                    use: [{
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 81960000,
                            name: 'images/[name].[hash:8].[ext]',
                            //TODO 当publicPath=true 因为start.js webpack-dev-middleware 中配置了publicPath, 所以此处产出路径不在包含 context
                            // outputPath: commands._[0] === 'start' && !cfg.publicPath ? `${_context}assets/images/` : 'assets/images/',
                            // publicPath: `/${_context}assets/images`
                        }
                    }]
                }
            ]
        },


    }
}