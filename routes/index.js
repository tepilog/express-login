const express = require('express');
const router = express.Router();

const render = (req, res, next) => {
  res.render('index', {
    user: req.session.user,
    flash: req.flash("error")
  });
}

router.get('/', function(req, res, next) {
  render(req, res, next);
});

router.post('/', function(req, res, next) {
  render(req, res, next);
});


module.exports = router;
