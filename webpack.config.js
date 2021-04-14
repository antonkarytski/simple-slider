const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
 context: path.resolve(__dirname, "src"),
 mode: "production",
 entry: ["@babel/polyfill", "./index.ts"],
 output: {
	filename: "SimpleSlider.js",
	path: path.resolve(__dirname, "dist"),
 },
 resolve:{
	extensions: [".js", ".jsx", ".wasm", ".ts", ".tsx"]
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
	hot: true,
	watchOptions: {
	 aggregateTimeout: 300,
	 poll: true
	},
 },
 module: {
	rules: [
	 getCssLoader(/\.css$/),
	 getCssLoader(/\.s[ac]ss$/, ["sass-loader"]),
	 getBabelLoader(/\.m?js$/),
	 getBabelLoader(/\.ts$/, ["@babel/preset-typescript"]),
	 {
		test: /\.[tj]s$/,
		exclude: /node_modules/,
		loader: "eslint-loader",
	 },
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
		plugins: ["@babel/plugin-proposal-class-properties"],
	 },
	},
 }
}