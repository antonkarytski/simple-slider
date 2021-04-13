const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");


function getBabelLoader(){

}


module.exports = {
	context: path.resolve(__dirname, "src"),
	mode: "production",
	entry: ["@babel/polyfill", "./index.ts"],
	output: {
		filename: "SimpleSlider.js",
		path: path.resolve(__dirname, "dist"),
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: "simple-slider.css",
		}),
	],
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		open: true,
		port: 3000,
	},
	module: {
		rules: [
			getCssLoader(/\.css$/),
			getCssLoader(/\.s[ac]ss$/,["sass-loader"]),
			getBabelLoader(/\.m?js$/),
			getBabelLoader(/\.ts$/, ["@babel/preset-typescript"]),
		],
	},
}


function getCssLoader(pattern, loaders = []){
	return {
		test: pattern,
		use: [
			{
				loader: MiniCssExtractPlugin.loader,
				options: {},
			},
			"css-loader",
			...loaders],
	}
}

function getBabelLoader(pattern, presets = []){
	return {
		test: pattern,
		exclude: /node_modules/,
		use: {
			loader: "babel-loader",
			options: {
				presets: ["@babel/preset-env", ...presets],
				plugins: ["@babel/plugin-proposal-class-properties"]
			}
		}
	}
}