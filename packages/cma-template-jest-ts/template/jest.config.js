module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
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
};