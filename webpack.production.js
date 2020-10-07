const { merge } = require('webpack-merge')
const common = require('./webpack.common')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
	mode: 'production',
	optimization: {
		minimize: true,
		minimizer: [new TerserWebpackPlugin({ test: /\.js$/ })],
	},
})
