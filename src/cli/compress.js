const zlib = require('zlib');
const fse = require('fs-extra');
const path = require('path');
const JSZip = require('jszip')




const compress = () => {

    console.log('未完成')
    // let zip = new JSZip();
    // const inp = fse.createReadStream(path.resolve('./index.tsx')) // 创建可读的流

    // const out = fse.createWriteStream('1.gz') //创建可写的流
    // const gzlib = zlib.createGzip() // 创建一个空的压缩包
    // inp.pipe( gzlib ).pipe( out );
}

module.exports = compress;