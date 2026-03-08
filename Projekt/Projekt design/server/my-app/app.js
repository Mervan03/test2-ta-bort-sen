var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors'); // <-- HÄR LADDAR VI IN CORS (1/2)

// Här importerar vi databaskopplingen och dina modeller (user, product, cart, rating) 
var db = require('./models');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors()); // <-- HÄR AKTIVERAR VI CORS INNAN ALLT ANNAT (2/2)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Denna del tvingar Sequelize att synka dina modeller med MySQL-databasen.
db.sequelize.sync({ alter: true }).then(() => {
  console.log("Tabeller är nu synkade med databasen!");
}).catch(err => {
  console.log("Fel vid synkning:", err);
});

module.exports = app;