const path = require("path");

module.exports = {
  entry: ["gl-matrix", "babel-polyfill", path.join(__dirname, "src/catseye/catseye.ts")],
  output: {
    path: __dirname,
    filename: "catseye.bundle.js"
  },
  resolve: {
    extensions: ["", ".js", ".ts"]
  },
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        loaders: ["babel?presets=es2015", "ts"]
      },
    ]
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  devtool: "source-map",
  devServer: {
    inline: true
  }
};
