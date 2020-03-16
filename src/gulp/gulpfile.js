const gulp = require('gulp')
const path = require('path')
const { task, src, dest, series, parallel } = gulp
const gulpBabel = require('gulp-babel')
const gulpLess = require('gulp-less')
const { getLibraConfig, getTempDir } = require('../utils')
const replace = require('gulp-replace')
const { libPath, sourcePath, plugins, output } = getLibraConfig()
const basePath = `${libPath || sourcePath}/**/`
const resolve = (module) => require.resolve(module)
const jsSource = path.resolve(`${basePath}{style/,}*.{tsx,js}`)
const dist = path.resolve(output.lib)
const lessSource = path.resolve(`${basePath}{style,demos,}/*.{less,css}`)
const imgSource = path.resolve(`${basePath}{*.,*/*.}{png,jpg,gif,ico,svg}`)
const extraSource = path.resolve(`${basePath}{*.,*/*.}{html,eot,ttf,woff,woff2}`)
const writeManifest = require('../utils/writeManifest')
task('hello', done => {
  console.log('hello world')
  done()
})

// 转译js代码
task('javascript', () => {
  console.log('javascript')
  return src([jsSource, path.resolve(`${basePath}*.{ts,tsx,js,jsx}`)])
    .pipe(gulpBabel({
      presets: [
        resolve('@babel/preset-env'),
        resolve('@babel/preset-react'),
        resolve('@babel/preset-typescript')
      ],
      plugins: [
        ...plugins,
        [resolve('@babel/plugin-transform-modules-commonjs')],
        [resolve('@babel/plugin-proposal-class-properties'), { legacy: true }]
      ]
    }))
    .pipe(dest(dist))
})

// 复制less文件
task('less', () => {
  return src(lessSource)
  // .pipe(gulpLess())
    .pipe(dest(dist))
})

// less生成css文件
task('css', () => {
  console.log('css')
  return src(path.resolve(`${getTempDir()}/temp/less/**/*.less`))
    .pipe(gulpLess({
      javascriptEnabled: true,
      paths: [path.resolve('node_modules'), path.resolve(`${getTempDir()}/temp/less`)]
    }))
    .pipe(dest(dist))
})

task('changeLess', () => {
  return src([path.resolve('src/components/**/*.less'), path.resolve('src/components/**/*.css')])
    .pipe(replace(/(~_style)|~antd-mobile/gi, (match) => {
      console.log('----    ', match)
      switch (match) {
        case '~antd-mobile': {
          return 'antd-mobile'
        }
        case '~_style': {
          return '_style'
        }
        default: {
          return match
        }
      }
    }))
    .pipe(dest(path.resolve(`${getTempDir()}/temp/less`)))
})

// 复制图片文件
task('img', () => {
  return src(imgSource)
    .pipe(dest(dist))
})

// 复制其他文件
task('extra', () => {
  return src(extraSource)
    .pipe(dest(dist))
})

task('manifest', () => {
  writeManifest()
})
task('lib', parallel('javascript', 'less', 'img', 'extra'))
task('build', series('lib', 'manifest'))
