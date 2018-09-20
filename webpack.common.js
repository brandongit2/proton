const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintWebpackPlugin = require('stylelint-webpack-plugin');

module.exports = {
    entry:   ['./src/index.jsx'],
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src/index.html')
        }),
        new StyleLintWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test:    /\.js(x)?$/u,
                use:     'babel-loader',
                exclude: /node_modules/u
            },
            {
                test: /\.(png|svg|jpg|gif)$/u,
                use:  'file-loader'
            },
            {
                test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/u,
                use:  [
                    {
                        loader:  'file-loader',
                        options: {
                            name:       '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            }
        ]
    },
    resolve: {
        // Waiting on https://github.com/developit/preact/pull/1080 to be pulled
        // and released so that Preact can be used in place of React.
        //
        // alias: {
        //     react:       'preact-compat',
        //     'react-dom': 'preact-compat'
        // },
        extensions: ['.js', '.jsx']
    },
    optimization: {
        noEmitOnErrors: true
    },
    output: {
        filename: '[name].[hash].js',
        path:     path.resolve(__dirname, 'build')
    },
    node: {
        net: 'empty',
        fs:  'empty',
        tls: 'empty'
    }
};
