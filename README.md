# yonui-cli 命令行工具

### 安装

全局安装yonui-cli命令行工具

```js
$ npm install yonui-cli -g
```

安装成功后，在命令行中输入`yonui -v`可以查看版本。如下：

```js
$ yonui -v
0.0.1
```

### 命令

`yonui-cli`命令行工具支持以下命令：

- `yonui init` 

  在当前目录创建一个新的工程。在输入该命令后，将进入一个交互状态，提示输入工程名称等信息。

- `yonui create <name>`

  进入工程目录，输入该命令可在`./components`目录下创建一个新的组件，组件名称`<name>`为必填项。

- `yonui start`

  在工程目录，输入该命令可将编写的demo打包并在浏览器中预览。

- `yonui build`

  在工程目录，输入该命令可将组件代码打包成以下资源：

  - `dist/` 整个组件库打包压缩后的代码。
  - `lib/` 各个组件源码经过babel转译后的资源，可在源码中引入并使用。
  - `demo/` 组件的demo文件打包后的代码，按组件为单元划分，用于注册中心中的组件预览页面。
  - 其他如 `package.json` `readme.md`等文件

- `yonui compress` 

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
├── config.json // 开发配置文件
├── manifest.json // 组件库描述文件
├── package.json
├── static // 静态资源目录
│   └── hightlight
│       ├── highlight.pack.js
│       └── styles
└── tsconfig.json
```

### 文件说明

#### config.json

描述组件库在开发过程中的相关配置。

| 字段名称                | 说明                                                         | 类型           | 默认值           |
| ----------------------- | ------------------------------------------------------------ | -------------- | ---------------- |
| port                    | 启动本地预览时的端口号                                       | sting          | "8090"           |
| autoTemplate            | 启动本地预览时，是否自动生成预览框架                         | true           | true             |
| sourcePath              | 组件库中组件源码所在目录                                     | string         | './components'   |
| type                    | 组件库使用的是js代码还是ts代码                               | 'js'\|'ts'     | js               |
| lib                     | 组件库依赖的组件库，在此配置后将在构建中排除，并可通过配置加入cdn地址以在预览时引入 | array          | -                |
| extraImport             | 本地预览时额外导入的js/css文件                               | object         | -                |
| buildImport             | 构建组件库时额外导入的js/css文件和导出文件                   | object         | -                |
| libPath                 | 组件库构建lib文件的根路径                                    | string         | 同sourcePath     |
| device                  | 组件库适配设配                                               | 'PC'\|'mobile' | 'PC'             |
| previewUrl              | 移动端预览时扫码打开页面的url                                | string         | '127.0.0.1:8090' |
| plugins                 | webpack                                                      | array          | []               |
| useManifest             | 为true时，产出的文件中每个组件会引入manifest并与组件使用ReactWrapper连接；为false时产出单纯的react组件 | Boolean        | true             |
| excludeNidAndUiType     | 组件不在最外层套一层div并添加nid和uitype                     | Boolean        | true             |
| excludeNidAndUiTypeComp | excludeNidAndUiType为false时，不添加div的组件名称数组        | array          | []               |
| staticPropsMap          | 添加div后再去添加属性的映射关系                              | object         | {}               |
| setExtendComp | 接入MDF运行态渲染使用，默认为 true，会自动注册组件到渲染引擎     | Boolean     | true      |
| extraCss | 控制是否单独打包css     | Boolean     | true      |
| outputConfig | 对应webpack的output属性     | object     | {}      |

其中，工具中已经默认将react、react-dom作为依赖库，且不可修改，如对`react`的描述为(lib属性类型)：

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

buildImport属性示例如下:

```js
"buildImport": {
    "js":["import * as AntdMobile from 'antd-mobile'"],
    "css":["@import '~antd-mobile/dist/antd-mobile.css'"],
    "export":[
      "AntdMobile"
    ]
  }
```

staticPropsMap属性示例如下：

```js
"staticPropsMap": {
    "ListView": "DataSource"
  }
```

可将ListView的DataSource属性挂载到经过ReactWrapper包裹后的组件上。

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
    "name":"yonui",
    "version": "0.0.1",
    "keyword": "demo library yonui",
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

若使用`yonui build`命令打包，则可以直接在页面中引入打包后的js文件，使用`__yonui__.basic.Col`去使用`Col`组件，也可以npm发包或直接引用dist文件等方式使用。

### 注意事项

- 编写组件时组件代码中无需手动引入样式文件

  执行`yonui build` 时，会从`./components/<Component>/index.js`打包js文件，从`./components/<Component>/style/index.js`打包样式文件，生成的结果中js代码和css代码分离。

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

  使用`npm install yonui-cli -g`全局安装命令行工具。

- 创建工程

  在需要的目录，打开命令行，键入`yonui init`命令，输入工程名、作者名、编码类型(js or ts)等信息，创建新的工程。

- 创建组件

  进入工程目录，先安装依赖（推荐使用 `npm install`）。之后使用`create`命令创建组件，假设组件名为MyComponent。**禁止使用下划线开头，创建时将自动将组件名称首字母大写。**

  ```js
  $ cd Demo
  $ npm install
  ...
  $ yonui create MyComponent
  ...Component MyComponent was successfully created.
  ```

- 编码

  在组件对应的目录下编码，建议将组件代码写在单独的文件中如`MyComponent.js`中，通过`index.js`作为统一的出口对外暴露。组件的样式文件写在`./components/MyComponent/sytle/index.less`文件中，公共样式代码写在`./components/_style/index.less`中。**js代码中无需手动引入样式文件。**

  编码demo时，参考*注意事项*。

- 本地预览

  在manifest.json文件的components属性中配置组件的入口。如：
  ```json
  components:{
    "MyComponent": "./src/components/MyComponent"
  }
  ```
  
  在工程目录下，执行`yonui start`命令启动本地预览。

  ```js
  $ yonui start
  ...
  ```

- 打包发布

  在工程目录下，执行`yonui build`命令将打包组件库文件。

- 输出manifest

  在组件目录下有一个manifest.tsx文件，导出组件的manifest信息。在index.tsx中无需关联。
