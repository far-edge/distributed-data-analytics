import ExtractTextPlugin from 'extract-text-webpack-plugin';

import paths from '../paths';

export default [
  {
    test: /\.css$/,
    include: [ paths.app ],
    use: ExtractTextPlugin.extract({
      fallback: {
        loader: 'style-loader',
        options: { }
      },
      use: [{
        loader: 'css-loader',
        options: {
          importLoaders: 1
        },
      }, {
        loader: 'postcss-loader',
        options: { }
      }]
    })
  },
  {
    test: /\.css$/,
    include: [ paths.modules ],
    use: ExtractTextPlugin.extract({
      fallback: {
        loader: 'style-loader'
      },
      use: [{
        loader: 'css-loader'
      }]
    })
  }
];
