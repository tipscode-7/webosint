const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // единая точка входа для JS
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // очищает dist перед сборкой
  },
  devServer: {
    static: './dist',
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8000', // прокси на бэкенд
    },
    historyApiFallback: true, // чтобы работал роутинг
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/login.html',
      filename: 'login.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/register.html',
      filename: 'register.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/dashboard.html',
      filename: 'dashboard.html',
      chunks: ['main'],
    }),
    // Можно оставить index.html как редирект (или просто как заглушку)
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['main'],
    }),
  ],
};