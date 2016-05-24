module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['source-map-support', 'mocha', 'sinon'],
    files: [
      'tests.webpack.js'
    ],
    exclude: [],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    webpack: require('./webpack/config.test'),
    webpackMiddleware: {
      noInfo: true
    }
  })
}
