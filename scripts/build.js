const path = require('path');
const fse = require('fs-extra');
const ejs = require('ejs');
const _ = require('lodash');

function copyProject(demoProjectDir, distDir, shouldClear) {
  if (shouldClear) {
    fse.removeSync(distDir);
  }

  // 清理 DevOps 不必要的文件
  fse.removeSync(path.join(demoProjectDir, 'DevOps/matman-app/node_modules'));
  fse.removeSync(path.join(demoProjectDir, 'DevOps/matman-app/build'));
  fse.removeSync(path.join(demoProjectDir, 'DevOps/matman-app/.DS_Store'));
  fse.removeSync(path.join(demoProjectDir, 'DevOps/matman-app/package-lock.json'));

  fse.removeSync(path.join(demoProjectDir, 'DevOps/mockstar-app/node_modules'));
  fse.removeSync(path.join(demoProjectDir, 'DevOps/mockstar-app/build'));
  fse.removeSync(path.join(demoProjectDir, 'DevOps/mockstar-app/.DS_Store'));
  fse.removeSync(path.join(demoProjectDir, 'DevOps/mockstar-app/package-lock.json'));

  // 复制 DevOps 文件夹
  fse.copySync(path.join(demoProjectDir, 'DevOps'), path.join(distDir, 'DevOps'));

  // 复制 public 文件夹
  fse.copySync(path.join(demoProjectDir, 'public'), path.join(distDir, 'public'));

  // 复制 src 文件夹
  fse.copySync(path.join(demoProjectDir, 'src'), path.join(distDir, 'src'));

  // 复制根目录的一些文件
  ['.gitignore', 'package.json', 'webpack.dev.config.js', 'webpack.prod.config.js'].forEach((file) => {
    fse.copySync(path.join(demoProjectDir, file), path.join(distDir, file));
  });
}

function generateDemoJest() {
  const templateName = 'jest';
  const demoProjectDir = path.join(__dirname, 'demo-project');
  const distDir = path.join(__dirname, '../demo', templateName);

  // 复制项目
  copyProject(demoProjectDir, distDir);

  // README.md
  fse.outputFileSync(path.join(distDir, 'README.md'), ejs.render(
    fse.readFileSync(path.join(demoProjectDir, 'README.md'), { encoding: 'utf8' }),
    {
      installCmd: `npx create-matman-app my-app --template=jest`,
      dependencies: `- 测试框架：[Jest](https://https://jestjs.io/)`,
    },
  ));

  // 复制 test 文件夹的执行脚本
  fse.copySync(path.join(__dirname, 'demo-other/jest/test'), path.join(distDir, 'test'));

  // package.json
  fse.outputJson(path.join(distDir, 'package.json'), _.merge(
    {},
    fse.readJsonSync(path.join(demoProjectDir, 'package.json')),
    fse.readJsonSync(path.join(__dirname, 'demo-other/jest/package.json')),
  ), {
    spaces: '  ',
  });
}

generateDemoJest();
