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

router.get('/login', function (req, res) {
    var options = {
        title: 'IronMan Login'
    };

    res.render('users/login', options);
});

router.get('/register', function (req, res) {
    var options = {
        title: 'IronMan Register'
    };

    res.render('users/register', options);
});

router.get('/profile', function (req, res) {
    var options = {
        title: 'IronMan Profile',
        mail: req.session.user.mail
    };

    res.render('users/profile', options);
});

router.get("/logout", function (req, res) {
    req.session.user = null;
    res.redirect('/');
});


/* POST */
router.post("/login", function (req, res) {

    var mail = req.body.email,
        password = req.body.password,
        md5 = crypto.createHash('md5'),
        md5_password = md5.update(password).digest('hex');

    if (mail == "" || password == "") {
        const result = new ApiResult(1);
        logger.info(result.message);
        return res.send(result);
    }

    User.getByMail(mail)

        .then((user)=> {
            if (user.password != md5_password) {
                const result = new ApiResult(3);
                logger.info(result.message);
                return res.send(result);
            }

            req.session.user = user;
            req.session.success = "登录成功！";

            res.send(new ApiResult(0));
        })

        .catch((err) => {
            const result = new ApiResult(2, {message: JSON.stringify(err)});
            logger.info(JSON.stringify(result));
            return res.send(result);
        });
});

router.post("/register", function (req, res) {

    const mail = req.body.mail,
        password = req.body.password,
        repassword = req.body.repassword;

    if (mail == "" || password == "" || repassword == "") {
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
        mail,
        password: passwd
    });

    User.getByMail(mail)

        .then((user) => {
            const result = new ApiResult(6, {mail: user.mail});
            logger.info(JSON.stringify(result));
            res.send(result);
        })

        .catch(() => {

            newUser.save()
                .then(()=> {
                    req.session.user = newUser;
                    req.session.success = "注册成功！";
                    return res.send(new ApiResult(0));
                });
        });
});

module.exports = router;
