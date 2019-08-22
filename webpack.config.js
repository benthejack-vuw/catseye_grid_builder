const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if(process.env.NODE_ENV === 'test'){
  require('dotenv').config({path: '.env.test' });
}else if(process.env.NODE_ENV === 'development'){
  require('dotenv').config({path: '.env.development' });
}

module.exports = (env)=>{

  const devMode = env !== "production";

  return {
    entry: './src/app.js',
    output: {
      path:path.join(__dirname, 'public', 'assets'),
      filename:'bundle.js'
    },
    module:{
      rules:[

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
        loader: 'babel-loader'
        }
      },

      {
        test: /\.s?css$/,
        use:[
          {loader: MiniCssExtractPlugin.loader},
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          },  
        ]
      }

      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        path:path.join(__dirname, 'public', 'assets'),
        filename: 'styles.css',
        chunkFilename: 'styles.css',
      }),
      new webpack.DefinePlugin({
        'process.env.FIREBASE_API_KEY':JSON.stringify(process.env.FIREBASE_API_KEY),
        'process.env.FIREBASE_AUTH_DOMAIN':JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
        'process.env.FIREBASE_DATABASE_URL':JSON.stringify(process.env.FIREBASE_DATABASE_URL),
        'process.env.FIREBASE_PROJECT_ID':JSON.stringify(process.env.FIREBASE_PROJECT_ID),
        'process.env.FIREBASE_STORAGE_BUCKET':JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
        'process.env.FIREBASE_MESSAGE_SENDER':JSON.stringify(process.env.FIREBASE_MESSAGE_SENDER),
        'process.env.FIREBASE_APP_ID':JSON.stringify(process.env.FIREBASE_APP_ID),
      })
    ],
    devtool: devMode ? 'inline-source-map' : 'source-map',
    devServer:{
      contentBase: path.resolve(__dirname, 'public'),
      publicPath: '/assets/', //publicPath is relative to contentBase and doesn't seem to like absolute paths!
      watchContentBase: true,
      historyApiFallback:true
    }

  }

};
