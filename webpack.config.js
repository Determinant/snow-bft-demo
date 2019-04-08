const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = (env, argv) => {
    const prodMode = argv.mode == 'production';
    return {
        entry: {
            index: "./src/index.tsx",
        },
        output: {
            path: path.join(__dirname, "/dist"),
            filename: "[name].js"
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"]
        },
        devtool: "source-map",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: ['ts-loader']
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: ["source-map-loader"],
                    enforce: "pre"
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                },
                { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                chunks: ['index'],
                template: "./src/index.html",
                filename: "./index.html"
            }),
        ],
    };
};
