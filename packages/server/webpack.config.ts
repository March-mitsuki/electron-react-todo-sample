import { Configuration } from "webpack";
import webpackNodeExternals from "webpack-node-externals";
import path from "path";

const server: Configuration = {
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
  },
  entry: {
    server: path.resolve(__dirname, "src/index.ts"),
  },
  devtool: "source-map",
  target: "node",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        loader: "ts-loader",
      },
    ],
  },
  externals: [
    webpackNodeExternals({
      modulesFromFile: true,
    }),
  ],
  externalsPresets: { node: true },
};

module.exports = server;
