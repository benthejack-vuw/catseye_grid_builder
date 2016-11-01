const path = require("path");

module.exports = {
  entry: ["babel-polyfill", path.join(__dirname, "src/catseye/catseye-grid-builder.ts")],
  output: {
    path: __dirname,
    filename: "catseye-grid-builder.bundle.js"
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
  devtool: "source-map",
  devServer: {
    inline: true
  }
};
