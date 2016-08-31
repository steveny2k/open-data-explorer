module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'tests.webpack.js'
    ],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    // port: 9876,
    // colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Firefox'],
    singleRun: false,
    webpack: require('./webpack/config.test'),
    webpackServer: {
      noInfo: true
    }
  })
}
