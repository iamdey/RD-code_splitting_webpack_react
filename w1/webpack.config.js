const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CommonsChunkPlugin } = require('webpack').optimize;

const sourcePath = path.resolve(__dirname, './src');
module.exports = {
  devtool: 'source-map',
  entry: {
    app: path.resolve(sourcePath, 'index'),
    vendor: ['react', 'react-dom', 'react-router-dom', 'jquery'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    publicPath: '/',
  },
  module: {
    loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(sourcePath, 'index.ejs'),
    }),
    new CommonsChunkPlugin({
      names: ['vendor', 'manifest'],
    }),
  ],
};
