var path = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;


var config = {
  entry: './src/main.js',
  output: {
    path: path.join(__dirname,'dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader','css-loader')
      },{
        test: /\.html$/,
        loader: 'html-loader?attrs=img:src img:data-src'
      },{
        test: /fonts\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=./fonts/[name].[ext]',
      },{
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'dist'
      },{
        test: /\.json$/,
        loader: 'url-loader'
      },{
        test: /.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins:[
    new webpack.DefinePlugin({
			'ENV': JSON.stringify(process.env.ENV)
		}),
    new ExtractTextPlugin('css/[name].css'),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      filename: '../dist/index.html',
      template: './indexvue.html',
      inject: false
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname,'dist')
    })
  ],
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js'
    }
  },
  devServer: {
    contentBase: './dist/',
    host: '0.0.0.0',
    port: 9090,
    inline: true,
    hot: true,
    quiet: false
  }
}

module.exports = config;
