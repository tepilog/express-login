const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const logger = require('morgan');
// const router = express.Router()

const routes = require('./routes/index');
const users = require('./routes/users');
const login = require('./login')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'session sample',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 180000
  }
}));
app.use(flash())
// app.use(router)

// loginモジュールの適用(ミドルウェア：ログイン, ログアウト, セッション未保持の際に処理発火)
app.use(login);
// TODO res.localsの使い方
// app.use((res, req, next) => {
  // res.locals.user = res.session.user // ローカルにuser変数を格納。
  // res.locals.flash = req.flash() // フラッシュ追加(ミドルウェア)
  // res.locals.test = "test"
  // next()
// })
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
