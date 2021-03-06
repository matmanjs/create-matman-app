// https://jestjs.io/docs/en/configuration.html
module.exports = {
  reporters: [
    'default',
    [
      'jest-matman-reporter',
      {
        publicPath: './.matman_output',
        filename: 'report.html',
        expand: true,
      },
    ],
  ],

  // 必须设置运行之后强制退出，否则在报错的情况下可能会卡死
  forceExit: true,

  // 统计单元测试覆盖率
  collectCoverage: true,
  coverageDirectory: '.matman_output/coverage',
  collectCoverageFrom: ['src/**/*.{js,ts}', '!node_modules/**', '!DevOps/**', '!build/**'],
};
