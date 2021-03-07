// TODO ユーザー情報のDB、ハッシュ化
const authInfo = {
  name: "tepi",
  pwd: "password",
}; 

module.exports = function (req, res, next) {
  const method = req.method.toLowerCase();
  const user = req.body;
  const logout = method === "post" && req.url === "/logout";
  const login = method === "post" && user;

  // ログアウト
  if (logout) {
    delete req.session.user;
    // res.redirect('/') // TODO URL修正処理するとエラーログ吐く
  }

  // ログイン
  if (login) {
    if (user.name === authInfo.name && user.pwd === authInfo.pwd) {
      // セッションにユーザー情報を保管
      req.session.user = {
        name: user.name,
        pwd: user.pwd,
      };
    }
  }

  // セッションが無ければ ログイン画面へ
  if (!req.session.user) {
    req.url = "/";
  }

  next();
};
