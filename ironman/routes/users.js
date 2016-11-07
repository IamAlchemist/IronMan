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

router.get('/logout', function (req, res) {
    req.session.user = null;
    res.redirect('/');
});

router.get('/link-user', (req, res)=>{
    const mail = req.session.user.mail;
    User.UserModel.findOne({mail}).exec()
        .then((user)=>{
            res.render('users/link-user', {'linkedUsers': user.linkedUsers});
        })
        .catch(()=>{
            res.render('users/link-user');
        });
});


/* POST */
router.post('/link-user', (req, res)=>{
    res.send(new ApiResult(0));
});

router.post("/login", function (req, res) {

    var mail = req.body.email.trim(),
        password = req.body.password.trim(),
        md5 = crypto.createHash('md5'),
        md5_password = md5.update(password).digest('hex');

    if (mail == "" || password == "") {
        const result = new ApiResult(1);
        logger.info(result.message);
        return res.send(result);
    }

    User.UserModel.findOne({mail}).exec()
        .then((user)=> {
            if (user.password != md5_password) {
                logger.warn(`passwd is not corrent: ${user.password} != ${md5_password}`);
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

    const mail = req.body.mail.trim(),
        password = req.body.password.trim(),
        repassword = req.body.repassword.trim(),
        isStudentOrParent = req.body.isStudentOrParent.trim();


    if (mail == "" || password == "" || repassword == ""
        || isStudentOrParent == ""
        || (isStudentOrParent != "student" && isStudentOrParent != "parent")) {
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

    const newUser = User.makeUser(mail, passwd, isStudentOrParent == "student");

    User.UserModel.findOne({mail}).exec()

        .then((user) => {
            const result = new ApiResult(6, {mail: user.mail});
            logger.info(JSON.stringify(result));
            res.send(result);
        })

        .catch(() => {

            newUser.save()
                .then((user)=> {
                    req.session.user = user;
                    req.session.success = "注册成功！";
                    return res.send(new ApiResult(0));
                })
                .catch((err)=> {
                    const result = new ApiResult(7, err);
                    logger.info(JSON.stringify(result));
                    return res.send(result);
                });
        });
});

module.exports = router;
