# create-matman-app

![](https://img.shields.io/github/languages/top/matmanjs/create-matman-app)![](https://img.shields.io/github/license/matmanjs/create-matman-app)

创建一个 matman 应用，或者你可以添加自己的模板进行创造。

- 快速开始-如何创建一个最简单的新应用

create-matman-app 适用于 macOS、Windows 和 Linux。

如果 create-matman-app 不能正常工作，请提交 [issue](https://github.com/matmanjs/create-matman-app/issues/new)。

## 快速开始

```sh
$ npx create-matman-app new my-app
$ cd my-app
$ npm test
```

如果你以前通过全局安装 create-matman-app，我们建议您卸载全局安装包，使用 npx 确保使用最新版本。

```sh
$ npm uninstall -g create-matman-app
# or
$ yarn global remove create-matman-app
```

## 子命令与参数



## 自定义模板

自定义模板允许你可以从自己的模板创建应用，并且保留 create-matman-app 的全部功能。

自定义模板应该以 `cra-template-[template-name]` 命名并发布在 NPM 上，但是其实你只需要向 create-matman-app `[template-name]`，便可以执行安装。

我们同样支持私有域的 NPM 包进行安装，命名可以是下面这些：`@[scope-name]/cra-template`、`@[scope-name]/cra-template-[template-name]`、`@[scope]`、`@[scope]/[template-name]`。

```sh
npx create-matman-app my-app --template [template-name]
```

### 查找自定义模板

默认情况下，我们提供两个模板：

- [`cma-template`](https://github.com/matmanjs/create-matman-app/tree/master/packages/cma-template)
- [`cma-template-dwt（未完成）`](https://github.com/matmanjs/create-matman-app)

你也可以在 NPM 上通过 [cma-template-*](https://www.npmjs.com/search?q=cma-template-*) 进行搜索

### 生成模板

如果对构建自定义模板感兴趣，请先了解一下 [`cma-template`](https://github.com/matmanjs/create-matman-app/tree/master/packages/cma-template)。

模板必须具有以下结构：

```bash
cra-template-[template-name]/
  README.md (for npm)
  template.json
  package.json
  [init.js]
  template/
    README.md (for projects created from this template)
    gitignore
    public/
      index.html
    src/
      index.js (or index.tsx)
```

#### 测试模板

若要在本地测试，请使用 `file://` 前缀将文件路径传递给 create-matman-app。

```sh
npx create-matman-app my-app --template file:../path/to/your/template/cra-template-[template-name]
```

#### 文件夹 `template`

此文件夹在 create-matman-app 安装时将复制到用户的应用目录，您可以在这里添加所需的任何文件。

#### 文件 `template.json`

这是 template 的配置文件。

目前只支持 package 字段，该字段为你想要添加到 `package.json` 中的所有内容，如：`scripts` 等。

下面是一个 `template.json` 的示例文件：

```json
{
  "package": {
    "scripts": {
      "build": "matman build",
      "build-dev": "matman build --dev",
      "test": "mocha",
      "test:show": "cross-env SHOW_BROWSER=1 npm run test"
    },
    "dependencies": {
      "matman": "^6.0.15",
      "matman-runner-puppeteer": "^6.0.15"
    },
    "devDependencies": {
      "chai": "^4.2.0",
      "cross-env": "^7.0.2",
      "matman-cli": "^6.0.15",
      "mocha": "^8.0.1"
    }
  }
}
```

#### 文件 `init.js`

如果存在这个文件我们将不复制 template 文件夹中的内容，而是执行这个脚本中的内容，需要注意的是：

- `temlate.json` 作为模板的配置文件是一定需要存在的
- `init.js` 必须暴露为一个函数

## License

Create Matman App 使用 [MIT 开源协议](https://github.com/matmanjs/create-matman-app/blob/master/LICENSE)。