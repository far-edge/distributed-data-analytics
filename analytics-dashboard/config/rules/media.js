import path from 'path';

import paths from '../paths';

export default [
  {
    test: /\.(ico|gif|jpe?g|png|webp)$/,
    include: [ paths.app, paths.modules ],
    use: [{
      loader: 'url-loader',
      options: {
        name: path.join('[path]',
          process.env.NODE_ENV !== 'development' ? '[name].[hash:8].[ext]' : '[name].[ext]'),
        limit: 10000
      }
    }]
  },
  {
    test: /\.svg$/,
    include: [ paths.app ],
    use: [
      {
        loader: 'svg-sprite-loader',
        options: {
          symbolId: 'icon-[name]'
        },
      },
      {
        loader: 'svgo-loader',
        options: {
          plugins: [ ],
        }
      }
    ]
  },
  {
    test: /\.svg$/,
    include: [ paths.modules ],
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
    test: /\.(mp4|m4a|webm|ogv|oga|ogg|mp3|wav)$/,
    include: [ paths.app, paths.modules ],
    use: [{
      loader: 'url-loader',
      options: {
        name: path.join('[path]',
          process.env.NODE_ENV !== 'development'? '[name].[hash:8].[ext]' : '[name].[ext]'),
        limit: 10000,
      }
    }]
  }
];
