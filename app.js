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
app.use(express.static(path.join(__dirname, 'public')));

// クッキー有効化(routes処理より前に書く。)
app.use(cookieParser());
// セッション追記部分 (TODO 現状はオンメモリになっている。)
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

// loginモジュールを通過させる事で、ログインしていないユーザーにコンテンツを参照できなくする(ミドルウェア)
// console.log("before login module") // 毎回必ず発火する。
app.use(require('./login')); 
// console.log("after login module")
// routes.js と index.jade を変更する事で、/ をアクセスする場合、未ログインの場合は、ログインをページを表示し、ログイン済みの場合は、挨拶文を表示
// リクエストがきたタイミングでモジュールは発火。
app.use('/', routes);　
// app.use('/', indexRouter);
// ログアウト処理のルーティング
app.use('/logout', routes);
// app.use('/users', users);
app.use('/users', users);
// ここまで追記。


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// 任意のページもログイン対象にする   追加
app.use('/:page', routes);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
