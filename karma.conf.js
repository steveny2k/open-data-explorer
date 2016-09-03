var webpackConfig = require('./webpack/config.test')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'node_modules/babel-polyfill/dist/polyfill.js',
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      './test/**/*.js' // specify files to watch for tests
    ],
    preprocessors: {
      './test/**/*.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type: 'html', subdir: 'report-html'},
        {type: 'lcov', subdir: 'report-lcov'}
      ]
    },
    externals: {
      'jsdom': 'window',
      'cheerio': 'window',
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': 'window'
    },
    // port: 9876,
    // colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: false,
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    }
  })
}

