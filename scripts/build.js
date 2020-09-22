const path = require('path');
const fse = require('fs-extra');
const ejs = require('ejs');
const _ = require('lodash');

function copyProjectCommon(templateRootDir, distDir, shouldClear) {
  if (shouldClear) {
    fse.removeSync(distDir);
  }

  // 清理 DevOps 不必要的文件
  fse.removeSync(path.join(templateRootDir, 'DevOps/matman-app/node_modules'));
  fse.removeSync(path.join(templateRootDir, 'DevOps/matman-app/build'));
  fse.removeSync(path.join(templateRootDir, 'DevOps/matman-app/.DS_Store'));
  fse.removeSync(path.join(templateRootDir, 'DevOps/matman-app/package-lock.json'));

  fse.removeSync(path.join(templateRootDir, 'DevOps/mockstar-app/node_modules'));
  fse.removeSync(path.join(templateRootDir, 'DevOps/mockstar-app/build'));
  fse.removeSync(path.join(templateRootDir, 'DevOps/mockstar-app/.DS_Store'));
  fse.removeSync(path.join(templateRootDir, 'DevOps/mockstar-app/package-lock.json'));

  // 复制 DevOps 文件夹
  fse.copySync(path.join(templateRootDir, 'DevOps'), path.join(distDir, 'DevOps'));

  // 复制根目录的一些文件
  ['.gitignore'].forEach((file) => {
    fse.copySync(path.join(templateRootDir, file), path.join(distDir, file));
  });
}

function copyProjectJS(demoTemplateRootDir, distDir) {
  const projectTemplateRootDir = path.join(demoTemplateRootDir, 'project-js');

  // 复制 public 文件夹
  fse.copySync(path.join(projectTemplateRootDir, 'public'), path.join(distDir, 'public'));

  // 复制 src 文件夹
  fse.copySync(path.join(projectTemplateRootDir, 'src'), path.join(distDir, 'src'));
}

function copyProjectTS(demoTemplateRootDir, distDir) {
  const projectTemplateRootDir = path.join(demoTemplateRootDir, 'project-ts');

  // 复制 public 文件夹
  fse.copySync(path.join(projectTemplateRootDir, 'public'), path.join(distDir, 'public'));

  // 复制 src 文件夹
  fse.copySync(path.join(projectTemplateRootDir, 'src'), path.join(distDir, 'src'));
  fse.copySync(path.join(projectTemplateRootDir, 'tsconfig.json'), path.join(distDir, 'tsconfig.json'));
}

function copyReadMe(sourceDir, distDir, data) {
  fse.outputFileSync(path.join(distDir, 'README.md'), ejs.render(
    fse.readFileSync(path.join(sourceDir, 'README.md'), { encoding: 'utf8' }),
    data,
  ));
}

function copyPackageJson(sourceDir, distDir, overrideDir) {
  fse.outputJson(path.join(distDir, 'package.json'), _.merge(
    {},
    fse.readJsonSync(path.join(sourceDir, 'package.json')),
    fse.readJsonSync(path.join(overrideDir, 'package.json')),
  ), {
    spaces: '  ',
  });
}

function generateDemoJest() {
  const demoName = 'jest';
  const templateRootDir = path.join(__dirname, 'template');
  const demoDistDir = path.join(__dirname, '../demo', demoName);
  const demoOverrideDir = path.join(templateRootDir, demoName);

  copyProjectCommon(templateRootDir, demoDistDir);
  copyProjectJS(templateRootDir, demoDistDir);

  copyReadMe(templateRootDir, demoDistDir, {
    installCmd: `$ npx create-matman-app my-app --template=jest`,
    dependencies: `- 测试框架：[Jest](https://https://jestjs.io/)`,
  });

  // 复制 test 文件夹的执行脚本
  fse.copySync(path.join(demoOverrideDir, 'test'), path.join(demoDistDir, 'test'));

  // package.json
  copyPackageJson(path.join(templateRootDir, 'project-js'), demoDistDir, demoOverrideDir);
}

function generateDemoMocha() {
  const demoName = 'mocha';
  const templateRootDir = path.join(__dirname, 'template');
  const demoDistDir = path.join(__dirname, '../demo', demoName);
  const demoOverrideDir = path.join(templateRootDir, demoName);

  copyProjectCommon(templateRootDir, demoDistDir);
  copyProjectJS(templateRootDir, demoDistDir);

  copyReadMe(templateRootDir, demoDistDir, {
    installCmd: `$ npx create-matman-app my-app \n\n# 或者\n$ npx create-matman-app my-app --template=mocha`,
    dependencies: `- 测试框架：[Mocha](https://mochajs.org/) \n- 断言库：[Chai](https://www.chaijs.com/)`,
  });

  // 复制 test 文件夹的执行脚本
  fse.copySync(path.join(demoOverrideDir, 'test'), path.join(demoDistDir, 'test'));

  // package.json
  copyPackageJson(path.join(templateRootDir, 'project-js'), demoDistDir, demoOverrideDir);
}

function generateDemoMochaTs() {
  const demoName = 'mocha-ts';
  const templateRootDir = path.join(__dirname, 'template');
  const demoDistDir = path.join(__dirname, '../demo', demoName);
  const demoOverrideDir = path.join(templateRootDir, demoName);

  copyProjectCommon(templateRootDir, demoDistDir);
  copyProjectTS(templateRootDir, demoDistDir);

  copyReadMe(templateRootDir, demoDistDir, {
    installCmd: `$ npx create-matman-app my-app --template=mocha-ts`,
    dependencies: `- 测试框架：[Mocha](https://mochajs.org/) \n- 断言库：[Chai](https://www.chaijs.com/)\n- TypeScript：[TypeScript](https://www.typescriptlang.org/)`,
  });

  // 复制 test 文件夹的执行脚本
  fse.copySync(path.join(path.join(templateRootDir, 'mocha'), 'test'), path.join(demoDistDir, 'test'));

  // package.json
  copyPackageJson(path.join(templateRootDir, 'project-ts'), demoDistDir, demoOverrideDir);
}

generateDemoJest();
generateDemoMocha();
generateDemoMochaTs();
