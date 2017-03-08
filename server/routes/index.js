var express = require('express');
var router = express.Router();

var USER_LIST = require('../utils/userlist');

router.get('/', function(req, res, next) {
  res.render('index', {users: USER_LIST})
});

module.exports = router;