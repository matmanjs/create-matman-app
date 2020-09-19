// https://jestjs.io/docs/en/configuration.html
module.exports = {
  // Use this configuration option to add custom reporters to Jest
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

  // The test environment that will be used for testing
  testEnvironment: 'node',
};
