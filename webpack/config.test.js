var config = require('./config')

config.entry = {}

config.module.postLoaders = [{
  test: /\.(js|jsx)$/,
  exclude: /(node_modules|bower_components|__tests__)/,
  loader: 'istanbul-instrumenter'
}]

delete config.context
delete config.output
delete config.devServer

module.exports = config
