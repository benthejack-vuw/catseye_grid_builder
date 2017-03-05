const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["gl-matrix", path.join(__dirname, "src/catseye.ts")],
  output: {
    path: __dirname,
    filename: "catseye.bundle.js"
  },
  resolve: {
    extensions: [".js", ".ts"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
        {
          loader:"babel-loader",
          options:{
            presets:"es2015",
            plugins:["transform-runtime"]
          },
        },
        {
          loader:"ts-loader"
        }]

      },
    ]
  },
  resolveLoader: {
    modules: ['node_modules']
  },
  devtool: "source-map",
  devServer: {
    inline: true
  }
};
