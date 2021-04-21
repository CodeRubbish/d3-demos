const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: './src/index.jsx',
    mode: "development",
    devtool: "eval-cheap-module-source-map",
    devServer: {
        port: 3000,
        contentBase: path.join(__dirname, 'dist'),
        open: 'Google Chrome',
        hot: true, //热更新
        hotOnly: false
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
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules:{
                                auto:/\.module\.\w+$/i,
                                localIdentName: "[local]_[hash:base64:12]",
                            },
                        }
                    },
                    {
                        loader: 'sass-loader',
                    }
                ]
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html"
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
                patterns: [path.resolve(__dirname, 'icon.svg')]
            }
        )
    ]

}
