var webpack = require("webpack");

module.exports = {
  entry: [
    "react-hot-loader/patch",
    "./src/index.js"
  ],
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: ["babel-loader"]
    },
    {
      include: /\.json$/,
      loader: ["json-loader"]
    },
    {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    },
    {
      test: /\.png$|\.eot$|\.ttf$|\.woff$|\.gif$|\.svg$|\.woff2$|\.jpg$/,
      loader: "file-loader"
    }]
  },
  resolve: {
    extensions: [".json", ".js", ".jsx"]
  },
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "bundle.js"
  },
  devServer: {
    contentBase: "./dist",
    host: "0.0.0.0",
    port: 5050,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('local')
    })
  ]
};
