/* IMPORTANT :
    NODE_ENV is different from APP_ENV.
    It is related to build process not related to app's environment.
    There are 2 possible values we can use for NODE_ENV here. That are 'local' when we do local development
    and 'production' when we build.
*/

const webpack = require('webpack'),
    path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin,
    buildDirectory = path.resolve(__dirname, 'public/build'),
    isLocalDev = (process.env.NODE_ENV !== 'production'),
    showReport = (process.env.SHOW_REPORT === 'yes');

const rules = [
    {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
    },
    {
        test: /\.(less|css)$/,
        use: ExtractTextWebpackPlugin.extract({
            fallback: 'style-loader',
            use: [
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: isLocalDev,
                        minimize: isLocalDev //minimize css in build to avoid bundling newline chars in js chunk
                    }
                },
                'postcss-loader',
                {
                    loader: 'less-loader',
                    options: {
                        sourceMap: isLocalDev
                    }
                }
            ]
        })
    },
    {
        test: /\.(jpe?g|png|gif|webp|svg)$/,
        loader: 'file-loader?name=img/[name].[hash:8].[ext]'
    },
    {
        test: /\.(woff|woff2|ttf|eot)$/,
        loader: 'file-loader?name=font/[hash:8].[ext]'
    },
    {
        test: /\.json$/,
        loader: 'json-loader',
        include: path.resolve(__dirname, 'public/locale'),
    }
]

const plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'local')
    }),
    new ExtractTextWebpackPlugin({
        filename: 'style/[contenthash:20].css',
        disable: isLocalDev
    }),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'public/index-template.html'),
        filename: path.resolve(__dirname, 'public/build/index.hbs'),
        favicon: path.resolve(__dirname, 'public/assets/img/favicon.ico')
    }),
    //automatically load the modules
    //when the key is identified in a file
    new webpack.ProvidePlugin({
        React: 'react',
        ReactDOM: 'react-dom'
    }),
    // To prevent longterm cache of vendor chunks
    // extract a 'manifest' chunk, then include it to the app
    new webpack.optimize.CommonsChunkPlugin({
        names: ['lib', 'manifest']
    })
]

const reportsPlugin = !showReport ? [] :
    [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false
        })
    ]

const localDevPlugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
]

const buildPlugins = [
    new CleanWebpackPlugin(
        buildDirectory
    ),
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            drop_console: false
        }
    })
]

const getEntryFiles = function () {
    var entry = new Object();

    entry.main = [path.resolve(__dirname, 'public/src/index')];
    entry.lib = [
        'react', 'react-router', 'react-dom', 'redux-thunk', 'redux',
        'react-redux', 'lodash.curryright', 'react-router-redux', 'react-intl',
        'immutable', 'redux-immutable',
        'cookie-jeep', 'es6-promise/auto', 'es6-object-assign/auto', 'array-from'
    ];
    //add HMR points here
    isLocalDev && entry.main.push('webpack-hot-middleware/client', 'react-hot-loader/patch');

    return entry;
}

module.exports = {

    entry: getEntryFiles(),

    output: {
        path: buildDirectory,
        publicPath: '/',
        //HMR requires [hash]. It doesn't work with chunkhash
        //But build needs chunkhash
        filename: isLocalDev ? 'js/[name].[hash].js' : 'js/[name].[chunkhash].js'
    },

    module: {
        rules: rules
    },

    devtool: isLocalDev ? 'source-map' : false,

    plugins: isLocalDev
        ? [].concat(plugins, localDevPlugins, reportsPlugin)
        : [].concat(plugins, buildPlugins, reportsPlugin),

    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'public'),
            path.resolve(__dirname, 'public/src')
        ],
        extensions: ['.js', '.jsx', '.less'],
        descriptionFiles: ['package.json', 'bower.json', '.bower.json']
    },

    stats: 'minimal'
}
