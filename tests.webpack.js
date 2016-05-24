import 'babel-polyfill'

let context = require.context('./app', true, /-test\.js?$/)
context.keys().forEach(context)
