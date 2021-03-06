const users = { tepi: "password" }; // ユーザーパスワード

module.exports = function (req, res, next) {
  const method = req.method.toLowerCase();
  const user = req.body;
  const logout = method === "post" && req.url === "/logout";
  const login = method === "post" && user;

  // console.log("login module", method, user, users, logout, login)
  console.log("login module", req.body["name"], req.body["pwd"])

  // ログアウト
  if (logout) {
    delete req.session.user;
  }

  // ログイン
  if (login) {
    Object.keys(users).forEach(function (name) {
      if (user.name === name && user.pwd === users[name]) {
        req.session.user = {
          name: user.name,
          pwd: user.pwd,
        };
      }
    });
  }

  // セッションが無ければ ログイン画面へ
  if (!req.session.user) {
    req.url = "/";
  }

  next();
};
