# libraui-cli 命令行工具

### 安装

全局安装libraui-cli命令行工具

```js
$ npm install libraui-cli -g
```

安装成功后，在命令行中输入`libra -v`可以查看版本。如下：

```js
$ libra -v
0.0.1
```

### 命令

`libraui-cli`命令行工具支持以下命令：

- `libra init` 

  在当前目录创建一个新的工程。在输入该命令后，将进入一个交互状态，提示输入工程名称等信息。

- `libra create <name>`

  进入工程目录，输入该命令可在`./components`目录下创建一个新的组件，组件名称`<name>`为必填项。

- `libra start`

  在工程目录，输入该命令可将编写的demo打包并在浏览器中预览。

- `libra build`

  在工程目录，输入该命令可将组件代码打包成以下资源：

  - `dist/` 整个组件库打包压缩后的代码。
  - `lib/` 各个组件源码经过babel转译后的资源，可在源码中引入并使用。
  - `demo/` 组件的demo文件打包后的代码，按组件为单元划分，用于注册中心中的组件预览页面。
  - 其他如 `package.json` `readme.md`等文件

- `libra compress` 

  在构建完成后，使用该命令将打包后的多个资源压缩成一个文件`result.tgz`，位于项目根目录，以供后续发布使用。

### 工程目录结构

```js
├── README.md
├── components	// 组件库源码目录
│   ├── Button
│   │   ├── Button.js // 组件实现代码
│   │   ├── README.md // 组件的描述、api说明等
│   │   ├── demos // demo文件目录
│   │   ├── img	// 图片资源目录
│   │   ├── index.js // 组件对外暴露的出口
│   │   └── style // 组件样式目录
│   │       ├── index.js // 样式的导入导出，无需修改
│   │       └── index.less // 组件样式
│   ├── _style  // 公共样式目录
│   │   └── index.less // 定义样式变量、编写公共样式等
│   └── _utils  // 公共方法目录
├── libra.config.json // 开发配置文件
├── manifest.json // 组件库描述文件
├── package.json
├── static // 静态资源目录
│   └── hightlight
│       ├── highlight.pack.js
│       └── styles
└── tsconfig.json
```

### 文件说明

#### libra.config.json

描述组件库在开发过程中的相关配置。

| 字段名称     | 说明                                                         | 默认值         |
| ------------ | ------------------------------------------------------------ | -------------- |
| port         | 启动本地预览时的端口号                                       | "8090"         |
| autoTemplate | 启动本地预览时，是否自动生成预览框架                         | true           |
| sourcePath   | 组件库中组件源码所在目录                                     | "./components" |
| type         | 组件库使用的是js代码还是ts代码                               | "js"           |
| lib          | 组件库依赖的组件库，在此配置后将在构建中排除，并可通过配置加入cdn地址以在预览时引入 | []             |
| extraImport  | 本地预览时额外导入的js/css文件                               | -              |

其中，工具中已经默认将react、react-dom作为依赖库，且不可修改，如对`react`的描述为：

```json
{
	"key": "react", // 对应webpack中externals属性的key值
  "value": "React", // 对应webpack中externals属性的value值
  "js": "//design.yonyoucloud.com/static/react/16.8.4/umd/react.production.min.js",  // 在本地预览时js代码的cdn地址
  "css": "",  // 在本地预览时css代码的cdn地址
}
```

extraImport属性中js和css属性的值均为字符串形式，需要注意对引号的转译，示例如下：

```js
{
  "js": "<script src=\"//design.yonyoucloud.com/static/console-polyfill/console-polyfill.js\"></script><script src=\"//design.yonyoucloud.com/static/es5-shim/es5-shim.min.js\"></script>",
  "css": "<link href=\"./index.css\" rel=\"stylesheet\">"
}
```

#### manifest.json

描述了组件库整体的信息

| 字段名称    | 说明                                                         |
| ----------- | ------------------------------------------------------------ |
| name        | 开发的组件库的名称，且在组件打包后可以通过`__[name]__`的形式注入到全局对象中 |
| version     | 组件库的版本                                                 |
| keyword     | 组件库的关键字                                               |
| description | 对组件库的描述、介绍                                         |
| components  | 描述了组件库中打包后组件的结构。可通过此属性灵活配置需要打包的组件、组件的结构关系。 |

一个文件示例如下：

```json
{
    "name":"Libra",
    "version": "0.0.1",
    "keyword": "demo library libra",
    "themes": "A demo component library.",
    "description": "metaui-mobile组件库",
    "components": {
        "basic": {
          "Col": "./components/Col",
          "Row": "./components/Row"
        },
        "other": {
          "Button": "./components/Button",
        }
    }
}
```

若使用`libra build`命令打包，则可以直接在页面中引入打包后的js文件，使用`__Libra__.basic.Col`去使用`Col`组件，也可以npm发包或直接引用dist文件等方式使用。

### 注意事项

- 编写组件时组件代码中无需手动引入样式文件

  执行`libra build` 时，会从`./components/<Component>/index.js`打包js文件，从`./components/<Component>/style/index.js`打包样式文件，生成的结果中js代码和css代码分离。

  因此，在编写demo的过程中，需要有以下代码以保证demo中的样式正确：

   ```js
  ...
  import MyComponent from '../index'; // 引入组件代码
  import '../style'; // 引入组件样式代码
  import './index.less'; // 引入demo文件的样式代码
  ...
   ```

- demo代码的注释标识

  在每个demo代码中，需要在开头用注释描述该demo的信息。如：

  ```js
  /**
   * @name: Button组件的基本使用
   * @description: Button组件使用size属性控制大小，使用colors属性控制主题色。
   */
  ```

  以上将在预览页面渲染成对应的元素，因此不可忽略。

### 使用案例

以下将描述整个流程：

- 安装工具

  使用`npm install libraui-cli -g`全局安装命令行工具。

- 创建工程

  在需要的目录，打开命令行，键入`libra init`命令，输入工程名、作者名、编码类型(js or ts)，创建新的工程。

  ```js
  $ libra init
  ? Project Name: Demo
  ? Author: Hyj
  ? Use JavaScript or TypeScript: ts
  正克隆到 'libraui-template'...
  ```

- 创建组件

  进入工程目录，先安装依赖（推荐使用 `npm install`）。之后使用`create`命令创建组件，假设组件名为MyComponent。**禁止使用下划线开头，建议组件统一为大驼峰命名。**

  ```js
  $ cd Demo
  $ npm install
  ...
  $ libra create MyComponent
  ...Component MyComponent was successfully created.
  ```

- 编码

  在组件对应的目录下编码，建议将组件代码写在单独的文件中如`MyComponent.js`中，通过`index.js`作为统一的出口对外暴露。组件的样式文件写在`./components/MyComponent/sytle/index.less`文件中，公共样式代码写在`./components/_style/index.less`中。**js代码中无需手动引入样式文件。**

  编码demo时，参考*注意事项*。

- 本地预览

  在工程目录下，执行`libra start`命令启动本地预览。

  ```js
  $ libra start
  ...
  ```

- 打包发布

  在工程目录下，执行`libra build`命令将打包组件库文件，再执行`libra publish`命令发布组件库。

  后续将提供一个符合命令完成打包发布。

### 更新日志

- 0.1.12
  - 支持在.libraui/dist目录下产出manifest.json文件
  - 修改了预览框架的背景色为#eee
  - `<html>`标签添加属性`font-size=50px`
  - 解决生成lib目录时由于别名配置、引用第三方包等导致的打包错误
  - 解决了使用`libra create <name>`创建demo时`style/idnex.js`中重复引入全局less文件的问题

- 0.1.13
  - libra.config.json和manifest.json文件支持override
    开发过程中，为避免对libra.config.json和manifest.json的提交，现支持以下功能：在读取配置信息时，优先获取manifest.override.json的信息，其次获取manifest.json的信息，否则报错，libra.config.json文件同理。
  
  - libra build修改
    执行`libra build -p`或`libra build --prod`时不会获取*.override.json文件的信息
  
- 0.1.15
  - 为解决webpack和gulp同时使用时在less文件中引用库存在的冲突(webpack中需要加`~`，gulp不需要)，在生成lib目录前先生成一套去除`~`的临时代码。后续将考虑对此做优化
  - 新增`libra compress`命令，将产出文件打包压缩，供后续发布时使用

- 0.1.18
  - 取消 _style, _utils的别名配置
  - 打包lib目录时使用webpack打包less文件，支持同时产出less文件和css文件
  - `libra.config.json`文件新增字段
    - plugins: 同webpack配置文件中babel-loader的plugins字段，例如按需加载时，先在工程项目下载`babel-plugin-import`插件，在`libra.config.json`文件中配置为：

  ```js
  "plugins": [
      ["import",{"libraryName":"antd-mobile","style":true}]
   ],
  ```

  即可实现组件的按需引入，详见https://github.com/ant-design/babel-plugin-import#readme

  其它插件同理。

  - buildImport: build过程中会生成一个临时文件，可通过该字段在临时文件中引入额外的js、css(或者less)文件，例如：

    ```js
    "buildImport": {
        "js":[],
        "css":['~antd-mobile/dist/antd-mobile.less']
    }
    ```

    以上配置将在打包结果中加入整个antd-mobile的less样式文件。

    - 由于less-loader限制，样式文件的引入需要加前缀`~`
    - 功能实现，暂时未使用  
  
- 0.1.23
  - 为避免windows和Mac OS系统之间的差异带来的问题，去除了绝对路径的使用，替换成相对路径
  - 生成的dist目录位置改为项目根目录
  - dist目录下面的文件统一改为 index.js /index.css，不再根据项目名称改变