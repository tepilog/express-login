const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const logger = require('morgan');

const routes = require('./routes/index');
const users = require('./routes/users');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// セッション追記部分 (TODO 現状はオンメモリ)
key = {
  secret: 'zakuzaku',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 180000
  }
};
// セッションを追跡するための設定で、この設定ではオンメモリ
app.use(session(key));

// loginモジュールの適用(ミドルウェア：ログイン, ログアウト, セッション未保持の際に処理発火)
app.use(require('./login')); 
app.use('/', routes);　
app.use('/logout', routes);
app.use('/users', users);


app.use((req, res, next) =>{
  next(createError(404));
});

// 任意のページもログイン対象にする
app.use('/:page', routes);

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
