const express = require('express');
const router = express.Router();

const render = (req, res, next) => {
  res.render('index', { title: 'Express', user: req.session.user });
}

router.get('/', function(req, res, next) {
  render(req, res, next);
});

router.post('/', function(req, res, next) {
  render(req, res, next);
});


module.exports = router;
