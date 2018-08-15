const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:   ['./src/index.jsx'],
    plugins: [
        new CleanWebpackPlugin(['build']),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html')
        })
    ],
    module: {
        rules: [
            {
                test:    /\.js(x)?$/u,
                use:     'babel-loader',
                exclude: /node_modules/u
            },
            {
                test: /\.css$/u,
                use:  [
                    'style-loader',
                    'css-loader'
                ],
                exclude: /node_modules/u
            },
            {
                test: /\.(png|svg|jpg|gif)$/u,
                use:  'file-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    optimization: {
        noEmitOnErrors: true
    },
    output: {
        filename:   '[name].bundle.js',
        path:       path.resolve(__dirname, 'build'),
        publicPath: '/'
    },
    node: {
        net: 'empty',
        fs:  'empty',
        tls: 'empty'
    }
};
