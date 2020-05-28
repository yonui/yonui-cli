const gulp = require('gulp')
const path = require('path')
const { task, src, dest, series } = gulp
const gulpBabel = require('gulp-babel')
const gulpLess = require('gulp-less')
const { getLibraConfig, getTempDir } = require('../utils')
const replace = require('gulp-replace')
const { buildDist, buildDemo, buildDistAndDemo } = require('../webpack/runWebpack')
const writeResources = require('../utils/writeResources')
const writeBuildEntry = require('../utils/writeBuildEntry')
const writeManifest = require('../utils/writeManifest')
const sourcemaps = require('gulp-sourcemaps')
const { libPath, sourcePath, plugins, output, outputManifest = true } = getLibraConfig()
const basePath = `${libPath || sourcePath}/**/`
const resolve = (module) => require.resolve(module)
const jsSource = path.resolve(`${basePath}{style/,}*.{tsx,js}`)
const dist = path.resolve(output.lib)
const lessSource = path.resolve(`${basePath}{style,demos,}/*.{less,css}`)
const imgSource = path.resolve(`${basePath}{*.,*/*.}{png,jpg,gif,ico,svg}`)
const extraSource = path.resolve(`${basePath}{*.,*/*.}{html,eot,ttf,woff,woff2}`)
task('hello', done => {
  console.log('hello world')
  done()
})

// 转译js代码
task('javascript', () => {
  return src([jsSource, path.resolve(`${basePath}*.{ts,tsx,js,jsx}`)])
    .pipe(sourcemaps.init())
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
    .pipe(sourcemaps.write(''))
    .pipe(dest(dist))
})

task('es', () => {
  return src([jsSource, path.resolve(`${basePath}*.{ts,tsx,js,jsx}`)])
    .pipe(sourcemaps.init())
    .pipe(gulpBabel({
      presets: [
        [resolve('@babel/preset-env'), { modules: false }],
        resolve('@babel/preset-react'),
        resolve('@babel/preset-typescript')
      ],
      plugins: [
        ...plugins,
        [resolve('@babel/plugin-proposal-class-properties'), { legacy: true }]
      ]
    }))
    .pipe(sourcemaps.write(''))
    .pipe(dest(dist.replace(/lib$/, 'es')))
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

task('writeBuildEntry', (done) => {
  console.log('writeBuildEntry')
  writeBuildEntry()
  console.log('writeBuildEntry Done')
  done()
})

task('buildDist', () => {
  console.log('buildDist')
  return buildDist()
})

task('buildDemo', (done) => {
  console.log('buildDemo')
  return buildDemo()
})

task('buildDistAndDemo', (done) => {
  return buildDistAndDemo()
})

task('writeResources', (done) => {
  console.log('writeResources')
  writeResources()
  done()
})

task('manifest', (done) => {
  if (outputManifest) {
    console.log('manifest start')
    writeManifest()
    console.log('manifest done')
  } else {
    console.log('don\'t output manifest.json.')
  }
  done()
})
task('lib', series('javascript', 'es', 'less', 'img', 'extra'))
task('build', series('lib', 'writeBuildEntry', 'buildDist', 'manifest'))
task('build-all', series('lib', 'writeBuildEntry', 'writeResources', 'buildDistAndDemo', 'manifest'))
task('build-dist', series('writeBuildEntry', 'buildDist', 'manifest'))
