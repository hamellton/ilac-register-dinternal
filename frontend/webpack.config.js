const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');

module.exports = {
  entry: __dirname + "/src/index.js", // webpack entry point. Module to start building dependency graph
  output: {
    path: __dirname + '/dist', // Folder to store generated bundle
    filename: 'main.js', // Name of generated bundle after build
    publicPath: '/' // public URL of the output directory when referenced in a browser
  },
  module: {
    rules: [
      {
        test: /\.(gif|png|jpg|svg)$/,
        include: [
          path.resolve(__dirname, 'src/img')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
              esModule: false,
            },
          },
          // {
          //     loader: 'image-webpack-loader',
          //     options: {
          //       mozjpeg: {
          //         progressive: true,
          //         quality: 65
          //       },
          //       optipng: {
          //         enabled: true,
          //       },
          //       pngquant: {
          //         quality: '65-90',
          //         speed: 4
          //       },
          //       gifsicle: {
          //         interlaced: false,
          //       },
          //       webp: {
          //         quality: 75
          //       }
          //     }
          // }
        ],
      }, {
        test: /\.pdf$/,
        include: [
          path.resolve(__dirname, 'src/img')
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[name].[ext]',
              esModule: false,
            },
          }
        ],
      }, {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader'],
        exclude: [
          /node_modules/,
        ],
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader'],
        }),
      },
      {
        test: /\.handlebars$/,
        loader: 'handlebars-loader',
        query: { inlineRequires: '/img/' },
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'style.css'
    }),
    new Webpack.LoaderOptionsPlugin({
      options: {
        handlebarsLoader: {}
      },
    }),
    // new HtmlWebpackPlugin({
    //   inject: true,
    //   hash: true,
    //   test: 'test test',
    //   template: './src/html/index.html',
    //   filename: 'index.html',
    // }),
    new HtmlWebpackPlugin({
      template: './src/handlebars/index.handlebars',
      inject: 'body',
      // filename: 'pay.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/handlebars/about.handlebars',
      inject: 'body',
      filename: 'about.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/handlebars/contacts.handlebars',
      inject: 'body',
      filename: 'contacts.html',
    })
  ],
};
