const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    sogou: './src/sogou.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].dev.bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'sogou.html',
      template: './public/sogou.html',
    }),
  ],
};
