/**
 * Created by wizard on 10/26/16.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    var options = {};
    res.render('learn', options);
});

router.get('/getForm', function (req, res, next) {
    console.log(req.query);
    res.send('ok');
});

module.exports = router;