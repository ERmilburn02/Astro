const webpack = require("webpack");
const path = require("node:path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    stats: isProduction ? "errors-only" : "minimal",
    entry: "./src/index.ts",

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "js/[name].[contenthash].js",
    },

    devServer: {
      compress: true,
      allowedHosts: "all",
      static: false,
      client: {
        logging: "warn",
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      },
      port: 3000,
      host: "0.0.0.0",
    },

    performance: { hints: false },

    devtool: isProduction ? "source-map" : "eval-source-map",

    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            ecma: 6,
            compress: { drop_console: true },
          },
        }),
      ],
      runtimeChunk: isProduction ? "single" : false,
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      },
    },

    module: {
      rules: [
        {
          test: /\.ts(x)?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },

    plugins: [
      new CopyPlugin({
        patterns: [{ from: "static/" }],
      }),

      new HtmlWebpackPlugin({
        template: "src/index.ejs",
        hash: false,
        minify: "auto",
      }),
    ],
  };
};
