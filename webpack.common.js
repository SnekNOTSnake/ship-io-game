const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: {
		game: path.resolve(__dirname, 'src/client/index.js'),
	},
	output: {
		filename: '[name].bundle.[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		alias: {
			Constants: path.resolve(__dirname, 'src/shared/constants.js'),
		},
		extensions: ['.js', '.json'],
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [MiniCSSExtractPlugin.loader, 'css-loader'],
				include: path.resolve(__dirname, 'src'),
			},
			{
				test: /\.js$/,
				use: ['babel-loader'],
				include: path.resolve(__dirname, 'src'),
			},
		],
	},
	plugins: [
		new MiniCSSExtractPlugin(),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src/client/html/index.html'),
			minify: true,
		}),
	],
}
