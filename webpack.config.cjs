const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
    mode: 'production',    
    entry: ['./build/index.js'],
    target: 'node',
    plugins: [
      new NodePolyfillPlugin()
  ],
    module: {
      rules: [
        { test: /.js$/,
        exclude: /node_modules/, },
      ],
    },
    resolve: {
      fallback: {
        "fs": false
    },
      extensions: ['.js'],
    },
    output: {
      filename: 'bundle.cjs',
      
    }};