const express = require('express');
const crypto = require('crypto');
const User = require('../models/user');
const router = express.Router();


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/login', checkAuthentication);
router.get('/login', function (req, res, next) {
    var options = {
        title: 'IronMan Login'
    };

    res.render('login', options);
});

router.post('/login', checkAuthentication);
router.post("/login", function (req, res) {
    var name = req.body.username,
        password = req.body.password,
        md5 = crypto.createHash('md5'),
        md5_password = md5.update(password).digest('hex');
    if (name == "" || password == "") {
        req.session.error = "请不要留白！";
        return res.redirect('/login');
    }

    User.get(name, function(err, user) {
        if (!user) {
            req.session.error = "用户不存在！";
            return res.redirect('/login');
        }

        if (user.password != md5_password) {
            req.session.error = "密码错误！";
            return res.redirect('/login');
        }

        req.session.user = user;
        req.session.success = "登录成功！";

        res.redirect('/home');
    });
});

router.get('/register', function (req, res, next) {
    var options = {
        title: 'IronMan Register'
    };

    res.render('register', options);
});

router.get('/profile', function (req, res, next) {
    var options = {
        title: 'IronMan Profile'
    };

    res.render('profile', options);
});

function authentication (req, res, next) {
    if (!req.session.user) {
        req.session.error = '请登录';
        return res.redirect('/users/login');
    }
    next();
}
function checkAuthentication (req, res, next) {
    if (req.session.user) {
        req.session.error = '已登录';
        return res.redirect('/users/profile');
    }
    next();
}

module.exports = router;
