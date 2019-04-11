const path = require("path");

module.exports = {
  mode: "development",
  entry: require.resolve("./index.html"),
  output: {
    path: path.resolve(__dirname, "build")
  },
  resolveLoader: {
    modules: ["node_modules", path.resolve(__dirname, "loaders")]
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          "file-loader?name=[name].amp.[ext]",
          "extract-loader",
          "amp-loader"
        ]
      }
    ]
  }
};
