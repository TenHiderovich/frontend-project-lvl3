const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{
      test: /\.(scss)$/,
      use: [{
        loader: 'style-loader',
      }, {
        loader: 'css-loader',
      }, {
        loader: 'postcss-loader',
        options: {
          plugins: function () {
            return [
              require('precss'),
              require('autoprefixer')
            ];
          }
        }
      }, {
        loader: 'sass-loader'
      }]
    }, ]
  },
  plugins: [new HtmlWebpackPlugin()],
};