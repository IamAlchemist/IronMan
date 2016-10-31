const express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),

    session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    mongodb = require('./libs/mongodb'),

    bodyParser = require('body-parser'),

    routes = require('./routes/index'),
    users = require('./routes/users'),
    exercises = require('./routes/exercises'),
    learn = require('./routes/learn'),
    auth = require('./libs/authentication');

const tracer = require('./libs/ironmanLogger');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: 'really secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
    store: new MongoStore({ mongooseConnection: mongodb.connection })
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(/.*/, auth.checkAuth);
app.use('/', routes);
app.use('/users', users);
app.use('/exercises', exercises);
app.use('/learn', learn);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    tracer.error(req.baseUrl + req.path);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.locals.pretty = true;

    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
