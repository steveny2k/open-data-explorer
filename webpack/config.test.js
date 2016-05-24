var config = require('./config')

config.entry = {}

delete config.context
delete config.output
delete config.devServer

module.exports = config
