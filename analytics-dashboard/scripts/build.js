import chalk from 'chalk';
import webpack from 'webpack';

import config from '../config/webpack';

const compiler = webpack(config);

console.log(chalk.blue('Bundle files.'));
console.log(chalk.blue(`NODE_ENV is set to ${chalk.white.bold(process.env.NODE_ENV)}.`));

compiler.run((error, stats) => {
  if (error) {
    console.log(chalk.red(error.stack || error));
    if (error.details) {
      console.log(chalk.red(error.details));
    }
    return 1;
  }

  stats.toJson('verbose');
  console.log(stats.toString({
    context: config.context,
    performance: true,
    hash: true,
    timings: true,
    entrypoints: true,
    chunkOrigins: true,
    chunkModules: false,
    colors: true
  }));

  if (stats.hasErrors()) {
    console.log(chalk.red.bold('Failed to bundle.'));
    return 1;
  }

  console.log(chalk.green('Bundled.'));
  return 0;
});
