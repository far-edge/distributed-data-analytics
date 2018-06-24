import paths from '../paths';

export default [
  {
    test: /\.jsx?$/,
    include: paths.app,
    use: [{
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [
          'env',
          'stage-3',
          'react',
        ],
        plugins: process.env.NODE_ENV !== 'development' ? [
          'babel-plugin-add-module-exports'
        ] : [
          'babel-plugin-add-module-exports',
          'react-hot-loader/babel'
        ],
      }
    }]
  }
];
