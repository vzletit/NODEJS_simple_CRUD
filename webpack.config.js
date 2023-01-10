import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'

export default {
  mode: 'production',
  entry: ['./build/index.js'],
  target: 'node',
  plugins: [
    new NodePolyfillPlugin()
  ],
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    fallback: {
      fs: false
    },
    extensions: ['.js']
  },
  output: {
    filename: 'bundle.cjs',
    clean: true

  }
}
