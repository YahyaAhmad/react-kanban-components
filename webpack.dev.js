var path = require("path");
module.exports = {
  entry: path.resolve("./dist/index.js"),
  resolve: {
    alias: {
      "react-dom": "@hot-loader/react-dom"
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    filename: path.join(__dirname, "dist"),
    compress: true,
    hot: true,
    port: 9000
  }
};
