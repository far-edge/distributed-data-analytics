import path from 'path';

import paths from '../paths';

export default [
  {
    test: /\.(woff|woff2)$/,
    include: [ paths.app, paths.modules ],
    use: [{
      loader: 'url-loader',
      options: {
        name: path.join('[path]',
          process.env.NODE_ENV !== 'development' ? '[name].[hash:8].[ext]' : '[name].[ext]'),
        limit: 20000
      }
    }]
  },
  {
    test: /\.eot(\?v=\d+.\d+.\d+)?$/,
    include: [ paths.app, paths.modules ],
    use: [{
      loader: 'url-loader',
      options: {
        name: path.join('[path]',
          process.env.NODE_ENV !== 'development' ? '[name].[hash:8].[ext]' : '[name].[ext]'),
      }
    }]
  },
  {
    test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/,
    include: [ paths.app, paths.modules ],
    use: [{
      loader: 'url-loader',
      options: {
        name: path.join('[path]',
          process.env.NODE_ENV !== 'development' ? '[name].[hash:8].[ext]' : '[name].[ext]'),
        mimetype: 'application/octet-stream',
        limit: 20000
      }
    }]
  }
];
