const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Handle both .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader' // Transpile JS and JSX files
        }
      },
      {
        test: /\.css$/, // Handle .css files
        use: ['style-loader', 'css-loader'] // Apply these loaders for CSS
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'] // Resolve these extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html' // Use your HTML template
    })
  ],
  mode: 'production' // Change to 'development' for local testing
};
