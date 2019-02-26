var webpack = require('webpack');
var path = require('path');

module.exports = {
	entry: {
		App: './src/index.js'
	},
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'js/bundle.js'
	},
	resolve: {
		extensions: ['.js', '.jsx']
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader'
			}
		},
		{
			test: /\.css$/,
			exclude: /node_modules/,
			use: ["style-loader", "css-loader"]
		},
		{
			test: /\.(png|jpg|jpeg|gif|svg)$/,
			use: ['url-loader?limit=925000']
		}]
	},
	mode: 'production'
}
