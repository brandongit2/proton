const merge = require('webpack-merge');

const common = require('./webpack.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode:    'development',
    module:  {
        rules: [
            {
                test: /\.scss$/u,
                use:  [
                    'style-loader',
                    {
                        loader:  'css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap:     true
                        }
                    },
                    {
                        loader:  'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ],
                exclude: /node_modules/u
            },
        ]
    }
});
