const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    mode:         'production',
    devtool:      'nosources-source-map',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache:         true,
                parallel:      true,
                sourceMap:     true,
                uglifyOptions: {
                    compress: {
                        ecma: 6
                    }
                }
            }),
            new OptimizeCSSAssetsPlugin({}),
            new BundleAnalyzerPlugin()
        ],
        runtimeChunk: 'single',
        splitChunks:  {
            cacheGroups: {
                vendor: {
                    test:   /[\\/]node_modules[\\/]/u,
                    name:   'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.scss$/u,
                use:  [
                    MiniCssExtractPlugin.loader,
                    {
                        loader:  'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    'sass-loader'
                ],
                exclude: /node_modules/u,
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename:      '[name].[hash].css',
            chunkFilename: '[name].[hash].css'
        }),
        new CleanWebpackPlugin(['build'])
    ]
});
