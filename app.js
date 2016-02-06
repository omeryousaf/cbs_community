var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('./services/authentication.js');
var expressSession = require('express-session');
var routes = require('./routes/index.js');
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static(__dirname + '/public')); // _dirname = name/path of current directory. this command
    // configures express to look for static content like images linked in html pages, js files, etc. in public folder.
app.use(expressSession( { // not including 'resave' and 'saveUninitialized' keys in this json results in deprecation warning
    secret: 'mySecretKey',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: false })); // omitting the "{ extended: false }" parameter here results in the
// warning "body-parser deprecated undefined extended: provide extended option" on executing the 'node app.js' command
app.use(bodyParser.json());

app.post('/isUsernameUnique', routes.isUsernameUnique);
app.post('/authenticateLogin', routes.authenticateLogin);
app.post('/upload-profile-image', multipartMiddleware, routes.uploadProfileImage);
app.get('/getMember/:id', routes.getMember);
app.get('/profileimage', routes.getProfileImage);

app.get('*', function(req, res) {
    res.render('index.html'); // load the single view file from 'public' folder as that's been configured as the default
    // lookup location for views. (after this first load, angular will handle the page changes on the front-end)
});

app.set('port', process.env.PORT || 3000);
//var server = app.listen( app.get('port'), function() {
//    console.log('Listening on port %d', server.address().port);
//});

module.exports = app;