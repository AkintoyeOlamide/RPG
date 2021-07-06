const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    // mode: 'production',
    app: './src/index.js',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.posix.join(
            path.resolve(__dirname, 'assets').replace(/\\/g, '/'),
            '**',
            '*',
          ),
          // from: path.resolve(__dirname, 'assets'),
          to: path.resolve(__dirname, 'dist'),
          // noErrorOnMissing: true
        },
        {
          from: path.resolve(__dirname, 'index.html'),
          to: path.resolve(__dirname, 'dist'),
        },
      ],

    }),

    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(true),
    }),

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'production-dependencies',
    //   filename: 'production-dependencies.bundle.js'
    // }),
  ],

  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         name: 'production-dependencies',
  //         chunks: 'initial',
  //         minChunks: 2
  //       },
  //     }
  //   }
  // },

  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
  },

};
