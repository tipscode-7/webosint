const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  devServer: {
    static: './dist',
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8000',
    },
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
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],
};
EOF 
cat > frontend/src/index.html <<EOF
<!DOCTYPE html>
<html>
<head><title>OSINT Platform</title></head>
<body>
  <div id="root"></div>
  <script src="bundle.js"></script>
</body>
</html>
