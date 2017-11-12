var path = require('path')
var express = require('express')
var webpack = require('webpack')
var config = {
	assetsPublicPath: '/',
	assetsSubDirectory: 'static'
}
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')
var DashboardPlugin = require('webpack-dashboard/plugin');
var port = process.env.PORT || 8880

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
	publicPath: webpackConfig.output.publicPath,
	stats: {
		colors: true,
		chunks: false
	}
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
	noInfo: true,
	reload: true
})
	// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function(compilation) {
	compilation.plugin('html-webpack-plugin-after-emit', function(data, cb) {
		hotMiddleware.publish({
			action: 'reload'
		})
		cb()
	})
})

compiler.apply(new DashboardPlugin())

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

var staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

module.exports = app.listen(port, function(err) {
	if (err) {
		if (require.main === module)
			console.error(err)
		else
			throw err
		return
	}
	console.log('Listening at http://localhost:' + port + '\n')
})
