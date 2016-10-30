'use strict';

const loggger = require('../libs/ironmanLogger');


const skips = [

];

const noChecks = [
    /^\/users\/(login|register)\/$/,
];

const checks = [
    /^\/users\/.*/,
];

function checkAuth(req, res, next) {
    loggger.info('checkAuth');
    const path = req.baseUrl + req.path;

    if (req.method != 'GET') {
        loggger.info(`${path} method: ${req.method} `);
        return next();
    }


    for (let skip of skips) {
        if (path.match(skip)) { return next(); }
    }

    for (let noCheck of noChecks) {
        if (path.match(noCheck)) {
            loggger.info(`${path} match ${noCheck}`);
            if (req.session.user) {
                loggger.info(`${path}, have user`);
                req.session.error = '已登录';
                return res.redirect('/users/profile');
            }
            else {
                return next();
            }
        }
    }

    for (let check of checks) {
        if (path.match(check)) {
            loggger.info(`${path} match ${check}`);
            if (!req.session.user) {
                loggger.info(`${path}, no user`);
                req.session.error = '请登录';
                return res.redirect('/users/login');
            }
            else {
                next();
            }
        }
    }

    next();
}
module.exports.checkAuth = checkAuth;



























