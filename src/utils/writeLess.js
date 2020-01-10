const outputCss = `* {
    box-sizing: border-box;
}
.demo-viewer{
    .viewer-title{
        color: #313131;
        font-size: 28px;
        padding: 20px;
    }
    .left-nav{
        display: inline-block;
        width: 180px;
        min-height: 300px;
        vertical-align: top;
        padding: 10px;
        border-right: 1px solid #f5f5f5;
        .left-nav-item{
            padding-left: 5px;
            &:hover{
                color: rgb(245, 60, 50);
                cursor: pointer;
            }
            &-selected{
                color: rgb(245, 60, 50);
            }
        }
    }
    .right-content{
        display: inline-block;
        width: calc(~'100vw - 200px');
        min-height: 300px;
        vertical-align: top;
        padding: 10px;
        .content-item{
            margin-bottom: 10px;
        }
    }
}`;
const fse = require('fs-extra');
const path = require('path');

const writeCss = () => {
    const outputFile = path.resolve('./.libraui/temp/temp.less');
    fse.outputFileSync(outputFile, outputCss)
    console.log('write less file at',outputFile);
}

module.exports = writeCss;