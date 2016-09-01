var path = require('path')
var pkg = require('../package.json')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var DEBUG = process.env.NODE_ENV === 'development'
var TEST = process.env.NODE_ENV === 'test'

var jsxLoader
var sassLoader
var cssLoader
var fileLoader = 'file-loader?name=[path][name].[ext]'
var htmlLoader = [
  'file-loader?name=[path][name].[ext]',
  'template-html-loader?' + [
    'raw=true',
    'engine=lodash',
    'version=' + pkg.version,
    'title=' + 'Open Data Explorer',
    'debug=' + DEBUG
  ].join('&')
].join('!')

var jsonLoader = ['json-loader']

var sassParams = [
  'outputStyle=expanded',
  'includePaths[]=' + path.resolve(__dirname, '../app/scss'),
  'includePaths[]=' + path.resolve(__dirname, '../node_modules')
]

if (DEBUG || TEST) {
  jsxLoader = []
  if (!TEST) {
    jsxLoader.push('react-hot')
  }
  jsxLoader.push('babel-loader')
  sassParams.push('sourceMap', 'sourceMapContents=true')
  sassLoader = [
    'style-loader',
    'css-loader?sourceMap',
    'postcss-loader',
    'sass-loader?' + sassParams.join('&')
  ].join('!')
  cssLoader = [
    'style-loader',
    'css-loader?sourceMap',
    'postcss-loader'
  ].join('!')
} else {
  jsxLoader = ['babel-loader']
  sassLoader = ExtractTextPlugin.extract('style-loader', [
    'css-loader',
    'postcss-loader',
    'sass-loader?' + sassParams.join('&')
  ].join('!'))
  cssLoader = ExtractTextPlugin.extract('style-loader', [
    'css-loader',
    'postcss-loader'
  ].join('!'))
}

var loaders = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    loaders: jsxLoader
  },
  {
    test: /\.css$/,
    loader: cssLoader
  },
  {
    test: /\.scss$/,
    loader: sassLoader
  },
  {
    test: /\.json$/,
    exclude: /node_modules/,
    loader: 'json-loader'
  },
  {
    test: /\.html$/,
    loader: htmlLoader
  },
  {
    test: /\.(ttf|eot|svg|ico|woff(2)?)(\?[a-z0-9]+)?$/,
    loader: fileLoader
  }
]

module.exports = loaders
