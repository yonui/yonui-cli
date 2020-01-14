const outputCss = `* {
    box-sizing: border-box;
}

.demo-viewer{
    width: 1200px;
    margin: auto;
    background: #ffffff;
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
            padding: 5px;
            display: inline-block;
            min-height: 30px;
            width: 150px;
            text-align: center;
            margin: 5px;
            border-radius: 4px;
            &:hover{
                color: rgb(245, 60, 50);
                cursor: pointer;
                box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);

            }
            &-selected{
                color: rgb(245, 60, 50);
                box-shadow: 0 3px 5px rgba(0, 0, 0, 0.3);
            }
        }
    }
    .right-content{
        display: inline-block;
        width: calc(~'100% - 200px');
        min-height: 300px;
        vertical-align: top;
        padding: 10px;
        .content-item{
            margin-bottom: 10px;
            .content-title{
                font-size: 18px;
                color: rgba(66,66,66,1);
                line-height: 30px;
                &-btn{
                    float: right;
                }
            }
            .content-desc{
                font-size: 14px;
                color: rgba(66,66,66,1);
                line-height: 30px;
            }
            .content-demo{

            }
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