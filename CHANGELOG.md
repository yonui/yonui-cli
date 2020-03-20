## 更新日志

- 0.1.12
  - 支持在.yonuiui/dist目录下产出manifest.json文件
  - 修改了预览框架的背景色为#eee
  - `<html>`标签添加属性`font-size=50px`
  - 解决生成lib目录时由于别名配置、引用第三方包等导致的打包错误
  - 解决了使用`yonui create <name>`创建demo时`style/idnex.js`中重复引入全局less文件的问题

- 0.1.13
  - yonui.config.json和manifest.json文件支持override
    开发过程中，为避免对yonui.config.json和manifest.json的提交，现支持以下功能：在读取配置信息时，优先获取manifest.override.json的信息，其次获取manifest.json的信息，否则报错，yonui.config.json文件同理。
  
  - yonui build修改
    执行`yonui build -p`或`yonui build --prod`时不会获取*.override.json文件的信息
  
- 0.1.15
  - 为解决webpack和gulp同时使用时在less文件中引用库存在的冲突(webpack中需要加`~`，gulp不需要)，在生成lib目录前先生成一套去除`~`的临时代码。后续将考虑对此做优化
  - 新增`yonui compress`命令，将产出文件打包压缩，供后续发布时使用

- 0.1.18
  - 取消 _style, _utils的别名配置
  - 打包lib目录时使用webpack打包less文件，支持同时产出less文件和css文件
  - `yonui.config.json`文件新增字段
    - plugins: 同webpack配置文件中babel-loader的plugins字段，例如按需加载时，先在工程项目下载`babel-plugin-import`插件，在`yonui.config.json`文件中配置为：

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

- 0.1.27
  - 默认配置的externals属性修改: umd模式下react、react-dom需配置多个externals类型
  - yonui.config.json文件的`buildImport`属性新增`export`子属性，可额外导出内容，如
    ```json
    `"buildImport": {
        "js":["import * as AntdMobile from 'antd-mobile/lib/index'"],
        "css":[],
        "export":[
          "AntdMobile"
        ]
      }`
    ```
    生成的临时入口文件会变成：
    ```js
      import * as AntdMobile from 'antd-mobile/lib/index'
      ...
      export default {...AntdMobile, ...other};

    ```
  - 模板文件中的路径分隔符改为`/`

- 0.1.30
  - 新增独立页面预览demo的功能
    - 点击demo的名称后，将会跳转至一个新的页面，展示该demo
    - 将鼠标移动到demo名称上时，将会出现一个二维码，用手机扫码可在手机上打开该demo页面(需要手机和电脑处于同一局域网环境)

- 0.1.33
  - 开发预览支持自定义ur。考虑到网络环境问题，工具支持使用外部内网穿透功能
    1. 使用任意内网穿透工具，如utools
    2. 将127.0.0.1:8090(默认)映射到外网url上
    3. 在yonui.config.json中新增`previewUrl`属性，对应外网的url
    4. 无`previewUrl`属性或为空字符串/false时，走本地局域网

- 0.1.35
  - `build`命令更新
    - yonui build: 完整的输出
    - yonui build lib: 构建lib文件个manifest.json文件
    - yonui build entry: 构建组件库和demo入口的临时文件
    - yonui build dist: 完整的输出
  
  - `build`和`start`命令新增参数 `-p`或`--prod`
    - yonui build/start -p 将不会使用 *.override.json 文件的配置
    - yonui start -p 将不自动打开浏览器

- 0.1.41
  - `build`命令更新
    - yonui build manifest: 构建manifest.json文件(需保证dist/index.js文件存在)
  
  - 生成manifest.json文件逻辑修改

- 0.1.51
  - `init` 命令更新
    - 由git下载变为本地解压
  - `yonui.config.json`文件调整
    - 新增`device`字段，可选'PC'|'mobile'，控制预览时样式

- 0.1.53
  - yonui.config.json新增output属性，控制输出目录，初始值如下：
    ```js
      {
        "output": {
          "dist": "./dist",
          "lib": "./lib",
          "demo": "./.yonuiui/demo"
      }
    ```
  - 优化新增组件代码
    - 新增时组件名自动替换成首字母大写形式
    - 新增时代码中相关字段替换成组件名称
  
- 0.1.55
  - 修改build命令代码逻辑
  - 优化使用webpack的逻辑
  - manifest和逻辑代码取消关联，yonui.config.json新增属性
    - `useManifest: boolean`  为true时，产出的文件中每个组件会引入manifest并与组件使用ReactWrapper连接；为false时产出单纯的react组件。默认为true
    - `excludeNidAndUiType: boolean` 为true，不加nid和uitype；为false时，外套一层div并添加nid和uitype。在useManifest为true时生效，默认为true  
  
- 0.1.57
  - 增加打包和转译对字体文件的支持

- 0.1.58
  - 产出的manifest中组件名称小写

- 0.1.61
  - 将代码中临时文件夹名称提取为常量，默认为`.yonui`

- 0.1.66
  - 组件自带model2Props属性时，如果经过ReactWrapper方法包裹，则会将model2Props添加到包裹后的组件上
  - config.json新增staticPropsMap属性，例如：
    ```json
      {
        "Button": "Item"
      }
    ```
    以上配置可将Item属性挂载到经过ReactWrapper包裹后的Button组件上
  - config.json新增excludeNidAndUiTypeComp属性，例如：
    ```json
      ["CarouselItem", "ListView"],
    ```
    以上配置可将`CarouselItem`和`ListView`组件在excludeNidAndUiType为false时，不为组件添加一层div
  - dist文件中输出版本号和打包时间
  - 组件新增版本号属性，key值为`_[LibraryName]_version`
  - 新增组件时，默认产出目录为中划线形式，组件名为大驼峰形式
