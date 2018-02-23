const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/public',
        filename: './bundle.js'
    },
    devServer: {
        port: 8080,
        contentBase: './public'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            modules: path.resolve(__dirname, './node_modules/'),
            jquery: 'modules/jquery/dist/jquery.min'
        }        
    },
    plugins: [        
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new ExtractTextPlugin('app.css')
    ],
    module: {
        loaders: [
            {
                test: /.js[x]?$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
                query: {
                    presets: [
                        'es2015', 'react'
                    ],
                    plugins: ['transform-object-rest-spread']
                }
            }, {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({fallback: "style-loader", use: "css-loader"})
            }, {
                test: /\.woff|.woff2|.ttf|.eot|.svg*.*$/,
                loader: 'file-loader'
            }
        ]
    }
}