var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.urlencoded({ extended: false })); // omitting the "{ extended: false }" parameter here results in the
// warning "body-parser deprecated undefined extended: provide extended option" on executing the 'node app.js' command
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); // _dirname = name/path of current directory. this command
// configures express to look for static content like images linked in html pages, js files, etc. in public folder.

//app.get('/', function(req, res){
//    res.render( 'index', { title: 'Sign Up' } ); // _dirname = name/path of current directory
//});
//app.get('/complete-profile', function(req, res){
//    res.render( 'profile-update-form', { title: 'Sign Up' } ); // _dirname = name/path of current directory
//});
var nano = require('nano');
app.get('/getMembers', function (req, res) {
    var localDbServerAddr = 'http://127.0.0.1:5984';
    var dbServer = nano(localDbServerAddr);
    var membersDb = dbServer.db.use('members');
    membersDb.get('5e03e08f4984706160ae73e223000d0b', function (err, courseDoc) {
        console.log(courseDoc);
        if( err ) {
            res.send( "member could not be fetched" );
        }
        else {
            res.send( courseDoc );
            res.end();
        }
    });
});
app.get('*', function(req, res) {
    res.render('index.html'); // load the single view file (angular will handle the page changes on the front-end)
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
