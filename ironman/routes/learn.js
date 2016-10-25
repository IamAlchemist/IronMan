/**
 * Created by wizard on 10/26/16.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var options = {};
    res.render('learn', options);
});

module.exports = router;