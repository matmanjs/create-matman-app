const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    sogou: './src/sogou.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].prod.bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'sogou.html',
      template: './public/sogou.html',
    }),
  ],
};
