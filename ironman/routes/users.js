"use strict";

const express = require('express');
const crypto = require('crypto');
const User = require('../models/user');
const logger = require('../libs/ironmanLogger');
const ApiResult = require('../libs/api-result');
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

router.get('/register', noCheckAuthentication);
router.get('/register', function (req, res) {
    var options = {
        title: 'IronMan Register'
    };

    res.render('register', options);
});

router.get('/profile', checkAuthentication);
router.get('/profile', function (req, res) {
    var options = {
        title: 'IronMan Profile'
    };

    res.render('profile', options);
});

router.get("/logout", checkAuthentication);
router.get("/logout", function (req, res) {
    req.session.user = null;
    res.redirect('/');
});

function checkAuthentication(req, res, next) {
    if (!req.session.user) {
        req.session.error = '请登录';
        return res.redirect('/users/login');
    }
    next();
}

function noCheckAuthentication(req, res, next) {
    if (req.session.user) {
        req.session.error = '已登录';
        return res.redirect('/users/profile');
    }
    next();
}


/* POST */
router.post("/login", function (req, res) {

    var name = req.body.email,
        password = req.body.password,
        md5 = crypto.createHash('md5'),
        md5_password = md5.update(password).digest('hex');

    if (name == "" || password == "") {
        const result = new ApiResult(1);
        logger.info(result.message);
        return res.send(result);
    }

    User.get(name, function (err, user) {
        if (!user) {
            const result = new ApiResult(2);
            logger.info(result.message);
            return res.send(result);
        }

        if (user.password != md5_password) {
            const result = new ApiResult(3);
            logger.info(result.message);
            return res.send(result);
        }

        req.session.user = user;
        req.session.success = "登录成功！";

        res.send(new ApiResult(0));
    });
});

router.post("/register", function (req, res) {

    const name = req.body.username,
        password = req.body.password,
        repassword = req.body.repassword;

    if (name == "" || password == "" || repassword == "") {
        const result = new ApiResult(4);
        logger.info(result.message);
        return res.send(result);
    }

    if (password != repassword) {
        const result = new ApiResult(5);
        log.info(result.message);
        return res.send(result);
    }

    const md5 = crypto.createHash('md5'),
        passwd = md5.update(req.body.password).digest('hex');

    const newUser = new User({
        name,
        password: passwd
    });

    User.get(newUser.name, function (err, user) {
        if (user) {
            const result = new ApiResult(6);
            logger.info(result.message);
            return res.send(result);
        }

        newUser.save(function (err, user) {
            if (err) {
                req.session.error = err;
                var result = new ApiResult(7, error);
                logger.error(JSON.stringify(result));
                return res.send(result);
            }

            req.session.user = user;
            req.session.success = "注册成功！";
            res.send(new ApiResult(0));
        });

    });
});

module.exports = router;
