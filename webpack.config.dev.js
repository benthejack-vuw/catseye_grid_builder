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
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader:"babel-loader",
            options: { presets: [ [ 'es2015', { modules: false } ] ] }
          },
         {
           loader: 'ts-loader'
         }
       ]

      }
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
