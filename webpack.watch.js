var path = require("path");
module.exports = {
  entry: path.resolve("./src/index.js"),
  mode: "development",
  output: {
    libraryTarget: "umd"
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
  externals: {
    react: {
      commonjs: "react",
      commonjs2: "react"
    },
    "react-dom": {
      commonjs: "react-dom",
      commonjs2: "react-dom"
    }
  }
};
