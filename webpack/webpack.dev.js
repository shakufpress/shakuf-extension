const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development',
    watch: true,
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ],
    resolve: {
        alias: {
            "styled-components": path.resolve(__dirname, "node_modules", "styled-components"),
        }
    }
});
