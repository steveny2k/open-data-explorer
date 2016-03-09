const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: [
  'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
  'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
  'bootstrap-loader',
  './src/app.jsx' // Your appʼs entry point
  ],
  output: {
    path: './build',
    filename: '[name].bundle.js'
  },

  module: {
    loaders: [
    {
      test: /\.css$/,
      loader: 'style!' + 'css?sourceMap' + '!postcss?sourceMap'
    },
    {
      test: /\.scss$/,
      loader: 'style!' + 'css?sourceMap' + '!postcss?sourceMap' + '!sass?sourceMap'
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'react-hot!'+ 'babel-loader?presets[]=react,presets[]=es2015,plugins[]=transform-object-rest-spread'
    },
    {
      test: /\.(json)$/,
      exclude: /node_modules/,
      loader: 'json-loader'
    },

    {
      test: /\.(svg|ttf|woff|woff2|eot)(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url-loader'
    }

    ]
  },

  plugins: [
  new HtmlWebpackPlugin({
    title: 'Data Dictionary Editor',
    template: './src/template.html',
    inject: 'body'
  })
  ],

  devtool: 'source-map',

  postcss: [ autoprefixer ]

};