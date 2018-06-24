import browserSync from 'browser-sync';
import chalk from 'chalk';
import historyApiFallback from 'connect-history-api-fallback';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from '../config/webpack';

const bsync = browserSync.create();
const compiler = webpack(config);

bsync.init({
  // Configure the built-in static server.
  server: {
    // Specify the directory where all files reside.
    baseDir: 'app',
    // Specify the middlewares to load.
    middleware: [
      historyApiFallback({
        disableDotRule: true,
        htmlAcceptHeaders: [ 'text/html', 'application/xhtml+xml' ]
      }),
      webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: {
          context: config.context,
          hash: false,
          version: false,
          timings: false,
          entrypoints: true,
          chunkOrigins: true,
          chunkModules: false,
          children: false,
          colors: true
        }
      }),
      webpackHotMiddleware(compiler)
    ]
  },
  // Use a specific port for the built-in static server.
  port: Number.parseInt(process.env.PORT, 10),
  // Enable the Browsersync user interface.
  ui: {
    // Use a specific port for the user interface.
    port: Number.parseInt(process.env.PORT, 10) + 1,
  },
  // Open the browser automatically.
  open: true,
  // Reload when Browsersync is restarted.
  reloadOnRestart: true,
  // Watch all the application files.
  files: [
    'app/**',
    'app/**/*'
  ]
});

bsync.emitter.on('init', () => {
  const message = `NODE_ENV is set to ${chalk.white.bold(process.env.NODE_ENV)}.`;
  console.log(chalk.blue(message));
});
