/* eslint import/no-commonjs: 0 */

const autoprefixer = require('autoprefixer')
const webpack = require('webpack')

module.exports = {

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
  ],

  entry: './client/app/index.js',

  output: {
    path: `${__dirname}/client/build/`,
    filename: 'bundle.js',
    publicPath: '/build/',
  },

  resolve: {
    extensions: ['', '.js', '.css'],
  },

  module: {
    preLoaders: [
      { test: /\.json$/, loader: 'json' },
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-1'],
          plugins: [
            ['react-transform', {
              transforms: [
                {
                  transform: 'react-transform-hmr',
                  imports: ['react'],
                  locals: ['module'],
                },
                {
                  transform: 'react-transform-catch-errors',
                  imports: ['react', 'redbox-react'],
                },
              ],
            }],
          ],
        },
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css' +
            '?modules' +
            '&importLoaders=1' +
            '&localIdentName=[name]__[local]__[hash:base64:5]',
          'postcss',
        ],
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css', 'postcss'],
        include: [/node_modules/],
      },
    ],
  },

  postcss: [autoprefixer],

  devServer: {
    contentBase: 'client/',
    publicPath: '/build/',
  },

  devtool: '#eval',

}
