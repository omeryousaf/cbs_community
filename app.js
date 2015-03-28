var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var passport = require('./services/LoginSignup.js');
var expressSession = require('express-session');

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

app.post('/getMembers', function (req, res, next) {
    //passport.authenticate('local'), function(req, res) {
    //res.send(req.user);
    console.log("b4 authentication.. " + req.body.username + ' ' + req.body.password);
    //res.send({member: "success"});
    passport.authenticate('local', function(err, user, info) {
        if (err) { // when something goes wrong with the database server or in connecting to it
            console.log('status: 500');
            res.status(500).send({ reason: 'database error' });
        } else if (info) { // when credentials were rejected by authentication module (LoginSignup.js)
            console.log('status: 401, unauthorised');
            res.status(401).send({ reason: info.message });
        } else {
            req.login(user, function(err) {
                if (err) {
                    console.log('status: 500 could not save session'); // what response to send in this case to the front end?
                } else {
                    res.send({member: req.user}); // verified member
                }
            });
        }
    })(req, res, next);
});

app.get('*', function(req, res) {
    res.render('views/index.html'); // load the single view file from 'public' folder as that's been configured as the default
    // lookup location for views. (after this first load, angular will handle the page changes on the front-end)
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

//var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
//var bodyParser = require('body-parser');
//
//var routes = require('./routes/index');
//var users = require('./routes/users');
//
//var app = express();
//
//// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
//
//// uncomment after placing your favicon in /public
////app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
//
//app.use('/', routes);
//app.use('/users', users);
//
//// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});
//
//// error handlers
//
//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});
//
//
//module.exports = app;
