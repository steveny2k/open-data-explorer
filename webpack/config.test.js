var config = require('./config')

config.entry = {}

config.module.preLoaders = [
  {
    test: /\.jsx?$/,
    exclude: [/node_modules/, /__tests__/],
    loader: 'isparta-instrumenter-loader'
  }
]

config.externals = {
  'react/addons': true,
  'react/lib/ExecutionEnvironment': true,
  'react/lib/ReactContext': true
}

delete config.context
delete config.output
delete config.devServer

module.exports = config
