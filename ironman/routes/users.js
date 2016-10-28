const express = require('express');
const crypto = require('crypto');
const User = require('../models/user');
const router = express.Router();


/* GET users listing. */
router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/login', noCheckAuthentication);
router.get('/login', function (req, res) {
    var options = {
        title: 'IronMan Login'
    };

    res.render('login', options);
});

router.post('/login', noCheckAuthentication);
router.post("/login", function (req, res) {
    var name = req.body.username,
        password = req.body.password,
        md5 = crypto.createHash('md5'),
        md5_password = md5.update(password).digest('hex');
    if (name == "" || password == "") {
        req.session.error = "请不要留白！";
        return res.redirect('/users/login');
    }

    User.get(name, function(err, user) {
        if (!user) {
            req.session.error = "用户不存在！";
            return res.redirect('/users/login');
        }

        if (user.password != md5_password) {
            req.session.error = "密码错误！";
            return res.redirect('/users/login');
        }

        req.session.user = user;
        req.session.success = "登录成功！";

        res.redirect('/users/profile');
    });
});

router.get('/register', noCheckAuthentication);
router.get('/register', function (req, res) {
    var options = {
        title: 'IronMan Register'
    };

    res.render('register', options);
});

router.post("/register", noCheckAuthentication);
router.post("/register", function (req, res) {

    var name = req.body.username,
        password = req.body.password,
        repassword = req.body['repassword'];

    if (name == "" || password == "" || repassword == "") {
        req.session.error = "请不要留白！";
        return res.redirect('/users/register');
    }

    if (password != repassword) {
        req.session.error = "两次密码输入不一样";
        return res.redirect('/users/register');
    }

    var md5 = crypto.createHash('md5'),
        passwd = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        password: passwd
    });

    User.get(newUser.name, function (err, user) {
        if (user) {
            req.session.error = "用户已经存在!";
            return res.redirect('/users/register');
        }

        newUser.save(function (err, user) {
            if (err) {
                req.session.error = err;
                return res.redirect('/users/register');
            }

            req.session.user = user;
            req.session.success = "注册成功！";
            res.redirect('/users/profile');
        });

    });
});

router.get('/profile', checkAuthentication);
router.get('/profile', function (req, res) {
    var options = {
        title: 'IronMan Profile'
    };

    res.render('profile', options);
});

function checkAuthentication (req, res, next) {
    if (!req.session.user) {
        req.session.error = '请登录';
        return res.redirect('/users/login');
    }
    next();
}

function noCheckAuthentication (req, res, next) {
    if (req.session.user) {
        req.session.error = '已登录';
        return res.redirect('/users/profile');
    }
    next();
}

module.exports = router;
