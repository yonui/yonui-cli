# libraui/cli脚手架

## 简介
@libraui/cli是一个前端组件开发的脚手架工具，服务于组件组册中心。

## 下载
请确认你在本地全局安装了Node.js和ynpm，之后全局安装@libraui/cli
```
$ npm install @libraui/cli -g 
```

## 使用

- `libra init`
新建一个新的组件库工程

- `libra create <name>`
创建一个新的组件，name为必填项

- `libra start`
在各个组件的`demos`目录下编写demo后，可以使用该命令启动本地预览。

- `libra build`
构建项目，输出的`dist`目录下为整个组件库的编译压缩后的代码，`lib`目录下为每个组件转译之后的代码。