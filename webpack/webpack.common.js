const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const distPath = path.join(__dirname, '../dist');
const srcPath = path.join(__dirname, '../src');

module.exports = {
    entry: {
        content: srcPath + '/content/content.js',
        background: srcPath + '/background/background.js',
        overlay: srcPath + '/overlay/overlay.js'
    },
    output: {
        path: distPath,
        filename: '[name]/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(distPath),
        new CopyWebpackPlugin([
            { from: srcPath + '/manifest.json', to: distPath },
            { from: srcPath + '/images', to: `${distPath}/images` },
            { from: srcPath + '/content/content.css', to: `${distPath}/content/` },
            { from: srcPath + '/overlay/overlay.html', to: `${distPath}/overlay/` },
            { from: srcPath + '/overlay/overlay.css', to: `${distPath}/overlay/` },
        ])
    ],
    stats: {
        colors: true
    }
};
