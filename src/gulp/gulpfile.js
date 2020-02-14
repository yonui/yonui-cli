const gulp = require('gulp');
const path = require('path');
const { task, src, dest, series, parallel } = gulp;
const gulpBabel = require('gulp-babel');
const gulpLess = require('gulp-less');
const { getLibraConfig } = require('../utils')
const replace = require('gulp-replace');
// const gulpRename = require('gulp-rename');
// const gulpCleanCss = require('gulp-clean-css');
const { sourcePath } = getLibraConfig();
const basePath = `${sourcePath}/*/`;
const resolve = (module) => require.resolve(module);
const jsSource = path.resolve(`${basePath}{*,style/*}.{tsx,js}`);
const dist = path.resolve('./.libraui/lib');
const lessSource = path.resolve(`${basePath}{style/,}index.less`);
const imgSource = path.resolve(`${basePath}{*.,*/*.}{png,jpg,gif,ico}`)
const extraSource = path.resolve('./{package.json,*.md}');
const writeManifest = require('../utils/writeManifest');
task('hello', done => {
    console.log('hello world');
    done();
});

// 转译js代码
task('javascript', done => {
    return src([jsSource,path.resolve(`${sourcePath}/**/*.{tsx,js}`)])
        .pipe(gulpBabel({
            "presets": [
                resolve("@babel/preset-env"),
                resolve("@babel/preset-react"),
                resolve("@babel/preset-typescript")
            ],
            "plugins": [
                [resolve('@babel/plugin-transform-modules-commonjs')],
                [resolve('@babel/plugin-proposal-class-properties'), { "legacy": true }]
            ]
        }))
        .pipe(dest(dist));
})

// 复制less文件
task('less', done => {
    return src(lessSource)
        // .pipe(gulpLess())
        .pipe(dest(dist));
})

// less生成css文件
task('css', done => {
    return src(lessSource)
        .pipe(replace('~_style',path.resolve(sourcePath,'_style')) )
        .pipe(gulpLess({'javascriptEnabled':true}))
        .pipe(dest(dist))
})

// 复制图片文件
task('img', done => {
    return src(imgSource)
        .pipe(dest(dist))
})

// 复制package.json文件
task('extra',done => {
    return src(extraSource)
    .pipe(dest(path.resolve('./.libraui')))
})

task('manifest', done => {
    writeManifest();
    done();
})
task('build', parallel(series('javascript','manifest'),'less', 'css', 'img'));
