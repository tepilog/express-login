// TODO ユーザー情報のDB、ハッシュ化
const authInfo = {
  name: "tepi",
  pwd: "password",
}; 

module.exports = (req, res, next) => {

  const method = req.method.toLowerCase();
  const user = req.body;
  const logout = method === "post" && req.url === "/logout";
  const login = method === "post" && user;

  // const url = new URL(req.url)
  // console.log("method", method, url.pathname) // get , /(パス)

  // req.flash("error", "問題なし")

  // ログアウト処理時
  if (logout) {
    delete req.session.user;
    res.redirect('/')
    return
  }

  // ログイン処理時
  if (login) {
    // Boolean
    const valid = user.name === authInfo.name && user.pwd === authInfo.pwd;
    if (valid) {
      // セッションにユーザー情報を保管
      req.session.user = {
        name: user.name,
        pwd: user.pwd,
      };
    } else {
      req.flash("error", "ログイン情報に誤りがあります。")
    }
  }

  // セッションが無ければ ログイン画面へ
  if (!req.session.user) {
    req.url = "/";
  }

  next();
};
