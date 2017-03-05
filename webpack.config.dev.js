const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["babel-polyfill", "gl-matrix", path.join(__dirname, "src/catseye.ts")],
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
            presets:"es2015"
          },
        },
        {
          loader:"ts-loader"
        }]

      },
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        dead_code: true,
        warnings: false
      }
    })
  ]
};
