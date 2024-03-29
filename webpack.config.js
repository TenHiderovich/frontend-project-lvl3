const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { NODE_ENV } = process.env;

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    }],
  },
  plugins: [new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'src', 'index.html'),
    inject: 'body',
  })],
  mode: NODE_ENV || 'development',
};
