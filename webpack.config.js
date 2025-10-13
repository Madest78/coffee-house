const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './coffee-house/index.js', // путь к твоему main JS
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    clean: true, // чистит dist перед сборкой
  },
  module: {
    rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'], // собираем CSS в файл
        },
        {
          test: /\.html$/i,
          loader: 'html-loader', // чтобы импорты html в JS работали
        },
        {
          test: /\.(png|jpe?g|svg|ico)$/i,
          type: 'asset/resource', // копирует картинки и возвращает путь
          generator: {
          filename: 'images/[name][ext]', // кладём их в dist/images
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './coffee-house/index.html', // твой основной HTML
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './coffee-house/src/images', to: 'images' }, // копируем все картинки
      ],
    }),
  ],
devServer: {
  static: './dist', // откуда сервер отдаёт файлы
  port: 3000,       // порт, на котором будет локальный сервер
  open: true,       // автоматически откроет браузер
  historyApiFallback: true, // важно для SPA: все пути ведут на index.html
},
  mode: 'development',
};
