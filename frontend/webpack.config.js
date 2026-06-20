const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'src'), // ← теперь сервер видит src
    },
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
    historyApiFallback: true,
    open: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/login.html',
      filename: 'login.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/register.html',
      filename: 'register.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/dashboard.html',
      filename: 'dashboard.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/forgot-password.html',
      filename: 'forgot-password.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/pricing.html',
      filename: 'pricing.html',
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/verify-code.html',
      filename: 'verify-code.html',
    }),
    new HtmlWebpackPlugin({
  template: './src/pages/privacy-policy.html',
  filename: 'privacy-policy.html',
}),
new HtmlWebpackPlugin({
  template: './src/pages/terms-of-use.html',
  filename: 'terms-of-use.html',
}),
new HtmlWebpackPlugin({
  template: './src/pages/contact-us.html',
  filename: 'contact-us.html',
}),
  ],
};