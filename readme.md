# ![Alien](http://ydrimg.oss-cn-hangzhou.aliyuncs.com/20140914113127363721429460.png) v1.1.0
一个为现代浏览器而生的前端解决方案。


# 特点
* 易使用，接口清晰，职责单一
* 易理解，模块化编程，颗粒化分解
* 易扩展，合理宏观
* 易推广，开源免费，人人参与


# 兼容
* ![ie10](http://ydrimg.oss-cn-hangzhou.aliyuncs.com/20140919111504913271952205.png) IE10+
* ![chrome](http://ydrimg.oss-cn-hangzhou.aliyuncs.com/20140919111534857215164833.png) chrome latest
* ![firefox](http://ydrimg.oss-cn-hangzhou.aliyuncs.com/20140919111545251609050667.png) firefox latest
* ![safari](http://ydrimg.oss-cn-hangzhou.aliyuncs.com/20140919191953088445180368.png) safari latest
* 适合桌面现代浏览器、手机现代浏览器


# 文档及示例
- 在线主页 <http://alien.ydr.me/>
- 在线文档 <http://alien.ydr.me/docs/>
- 在线演示 <http://alien.ydr.me/examples/>
- 本地演示 使用 <https://www.npmjs.org/package/sts>，根目录执行`sts 18081`即可。


# 使用
- 生产环境：使用[coolie](http://github.com/cloudcome/coolie)（模块加载器）来加载模块。
- 开发环境：使用[coolie builder](http://github.com/cloudcome/nodejs-coolie)来进行生产环境的模块构建。
- [模块书写约定](https://github.com/cloudcome/alien/blob/master/help/module-convention.md)


# 目录结构
```
- alien
|-- docs 静态的 HTML 文档，可以直接打开
|-- examples 简单示例
|-- help 帮助
|-- src 【源代码】
|	|-- core 核心库
|	|	|-- communication 通信
|	|	|	|-- jsonp.js
|	|	|	|-- upload.js
|	|	|	`-- xhr.js
|	|	|-- dom DOM
|	|	|	|-- animation.js
|	|	|	|-- attribute.js
|	|	|	|-- canvas.js
|	|	|	|-- modification.js
|	|	|	|-- see.js
|	|	|	`-- selector.js
|	|	|-- event 事件
|	|	|	|-- base.js
|	|	|	|-- drag.js
|	|	|	|-- ready.js
|	|	|	|-- touch.js
|	|	|	`-- wheel.js
|	|	`-- navigator 浏览器
|	|		|-- compatible.js
|	|		|-- cookie.js
|	|		|-- hashbang.js
|	|		|-- querystring.js
|	|		|-- shell.js
|	|		`-- ua.js
|	|-- libs 基础库
|	|	|-- DDB.js 数据、模板双向绑定【未完成】
|	|	|-- Emitter.js
|	|	|-- Pagination.js
|	|	|-- Pjax.js
|	|	|-- Template.js
|	|	|-- Template.md
|	|	`-- Validator.js
|	|-- ui UI
|	|	|-- Autoheight textarea 自动增高
|	|	|-- Banner
|	|	|-- Dialog
|	|	|-- Editor
|	|	|-- Imgclip
|	|	|-- Imgview
|	|	|-- Mask
|	|	|-- Msg
|	|	|-- Pager
|	|	|-- Pagination
|	|	|-- Resize
|	|	|-- Scrollbar
|	|	|-- Tab
|	|	|-- Tooltip
|	|	|-- Validator
|	|	|-- Window
|	|	|-- base.js
|	|	`-- readme.md
|	|-- util 小工具
|	|	|-- calendar.js
|	|	|-- canvas.js
|	|	|-- class.js
|	|	|-- control.js
|	|	|-- date.js
|	|	|-- dato.js
|	|	|-- easing.js
|	|	|-- hashbang.js
|	|	|-- howdo.js
|	|	|-- querystring.js
|	|	|-- random.js
|	|	|-- selection.js
|	|	`-- typeis.js
|	`-- readme.md
|-- static 文档所需要的静态文件
|-- templates 文档的模板
|-- test 单元测试
|-- package.json
`-- readme.md
```
