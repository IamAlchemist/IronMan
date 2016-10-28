const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.get('/login', function (req, res, next) {
    var options = {
        title: 'IronMan Login'
    };

    res.render('login', options);
});

router.get('/register', function (req, res, next) {
    var options = {
        title: 'IronMan Register'
    };

    res.render('register', options);
});

router.get('/profile', function (req, res, next) {
    var options = {
        title: 'IronMan Register'
    };

    res.render('profile', options);
});

module.exports = router;
