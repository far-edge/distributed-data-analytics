import CopyWebpackPlugin from 'copy-webpack-plugin';
import DotEnvPlugin from 'dotenv-webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ImageminPlugin from 'imagemin-webpack-plugin';
import SpriteLoaderPlugin from 'svg-sprite-loader/plugin';
import webpack from 'webpack';

import paths from './paths';
import fontRules from './rules/fonts';
import javaScriptRules from './rules/javascript';
import mediaRules from './rules/media';
import styleRules from './rules/styles';

const isDevelopment = process.env.NODE_ENV === 'development';

// The base configuration that is the same for all the environments.
const baseConfig = {
  // Configure the directory to resolve everything.
  context: paths.app,
  // Configure how to treat the different types of modules.
  module: {
    rules: [
      ...fontRules,
      ...javaScriptRules,
      ...styleRules,
      ...mediaRules
    ]
  },
  // Configure how to resolve imports.
  resolve: {
    // Configure what directories to search.
    modules: [ 'app', 'node_modules' ],
    // Configure the extensions to automatically resolve.
    extensions: [ '.js', '.json', '.jsx', '.css', '*' ]
  },
  // Configure whether and how source maps are generated.
  devtool: 'eval-source-map',
};

const config = {
  // Add the base configuration.
  ...baseConfig,
  // Configure the entry points to the application.
  // The last module is exported.
  entry: isDevelopment ? [
    'babel-polyfill',
    'whatwg-fetch',
    'react-hot-loader/patch',
    'webpack-hot-middleware/client',
    './index'
  ] : [
    'babel-polyfill',
    'whatwg-fetch',
    './index',
  ],
  // Configure options that affect how and where webpack outputs bundles, assets, etc.
  output: isDevelopment ? {
    filename: 'bundle.js',
    path: paths.dist,
    publicPath: '/',
    pathinfo: true
  } : {
    filename: '[name].[chunkhash].js',
    path: paths.dist,
    publicPath: '/'
  },
  // Configure the compiler plugins.
  plugins: isDevelopment ? [
    // Read, parse and export the listed env vars from the .env file.
    new DotEnvPlugin(),
    // Enable hot module replacement.
    new webpack.HotModuleReplacementPlugin(),
    // Cause the relative path of the module to be displayed when hot module replacement is
    // enabled.
    new webpack.NamedModulesPlugin(),
    // Skip the emitting phase whenever there are compile-time errors.
    // This ensures that no assets that include errors are emitted.
    new webpack.NoEmitOnErrorsPlugin(),
    // Generate an HTML5 file that includes all the bundles in the body.
    new HtmlWebpackPlugin({
      template: `${paths.app}/index.html`,
    }),
    // Disable text extraction from the bundle.
    new ExtractTextPlugin({
      disable: true
    }),
    // Create SVG sprites.
    new SpriteLoaderPlugin()
  ] : [
    // Read, parse and export the listed env vars from the .env file.
    new DotEnvPlugin(),
    // Minify the JavaScript files.
    new webpack.optimize.UglifyJsPlugin({
      include: /\/app/,
      sourceMap: true,
      uglifyOptions: {
        compress: false,
        mangle: true
      }
    }),
    // Generate an HTML5 file that includes all the bundles in the body.
    new HtmlWebpackPlugin({
      template: `${paths.app}/index.html`,
    }),
    // Cause hashes to be based on the relative path of the module.
    new webpack.HashedModuleIdsPlugin(),
    // Create a separate file, consisting of common modules shared between multiple entry points.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),
    // Extract text from the bundle into a file.
    new ExtractTextPlugin({
      filename: '[name].[contenthash:8].bundle.css',
    }),
    // Create SVG sprites.
    new SpriteLoaderPlugin(),
    // Compress all images.
    new ImageminPlugin({
      gifsicle: {
        interlaced: true
      },
      jpegtran: {
        progressive: true
      },
      svgo: null
    }),
    // Copy unresolved assets.
    new CopyWebpackPlugin([
      { from: 'extensions/fonts/', to: 'extensions/fonts/' },
      { from: 'extensions/images/', to: 'extensions/images/' }
    ])
  ]
};

export default config;
