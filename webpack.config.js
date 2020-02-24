const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const SRC_DIR = path.resolve(__dirname, 'src')
const DIST_DIR = path.resolve(__dirname, 'dist')
const isDev = process.env.NODE_ENV === 'development'

const config = {
  mode: process.env.NODE_ENV,
  entry: SRC_DIR + '/main.js',
  devtool: isDev ? 'source-map' : 'none',
  output: {
    path: DIST_DIR,
    publicPath: DIST_DIR,
    filename: 'main.js'
  },
  resolve: {
    extensions: ['.js'],
    modules: [SRC_DIR, 'node_modules']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader']
      }
    ]
  }
}
if (!isDev) {
  config.optimization = {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
}

module.exports = config
