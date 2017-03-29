var path = require('path');
var webpack = require('webpack');
var fs = require('fs');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin');
var paths = require('./paths');
var getClientEnvironment = require('./env');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
var publicPath = '/';
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
var publicUrl = '';

// Get environment variables to inject into our app.
var env = getClientEnvironment(publicUrl);

module.exports = {
  bail: true,
  devtool: 'source-map',
  entry: {
    bundle : [
      require.resolve('./polyfills'),
      paths.appIndexJs
    ]
  },

  output: {
    // The build folder.
    path: paths.appBuild,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: 'scripts/[name].[chunkhash:8].js',
    chunkFilename: 'scripts/[name].[chunkhash:8].chunk.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: publicPath
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        include: paths.appSrc,
        enforce: 'pre'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: paths.appSrc,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[name]__[local]___[hash:base64:5]',
                importLoaders: 1,
                sourceMap: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: require('./postcss.config')(webpack)
            }
          ],
        })
      },
      {
        test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: 'media/[name].[hash:8].[ext]'
        }
      },
      // 'url' loader works just like 'file' loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject : 'body',
      template : paths.appHtml
    }),
    new webpack.DefinePlugin(env),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      },

    }),
		new ExtractTextPlugin('css/[name].[contenthash:8].css'),
		new ManifestPlugin({
			fileName: 'asset-manifest.json'
		}),
  ],
  resolve: {
    modules: [
      paths.appSrc,
      paths.appNodeModules
    ],
    extensions: ['.js', '.css'],
    plugins: [
      new DirectoryNamedWebpackPlugin(true),
    ]
  }
};
