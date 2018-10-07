const path = require('path');
const config = require('./package.json');

const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
require('dotenv').config();

const PROD = process.env.NODE_ENV === 'production';


PROD ? [
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {warnings: false}
    }))
] : '';

module.exports = {
    entry: path.resolve(__dirname, 'src/index.js'),
    output: {
        path: path.resolve(__dirname),
        filename: 'index.js',
        library: '',
        libraryTarget: 'commonjs'
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};

