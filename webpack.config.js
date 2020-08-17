const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const autoprefixer = require('autoprefixer');

const cssReg = /\.css$/;
const fileLoader = 'file-loader';
const fileLoaderName = '[name].[ext]';

module.exports = {
  mode: 'none',
  entry: {
    app: path.join(__dirname, 'src', 'index.tsx'),
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: '/node_modules/',
      },
      {
        test: /\.(ts|tsx|js)$/,
        exclude: /node_modules/,
        use: ['eslint-loader'],
      },
      {
        test: cssReg,
        use: [
          {
            loader: 'style-loader',
            options: {
              injectType: 'linkTag',
            },
          },
          {
            loader: fileLoader,
            options: {
              name: fileLoaderName,
              outputPath: 'static/css/',
            },
          },
        ],
      },
      {
        test: cssReg,
        loader: 'postcss-loader',
        options: {
          plugins: [autoprefixer()],
          sourceMap: true,
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|png|gif|jpg)?$/,
        use: [
          {
            loader: fileLoader,
            options: {
              name: fileLoaderName,
              outputPath: 'static/fonts/',
            },
          },
        ],
      },
      {
        test: /\.(svg|png|gif|jpg)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: fileLoaderName,
              outputPath: 'static/img/',
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'static', 'index.html'),
    }),
  ],
};
