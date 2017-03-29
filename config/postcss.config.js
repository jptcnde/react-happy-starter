
var postcssFocus = require('postcss-focus');
var postcssReporter = require('postcss-reporter');
var postcssImport = require('postcss-import');
var postcssnext = require('postcss-cssnext');

module.exports = function(webpack) {
  return {
    sourceMap: true,
    plugins: [
      postcssImport({
        addDependencyTo: webpack
      }),
      postcssFocus(),
      postcssnext({
        browsers: ['last 2 versions', 'IE > 10'],
      }),
      postcssReporter({
        clearMessages: true,
      })
    ]
  }
}