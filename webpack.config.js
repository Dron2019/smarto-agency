// const webpack = require('webpack');
const path = require('path');
const glob = require('glob');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const config = {
  mode: 'development',
  entry: glob.sync('./src/assets/scripts/gulp-modules/*.js').reduce((acc, item) => {
    const path1 = item.split('/');
    // path1.pop();
    const name = path1.pop().replace(/\.js/, '');
    if (name === 'index') {
      acc[name] = './src/assets/scripts/index-app.js';
      console.warn('Dont use index.js in gulp-modules folder, it will be ignored')
    } 
    else if (name === 'libs') {
      console.log('libs script ingrored by webpack');
    }
    else {
      acc[name] = item;
    }
    return acc;
  }, {}),
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './assets/scripts/'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {

            plugins: ['@babel/plugin-proposal-class-properties'],
          },
        },
      },
    ],
  },
  // output: {
  //   filename: '[name].bundle.js',
  // },
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendors',
  //         chunks: 'all',
  //       },
  //     },
  //   },
  // },
  plugins: [
    new UglifyJSPlugin({
      sourceMap: true,
    }),
  ],
};

module.exports = config;
