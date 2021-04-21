const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
module.exports = {
    entry: './src/index.jsx',
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    devServer: {
        port: 3000,
        contentBase: path.join(__dirname, 'dist'),
        open: 'Google Chrome',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CleanWebpackPlugin()
    ]

}
