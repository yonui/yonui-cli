const compressing = require('compressing');
const chalk = require('chalk');
const path = require('path');
const sourcePath = path.resolve('dist')
const targetPath = path.resolve('dist.zip')

compressing.zip.compressDir(sourcePath, targetPath)
  .then((data) => {
    console.log(chalk.yellow(`Tip: 文件压缩成功，已压缩至【${targetPath}】`));
  })
  .catch(err => {
    console.log('Tip: build zip fail');
    console.log(err)
  });
