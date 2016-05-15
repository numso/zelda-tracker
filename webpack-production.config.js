/* eslint import/no-commonjs: 0 */

var webpack = require('webpack')

module.exports = {

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin()
  ],

  entry: './client/app/index.js',

  output: {
    path: __dirname + '/dist/build/',
    filename: 'bundle.js'
  },

  resolve: {
    extensions: ['', '.js', '.css']
  },

  module: {
    preLoaders: [
      {test: /\.json$/, loader: 'json'}
    ],
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-1']
        },
        exclude: [/node_modules/]
      },
      {
        test: /\.css$/,
        loaders: [
          'style',
          'css' +
            '?modules' +
            '&importLoaders=1' +
            '&localIdentName=[hash:base64:5]',
          'postcss'
        ],
        exclude: [/node_modules/]
      }
    ]
  },

  postcss: [
    require('autoprefixer')
  ],

  devtool: 'source-map'

}
