
const config = {
  entry: __dirname + '/public/calendar/react-calendar.jsx',
  output: {
    path: __dirname + '/public/dist',
    filename: 'bundle.js'
  },
  module : {
    rules: [{
      test: /\.(jsx)$/,
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