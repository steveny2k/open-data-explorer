var config = require('./config')
var path = require('path')

config.entry = {}

config.module.noParse = [/node_modules\/sinon\//]

config.resolve.alias = {
  'sinon': 'sinon/pkg/sinon'
}

config.resolve.root = path.resolve(__dirname, './app')

config.externals = {
  'cheerio': 'window',
  'jsdom': 'window',
  'react/addons': true,
  'react/lib/ExecutionEnvironment': true,
  'react/lib/ReactContext': 'window'
}

delete config.context
delete config.output
delete config.devServer

module.exports = config
