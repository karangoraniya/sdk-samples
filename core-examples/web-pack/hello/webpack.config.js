const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    devtool: 'inline-source-map',
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        compress: true,
        port: process.env.WEBPACK_DEV_SERVER_PORT || 4000,
        disableHostCheck: true,
        historyApiFallback: true,
    },
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, './dist'),
        publicPath: '/',
        filename: '[name].bundle.js',
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [{ from: './node_modules/@eversdk/lib-web/eversdk.wasm' }],
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: false,
            debug: true,
        }),
    ],
}
