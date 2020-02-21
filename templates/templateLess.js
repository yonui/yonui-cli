module.exports = `
* {
    box-sizing: border-box;
}

.demo-viewer{
    width: 1200px;
    margin: auto;
    background: #ffffff;
    .viewer-title{
        padding: 0 20px;
        &-name{
            color: #313131;
            font-size: 28px;

        }
        &-keyword{
            margin: 0 0 0 5px;
        }
        &-version{
            margin-left: 5px;
            top: -8px;
            line-height: 14px;
        }
        &-desc{
            color: #313131;
            font-size: 14px;
            line-height: 30px;
        }
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
                box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);

            }
            &-selected{
                color: rgb(245, 60, 50);
                box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
            }
        }
    }
    .right-content{
        display: inline-block;
        width: calc(~'100% - 200px');
        min-height: 300px;
        vertical-align: top;
        padding: 10px;
        .right-content-type{
            text-align: center;
            margin: 5px;
        }
        .content-item{
            margin-bottom: 10px;
            border: 1px solid #F0F0F0;
            padding: 16px 16px 0;
            border-radius: 6px;
            box-shadow: 0 1px 5px rgba(0, 0, 0, 0.3);
            color: #424242;
            .content-title{
                font-size: 18px;
                color: rgba(66,66,66,1);
                line-height: 30px;
                cursor: pointer;
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
                margin: 5px;
                width: 375px;
                height: 667px;
                border: 1px solid #000000;
                background: #eee;
                overflow: auto;
            }
            .content-extra-icon{
                text-align: center;
            }
        }
    }
}

`;
