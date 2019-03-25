
const config = {
  entry: __dirname + '/public/app.js',
  output: {
    path: __dirname + '/public/dist',
    filename: 'bundle.js'
  },
  module : {
    rules: [{
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: "babel-loader"
      }
    }, {
      test:/\.css$/,
      use:['style-loader','css-loader']
    }]
  }
};

module.exports = config;