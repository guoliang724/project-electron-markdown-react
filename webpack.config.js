const path = require("path");
const webpack = require("webpack");
const HtmlWepackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const lessReg = /\.(less|css)$/;
const moduleRegex = /\.module\.(less|css)$/;

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[hash:5].js",
  },
  devtool: "source-map",
  module: {
    rules: [
      // 处理tsx
      {
        test: /\.tsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
            presets: [
              ["@babel/preset-env"],
              [
                "@babel/preset-react",
                {
                  runtime: "automatic",
                },
              ],
              [
                "@babel/typescript",
                {
                  isTSX: true,
                  allExtensions: true,
                },
              ],
            ],
            plugins: [
              [
                "import",
                {
                  libraryName: "antd",
                  libraryDirctory: "es",
                  style: "css",
                },
              ],
              ["@babel/plugin-transform-runtime"],
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
            ],
          },
        },
        exclude: /node_modules/,
      },
      // 处理css/less
      {
        test: lessReg,
        exclude: /node_modules/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            // 设置importLoaders是因为当css中有import引入其他less文件时，可以退后两步，从less-loader开始处理
            options: {
              importLoaders: 2,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["postcss-preset-env"]],
              },
            },
          },
          "less-loader",
        ],
      },
      // 处理其他资源
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        type: "asset",
      },
      // 处理字体资源
      {
        test: /\.(woff2?|eot|ttf)$/,
        type: "asset/resource",
        generator: {
          filename: "font/[name].[hash:6][ext]",
        },
      },
    ],
  },
  devServer: {
    host: "127.0.0.1",
    port: 8080,
    open: true,
    historyApiFallback: {
      index: "./index,html",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "~": path.resolve(__dirname, "node_modules"),
    },
    extensions: [".tsx", ".jsx", ".ts", ".js", ".json"],
  },
  plugins: [
    new HtmlWepackPlugin({
      template: "./src/index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
  ],
};
