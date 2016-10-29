'use strict';

function checkAuthentication(req, res, next) {
    if (!req.session.user) {
        req.session.error = '请登录';
        return res.redirect('/users/login');
    }
    next();
}
module.exports.checkAuthentication = checkAuthentication;

function noCheckAuthentication(req, res, next) {
    if (req.session.user) {
        req.session.error = '已登录';
        return res.redirect('/users/profile');
    }
    next();
}
module.exports.noCheckAuthentication = noCheckAuthentication;

