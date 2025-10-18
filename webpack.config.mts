import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

export default {
  entry: './coffee-house/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve('./dist'),
    publicPath: '',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|svg|ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.mts', '.js', '.mjs'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './coffee-house/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './coffee-house/src/images', to: 'images' },
      ],
    }),
    new ESLintPlugin({
      extensions: ['ts', 'mts', 'js', 'mjs'],
      exclude: 'node_modules',
      overrideConfigFile: './.eslintrc.cjs',
    }),
  ],
  devServer: {
    static: './dist',
    port: 3000,
    open: true,
    historyApiFallback: true,
  },
  mode: 'development',
};
