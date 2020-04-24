# TidSearch
[![Build Status](https://api.travis-ci.com/Wybxc/TidSearch.svg?branch=master)](https://travis-ci.com/github/Wybxc/TidSearch)

为静态博客添加搜索功能的 JavaScript 库。

Click [here](https://github.com/Wybxc/TidSearch/blob/master/README_en.md) for English version.

## 安装
### 下载源代码
克隆这个 git 仓库，并使用如下命令生成 `dist` 目录。

```sh
npm install
npm run build
```
然后将 `dist` 目录中的 `TidSearch.js` 复制到您的网站目录下，即可通过`<script>`标签将其引入。

### 使用 CDN
您可以使用 `jsdelivr` 提供的 CDN 在网页上引入本项目。
```html
<script src="https://cdn.jsdelivr.net/npm/tidsearch@latest/dist/TidSearch.min.js"></script>
```

## 快速入门
### 创建 `search.json`
在您的网站中添加一个 `search.json` 文件，其内容是一个数组，数组中的每一个元素都是包含一个页面的信息的对象，需要含有字段 `title`、`url`、`category`（可选）、`tags`（可选）、`date`（可选）、`content`（可选），其值分别为该页面的标题、地址、类别、标签、发布日期、内容。

对于使用 Jekyll 构建的博客，可以使用下面的模板来快速生成`search.json`。
```
---
layout: null
---
[
{% for post in site.posts %}
    {
        "title"    : "{{ post.title | escape }}",
        "url"      : "{{ site.baseurl }}{{ post.url }}",
        "category" : "{{ post.category }}",
        "tags"     : "{{ post.tags | join: ', ' }}",
        "date"     : "{{ post.date | date: '%Y年%m月%d日' }}",
        "content"  : {{ post.content | strip_html | normalize_whitespace | jsonify }}
    } {% unless forloop.last %},{% endunless %}
{% endfor %}
]
```
注意上述模板中的 `content` 项的内容并没有添加双引号，`jsonify` 会自动添加双引号。

如果您不需要模板中的某一项，删除对应行即可。

### 在页面上添加所需的 DOM 元素
使用 `TidSearch` 需要在页面中添加一个`<div>`或者`<ul>`等 DOM 元素来容纳搜索结果。
```html
<input id="searchInput"/>
<div id="searchResultContainer"></div>
```
另外，您还可以添加一个`<input>`，以支持即时搜索。

### 初始化 `TidSearch` 组件
使用如下的 JavaScript 代码来初始化 `TidSearch`。
```javascript
const sch = new TidSearch({
    input: document.getElementById('searchInput'),
    output: document.getElementById('searchResultContainer'),
    // 或者这样写
    // input: '#searchInput',
    // output: '#searchResultContainer',
    json: '/search.json',
});
```
`output` 参数是搜索结果的盛放容器，可以是一个 DOM 元素或者 CSS 选择器（字符串）。注意，如果传入 CSS 选择器，需要保证**在运行上述代码时，页面中对应的元素已经加载完成**。

`json` 参数是您的 `search.json` 的地址，或者您可以提前加载该 JSON 文件，并将解析后的结果传入。

### 开始使用
在 `TidSearch` 对象初始化完成之后，您可以通过其 `search` 方法发起一次搜索。搜索的结果会呈现在预先准备的容器元素中。

如果您在初始化时指定了 `input` 项，那么当其值变化时，会自动触发 `search` 方法。

## 关于浏览器兼容性
**`TidSearch` 依赖于 `Promise`**。默认的配置文件使用了`babel`来兼容旧版浏览器（Chrome59 和 IE11），但是**没有**包含对于 `Promise` 的 polyfill，如果您需要兼容不支持 `Promise` 的浏览器，请自行引入 polyfill。具体方法请参阅相关文章。

## 配置项
关于 `TidSearch` 对象在初始化时的其他参数，以及具体用法，请参阅 [Wiki 页面](https://github.com/Wybxc/TidSearch/wiki/)。

## 开源许可证
本项目使用 MPLv2 开源许可证，您需要注意以下几点：
- 您需要公布您对本项目源码修改部分的代码。
- 您需要对修改之处提供说明文档。
