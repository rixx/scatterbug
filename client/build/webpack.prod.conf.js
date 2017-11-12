var path = require('path')
var webpack = require('webpack')
var merge = require('webpack-merge')
var utils = require('./utils')
var path = require('path')
var projectRoot = path.resolve(__dirname, '../')
var baseWebpackConfig = require('./webpack.base.conf')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CompressionWebpackPlugin = require('compression-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var BabiliPlugin = require("babel-minify-webpack-plugin")
var webpackConfig = merge(baseWebpackConfig, {
	resolve: {
		alias: {
			'config': path.resolve(projectRoot, 'config.prod.js'),
		}
	},
	// devtool: '#source-map',
	module: {
		rules: [
			{ test: /\.vue$/, use: [{
				loader:'vue-loader',
				options: {
					loaders: {
						stylus: ExtractTextPlugin.extract({
							use: ['css-loader', 'stylus-loader'],
							fallback: 'vue-style-loader'
						})
					}
				}
			}]},
			{ test: /\.css$/, use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: 'css-loader'
			})},
			{ test: /\.styl$/, use: ExtractTextPlugin.extract({
				fallback: 'style-loader',
				use: ['css-loader', 'stylus-loader']
			})}
		]
	},
	output: {
		filename: utils.assetsPath('js/[name].[chunkhash].js'),
		chunkFilename: utils.assetsPath('js/[name].[chunkhash].js'),
		sourceMapFilename: '[file].map.js',
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			minimize: true,
			debug: false
		}),
		// new CleanWebpackPlugin(['dist'], {root: path.resolve(__dirname, '../')}),
		new webpack.DefinePlugin({
			'ENV_DEVELOPMENT': false,
			'process.env': {
				NODE_ENV: '"production"'
			},
			TARGET: process.env.TARGET == 'production' ? '"production"' : '"stage"'
		}),
		new BabiliPlugin(),
		// extract css into its own file
		new ExtractTextPlugin({
			filename: utils.assetsPath('css/[name].[contenthash].css'),
			allChunks: true
		}),
		// generate dist index.html with correct asset hash for caching.
		// you can customize output by editing /index.html
		// see https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			template: 'index.html',
			inject: true,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true
				// more options:
				// https://github.com/kangax/html-minifier#options-quick-reference
			},
			// necessary to consistently work with multiple chunks via CommonsChunkPlugin
			chunksSortMode: 'dependency'
		}),
		// split vendor js into its own file
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			chunks: ['app'],
			async: 'vendor',
			minChunks: function (module) {
				// if(module.resource && (/^.*\.(css|styl)$/).test(module.resource)) {
				// 	return false
				// }
				return module.context && module.context.indexOf("node_modules") !== -1
			}
		}),
		// extract webpack runtime and module manifest to its own file in order to
		// prevent vendor hash from being updated whenever app bundle is updated
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			chunks: ['preloader', 'vendor']
		}),
		new CompressionWebpackPlugin({
			asset: '[path].gz[query]',
			algorithm: 'gzip',
			test: new RegExp(
				'\\.(js|css)$'
			),
			threshold: 10240,
			minRatio: 0.8
		})
	]
})

module.exports = webpackConfig
