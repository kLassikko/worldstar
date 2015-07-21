var express = require('express');
var router = express.Router();
var strava = require('strava-v3');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
