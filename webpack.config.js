var path = require('path');
var webpack = require('webpack');

var ExtractTextPlugin = require('extract-text-webpack-plugin');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');

// var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

var settings = {
  'publicPath': '/',
  'resolveAliasVue': 'vue/dist/vue.js'
}

if (process.env.NODE_ENV == 'production') {
  settings.publicPath = 'https:\/\/hazelgranger.github.io\/css-secrets-demo\/dist\/';
  settings.resolveAliasVue = 'vue/dist/vue.min.js'
}

var config = {
  entry: './src/main.js',
  output: {
    path: path.join(__dirname,'dist'),
    publicPath: settings.publicPath,//这个路径的设置居然还和实时修改更新有关。。。
    filename: 'build.js'
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },{
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css-loader!less-loader')
      },{
        test: /\.html$/,
        loader: 'html-loader?attrs=img:src img:data-src'
      },{
        test: /fonts\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=./fonts/[name].[ext]',
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
      },{
        test: /\.(png|jpg|gif|svg)$/,
				loader: 'url-loader?limit=8192&name=./img/[name][hash].[ext]'
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
      'vue': settings.resolveAliasVue,
      '@v': path.resolve(__dirname,'src/views/')
    },
    extensions: ['.js','.vue']
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

if (process.env.NODE_ENV == 'production') {
  config.plugins.concat([
    new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  })],[
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ])
}

console.log(config);

module.exports = config;
